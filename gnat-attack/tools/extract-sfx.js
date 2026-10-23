/* Rebuilds the Gnat Attack sound effects as "instrument + pitch + envelope"
   recipes that the game plays from the real BRR samples of Mario Paint's
   fly-swatting sample bank (see extract-music.js).

     node tools/extract-sfx.js       -> writes reference/sfx.gen.js
     node tools/inject.js

   Why: the SFX sequences live in a separate, undocumented part of the
   SPC700 driver, so instead of decoding that code we identify each effect
   from a recording of the real game (reference/sfx-rips/*.wav, ripped by
   Knucklesfan for the open-source "flicewater" recreation).  For every
   note onset in a recording we search every BRR sample in the bank at
   every pitch (1/4-semitone steps over 6 octaves) for the best normalised
   cross-correlation, and record the RMS envelope.  The game then plays
   that sample at that pitch with that envelope.  No recorded audio is
   embedded, only the recipe.                                              */
const fs = require('fs');
const path = require('path');
const { load, decodeBRR } = require('./extract-music.js');

const ROOT = path.join(__dirname, '..');
const RIPS = path.join(ROOT, 'reference', 'sfx-rips');

function readWav(f) {
  const b = fs.readFileSync(f); let p = 12, sr = 44100, data = null, ch = 1;
  while (p < b.length) {
    const id = b.toString('ascii', p, p + 4), len = b.readUInt32LE(p + 4);
    if (id === 'fmt ') { ch = b.readUInt16LE(p + 10); sr = b.readUInt32LE(p + 12); }
    if (id === 'data') data = b.slice(p + 8, p + 8 + len);
    p += 8 + len + (len & 1);
  }
  const n = data.length / (2 * ch), x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = data.readInt16LE(i * 2 * ch) / 32768;
  // resample to 32 kHz (linear)
  const m = Math.floor(n * 32000 / sr), y = new Float32Array(m);
  for (let i = 0; i < m; i++) { const t = i * sr / 32000, k = Math.floor(t), f = t - k; y[i] = (x[k] || 0) * (1 - f) + (x[k + 1] || 0) * f; }
  return y;
}

// bank samples (from the level 1 snapshot; the fly-swatting bank is shared by all Gnat Attack songs)
const { A, D } = load('15 Flyswatter ~ Level 1.spc');
const DIR = D[0x5D] << 8;
const SAMPLES = [];
for (let s = 0; s < 0x1F; s++) {
  const st = A[DIR + 4 * s] | (A[DIR + 4 * s + 1] << 8), lp = A[DIR + 4 * s + 2] | (A[DIR + 4 * s + 3] << 8);
  const d = decodeBRR(A, st);
  const loops = (A[d.endAddr - 9] & 2) !== 0;
  SAMPLES.push({ srcn: s, pcm: Float32Array.from(d.pcm, v => v / 16384), loop: loops ? ((lp - st) / 9) * 16 : -1 });
}
// render sample s at playback rate r (DSP pitch/0x1000) for n output samples
function render(S, r, n) {
  const out = new Float32Array(n); const L = S.pcm.length;
  for (let i = 0; i < n; i++) {
    let t = i * r;
    if (t >= L - 1) { if (S.loop < 0) break; t = S.loop + ((t - S.loop) % (L - S.loop)); }
    const k = Math.floor(t), f = t - k;
    out[i] = S.pcm[k] * (1 - f) + (S.pcm[Math.min(L - 1, k + 1)]) * f;
  }
  return out;
}
function ncc(a, ao, b, n) {
  let ab = 0, aa = 0, bb = 0;
  for (let i = 0; i < n; i++) { const x = a[ao + i] || 0, y = b[i]; ab += x * y; aa += x * x; bb += y * y; }
  return aa && bb ? ab / Math.sqrt(aa * bb) : 0;
}
function rmsEnv(x, hop) {
  const e = [];
  for (let i = 0; i < x.length; i += hop) { let s = 0; for (let k = 0; k < hop; k++) s += (x[i + k] || 0) ** 2; e.push(Math.sqrt(s / hop)); }
  return e;
}
function onsets(env) {                         // RMS rises -> note starts (hop 5 ms)
  const o = [0];
  for (let i = 2; i < env.length; i++) {
    if (env[i] > 0.02 && env[i] > env[i - 2] * 1.8 && i - o[o.length - 1] > 8) o.push(i);
  }
  return o;
}

const FILES = { swing: 'swing', hit: 'hit', bugdie1: 'bugdie1', bugdie2: 'bugdie2', off1: 'bugoffscreen1', off2: 'bugoffscreen2',
  die: 'die', extralife: 'extralife', minibugs: 'minibugs' };
const HOP = 160;                               // 5 ms at 32 kHz
const out = {};
for (const [name, f] of Object.entries(FILES)) {
  const x = readWav(path.join(RIPS, 'gnatattack_' + f + '.wav'));
  let peak = 0; for (const v of x) peak = Math.max(peak, Math.abs(v));
  const env = rmsEnv(x, HOP);
  const ons = onsets(env);
  const notes = [];
  for (let oi = 0; oi < ons.length; oi++) {
    const start = ons[oi] * HOP, end = (oi + 1 < ons.length ? ons[oi + 1] * HOP : x.length);
    // skip silence at the front
    let s0 = start; while (s0 < end && Math.abs(x[s0]) < 0.01) s0++;
    const N = Math.min(1024, end - s0);
    if (N < 128) continue;
    let best = { c: -1 };
    for (const S of SAMPLES) {
      for (let q = -96; q <= 48; q++) {        // quarter-semitones relative to 32 kHz
        const r = Math.pow(2, q / 48);
        const tpl = render(S, r, N);
        for (let lag = 0; lag <= 48; lag += 2) {
          const c = ncc(x, s0 + lag, tpl, N - 48);
          if (c > best.c) best = { c, srcn: S.srcn, r, lag };
        }
      }
    }
    const e0 = Math.floor(s0 / HOP), e1 = Math.ceil(end / HOP);
    const envSeg = env.slice(e0, e1).map(v => +(v / (peak || 1)).toFixed(3));
    let zc = 0; for (let i = s0 + 1; i < end; i++) if ((x[i] >= 0) !== (x[i - 1] >= 0)) zc++;
    const zcHz = Math.round(zc / ((end - s0) / 32000) / 2);
    const rec = { t: +(s0 / 32000).toFixed(4), c: +best.c.toFixed(3), env: envSeg };
    if (best.c >= 0.55) { rec.s = best.srcn; rec.r = +best.r.toFixed(4); }
    else rec.noise = zcHz;                     // no sample fits: the DSP noise generator, filtered to the measured brightness
    notes.push(rec);
  }
  out[name] = { len: +(x.length / 32000).toFixed(3), notes };
  console.log(name.padEnd(10), 'len', out[name].len, notes.map(n => 't' + n.t + (n.noise ? ' noise~' + n.noise + 'Hz' : ' s' + n.s.toString(16) + ' r' + n.r) + ' c' + n.c).join(' | '));
}
fs.writeFileSync(path.join(ROOT, 'reference', 'sfx.gen.js'), 'const SFX = ' + JSON.stringify(out) + ';');
