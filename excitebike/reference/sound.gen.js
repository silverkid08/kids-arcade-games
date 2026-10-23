/* Excitebike sound player (WebAudio) for the data in reference/music.gen.js.
   Paste after `const MUSIC = {...};` inside the same IIFE; MUSIC is a free
   global here.  No fetch, no modules; safe without AudioContext (node):
   play() then only records the name in Sound.log.

   API
     Sound.init()                  create/resume the AudioContext (call from a user gesture)
     Sound.play(name)              music replaces music; effects take over their channel(s)
     Sound.stopMusic() / Sound.stopAll()
     Sound.engine(on, speedHi, speedLo, opts)   call once per game frame during a race
         on       = engine started (ROM $03A9, set by the first A/B press)
         speedHi  = rider speed hi  (ROM $94),  speedLo = speed lo (ROM $90)
         opts     = { airborne ($B0!=0), throttle (A held, $5C bit7),
                      turboHot (B-only held with temperature $03B6>=$1A, E3BF) }
     Sound.engineRaw(fc)           drive the engine with a raw ROM $FC value instead
     Sound.setMuted(b), Sound.isMuted(), Sound.log (names played)

   Sounds (name: ROM request -> game code that writes it; length in frames @60Hz)
   Music, $FB (sub_FC8D; while any music plays the ROM ignores $FF effects):
     title      $FB=$01  C2CF title screen after power-on; also CBF8 results when NOT
                         qualified (rank>3).  The tune keeps playing into the race
                         screen if the race is picked quickly (there is no separate
                         pre-race tune).                                       478
     qualify    $FB=$02  CBF8 results screen, rank 1-3 (qualified).  $08/$10 alias. 450
     design     $FB=$04  C3F5 entering DESIGN mode from the title menu         450
     raceStart  $FB=$20  DE64 start countdown beeps (3 low + 1 high)            186
     overheat   $FB=$40  EADE temperature bar in the red ($3A>=$0D): requested
                         11 of every 22 frames (each request restarts it);
                         also CCE4 (overheated), C447, EB9B                      10
     pause      $FB=$80  CA4A START pressed (pause and unpause); the game mutes
                         $4015 40 frames after pausing                           58
   Pulse-1 effects, $FF (sub_F8D4):
     menuMove   $FF=$01  C819 title/design menu cursor, EBE1/EC1E design piece select 1
     land       $FF=$02  DC37 player lands after a jump                          14
     jumpFast   $FF=$08  DD6C take-off from a ramp, speed hi $94=3               33
     jump       $FF=$10  DD6C take-off, $94=2 or 0 (also $30/$70)                16
     jumpSlow   $FF=$20  DD6C take-off, $94=1 (value = ($94<<4)^$30, 0->$08)    10
     pass       $FF=$40  DED3 a CPU rider leaves the zone beside the player     32
     blip       $FF=$04  never requested by the game (unused)                     5
   Pulse-2 (+triangle) effect, $FE (sub_FA74):
     rev        $FE=$01  CD51 first throttle press (engine start); DE4C every frame
                         while A/B is held at the start line (restarts it)        26
   Noise effects, $FD (sub_FC3D):
     crash      $FD=$01  DDE7 tumbling (every 4 frames), E07C, E0DF              45
     crowd      $FD=$02  EABB crossing the finish line, D97C back on the bike   249
     laneChange $FD=$04  CE18 steering up/down (every frame while held), EA41   11

   ENGINE (pulse 2, plus a 1-frame triangle "thump" when no music uses the
   triangle).  Game side, sub_DEE2 (once per frame, only on even $4C):
       if $03A9==0: $FC=0
       v  = low byte of ((($94<<8)|$90) >> 3)
       d  = $B0 (airborne) ? 4 : 2
       X  = (v-2) negative ? 1 : max(1, floor((v-2)/d))           (sub_DFA4)
       if X>=$2F: X = ($3F & 8) ? $2F : $2E                        (top-speed flutter)
       if !($5C & $80) (A not held): X |= $80                      (coast voice)
       $FC = X;  then E3C2: $FC |= $B0 when turbo-hot (see above).
   Sound side, sub_FA74 (ported literally below in engStep):
       target = $FC&$7F; index $F3 slews toward it (+-1, +-2 if >=8 away,
       clamps to $30 when target>=$30) whenever counter $F7 reaches $07F8;
       $07F8 = 1 while slewing, else tbl_F9F4[$F3] (cycle length).
       pitch byte = tbl_F9C4[$F3] + tbl_F9B3[$F7] (vibrato), converted by the
       routine at FAF7: period = ($7FF >> (b>>5)) minus binary fractions of
       itself selected by the low 5 bits -> $4006/$4007 (rewritten every frame).
       $4004 = tbl_F9B9[$F7] (50% duty, vol 4..1) with $4005=$7F, or when
       $FC bit7 (coasting) tbl_F9BF[$F7] with sweep $4005=$89 (pitch falls
       within the frame).  Indexes past the 6-byte tables read on into the
       following ROM bytes, exactly as the ROM does (TBL below).
       When $F7==0 and no music triangle ($FA==0): triangle period =
       3/4 of the pulse period, $4008=4 (one-frame blip).
*/
const Sound = (function () {
  'use strict';
  const CPU = 1789773, FRAME = 1 / 60.0988;
  const NOISE_PERIOD = [4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068];
  const LENGTH = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30];
  // ROM bytes $F9B3..$FA4E (engine tables tbl_F9B3/F9B9/F9BF/F9C4/F9F4 and what follows)
  const TBL_HEX = '0002040200fe9496949392911c54165212181820283032343638393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f700504030202020202020202020202020202020202020202020202020202020201010101010101010101010101010101009496989c80808080809e9d9c9b9a9998979695959430384048505458504c4844403c3834302c2a282624';
  const TBL = []; for (let i = 0; i < TBL_HEX.length; i += 2) TBL.push(parseInt(TBL_HEX.substr(i, 2), 16));
  const R = a => TBL[a - 0xF9B3] | 0;

  const log = [];
  let ac = null, master = null, muted = false, timer = null, nextT = 0;
  let V = null;                                  // WebAudio voices
  let music = null;                              // {name, d, f}
  const sfx = { p1: null, p2: null, tr: null, no: null };
  const expanded = {};

  /* ---------- engine: literal port of sub_FA74 (engine branch) ---------- */
  const eng = { fc: 0, F3: 0, F7: 0, F8: 0, frame: 0 };
  function enginePeriod(b) {                    // FAF7..FB46
    let r = 0x7FF >> (b >> 5), h = r >> 1, f = (b << 3) & 0xFF;
    do { h >>= 1; const c = f & 0x80; f = (f << 1) & 0xFF; if (c) r = (r - h) & 0xFFFF; } while (f);
    return r;
  }
  function engStep(fc, musicTri) {              // returns this frame's APU writes
    const a = fc & 0x7F, w = [];
    if (!a) { if (eng.F3) { eng.F3 = eng.F7 = eng.F8 = 0; w.push([0x4004, 0x90]); } return w; }
    const y = eng.F7; eng.F7 = (eng.F7 + 1) & 0xFF;
    if (y === eng.F8) {
      if (a >= 0x30) { eng.F3 = 0x30; eng.F8 = R(0xF9F4 + eng.F3); }
      else {
        const d = (a - eng.F3) & 0xFF;
        if (d === 0) eng.F8 = R(0xF9F4 + eng.F3);
        else {
          let up = a > eng.F3;
          if (!up) { eng.F3--; if (d < 0xF8) { eng.F3--; if (eng.F3 === 0) up = true; } }
          if (up) { eng.F3++; if (d >= 8) eng.F3++; }
          eng.F8 = 1;
        }
      }
      eng.F7 = 0;
    }
    const b = (R(0xF9C4 + eng.F3) + R(0xF9B3 + eng.F7)) & 0xFF;
    let x, s;
    if (fc & 0x80) { x = R(0xF9BF + eng.F7); s = 0x89; } else { x = R(0xF9B9 + eng.F7); s = 0x7F; }
    const p = enginePeriod(b);
    w.push([0x4004, x], [0x4005, s], [0x4006, p & 0xFF], [0x4007, p >> 8]);
    if (eng.F7 === 0 && !musicTri) {
      const h = p >> 1, t = h + (h >> 1);
      w.push([0x400A, t & 0xFF], [0x400B, t >> 8], [0x4008, 4]);
    }
    return w;
  }
  function engineFC(on, hi, lo, o) {           // sub_DEE2 (+E3C2)
    o = o || {};
    if (!on) return 0;
    const v = ((((hi & 0xFF) << 8) | (lo & 0xFF)) >> 3) & 0xFF;
    const d = o.airborne ? 4 : 2, a = (v - 2) & 0xFF;
    let x = (a & 0x80) ? 1 : (Math.floor(a / d) || 1);
    if (x >= 0x2F) x = (eng.frame & 8) ? 0x2F : 0x2E;
    if (!o.throttle) x |= 0x80;
    if (o.turboHot) x |= 0xB0;
    return x;
  }

  /* ---------- tiny APU (pulse 2 + triangle) for the engine voice ---------- */
  const ap = { duty: 0, halt: 0, cv: 0, vp: 0, es: 0, ed: 0, dec: 0, sEn: 0, sP: 0, sN: 0, sS: 0, sR: 0, sD: 0, t: 0, len: 0,
    tc: 0, tl: 0, lin: 0, tr: 0, tt: 0, tlen: 0 };
  const tgt = () => ap.sN ? ap.t - (ap.t >> ap.sS) : ap.t + (ap.t >> ap.sS);
  const pmute = () => ap.t < 8 || tgt() > 0x7FF;
  function apQ() {
    if (ap.es) { ap.es = 0; ap.dec = 15; ap.ed = ap.vp; } else if (ap.ed === 0) { ap.ed = ap.vp; if (ap.dec) ap.dec--; else if (ap.halt) ap.dec = 15; } else ap.ed--;
    if (ap.tr) ap.lin = ap.tl; else if (ap.lin) ap.lin--;
    if (!ap.tc) ap.tr = 0;
  }
  function apH() {
    if (!ap.halt && ap.len) ap.len--;
    if (ap.sD === 0 && ap.sEn && ap.sS && !pmute()) ap.t = tgt();
    if (ap.sD === 0 || ap.sR) { ap.sD = ap.sP; ap.sR = 0; } else ap.sD--;
    if (!ap.tc && ap.tlen) ap.tlen--;
  }
  function apW(a, v) {
    switch (a) {
      case 0x4004: ap.duty = v >> 6; ap.halt = (v >> 5) & 1; ap.cv = (v >> 4) & 1; ap.vp = v & 15; break;
      case 0x4005: ap.sEn = v >> 7; ap.sP = (v >> 4) & 7; ap.sN = (v >> 3) & 1; ap.sS = v & 7; ap.sR = 1; break;
      case 0x4006: ap.t = (ap.t & 0x700) | v; break;
      case 0x4007: ap.t = (ap.t & 0xFF) | ((v & 7) << 8); ap.len = LENGTH[v >> 3]; ap.es = 1; break;
      case 0x4008: ap.tc = v >> 7; ap.tl = v & 0x7F; break;
      case 0x400A: ap.tt = (ap.tt & 0x700) | v; break;
      case 0x400B: ap.tt = (ap.tt & 0xFF) | ((v & 7) << 8); ap.tlen = LENGTH[v >> 3]; ap.tr = 1; break;
    }
  }
  function apS() {
    return { t: ap.t, vol: (ap.len && !pmute()) ? (ap.cv ? ap.vp : ap.dec) : 0, duty: ap.duty, tri: (ap.tlen && ap.lin && ap.tt >= 2) ? ap.tt : 0 };
  }
  function engineFrame(musicTri) {             // -> 4 quarter-frame samples
    apQ(); apH();                               // $4017=$C0 at the top of the NMI
    for (const [a, v] of engStep(eng.fc, musicTri)) apW(a, v);
    const s = [apS()]; apQ(); s.push(apS()); apQ(); apH(); s.push(apS()); apQ(); s.push(apS());
    return s;
  }
  function engineReset() { eng.F3 = eng.F7 = eng.F8 = 0; ap.len = 0; ap.tlen = 0; ap.lin = 0; }

  /* ---------- data helpers ---------- */
  function expand(name) {                       // RLE -> per-frame arrays
    if (expanded[name]) return expanded[name];
    const m = MUSIC[name], out = { len: m.len, ch: {} };
    const W = { p1: 3, p2: 3, tr: 1, no: 3 };
    for (const c in W) {
      if (!m[c]) continue;
      const a = [], r = m[c], k = W[c];
      for (let i = 0; i < r.length; i += k + 1) for (let j = 0; j < r[i]; j++) a.push(r.slice(i + 1, i + 1 + k));
      out.ch[c] = a;
    }
    return (expanded[name] = out);
  }

  /* ---------- WebAudio ---------- */
  function pulseWave(duty) {
    const d = [0.125, 0.25, 0.5][duty], n = 64, re = new Float32Array(n), im = new Float32Array(n);
    for (let k = 1; k < n; k++) { re[k] = Math.sin(2 * Math.PI * k * d) / (k * Math.PI); im[k] = (1 - Math.cos(2 * Math.PI * k * d)) / (k * Math.PI); }
    return ac.createPeriodicWave(re, im);
  }
  function noiseBuf(short) {                    // one LFSR step per sample
    const len = short ? 93 * 128 : 32767, b = ac.createBuffer(1, len, ac.sampleRate), d = b.getChannelData(0);
    let reg = 1;
    for (let i = 0; i < len; i++) { const fb = (reg & 1) ^ ((reg >> (short ? 6 : 1)) & 1); reg = (reg >> 1) | (fb << 14); d[i] = (reg & 1) ? -1 : 1; }
    return b;
  }
  function makeVoices() {
    const g = v => { const n = ac.createGain(); n.gain.value = 0; n.connect(master); return n; };
    const pulse = () => {
      const ch = { osc: [], gain: [] };
      for (let d = 0; d < 3; d++) { const o = ac.createOscillator(); o.setPeriodicWave(pulseWave(d)); const gn = g(); o.connect(gn); o.start(); ch.osc.push(o); ch.gain.push(gn); }
      return ch;
    };
    const tri = ac.createOscillator(); tri.type = 'triangle'; const trg = g(); tri.connect(trg); tri.start();
    const nz = [false, true].map(s => { const src = ac.createBufferSource(); src.buffer = noiseBuf(s); src.loop = true; const gn = g(); src.connect(gn); src.start(); return { src, gain: gn }; });
    return { p1: pulse(), p2: pulse(), tr: { osc: tri, gain: trg }, no: nz };
  }
  function init() {
    if (ac) { if (ac.state === 'suspended' && ac.resume) ac.resume(); return; }
    const W = typeof window !== 'undefined' ? window : {};
    const AC = W.AudioContext || W.webkitAudioContext;
    if (!AC) return;
    try {
      ac = new AC();
      master = ac.createGain(); master.gain.value = muted ? 0 : 0.5; master.connect(ac.destination);
      V = makeVoices();
      nextT = ac.currentTime + 0.05;
      timer = setInterval(tick, 20);
    } catch (e) { ac = null; V = null; }
  }

  function setPulse(ch, t, st) {                // st = [period, vol, duty]
    const on = st && st[1] > 0 && st[0] >= 8;
    const hz = on ? CPU / (16 * (st[0] + 1)) : 0;
    const duty = on ? (st[2] === 3 ? 1 : st[2]) : -1;
    for (let d = 0; d < 3; d++) {
      if (on) ch.osc[d].frequency.setValueAtTime(hz, t);
      ch.gain[d].gain.setValueAtTime(d === duty ? st[1] / 15 * 0.12 : 0, t);
    }
  }
  function setTri(t, period) {
    if (period) V.tr.osc.frequency.setValueAtTime(CPU / (32 * (period + 1)), t);
    V.tr.gain.gain.setValueAtTime(period ? 0.16 : 0, t);
  }
  function setNoise(t, st) {                    // [idx, mode, vol]
    const on = st && st[2] > 0;
    for (let s = 0; s < 2; s++) {
      const v = V.no[s];
      if (on && st[1] === s) v.src.playbackRate.setValueAtTime(CPU / NOISE_PERIOD[st[0] & 15] / ac.sampleRate, t);
      v.gain.gain.setValueAtTime(on && st[1] === s ? st[2] / 15 * 0.1 : 0, t);
    }
  }
  const cur = (o, c) => o && o.d.ch[c] ? o.d.ch[c][Math.min(o.f, o.d.len - 1)] : null;

  function renderFrame(t) {
    const musicTri = !!(music && music.d.ch.tr);
    // pulse 1
    if (sfx.p1) setPulse(V.p1, t, cur(sfx.p1, 'p1')); else setPulse(V.p1, t, cur(music, 'p1'));
    // pulse 2 / triangle: effect > engine > music (triangle: effect > music > engine thump)
    let engQ = null;
    if (!sfx.p2 && (eng.fc & 0x7F || eng.F3)) engQ = engineFrame(musicTri);
    if (sfx.p2) setPulse(V.p2, t, cur(sfx.p2, 'p2'));
    else if (engQ) for (let q = 0; q < 4; q++) setPulse(V.p2, t + q * FRAME / 4, [engQ[q].t, engQ[q].vol, engQ[q].duty]);
    else setPulse(V.p2, t, cur(music, 'p2'));
    if (sfx.tr) setTri(t, cur(sfx.tr, 'tr')[0]);
    else if (musicTri) setTri(t, cur(music, 'tr')[0]);
    else if (engQ) for (let q = 0; q < 4; q++) setTri(t + q * FRAME / 4, engQ[q].tri);
    else setTri(t, 0);
    setNoise(t, sfx.no ? cur(sfx.no, 'no') : cur(music, 'no'));
    // advance
    if (music && ++music.f >= music.d.len) music = null;
    const seen = new Set();
    for (const c in sfx) { const o = sfx[c]; if (o && !seen.has(o)) { seen.add(o); o.f++; } }
    for (const c in sfx) if (sfx[c] && sfx[c].f >= sfx[c].d.len) sfx[c] = null;
    eng.frame++;
  }
  function tick() {
    if (!ac || !V) return;
    const now = ac.currentTime;
    if (nextT < now - 0.25) nextT = now + 0.02;            // tab was asleep
    while (nextT < now + 0.1) { renderFrame(nextT); nextT += FRAME; }
  }

  function play(name) {
    log.push(name);
    const m = typeof MUSIC !== 'undefined' && MUSIC[name];
    if (!m) return;
    if (m.grp === 'music') { music = { name, d: expand(name), f: 0 }; sfx.p1 = null; return; }
    if (m.grp === 'p1' && music) return;                   // sub_F8D4 is skipped while music plays
    const o = { name, d: expand(name), f: 0 };
    for (const c in o.d.ch) sfx[c] = o;
  }
  function stopMusic() { music = null; }
  function stopAll() { music = null; for (const c in sfx) sfx[c] = null; eng.fc = 0; engineReset(); }
  function engine(on, speedHi, speedLo, opts) { eng.fc = engineFC(on, speedHi | 0, speedLo | 0, opts); if (!eng.fc) engineReset(); }
  function engineRaw(fc) { eng.fc = fc & 0xFF; if (!eng.fc) engineReset(); }
  function setMuted(b) { muted = !!b; if (master && ac) master.gain.setValueAtTime(muted ? 0 : 0.5, ac.currentTime); }
  function isMuted() { return muted; }

  return { init, play, stopMusic, stopAll, engine, engineRaw, setMuted, isMuted, log,
    _test: { engStep, enginePeriod, engineFC, engineFrame, eng, names: () => Object.keys(MUSIC) } };
})();
