/* A small NES emulator (NROM only) used OFFLINE as a research instrument:
   it runs the real Excitebike ROM rebuilt from the disassembly so that the
   extraction tools can read the game's own screens, metasprites, track
   data, sound-register writes and physics traces.  It is not part of the
   game and is not embedded in index.html.

     const NES = require('./nes.js');
     const n = new NES(prg, chr, { vertical: true });
     n.reset(); n.frame(); n.pad = 0x80; ...
     n.fb  -> Uint8Array(256*240) of NES colour indices
*/
'use strict';

const NES_RGB = [
  0x666666, 0x002A88, 0x1412A7, 0x3B00A4, 0x5C007E, 0x6E0040, 0x6C0600, 0x561D00, 0x333500, 0x0B4800, 0x005200, 0x004F08, 0x00404D, 0x000000, 0x000000, 0x000000,
  0xADADAD, 0x155FD9, 0x4240FF, 0x7527FE, 0xA01ACC, 0xB71E7B, 0xB53120, 0x994E00, 0x6B6D00, 0x388700, 0x0C9300, 0x008F32, 0x007C8D, 0x000000, 0x000000, 0x000000,
  0xFFFEFF, 0x64B0FF, 0x9290FF, 0xC676FF, 0xF36AFF, 0xFE6ECC, 0xFE8170, 0xEA9E22, 0xBCBE00, 0x88D800, 0x5CE430, 0x45E082, 0x48CDDE, 0x4F4F4F, 0x000000, 0x000000,
  0xFFFEFF, 0xC0DFFF, 0xD3D2FF, 0xE8C8FF, 0xFBC2FF, 0xFEC4EA, 0xFECCC5, 0xF7D8A5, 0xE4E594, 0xCFEF96, 0xBDF4AB, 0xB3F3CC, 0xB5EBF2, 0xB8B8B8, 0x000000, 0x000000
];

