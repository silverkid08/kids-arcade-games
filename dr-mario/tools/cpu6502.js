/* A small, complete (official opcodes) MOS 6502 core used OFFLINE only:
   tools/nes.js runs the Dr. Mario ROM (assembled from the disassembly in
   reference/disasm) so that the sound engine can be recorded and so that the
   JavaScript game logic can be compared against the real program.
   Nothing here ships in index.html. */
'use strict';

function CPU6502(read, write) {
  this.read = read; this.write = write;
  this.a = 0; this.x = 0; this.y = 0; this.s = 0xFD; this.pc = 0;
  this.c = 0; this.z = 0; this.i = 1; this.d = 0; this.v = 0; this.n = 0;
  this.cycles = 0;
}

const P = CPU6502.prototype;

P.getP = function () {
  return (this.n << 7) | (this.v << 6) | 0x20 | (this.d << 3) | (this.i << 2) | (this.z << 1) | this.c;
};
P.setP = function (p) {
  this.n = (p >> 7) & 1; this.v = (p >> 6) & 1; this.d = (p >> 3) & 1;
  this.i = (p >> 2) & 1; this.z = (p >> 1) & 1; this.c = p & 1;
};
P.push = function (v) { this.write(0x100 | this.s, v & 0xFF); this.s = (this.s - 1) & 0xFF; };
P.pull = function () { this.s = (this.s + 1) & 0xFF; return this.read(0x100 | this.s); };
P.rd16 = function (a) { return this.read(a) | (this.read((a + 1) & 0xFFFF) << 8); };
P.rd16zp = function (a) { return this.read(a & 0xFF) | (this.read((a + 1) & 0xFF) << 8); };
P.nz = function (v) { this.z = v === 0 ? 1 : 0; this.n = (v >> 7) & 1; return v; };
P.reset = function () { this.pc = this.rd16(0xFFFC); this.s = 0xFD; this.i = 1; };
P.nmi = function () {
  this.push(this.pc >> 8); this.push(this.pc & 0xFF); this.push(this.getP() & ~0x10);
  this.i = 1; this.pc = this.rd16(0xFFFA); this.cycles += 7;
};

// addressing modes -> effective address
P.imm = function () { return this.pc++ & 0xFFFF; };
P.zp = function () { return this.read(this.pc++); };
P.zpx = function () { return (this.read(this.pc++) + this.x) & 0xFF; };
P.zpy = function () { return (this.read(this.pc++) + this.y) & 0xFF; };
P.abs = function () { const a = this.rd16(this.pc); this.pc += 2; return a; };
P.abx = function () { const b = this.rd16(this.pc); this.pc += 2; const a = (b + this.x) & 0xFFFF; if ((a ^ b) & 0x100) this.cycles++; return a; };
P.aby = function () { const b = this.rd16(this.pc); this.pc += 2; const a = (b + this.y) & 0xFFFF; if ((a ^ b) & 0x100) this.cycles++; return a; };
P.izx = function () { return this.rd16zp((this.read(this.pc++) + this.x) & 0xFF); };
P.izy = function () { const b = this.rd16zp(this.read(this.pc++)); const a = (b + this.y) & 0xFFFF; if ((a ^ b) & 0x100) this.cycles++; return a; };

P.adc = function (m) {
  const r = this.a + m + this.c;
  this.v = (~(this.a ^ m) & (this.a ^ r) & 0x80) ? 1 : 0;
  this.c = r > 0xFF ? 1 : 0;
  this.a = this.nz(r & 0xFF);
};
P.cmp = function (r, m) { const t = r - m; this.c = t >= 0 ? 1 : 0; this.nz(t & 0xFF); };
P.branch = function (cond) {
  const off = this.read(this.pc++);
  if (cond) {
    const old = this.pc;
    this.pc = (this.pc + (off < 0x80 ? off : off - 256)) & 0xFFFF;
    this.cycles += ((old ^ this.pc) & 0x100) ? 2 : 1;
  }
};
P.rmw = function (a, f) { const v = f.call(this, this.read(a)); this.write(a, v); };
P.asl = function (v) { this.c = (v >> 7) & 1; return this.nz((v << 1) & 0xFF); };
P.lsr = function (v) { this.c = v & 1; return this.nz(v >> 1); };
P.rol = function (v) { const c = this.c; this.c = (v >> 7) & 1; return this.nz(((v << 1) | c) & 0xFF); };
P.ror = function (v) { const c = this.c; this.c = v & 1; return this.nz((v >> 1) | (c << 7)); };
P.inc = function (v) { return this.nz((v + 1) & 0xFF); };
P.dec = function (v) { return this.nz((v - 1) & 0xFF); };

