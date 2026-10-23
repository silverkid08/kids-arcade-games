/* A small ca65-subset 6502 assembler, just enough for the Tetris disassembly in
   reference/disasm (CelestialAmber/TetrisNESDisasm).  It builds the 32 KB PRG
   exactly as ld65 would with tetris.nes.cfg, and (with the CHR re-encoded from the
   tileset PNGs) the whole .nes, whose MD5 must equal the known good dump
   ec58574d96bee8c8927884ae6e7a2508 "Tetris (U) [!]".

     node tools/asm.js            -> assembles, prints the md5 check
   require('./asm.js').assemble() -> { prg: Buffer(32768), sym: {name: value}, nes }
*/
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..', 'reference', 'disasm');

// mode order: imp acc imm zp zpx zpy abs abx aby ind izx izy rel
const MODES = ['imp', 'acc', 'imm', 'zp', 'zpx', 'zpy', 'abs', 'abx', 'aby', 'ind', 'izx', 'izy', 'rel'];
const OPS = {
  adc: { imm: 0x69, zp: 0x65, zpx: 0x75, abs: 0x6D, abx: 0x7D, aby: 0x79, izx: 0x61, izy: 0x71 },
  and: { imm: 0x29, zp: 0x25, zpx: 0x35, abs: 0x2D, abx: 0x3D, aby: 0x39, izx: 0x21, izy: 0x31 },
  asl: { acc: 0x0A, zp: 0x06, zpx: 0x16, abs: 0x0E, abx: 0x1E },
  bcc: { rel: 0x90 }, bcs: { rel: 0xB0 }, beq: { rel: 0xF0 }, bmi: { rel: 0x30 },
  bne: { rel: 0xD0 }, bpl: { rel: 0x10 }, bvc: { rel: 0x50 }, bvs: { rel: 0x70 },
  bit: { zp: 0x24, abs: 0x2C }, brk: { imp: 0x00 },
  clc: { imp: 0x18 }, cld: { imp: 0xD8 }, cli: { imp: 0x58 }, clv: { imp: 0xB8 },
  cmp: { imm: 0xC9, zp: 0xC5, zpx: 0xD5, abs: 0xCD, abx: 0xDD, aby: 0xD9, izx: 0xC1, izy: 0xD1 },
  cpx: { imm: 0xE0, zp: 0xE4, abs: 0xEC }, cpy: { imm: 0xC0, zp: 0xC4, abs: 0xCC },
  dec: { zp: 0xC6, zpx: 0xD6, abs: 0xCE, abx: 0xDE }, dex: { imp: 0xCA }, dey: { imp: 0x88 },
  eor: { imm: 0x49, zp: 0x45, zpx: 0x55, abs: 0x4D, abx: 0x5D, aby: 0x59, izx: 0x41, izy: 0x51 },
  inc: { zp: 0xE6, zpx: 0xF6, abs: 0xEE, abx: 0xFE }, inx: { imp: 0xE8 }, iny: { imp: 0xC8 },
  jmp: { abs: 0x4C, ind: 0x6C }, jsr: { abs: 0x20 },
  lda: { imm: 0xA9, zp: 0xA5, zpx: 0xB5, abs: 0xAD, abx: 0xBD, aby: 0xB9, izx: 0xA1, izy: 0xB1 },
  ldx: { imm: 0xA2, zp: 0xA6, zpy: 0xB6, abs: 0xAE, aby: 0xBE },
  ldy: { imm: 0xA0, zp: 0xA4, zpx: 0xB4, abs: 0xAC, abx: 0xBC },
  lsr: { acc: 0x4A, zp: 0x46, zpx: 0x56, abs: 0x4E, abx: 0x5E }, nop: { imp: 0xEA },
  ora: { imm: 0x09, zp: 0x05, zpx: 0x15, abs: 0x0D, abx: 0x1D, aby: 0x19, izx: 0x01, izy: 0x11 },
  pha: { imp: 0x48 }, php: { imp: 0x08 }, pla: { imp: 0x68 }, plp: { imp: 0x28 },
  rol: { acc: 0x2A, zp: 0x26, zpx: 0x36, abs: 0x2E, abx: 0x3E },
  ror: { acc: 0x6A, zp: 0x66, zpx: 0x76, abs: 0x6E, abx: 0x7E },
  rti: { imp: 0x40 }, rts: { imp: 0x60 },
  sbc: { imm: 0xE9, zp: 0xE5, zpx: 0xF5, abs: 0xED, abx: 0xFD, aby: 0xF9, izx: 0xE1, izy: 0xF1 },
  sec: { imp: 0x38 }, sed: { imp: 0xF8 }, sei: { imp: 0x78 },
  sta: { zp: 0x85, zpx: 0x95, abs: 0x8D, abx: 0x9D, aby: 0x99, izx: 0x81, izy: 0x91 },
  stx: { zp: 0x86, zpy: 0x96, abs: 0x8E }, sty: { zp: 0x84, zpx: 0x94, abs: 0x8C },
  tax: { imp: 0xAA }, tay: { imp: 0xA8 }, tsx: { imp: 0xBA }, txa: { imp: 0x8A },
  txs: { imp: 0x9A }, tya: { imp: 0x98 }
};
const SIZE = { imp: 1, acc: 1, imm: 2, zp: 2, zpx: 2, zpy: 2, abs: 3, abx: 3, aby: 3, ind: 3, izx: 2, izy: 2, rel: 2 };

