/* Differential test rig: runs the REAL Tetris ROM (re-assembled from the
   disassembly by asm.js, md5-identical to the retail cart) on the game's own
   6502 core with a minimal NES around it (PPU nametable/palette writes, the
   controller, NMI once per frame), and runs index.html's port side by side on
   the same button presses, comparing the game state after every frame.

     const { runDiff } = require('./romsim.js');
     runDiff(G, { frames, startLevel, gameType, height, seed }) -> { compared, mismatches, rom, js }

   G is the build() export (harness loaded).  Only the Original rules are
   compared (the knobs are set to the Original preset first). */
const { assemble } = require('./asm.js');

let ROM = null;
function rom() { return ROM || (ROM = assemble()); }

function makeNes(G) {
  const { prg, sym } = rom();
  const ram = new Uint8Array(0x800), vram = new Uint8Array(0x4000);
  const ppu = { ctrl: 0, addr: 0, latch: 0, vbl: 0 };
  let pad = 0, shift = 0;
  const mem = {
    read(a) {
      if (a < 0x2000) return ram[a & 0x7FF];
      if (a >= 0x8000) return prg[a - 0x8000];
      if (a >= 0x2000 && a < 0x4000) {
        if ((a & 7) === 2) { ppu.latch = 0; ppu.vbl ^= 0x80; return ppu.vbl; }   // vblank flag toggles on every read
        return 0;
      }
      if (a === 0x4016) { const b = shift & 1; shift = (shift >> 1) | 0x80; return b; }
      return 0;
    },
    write(a, v) {
      if (a < 0x2000) { ram[a & 0x7FF] = v; return; }
      if (a >= 0x2000 && a < 0x4000) {
        switch (a & 7) {
          case 0: ppu.ctrl = v; break;
          case 6: if (!ppu.latch) ppu.addr = (ppu.addr & 0xFF) | ((v & 0x3F) << 8); else ppu.addr = (ppu.addr & 0x3F00) | v; ppu.latch ^= 1; break;
          case 7: vram[ppu.addr & 0x3FFF] = v; ppu.addr = (ppu.addr + ((ppu.ctrl & 4) ? 32 : 1)) & 0x3FFF; break;
        }
        return;
      }
      if (a === 0x4016) {
        if (v & 1) shift = 0;
        else {   // latch: A B Select Start Up Down Left Right, A first
          let s = 0; for (let i = 0; i < 8; i++) s |= ((pad >> (7 - i)) & 1) << i;
          shift = s;
        }
      }
    }
  };
  const cpu = G.makeCPU(mem);
  const waits = new Set([sym['updateAudioWaitForNmiAndResetOamStaging@checkForNmi'], sym['updateAudioAndWaitForNmi@checkForNmi']]);
  cpu.PC = prg[0xFFFC - 0x8000] | (prg[0xFFFD - 0x8000] << 8);
  const nmiVec = prg[0xFFFA - 0x8000] | (prg[0xFFFB - 0x8000] << 8);
  // The NMI handler ends with RTI, not RTS.  Wrap it: push PC/P like the hardware.
  function nmiHw() {
    const ret = cpu.PC;
    mem.write(0x100 | cpu.S, ret >> 8); cpu.S = (cpu.S - 1) & 0xFF;
    mem.write(0x100 | cpu.S, ret & 0xFF); cpu.S = (cpu.S - 1) & 0xFF;
    mem.write(0x100 | cpu.S, cpu.P | 0x20); cpu.S = (cpu.S - 1) & 0xFF;
    cpu.PC = nmiVec;
    const s0 = cpu.S, lim = cpu.steps + 200000;
    while (cpu.steps < lim) {
      const rti = mem.read(cpu.PC) === 0x40 && cpu.S === s0;      // the handler's own RTI
      cpu.step();
      if (rti) break;
    }
  }
  /* run until the main loop waits for vblank, then deliver one NMI */
  function frame(buttons) {
    pad = buttons;
    const lim = cpu.steps + 300000;
    while (cpu.steps < lim) {
      if (waits.has(cpu.PC) && ram[sym.verticalBlankingInterval] === 0 && (ppu.ctrl & 0x80)) break;
      cpu.step();
    }
    nmiHw();
  }
  return { cpu, ram, vram, sym, frame, prg };
}

