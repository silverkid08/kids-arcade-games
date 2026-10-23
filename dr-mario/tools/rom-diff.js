/* Differential test: the JavaScript port against the REAL Dr. Mario program.

   The ROM assembled byte-exact from the disassembly (reference/build) runs in
   the offline 6502/NES emulator (tools/nes.js) side by side with the game
   from index.html (Original preset).  Both start from the same options
   screen with the same RNG state and frame counter, get exactly the same
   controller input every frame (a bot plays), and are compared right before
   every NMI: game mode, frame counter, RNG, the whole bottle, the falling
   and next capsule, the action state machine, speed-ups, score, viruses,
   the big viruses, Mario's throw frame, the sprite list (OAM) and the bottle
   rows in VRAM.  Any difference stops the run and is printed.

     node tools/rom-diff.js            (all configurations, ~1 min)
     node tools/rom-diff.js 0 2 30000  (level 0, HI, 30000 frames)

   Needs reference/build/drmario.nes (tools/build-rom.js makes it). */
'use strict';
require('./harness.js');
const fs = require('fs');
const { NES, loadSymbols, ROM_FILE } = require('./nes.js');
const { build } = require('./build.js');

if (!fs.existsSync(ROM_FILE)) { console.log('rom-diff: ' + ROM_FILE + ' missing (run node tools/build-rom.js); skipped'); process.exit(0); }
const sym = loadSymbols();
const R = n => { if (!(n in sym)) throw new Error('symbol ' + n); return sym[n] & 0x7FF; };
const rev8 = v => { let r = 0; for (let i = 0; i < 8; i++) if (v & (1 << i)) r |= 1 << (7 - i); return r; };
const fromBCD = v => (v >> 4) * 10 + (v & 15);

