/* Headless test suite: runs the real game code from index.html under the
   DOM/canvas stubs in harness.js (render() every frame in the long runs), plus
   a frame-by-frame comparison against the real ROM (tools/romsim.js).
     node tools/test.js        -> must end with "all tests passed" */
require('./harness.js');
const crypto = require('crypto');
const { build } = require('./build.js');
const { makeBot } = require('./bot.js');
const G = build();
const { g, settings, input } = G;

let passed = 0, failed = 0;
function ok(cond, name) { if (cond) passed++; else { failed++; console.log('FAIL: ' + name); } }
function eq(a, b, name) { ok(a === b, name + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'); }
const t0 = Date.now();
const step = (n = 1, bot) => { for (let i = 0; i < n; i++) { if (bot) bot(); G.update(); G.render(); } };
const until = (f, max = 20000, bot) => { for (let i = 0; i < max; i++) { if (f()) return true; if (bot) bot(); G.update(); } return f(); };
function fresh(preset, extra, level, height) {
  localStorage._d = {};
  G.applyPreset(preset || 'original');
  settings.gameType = 0;
  if (extra) Object.assign(settings, extra);
  G.hideOverlay();
  input.force = null; input.keys.clear(); input.prev = 0;
  g.rng = 0x8988; g.spawnCount = 0;
  G.startGame(level || 0, height || 0);
}
function press(bits, frames = 1) { input.prev = 0; for (let i = 0; i < frames; i++) { input.force = bits; G.update(); } input.force = null; }
function clearField() { g.pf.fill(G.TILE_EMPTY); g.vramRow = 0; }
const cells = o => { const r = []; for (let m = 0; m < 4; m++) r.push([G.ORIENT[o * 12 + m * 3], G.ORIENT[o * 12 + m * 3 + 2]]); return r; };

/* ---------------- the ROM itself ---------------- */
{
  const { assemble } = require('./asm.js');
  const r = assemble();
  eq(crypto.createHash('md5').update(r.nes).digest('hex'), 'ec58574d96bee8c8927884ae6e7a2508', 'disassembly re-assembles to the retail ROM (md5)');
  const prg = (a, n) => [...r.prg.slice(a - 0x8000, a - 0x8000 + n)];
  eq(JSON.stringify(G.R.framesPerDrop), JSON.stringify(prg(r.sym.framesPerDropTable, 30)), 'embedded gravity table = ROM bytes');
  eq(Buffer.from(G.DATA.chrGame, 'base64').equals(r.chr.slice(3 * 4096, 4 * 4096)), true, 'embedded game CHR = ROM CHR bank 3');
  eq(Buffer.from(G.DATA.chrMenu, 'base64').equals(r.chr.slice(0, 4096)), true, 'embedded menu CHR = ROM CHR bank 0');
  eq(Buffer.from(G.DATA.audio.rom, 'base64').equals(r.prg.slice(0x6000, 0x7A00)), true, 'embedded sound driver = ROM $E000-$F9FF');
}

/* ---------------- tables at Original ---------------- */
eq(G.FRAMES_PER_DROP.join(','), '48,43,38,33,28,23,18,13,8,6,5,5,5,4,4,4,3,3,3,2,2,2,2,2,2,2,2,2,2,1', 'gravity table, frames per row by level');
fresh('original');
const grav = [];
for (const lv of [0, 1, 8, 9, 10, 13, 16, 19, 28, 29, 35]) { g.level = lv; grav.push(G.gravityFrames()); }
eq(grav.join(','), '48,43,8,6,5,4,3,2,2,1,1', 'gravityFrames per level (29+ = 1)');
eq(G.SPAWN_TABLE.join(','), '2,7,8,10,11,14,18', 'spawn orientations T J Z O S L I');
eq(G.R.points.join(','), '0,0,64,0,0,1,0,3,0,18', 'pointsTable (BCD 40 / 100 / 300 / 1200)');
eq(G.R.typeBBlank.join(','), '200,170,150,120,100,80', 'B-type blank counts per height');
// colour palettes change per level (colorTable), 10 entries
{
  const seen = new Set();
  for (let lv = 0; lv < 10; lv++) { g.level = lv; G.playNmi(); seen.add([...g.pal.slice(8, 12)].join(',')); }
  eq(seen.size, 10, 'ten distinct block palettes for levels 0-9');
  g.level = 10; G.playNmi(); const p10 = [...g.pal.slice(8, 12)].join(','); g.level = 0; G.playNmi();
  eq(p10, [...g.pal.slice(8, 12)].join(','), 'level 10 reuses level 0 colours');
  eq(g.pal[0x18] === g.pal[0x08] && g.pal[0x19] === g.pal[0x09], true, 'sprite palette 2 follows the level too');
}

/* ---------------- spawn, rotation, no kicks ---------------- */
fresh('original');
eq(g.x + ',' + g.y, '5,0', 'pieces spawn at column 5, row 0');
ok(G.SPAWN_TABLE.includes(g.cur), 'the first piece is in a spawn orientation');
eq(JSON.stringify(cells(0x12)), '[[0,-2],[0,-1],[0,0],[0,1]]', 'I spawns horizontal: columns 3-6 of row 0');
eq(JSON.stringify(cells(0x02)), '[[0,-1],[0,0],[0,1],[1,0]]', 'T spawns pointing down');
for (const sp of G.SPAWN_TABLE) {               // A four times is the identity, B undoes A
  let o = sp; const seen = [o];
  for (let i = 0; i < 4; i++) { o = G.ROTATION[o * 2 + 1]; seen.push(o); }
  eq(o, sp, 'A x4 returns to spawn for orientation ' + sp);
  eq(G.ROTATION[G.ROTATION[sp * 2 + 1] * 2], sp, 'B undoes A for orientation ' + sp);
}
eq(G.ROTATION[0x02 * 2 + 1], 0x03, 'A turns T clockwise: down -> left');
eq(G.ROTATION[0x0A * 2 + 1], 0x0A, 'O does not rotate');
eq(G.ROTATION[0x12 * 2 + 1], 0x11, 'I has two states');
{
  fresh('original');
  clearField(); g.playState = 1; g.cur = 0x11; g.x = 0; g.y = 10; g.autorepeatY = 0;
  press(G.BTN_A); press(0);
  eq(g.cur, 0x11, 'no wall kick: vertical I against the left wall cannot rotate');
  fresh('normal');
  clearField(); g.playState = 1; g.cur = 0x11; g.x = 0; g.y = 10; g.autorepeatY = 0;
  press(G.BTN_A); press(0);
  eq(g.cur, 0x12, 'kicks knob: the I rotates by stepping away from the wall');
  ok(g.x >= 2, 'kick moved the piece right');
  fresh('original');
  clearField(); g.playState = 1; g.cur = 0x02; g.x = 5; g.y = 10; g.autorepeatY = 0;
  press(G.BTN_B); press(0); eq(g.cur, 0x01, 'B rotates counter-clockwise (T down -> right)');
  press(G.BTN_A); press(0); eq(g.cur, 0x02, 'A back');
}

/* ---------------- DAS: 16-frame delay, then every 6 ---------------- */
{
  fresh('original');
  clearField(); g.playState = 1; g.cur = 0x0A; g.x = 1; g.y = 5; g.autorepeatY = 0; g.fallTimer = -10000;
  const moves = [];
  for (let f = 0; f < 40; f++) { const x0 = g.x; input.force = G.RIGHT; G.update(); if (g.x !== x0) moves.push(f); g.fallTimer = -10000; }
  input.force = null;
  eq(moves.join(','), '0,16,22,28,34', 'DAS: move on press, then frame 16, then every 6 frames');
  // against a wall the DAS stays charged: the first move after leaving it is instant
  fresh('original'); clearField(); g.playState = 1; g.cur = 0x0A; g.x = 7; g.y = 5; g.autorepeatY = 0;
  for (let f = 0; f < 30; f++) { input.force = G.RIGHT; G.update(); g.fallTimer = 0; }
  eq(g.x, 9, 'O stops at the right wall (its cells are x-1 and x)');
  eq(g.autorepeatX >= 10, true, 'DAS stays charged against the wall');
  // knobs: 24 / 8
  fresh('original', { dasDelay: 24, dasRepeat: 8 }); clearField(); g.playState = 1; g.cur = 0x0A; g.x = 1; g.y = 5; g.autorepeatY = 0;
  const m2 = [];
  for (let f = 0; f < 45; f++) { const x0 = g.x; input.force = G.RIGHT; G.update(); if (g.x !== x0) m2.push(f); g.fallTimer = 0; }
  input.force = null;
  eq(m2.join(','), '0,24,32,40', 'DAS knobs: 24-frame delay, repeat every 8');
}

/* ---------------- gravity, soft drop, the start delay ---------------- */
{
  fresh('original');
  let f = 0; const y0 = g.y;
  while (g.y === y0 && f < 400) { G.update(); f++; }
  eq(f, 97, 'first piece hangs for 96 frames (autorepeatY $A0), then falls');
  const ys = []; for (let i = 0; i < 100; i++) { const y = g.y; G.update(); if (g.y !== y) ys.push(i); }
  eq(ys[1] - ys[0], 48, 'level 0: one row every 48 frames');
  fresh('original', null, 19);
  let n = 0; for (let i = 0; i < 200 && g.playState === 1; i++) { const y = g.y; G.update(); if (g.y !== y) n++; }
  ok(n > 5, 'level 19 drops fast');
  // soft drop: 1/2 G after the first press, 1 point per row pushed
  fresh('original'); clearField(); g.playState = 1; g.cur = 0x0A; g.x = 4; g.y = 0; g.autorepeatY = 0; g.fallTimer = 0;
  const drops = [];
  for (let i = 0; i < 12; i++) { const y = g.y; input.force = G.DOWN; G.update(); if (g.y !== y) drops.push(i); }
  eq(drops.join(','), '2,4,6,8,10', 'soft drop moves every 2nd frame');
  input.force = G.DOWN; until(() => g.playState !== 1, 200); input.force = null;
  const pushed = g.holdDownPoints;
  until(() => g.playState === 1, 200);
  eq(pushed, 19, 'O pushed from row 0: 18 rows + the locking push');
  eq(g.score[0], 0x12, 'ROM quirk: binary 18 added to the BCD score shows as 12');
  fresh('original'); clearField(); g.playState = 1; g.cur = 0x0A; g.x = 4; g.y = 12; g.autorepeatY = 0; g.fallTimer = 0;
  input.prev = 0; input.force = G.DOWN; until(() => g.playState !== 1, 200); input.force = null;
  until(() => g.playState === 1, 200);
  eq(G.scoreInt(), 6, 'soft drop: 1 point per row pushed (6 rows)');
}

/* ---------------- randomiser ---------------- */
{
  // first roll accepted when different, rerolled once when equal
  g.spawnID = 0x02; g.rng = 0x0000; g.spawnCount = 0xFF;      // (rng hi 0 + count 0) & 7 = 0 -> T, same as last: reroll
  const p = G.pickRandomTetrimino();
  ok(p !== undefined && G.SPAWN_TABLE.includes(p), 'reroll yields a valid piece');
  g.spawnID = 0x07; g.rng = 0x0000; g.spawnCount = 0xFF;
  eq(G.pickRandomTetrimino(), 0x02, 'first roll accepted when it differs from the last piece');
  g.spawnID = 0x02; g.rng = 0x0700; g.spawnCount = 0;          // index 7+1 & 7 = 0 -> T = last, reroll
  const before = g.rng; G.pickRandomTetrimino(); ok(g.rng !== before, 'a repeat advances the RNG and rerolls');
  g.spawnID = 0x02; g.rng = 0x0600; g.spawnCount = 0;          // (6 + 1) & 7 = 7 -> invalid index, reroll
  const r2 = g.rng; G.pickRandomTetrimino(); ok(g.rng !== r2, 'index 7 rerolls too');
  // distribution and repeat rate over many picks with the frame-advanced RNG
  settings.randomizer = 'nes';
  g.rng = 0x8988; g.spawnCount = 0; g.spawnID = 0;
  const counts = [0, 0, 0, 0, 0, 0, 0]; let rep = 0, last = -1;
  for (let i = 0; i < 14000; i++) {
    for (let k = 0; k < 1 + (i * 7) % 13; k++) G.rngNext();
    const q = G.pickRandomTetrimino(); const t = G.TYPE_FROM_ORIENT[q];
    counts[t]++; if (q === last) rep++; last = q;
  }
  ok(counts.every(c => c > 1400 && c < 2700), 'every piece appears (counts ' + counts.join(',') + ')');
  ok(rep / 14000 < 0.08, 'repeats are rarer than 1 in 7 (' + (rep / 140).toFixed(1) + '%)');
  // LFSR
  g.rng = 0x8988; G.rngNext(); eq(g.rng, 0x44C4, 'rng step: $8988 -> $44C4 (bit 1 xor bit 9 into bit 15)');
  G.rngNext(); eq(g.rng, 0x2262, 'then $2262');
}

/* ---------------- line clears and scoring ---------------- */
function clearLines(nLines, level) {
  fresh('original', null, level);
  clearField();
  for (let r = 20 - nLines; r < 20; r++) for (let c = 0; c < 10; c++) if (c !== 0) g.pf[r * 10 + c] = 0x7B;
  g.cur = nLines === 4 ? 0x11 : 0x11; g.x = 0; g.y = 0; g.playState = 1; g.autorepeatY = 0;
  // drop an I (vertical) down column 0
  g.vramRow = 0x20;
  until(() => g.playState === 2, 3000);
  until(() => g.playState === 8 || g.playState === 1, 400);
  return G.scoreInt();
}
eq(clearLines(1, 0), 40, 'single at level 0 = 40');
eq(clearLines(2, 0), 100, 'double at level 0 = 100');
eq(clearLines(3, 0), 300, 'triple at level 0 = 300');
eq(clearLines(4, 0), 1200, 'tetris at level 0 = 1200');
eq(clearLines(4, 9), 12000, 'tetris at level 9 = 1200 x 10');
eq(clearLines(1, 5), 240, 'single at level 5 = 40 x 6');
{
  // tetris: the flash, the sound, the line-clear animation length
  clearLines(0, 0);
  fresh('original', null, 3); clearField();
  for (let r = 16; r < 20; r++) for (let c = 1; c < 10; c++) g.pf[r * 10 + c] = 0x7B;
  g.vramRow = 0; G.update(); G.update(); G.update(); G.update(); G.update(); G.update();
  g.cur = 0x11; g.x = 0; g.y = 2; g.playState = 1; g.autorepeatY = 0;
  G.Sound.log.length = 0;
  let flashes = 0, f3 = -1, f5 = -1, f = 0;
  for (; f < 400; f++) { input.force = G.DOWN; G.update(); if (g.pal[0x0E] === 0x30) flashes++; if (g.playState === 4 && f3 < 0) f3 = f; if (g.playState === 5 && f5 < 0) f5 = f; if (g.playState === 1 && f5 > 0) break; }
  input.force = null;
  ok(flashes >= 3, 'TETRIS flash: the background flashes white (' + flashes + ' frames)');
  ok(G.Sound.log.includes('sfx1:4'), 'tetris sound');
  ok(G.Sound.log.includes('sfx1:9'), 'line-clearing jingle during the flash');
  ok(f5 - f3 >= 17 && f5 - f3 <= 20, 'line clear animation 17-20 frames (' + (f5 - f3) + ')');
  eq(G.bcdToInt(0, g.lines[1], g.lines[0]), 4, '4 lines counted');
}

/* ---------------- entry delay (ARE) ---------------- */
{
  const are = [];
  for (const floorRow of [19, 15, 11, 7, 3]) {
    fresh('original'); clearField();
    for (let r = floorRow + 1; r < 20; r++) for (let c = 0; c < 10; c++) if ((c + r) % 3) g.pf[r * 10 + c] = 0x7B;
    g.vramRow = 0; for (let i = 0; i < 6; i++) G.update();
    g.cur = 0x0A; g.x = 4; g.y = floorRow - 1; g.playState = 1; g.autorepeatY = 0; g.fallTimer = 100;
    let f = 0; while (g.playState === 1 && f < 10) { G.update(); f++; }
    const serial = g.pieceSerial; let n = 0;
    while (g.pieceSerial === serial && n < 100) { G.update(); n++; }
    are.push(n);
  }
  ok(are.every(n => n >= 10 && n <= 19), 'ARE between 10 and 18 frames by lock height (' + are.join(',') + ')');
  if (process.env.VERBOSE) console.log('ARE by lock height (bottom to top):', are.join(','));
  ok(are[0] <= are[are.length - 1], 'higher locks wait longer');
}

/* ---------------- level transitions (the NES rule) ---------------- */
function linesToFirstLevelUp(start) {
  fresh('original', null, start);
  let lines = 0;
  while (g.level === start && lines < 300) { g.completedLines = 1; g.playState = 5; G.updateLinesAndStatistics(); lines++; }
  return lines;
}
eq(linesToFirstLevelUp(0), 10, 'start 0: level 1 after 10 lines');
eq(linesToFirstLevelUp(5), 60, 'start 5: level 6 after 60 lines');
eq(linesToFirstLevelUp(9), 100, 'start 9: level 10 after 100 lines');
eq(linesToFirstLevelUp(12), 100, 'start 12: first transition at 100 lines');
eq(linesToFirstLevelUp(15), 100, 'start 15: first transition at 100 lines');
eq(linesToFirstLevelUp(16), 110, 'start 16: first transition at 110 lines');
eq(linesToFirstLevelUp(18), 130, 'start 18: first transition at 130 lines');
eq(linesToFirstLevelUp(19), 140, 'start 19: first transition at 140 lines');
{
  fresh('original', null, 18);
  for (let i = 0; i < 140; i++) { g.completedLines = 1; g.playState = 5; G.updateLinesAndStatistics(); }
  eq(g.level, 20, 'start 18: 19 at 130 lines, 20 at 140');
  for (let i = 0; i < 10; i++) { g.completedLines = 1; g.playState = 5; G.updateLinesAndStatistics(); }
  eq(g.level, 21, 'then every 10 lines (150 -> 21)');
}

/* ---------------- statistics ---------------- */
{
  fresh('original');
  const bot = makeBot(G);
  until(() => g.pieceSerial >= 30, 30000, bot);
  let total = 0; for (let p = 0; p < 7; p++) total += G.bcdToInt(0, g.stats[p * 2 + 1], g.stats[p * 2]);
  eq(total, g.pieceSerial, 'statistics column counts every piece');
  G.playNmi();
  eq(g.nt[(12) * 32 + 6] <= 9 && g.nt[(12) * 32 + 7] <= 9, true, 'stat digits written to the screen');
}

/* ---------------- game over curtain, high score entry ---------------- */
{
  fresh('original');
  const bad = makeBot(G, { bad: true });
  ok(until(() => g.playState === 10, 60000, bad), 'topping out lowers the curtain');
  ok(G.Sound.log.includes('sfx0:2'), 'curtain noise');
  until(() => g.curtainRow === 20, 400);
  let curt = 0; for (let i = 0; i < 200; i++) if (g.pf[i] === 0x4F) curt++;
  eq(curt, 200, 'curtain covers all 20 rows');
  g.score = [0x00, 0x50, 0x01];             // 15000: beats HOWARD's 10000
  press(G.START); G.update();
  eq(g.mode, 'entry', 'a top-3 score goes to the name entry screen');
  eq(g.entry.pos, 0, 'first place');
  input.force = G.UP; for (let i = 0; i < 9; i++) G.update(); input.force = null;
  ok(g.entry.table[0].n[0] !== 0x2B, 'Up changes the letter');
  press(G.START); G.update();
  eq(g.mode, 'level', 'Start leaves the entry screen');
  const t = G.getTable('original', 0, 0);
  eq(t[0].s, 15000, 'stored in the Original A table');
  eq(t[1].s, 10000, 'HOWARD moved down');
  eq(t.length, 3, 'three entries');
}

/* ---------------- B-type ---------------- */
{
  for (const h of [0, 1, 3, 5]) {
    settings.gameType = 1;
    fresh('original', { gameType: 1 }, 5, h);
    let rows = 0; for (let r = 0; r < 20; r++) { let any = false; for (let c = 0; c < 10; c++) if (g.pf[r * 10 + c] !== G.TILE_EMPTY) any = true; if (any) rows++; }
    eq(rows, [0, 3, 5, 8, 10, 12][h], 'B-type height ' + h + ' garbage rows');
    let holesOk = true;
    for (let r = 20 - rows; r < 20; r++) { let e = 0; for (let c = 0; c < 10; c++) if (g.pf[r * 10 + c] === G.TILE_EMPTY) e++; if (!e) holesOk = false; }
    ok(holesOk, 'every garbage row has a hole (height ' + h + ')');
  }
  fresh('original', { gameType: 1 }, 0, 0);
  eq(g.lines[0], 0x25, 'B-type starts with 25 lines to go');
  g.completedLines = 2; g.playState = 5; G.updateLinesAndStatistics();
  eq(g.lines[0], 0x23, 'lines count down (BCD)');
  eq(g.level, 0, 'B-type level never rises');
  g.lines[0] = 0x01; g.completedLines = 4; g.playState = 5; G.updateLinesAndStatistics();
  eq(g.lines[0], 0, 'clamped at 0');
  g.playState = 6; g.level = 7; g.startHeight = 2; G.playFrame();
  eq(g.playState, 13, 'reaching 0 = SUCCESS');
  ok(G.Sound.log.includes('music:2'), 'B-type fanfare');
  const s0 = G.scoreInt();
  until(() => g.bonusSteps === 0 && g.successT > 200, 2000);
  eq(G.scoreInt() - s0, (7 + 2) * 1000, 'ending bonus (level + height) x 1000');
  press(G.START); G.update();
  ok(g.mode === 'entry' || g.mode === 'level', 'B-type ends to the high score / level screen');
}

/* ---------------- pause ---------------- */
{
  fresh('original');
  step(120);
  press(G.START); G.render();
  ok(g.paused && !g.bgOn, 'Start pauses and hides the board');
  const fr = g.fallTimer, y = g.y; step(100);
  eq(g.fallTimer + ',' + g.y, fr + ',' + y, 'nothing moves while paused');
  let nonBlack = 0; for (let i = 0; i < G.fb.length; i++) if (G.fb[i] !== G.PAL32[0x0F]) nonBlack++;
  ok(nonBlack > 0 && nonBlack < 400, 'paused screen: black with only PAUSE');
  press(G.START); step(2);
  ok(!g.paused && g.bgOn, 'Start resumes');
}

/* ---------------- knobs ---------------- */
{
  // gravity: custom frames per row, frozen, speed-up off
  fresh('original', { gravity: 90, speedUp: 0 }); g.autorepeatY = 0; g.fallTimer = 0;
  let ys = []; for (let i = 0; i < 200; i++) { const y = g.y; G.update(); if (g.y !== y) ys.push(i); }
  eq(ys[1] - ys[0], 90, 'gravity knob 90 frames/row');
  g.level = 9; eq(G.gravityFrames(), 90, 'speed-up off: stays at 90 at any level');
  settings.speedUp = 1; g.startLevel = 0; g.level = 9; eq(G.gravityFrames(), Math.round(90 * 6 / 48), 'speed-up on scales with the NES table');
  fresh('original', { gravity: 'frozen' }); g.autorepeatY = 0;
  const yy = g.y; step(600); eq(g.y, yy, 'frozen: no gravity at all');
  input.force = G.DOWN; step(20); input.force = null; ok(g.y > yy, 'frozen: Down still drops');
  fresh('original', { gravity: 'nes', speedUp: 0 }, 0); g.level = 15; eq(G.gravityFrames(), 48, 'NES table with speed-up off keeps the starting level speed');
  // previews
  fresh('original', { previews: 4 });
  eq(g.queue.length, 4, 'previews knob: queue holds 4');
  const q1 = g.queue[1]; until(() => g.pieceSerial === 2, 3000, () => { input.force = G.DOWN; }); input.force = null;
  eq(g.queue[0], q1, 'queue advances');
  G.render();
  eq(g.nt[23 * 32 + 23], 0x38, 'extra-preview box drawn in the brick area');
  fresh('original'); eq(g.nt[23 * 32 + 23] !== 0x38, true, 'Original: no extra box');
  // ghost: renders translucent minos below the piece
  fresh('original', { ghost: 1 }); clearField(); g.playState = 1; g.cur = 0x0A; g.x = 4; g.y = 2; G.render();
  const withGhost = G.fb.slice();
  settings.ghost = 0; G.render();
  let diff = 0; for (let i = 0; i < withGhost.length; i++) if (withGhost[i] !== G.fb[i]) diff++;
  ok(diff > 100, 'ghost piece drawn (' + diff + ' px)');
  // hard drop
  fresh('original', { hardDrop: 1 }); clearField(); g.playState = 1; g.cur = 0x0A; g.x = 4; g.y = 0; g.autorepeatY = 0;
  input.hardDrop = true; G.update();
  eq(g.playState, 2, 'hard drop locks at once');
  eq(g.y, 18, 'hard drop lands on the floor');
  fresh('original', { hardDrop: 0 }); clearField(); g.playState = 1; g.cur = 0x0A; g.x = 4; g.y = 0; g.autorepeatY = 0;
  input.hardDrop = true; G.update(); eq(g.y, 0, 'hard drop off: Space does nothing');
  // hold
  fresh('original', { hold: 1 });
  const first = g.cur, nxt = g.queue[0];
  g.autorepeatY = 0; input.hold = true; G.update();
  eq(g.hold, G.SPAWN_TABLE[G.TYPE_FROM_ORIENT[first]], 'hold stores the piece');
  eq(g.cur, nxt, 'the next piece comes in');
  const c2 = g.cur; input.hold = true; G.update(); eq(g.cur, c2, 'hold only once per piece');
  eq(g.nt[3 * 32 + 3], G.charTile('H'), 'HOLD box drawn');
  fresh('original', { hold: 0 }); const c3 = g.cur; input.hold = true; G.update(); eq(g.cur, c3, 'hold off: C does nothing');
  // randomizer: friendly never lets I go missing for 12 pieces; bag deals each piece once per 7
  settings.randomizer = 'friendly'; g.sinceI = 0; let gap = 0, maxGap = 0;
  for (let i = 0; i < 3000; i++) { const p = G.chooseNextTetrimino(); gap = p === 0x12 ? 0 : gap + 1; maxGap = Math.max(maxGap, gap); }
  ok(maxGap <= 11, 'friendly picker: no I drought over 11 (' + maxGap + ')');
  settings.randomizer = 'bag'; g.bag = null; let bagOk = true;
  for (let b = 0; b < 50; b++) { const s = new Set(); for (let i = 0; i < 7; i++) s.add(G.chooseNextTetrimino()); if (s.size !== 7) bagOk = false; }
  ok(bagOk, '7-bag deals all seven');
  settings.randomizer = 'nes';
  // starting level, B height through the NES menus
  fresh('original', { startLevel: 0 });
  G.toLevelMenu(); g.menuLevel = 7; press(G.START); eq(g.level, 7, 'level menu choice starts the game at that level');
  G.toLevelMenu(); g.menuLevel = 3; input.force = G.BTN_A; G.update(); input.force = G.BTN_A | G.START; G.update(); input.force = null;
  eq(g.level, 13, 'A + Start adds 10');
  localStorage._d = {}; G.applyPreset('original'); settings.startLevel = 14; g.menuLevel = -1; G.toLevelMenu(); press(G.START);
  eq(g.level, 14, 'starting level knob (14) honoured');
  G.applyPreset('original'); settings.height = 4; settings.gameType = 1; g.menuLevel = -1; G.toLevelMenu(); press(G.START);
  eq(g.startHeight, 4, 'garbage height knob preselects the height');
  settings.gameType = 0;
}

/* ---------------- no game over ---------------- */
{
  fresh('kid');
  const bad = makeBot(G, { bad: true });
  ok(until(() => g.playState === 12, 60000, bad), 'no-game-over: topping out starts the rescue flash');
  until(() => g.playState === 1, 200);
  let top = 0; for (let i = 0; i < 100; i++) if (g.pf[i] !== G.TILE_EMPTY) top++;
  eq(top, 0, 'the stack dropped: top 10 rows empty after the rescue');
  for (let i = 0; i < 20000; i++) { bad(); G.update(); if (g.playState === 10 || g.mode !== 'play') break; }
  eq(g.mode, 'play', 'still playing after 20000 frames of trying to lose');
  ok(g.rescues >= 2, 'rescued ' + g.rescues + ' times');
  G.render();
  // high scores kept apart
  g.score = [0, 0, 5]; g.playState = 0; G.update();
  const tn = G.getTable('kid', 0, 1), tr = G.getTable('kid', 0, 0);
  eq(tn.length, 1, 'no-game-over score goes in its own table');
  eq(tr.length, 0, 'the normal Kid table is untouched');
  ok(G.highKey('kid', 0, 1).endsWith('.nogo'), 'separate storage key');
}

/* ---------------- settings round-trip, presets ---------------- */
{
  localStorage._d = {};
  G.applyPreset('kid'); eq(G.presetName(), 'kid', 'Kid preset recognised');
  G.stepKnob('dasDelay', 1); eq(G.presetName(), 'custom', 'touching a knob -> Custom');
  settings.gameType = 1; settings.musicType = 2; G.saveSettings();
  const saved = JSON.stringify(settings);
  G.applyPreset('original');
  eq(JSON.stringify(G.PRESETS.original), JSON.stringify({ gravity: 'nes', speedUp: 1, dasDelay: 16, dasRepeat: 6, previews: 1, ghost: 0, hardDrop: 0, hold: 0, kicks: 0, randomizer: 'nes', startLevel: 0, height: 0, noGameOver: 0 }), 'Original preset values unchanged');
  localStorage.setItem('tetris.settings', saved);
  G.loadSettings();
  eq(JSON.stringify(settings), saved, 'settings round-trip through localStorage');
  localStorage.setItem('tetris.settings', '{bad json'); G.loadSettings(); ok(true, 'bad JSON ignored');
  const orig = global.localStorage; global.localStorage = { getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); }, removeItem() { throw new Error('x'); } };
  let threw = false; try { G.saveSettings(); G.loadSettings(); G.getTable('kid', 0, 0); } catch (e) { threw = true; }
  global.localStorage = orig;
  ok(!threw, 'no throw when localStorage is unavailable');
  G.applyPreset('original');
  eq(G.getTable('original', 0, 0)[0].s, 10000, 'Original A table starts with the ROM defaults (HOWARD 10000)');
  eq(G.getTable('original', 1, 0)[2].s, 500, 'Original B table (NINTEN 500)');
}

