/* A minimal NES (CPU + MMC1 + register-level PPU/APU capture) used OFFLINE to
   run the Dr. Mario ROM assembled byte-exact from the disassembly
   (reference/build/drmario.nes, md5 8181d696756578fc92e6c4c86da01904 = Rev A).
   It renders nothing; it records what the program writes:
     - VRAM / palette / OAM (to dump the real title, options and level screens)
     - APU register writes per frame (to record the real music and effects)
     - RAM (to compare the JavaScript port against the real game logic)
   Used by tools/extract.js and tools/rom-diff.js.  Not shipped. */
'use strict';
const fs = require('fs');
const path = require('path');
const { CPU6502 } = require('./cpu6502.js');

const ROOT = path.join(__dirname, '..');
const ROM_FILE = path.join(ROOT, 'reference', 'build', 'drmario.nes');
const LST_FILE = path.join(ROOT, 'reference', 'build', 'drmario.lst');

/* symbols from the asm6f listing: code labels and "name = $xx" defines */
function loadSymbols(file) {
  const sym = {};
  const txt = fs.readFileSync(file || LST_FILE, 'latin1');
  for (const line of txt.split(/\r?\n/)) {
    let m = line.match(/^0([0-9A-F]{4})\s+(?:[0-9A-F]{2}\s+)*\s*([A-Za-z_][A-Za-z0-9_]*):/);
    if (m && !(m[2] in sym)) { sym[m[2]] = parseInt(m[1], 16); continue; }
    m = line.match(/^\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\$([0-9A-Fa-f]+)\b/);
    if (m && !(m[1] in sym)) sym[m[1]] = parseInt(m[2], 16);
  }
  return sym;
}

function NES(romFile) {
  const rom = fs.readFileSync(romFile || ROM_FILE);
  const prgBanks = rom[4], chrBanks = rom[5];
  this.prg = rom.slice(16, 16 + prgBanks * 16384);
  this.chr = rom.slice(16 + prgBanks * 16384, 16 + prgBanks * 16384 + chrBanks * 8192);
  this.ram = new Uint8Array(0x800);
  this.vram = new Uint8Array(0x1000);   // $2000-$2FFF flat (the game only uses $2000/$2400)
  this.pal = new Uint8Array(32);
  this.oam = new Uint8Array(256);
  this.ppuctrl = 0; this.ppumask = 0; this.vblank = 0; this.addr = 0; this.latch = 0; this.buf = 0;
  this.mmcShift = 0x10; this.mmcCtrl = 0x0C; this.chr0 = 0; this.chr1 = 0;
  this.apuLog = []; this.apu = new Uint8Array(0x18);
  this.pad = [0, 0]; this.padShift = [0, 0]; this.strobe = 0;
  this.frame = 0;
  this.writeHook = null;
  const self = this;
  this.cpu = new CPU6502(a => self.read(a), (a, v) => self.write(a, v));
  this.cpu.reset();
}

NES.prototype.read = function (a) {
  if (a < 0x2000) return this.ram[a & 0x7FF];
  if (a < 0x4000) {
    switch (a & 7) {
      case 2: { const v = (this.vblank << 7) | 0x00; this.vblank = 0; this.latch = 0; return v; }
      case 4: return 0;
      case 7: { const v = this.buf; this.buf = this.vramRead(this.addr); this.addr = (this.addr + ((this.ppuctrl & 4) ? 32 : 1)) & 0x3FFF; return v; }
      default: return 0;
    }
  }
  if (a === 0x4016 || a === 0x4017) {
    const p = a - 0x4016;
    const v = this.padShift[p] & 1; this.padShift[p] = (this.padShift[p] >> 1) | 0x80;
    return v | 0x40;
  }
  if (a < 0x8000) return 0;
  return this.prg[(a - 0x8000) % this.prg.length];
};

