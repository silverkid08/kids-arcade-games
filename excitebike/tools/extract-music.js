/* Extracts Excitebike's music and sound effects from the real ROM into
   reference/music.gen.js  (const MUSIC = {...};)

   Method: the game's own sound engine (sub_F844, called once per NMI) is run
   in tools/nes.js as a subroutine, one call per video frame, with the sound
   request bytes poked exactly as the game code pokes them:
       $FB  music / jingles (pulse1+pulse2+triangle+noise, sub_FC8D)
       $FF  pulse-1 effects                         (sub_F8D4)
       $FE  "rev" effect on pulse 2 + triangle       (sub_FA74)
       $FD  noise effects                           (sub_FC3D)
       $FC  continuous engine tone (pulse 2), NOT extracted here: it is a
            live function of rider speed and is re-implemented in
            reference/sound.gen.js (Sound.engine).
   The APU register writes made by every call are fed to a small frame-level
   APU model (length counters, envelopes, sweep units incl. the >$7FF mute,
   triangle linear counter, $4017 frame-counter reset) clocked like the real
   game: $4017=$C0 at the top of every NMI clocks quarter+half frame
   immediately, then quarter / quarter+half / quarter follow during the frame.

   The game situations that make each request were found by running the
   whole game in the emulator (see SITUATIONS below / the header of
   sound.gen.js).  Excitebike does not use DMC samples ($4010/$4012/$4013 are
   never written); $4011 only gets a slowly decaying DC level (RAM $07FF,
   raised by the engine routine) which is inaudible and is ignored.

   Data format, per sound:
     { src, grp, len,  p1:[n,period,vol,duty,...], p2:[...],
       tr:[n,period,...] (period 0 = silent),  no:[n,periodIndex,mode,vol,...] }
   Runs are run-length encoded (n identical frames).  Pulse Hz =
   1789773/(16*(period+1)); triangle Hz = 1789773/(32*(period+1)); noise
   period index -> NES noise period table, mode 1 = short (93-step) LFSR.
   vol 0..15 is the average output volume over the frame's 4 quarter-frame
   steps.  A channel key is present only if the sound drives that channel.

     node tools/extract-music.js        writes reference/music.gen.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const NES = require('./nes.js');
const { prg, chr } = require('./rom.js');

const LENGTH = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30];

/* ---------------- frame-level APU model ---------------- */
function makeAPU() {
  const pulse = i => ({ i, duty: 0, halt: 0, cv: 0, vp: 0, envStart: 0, envDiv: 0, decay: 0,
    swEn: 0, swP: 0, swNeg: 0, swSh: 0, swReload: 0, swDiv: 0, t: 0, len: 0, on: 1 });
  const A = {
    p: [pulse(0), pulse(1)],
    tr: { ctl: 0, linLoad: 0, lin: 0, linReload: 0, t: 0, len: 0, on: 1 },
    no: { halt: 0, cv: 0, vp: 0, envStart: 0, envDiv: 0, decay: 0, mode: 0, idx: 0, len: 0, on: 1 },
  };
  const target = p => { const d = p.t >> p.swSh; return p.swNeg ? p.t - d - (p.i === 0 ? 1 : 0) : p.t + d; };
  const muted = p => p.t < 8 || target(p) > 0x7FF;
  function env(c) {
    if (c.envStart) { c.envStart = 0; c.decay = 15; c.envDiv = c.vp; }
    else if (c.envDiv === 0) { c.envDiv = c.vp; if (c.decay) c.decay--; else if (c.halt) c.decay = 15; }
    else c.envDiv--;
  }
  function quarter() {
    env(A.p[0]); env(A.p[1]); env(A.no);
    const t = A.tr;
    if (t.linReload) t.lin = t.linLoad; else if (t.lin) t.lin--;
    if (!t.ctl) t.linReload = 0;
  }
  function half() {
    for (const p of A.p) {
      if (!p.halt && p.len) p.len--;
      if (p.swDiv === 0 && p.swEn && p.swSh && !muted(p)) p.t = Math.max(0, target(p));
      if (p.swDiv === 0 || p.swReload) { p.swDiv = p.swP; p.swReload = 0; } else p.swDiv--;
    }
    if (!A.tr.ctl && A.tr.len) A.tr.len--;
    if (!A.no.halt && A.no.len) A.no.len--;
  }
  function write(a, v) {
    if (a < 0x4008) {
      const p = A.p[(a >> 2) & 1];
      switch (a & 3) {
        case 0: p.duty = v >> 6; p.halt = (v >> 5) & 1; p.cv = (v >> 4) & 1; p.vp = v & 15; break;
        case 1: p.swEn = v >> 7; p.swP = (v >> 4) & 7; p.swNeg = (v >> 3) & 1; p.swSh = v & 7; p.swReload = 1; break;
        case 2: p.t = (p.t & 0x700) | v; break;
        case 3: p.t = (p.t & 0xFF) | ((v & 7) << 8); if (p.on) p.len = LENGTH[v >> 3]; p.envStart = 1; break;
      }
    } else if (a < 0x400C) {
      const t = A.tr;
      if (a === 0x4008) { t.ctl = v >> 7; t.linLoad = v & 0x7F; }
      else if (a === 0x400A) t.t = (t.t & 0x700) | v;
      else if (a === 0x400B) { t.t = (t.t & 0xFF) | ((v & 7) << 8); if (t.on) t.len = LENGTH[v >> 3]; t.linReload = 1; }
    } else if (a < 0x4010) {
      const n = A.no;
      if (a === 0x400C) { n.halt = (v >> 5) & 1; n.cv = (v >> 4) & 1; n.vp = v & 15; }
      else if (a === 0x400E) { n.mode = v >> 7; n.idx = v & 15; }
      else if (a === 0x400F) { if (n.on) n.len = LENGTH[v >> 3]; n.envStart = 1; }
    } else if (a === 0x4015) {
      const chs = [A.p[0], A.p[1], A.tr, A.no];
      chs.forEach((c, i) => { c.on = (v >> i) & 1; if (!c.on) c.len = 0; });
    } else if (a === 0x4017) {
      if (v & 0x80) { quarter(); half(); }
    }
  }
  function sample() {
    const s = {};
    s.p = A.p.map(p => ({ t: p.t, vol: (p.len && !muted(p)) ? (p.cv ? p.vp : p.decay) : 0, duty: p.duty }));
    const t = A.tr; s.tr = (t.len && t.lin && t.t >= 2) ? t.t : 0;
    const n = A.no; s.no = { idx: n.idx, mode: n.mode, vol: n.len ? (n.cv ? n.vp : n.decay) : 0 };
    return s;
  }
  /* one video frame: the NMI's writes, then the rest of the frame's clocks */
  function frame(writes) {
    for (const [a, v] of writes) write(a, v);
    const s = [sample()]; quarter(); s.push(sample()); quarter(); half(); s.push(sample()); quarter(); s.push(sample());
    const avg = f => Math.round(s.reduce((x, y) => x + f(y), 0) / 4);
    const out = { p: [0, 1].map(i => {
      const vol = avg(q => q.p[i].vol);
      const ref = s.find(q => q.p[i].vol) || s[0];
      return vol ? [ref.p[i].t, vol, ref.p[i].duty] : [0, 0, 0];
    }) };
    const tri = s.filter(q => q.tr).length >= 2 ? (s.find(q => q.tr).tr) : 0;
    out.tr = [tri];
    const nv = avg(q => q.no.vol);
    out.no = nv ? [s[0].no.idx, s[0].no.mode, nv] : [0, 0, 0];
    return out;
  }
  return { frame, A };
}