const CYC = [
  7,6,2,8,3,3,5,5,3,2,2,2,4,4,6,6, 2,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,
  6,6,2,8,3,3,5,5,4,2,2,2,4,4,6,6, 2,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,
  6,6,2,8,3,3,5,5,3,2,2,2,3,4,6,6, 2,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,
  6,6,2,8,3,3,5,5,4,2,2,2,5,4,6,6, 2,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,
  2,6,2,6,3,3,3,3,2,2,2,2,4,4,4,4, 2,6,2,6,4,4,4,4,2,5,2,5,5,5,5,5,
  2,6,2,6,3,3,3,3,2,2,2,2,4,4,4,4, 2,5,2,5,4,4,4,4,2,4,2,4,4,4,4,4,
  2,6,2,8,3,3,5,5,2,2,2,2,4,4,6,6, 2,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7,
  2,6,2,8,3,3,5,5,2,2,2,2,4,4,6,6, 2,5,2,8,4,4,6,6,2,4,2,7,4,4,7,7];

P.step = function () {
  const op = this.read(this.pc);
  this.pc = (this.pc + 1) & 0xFFFF;
  this.cycles += CYC[op];
  let a;
  switch (op) {
    // loads / stores
    case 0xA9: this.a = this.nz(this.read(this.imm())); break;
    case 0xA5: this.a = this.nz(this.read(this.zp())); break;
    case 0xB5: this.a = this.nz(this.read(this.zpx())); break;
    case 0xAD: this.a = this.nz(this.read(this.abs())); break;
    case 0xBD: this.a = this.nz(this.read(this.abx())); break;
    case 0xB9: this.a = this.nz(this.read(this.aby())); break;
    case 0xA1: this.a = this.nz(this.read(this.izx())); break;
    case 0xB1: this.a = this.nz(this.read(this.izy())); break;
    case 0xA2: this.x = this.nz(this.read(this.imm())); break;
    case 0xA6: this.x = this.nz(this.read(this.zp())); break;
    case 0xB6: this.x = this.nz(this.read(this.zpy())); break;
    case 0xAE: this.x = this.nz(this.read(this.abs())); break;
    case 0xBE: this.x = this.nz(this.read(this.aby())); break;
    case 0xA0: this.y = this.nz(this.read(this.imm())); break;
    case 0xA4: this.y = this.nz(this.read(this.zp())); break;
    case 0xB4: this.y = this.nz(this.read(this.zpx())); break;
    case 0xAC: this.y = this.nz(this.read(this.abs())); break;
    case 0xBC: this.y = this.nz(this.read(this.abx())); break;
    case 0x85: this.write(this.zp(), this.a); break;
    case 0x95: this.write(this.zpx(), this.a); break;
    case 0x8D: this.write(this.abs(), this.a); break;
    case 0x9D: { const b = this.rd16(this.pc); this.pc += 2; this.write((b + this.x) & 0xFFFF, this.a); break; }
    case 0x99: { const b = this.rd16(this.pc); this.pc += 2; this.write((b + this.y) & 0xFFFF, this.a); break; }
    case 0x81: this.write(this.izx(), this.a); break;
    case 0x91: { const b = this.rd16zp(this.read(this.pc++)); this.write((b + this.y) & 0xFFFF, this.a); break; }
    case 0x86: this.write(this.zp(), this.x); break;
    case 0x96: this.write(this.zpy(), this.x); break;
    case 0x8E: this.write(this.abs(), this.x); break;
    case 0x84: this.write(this.zp(), this.y); break;
    case 0x94: this.write(this.zpx(), this.y); break;
    case 0x8C: this.write(this.abs(), this.y); break;
    // transfers
    case 0xAA: this.x = this.nz(this.a); break;
    case 0xA8: this.y = this.nz(this.a); break;
    case 0x8A: this.a = this.nz(this.x); break;
    case 0x98: this.a = this.nz(this.y); break;
    case 0xBA: this.x = this.nz(this.s); break;
    case 0x9A: this.s = this.x; break;
    // stack
    case 0x48: this.push(this.a); break;
    case 0x68: this.a = this.nz(this.pull()); break;
    case 0x08: this.push(this.getP() | 0x10); break;
    case 0x28: this.setP(this.pull()); break;
    // logic / arithmetic
    case 0x29: this.a = this.nz(this.a & this.read(this.imm())); break;
    case 0x25: this.a = this.nz(this.a & this.read(this.zp())); break;
    case 0x35: this.a = this.nz(this.a & this.read(this.zpx())); break;
    case 0x2D: this.a = this.nz(this.a & this.read(this.abs())); break;
    case 0x3D: this.a = this.nz(this.a & this.read(this.abx())); break;
    case 0x39: this.a = this.nz(this.a & this.read(this.aby())); break;
    case 0x21: this.a = this.nz(this.a & this.read(this.izx())); break;
    case 0x31: this.a = this.nz(this.a & this.read(this.izy())); break;
    case 0x09: this.a = this.nz(this.a | this.read(this.imm())); break;
    case 0x05: this.a = this.nz(this.a | this.read(this.zp())); break;
    case 0x15: this.a = this.nz(this.a | this.read(this.zpx())); break;
    case 0x0D: this.a = this.nz(this.a | this.read(this.abs())); break;
    case 0x1D: this.a = this.nz(this.a | this.read(this.abx())); break;
    case 0x19: this.a = this.nz(this.a | this.read(this.aby())); break;
    case 0x01: this.a = this.nz(this.a | this.read(this.izx())); break;
    case 0x11: this.a = this.nz(this.a | this.read(this.izy())); break;
    case 0x49: this.a = this.nz(this.a ^ this.read(this.imm())); break;
    case 0x45: this.a = this.nz(this.a ^ this.read(this.zp())); break;
    case 0x55: this.a = this.nz(this.a ^ this.read(this.zpx())); break;
    case 0x4D: this.a = this.nz(this.a ^ this.read(this.abs())); break;
    case 0x5D: this.a = this.nz(this.a ^ this.read(this.abx())); break;
    case 0x59: this.a = this.nz(this.a ^ this.read(this.aby())); break;
    case 0x41: this.a = this.nz(this.a ^ this.read(this.izx())); break;
    case 0x51: this.a = this.nz(this.a ^ this.read(this.izy())); break;
    case 0x69: this.adc(this.read(this.imm())); break;
    case 0x65: this.adc(this.read(this.zp())); break;
    case 0x75: this.adc(this.read(this.zpx())); break;
    case 0x6D: this.adc(this.read(this.abs())); break;
    case 0x7D: this.adc(this.read(this.abx())); break;
    case 0x79: this.adc(this.read(this.aby())); break;
    case 0x61: this.adc(this.read(this.izx())); break;
    case 0x71: this.adc(this.read(this.izy())); break;
    case 0xE9: this.adc(this.read(this.imm()) ^ 0xFF); break;
    case 0xE5: this.adc(this.read(this.zp()) ^ 0xFF); break;
    case 0xF5: this.adc(this.read(this.zpx()) ^ 0xFF); break;
    case 0xED: this.adc(this.read(this.abs()) ^ 0xFF); break;
    case 0xFD: this.adc(this.read(this.abx()) ^ 0xFF); break;
    case 0xF9: this.adc(this.read(this.aby()) ^ 0xFF); break;
    case 0xE1: this.adc(this.read(this.izx()) ^ 0xFF); break;
    case 0xF1: this.adc(this.read(this.izy()) ^ 0xFF); break;
    case 0xC9: this.cmp(this.a, this.read(this.imm())); break;
    case 0xC5: this.cmp(this.a, this.read(this.zp())); break;
    case 0xD5: this.cmp(this.a, this.read(this.zpx())); break;
    case 0xCD: this.cmp(this.a, this.read(this.abs())); break;
    case 0xDD: this.cmp(this.a, this.read(this.abx())); break;
    case 0xD9: this.cmp(this.a, this.read(this.aby())); break;
    case 0xC1: this.cmp(this.a, this.read(this.izx())); break;
    case 0xD1: this.cmp(this.a, this.read(this.izy())); break;
    case 0xE0: this.cmp(this.x, this.read(this.imm())); break;
    case 0xE4: this.cmp(this.x, this.read(this.zp())); break;
    case 0xEC: this.cmp(this.x, this.read(this.abs())); break;
    case 0xC0: this.cmp(this.y, this.read(this.imm())); break;
    case 0xC4: this.cmp(this.y, this.read(this.zp())); break;
    case 0xCC: this.cmp(this.y, this.read(this.abs())); break;
    case 0x24: a = this.read(this.zp()); this.z = (this.a & a) ? 0 : 1; this.n = (a >> 7) & 1; this.v = (a >> 6) & 1; break;
    case 0x2C: a = this.read(this.abs()); this.z = (this.a & a) ? 0 : 1; this.n = (a >> 7) & 1; this.v = (a >> 6) & 1; break;
    // inc / dec
    case 0xE6: this.rmw(this.zp(), this.inc); break;
    case 0xF6: this.rmw(this.zpx(), this.inc); break;
    case 0xEE: this.rmw(this.abs(), this.inc); break;
    case 0xFE: { const b = this.rd16(this.pc); this.pc += 2; this.rmw((b + this.x) & 0xFFFF, this.inc); break; }
    case 0xC6: this.rmw(this.zp(), this.dec); break;
    case 0xD6: this.rmw(this.zpx(), this.dec); break;
    case 0xCE: this.rmw(this.abs(), this.dec); break;
    case 0xDE: { const b = this.rd16(this.pc); this.pc += 2; this.rmw((b + this.x) & 0xFFFF, this.dec); break; }
    case 0xE8: this.x = this.nz((this.x + 1) & 0xFF); break;
    case 0xCA: this.x = this.nz((this.x - 1) & 0xFF); break;
    case 0xC8: this.y = this.nz((this.y + 1) & 0xFF); break;
    case 0x88: this.y = this.nz((this.y - 1) & 0xFF); break;
    // shifts
    case 0x0A: this.a = this.asl(this.a); break;
    case 0x06: this.rmw(this.zp(), this.asl); break;
    case 0x16: this.rmw(this.zpx(), this.asl); break;
    case 0x0E: this.rmw(this.abs(), this.asl); break;
    case 0x1E: { const b = this.rd16(this.pc); this.pc += 2; this.rmw((b + this.x) & 0xFFFF, this.asl); break; }
    case 0x4A: this.a = this.lsr(this.a); break;
    case 0x46: this.rmw(this.zp(), this.lsr); break;
    case 0x56: this.rmw(this.zpx(), this.lsr); break;
    case 0x4E: this.rmw(this.abs(), this.lsr); break;
    case 0x5E: { const b = this.rd16(this.pc); this.pc += 2; this.rmw((b + this.x) & 0xFFFF, this.lsr); break; }
    case 0x2A: this.a = this.rol(this.a); break;
    case 0x26: this.rmw(this.zp(), this.rol); break;
    case 0x36: this.rmw(this.zpx(), this.rol); break;
    case 0x2E: this.rmw(this.abs(), this.rol); break;
    case 0x3E: { const b = this.rd16(this.pc); this.pc += 2; this.rmw((b + this.x) & 0xFFFF, this.rol); break; }
    case 0x6A: this.a = this.ror(this.a); break;
    case 0x66: this.rmw(this.zp(), this.ror); break;
    case 0x76: this.rmw(this.zpx(), this.ror); break;
    case 0x6E: this.rmw(this.abs(), this.ror); break;
    case 0x7E: { const b = this.rd16(this.pc); this.pc += 2; this.rmw((b + this.x) & 0xFFFF, this.ror); break; }
    // jumps
    case 0x4C: this.pc = this.abs(); break;
    case 0x6C: { const p = this.abs(); this.pc = this.read(p) | (this.read((p & 0xFF00) | ((p + 1) & 0xFF)) << 8); break; }
    case 0x20: { const t = this.abs(); const r = (this.pc - 1) & 0xFFFF; this.push(r >> 8); this.push(r & 0xFF); this.pc = t; break; }
    case 0x60: { const lo = this.pull(), hi = this.pull(); this.pc = (((hi << 8) | lo) + 1) & 0xFFFF; break; }
    case 0x40: { this.setP(this.pull()); const lo = this.pull(), hi = this.pull(); this.pc = (hi << 8) | lo; break; }
    case 0x00: { this.pc = (this.pc + 1) & 0xFFFF; this.push(this.pc >> 8); this.push(this.pc & 0xFF); this.push(this.getP() | 0x10); this.i = 1; this.pc = this.rd16(0xFFFE); break; }
    // branches
    case 0x10: this.branch(!this.n); break;
    case 0x30: this.branch(this.n); break;
    case 0x50: this.branch(!this.v); break;
    case 0x70: this.branch(this.v); break;
    case 0x90: this.branch(!this.c); break;
    case 0xB0: this.branch(this.c); break;
    case 0xD0: this.branch(!this.z); break;
    case 0xF0: this.branch(this.z); break;
    // flags
    case 0x18: this.c = 0; break;
    case 0x38: this.c = 1; break;
    case 0x58: this.i = 0; break;
    case 0x78: this.i = 1; break;
    case 0xB8: this.v = 0; break;
    case 0xD8: this.d = 0; break;
    case 0xF8: this.d = 1; break;
    case 0xEA: break;
    default:
      throw new Error('illegal opcode $' + op.toString(16) + ' at $' + ((this.pc - 1) & 0xFFFF).toString(16));
  }
};

module.exports = { CPU6502 };
