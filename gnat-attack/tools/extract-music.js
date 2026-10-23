/* Extracts the Gnat Attack music from the game's own sound data.

     node tools/extract-music.js        -> writes reference/music.gen.js
     node tools/inject.js               -> splices it into index.html

   Source: the SPC700 RAM snapshots in reference/spc/emu/ (Zophar's
   "Mario Paint (EMU)" SPC set, dumped from the real cartridge).  Each
   snapshot holds Nintendo's N-SPC sound driver, the song sequence data
   and the BRR instrument samples exactly as the game uploads them.

   This script interprets the N-SPC sequence format offline (song list ->
   blocks of 8 tracks -> note / duration / command bytes, with
   subroutine calls) and decodes the BRR samples, so the game can play
   the real notes on the real instruments through WebAudio.

   Engine tables found in the snapshot (identical in every Gnat Attack
   dump):  song table $26C1, instrument table $6E00 (6 bytes: SRCN,
   ADSR1, ADSR2, GAIN, tune hi, tune lo), gate table $6F00, velocity
   table $6F08, pitch table $0E7A, sample directory DSP DIR * $100.
   Timer 0 target $10 (2 ms); each timer tick adds the tempo byte to an
   8-bit accumulator and a carry advances the sequence one tick.        */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SPC_DIR = path.join(ROOT, 'reference', 'spc', 'emu');

/* game song id (port value) -> file + our name */
const SONGS = {
  level1: ['15 Flyswatter ~ Level 1.spc', 0x08],
  level2: ['16 Flyswatter ~ Level 2.spc', 0x09],
  level3: ['17 Flyswatter ~ Level 3.spc', 0x0A],
  boss: ['18 Big Robo Bug.spc', 0x0C],
  clear: ['19 Beat the Big Bug!.spc', 0x1A],
  clearFinal: ['20 Beat the Big Bug! (Final).spc', 0x1E],
  loopClear: ['21 Master Exterminator.spc', 0x0F],
  gameOver: ['22 Beaten by Bugs.spc', 0x0E]
};

function load(file) {
  const b = fs.readFileSync(path.join(SPC_DIR, file));
  return { A: b.slice(0x100, 0x10100), D: b.slice(0x10100, 0x10180) };
}

/* ---------- BRR samples ---------- */
function decodeBRR(A, start) {
  const out = [];
  let p1 = 0, p2 = 0, a = start, guard = 0;
  for (;;) {
    const hdr = A[a]; const shift = hdr >> 4, filter = (hdr >> 2) & 3, end = hdr & 1;
    for (let i = 0; i < 16; i++) {
      const byte = A[a + 1 + (i >> 1)];
      let s = (i & 1) ? byte & 15 : byte >> 4;
      if (s >= 8) s -= 16;
      s = shift <= 12 ? (s << shift) >> 1 : (s < 0 ? -2048 : 0);
      if (filter === 1) s += p1 + ((-p1) >> 4);
      else if (filter === 2) s += 2 * p1 + ((-3 * p1) >> 5) - p2 + (p2 >> 4);
      else if (filter === 3) s += 2 * p1 + ((-13 * p1) >> 6) - p2 + ((3 * p2) >> 4);
      s = Math.max(-32768, Math.min(32767, s));
      s = ((s << 17) >> 16) >> 1;                // 15-bit wrap like the DSP (it stores s*2)
      p2 = p1; p1 = s; out.push(s);
    }
    a += 9;
    if (end || ++guard > 4000 || a > 0xFFF0) break;
  }
  return { pcm: out, endAddr: a };
}

/* ---------- sequence interpreter ---------- */
const PARAMS = { 0xE0: 1, 0xE1: 1, 0xE2: 2, 0xE3: 3, 0xE4: 0, 0xE5: 1, 0xE6: 2, 0xE7: 1, 0xE8: 2, 0xE9: 1, 0xEA: 1,
  0xEB: 3, 0xEC: 0, 0xED: 1, 0xEE: 2, 0xEF: 3, 0xF0: 1, 0xF1: 3, 0xF2: 3, 0xF3: 0, 0xF4: 1, 0xF5: 3, 0xF6: 0,
  0xF7: 3, 0xF8: 3, 0xF9: 3, 0xFA: 1, 0xFB: 2, 0xFC: 0, 0xFD: 0, 0xFE: 0, 0xFF: 0 };

