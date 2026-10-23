/* A minimal NES (6502 + NROM + register-level PPU/APU capture) used OFFLINE
   to run the Pinball ROM rebuilt byte-exact from the disassembly
   (tools/rom.js).  It draws nothing itself; it records what the program
   writes, so the tools can:
     - dump the real nametables, palettes and OAM (title, both table screens,
       the bonus stage, every animated object and flipper pose),
     - log APU register writes per frame (the real music and effects),
     - read RAM (ball position / velocity) to measure the real physics.
   Adapted from ../dr-mario/tools/nes.js (MMC1 removed, NROM with horizontal
   mirroring as Pinball's iNES header says).  Not shipped. */
'use strict';
const { CPU6502 } = require('./cpu6502.js');
const ROM = require('./rom.js');

function NES() {
  const r = ROM.load();
  if (!r.ok) throw new Error('ROM rebuild CRC mismatch');
  this.prg = r.prg; this.chr = r.chr; this.labels = r.labels;
  this.ram = new Uint8Array(0x800);
  this.vram = new Uint8Array(0x1000);   // $2000 and $2800 (horizontal mirroring: $2400=$2000, $2C00=$2800)
  this.pal = new Uint8Array(32);
  this.oam = new Uint8Array(256);
  this.ppuctrl = 0; this.ppumask = 0; this.vblank = 0; this.addr = 0; this.latch = 0; this.buf = 0;
  this.scrollX = 0; this.scrollY = 0;
  this.apuLog = []; this.apu = new Uint8Array(0x18);
  this.pad = [0, 0]; this.padShift = [0, 0]; this.strobe = 0;
  this.frame = 0;
  this.writeHook = null;
  const self = this;
  this.cpu = new CPU6502(a => self.read(a), (a, v) => self.write(a, v));
  this.cpu.reset();
}

function mirror(a) {          // $2000-$2FFF -> 0..0xFFF in our 4 KB, horizontal mirroring
  a = (a - 0x2000) & 0xFFF;
  return (a & 0x800) | (a & 0x3FF);
}

NES.prototype.read = function (a) {
  if (a < 0x2000) return this.ram[a & 0x7FF];
  if (a < 0x4000) {
    switch (a & 7) {
      case 2: { const v = (this.vblank << 7); this.vblank = 0; this.latch = 0; return v; }
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
  return this.prg[(a - 0x8000) & 0x3FFF];
};

NES.prototype.vramRead = function (a) {
  a &= 0x3FFF;
  if (a < 0x2000) return this.chr[a];
  if (a < 0x3F00) return this.vram[mirror(a)];
  return this.pal[a & 0x1F];
};

NES.prototype.write = function (a, v) {
  if (this.writeHook) this.writeHook(a, v);
  if (a < 0x2000) { this.ram[a & 0x7FF] = v; return; }
  if (a < 0x4000) {
    switch (a & 7) {
      case 0: this.ppuctrl = v; break;
      case 1: this.ppumask = v; break;
      case 5: if (!this.latch) this.scrollX = v; else this.scrollY = v; this.latch ^= 1; break;
      case 6:
        if (!this.latch) this.addr = (this.addr & 0xFF) | ((v & 0x3F) << 8);
        else this.addr = (this.addr & 0xFF00) | v;
        this.latch ^= 1; break;
      case 7: {
        const ad = this.addr & 0x3FFF;
        if (ad >= 0x3F00) { let p = ad & 0x1F; if ((p & 3) === 0) p &= 0x0F; this.pal[p] = v; }
        else if (ad >= 0x2000) this.vram[mirror(ad)] = v;
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
  }
};

/* pad bits as the NES shifts them out: A B Select Start Up Down Left Right (bit0 = A) */
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
NES.prototype.run = function (n, pad) { for (let i = 0; i < n; i++) { if (pad !== undefined) this.pad[0] = pad; this.runFrame(); } };

module.exports = { NES };