// Segment start addresses from tetris.nes.cfg (null = follows the previous one)
const SEGSTART = { PRG_chunk1: 0x8000, unreferenced_data1: null, PRG_chunk2: 0xDD00, unreferenced_data4: null, PRG_chunk3: 0xFF00, VECTORS: 0xFFFA };

/* ---- expression evaluator ---- */
function tokenize(s) {
  const t = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ' || c === '\t') { i++; continue; }
    let m;
    if ((m = /^\$[0-9A-Fa-f]+/.exec(s.slice(i)))) { t.push({ n: parseInt(m[0].slice(1), 16) }); i += m[0].length; continue; }
    if ((m = /^%[01]+/.exec(s.slice(i)))) { t.push({ n: parseInt(m[0].slice(1), 2) }); i += m[0].length; continue; }
    if ((m = /^[0-9]+/.exec(s.slice(i)))) { t.push({ n: parseInt(m[0], 10) }); i += m[0].length; continue; }
    if ((m = /^'(.)'/.exec(s.slice(i)))) { t.push({ ch: m[1] }); i += 3; continue; }
    if ((m = /^(@[A-Za-z0-9_]+|[A-Za-z_][A-Za-z0-9_]*)/.exec(s.slice(i)))) { t.push({ id: m[0] }); i += m[0].length; continue; }
    if ((m = /^(<<|>>|<>|<=|>=|&&|\|\|)/.exec(s.slice(i)))) { t.push({ op: m[0] }); i += 2; continue; }
    t.push({ op: c }); i++;
  }
  return t;
}