function extractSong(name, file, id) {
  const { A, D } = load(file);
  const w = a => A[a] | (A[a + 1] << 8);
  const QUANT = Array.from(A.slice(0x6F00, 0x6F08)), VEL = Array.from(A.slice(0x6F08, 0x6F18));
  const PITCH = []; for (let i = 0; i < 13; i++) PITCH.push(w(0x0E7A + 2 * i));
  const DIR = D[0x5D] << 8;
  const listStart = w(0x26C1 + 2 * id);
  const timer = A[0xFA] || 0x10;
  const report = [];

  // song list -> ordered list of block addresses, with the loop target
  const blocks = []; let loopIdx = -1;
  {
    let p = listStart, guard = 0; const seen = new Map(); let rep = 0;
    while (guard++ < 500) {
      const v = w(p);
      if (v === 0) break;
      if (v < 0x100) {
        const tgt = w(p + 2);
        if (v >= 0x80) { loopIdx = seen.has(tgt) ? seen.get(tgt) : -1; break; }   // jump forever
        // counted repeat: unroll (count v), N-SPC semantics: play target again v-1 more times? treat as v total passes
        if (rep === 0) rep = v;
        rep--;
        if (rep > 0) { p = tgt; continue; }
        p += 4; continue;
      }
      seen.set(p, blocks.length);
      blocks.push(v); p += 2;
    }
  }

  // channel state persists across blocks
  const ch = [];
  for (let c = 0; c < 8; c++) ch.push({ inst: 0, vol: 0xFF, pan: 10, dur: 0x18, gate: QUANT[7], vel: VEL[15], trans: 0, tune: 0,
    slideDelay: 0, slideLen: 0, slideDelta: 0, vib: 0, notes: [] });
  let tempo = 0x20, master = 0xC0, globTrans = 0, tick = 0;
  const tempoMap = [[0, tempo]];
  const instUsed = new Set();
  let loopTick = -1;

  for (let bi = 0; bi < blocks.length; bi++) {
    if (bi === loopIdx) loopTick = tick;
    const hdr = blocks[bi];
    const tracks = []; for (let c = 0; c < 8; c++) tracks.push(w(hdr + 2 * c));
    let blockLen = -1;
    for (let c = 0; c < 8; c++) {
      if (!tracks[c]) continue;
      if (c > 0 && blockLen < 0) blockLen = 0x7FFFFFFF;
      const S = ch[c];
      let p = tracks[c], t = tick, stack = [], guard = 0, last = null;
      for (;;) {
        if (guard++ > 20000) { report.push('runaway track ' + c); break; }
        if (c > 0 && t >= tick + blockLen) break;     // track 0 ended the block
        let op = A[p++];
        if (op === 0) {
          if (stack.length) {
            const top = stack[stack.length - 1];
            if (--top.count > 0) { p = top.start; continue; }
            p = top.ret; stack.pop(); continue;
          }
          break;
        }
        if (op < 0x80) {
          S.dur = op;
          if (A[p] < 0x80) { const q = A[p++]; S.gate = QUANT[(q >> 4) & 7]; S.vel = VEL[q & 15]; }
          continue;
        }
        if (op < 0xE0) {
          const len = S.dur;
          if (op === 0xC8) {                                  // tie: extend the last note
            if (last) last.dur += len, last.gdur = last.dur - S.dur + Math.max(1, Math.floor(S.dur * S.gate / 256));
          } else if (op === 0xC9) {
            last = null;                                       // rest
          } else {
            let n, inst = S.inst;
            if (op >= 0xCA) { inst = (S.percBase || 0) + (op - 0xCA); n = 0xA4 - 0x80; report.push('perc'); }
            else n = op - 0x80;
            const nn = n + S.trans + globTrans;
            const pitch = calcPitch(nn, S.tune, inst);
            last = { t, dur: len, gdur: Math.max(1, Math.floor(len * S.gate / 256)), n: nn, pitch, inst,
              vol: (S.vel / 255) * (S.vol / 255), pan: S.pan };
            if (S.slideLen) {
              last.slide = { delay: S.slideDelay, len: S.slideLen, pitch: calcPitch(nn + S.slideDelta, S.tune, inst) };
            }
            if (S.pendingSlide) { last.slide = S.pendingSlide; S.pendingSlide = null; }
            S.notes.push(last); instUsed.add(inst);
          }
          t += len;
          continue;
        }
        const n = PARAMS[op]; const a1 = A[p], a2 = A[p + 1], a3 = A[p + 2]; p += n;
        switch (op) {
          case 0xE0: S.inst = a1 >= 0xCA ? a1 - 0xCA + (S.percBase || 0) : a1; break;
          case 0xE1: S.pan = a1 & 0x1F; break;
          case 0xE5: master = a1; break;
          case 0xE7: tempo = a1; tempoMap.push([t, tempo]); break;
          case 0xE9: globTrans = (a1 << 24) >> 24; break;
          case 0xEA: S.trans = (a1 << 24) >> 24; break;
          case 0xED: S.vol = a1; break;
          case 0xEE: S.vol = a2; break;                        // volume fade: jump to target
          case 0xEF: stack.push({ ret: p, start: a1 | (a2 << 8), count: a3 }); p = a1 | (a2 << 8); break;
          case 0xF4: S.tune = a1; break;
          case 0xF1: S.slideDelay = a1; S.slideLen = a2; S.slideDelta = (a3 << 24) >> 24; break;   // pitch envelope to
          case 0xF3: S.slideLen = 0; break;
          case 0xF9:                                           // one-off slide on the last note
            if (last) last.slide = { delay: a1, len: a2, pitch: calcPitch(a3 - 0x80 + S.trans + globTrans, S.tune, last.inst) };
            break;
          case 0xFA: for (const X of ch) X.percBase = a1; break;      // global in N-SPC
          case 0xE3: S.vib = a3; break;
          case 0xE4: S.vib = 0; break;
          default: break;
        }
      }
      if (c === 0) blockLen = t - tick;
      else if (last && last.t + last.dur > tick + blockLen) { last.dur = tick + blockLen - last.t; last.gdur = Math.min(last.gdur, last.dur); }
    }
    if (blockLen === 0x7FFFFFFF || blockLen < 0) blockLen = 0;
    tick += blockLen;
  }
  const total = tick;

  function calcPitch(n, tune, inst) {
    const I = 0x6E00 + 6 * inst;
    const mult = (A[I + 4] << 8) | A[I + 5];
    let nf = n + tune / 256;
    if (nf < 0) nf = 0;
    const oct = Math.floor(nf / 12), semi = nf - oct * 12;
    const si = Math.floor(semi), fr = semi - si;
    let p = PITCH[si] + (PITCH[si + 1] - PITCH[si]) * fr;
    p = p / Math.pow(2, 6 - oct);
    p = p * mult / 256;
    return Math.round(p);                                    // DSP pitch, 0x1000 = 32 kHz
  }

  // ticks -> seconds through the tempo map
  tempoMap.sort((x, y) => x[0] - y[0]);
  const secAt = tk => {
    let s = 0, prevT = 0, tp = tempoMap[0][1];
    for (const [tt, v] of tempoMap) { if (tt > tk) break; s += (tt - prevT) * tickSec(tp); prevT = tt; tp = v; }
    return s + (tk - prevT) * tickSec(tp);
  };
  function tickSec(tp) { return 256 / (tp * (8000 / timer)); }

  const instruments = {};
  for (const i of instUsed) {
    const I = 0x6E00 + 6 * i;
    instruments[i] = { srcn: A[I], adsr1: A[I + 1], adsr2: A[I + 2], gain: A[I + 3] };
  }
  const notes = [];
  ch.forEach((S, c) => S.notes.forEach(nt => {
    const t0 = secAt(nt.t), t1 = secAt(nt.t + nt.gdur);
    const rec = [+t0.toFixed(4), +(t1 - t0).toFixed(4), nt.pitch, +(nt.vol * master / 255).toFixed(3), nt.pan, nt.inst, c];
    if (nt.slide) {
      const s0 = secAt(nt.t + nt.slide.delay) - t0, s1 = secAt(nt.t + nt.slide.delay + nt.slide.len) - t0;
      rec.push([+s0.toFixed(4), +s1.toFixed(4), nt.slide.pitch]);
    }
    notes.push(rec);
  }));
  notes.sort((x, y) => x[0] - y[0]);
  return { A, D, DIR, song: { len: +secAt(total).toFixed(4), loop: loopTick >= 0 ? +secAt(loopTick).toFixed(4) : -1, notes },
    instruments, report: { blocks: blocks.length, loopIdx, ticks: total, tempo: tempoMap.map(x => x[1]).join('/'), notes: notes.length, misc: [...new Set(report)].join(' ') },
    tracksRaw: ch.map(S => S.notes) };
}

