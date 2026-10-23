/* Decodes Duck Hunt's genuine sound data from the disassembly
   (reference/disasm/Duck-ssembly.asm + the DMC sample files) into
   reference/music.gen.js:  const MUSIC = {...};

   It is a small re-implementation of the NES sound engine at $F40F
   (the "SFX2" fanfare player) run offline, frame by frame, plus per-frame
   tables for the SFX1/SFX3 effect routines.  See the report at the bottom
   of this file (printed when run) and README.md for the format.

     node tools/extract-music.js            writes reference/music.gen.js
*/
const fs = require('fs');
const path = require('path');

const DIS = path.join(__dirname, '..', 'reference', 'disasm');
const CPU = 1789773;

/* ---------- asm -> ordered labelled byte blocks ---------- */
function parseBlocks(text) {
  const blocks = []; const byName = {}; let cur = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/;.*$/, '').trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*):?$/);
    if (m && !/^(db|dw|dwb)$/i.test(m[1])) { cur = { name: m[1], bytes: [] }; blocks.push(cur); byName[m[1]] = cur; continue; }
    const d = line.match(/^(db|dw)\s+(.*)$/i);
    if (!d || !cur) { if (!d) cur = null; continue; }
    for (let tok of d[2].split(',')) {
      tok = tok.trim();
      if (d[1].toLowerCase() === 'dw') {
        cur.bytes.push({ ref: tok }); cur.bytes.push(null);       // 2-byte pointer placeholder
      } else if (/^\$[0-9A-Fa-f]+$/.test(tok)) cur.bytes.push(parseInt(tok.slice(1), 16));
      else if (/^[0-9]+$/.test(tok)) cur.bytes.push(parseInt(tok, 10));
      else cur.bytes.push({ expr: tok });
    }
  }
  return { blocks, byName };
}

const src = fs.readFileSync(path.join(DIS, 'Duck-ssembly.asm'), 'utf8');
const { blocks, byName } = parseBlocks(src);

/* a reader that walks a block and continues into the next blocks in file
   order, as the 6502 would walk on through ROM */
function stream(label) {
  let bi = blocks.indexOf(byName[label]);
  if (bi < 0) throw new Error('no label ' + label);
  const out = [];
  for (; bi < blocks.length && out.length < 4096; bi++) {
    for (const b of blocks[bi].bytes) if (typeof b === 'number') out.push(b);
    if (blocks[bi].name === 'DATA_FF18') break;
  }
  return out;
}

const FREQ = byName.ChannelFrequencyLookup_F300.bytes;       // F300.. (includes the 3 unused bytes)
const LEN = byName.ChannelLengthLookup_F350.bytes;
const NOISE_T = byName.DATA_F400.bytes;                        // indexed by the noise "note"
const NOISE_PERIOD = [4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068];
const LENGTH_COUNTER = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30];
const DMC_RATE = [4181.71, 4709.93, 5264.04, 5593.04, 6257.95, 7046.35, 7919.35, 8363.42, 9419.86, 11186.1, 12604.0, 13982.6, 16884.6, 21306.8, 24858.0, 33143.9];

const r2 = v => Math.round(v * 100) / 100;
const sqHz = t => r2(CPU / (16 * (t + 1)));
const triHz = t => r2(CPU / (32 * (t + 1)));
function timerFor(note) {            // SetChannelFrequency_F552: lo = F301+Y, hi = F300+Y; lo == 0 -> rest
  const lo = FREQ[note + 1], hi = FREQ[note];
  if (lo === undefined || lo === 0) return null;
  return ((hi & 7) << 8) | lo;
}
function noiseDesc(note) {           // CODE_F502 -> $400C/$400E/$400F from DATA_F400
  const v = NOISE_T[note], p = NOISE_T[note + 1], l = NOISE_T[note + 2];
  if (v === undefined) return 0;
  const constant = !!(v & 0x10), vol = v & 15;
  if (constant && vol === 0) return 0;
  return { p: p & 15, short: !!(p & 0x80), hz: r2(CPU / NOISE_PERIOD[p & 15]),
           vol: constant ? vol : 15, decay: constant ? null : vol,
           len: LENGTH_COUNTER[l >> 3] / 2 };     // length counter in frames (half-frame clock)
}

/* ---------- the fanfare player, run offline ---------- */
const HEADERS = byName.FanfareHeaders_F846.bytes;   // 10 offsets (as exprs)
function header(i) {
  const name = 'FanfareHeader_' + (i + 1);
  const b = byName[name].bytes;
  const ptr = k => (b[k] && b[k].ref && b[k].ref !== '$0000' ? b[k].ref : null);
  return { off: b[0], sq1: ptr(1), sq2: ptr(3), tri: ptr(5), noise: ptr(7) };
}