function runConfig(level, speed, nFrames, seed, quiet) {
  const D = build();
  const { G, P, BTN } = D;
  localStorage._d = {};
  D.applyPreset('original');
  D.settings.level = level; D.settings.speed = speed; D.settings.music = 0;

  /* ---- ROM: boot, title, options ---- */
  const nes = new NES();
  let snap = null;
  const takeSnap = () => { snap = { ram: nes.ram.slice(), vram: nes.vram.slice(0, 0x400) }; };
  /* the ROM waits for the NMI in loops "lda nmiFlag / beq -4"; find them so lag frames can be told apart */
  const idle = new Set(), nf = R('nmiFlag');
  for (let a = 0x8000; a < 0xFFFC; a++) if (nes.read(a) === 0xA5 && nes.read(a + 1) === nf && nes.read(a + 2) === 0xF0 && nes.read(a + 3) === 0xFC) { idle.add(a); idle.add(a + 2); }
  /* one NMI's worth of ROM time: frames with NMI disabled (screen copies) do not count, like on the NES */
  const romFrame = padVal => {
    nes.pad[0] = rev8(padVal);
    const cpu = nes.cpu;
    for (let guard = 0; guard < 10; guard++) {
      const start = cpu.cycles;
      while (cpu.cycles < start + 27280) cpu.step();
      const nmiOn = nes.ppuctrl & 0x80;
      let lag = false;
      if (nmiOn) { takeSnap(); lag = !idle.has(cpu.pc); }
      nes.vblank = 1; if (nmiOn) cpu.nmi();
      while (cpu.cycles < start + 29781) cpu.step();
      nes.vblank = 0; nes.frame++;
      if (nmiOn) return { lag };
    }
    throw new Error('NMI stayed off');
  };
  for (let i = 0; i < 120; i++) romFrame(0);
  romFrame(BTN.start); romFrame(BTN.start); for (let i = 0; i < 60; i++) romFrame(0);
  if (nes.ram[R('mode')] !== 1) throw new Error('ROM not in options');
  nes.ram[R('p1_level')] = level; nes.ram[R('p1_speedSetting')] = speed; nes.ram[R('musicType')] = 0;
  romFrame(0);                                    // one more options frame with the new values

  /* ---- JS: options screen ---- */
  D.startPlaying();
  for (let i = 0; i < 40; i++) D.step();
  if (G.romMode !== 1) throw new Error('JS not in options');
  G.level = level; G.speed = speed; G.musicType = 0;

  /* ---- sync: the frame in which START is pressed ---- */
  romFrame(BTN.start);                            // snapshot = after this frame's options logic, before its NMI
  G.gen.next();                                   // JS: same point
  G.rng0 = snap.ram[R('rng0')]; G.rng1 = snap.ram[R('rng1')]; G.frameCounter = snap.ram[R('frameCounter')];
  // cosmetic state carried over from the title / options screens
  G.danceFrame = snap.ram[R('danceFrame')]; G.circPos = snap.ram[R('bigVirus_circularPos')];
  ['Yellow', 'Red', 'Blue'].forEach((c, i) => { G.big.x[i] = snap.ram[R('bigVirus' + c + '_XPos')]; G.big.y[i] = snap.ram[R('bigVirus' + c + '_YPos')]; });
  D.Sound.nrnd[0] = snap.ram[R('sfx_rndNoisePeriod')]; D.Sound.nrnd[1] = snap.ram[R('sfx_rndNoisePeriod_tmp1')];
  D.Sound.beat.since = snap.ram[R('musicFramesSinceLastBeat')]; D.Sound.beat.duration = snap.ram[R('musicBeatDuration')];
  D.pad.held = BTN.start; D.pad.latch = 0; D.nmi();

  /* ---- bot ---- */
  let lcg = seed >>> 0;
  const rnd = n => { lcg = (Math.imul(lcg, 1664525) + 1013904223) >>> 0; return (lcg >>> 8) % n; };
  let target = null, lastPill = -1, tap = 0, startWait = 0, pauseAt = 2500 + rnd(500);
  function landingY(x, rot) {
    const sx = P.x, sy = P.y, sr = P.rot;
    P.x = x; P.rot = rot; let y = P.y;
    if (!D.pillFits()) { P.x = sx; P.y = sy; P.rot = sr; return -1; }
    for (;;) { P.y = y - 1; if (P.y < 0 || !D.pillFits()) break; y--; }
    P.x = sx; P.y = sy; P.rot = sr; return y;
  }
  function choose() {
    let best = null;
    for (let rot = 0; rot < 4; rot++) for (let x = 0; x < 8; x++) {
      const y = landingY(x, rot); if (y < 0) continue;
      const pos = D.T.pill_fieldPos_relativeToPillY[y] + x, r = rot * 4, cols = [P.c1, P.c2];
      let score = rnd(6) - y * 0.3;
      for (let h = 0; h < 2; h++) {
        const fp = (D.T.halfPill_posOffset[r + h] + pos) & 0xFF; if (fp >= 128) { score -= 20; continue; }
        const below = G.field[fp + 8];
        if (fp + 8 < 128 && below !== 0xFF) score += (below & 3) === cols[h] ? 6 : -3;
      }
      if (!best || score > best.score) best = { x, rot, score };
    }
    return best;
  }
  function botInput() {
    let v = 0;
    if (G.romMode === 1 || G.gameOver || G.stageClear) {    // menus / end boxes: press START now and then
      if (++startWait > 90) { startWait = 0; return BTN.start; }
      return 0;
    }
    startWait = 0;
    if (G.romMode === 4 && f >= pauseAt && f < pauseAt + 2) return BTN.start;
    if (G.romMode === 4 && f >= pauseAt + 40 && f < pauseAt + 42) { pauseAt += 4000; return BTN.start; }
    if (G.romMode !== 4 || P.nextAction !== 0) return rnd(4) === 0 ? [BTN.left, BTN.right, BTN.a, BTN.b, BTN.down][rnd(5)] : 0;
    if (P.pillsCounter !== lastPill) { lastPill = P.pillsCounter; target = choose(); }
    if (!target) return BTN.down;
    tap ^= 1;
    if (P.rot !== target.rot) return tap ? (rnd(2) ? BTN.a : BTN.b) : 0;
    if (P.x < target.x) return tap ? BTN.right : 0;
    if (P.x > target.x) return tap ? BTN.left : 0;
    return rnd(8) === 0 ? 0 : BTN.down;
  }

  /* ---- sound: register files fed by the ROM's APU writes and by the JS sound engine ---- */
  const romRegs = new Int16Array(24).fill(-1), jsRegs = new Int16Array(24).fill(-1), regDiff = new Uint32Array(24);
  let apuSeen = nes.apuLog.length, audioFrames = 0, audioOn = false;
  let lastJS = null;
  D.Sound.tap = w => { lastJS = w; for (let i = 0; i < w.length; i += 2) jsRegs[w[i]] = w[i + 1]; };
  const syncAudio = () => { for (let i = apuSeen; i < nes.apuLog.length; i++) romRegs[nes.apuLog[i][1]] = nes.apuLog[i][2]; apuSeen = nes.apuLog.length; };
  syncAudio(); jsRegs.set(romRegs);
  /* ---- lockstep ---- */
  const fails = [];
  const cmp = (what, a, b) => { if (a !== b) fails.push(what + ': rom ' + a + ' js ' + b); };
  let f = 0, stats = { pills: 0, clears: 0, overs: 0, maxScore: 0, pauses: 0, lags: 0 };
  let prevMode = 0, skipLogic = false;
  for (f = 0; f < nFrames; f++) {
    const inp = botInput();
    const rf = romFrame(inp);
    D.pad.held = inp; D.pad.latch = 0;
    if (rf.lag && process.env.DBG) console.log(f, 'ROM LAG', 'mode', snap.ram[R('mode')], 'pc', nes.cpu.pc.toString(16));
    // A lag frame: the ROM's logic for this frame was still running when the NMI came, so its wait for
    // the NMI ends one NMI later.  JS: run the frame's logic, take this NMI, and skip the logic next frame.
    if (rf.lag) { stats.lags++; G.gen.next(); D.nmi(); skipLogic = true; continue; }
    if (skipLogic) skipLogic = false; else G.gen.next();
    const r = snap.ram;
    cmp('mode', r[R('mode')], G.romMode);
    cmp('frameCounter', r[R('frameCounter')], G.frameCounter);
    cmp('rng', r[R('rng0')] + ',' + r[R('rng1')], G.rng0 + ',' + G.rng1);
    const inLevel = G.romMode === 4 || G.romMode === 5 || G.romMode === 7 || G.romMode === 8;
    if (inLevel) {
      for (let i = 0; i < 128; i++) if (r[0x400 + i] !== G.field[i]) { fails.push('field[' + i + ']: rom ' + r[0x400 + i].toString(16) + ' js ' + G.field[i].toString(16)); break; }
      cmp('x', r[R('p1_fallingPillX')], P.x); cmp('y', r[R('p1_fallingPillY')], P.y & 0xFF); cmp('rot', r[R('p1_fallingPillRotation')], P.rot);
      cmp('c1c2', r[R('p1_fallingPill1stColor')] + ',' + r[R('p1_fallingPill2ndColor')], P.c1 + ',' + P.c2);
      cmp('next', r[R('p1_nextPill1stColor')] + ',' + r[R('p1_nextPill2ndColor')], P.n1 + ',' + P.n2);
      cmp('nextAction', r[R('p1_nextAction')], P.nextAction); cmp('step', r[R('p1_pillPlacedStep')], P.step);
      cmp('status', r[R('p1_status')], P.status); cmp('speedUps', r[R('p1_speedUps')], P.speedUps);
      cmp('speedCounter', r[R('p1_speedCounter')], P.speedCounter); cmp('horVel', r[R('p1_horVelocity')], P.horVel);
      cmp('virusLeft', r[R('p1_virusLeft')], P.virusLeft); cmp('level', r[R('p1_level')], G.level);
      cmp('pillsCounter', r[R('p1_pillsCounter')], P.pillsCounter);
      if (P.pillsDec < 99) cmp('pillsDec', fromBCD(r[R('p1_pillsCounter_decimal')]), P.pillsDec);
      cmp('score', Array.from(r.slice(R('score'), R('score') + 6)).join(''), G.score.join(''));
      cmp('nextRot', r[R('p1_nextPillRotation')], P.nextRot);
      cmp('thrown', r[R('pillThrownFrame')] + ',' + r[R('marioThrowFrame')], G.pillThrownFrame + ',' + G.marioThrowFrame);
      cmp('bigState', [r[R('bigVirusYellow_state')], r[R('bigVirusRed_state')], r[R('bigVirusBlue_state')]].join(), G.big.state.join());
      cmp('bigHealth', [r[R('bigVirusYellow_health')], r[R('bigVirusRed_health')], r[R('bigVirusBlue_health')]].join(), G.big.health.join());
      cmp('bigPos', [r[R('bigVirusYellow_XPos')], r[R('bigVirusYellow_YPos')], r[R('bigVirus_circularPos')], r[R('danceFrame')]].join(),
        [G.big.x[0], G.big.y[0], G.circPos, G.danceFrame].join());
      cmp('failFlag', r[R('p1_levelFailFlag')], P.levelFailFlag);
      // sprites built this frame (the ROM's sprite page vs the JS OAM list)
      const n = G.oam.length; let romN = 0; while (romN < 256 && r[0x200 + romN] !== 0xFF) romN += 4;
      if (!G.paused) {
        cmp('sprite count', romN, n);
        for (let i = 0; i < Math.min(n, romN); i++) if (r[0x200 + i] !== (G.oam[i] & 0xFF)) { fails.push('oam[' + i + ']: rom ' + r[0x200 + i] + ' js ' + G.oam[i]); break; }
      }
      // bottle rows already in VRAM
      if (G.hud && PPUok(snap.vram, D)) {} else if (G.hud) fails.push('vram bottle differs');
    }
    if (process.env.DBG2 && f > +process.env.DBG2) console.log(f, 'mode', r[R('mode')], G.romMode, 'dance', r[R('danceFrame')], G.danceFrame, 'circ', r[R('bigVirus_circularPos')], G.circPos, 'beat', r[R('musicFramesSinceLastBeat')], D.Sound.beat.since, r[R('musicBeatDuration')], D.Sound.beat.duration, 'bx', r[R('bigVirusYellow_XPos')], G.big.x[0], 'mus', r[R('music_playing')], D.Sound.current(), D.Sound.playing());
    if (process.env.DBG && f > +process.env.DBG) console.log(f, 'mode', r[R('mode')], G.romMode, 'toAdd', r[R('p1_virusToAdd')], P.virusToAdd, 'vl', r[R('p1_virusLeft')], P.virusLeft, 'rng', r[R('rng0')], G.rng0, 'lvl', r[R('p1_level')], G.level, 'btn', r[R('p1_btns_pressed')], r[R('p1_btns_held')], G.pressed, G.held, 'inp', inp, 'pause', r[R('enablePause')], G.enablePause, 'pc', nes.cpu.pc.toString(16));
    if (fails.length) break;
    if (process.env.ADBG2 && f >= +process.env.ADBG2 && f < +process.env.ADBG2 + 25) console.log('F', f, 'romW', nes.apuLog.slice(apuSeen).filter(e => e[1] < 4).map(e => e[1] + '=' + e[2].toString(16)).join(' '), '| jsW', (lastJS || []).map((v, i, a) => i % 2 ? '' : (a[i] < 4 ? a[i] + '=' + a[i + 1].toString(16) : '')).filter(x => x).join(' '), 'romSfx', nes.ram[R('sfx_playing_sq0')], 'js', D.Sound.st.sq0 && D.Sound.st.sq0.name);
    syncAudio();
    if (G.romMode >= 3) audioOn = true;      // (the options music was started at different moments before the sync)
    if (audioOn) audioFrames++;
    for (let i = 0; i < 0x16; i++) if (audioOn && i !== 0x11 && romRegs[i] !== jsRegs[i]) {
      regDiff[i]++;
      if (process.env.ADBG && regDiff[i] < 4) console.log('A', f, '$40' + i.toString(16), 'rom', romRegs[i].toString(16), 'js', jsRegs[i].toString(16), 'romSfx', nes.ram[R('sfx_playing_sq0')], nes.ram[R('sfx_playing_noise')], 'jsSfx', D.Sound.st.sq0 && D.Sound.st.sq0.name, D.Sound.st.noise && D.Sound.st.noise.name, 'mus', nes.ram[R('music_playing')], D.Sound.current(), D.Sound.st.mPos, 'log', D.Sound.log.slice(-3).join());
    }
    if (G.romMode === 7 && prevMode !== 7) stats.overs++;
    if (G.stageClear && !stats._sc) { stats.clears++; } stats._sc = G.stageClear;
    if (P.pillsCounter !== stats._pc) { stats.pills++; stats._pc = P.pillsCounter; }
    if (G.paused && !stats._pa) stats.pauses++; stats._pa = G.paused;
    stats.maxScore = Math.max(stats.maxScore, D.scoreValue());
    prevMode = G.romMode;
    D.nmi();
  }
  const label = 'level ' + level + ' ' + ['LOW', 'MED', 'HI'][speed] + ' seed ' + seed;
  if (fails.length) {
    console.log('MISMATCH ' + label + ' at frame ' + f + ' (mode ' + G.romMode + ', action ' + P.nextAction + ', step ' + P.step + '):\n  ' + fails.slice(0, 8).join('\n  '));
    return false;
  }
  const rd = []; for (let i = 0; i < 0x16; i++) if (regDiff[i]) rd.push('$40' + i.toString(16).padStart(2, '0') + ' in ' + regDiff[i] + ' frames');
  if (!quiet) console.log('    sound: APU registers compared on ' + audioFrames + ' frames, differences: ' + (rd.join(', ') || 'none'));
  if (!quiet) console.log('ok  ' + label + ': ' + f + ' frames identical (' + stats.pills + ' capsules, ' + stats.clears + ' stage clears, ' +
    stats.overs + ' game overs, ' + stats.pauses + ' pauses, ' + stats.lags + ' ROM lag frames, best score ' + stats.maxScore + ')');
  return true;
}
function PPUok(vram, D) {
  for (let r = 0; r < 16; r++) for (let c = 0; c < 8; c++) if (vram[0x14C + r * 32 + c] !== D.PPU.nt[0x14C + r * 32 + c]) return false;
  return true;
}

const args = process.argv.slice(2).map(Number);
let ok = true;
if (args.length >= 2) ok = runConfig(args[0], args[1], args[2] || 20000, args[3] || 1);
else {
  for (const [lv, sp, n, seed] of [[0, 0, 20000, 1], [0, 1, 20000, 2], [3, 2, 20000, 3], [10, 1, 15000, 4], [15, 2, 15000, 5], [20, 2, 12000, 6], [1, 0, 20000, 7]]) {
    ok = runConfig(lv, sp, n, seed) && ok;
  }
}
console.log(ok ? 'rom-diff: JS port matches the ROM' : 'rom-diff: DIFFERENCES FOUND');
process.exit(ok ? 0 : 1);