/* ---------------- run the ROM's sound engine as a subroutine ---------------- */
function engineHarness() {
  const n = new NES(prg, chr); n.reset();
  n.ram.fill(0);
  const apu = makeAPU();
  apu.frame([[0x4015, 0x0F]]);            // the game enables all 4 channels at C2E3
  function call(pokes) {
    for (const k in pokes) n.ram[+k] = pokes[k];
    n.apuFrame = [];
    n.S = 0xFF; n.push(0x00); n.push(0x00);  // RTS -> $0001
    n.PC = 0xF844; let guard = 0;
    while (n.PC !== 0x0001) { n.step(); if (++guard > 100000) throw new Error('sound engine runaway'); }
    const w = n.apuFrame; n.apuFrame = [];
    return w;
  }
  return { n, apu, step(pokes) { const w = call(pokes || {}); return { w, s: apu.frame(w) }; } };
}

const BUSY = { 0xFB: 0xF4, 0xFF: 0xF0, 0xFE: 0xF1, 0xFD: 0xF2 };
function silent(s, chans) { return chans.every(c => c === 'tr' ? !s.tr[0] : c === 'no' ? !s.no[2] : !s[c][1]); }

function record(req, val) {
  const h = engineHarness();
  const frames = []; const touched = new Set();
  let f = 0, quiet = 0;
  for (; f < 4000; f++) {
    const { w, s } = h.step(f === 0 ? { [req]: val } : {});
    for (const [a] of w) {
      if (a <= 0x4003) touched.add('p1'); else if (a <= 0x4007) touched.add('p2');
      else if (a <= 0x400B) touched.add('tr'); else if (a <= 0x400F) touched.add('no');
    }
    frames.push({ p1: s.p[0], p2: s.p[1], tr: s.tr, no: s.no });
    const busy = h.n.ram[BUSY[req]] !== 0 || (req === 0xFE && h.n.ram[0xF1]);
    const allQuiet = silent({ p1: s.p[0], p2: s.p[1], tr: s.tr, no: s.no }, ['p1', 'p2', 'tr', 'no']);
    if (!busy && allQuiet) { if (++quiet >= 2) break; } else quiet = 0;
  }
  while (frames.length > 1) {                                  // trim trailing silence
    const l = frames[frames.length - 1];
    if (silent(l, ['p1', 'p2', 'tr', 'no'])) frames.pop(); else break;
  }
  const out = { len: frames.length };
  for (const c of ['p1', 'p2', 'tr', 'no']) {
    if (!touched.has(c)) continue;
    const rle = []; let prev = null, cnt = 0;
    const push = () => { if (prev) rle.push(cnt, ...prev); };
    for (const fr of frames) {
      const k = fr[c];
      if (prev && k.join() === prev.join()) cnt++; else { push(); prev = k; cnt = 1; }
    }
    push();
    if (rle.length) out[c] = rle;
  }
  return out;
}