/* ---------- main ---------- */
if (require.main === module) {
  const out = { songs: {}, inst: {}, samples: {}, sfxSamples: {} };
  const sampleSrc = {};
  function addSample(A, DIR, srcn) {
    const start = A[DIR + 4 * srcn] | (A[DIR + 4 * srcn + 1] << 8);
    const loopA = A[DIR + 4 * srcn + 2] | (A[DIR + 4 * srcn + 3] << 8);
    const dec = decodeBRR(A, start);
    const loops = (A[dec.endAddr - 9] & 2) !== 0;
    const sig = dec.pcm.length + '_' + dec.pcm.reduce((s2, v, k) => (s2 + v * (k + 1)) | 0, 0);
    if (!sampleSrc[sig]) {
      const id2 = 's' + Object.keys(sampleSrc).length;
      sampleSrc[sig] = id2;
      // signed 8-bit (BRR output is 15-bit, so /128) plus the loop start index
      const bytes = Buffer.alloc(dec.pcm.length);
      dec.pcm.forEach((v, k) => { bytes[k] = (Math.max(-128, Math.min(127, Math.round(v / 128))) + 256) & 255; });
      out.samples[id2] = { loop: loops ? Math.max(0, ((loopA - start) / 9) * 16) : -1, data: bytes.toString('base64') };
    }
    return sampleSrc[sig];
  }
  for (const [name, [file, id]] of Object.entries(SONGS)) {
    const r = extractSong(name, file, id);
    out.songs[name] = r.song;
    const remap = {};
    for (const [i2, ins] of Object.entries(r.instruments)) {
      const ik = name + '.' + i2;
      out.inst[ik] = { s: addSample(r.A, r.DIR, ins.srcn), a1: ins.adsr1, a2: ins.adsr2, g: ins.gain };
      remap[i2] = ik;
    }
    r.song.notes.forEach(n => { n[5] = remap[n[5]]; });
    console.log(name.padEnd(11), JSON.stringify(r.report), 'len', r.song.len, 'loop', r.song.loop);
  }
  // dedupe instruments
  const instKey = {}, instFinal = {}; let k = 0;
  for (const [ik, v] of Object.entries(out.inst)) {
    const js = JSON.stringify(v);
    if (!(js in instKey)) { instKey[js] = 'i' + (k++); instFinal[instKey[js]] = v; }
    out.inst[ik] = instKey[js];
  }
  for (const song of Object.values(out.songs)) song.notes.forEach(n => { n[5] = out.inst[n[5]]; });
  out.inst = instFinal;
  // samples the sound effects need (see extract-sfx.js), from the shared fly-swatting bank
  const sfxFile = path.join(ROOT, 'reference', 'sfx.gen.js');
  if (fs.existsSync(sfxFile)) {
    const SFX = JSON.parse(fs.readFileSync(sfxFile, 'utf8').replace(/^const SFX = /, '').replace(/;s*$/, ''));
    const { A, D } = load(SONGS.level1[0]);
    for (const fx of Object.values(SFX)) for (const n of fx.notes) if (n.s !== undefined) out.sfxSamples[n.s] = addSample(A, D[0x5D] << 8, n.s);
  }
  const txt = 'const MUSIC = ' + JSON.stringify(out) + ';';
  fs.writeFileSync(path.join(ROOT, 'reference', 'music.gen.js'), txt);
  console.log('samples', Object.keys(out.samples).length, 'instruments', Object.keys(out.inst).length, 'bytes', txt.length);
}

module.exports = { extractSong, decodeBRR, load, SONGS };