NES.prototype.vramRead = function (a) {
  a &= 0x3FFF;
  if (a < 0x2000) return 0;
  if (a < 0x3F00) return this.vram[(a - 0x2000) & 0xFFF];
  return this.pal[a & 0x1F];
};

NES.prototype.write = function (a, v) {
  if (this.writeHook) this.writeHook(a, v);
  if (a < 0x2000) { this.ram[a & 0x7FF] = v; return; }
  if (a < 0x4000) {
    switch (a & 7) {
      case 0: this.ppuctrl = v; break;
      case 1: this.ppumask = v; break;
      case 3: break;
      case 4: break;
      case 5: this.latch ^= 1; break;
      case 6:
        if (!this.latch) this.addr = (this.addr & 0xFF) | ((v & 0x3F) << 8);
        else this.addr = (this.addr & 0xFF00) | v;
        this.latch ^= 1; break;
      case 7: {
        const ad = this.addr & 0x3FFF;
        if (ad >= 0x3F00) { let p = ad & 0x1F; if ((p & 3) === 0) p &= 0x0F; this.pal[p] = v; }
        else if (ad >= 0x2000) this.vram[(ad - 0x2000) & 0xFFF] = v;
        this.addr = (this.addr + ((this.ppuctrl & 4) ? 32 : 1)) & 0x3FFF;
        break;
      }
    }
    return;
  }
  if (a === 0x4014) { for (let i = 0; i < 256; i++) this.oam[i] = this.read((v << 8) | i); this.cpu.cycles += 513; return; }
  if (a === 0x4016) {
    if (this.strobe && !(v & 1)) { this.padShift[0] = this.pad[0]; this.padShift[1] = this.pad[1]; }
    this.strobe = v & 1; if (this.strobe) { this.padShift[0] = this.pad[0]; this.padShift[1] = this.pad[1]; }
    return;
  }
  if (a >= 0x4000 && a <= 0x4017) {
    this.apu[a - 0x4000] = v;
    this.apuLog.push([this.frame, a - 0x4000, v]);
    return;
  }
  if (a >= 0x8000) {   // MMC1
    if (v & 0x80) { this.mmcShift = 0x10; this.mmcCtrl |= 0x0C; return; }
    const done = this.mmcShift & 1;
    this.mmcShift = (this.mmcShift >> 1) | ((v & 1) << 4);
    if (done) {
      const r = this.mmcShift; this.mmcShift = 0x10;
      if (a < 0xA000) this.mmcCtrl = r;
      else if (a < 0xC000) this.chr0 = r;
      else if (a < 0xE000) this.chr1 = r;
    }
  }
};

/* pad bits as the NES reads them: A B Select Start Up Down Left Right (bit0 = A) */
NES.BTN = { a: 1, b: 2, select: 4, start: 8, up: 16, down: 32, left: 64, right: 128 };

NES.prototype.runFrame = function () {
  const cpu = this.cpu;
  const start = cpu.cycles;
  const vbl = start + 27280, end = start + 29781;
  while (cpu.cycles < vbl) cpu.step();
  this.vblank = 1;
  if (this.ppuctrl & 0x80) cpu.nmi();
  while (cpu.cycles < end) cpu.step();
  this.vblank = 0;
  this.frame++;
};

/* call a subroutine directly (used to drive the sound engine in isolation) */
NES.prototype.call = function (addr, maxSteps) {
  const cpu = this.cpu;
  const sentinel = 0xFFF0;
  const r = sentinel - 1;
  cpu.push(r >> 8); cpu.push(r & 0xFF);
  cpu.pc = addr;
  for (let i = 0; i < (maxSteps || 2000000); i++) {
    if (cpu.pc === sentinel) return true;
    cpu.step();
  }
  throw new Error('subroutine at $' + addr.toString(16) + ' did not return');
};

NES.prototype.chrTile = function (bank4k, tile) {
  const o = bank4k * 4096 + tile * 16;
  return this.chr.slice(o, o + 16);
};

module.exports = { NES, loadSymbols, ROM_FILE, LST_FILE };
