/* Records the genuine Pinball music and sound effects by running the ROM's
   own sound engine (rebuilt byte-exact from reference/disasm/pinball.asm) in
   the offline emulator, one request bit at a time, and turning the APU
   register writes into per-frame note tables for WebAudio.

   The engine (the usual early-Nintendo one at $FB2C/$FBDD, called from NMI)
   takes requests in $FF, $FE and $FD (one bit per sound).  For every bit we
   start from a quiet moment of a real game (ball resting on the striker),
   set the request, and log $4000-$4017 writes until the APU is silent.

   A small frame-level APU model (envelopes, length counters, linear counter,
   hardware sweep, $4015 enables) samples each channel once per video frame:
     pulse:    [hz, volume 0-15, duty 0-3]
     triangle: [hz, on 0/1]
     noise:    [period index 0-15, volume, short-mode 0/1]
   Output: reference/audio.gen.js (const SOUNDS), spliced by tools/inject.js.
     node tools/extract-audio.js                                           */
'use strict';
const fs = require('fs');
const path = require('path');
const { NES } = require('./nes.js');

const CPU = 1789773;
const LEN = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30];
const OUT = path.join(__dirname, '..', 'reference', 'audio.gen.js');

/* names follow the ROM call sites that raise each request (see CLAUDE.md) */
const NAMES = {
  ff01: 'kicker', ff02: 'lane', ff04: 'ding', ff08: 'reset', ff10: 'bumper', ff20: 'flipper',
  fe01: 'tally', fe02: 'lamp', fe04: 'target', fe08: 'kick', fe10: 'step',
  fd01: 'jackpot', fd02: 'title', fd04: 'start'
};

function quietBase() {
  const n = new NES();
  n.run(120); n.run(5, NES.BTN.start); n.run(600, 0);
  return n;
}
function cloneNES(b) {
  const n = Object.create(Object.getPrototypeOf(b)); Object.assign(n, b);
  n.ram = b.ram.slice(); n.vram = b.vram.slice(); n.pal = b.pal.slice(); n.oam = b.oam.slice(); n.apu = b.apu.slice();
  n.pad = [0, 0]; n.padShift = [0, 0]; n.apuLog = [];
  const c = Object.create(Object.getPrototypeOf(b.cpu)); Object.assign(c, b.cpu);
  c.read = a => n.read(a); c.write = (a, v) => n.write(a, v); n.cpu = c;
  return n;
}

/* ---- frame-level APU model ---- */
function APU() {
  this.r = new Uint8Array(0x18);
  this.ch = [0, 1].map(() => ({ len: 0, env: 0, envDiv: 0, envStart: false, period: 0, sweepDiv: 0, sweepReload: false }));
  this.tri = { len: 0, lin: 0, linReload: false, period: 0 };
  this.noi = { len: 0, env: 0, envDiv: 0, envStart: false };
  this.enable = 0; this.qacc = 0;
}
APU.prototype.write = function (a, v) {
  this.r[a] = v;
  if (a < 8) {
    const c = this.ch[a >> 2], o = a & 3;
    if (o === 1) c.sweepReload = true;
    if (o === 2) c.period = (c.period & 0x700) | v;
    if (o === 3) { c.period = (c.period & 0xFF) | ((v & 7) << 8); if (this.enable & (1 << (a >> 2))) c.len = LEN[v >> 3]; c.envStart = true; }
  } else if (a === 0x0A) this.tri.period = (this.tri.period & 0x700) | v;
  else if (a === 0x0B) { this.tri.period = (this.tri.period & 0xFF) | ((v & 7) << 8); if (this.enable & 4) this.tri.len = LEN[v >> 3]; this.tri.linReload = true; }
  else if (a === 0x0F) { if (this.enable & 8) this.noi.len = LEN[v >> 3]; this.noi.envStart = true; }
  else if (a === 0x15) {
    this.enable = v & 0x1F;
    if (!(v & 1)) this.ch[0].len = 0; if (!(v & 2)) this.ch[1].len = 0;
    if (!(v & 4)) this.tri.len = 0; if (!(v & 8)) this.noi.len = 0;
  }
};
function envClock(e, reg) {
  if (e.envStart) { e.envStart = false; e.env = 15; e.envDiv = reg & 15; return; }
  if (e.envDiv > 0) { e.envDiv--; return; }
  e.envDiv = reg & 15;
  if (e.env > 0) e.env--; else if (reg & 0x20) e.env = 15;
}
APU.prototype.quarter = function () {
  envClock(this.ch[0], this.r[0]); envClock(this.ch[1], this.r[4]); envClock(this.noi, this.r[0x0C]);
  const t = this.tri;
  if (t.linReload) t.lin = this.r[8] & 0x7F; else if (t.lin > 0) t.lin--;
  if (!(this.r[8] & 0x80)) t.linReload = false;
};
APU.prototype.half = function () {
  for (let i = 0; i < 2; i++) {
    const c = this.ch[i], ctl = this.r[i * 4], sw = this.r[i * 4 + 1];
    if (!(ctl & 0x20) && c.len > 0) c.len--;
    const shift = sw & 7, target = this.sweepTarget(i);
    if (c.sweepDiv === 0 && (sw & 0x80) && shift && c.period >= 8 && target <= 0x7FF) c.period = target;
    if (c.sweepDiv === 0 || c.sweepReload) { c.sweepDiv = (sw >> 4) & 7; c.sweepReload = false; } else c.sweepDiv--;
  }
  if (!(this.r[8] & 0x80) && this.tri.len > 0) this.tri.len--;
  if (!(this.r[0x0C] & 0x20) && this.noi.len > 0) this.noi.len--;
};
APU.prototype.sweepTarget = function (i) {
  const c = this.ch[i], sw = this.r[i * 4 + 1], d = c.period >> (sw & 7);
  return (sw & 8) ? c.period - d - (i === 0 ? 1 : 0) : c.period + d;
};
/* $4017 = $C0 (5-step mode): 4 quarter clocks and 2 half clocks per 37281
   CPU cycles = 3.2 / 1.6 per 29781-cycle video frame */