class NES {
  constructor(prg, chr, opt) {
    opt = opt || {};
    this.prg = prg; this.chr = new Uint8Array(chr);
    this.vertical = opt.vertical !== false;
    this.ram = new Uint8Array(0x800);
    this.vram = new Uint8Array(0x800);
    this.pal = new Uint8Array(32);
    this.oam = new Uint8Array(256);
    this.fb = new Uint8Array(256 * 240);
    this.fbSpr = new Int16Array(256 * 240);       // sprite index that won each pixel (-1 none)
    this.pad = 0; this.pad2 = 0;
    this.apuLog = []; this.apuFrame = [];
    this.watchR = null; this.watchW = null; this.execHook = null;
    this.frameNo = 0;
    this.cycles = 0;
  }
  // ---------------- memory ----------------
  read(a) {
    a &= 0xFFFF;
    if (this.watchR) this.watchR(a);
    if (a < 0x2000) return this.ram[a & 0x7FF];
    if (a < 0x4000) return this.ppuRead(a & 7);
    if (a === 0x4016) { const v = (this.padLatch & 1); this.padLatch = (this.padLatch >> 1) | 0x80; return v | 0x40; }
    if (a === 0x4017) { const v = (this.pad2Latch & 1); this.pad2Latch = (this.pad2Latch >> 1) | 0x80; return v | 0x40; }
    if (a < 0x8000) return 0;
    return this.prg[a & 0x3FFF];
  }
  write(a, v) {
    a &= 0xFFFF; v &= 0xFF;
    if (this.watchW) this.watchW(a, v);
    if (a < 0x2000) { this.ram[a & 0x7FF] = v; return; }
    if (a < 0x4000) { this.ppuWrite(a & 7, v); return; }
    if (a === 0x4014) { for (let i = 0; i < 256; i++) this.oam[(this.oamAddr + i) & 255] = this.read((v << 8) | i); this.cycles += 513; return; }
    if (a === 0x4016) { if (v & 1) { this.padLatch = rev8(this.pad); this.pad2Latch = rev8(this.pad2); } this.strobe = v & 1; return; }
    if (a >= 0x4000 && a <= 0x4017) { this.apuFrame.push([a, v]); return; }
  }
  // ---------------- PPU ----------------
  ntIndex(a) {
    a &= 0xFFF;
    const table = a >> 10, off = a & 0x3FF;
    const phys = this.vertical ? (table & 1) : (table >> 1);
    return phys * 0x400 + off;
  }
  vread(a) {
    a &= 0x3FFF;
    if (a < 0x2000) return this.chr[a];
    if (a < 0x3F00) return this.vram[this.ntIndex(a)];
    let p = a & 0x1F; if ((p & 0x13) === 0x10) p &= 0x0F;
    return this.pal[p];
  }
  vwrite(a, v) {
    a &= 0x3FFF;
    if (a < 0x2000) { this.chr[a] = v; return; }
    if (a < 0x3F00) { this.vram[this.ntIndex(a)] = v; return; }
    let p = a & 0x1F; if ((p & 0x13) === 0x10) p &= 0x0F;
    this.pal[p] = v & 0x3F;
  }
  ppuRead(r) {
    if (r === 2) {
      const s = this.status; this.status &= 0x7F; this.w = 0; return s;
    }
    if (r === 4) return this.oam[this.oamAddr];
    if (r === 7) {
      const a = this.v & 0x3FFF; let res;
      if (a >= 0x3F00) { res = this.vread(a); this.readBuf = this.vread(a - 0x1000); }
      else { res = this.readBuf; this.readBuf = this.vread(a); }
      this.v = (this.v + ((this.ctrl & 4) ? 32 : 1)) & 0x7FFF;
      return res;
    }
    return 0;
  }
  ppuWrite(r, v) {
    switch (r) {
      case 0: {
        const wasNmi = this.ctrl & 0x80;
        this.ctrl = v; this.t = (this.t & 0xF3FF) | ((v & 3) << 10);
        if (!wasNmi && (v & 0x80) && (this.status & 0x80)) this.nmiPending = true;
        break;
      }
      case 1: this.mask = v; break;
      case 3: this.oamAddr = v; break;
      case 4: this.oam[this.oamAddr] = v; this.oamAddr = (this.oamAddr + 1) & 255; break;
      case 5:
        if (!this.w) { this.t = (this.t & 0xFFE0) | (v >> 3); this.fx = v & 7; this.w = 1; }
        else { this.t = (this.t & 0x8C1F) | ((v & 7) << 12) | ((v & 0xF8) << 2); this.w = 0; }
        break;
      case 6:
        if (!this.w) { this.t = (this.t & 0x00FF) | ((v & 0x3F) << 8); this.w = 1; }
        else { this.t = (this.t & 0xFF00) | v; this.v = this.t; this.w = 0; }
        break;
      case 7:
        this.vwrite(this.v, v);
        this.v = (this.v + ((this.ctrl & 4) ? 32 : 1)) & 0x7FFF;
        break;
    }
  }
  renderLine(y) {
    const showBg = this.mask & 8, showSpr = this.mask & 16;
    const line = new Uint8Array(256), opaque = new Uint8Array(256);
    const bd = this.pal[0];
    if (showBg) {
      let v = this.v, fx = this.fx;
      const fineY = (v >> 12) & 7;
      const base = (this.ctrl & 0x10) ? 0x1000 : 0;
      for (let x = 0; x < 256; x++) {
        const nt = 0x2000 | (v & 0x0FFF);
        const tileN = this.vread(nt);
        const at = this.vread(0x23C0 | (v & 0x0C00) | ((v >> 4) & 0x38) | ((v >> 2) & 7));
        const shift = ((v >> 4) & 4) | (v & 2);
        const palI = (at >> shift) & 3;
        const p0 = this.chr[base + tileN * 16 + fineY], p1 = this.chr[base + tileN * 16 + fineY + 8];
        const bit = 7 - fx;
        const c = ((p0 >> bit) & 1) | (((p1 >> bit) & 1) << 1);
        line[x] = c ? this.pal[palI * 4 + c] : bd;
        opaque[x] = c ? 1 : 0;
        if (!(this.mask & 2) && x < 8) { line[x] = bd; opaque[x] = 0; }
        fx++;
        if (fx === 8) { fx = 0; if ((v & 0x1F) === 31) { v &= ~0x1F; v ^= 0x400; } else v++; }
      }
    } else line.fill(bd);
    const sprWin = new Int16Array(256).fill(-1);
    if (showSpr) {
      const tall = this.ctrl & 0x20;
      const h = tall ? 16 : 8;
      for (let i = 63; i >= 0; i--) {          // draw back-to-front so lower index wins
        const sy = this.oam[i * 4] + 1;
        if (y < sy || y >= sy + h) continue;
        const tile = this.oam[i * 4 + 1], attr = this.oam[i * 4 + 2], sx = this.oam[i * 4 + 3];
        let row = y - sy; if (attr & 0x80) row = h - 1 - row;
        let addr;
        if (tall) { addr = ((tile & 1) << 12) | ((tile & 0xFE) << 4); if (row >= 8) { addr += 16; row -= 8; } }
        else addr = ((this.ctrl & 8) ? 0x1000 : 0) + tile * 16;
        const p0 = this.chr[addr + row], p1 = this.chr[addr + row + 8];
        for (let k = 0; k < 8; k++) {
          const x = sx + k; if (x > 255) break;
          const bit = (attr & 0x40) ? k : 7 - k;
          const c = ((p0 >> bit) & 1) | (((p1 >> bit) & 1) << 1);
          if (!c) continue;
          if (x < 8 && !(this.mask & 4)) continue;          // PPUMASK bit 2: sprites hidden in the left 8 pixels
          if (i === 0 && opaque[x] && x < 255 && !this.hit0 && showBg) { this.hit0 = true; this.hit0Dot = x; }
          if ((attr & 0x20) && opaque[x]) { sprWin[x] = -2 - i; continue; }   // behind bg
          line[x] = this.pal[16 + (attr & 3) * 4 + c]; sprWin[x] = i;
        }
      }
    }
    this.fb.set(line, y * 256);
    this.fbSpr.set(sprWin, y * 256);
  }
  incY() {
    let v = this.v;
    if ((v & 0x7000) !== 0x7000) v += 0x1000;
    else {
      v &= ~0x7000; let cy = (v & 0x03E0) >> 5;
      if (cy === 29) { cy = 0; v ^= 0x0800; } else if (cy === 31) cy = 0; else cy++;
      v = (v & ~0x03E0) | (cy << 5);
    }
    this.v = v;
  }
  // ---------------- CPU ----------------
  reset() {
    this.A = 0; this.X = 0; this.Y = 0; this.S = 0xFD; this.P = 0x24;
    this.ctrl = 0; this.mask = 0; this.status = 0xA0; this.oamAddr = 0; this.v = 0; this.t = 0; this.fx = 0; this.w = 0; this.readBuf = 0;
    this.nmiPending = false; this.padLatch = 0; this.pad2Latch = 0;
    this.PC = this.read(0xFFFC) | (this.read(0xFFFD) << 8);
  }
  push(v) { this.write(0x100 | this.S, v); this.S = (this.S - 1) & 0xFF; }
  pull() { this.S = (this.S + 1) & 0xFF; return this.read(0x100 | this.S); }
  nz(v) { this.P = (this.P & 0x7D) | (v & 0x80) | (v ? 0 : 2); return v; }
  nmi() { this.push(this.PC >> 8); this.push(this.PC & 0xFF); this.push((this.P | 0x20) & 0xEF); this.P |= 4; this.PC = this.read(0xFFFA) | (this.read(0xFFFB) << 8); this.cycles += 7; }
  step() {
    if (this.execHook) this.execHook(this.PC);
    const op = this.read(this.PC); const pc = this.PC; this.PC = (this.PC + 1) & 0xFFFF;
    const rd = () => { const v = this.read(this.PC); this.PC = (this.PC + 1) & 0xFFFF; return v; };
    const rw = () => { const lo = rd(); return lo | (rd() << 8); };
    let addr = 0, cyc = 2;
    const mode = MODE[op];
    switch (mode) {
      case 'imm': addr = this.PC; this.PC = (this.PC + 1) & 0xFFFF; cyc = 2; break;
      case 'zp': addr = rd(); cyc = 3; break;
      case 'zpx': addr = (rd() + this.X) & 0xFF; cyc = 4; break;
      case 'zpy': addr = (rd() + this.Y) & 0xFF; cyc = 4; break;
      case 'abs': addr = rw(); cyc = 4; break;
      case 'abx': { const b = rw(); addr = (b + this.X) & 0xFFFF; cyc = 4 + (((b & 0xFF) + this.X) > 255 ? 1 : 0); break; }
      case 'aby': { const b = rw(); addr = (b + this.Y) & 0xFFFF; cyc = 4 + (((b & 0xFF) + this.Y) > 255 ? 1 : 0); break; }
      case 'izx': { const z = (rd() + this.X) & 0xFF; addr = this.read(z) | (this.read((z + 1) & 0xFF) << 8); cyc = 6; break; }
      case 'izy': { const z = rd(); const b = this.read(z) | (this.read((z + 1) & 0xFF) << 8); addr = (b + this.Y) & 0xFFFF; cyc = 5 + (((b & 0xFF) + this.Y) > 255 ? 1 : 0); break; }
      case 'ind': { const p = rw(); addr = this.read(p) | (this.read((p & 0xFF00) | ((p + 1) & 0xFF)) << 8); cyc = 5; break; }
      case 'rel': { const o = rd(); addr = (this.PC + (o < 128 ? o : o - 256)) & 0xFFFF; cyc = 2; break; }
      default: cyc = 2;
    }
    const ins = INS[op];
    const P = this;
    const branch = (c) => { if (c) { cyc += 1 + ((addr & 0xFF00) !== (P.PC & 0xFF00) ? 1 : 0); P.PC = addr; } };
    const cmp = (r) => { const m = P.read(addr); const d = r - m; P.P = (P.P & 0x7C) | (r >= m ? 1 : 0) | (d & 0x80) | ((d & 0xFF) ? 0 : 2); };
    const adc = (m) => { const c = P.P & 1; const s = P.A + m + c; P.P = (P.P & 0x3C) | (s > 255 ? 1 : 0) | ((~(P.A ^ m) & (P.A ^ s) & 0x80) ? 0x40 : 0); P.A = s & 0xFF; P.nz(P.A); };
    const rmw = (f) => { if (mode === 'acc') P.A = f(P.A); else { const v = f(P.read(addr)); P.write(addr, v); cyc += 2; } };
    switch (ins) {
      case 'LDA': this.A = this.nz(this.read(addr)); break;
      case 'LDX': this.X = this.nz(this.read(addr)); break;
      case 'LDY': this.Y = this.nz(this.read(addr)); break;
      case 'STA': this.write(addr, this.A); if (mode === 'abx' || mode === 'aby' || mode === 'izy') cyc = mode === 'izy' ? 6 : 5; break;
      case 'STX': this.write(addr, this.X); break;
      case 'STY': this.write(addr, this.Y); break;
      case 'TAX': this.X = this.nz(this.A); break;
      case 'TAY': this.Y = this.nz(this.A); break;
      case 'TXA': this.A = this.nz(this.X); break;
      case 'TYA': this.A = this.nz(this.Y); break;
      case 'TSX': this.X = this.nz(this.S); break;
      case 'TXS': this.S = this.X; break;
      case 'PHA': this.push(this.A); cyc = 3; break;
      case 'PHP': this.push(this.P | 0x30); cyc = 3; break;
      case 'PLA': this.A = this.nz(this.pull()); cyc = 4; break;
      case 'PLP': this.P = (this.pull() & 0xEF) | 0x20; cyc = 4; break;
      case 'AND': this.A = this.nz(this.A & this.read(addr)); break;
      case 'ORA': this.A = this.nz(this.A | this.read(addr)); break;
      case 'EOR': this.A = this.nz(this.A ^ this.read(addr)); break;
      case 'BIT': { const m = this.read(addr); this.P = (this.P & 0x3D) | (m & 0xC0) | ((this.A & m) ? 0 : 2); break; }
      case 'ADC': adc(this.read(addr)); break;
      case 'SBC': adc(this.read(addr) ^ 0xFF); break;
      case 'CMP': cmp(this.A); break;
      case 'CPX': cmp(this.X); break;
      case 'CPY': cmp(this.Y); break;
      case 'INC': rmw(v => this.nz((v + 1) & 0xFF)); break;
      case 'DEC': rmw(v => this.nz((v - 1) & 0xFF)); break;
      case 'INX': this.X = this.nz((this.X + 1) & 0xFF); break;
      case 'INY': this.Y = this.nz((this.Y + 1) & 0xFF); break;
      case 'DEX': this.X = this.nz((this.X - 1) & 0xFF); break;
      case 'DEY': this.Y = this.nz((this.Y - 1) & 0xFF); break;
      case 'ASL': rmw(v => { this.P = (this.P & 0xFE) | (v >> 7); return this.nz((v << 1) & 0xFF); }); break;
      case 'LSR': rmw(v => { this.P = (this.P & 0xFE) | (v & 1); return this.nz(v >> 1); }); break;
      case 'ROL': rmw(v => { const c = this.P & 1; this.P = (this.P & 0xFE) | (v >> 7); return this.nz(((v << 1) | c) & 0xFF); }); break;
      case 'ROR': rmw(v => { const c = this.P & 1; this.P = (this.P & 0xFE) | (v & 1); return this.nz((v >> 1) | (c << 7)); }); break;
      case 'JMP': this.PC = addr; cyc = mode === 'ind' ? 5 : 3; break;
      case 'JSR': { const r = (this.PC - 1) & 0xFFFF; this.push(r >> 8); this.push(r & 0xFF); this.PC = addr; cyc = 6; break; }
      case 'RTS': { const lo = this.pull(); this.PC = (((this.pull() << 8) | lo) + 1) & 0xFFFF; cyc = 6; break; }
      case 'RTI': { this.P = (this.pull() & 0xEF) | 0x20; const lo = this.pull(); this.PC = (this.pull() << 8) | lo; cyc = 6; break; }
      case 'BRK': { this.PC = (this.PC + 1) & 0xFFFF; this.push(this.PC >> 8); this.push(this.PC & 0xFF); this.push(this.P | 0x30); this.P |= 4; this.PC = this.read(0xFFFE) | (this.read(0xFFFF) << 8); cyc = 7; break; }
      case 'BPL': branch(!(this.P & 0x80)); break;
      case 'BMI': branch(this.P & 0x80); break;
      case 'BVC': branch(!(this.P & 0x40)); break;
      case 'BVS': branch(this.P & 0x40); break;
      case 'BCC': branch(!(this.P & 1)); break;
      case 'BCS': branch(this.P & 1); break;
      case 'BNE': branch(!(this.P & 2)); break;
      case 'BEQ': branch(this.P & 2); break;
      case 'CLC': this.P &= 0xFE; break;
      case 'SEC': this.P |= 1; break;
      case 'CLI': this.P &= 0xFB; break;
      case 'SEI': this.P |= 4; break;
      case 'CLV': this.P &= 0xBF; break;
      case 'CLD': this.P &= 0xF7; break;
      case 'SED': this.P |= 8; break;
      case 'NOP': break;
      default: throw new Error('illegal opcode ' + op.toString(16) + ' at ' + pc.toString(16));
    }
    this.cycles += cyc;
    return cyc;
  }
  // ---------------- frame driver ----------------
  frame() {
    // 262 scanlines of 341 dots; CPU runs 1/3 the dot rate.
    const DOTS = 341;
    this.apuFrame = [];
    for (let line = 0; line < 262; line++) {
      let budget = DOTS;
      const rendering = (this.mask & 0x18) !== 0;
      if (line < 240) {
        if (rendering) this.renderLine(line);
        else { this.fb.fill(this.pal[0], line * 256, line * 256 + 256); this.fbSpr.fill(-1, line * 256, line * 256 + 256); }
        // sprite 0 hit becomes visible at the dot where it happens
        let hitDot = this.hit0 && !(this.status & 0x40) ? this.hit0Dot : -1;
        let dot = 0;
        while (dot < DOTS) {
          if (hitDot >= 0 && dot >= hitDot) { this.status |= 0x40; hitDot = -1; }
          const c = this.step(); dot += c * 3;
          if (dot >= 256 && dot - c * 3 < 256 && rendering) {
            // end of visible line: increment Y, copy horizontal bits
          }
        }
        if (hitDot >= 0) this.status |= 0x40;
        if (rendering) { this.incY(); this.v = (this.v & ~0x041F) | (this.t & 0x041F); }
        this.hit0 = false;
        continue;
      }
      if (line === 241) {
        this.status |= 0x80;
        if (this.ctrl & 0x80) this.nmiPending = true;
      }
      if (line === 261) {
        this.status &= 0x1F;
        if (this.mask & 0x18) this.v = (this.v & 0x041F) | (this.t & ~0x041F & 0x7FFF);
      }
      let dot = 0;
      while (dot < budget) {
        if (this.nmiPending) { this.nmiPending = false; this.nmi(); dot += 21; }
        dot += this.step() * 3;
      }
    }
    this.apuLog.push(this.apuFrame);
    this.frameNo++;
  }
  run(n, pad) { for (let i = 0; i < n; i++) { if (pad !== undefined) this.pad = pad; this.frame(); } }
  rgb() {           // RGB buffer of the current frame
    const out = Buffer.alloc(256 * 240 * 3);
    for (let i = 0; i < 256 * 240; i++) { const c = NES_RGB[this.fb[i] & 0x3F]; out[i * 3] = c >> 16; out[i * 3 + 1] = (c >> 8) & 255; out[i * 3 + 2] = c & 255; }
    return out;
  }
  snapshot() {
    const keys = ['A', 'X', 'Y', 'S', 'P', 'PC', 'ctrl', 'mask', 'status', 'oamAddr', 'v', 't', 'fx', 'w', 'readBuf', 'nmiPending', 'frameNo', 'cycles'];
    const s = {}; for (const k of keys) s[k] = this[k];
    s.ram = this.ram.slice(); s.vram = this.vram.slice(); s.pal = this.pal.slice(); s.oam = this.oam.slice();
    return s;
  }
  restore(s) {
    for (const k in s) if (!(s[k] instanceof Uint8Array)) this[k] = s[k];
    this.ram.set(s.ram); this.vram.set(s.vram); this.pal.set(s.pal); this.oam.set(s.oam);
  }
}