class Asm {
  constructor() {
    this.sym = Object.create(null);
    this.charmap = {};
    this.defs = { PAL: 0, NWC: 0 };
  }
  lookup(id, strict) {
    const name = id[0] === '@' ? this.scope + id : id;
    if (name in this.sym) return this.sym[name];
    if (id in this.defs) return this.defs[id];
    if (strict) throw new Error('undefined symbol ' + name + ' at ' + this.where);
    return undefined;
  }
  // returns {v, known}
  evaluate(str, strict) {
    const toks = tokenize(str); let p = 0; let known = true;
    const self = this;
    function primary() {
      const t = toks[p++];
      if (!t) throw new Error('bad expr "' + str + '" at ' + self.where);
      if (t.n !== undefined) return t.n;
      if (t.ch !== undefined) return self.charmap[t.ch] !== undefined ? self.charmap[t.ch] : t.ch.charCodeAt(0);
      if (t.id) { const v = self.lookup(t.id, strict); if (v === undefined) { known = false; return 0x8000; } return v; }
      if (t.op === '(') { const v = expr(0); p++; return v; }
      if (t.op === '-') return -unary();
      if (t.op === '~') return ~unary();
      if (t.op === '<') return unary() & 0xFF;
      if (t.op === '>') return (unary() >> 8) & 0xFF;
      if (t.op === '+') return unary();
      throw new Error('bad token ' + JSON.stringify(t) + ' in "' + str + '" at ' + self.where);
    }
    function unary() { return primary(); }
    const PREC = { '||': 1, '&&': 2, '|': 3, '^': 4, '&': 5, '=': 6, '<>': 6, '<': 7, '>': 7, '<=': 7, '>=': 7, '<<': 8, '>>': 8, '+': 9, '-': 9, '*': 10, '/': 10 };
    function expr(minP) {
      let l = unary();
      for (;;) {
        const t = toks[p]; if (!t || !t.op || !(t.op in PREC) || PREC[t.op] < minP) return l;
        p++; const r = expr(PREC[t.op] + 1);
        switch (t.op) {
          case '+': l = l + r; break; case '-': l = l - r; break; case '*': l = l * r; break; case '/': l = Math.trunc(l / r); break;
          case '&': l = l & r; break; case '|': l = l | r; break; case '^': l = l ^ r; break;
          case '<<': l = l << r; break; case '>>': l = l >> r; break;
          case '=': l = +(l === r); break; case '<>': l = +(l !== r); break;
          case '<': l = +(l < r); break; case '>': l = +(l > r); break; case '<=': l = +(l <= r); break; case '>=': l = +(l >= r); break;
          case '&&': l = +(l && r); break; case '||': l = +(l || r); break;
        }
      }
    }
    const v = expr(0);
    if (p !== toks.length) throw new Error('trailing junk in "' + str + '" at ' + this.where);
    return { v, known };
  }
  splitArgs(s) {           // split on commas outside quotes
    const out = []; let cur = '', q = null;
    for (const c of s) {
      if (q) { cur += c; if (c === q) q = null; continue; }
      if (c === '"' || c === "'") { q = c; cur += c; continue; }
      if (c === ',') { out.push(cur.trim()); cur = ''; continue; }
      cur += c;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  stripComment(line) {
    let q = null;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) { if (c === q) q = null; continue; }
      if (c === "'" && line[i + 2] === "'") { i += 2; continue; }
      if (c === '"') { q = c; continue; }
      if (c === ';') return line.slice(0, i);
    }
    return line;
  }
  emit(b) {
    if (this.pass === 2) {
      if (this.seg === 'HEADER') this.hdr.push(b & 0xFF);
      else if (this.seg === 'CHR') this.chr.push(b & 0xFF);
      else if (this.seg && this.seg in SEGSTART) {
        if (this.pc < 0x8000 || this.pc > 0xFFFF) throw new Error('pc out of range at ' + this.where);
        this.prg[this.pc - 0x8000] = b & 0xFF;
      } else throw new Error('emit outside a known segment at ' + this.where);
    }
    this.pc++;
  }
  operand(mn, arg) {
    const op = OPS[mn];
    if (arg === '' || arg === undefined) return op.imp !== undefined ? { mode: 'imp' } : { mode: 'acc' };
    if (/^a$/i.test(arg) && op.acc !== undefined) return { mode: 'acc' };
    if (arg[0] === '#') return { mode: 'imm', e: arg.slice(1) };
    if (op.rel !== undefined) return { mode: 'rel', e: arg };
    let m;
    if ((m = /^\((.*)\)\s*,\s*y$/i.exec(arg))) return { mode: 'izy', e: m[1] };
    if ((m = /^\((.*)\s*,\s*x\)$/i.exec(arg))) return { mode: 'izx', e: m[1] };
    if ((m = /^\((.*)\)$/.exec(arg)) && mn === 'jmp') return { mode: 'ind', e: m[1] };
    if ((m = /^(.*),\s*x$/i.exec(arg))) return { mode: 'x', e: m[1] };
    if ((m = /^(.*),\s*y$/i.exec(arg))) return { mode: 'y', e: m[1] };
    return { mode: 'a', e: arg };
  }
  instr(mn, arg, labelKey) {
    const op = OPS[mn];
    let { mode, e } = this.operand(mn, arg);
    let val = 0, known = true;
    if (e !== undefined) { const r = this.evaluate(e, this.pass === 2); val = r.v; known = r.known; }
    if (mode === 'a' || mode === 'x' || mode === 'y') {
      // zero page when the value is known on pass 1 and fits; remember the pass-1 decision
      let zp;
      if (this.pass === 1) { zp = known && val >= 0 && val < 0x100; this.zpDecision[labelKey] = zp; }
      else zp = this.zpDecision[labelKey];
      const zm = { a: 'zp', x: 'zpx', y: 'zpy' }[mode], am = { a: 'abs', x: 'abx', y: 'aby' }[mode];
      mode = zp && op[zm] !== undefined ? zm : am;
    }
    const code = op[mode];
    if (code === undefined) throw new Error('bad mode ' + mode + ' for ' + mn + ' at ' + this.where);
    const start = this.pc;
    this.emit(code);
    if (mode === 'rel') {
      const d = val - (start + 2);
      if (this.pass === 2 && (d < -128 || d > 127)) throw new Error('branch out of range at ' + this.where);
      this.emit(d & 0xFF);
    } else if (SIZE[mode] === 2) this.emit(val & 0xFF);
    else if (SIZE[mode] === 3) { this.emit(val & 0xFF); this.emit((val >> 8) & 0xFF); }
  }
  runFile(rel) {
    const file = path.join(ROOT, rel);
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((raw, i) => { this.where = rel + ':' + (i + 1); this.line(raw, rel + ':' + i); });
  }
  line(raw, key) {
    let s = this.stripComment(raw).trim();
    if (!s) return;
    // conditionals
    let m;
    if ((m = /^\.(if|ifdef|ifndef|elseif|else|endif)\b\s*(.*)$/i.exec(s))) {
      const d = m[1].toLowerCase(), a = m[2];
      const top = this.cond[this.cond.length - 1];
      const active = this.cond.every(c => c.on);
      if (d === 'if' || d === 'ifdef' || d === 'ifndef') {
        let on = false;
        if (active) {
          if (d === 'if') on = !!this.evaluate(a, true).v;
          else { const def = this.lookup(a.trim()) !== undefined; on = d === 'ifdef' ? def : !def; }
        }
        this.cond.push({ on: active && on, done: on, parentActive: active });
      } else if (d === 'elseif') {
        if (top.done || !top.parentActive) top.on = false; else { top.on = !!this.evaluate(a, true).v; top.done = top.on; }
      } else if (d === 'else') { top.on = top.parentActive && !top.done; top.done = true; }
      else this.cond.pop();
      return;
    }
    if (!this.cond.every(c => c.on)) return;
    // equates
    if ((m = /^([A-Za-z_][A-Za-z0-9_]*)\s*(:=|=)\s*(.+)$/.exec(s))) {
      const r = this.evaluate(m[3], false);
      if (m[1] in this.defs && !(m[1] in this.sym)) { this.defs[m[1]] = r.v; return; }
      this.sym[m[1]] = r.v; return;
    }
    // labels
    while ((m = /^(@[A-Za-z0-9_]+|[A-Za-z_][A-Za-z0-9_]*):(?!=)\s*(.*)$/.exec(s))) {
      const name = m[1][0] === '@' ? this.scope + m[1] : m[1];
      if (m[1][0] !== '@') this.scope = m[1];
      if (this.pass === 2 && this.sym[name] !== this.pc) throw new Error('label moved between passes: ' + name);
      this.sym[name] = this.pc;
      s = m[2].trim();
      if (!s) return;
    }
    if ((m = /^\.([a-z]+)\b\s*(.*)$/i.exec(s))) return this.directive(m[1].toLowerCase(), m[2]);
    if ((m = /^([a-z]{3})\b\s*(.*)$/i.exec(s)) && OPS[m[1].toLowerCase()]) return this.instr(m[1].toLowerCase(), m[2].trim(), key);
    throw new Error('cannot parse "' + s + '" at ' + this.where);
  }
  directive(d, a) {
    switch (d) {
      case 'setcpu': case 'feature': case 'code': case 'zeropage': case 'bss': return;
      case 'segment': {
        const name = /"([^"]+)"/.exec(a)[1];
        this.segPc[this.seg] = this.pc;
        this.seg = name;
        if (name in this.segPc) this.pc = this.segPc[name];
        else if (name in SEGSTART) this.pc = SEGSTART[name] !== null ? SEGSTART[name] : this.segEnd;
        else this.pc = 0;
        return;
      }
      case 'include': return this.runFile(/"([^"]+)"/.exec(a)[1]);
      case 'incbin': {
        const f = /"([^"]+)"/.exec(a)[1];
        let buf;
        if (f.endsWith('.chr')) buf = chrFromPng(path.join(ROOT, f.replace(/\.chr$/, '.png')));
        else buf = fs.readFileSync(path.join(ROOT, f));
        for (const b of buf) this.emit(b);
        return;
      }
      case 'byte': case 'res': case 'word': case 'addr': case 'dbyt': {
        if (d === 'res') { const n = this.evaluate(this.splitArgs(a)[0], true).v; for (let i = 0; i < n; i++) this.emit(0); return; }
        for (const x of this.splitArgs(a)) {
          if (x[0] === '"') { for (const ch of x.slice(1, -1)) this.emit(this.charmap[ch] !== undefined ? this.charmap[ch] : ch.charCodeAt(0)); continue; }
          const v = this.evaluate(x, this.pass === 2).v;
          if (d === 'byte') this.emit(v);
          else if (d === 'dbyt') { this.emit(v >> 8); this.emit(v); }
          else { this.emit(v); this.emit(v >> 8); }
        }
        return;
      }
      case 'charmap': {
        const [c, v] = this.splitArgs(a);
        this.charmap[/'(.)'/.exec(c)[1]] = this.evaluate(v, true).v; return;
      }
      default: throw new Error('unknown directive .' + d + ' at ' + this.where);
    }
  }
  run(pass) {
    this.pass = pass; this.pc = 0; this.seg = null; this.segPc = {}; this.scope = ''; this.cond = []; this.charmap = {};
    this.hdr = []; this.chr = [];
    if (pass === 1) this.zpDecision = {};
    // ld65 places a segment with no start right after the previous PRG segment
    const self = this;
    Object.defineProperty(this, 'segEnd', { configurable: true, get() { return self.segPc[self.lastPrg] !== undefined ? self.segPc[self.lastPrg] : self.pc; } });
    const origSeg = this.directive.bind(this);
    this.directive = (d, a) => {
      if (d === 'segment') { if (this.seg in SEGSTART) this.lastPrg = this.seg; }
      return origSeg(d, a);
    };
    this.runFile('tetris.asm');
    this.directive = origSeg;
  }
}