/* ---------------- the sounds ---------------- */
const SOUNDS = [
  // name, request, value, group, src description
  ['title', 0xFB, 0x01, 'music', '$FB=$01: C2CF (title screen, once after power-on) and CBF8 (results screen when NOT qualified, rank>3)'],
  ['qualify', 0xFB, 0x02, 'music', '$FB=$02: CBF8 (results screen, rank 1-3 = qualified). $FB=$08/$10 play the same tune (unused)'],
  ['design', 0xFB, 0x04, 'music', '$FB=$04: C3F5 (entering DESIGN mode from the title menu)'],
  ['raceStart', 0xFB, 0x20, 'music', '$FB=$20: DE64 (race start countdown, when timer $24 reaches $72)'],
  ['overheat', 0xFB, 0x40, 'music', '$FB=$40: EADE (temperature bar in the red, $3A>=$0D, re-requested 11 of every 22 frames), CCE4 (overheated), C447, EB9B'],
  ['pause', 0xFB, 0x80, 'music', '$FB=$80: CA4A (START pressed: pause and unpause; the game silences $4015 40 frames after pausing)'],
  ['menuMove', 0xFF, 0x01, 'p1', '$FF=$01: C819 (title / design menu cursor move), EBE1 + EC1E (design mode piece select)'],
  ['land', 0xFF, 0x02, 'p1', '$FF=$02: DC37 (player bike lands after a jump)'],
  ['jumpFast', 0xFF, 0x08, 'p1', '$FF=$08: DD6C (player takes off from a ramp, speed hi $94=3)'],
  ['jump', 0xFF, 0x10, 'p1', '$FF=$10: DD6C (take off, $94=2 or 0; values $30/$70 also land here)'],
  ['jumpSlow', 0xFF, 0x20, 'p1', '$FF=$20: DD6C (take off, $94=1)'],
  ['pass', 0xFF, 0x40, 'p1', '$FF=$40: DED3 (a CPU rider leaves the zone around the player, i.e. is passed / passes)'],
  ['blip', 0xFF, 0x04, 'p1', '$FF=$04: not requested by the game code (unused pulse-1 effect)'],
  ['rev', 0xFE, 0x01, 'p2', '$FE=$01: CD51 (first throttle press, engine start) and DE4C (every frame while A/B held at the start line - each request restarts it)'],
  ['crash', 0xFD, 0x01, 'noise', '$FD=$01: DDE7 (player tumbling, re-requested every 4 frames), E07C + E0DF (player collides / falls)'],
  ['crowd', 0xFD, 0x02, 'noise', '$FD=$02: EABB (crossing the finish line), D97C (player back on the bike after a crash)'],
  ['laneChange', 0xFD, 0x04, 'noise', '$FD=$04: CE18 (player steers up/down, every frame while held), EA41'],
];

const NOTE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
function noteName(hz) { if (!hz) return '-'; const m = Math.round(69 + 12 * Math.log2(hz / 440)); return NOTE[(m % 12 + 12) % 12] + (Math.floor(m / 12) - 1); }

function main() {
  const MUSIC = {};
  const report = [];
  for (const [name, req, val, grp, src] of SOUNDS) {
    const r = record(req, val);
    MUSIC[name] = Object.assign({ src, grp }, r);
    report.push(name.padEnd(11) + ' ' + String(r.len).padStart(4) + ' frames  ch=' + ['p1', 'p2', 'tr', 'no'].filter(c => r[c]).join(','));
  }
  const out = path.join(__dirname, '..', 'reference', 'music.gen.js');
  const body = '/* generated by tools/extract-music.js from the Excitebike ROM sound engine (sub_F844) - do not edit */\n' +
    'const MUSIC = ' + JSON.stringify(MUSIC) + ';\n';
  fs.writeFileSync(out, body);
  console.log(report.join('\n'));
  console.log('wrote', out, body.length, 'bytes');
  // first notes of the tunes, for a sanity check
  for (const name of ['title', 'raceStart', 'qualify']) {
    const p = MUSIC[name].p2 || MUSIC[name].p1, notes = [];
    for (let i = 0; i < p.length && notes.length < 16; i += 4) if (p[i + 2]) { const nn = noteName(1789773 / (16 * (p[i + 1] + 1))); if (notes[notes.length - 1] !== nn) notes.push(nn); }
    console.log(name, 'lead:', notes.join(' '));
  }
}

module.exports = { makeAPU, engineHarness, record };
if (require.main === module) main();