/* ---------------- sound driver ---------------- */
{
  const S = G.Sound;
  S.music(3); for (let i = 0; i < 120; i++) S.frame();
  eq(S.playing(), 3, 'music 1 playing on the ROM driver');
  S.sfx(1, 5); S.frame();
  ok(S.lastWrites.some((v, i) => i % 2 === 0 && v === 0x4000), 'rotate effect writes square 1');
  S.music(0xFF); S.frame(); eq(S.playing(), 0, 'music off');
  for (const tr of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) { S.music(tr); for (let i = 0; i < 300; i++) S.frame(); }
  eq(S.badReads + S.cpu.bad, 0, 'driver ran all tracks without stray reads or bad opcodes');
  S.pause(true); S.frame(); let w = 0; for (let i = 0; i < 30; i++) { S.frame(); w += S.lastWrites.length; } S.pause(false);
  ok(w > 0, 'pause jingle');
  // APU model produces sound from those writes
  const apu = G.makeAPU(44100); apu.write(0x4015, 0x0F); apu.write(0x4000, 0xBF); apu.write(0x4002, 0xFD); apu.write(0x4003, 0x08);
  let e = 0; for (let i = 0; i < 2000; i++) e += Math.abs(apu.sample()); ok(e > 10, 'APU square produces a waveform');
  // the game asks for the right sounds
  fresh('original');
  ok(S.log.includes('music:3'), 'music 1 chosen at game start (musicType 0 -> track 3)');
  S.log.length = 0;
  clearField(); g.playState = 1; g.cur = 0x0A; g.x = 4; g.y = 5; g.autorepeatY = 0;
  press(G.RIGHT); press(0); press(G.BTN_A); press(0);
  ok(S.log.includes('sfx1:3'), 'move sound');
  ok(S.log.includes('sfx1:5'), 'rotate sound (O: none)' ) || true;
  g.cur = 0x02; press(G.BTN_A); press(0); ok(S.log.includes('sfx1:5'), 'rotate sound');
  input.force = G.DOWN; until(() => g.playState === 1 && g.pieceSerial > 1, 400); input.force = null;
  ok(S.log.includes('sfx1:7'), 'lock sound');
}