function runTune(hIndex, volReg) {
  const h = header(hIndex);
  const chans = ['sq1', 'sq2', 'tri', 'noise'];
  const st = chans.map((c, x) => ({ c, x, data: h[c] ? stream(h[c]) : null, pos: 0, timer: 1, len: LEN[h.off] || 4,
    loopCount: 0, loopPos: 0, events: [], cur: null, curStart: 0, linear: 0 }));
  let frame = 0, ended = false;
  const MAXF = 60 * 60;
  function emit(s, value) { s.events.push([frame, value]); }
  while (!ended && frame < MAXF) {
    for (const s of st) {
      if (!s.data) continue;
      if (--s.timer !== 0) continue;
      // fetch, handling loop markers (sq2 does not go through CODE_F51C)
      let b;
      for (;;) {
        b = s.data[s.pos++];
        if (s.c === 'sq1' && b === 0) { ended = true; break; }
        if (s.c !== 'sq2') {
          if (b === 0xFF) {
            if (s.loopCount) { s.loopCount--; s.pos = s.loopPos; }
            continue;
          }
          if ((b & 0xC0) === 0xC0) { s.loopCount = (b & 0x3F) - 1; s.loopPos = s.pos; continue; }
        }
        break;
      }
      if (ended) break;
      if (b & 0x80) {                         // ProcessLengthData_F544
        s.len = LEN[(b & 7) + h.off];
        if (s.c === 'tri') { let lc = ((s.len - 2) & 0xFF) * 4; if (lc >= 0x3C || s.len < 2) lc = 0x3C; s.linear = lc; }
        b = s.data[s.pos++];
      }
      if (s.c === 'noise') emit(s, noiseDesc(b));
      else {
        const t = timerFor(b);
        if (t === null) emit(s, 0);
        else emit(s, s.c === 'tri' ? triHz(t) : sqHz(t));
        if (s.c === 'tri') s.lastGate = t === null ? 0 : Math.min(s.len, s.linear / 4);
        s.events[s.events.length - 1].gate = s.c === 'tri' ? s.lastGate : undefined;
      }
      s.timer = s.len;
    }
    if (ended) break;
    frame++;
  }
  const total = frame;
  const out = { frames: total };
  for (const s of st) {
    if (!s.data) continue;
    const arr = [];
    s.events.forEach((e, i) => {
      const end = i + 1 < s.events.length ? s.events[i + 1][0] : total;
      if (end <= e[0]) return;
      arr.push(end - e[0], e[1]);
    });
    out[s.c] = arr;
    if (s.c === 'tri') out.triGate = s.events.filter((e, i) => (i + 1 < s.events.length ? s.events[i + 1][0] : total) > e[0]).map(e => r2(e.gate || 0));
  }
  // envelope: $E9/$EA from CODE_F3D0 (both squares), triangle gate, noise per note
  const env = v => ({ duty: v >> 6, constant: !!(v & 0x10), vol: (v & 0x10) ? (v & 15) : 15, decay: (v & 0x10) ? null : (v & 15),
                      decaySeconds: (v & 0x10) ? null : r2(15 * ((v & 15) + 1) / 240) });
  out.env = { sq1: env(volReg), sq2: env(volReg), tri: { gate: 'triGate frames per note (linear counter (len-2)*4 capped $3C, 240 Hz)' } };
  out.loop = false;
  out.header = 'FanfareHeader_' + (hIndex + 1);
  return out;
}

// queue bit -> InitSpecialSound Y (header index) and $E9/$EA (CODE_F7CC .. CODE_F840)
const TUNES = {
  clayStart:      { h: 0, v: 0xC0, queue: 'SFX_Queue2_ClayShootingStartTheme' },
  title:          { h: 3, v: 0x86, queue: 'SFX_Queue2_TitleTheme' },
  gameOver:       { h: 4, v: 0xC0, queue: 'SFX_Queue2_GameOverTheme' },
  gotDuck:        { h: 5, v: 0xC0, queue: 'SFX_Queue2_GotDuckJingle' },
  duckStart:      { h: 1, v: 0xC0, queue: 'SFX_Queue2_DuckGameStartTheme' },
  hitShuffle:     { h: 7, v: 0xC0, queue: 'SFX_Queue2_HitTableShuffle' },
  roundClear:     { h: 2, v: 0xC0, queue: 'SFX_Queue2_BeatRoundTheme' },
  pause:          { h: 6, v: 0x86, queue: 'SFX_Queue2_PauseJingle' },
  gameOverJingle: { h: 8, v: 0x86, queue: 'SFX_Queue3_GameOverJingle' },
  perfect:        { h: 9, v: 0xC0, queue: 'SFX_Queue3_PerfectJingle' }
};