function rev8(b) { let r = 0; for (let i = 0; i < 8; i++) if (b & (1 << i)) r |= 0x80 >> i; return r; }
// ---- opcode tables (official opcodes only) ----
const MODE = new Array(256).fill('imp');
const INS = new Array(256).fill('???');
function def(list) {
  for (const [ins, pairs] of list) for (const [m, op] of pairs) { INS[op] = ins; MODE[op] = m; }
}
def([
  ['ADC', [['imm', 0x69], ['zp', 0x65], ['zpx', 0x75], ['abs', 0x6D], ['abx', 0x7D], ['aby', 0x79], ['izx', 0x61], ['izy', 0x71]]],
  ['AND', [['imm', 0x29], ['zp', 0x25], ['zpx', 0x35], ['abs', 0x2D], ['abx', 0x3D], ['aby', 0x39], ['izx', 0x21], ['izy', 0x31]]],
  ['ASL', [['acc', 0x0A], ['zp', 0x06], ['zpx', 0x16], ['abs', 0x0E], ['abx', 0x1E]]],
  ['BCC', [['rel', 0x90]]], ['BCS', [['rel', 0xB0]]], ['BEQ', [['rel', 0xF0]]], ['BMI', [['rel', 0x30]]],
  ['BNE', [['rel', 0xD0]]], ['BPL', [['rel', 0x10]]], ['BVC', [['rel', 0x50]]], ['BVS', [['rel', 0x70]]],
  ['BIT', [['zp', 0x24], ['abs', 0x2C]]],
  ['BRK', [['imp', 0x00]]], ['CLC', [['imp', 0x18]]], ['CLD', [['imp', 0xD8]]], ['CLI', [['imp', 0x58]]], ['CLV', [['imp', 0xB8]]],
  ['CMP', [['imm', 0xC9], ['zp', 0xC5], ['zpx', 0xD5], ['abs', 0xCD], ['abx', 0xDD], ['aby', 0xD9], ['izx', 0xC1], ['izy', 0xD1]]],
  ['CPX', [['imm', 0xE0], ['zp', 0xE4], ['abs', 0xEC]]], ['CPY', [['imm', 0xC0], ['zp', 0xC4], ['abs', 0xCC]]],
  ['DEC', [['zp', 0xC6], ['zpx', 0xD6], ['abs', 0xCE], ['abx', 0xDE]]], ['DEX', [['imp', 0xCA]]], ['DEY', [['imp', 0x88]]],
  ['EOR', [['imm', 0x49], ['zp', 0x45], ['zpx', 0x55], ['abs', 0x4D], ['abx', 0x5D], ['aby', 0x59], ['izx', 0x41], ['izy', 0x51]]],
  ['INC', [['zp', 0xE6], ['zpx', 0xF6], ['abs', 0xEE], ['abx', 0xFE]]], ['INX', [['imp', 0xE8]]], ['INY', [['imp', 0xC8]]],
  ['JMP', [['abs', 0x4C], ['ind', 0x6C]]], ['JSR', [['abs', 0x20]]],
  ['LDA', [['imm', 0xA9], ['zp', 0xA5], ['zpx', 0xB5], ['abs', 0xAD], ['abx', 0xBD], ['aby', 0xB9], ['izx', 0xA1], ['izy', 0xB1]]],
  ['LDX', [['imm', 0xA2], ['zp', 0xA6], ['zpy', 0xB6], ['abs', 0xAE], ['aby', 0xBE]]],
  ['LDY', [['imm', 0xA0], ['zp', 0xA4], ['zpx', 0xB4], ['abs', 0xAC], ['abx', 0xBC]]],
  ['LSR', [['acc', 0x4A], ['zp', 0x46], ['zpx', 0x56], ['abs', 0x4E], ['abx', 0x5E]]],
  ['NOP', [['imp', 0xEA]]],
  ['ORA', [['imm', 0x09], ['zp', 0x05], ['zpx', 0x15], ['abs', 0x0D], ['abx', 0x1D], ['aby', 0x19], ['izx', 0x01], ['izy', 0x11]]],
  ['PHA', [['imp', 0x48]]], ['PHP', [['imp', 0x08]]], ['PLA', [['imp', 0x68]]], ['PLP', [['imp', 0x28]]],
  ['ROL', [['acc', 0x2A], ['zp', 0x26], ['zpx', 0x36], ['abs', 0x2E], ['abx', 0x3E]]],
  ['ROR', [['acc', 0x6A], ['zp', 0x66], ['zpx', 0x76], ['abs', 0x6E], ['abx', 0x7E]]],
  ['RTI', [['imp', 0x40]]], ['RTS', [['imp', 0x60]]],
  ['SBC', [['imm', 0xE9], ['zp', 0xE5], ['zpx', 0xF5], ['abs', 0xED], ['abx', 0xFD], ['aby', 0xF9], ['izx', 0xE1], ['izy', 0xF1]]],
  ['SEC', [['imp', 0x38]]], ['SED', [['imp', 0xF8]]], ['SEI', [['imp', 0x78]]],
  ['STA', [['zp', 0x85], ['zpx', 0x95], ['abs', 0x8D], ['abx', 0x9D], ['aby', 0x99], ['izx', 0x81], ['izy', 0x91]]],
  ['STX', [['zp', 0x86], ['zpy', 0x96], ['abs', 0x8E]]], ['STY', [['zp', 0x84], ['zpx', 0x94], ['abs', 0x8C]]],
  ['TAX', [['imp', 0xAA]]], ['TAY', [['imp', 0xA8]]], ['TSX', [['imp', 0xBA]]], ['TXA', [['imp', 0x8A]]], ['TXS', [['imp', 0x9A]]], ['TYA', [['imp', 0x98]]]
]);
NES.MODE = MODE; NES.INS = INS; NES.RGB = NES_RGB;
NES.BTN = { A: 0x80, B: 0x40, SELECT: 0x20, START: 0x10, UP: 0x08, DOWN: 0x04, LEFT: 0x02, RIGHT: 0x01 };
module.exports = NES;