function lcg(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

function runDiff(G, opts) {
  opts = Object.assign({ frames: 3000, startLevel: 0, gameType: 0, height: 0, seed: 1, startA: false }, opts);
  const nes = makeNes(G), { ram, sym } = nes;
  // drive the ROM through legal, title, game type and level menus
  let guard = 0;
  const idle = n => { for (let i = 0; i < n; i++) nes.frame(0); };
  const press = b => { nes.frame(b); nes.frame(0); };
  const pressUntil = (b, mode) => { while (ram[sym.gameMode] !== mode && guard++ < 3000) { press(b); idle(2); } idle(12); };
  pressUntil(0x10, 2);                                                 // legal, title -> game type
  if (opts.gameType) { press(0x01); idle(2); }
  pressUntil(0x10, 3);                                                 // -> level menu
  for (let i = 0; i < opts.startLevel % 10; i++) { press(0x01); idle(1); }
  if (opts.gameType) { press(0x80); idle(1); for (let i = 0; i < opts.height; i++) { press(0x01); idle(1); } press(0x80); idle(1); }
  if (opts.startA || opts.startLevel >= 10) { nes.frame(0x80); nes.frame(0x90); nes.frame(0); } else press(0x10);
  // run until the game is initialised (playState 1, gameModeState back at 2)
  while (!(ram[sym.gameMode] === 4 && ram[sym.gameModeState] >= 2) && guard++ < 4000) nes.frame(0);

  // copy the ROM's state into the port
  const g = G.g, s = G.settings;
  G.applyPreset('original');
  s.gameType = opts.gameType; s.musicType = ram[sym.musicType];
  G.hideOverlay();
  G.startGame(ram[sym.player1_levelNumber], ram[sym.player1_startHeight]);
  function copyFromRom() {
    const p = sym.player1_tetriminoX;
    g.x = ram[p]; g.y = ram[p + 1]; g.cur = ram[p + 2]; g.level = ram[p + 4]; g.fallTimer = ram[p + 5];
    g.autorepeatX = ram[p + 6]; g.startLevel = ram[p + 7]; g.playState = ram[p + 8]; g.vramRow = ram[p + 9];
    g.completedRow = [ram[p + 10], ram[p + 11], ram[p + 12], ram[p + 13]];
    g.autorepeatY = ram[p + 14]; g.holdDownPoints = ram[p + 15]; g.lines = [ram[p + 16], ram[p + 17]];
    g.rowY = ram[p + 18]; g.score = [ram[p + 19], ram[p + 20], ram[p + 21]]; g.completedLines = ram[p + 22];
    g.lineIndex = ram[p + 23]; g.curtainRow = (ram[p + 24] << 24) >> 24; g.startHeight = ram[p + 25];
    g.queue = [ram[sym.nextPiece]];
    g.rng = (ram[sym.rng_seed] << 8) | ram[sym.rng_seed + 1];
    g.spawnID = ram[sym.spawnID]; g.spawnCount = ram[sym.spawnCount];
    g.frame = ram[sym.frameCounter] | (ram[sym.frameCounter + 1] << 8);
    for (let i = 0; i < 14; i++) g.stats[i] = ram[sym.statsByType + i];
    for (let i = 0; i < 256; i++) g.pf[i] = ram[sym.playfield + i];
    g.allegro = ram[sym.allegro];
    g.displayNext = ram[sym.displayNextPiece];
    for (let i = 0; i < 960; i++) g.nt[i] = nes.vram[0x2000 + i];
  }
  copyFromRom();

  function snapshotRom() {
    const p = sym.player1_tetriminoX;
    const nt = [];
    for (let r = 0; r < 20; r++) for (let c = 0; c < 10; c++) nt.push(nes.vram[0x2000 + (6 + r) * 32 + 12 + c]);
    return {
      x: ram[p], y: ram[p + 1], cur: ram[p + 2], level: ram[p + 4], fall: ram[p + 5], arx: ram[p + 6], ps: ram[p + 8], vr: ram[p + 9],
      ary: ram[p + 14], hdp: ram[p + 15], lines: ram[p + 16] | (ram[p + 17] << 8), score: ram[p + 19] | (ram[p + 20] << 8) | (ram[p + 21] << 16),
      cl: ram[p + 22], curtain: ram[p + 24], next: ram[sym.nextPiece], rng: (ram[sym.rng_seed] << 8) | ram[sym.rng_seed + 1],
      pf: Array.from(ram.slice(sym.playfield, sym.playfield + 200)).join(','), vram: nt.join(','),
      stats: Array.from(ram.slice(sym.statsByType, sym.statsByType + 14)).join(','),
      digits: [0x2073, 0x2074, 0x2075, 0x2118, 0x2119, 0x211A, 0x211B, 0x211C, 0x211D, 0x22BA, 0x22BB].map(a => nes.vram[a]).join(','),
      flash: nes.vram[0x3F0E]
    };
  }
  function snapshotJs() {
    const nt = [];
    for (let r = 0; r < 20; r++) for (let c = 0; c < 10; c++) nt.push(g.nt[(6 + r) * 32 + 12 + c]);
    return {
      x: g.x, y: g.y, cur: g.cur, level: g.level, fall: g.fallTimer & 0xFF, arx: g.autorepeatX, ps: g.playState, vr: g.vramRow,
      ary: g.autorepeatY, hdp: g.holdDownPoints & 0xFF, lines: g.lines[0] | (g.lines[1] << 8), score: g.score[0] | (g.score[1] << 8) | (g.score[2] << 16),
      cl: g.completedLines, curtain: g.curtainRow & 0xFF, next: g.queue[0], rng: g.rng,
      pf: Array.from(g.pf.slice(0, 200)).join(','), vram: nt.join(','),
      stats: Array.from(g.stats).join(','),
      digits: [0x2073, 0x2074, 0x2075, 0x2118, 0x2119, 0x211A, 0x211B, 0x211C, 0x211D, 0x22BA, 0x22BB].map(a => g.nt[a - 0x2000]).join(','),
      flash: g.pal[0x0E]
    };
  }
  // button presses: a biased random masher (no Select / Start unless asked), one frame ahead for the ROM
  const rnd = lcg(opts.seed);
  const seq = [];
  let held = 0;
  for (let i = 0; i < opts.frames + 2; i++) {
    const r = rnd();
    if (r < 0.10) held ^= 0x01; else if (r < 0.20) held ^= 0x02; else if (r < 0.30) held ^= 0x04;
    else if (r < 0.40) held ^= 0x80; else if (r < 0.48) held ^= 0x40;
    else if (opts.start && r < 0.485) held ^= 0x10;
    if ((held & 3) === 3) held &= ~1;
    seq.push(i ? held : 0);           // the ROM's first frame uses the last menu poll (no buttons)
  }
  // or a planner that steers each piece to the bot's chosen spot with real button presses
  const { bestPlacement } = require('./bot.js');
  let plan = null, planFor = -1, prev = 0;
  function planned() {
    let b = 0;
    if (g.playState === 1) {
      if (planFor !== g.pieceSerial) { planFor = g.pieceSerial; plan = bestPlacement(G, { bad: opts.bad }); }
      if (plan) {
        const r = rnd();
        if (g.cur !== plan.o) b = (prev & 0x80) ? 0 : 0x80;
        else if (g.x < plan.x) b = r < 0.5 ? 0x01 : ((prev & 0x01) ? 0 : 0x01);   // sometimes hold (DAS), sometimes tap
        else if (g.x > plan.x) b = r < 0.5 ? 0x02 : ((prev & 0x02) ? 0 : 0x02);
        else b = (prev & 0x04) || r < 0.7 ? 0x04 : 0;
        if (r > 0.995 && opts.start) b = 0x10;
        if (r > 0.99 && r <= 0.995) b |= 0x20;
      }
    } else if (g.playState === 10 && g.curtainRow === 20) b = (prev & 0x10) ? 0 : 0x10;
    else b = rnd() < 0.3 ? 0x04 : 0;
    prev = b;
    return b;
  }
  const mismatches = [];
  let compared = 0, ended = false;
  let next = 0;
  for (let k = 0; k < opts.frames; k++) {
    const cur = opts.planner ? next : seq[k];
    G.input.force = cur;
    G.update();
    next = opts.planner ? (k === 0 && false ? 0 : planned()) : seq[k + 1];
    nes.frame(next);
    if (g.playState === 13) { ended = { frame: k, success: true, romPlayState: ram[sym.player1_playState] }; break; }
    if (ram[sym.gameMode] !== 4 || g.mode !== 'play') { ended = { frame: k, romMode: ram[sym.gameMode], jsMode: g.mode }; break; }
    const a = snapshotRom(), b = snapshotJs();
    compared++;
    for (const key in a) if (a[key] !== b[key]) { mismatches.push({ frame: k, key, rom: a[key], js: b[key] }); }
    if (mismatches.length > 20) break;
  }
  G.input.force = null;
  return { compared, mismatches, ended, rom: snapshotRom(), js: snapshotJs() };
}

module.exports = { runDiff, makeNes, rom };