/* ---------- SFX: per-frame tables ---------- */
function sqSweepSim(regs, frames) {   // regs: $4000-$4003 values; simulate sweep/envelope/length per frame
  const [v, sw, lo, hi] = regs;
  let t = ((hi & 7) << 8) | lo;
  let lenCtr = LENGTH_COUNTER[hi >> 3];
  const constant = !!(v & 0x10), envP = v & 15, loopEnv = !!(v & 0x20), halt = !!(v & 0x20);
  let vol = 15, envDiv = envP;
  const swOn = !!(sw & 0x80), swP = (sw >> 4) & 7, neg = !!(sw & 8), sh = sw & 7;
  let swDiv = swP;
  const out = [];
  for (let f = 0; f < frames; f++) {
    const silent = lenCtr === 0 || t < 8 || t > 0x7FF;
    out.push([silent ? 0 : sqHz(t), silent ? 0 : (constant ? envP : vol), v >> 6]);
    for (let q = 0; q < 4; q++) {                               // 4 quarter-frames
      if (!constant) { if (envDiv === 0) { envDiv = envP; if (vol > 0) vol--; else if (loopEnv) vol = 15; } else envDiv--; }
      if (q === 1 || q === 3) {                                 // half-frames
        if (!halt && lenCtr > 0) lenCtr--;
        if (swOn && sh) { if (swDiv === 0) { swDiv = swP; const d = t >> sh; t = neg ? t - d - 1 : t + d; } else swDiv--; }
      }
    }
  }
  return out;
}
function trimSilentTail(a) { while (a.length && a[a.length - 1][1] === 0) a.pop(); return a; }

function sfx() {
  const B = n => byName[n].bytes;
  const out = {};
  // zapper shot: noise $3F,$7F,$0F,$08 then every 2nd frame period=F731[i], vol=F761[i] for 48 steps
  {
    const per = B('DATA_F731'), vol = B('DATA_F761'); const frames = [];
    let p = 0x0F, v = 15;
    frames.push([p, v]);
    for (let i = 0; i < 48; i++) { frames.push([p, v]); p = per[i]; v = vol[i] & 15; frames.push([p, v]); }
    frames.length = Math.min(frames.length, 97);
    out.zapperShot = { ch: 'noise', note: 'per frame [noisePeriodIndex, constVolume]; period index -> hz = 1789773/NOISE_PERIOD[i]',
                       noisePeriod: NOISE_PERIOD, frames };
  }
  // wing flap: noise $00 (decay env, period 0), period 3; per frame periods 0,2,1,0
  {
    const seq = B('DATA_F6CB'); const frames = [[3, 15]];
    let vol = 15;
    for (let i = 0; i < 4; i++) { vol = Math.max(0, 15 - 4 * (i + 1)); frames.push([seq[i], vol]); }
    out.wingFlap = { ch: 'noise', note: 'queued every 8 frames while flying; envelope decays 15->0 in 15/240 s (period 0)', frames, decaySeconds: r2(15 / 240) };
  }
  // duck fall: sq1 $92,$D5,$40,$C0 (const vol 2, sweep up in period = pitch falls)
  out.duckFall = { ch: 'sq1', regs: B('DATA_F3EF'), note: 'per frame [hz, vol, duty]', frames: trimSilentTail(sqSweepSim(B('DATA_F3EF'), 200)) };
  // ground thud: sq1 $84,$93,$70,$E3 + sq2 $84,$93,$72,$E3
  out.groundThud = { ch: 'sq1+sq2', note: 'two squares 2 timer units apart; per frame [hz, vol, duty]',
    sq1: trimSilentTail(sqSweepSim(B('DATA_F7A0'), 60)), sq2: trimSilentTail(sqSweepSim(B('DATA_F7A4'), 60)) };
  // clay throw: sq1 $9F,$7F,$60,$00 + sq2 $9F,$7F,$61,$00
  out.clayThrow = { ch: 'sq1+sq2', sq1: trimSilentTail(sqSweepSim(B('DATA_F5B7'), 30)), sq2: trimSilentTail(sqSweepSim(B('DATA_F5BB'), 30)) };
  // clay fall: sq2 $B2,$DF,$FF,$80
  out.clayFall = { ch: 'sq2', note: 'length counter halted; CODE_F655 silences it after $A0*2 frames', frames: trimSilentTail(sqSweepSim(B('DATA_F3F3'), 320)) };
  // clay hit: noise $02,$7F,$0F,$08 (decay period 2, noise period 15)
  out.clayHit = { ch: 'noise', frames: [[15, 15]], decaySeconds: r2(15 * 3 / 240) };
  // dog laugh: triangle, CODE_F5DB
  {
    const notes = B('DATA_F3E1'); const frames = [];
    let t = 0x3E, eb = 0, ef = 6, ed = 0, sinceReload = 0;
    frames.push([triHz(t), 1]);
    for (let f = 0; f < 200; f++) {
      eb++;
      if (eb !== ef) { t -= 3; sinceReload++; }
      else { ef += 6; t = notes[ed++]; sinceReload = 0; if (ed === 14) { frames.push([0, 0]); break; } }
      // linear counter $13 = 19 quarter frames ~ 4.75 frames of sound after each $400B write
      frames.push([triHz(t), sinceReload < 4 ? 1 : 0]);
    }
    out.dogLaugh = { ch: 'tri', note: 'per frame [hz, gate]; each "ha" restarts the linear counter (19/240 s)', frames };
  }
  return out;
}