APU.prototype.endFrame = function () {
  this.qacc += 3.2;
  let n = 0;
  while (this.qacc >= 1) { this.qacc -= 1; this.quarter(); if ((++this.qn & 1) === 0) this.half(); n++; }
};
APU.prototype.qn = 0;
APU.prototype.sample = function () {
  const out = {};
  for (let i = 0; i < 2; i++) {
    const c = this.ch[i], ctl = this.r[i * 4];
    const vol = (ctl & 0x10) ? (ctl & 15) : c.env;
    const muted = c.len === 0 || c.period < 8 || this.sweepTarget(i) > 0x7FF && (this.r[i * 4 + 1] & 8) === 0;
    out['sq' + (i + 1)] = muted || !vol ? [0, 0, 0] : [Math.round(CPU / (16 * (c.period + 1)) * 100) / 100, vol, ctl >> 6];
  }
  const t = this.tri;
  out.tri = (t.len > 0 && t.lin > 0 && t.period >= 2) ? [Math.round(CPU / (32 * (t.period + 1)) * 100) / 100, 1] : [0, 0];
  const nc = this.r[0x0C], nv = (nc & 0x10) ? (nc & 15) : this.noi.env;
  out.noise = (this.noi.len > 0 && nv) ? [this.r[0x0E] & 15, nv, (this.r[0x0E] >> 7) & 1] : [0, 0, 0];
  return out;
};

/* run-length encode per-channel frame lists: [frames, ...values] flattened */
function rle(list) {
  const out = []; let prev = null, cnt = 0;
  for (const v of list) {
    const k = v.join(',');
    if (k === prev) cnt++;
    else { if (prev !== null) out.push(cnt, ...prev.split(',').map(Number)); prev = k; cnt = 1; }
  }
  if (prev !== null) out.push(cnt, ...prev.split(',').map(Number));
  return out;
}

const base = quietBase();
const SOUNDS = {};
const report = [];
for (const reg of [0xFF, 0xFE, 0xFD]) {
  for (let bit = 0; bit < 8; bit++) {
    const key = reg.toString(16) + (1 << bit).toString(16).padStart(2, '0');
    const n = cloneNES(base);
    const apu = new APU();
    // seed the APU model with the base register state
    for (let a = 0; a < 0x18; a++) apu.r[a] = base.apu[a];
    apu.enable = base.apu[0x15] & 0x1F;
    n.ram[reg] = 1 << bit;
    const frames = { sq1: [], sq2: [], tri: [], noise: [] };
    let silent = 0, f = 0, li = 0;
    for (; f < 1800; f++) {
      if (f === 0) n.ram[reg] = 1 << bit;
      n.runFrame();
      for (; li < n.apuLog.length; li++) apu.write(n.apuLog[li][1], n.apuLog[li][2]);
      apu.endFrame();
      const s = apu.sample();
      for (const c in frames) frames[c].push(s[c]);
      const any = s.sq1[1] || s.sq2[1] || s.tri[1] || s.noise[1];
      silent = any ? 0 : silent + 1;
      if (f > 10 && silent > 45) break;
    }
    const len = f + 1 - silent;
    if (len <= 1) continue;
    const snd = { len };
    for (const c in frames) {
      const l = frames[c].slice(0, len);
      if (l.some(v => v[1])) snd[c] = rle(l);
    }
    if (!NAMES[key]) continue;          // fd08-fd80: tunes the game never requests
    const name = NAMES[key];
    SOUNDS[name] = snd;
    report.push(name.padEnd(9) + key + '  ' + len + ' frames  ' + Object.keys(snd).filter(k => k !== 'len').join(','));
  }
}
const body = '/* generated by tools/extract-audio.js from the Pinball ROM sound engine - do not edit */\nconst SOUNDS = ' + JSON.stringify(SOUNDS) + ';';
fs.writeFileSync(OUT, body);
console.log(report.join('\n'));
console.log('wrote ' + OUT + ' (' + body.length + ' bytes)');