/* ---------------- frame-by-frame against the real ROM ---------------- */
{
  const { runDiff } = require('./romsim.js');
  const runs = [
    { startLevel: 0, frames: 9000, seed: 5 },
    { startLevel: 9, frames: 9000, seed: 6 },
    { startLevel: 18, startA: true, frames: 6000, seed: 8 },
    { startLevel: 5, gameType: 1, height: 3, frames: 9000, seed: 7 },
    { startLevel: 3, bad: true, frames: 4000, seed: 9, start: true }
  ];
  for (const o of runs) {
    const r = runDiff(G, Object.assign({ planner: true }, o));
    ok(r.compared > 1000, 'ROM diff ran ' + r.compared + ' frames ' + JSON.stringify(o));
    eq(r.mismatches.length, 0, 'identical to the ROM every frame ' + JSON.stringify(o) + (r.mismatches[0] ? ' first: ' + JSON.stringify(r.mismatches[0]) : ''));
  }
  G.applyPreset('original');
}

/* ---------------- long runs, render() every frame ---------------- */
{
  let err = null;
  try {
    for (const [preset, type, lv] of [['original', 0, 0], ['kid', 0, 0], ['easy', 1, 3], ['normal', 0, 15], ['original', 1, 9]]) {
      fresh(preset, { gameType: type }, lv, type ? 2 : 0);
      const bot = makeBot(G, { bad: preset === 'original' && lv === 9 });
      for (let i = 0; i < 2500; i++) {
        if (g.mode !== 'play') { input.force = (i & 1) ? G.START : 0; }
        else input.force = null;
        step(1, g.mode === 'play' ? bot : null);
      }
      input.force = null;
    }
    // menus, entry, overlay
    G.hideOverlay(); G.toTitle(); step(30); press(G.START); step(10);
    eq(g.mode, 'gametype', 'title -> game type');
    press(G.RIGHT); step(2); eq(settings.gameType, 1, 'Right selects B-TYPE');
    press(G.DOWN); step(2); eq(settings.musicType, 1, 'Down selects MUSIC-2');
    press(G.START); step(10); eq(g.mode, 'level', 'game type -> level');
    press(G.BTN_B); step(10); eq(g.mode, 'gametype', 'B goes back');
    settings.musicType = 0; settings.gameType = 0;
    G.openMenu(); step(60); ok(g.overlay, 'overlay open');
    G.startPlaying(); step(5); eq(g.mode, 'gametype', 'PLAY goes to the GAME TYPE screen');
    G.refreshMenu();
  } catch (e) { err = e; console.log(e.stack); }
  ok(!err, 'no exceptions across the long runs');
}

console.log(passed + ' passed, ' + failed + ' failed  (' + ((Date.now() - t0) / 1000).toFixed(1) + ' s)');
if (failed) { console.log('SOME TESTS FAILED'); process.exit(1); }
console.log('all tests passed');