/* ---------- DMC samples ---------- */
function dmc(file, label, rateIdx) {
  const { byName: bn } = parseBlocks(fs.readFileSync(path.join(DIS, file), 'utf8'));
  const bytes = bn[label].bytes.filter(b => typeof b === 'number');
  const length = 0x20 * 16 + 1;                    // $4013 = $20 -> 513 bytes
  const data = Buffer.from(bytes.slice(0, length));
  return { rate: DMC_RATE[rateIdx], rateIndex: rateIdx, start: 0, bytes: data.length,
           note: '$4010=$' + rateIdx.toString(16).toUpperCase() + ', $4013=$20 (513 bytes); $4011 not written by the player (0 after InitSpecialSound)',
           data: data.toString('base64') };
}

/* ---------- main ---------- */
const MUSIC = { tunes: {}, sfx: sfx(), dmc: {
  quack: dmc('Quack.asm', 'DMCSample_DuckQuack_FD00', 0x0F),
  bark: dmc('Bark.asm', Object.keys(parseBlocks(fs.readFileSync(path.join(DIS, 'Bark.asm'), 'utf8')).byName)[0], 0x0E)
}, format: 'tunes.X.{sq1,sq2,tri,noise} = flat [frames, value, ...] at 60 Hz; sq/tri value = Hz (0 rest); noise value = 0 or {p,short,hz,vol,decay,len}; triGate[i] = audible frames of tri note i' };
for (const [k, t] of Object.entries(TUNES)) MUSIC.tunes[k] = Object.assign({ queue: t.queue }, runTune(t.h, t.v));

const js = 'const MUSIC = ' + JSON.stringify(MUSIC) + ';\n';
fs.writeFileSync(path.join(__dirname, '..', 'reference', 'music.gen.js'), js);

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const nn = f => { if (!f) return '-'; const m = Math.round(69 + 12 * Math.log2(f / 440)); return NAMES[m % 12] + (Math.floor(m / 12) - 1); };
for (const [k, t] of Object.entries(MUSIC.tunes)) {
  const cnt = c => (t[c] ? t[c].length / 2 : 0);
  console.log(k.padEnd(15), t.header.padEnd(16), 'frames', String(t.frames).padStart(4), ' notes sq1', cnt('sq1'), 'sq2', cnt('sq2'), 'tri', cnt('tri'), 'noise', cnt('noise'));
}
const show = (name, ch) => { const a = MUSIC.tunes[name][ch]; const s = []; for (let i = 0; i < a.length && s.length < 20; i += 2) s.push(nn(a[i + 1]) + '/' + a[i]); console.log(name, ch + ':', s.join(' ')); };
show('title', 'sq1'); show('title', 'sq2'); show('duckStart', 'sq2'); show('gotDuck', 'sq1');
for (const [k, v] of Object.entries(MUSIC.sfx)) console.log('sfx', k, (v.frames || v.sq1 || []).length, 'frames');
console.log('dmc quack', MUSIC.dmc.quack.bytes, 'bytes @', MUSIC.dmc.quack.rate, ' bark', MUSIC.dmc.bark.bytes, '@', MUSIC.dmc.bark.rate);
console.log('wrote reference/music.gen.js', js.length, 'chars');