/* PNG (grey 000/555/aaa/fff) -> 2bpp CHR, 16x16 tiles of 8x8 */
function chrFromPng(file) {
  const { decodePNG } = require('./png.js');
  const p = decodePNG(file);
  const lv = { 0: 0, 85: 1, 170: 2, 255: 3 };
  const tilesX = p.w / 8, tilesY = p.h / 8;
  const out = Buffer.alloc(tilesX * tilesY * 16);
  for (let ty = 0; ty < tilesY; ty++) for (let tx = 0; tx < tilesX; tx++) {
    const t = ty * tilesX + tx;
    for (let y = 0; y < 8; y++) {
      let lo = 0, hi = 0;
      for (let x = 0; x < 8; x++) {
        const c = lv[p.pixel(tx * 8 + x, ty * 8 + y)[0]];
        lo |= (c & 1) << (7 - x); hi |= ((c >> 1) & 1) << (7 - x);
      }
      out[t * 16 + y] = lo; out[t * 16 + 8 + y] = hi;
    }
  }
  return out;
}

function assemble() {
  const a = new Asm();
  a.prg = Buffer.alloc(0x8000);
  a.run(1);
  a.prg = Buffer.alloc(0x8000);
  a.run(2);
  const nes = Buffer.concat([Buffer.from(a.hdr), a.prg, Buffer.from(a.chr)]);
  return { prg: a.prg, chr: Buffer.from(a.chr), sym: a.sym, nes };
}

module.exports = { assemble, chrFromPng, OPS, MODES, SIZE };

if (require.main === module) {
  const r = assemble();
  const md5 = crypto.createHash('md5').update(r.nes).digest('hex');
  const sha1 = crypto.createHash('sha1').update(r.nes).digest('hex');
  console.log('nes bytes', r.nes.length, 'md5', md5, 'sha1', sha1);
  console.log(md5 === 'ec58574d96bee8c8927884ae6e7a2508' ? 'MATCHES Tetris (U) [!]' : 'MISMATCH');
}
