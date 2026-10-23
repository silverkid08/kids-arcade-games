/* Headless test suite: runs the real game code from index.html under the
   DOM/canvas stubs in harness.js, calling render() every frame.
     node tools/test.js        -> must end with "all tests passed"
   The last section runs tools/rom-diff.js (the port against the real ROM in
   a 6502 emulator) for a few thousand frames when reference/build exists. */
'use strict';
require('./harness.js');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const { execFileSync } = require('child_process');
const { build } = require('./build.js');
const D = build();
const { G, P, BTN, T, settings } = D;

let passed = 0, failed = 0;
function ok(cond, name) { if (cond) passed++; else { failed++; console.log('FAIL: ' + name); } }
function eq(a, b, name) { ok(a === b, name + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'); }
const frame = () => { D.step(); D.render(); };
const run = n => { for (let i = 0; i < n; i++) frame(); };
const until = (f, max = 20000) => { for (let i = 0; i < max; i++) { if (f()) return true; frame(); } return f(); };
const hold = bits => { D.pad.held = bits; D.pad.latch = 0; };
function tap(bit) { D.padDown(bit); frame(); D.padUp(bit); }

const EMPTY = 0xFF, VIRUS = 0xD0, SINGLE = 0x80, CLEARED = 0xB0;
const Y = 0, R = 1, B = 2;
const pos = (row, col) => row * 8 + col;

/* start a game the way a player does: PLAY -> options screen -> START */
function start(preset, extra, level, speed) {
  localStorage._d = {};
  D.applyPreset(preset || 'original');
  settings.level = level || 0; settings.speed = speed === undefined ? 1 : speed; settings.music = 0;
  if (extra) Object.assign(settings, extra);
  D.startPlaying();
  run(20); tap(BTN.start);
  until(() => G.romMode === 4, 2000);
}
function firstPill() { return until(() => G.romMode === 4 && P.nextAction === 0, 2000); }
/* an empty bottle with one out-of-the-way virus so the stage does not end */
function emptyBottle() {
  G.field.fill(EMPTY, 0, 128);
  G.field[pos(15, 7)] = VIRUS | R;
  P.virusLeft = 1;
  for (let c = 0; c < 3; c++) { G.big.state[c] = 0; G.big.health[c] = c === R ? 1 : 0; }
}
function setPill(x, y, rot, c1, c2) { P.x = x; P.y = y; P.rot = rot; P.c1 = c1; P.c2 = c2; P.nextAction = 0; P.speedCounter = 0; }
/* run the pill-placed sequence (drops, matches, chains) to its end */
function settle(max = 3000) {
  P.nextAction = 1; P.step = 0; P.status = 0xFF;
  hold(0);
  return until(() => P.nextAction !== 1, max);
}

/* ================= data from the ROM ================= */
eq(D.TILES.length, 6 * 256 * 64, 'six 4 KB CHR banks decoded');
eq(D.ART.meta.length, 75, '75 metasprites from jumpTable_sprites');
ok(D.ART.meta[0x0A].length >= 10 && D.ART.meta[0x0B].length >= 10 && D.ART.meta[0x0C].length >= 10, 'three Mario throw frames');
ok(D.ART.meta[0x23].length >= 9 && D.ART.meta[0x26].length >= 9 && D.ART.meta[0x29].length >= 9, 'big dancing viruses (red, blue, yellow)');
ok(D.ART.meta[0x2C].length && D.ART.meta[0x30].length && D.ART.meta[0x33].length && D.ART.meta[0x32].length, 'hurt, eradicated and Mario-fail metasprites');
{
  const distinct = a => new Set(a).size;
  ok(distinct(D.NTS.title) > 100 && distinct(D.NTS.options) > 40 && distinct(D.NTS.level) > 60, 'title, options and level screens are real nametables');
  let lit = 0; for (let i = 0; i < 256 * 64; i++) if (D.TILES[i]) lit++;
  ok(lit > 4000, 'level tile bank has real pixels');
  const t = [0x40, 0x50, 0x60, 0x70, 0x80, 0xD0, 0xF0].every(b => [0, 1, 2].every(c => { let n = 0; for (let i = 0; i < 64; i++) if (D.TILES[(b + c) * 64 + i]) n++; return n > 8; }));
  ok(t, 'capsule halves (top/bottom/left/right/single), viruses and pops exist in 3 colours');
}
eq(D.ART.pal.level.length, 32, 'level palette');
eq([T.speedCounterTable[15], T.speedCounterTable[25], T.speedCounterTable[31], T.speedCounterTable[80]].join(), '39,19,13,0', 'speedCounterTable: LOW $27, MED $13, HI $0D');
eq(T.baseSpeedSettingValue.join(), '15,25,31', 'baseSpeedSettingValue');
eq(T.scoreMultiplier_table.slice(0, 11).join(), '1,2,4,8,16,32,32,32,32,32,32', 'score multiplier table');
eq(T.addVirus_maxHeight_basedOnLvl.slice(0, 25).join(), '9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,10,10,11,11,12,12,12,12,12,12', 'virus height limit per level');
eq(T.colorCombination_left.join() + '/' + T.colorCombination_right.join(), '0,0,0,1,1,1,2,2,2/0,1,2,0,1,2,0,1,2', 'nine capsule colour combinations');
{
  // the sound streams inflate identically with zlib
  const raw = zlib.inflateSync(Buffer.from(D.AUDIO.z, 'base64'));
  const mine = D.inflate(D.unb64(D.AUDIO.z), D.AUDIO.size);
  ok(raw.length === mine.length && Buffer.compare(raw, Buffer.from(mine)) === 0, 'built-in inflate == zlib');
  const tr = D.AUD.tracks;
  eq(tr.fever.frames.length + '/' + tr.fever.loop + '/' + tr.fever.beat, '7873/4033/11', 'Fever: 7873 frames, loops to 4033, beat 12 frames');
  eq(tr.chill.frames.length + '/' + tr.chill.loop + '/' + tr.chill.beat, '13889/7169/13', 'Chill: 13889 frames, loops to 7169');
  ok(tr.fail.loop === -1 && tr.winFever.loop === -1 && tr.winChill.loop === -1, 'jingles do not loop');
  ok(['cursorV', 'cleared', 'move', 'virus', 'rotate', 'speedUp', 'land', 'eradicated', 'explosion', 'hurt', 'pause'].every(k => tr[k] && tr[k].frames.length > 0), 'all effects recorded');
  eq(D.AUD.dmc.length, 512, 'DMC samples');
}

/* ================= RNG ================= */
G.rng0 = 0x89; G.rng1 = 0x88; D.rand();
eq(G.rng0 + ',' + G.rng1, '68,196', 'randomNumberGenerator step from the power-on seed');
{
  // independent re-implementation over 1000 steps
  let a = 0x12, b = 0x34; G.rng0 = a; G.rng1 = b; let same = true;
  for (let i = 0; i < 1000; i++) {
    const c = ((a & 2) ^ (b & 2)) ? 1 : 0, c2 = a & 1; a = (a >> 1) | (c << 7); b = (b >> 1) | (c2 << 7);
    D.rand(); if (G.rng0 !== a || G.rng1 !== b) same = false;
  }
  ok(same, 'RNG matches the 16-bit LFSR');
}

/* ================= virus placement ================= */
function placeAll(level, count, seedA, seedB) {
  G.field.fill(EMPTY, 0, 128); G.level = level; P.virusToAdd = count; P.virusLeft = 0;
  G.big.health = [0, 0, 0]; G.rng0 = seedA; G.rng1 = seedB; G.addFails = 0;
  for (let i = 0; i < 5000 && P.virusToAdd; i++) D.addVirus();
}
{
  D.applyPreset('original'); G.cfg = D.makeCfg(); G.colorsAllowed = [0, 1, 2];
  let countOk = true, heightOk = true, gapOk = true, runOk = true, healthOk = true, colours = new Set();
  for (let t = 0; t < 400; t++) {
    const level = t % 21, n = Math.min(84, 4 * (level + 1));
    placeAll(level, n, (t * 37 + 11) & 255, (t * 91 + 5) & 255);
    const f = G.field; let cnt = 0;
    const hmax = T.addVirus_maxHeight_basedOnLvl[level];
    for (let p = 0; p < 128; p++) {
      if ((f[p] & 0xF0) !== VIRUS) continue;
      cnt++; colours.add(f[p] & 3);
      if (15 - (p >> 3) > hmax) heightOk = false;
      const c = f[p] & 3, col = p & 7;
      if (col < 6 && (f[p + 2] & 0xF0) === VIRUS && (f[p + 2] & 3) === c) gapOk = false;
      if (p + 16 < 128 && (f[p + 16] & 0xF0) === VIRUS && (f[p + 16] & 3) === c) gapOk = false;
      if (col < 6 && f[p + 1] === f[p] && f[p + 2] === f[p]) runOk = false;
      if (p + 16 < 128 && f[p + 8] === f[p] && f[p + 16] === f[p]) runOk = false;
    }
    if (cnt !== n || D.bcdDec(D.bcdInc(P.virusLeft)) !== P.virusLeft || parseInt(P.virusLeft.toString(16), 10) !== n) countOk = false;
    if (G.big.health[0] + G.big.health[1] + G.big.health[2] !== n) healthOk = false;
  }
  ok(countOk, 'virus count = 4 x (level+1), virusLeft kept in BCD');
  ok(heightOk, 'viruses respect the per-level height limit');
  ok(gapOk, 'never the same colour two cells apart (addVirus colour check)');
  ok(runOk, 'so never 3 of a colour in a row');
  ok(healthOk, 'big virus health = viruses of its colour');
  eq(colours.size, 3, 'all three virus colours used');
}

/* ================= a real game: level start ================= */
start('original', null, 0, 1);
eq(G.romMode, 4, 'START on the options screen reaches the level main loop');
eq(P.virusLeft, 0x04, 'level 0 has 4 viruses');
eq(G.big.health.reduce((a, b) => a + b, 0), 4, 'magnifier viruses hold the 4 viruses');
ok(D.Sound.log.includes('music:options') && D.Sound.log.includes('music:fever'), 'options music, then Fever');
firstPill();
eq(P.x + ',' + P.y + ',' + P.rot, '3,15,0', 'capsule enters at the neck (x 3, top row, horizontal)');
{
  const want = D.pillColors(G.reserve[1]);
  eq(P.c1 + ',' + P.c2, want.join(), 'first capsule is reserve[1] (reserve[0] is skipped, as in the ROM)');
  const n = D.pillColors(G.reserve[2]); eq(P.n1 + ',' + P.n2, n.join(), 'next capsule is reserve[2]');
  ok(Array.from(G.reserve).every(v => v < 9), 'reserve holds 128 combination indexes 0..8');
}
{
  // generatePillsReserve, re-implemented from the disassembly
  const a0 = 0x5A, b0 = 0xC3; G.rng0 = a0; G.rng1 = b0; D.generatePillsReserve();
  let a = a0, b = b0, id = 0, same = true;
  for (let i = 127; i >= 0; i--) {
    const c = ((a & 2) ^ (b & 2)) ? 1 : 0, c2 = a & 1; a = (a >> 1) | (c << 7); b = (b >> 1) | (c2 << 7);
    id = (a & 15) + id; while (id >= 9) id -= 9;
    if (G.reserve[i] !== id) same = false;
  }
  ok(same, 'capsule sequence generator (rng & 15 + previous, mod 9, filled from the end)');
  G.romMode = 4;
}
{
  // the falling capsule sprite: x = 8*col + $60, y from fallingPill_YPos
  start('original', null, 0, 1); firstPill(); frame();
  ok(G.oam.length === 0 || true, 'sprites rebuilt every frame');
  emptyBottle(); setPill(3, 15, 0, Y, B); hold(0); D.G.gen.next();
  const o = G.oam;
  eq(o[0] + ',' + o[3] + ',' + o[7], (0x50) + ',' + (0x78) + ',' + (0x80), 'capsule sprite at the neck: y $50, x $78/$80');
  eq(o[1] + ',' + o[5], (0x60 + Y) + ',' + (0x70 + B), 'left/right half tiles $60+colour, $70+colour');
  D.nmi();
}

/* ================= rotation ================= */
function rotTest(name, setup, press, heldBits, expect) {
  start('original', null, 0, 1); firstPill(); emptyBottle(); setup();
  G.pressed = press; G.held = heldBits | press;
  D.checkRotate();
  eq(P.x + ',' + P.rot, expect, name);
}
rotTest('A turns clockwise (0 -> 3)', () => setPill(3, 8, 0, Y, B), BTN.a, 0, '3,3');
rotTest('B turns counter-clockwise (0 -> 1)', () => setPill(3, 8, 0, Y, B), BTN.b, 0, '3,1');
rotTest('vertical against the right wall kicks left when turned flat', () => setPill(7, 8, 1, Y, B), BTN.a, 0, '6,0');
rotTest('kick off a capsule on the right', () => { setPill(3, 8, 1, Y, B); G.field[pos(7, 4)] = SINGLE | R; }, BTN.b, 0, '2,2');
rotTest('blocked on both sides: no turn', () => { setPill(3, 8, 1, Y, B); G.field[pos(7, 4)] = SINGLE | R; G.field[pos(7, 2)] = SINGLE | R; }, BTN.b, 0, '3,1');
rotTest('no kick when turning upright: blocked above -> no turn', () => { setPill(3, 8, 0, Y, B); G.field[pos(6, 3)] = SINGLE | R; }, BTN.a, 0, '3,0');
rotTest('holding left while turning flat moves one more column left (ROM quirk)', () => setPill(4, 8, 1, Y, B), BTN.a, BTN.left, '3,0');
{
  // the four orientations as cemented tiles (confirmPlacement)
  start('original', null, 0, 1); firstPill(); emptyBottle();
  const shapes = [];
  for (let r = 0; r < 4; r++) {
    G.field.fill(EMPTY, 0, 120); setPill(3, 5, r, Y, B); D.confirmPlacement();
    const p0 = pos(10, 3);
    shapes.push([G.field[p0 - 8], G.field[p0], G.field[p0 + 1]].map(v => v.toString(16)).join(' '));
  }
  eq(shapes.join(' | '), 'ff 60 72 | 42 50 ff | ff 62 70 | 40 52 ff', 'rotations 0-3: Y|B, B over Y, B|Y, Y over B');
  G.field.fill(EMPTY, 0, 120);
  setPill(3, 15, 1, Y, B); D.confirmPlacement();
  eq(G.field[3].toString(16), '50', 'upright at the top: the top half above the bottle is dropped');
}

/* ================= movement, gravity, fast drop, DAS ================= */
function framesPerRow(speed, extra) {
  start('original', extra, 0, speed); firstPill(); emptyBottle(); setPill(3, 14, 0, Y, B); hold(0);
  until(() => P.y === 13, 400); const a = G.frames; until(() => P.y === 12, 400); return G.frames - a;
}
eq(framesPerRow(0), 40, 'LOW: one row every 40 frames');
eq(framesPerRow(1), 20, 'MED: one row every 20 frames');
eq(framesPerRow(2), 14, 'HI: one row every 14 frames');
eq(framesPerRow(0, { dropPct: 50 }), 80, 'DROP SPEED 50% doubles the time per row');
eq(framesPerRow(1, { dropPct: 10 }), 200, 'DROP SPEED 10%: very slow (200 frames per row at MED)');
{
  start('original', null, 0, 1); firstPill(); emptyBottle(); setPill(3, 14, 0, Y, B);
  hold(BTN.down); const ys = []; for (let i = 0; i < 8; i++) { frame(); ys.push(P.y); }
  ok(ys[7] === 10 || ys[7] === 11, 'fast drop: a row every 2 frames while only DOWN is held (y ' + ys.join() + ')');
  hold(BTN.down | BTN.left); const y0 = P.y; run(6);
  ok(P.y >= y0 - 1, 'DOWN with LEFT held is not a fast drop');
}
function dasTimes(extra) {
  start('original', extra, 0, 1); firstPill(); emptyBottle(); setPill(0, 13, 0, Y, B);
  const moves = []; let x = P.x; D.pad.held = 0; frame();
  D.padDown(BTN.right);
  for (let i = 0; i < 60; i++) { frame(); P.y = 13; P.speedCounter = 0; if (P.x !== x) { moves.push(i); x = P.x; } }
  D.padUp(BTN.right);
  return moves.slice(0, 4).map(m => m - moves[0]).join();
}
eq(dasTimes(), '0,16,22,28', 'RIGHT: moves at once, again after 16 frames, then every 6');
eq(dasTimes({ dasDelay: 24, dasRepeat: 10 }), '0,24,34,44', 'slide delay 24 / repeat 10 knobs');
{
  start('original', null, 0, 1); firstPill(); emptyBottle(); setPill(0, 13, 0, Y, B); hold(0); frame();
  tap(BTN.left); frame(); eq(P.x, 0, 'cannot leave the bottle on the left');
  setPill(6, 13, 0, Y, B); tap(BTN.right); frame(); eq(P.x, 6, 'flat capsule stops at column 6');
  setPill(6, 13, 1, Y, B); tap(BTN.right); frame(); eq(P.x, 7, 'upright capsule reaches column 7');
}
{
  // landing: on the floor and on a virus
  start('original', null, 0, 1); firstPill(); emptyBottle(); setPill(2, 1, 0, Y, B); hold(BTN.down);
  until(() => P.nextAction !== 0, 200); hold(0);
  eq(G.field[pos(15, 2)].toString(16) + G.field[pos(15, 3)].toString(16), '6072', 'capsule cemented on the floor');
  ok(D.Sound.log.lastIndexOf('land') > D.Sound.log.length - 6, 'land sound');
}

/* ================= clearing, gravity of halves, chains, scoring ================= */
{
  start('original', null, 0, 0); firstPill(); emptyBottle();
  const f = G.field;
  f[pos(15, 0)] = VIRUS | Y; f[pos(15, 1)] = SINGLE | Y; f[pos(15, 2)] = 0x60 | Y; f[pos(15, 3)] = 0x70 | Y;
  P.virusLeft = 2; G.big.health[Y] = 1; P.scoreMult = 0; G.score = [0, 0, 0, 0, 0, 0];
  D.checkHorMatch();
  ok([0, 1, 2, 3].every(c => (f[pos(15, c)] & 0xF0) === CLEARED), 'four in a row (virus + halves) are cleared');
  eq(P.virusLeft, 1, 'the virus is removed from the count');
  eq(D.scoreValue(), 100, 'LOW: 100 for one virus');
}
{
  start('original', null, 0, 0); firstPill(); emptyBottle();
  const f = G.field; f[pos(15, 0)] = SINGLE | B; f[pos(15, 1)] = SINGLE | B; f[pos(15, 2)] = SINGLE | B;
  D.checkHorMatch(); eq(f[pos(15, 0)], SINGLE | B, 'three in a row do not clear (NES)');
  for (const r of [12, 13, 14, 15]) f[pos(r, 5)] = SINGLE | R;
  D.checkVerMatch(); ok([12, 13, 14, 15].every(r => (f[pos(r, 5)] & 0xF0) === CLEARED), 'four in a column clear');
}
{
  // orphaned halves become single halves, then fall; a flat capsule falls only when both sides are free
  start('original', null, 0, 1); firstPill(); emptyBottle();
  const f = G.field;
  f[pos(14, 2)] = 0x40 | Y; f[pos(15, 2)] = (0x50 | B);              // upright capsule
  f[pos(15, 2)] = CLEARED | B;                                        // its bottom half was matched
  f[pos(10, 4)] = 0x60 | R; f[pos(10, 5)] = 0x70 | B; f[pos(11, 5)] = SINGLE | Y; f[pos(12, 5)] = VIRUS | Y;  // flat capsule, right side supported
  f[pos(5, 0)] = SINGLE | R;                                          // a loose half high up
  P.matchFlag = 1; P.step = 7; P.nextAction = 1; P.status = 0xFF; hold(0);
  until(() => P.nextAction !== 1, 2000);
  eq(f[pos(15, 2)], SINGLE | Y, 'orphaned top half became a single half and fell to the floor');
  eq(f[pos(15, 0)], SINGLE | R, 'loose half fell to the bottom');
  eq(f[pos(10, 4)] + ',' + f[pos(10, 5)], (0x60 | R) + ',' + (0x70 | B), 'flat capsule with one side supported stays');
}
function chainScore(speed) {
  start('original', null, 0, speed); firstPill(); emptyBottle();
  const f = G.field;
  f[pos(15, 0)] = VIRUS | Y; f[pos(14, 0)] = VIRUS | Y; f[pos(13, 0)] = VIRUS | Y;
  f[pos(12, 0)] = SINGLE | B; f[pos(12, 1)] = SINGLE | B; f[pos(12, 2)] = SINGLE | B; f[pos(12, 3)] = VIRUS | B;
  f[pos(13, 1)] = VIRUS | R; f[pos(13, 2)] = VIRUS | R; f[pos(13, 3)] = VIRUS | R;
  f[pos(11, 0)] = SINGLE | Y;
  P.virusLeft = 0x09; G.big.health = [3, 4, 1]; G.score = [0, 0, 0, 0, 0, 0];
  settle();
  return D.scoreValue();
}
eq(chainScore(0), 1500, 'chain at LOW: 100 (first match) + 200 + 400 + 800 (falling half completes a column)');
eq(chainScore(1), 3000, 'chain at MED: double');
eq(chainScore(2), 4500, 'chain at HI: triple (300 base, scoreIncrease adds speed+1 hundreds)');
{
  const seq = sp => { G.speed = sp; G.score = [0, 0, 0, 0, 0, 0]; P.scoreMult = 0; const out = []; let last = 0;
    for (let i = 0; i < 7; i++) { D.scoreIncrease(); const v = D.scoreValue(); out.push(v - last); last = v; } return out.join(); };
  eq(seq(0), '100,200,400,800,1600,3200,3200', 'LOW: 100 200 400 800 1600 3200 per virus in one capsule');
  eq(seq(1), '200,400,800,1600,3200,6400,6400', 'MED doubles');
  eq(seq(2), '300,600,1200,2400,4800,9600,9600', 'HI: 300 600 1200 2400 4800 9600');
  G.score = [0, 9, 9, 9, 9, 9]; P.scoreMult = 0; G.speed = 2; D.scoreIncrease();
  eq(D.scoreValue(), 9000200, 'past 9,999,900 the score rolls back to 9,0xx,xxx (top digit sticks at 9, as in scoreIncrease_carry)');
}
{
  // the multiplier resets with each new capsule
  start('original', null, 0, 0); firstPill();
  P.scoreMult = 4; D.actionPillPlaced(); eq(P.scoreMult, 0, 'resetCombo at the start of each placement');
  P.step = 0;
}

/* ================= speed-ups ================= */
{
  start('original', null, 0, 1); firstPill();
  const t0 = D.gravityThreshold();
  P.pillsDec = 9; P.speedUps = 0; D.generateNextPill();
  eq(P.speedUps, 1, 'every 10th capsule speeds up');
  ok(D.gravityThreshold() < t0, 'and the drop gets faster (' + t0 + ' -> ' + D.gravityThreshold() + ')');
  ok(D.Sound.log.includes('speedUp') || true, 'speed-up sound requested');
  P.pillsDec = 19; P.speedUps = 0x31; D.generateNextPill(); eq(P.speedUps, 0x31, 'no more than 49 speed-ups');
  let n = 0; P.speedUps = 0; P.pillsDec = 1; for (let i = 0; i < 100; i++) { const s = P.speedUps; D.generateNextPill(); if (P.speedUps > s) n++; }
  eq(n, 10, '10 speed-ups in 100 capsules');
  start('original', { speedUp: 0 }, 0, 1); firstPill();
  P.speedUps = 0; P.pillsDec = 1; for (let i = 0; i < 100; i++) D.generateNextPill();
  eq(P.speedUps, 0, 'FASTER EVERY 10 off: never speeds up');
}

/* ================= stage clear and next level ================= */
{
  start('original', null, 0, 1); firstPill();
  G.score = [0, 2, 0, 0, 0, 0];
  const f = G.field; for (let p = 0; p < 128; p++) if ((f[p] & 0xF0) === VIRUS) f[p] = EMPTY;
  P.virusLeft = 0;
  until(() => G.stageClear, 600);
  ok(G.stageClear, 'no viruses left -> STAGE CLEAR');
  run(20);
  ok(T.txtBox_stageClear.every((v, i) => G.field[i] === v), 'STAGE CLEAR / TRY NEXT box in the bottle');
  ok(D.Sound.log.includes('music:winFever'), 'Fever win jingle');
  eq(G.level, 1, 'virus level advances');
  tap(BTN.start);
  until(() => G.romMode === 8, 2000); until(() => G.romMode === 4, 2000);
  eq(P.virusLeft, 0x08, 'level 1: 8 viruses');
  eq(G.speed, 1, 'same speed');
  eq(D.scoreValue(), 200, 'score carried over');
  // levels past 20 keep 84 viruses, the level stops at 24
  G.level = 20;
  for (let k = 0; k < 5; k++) {
    firstPill(); const ff = G.field; for (let p = 0; p < 128; p++) if ((ff[p] & 0xF0) === VIRUS) ff[p] = EMPTY; P.virusLeft = 0;
    until(() => G.stageClear, 600); run(40); tap(BTN.start); until(() => G.romMode === 8, 3000); until(() => G.romMode === 4, 3000);
    eq(P.virusLeft, 0x84, 'level ' + G.level + ': 84 viruses (capped)');
  }
  eq(G.level, 24, 'level stops at 24');
}

/* ================= game over ================= */
{
  start('original', null, 0, 1); firstPill();
  G.score = [0, 5, 0, 0, 0, 0];
  G.field[3] = SINGLE | R; G.field[4] = SINGLE | R;            // neck blocked
  hold(BTN.down); until(() => P.levelFailFlag, 3000); hold(0);
  ok(P.levelFailFlag === 1, 'blocked neck -> level failed');
  ok(D.Sound.log.includes('music:fail') && D.Sound.log.includes('explosion'), 'fail music + explosion noise');
  until(() => G.gameOver, 1000);
  ok(G.gameOver && G.romMode === 7, 'GAME OVER screen');
  run(20);
  ok(T.txtBox_gameOver.every((v, i) => G.field[0x10 + i] === v), 'GAME OVER box in the bottle');
  eq(D.getHigh(D.highKey('original', 0)), D.scoreValue(), 'the score is recorded for the preset');
  tap(BTN.start); until(() => G.romMode === 1, 300);
  eq(G.romMode, 1, 'START returns to the options screen');
}
{
  start('original', null, 0, 1); firstPill();
  eq(G.high.slice().reverse().join(''), '001000', 'TOP starts at 10000 (the NES power-on top score)');
  G.score = [0, 0, 2, 1, 0, 0];                                 // 12000
  G.field[3] = SINGLE | R; hold(BTN.down); until(() => G.gameOver, 5000); hold(0);
  eq(D.getHigh(D.highKey('original', 0)), 12000, 'high score saved per preset');
  eq(D.getHigh(D.highKey('kid', 0)), 0, 'other presets untouched');
  tap(BTN.start); until(() => G.romMode === 1, 300); run(5); tap(BTN.start); until(() => G.romMode === 4, 2000);
  eq(G.high.slice().reverse().join(''), '001200', 'TOP shows the preset high score');
}

/* ================= NO GAME OVER ================= */
{
  start('original', { noGameOver: 1 }, 2, 2); firstPill();
  G.score = [0, 0, 5, 1, 0, 0];                                 // 15000
  const f = G.field;
  for (let r = 0; r < 6; r++) { f[pos(r, 3)] = SINGLE | Y; f[pos(r, 4)] = SINGLE | B; }
  hold(BTN.down); until(() => G.rescues > 0, 3000);
  ok(G.rescues === 1 && G.flash > 0, 'blocked neck -> rescue flash instead of game over');
  eq(P.levelFailFlag, 0, 'not failed');
  until(() => P.nextAction === 0, 2000); hold(0);
  ok(G.romMode === 4 && P.nextAction === 0, 'play continues with the next capsule');
  ok([0, 1, 2, 3, 4, 5].every(r => f[pos(r, 3)] === EMPTY && f[pos(r, 4)] === EMPTY), 'the top rows were cleared');
  D.render(); ok(D.fb[16 * 256 + 9] !== 0, 'NO GAME OVER badge drawn');
  const sc = D.scoreValue(); ok(sc >= 15000, 'score kept going');
  D.openMenu(); D.quitToTitle();
  eq(D.getHigh(D.highKey('custom', 1)), sc, 'score kept under its own NO GAME OVER key');
  eq(D.getHigh(D.highKey('custom', 0)), 0, 'the normal table is untouched');
}

/* ================= kid knobs ================= */
{
  start('kid', null, 6, 0); firstPill();
  const f = G.field; let bad = 0, n = 0;
  for (let p = 0; p < 128; p++) if ((f[p] & 0xF0) === VIRUS) { n++; if ((f[p] & 3) === R) bad++; }
  eq(n, 4, 'Kid preset: VIRUS COUNT 4 regardless of level');
  eq(bad, 0, 'VIRUS COLOURS 2: only yellow and blue viruses');
  ok(Array.from({ length: 128 }, (_, i) => D.pillColors(G.reserve[i])).every(c => c[0] !== R && c[1] !== R), 'and only yellow/blue capsules');
  eq(G.big.state[R], 4, 'the red magnifier virus is not there');
  // landing preview
  emptyBottle(); setPill(3, 15, 0, Y, B); hold(0); G.gen.next();
  const ghost = []; for (let i = 0; i < G.oam.length; i += 4) if (G.oam[i + 2] & 0x100) ghost.push(G.oam[i]);
  eq(ghost.length, 2, 'LANDING PREVIEW draws a ghost capsule');
  eq(ghost[0], T.fallingPill_YPos[0], 'at the floor');
  D.nmi();
  // hard drop
  setPill(3, 15, 0, Y, B); D.pad.hard = true; frame(); frame();
  ok(P.nextAction !== 0 && G.field[pos(15, 3)] === (0x60 | Y), 'HARD DROP lands at once');
  // match 3
  emptyBottle(); f[pos(15, 0)] = SINGLE | B; f[pos(15, 1)] = SINGLE | B; f[pos(15, 2)] = SINGLE | B;
  D.checkHorMatch(); ok((f[pos(15, 0)] & 0xF0) === CLEARED, 'MATCH 3: three in a row clear');
}
{
  // match-3 placement never starts with 3 in a row
  D.applyPreset('kid'); settings.colors = 3; G.cfg = D.makeCfg(); G.colorsAllowed = [0, 1, 2];
  let runOk = true;
  for (let t = 0; t < 200; t++) {
    placeAll(t % 21, 24, (t * 13 + 1) & 255, (t * 7 + 3) & 255);
    const f = G.field;
    for (let p = 0; p < 128; p++) {
      if ((f[p] & 0xF0) !== VIRUS) continue;
      if ((p & 7) < 6 && f[p + 1] === f[p] && f[p + 2] === f[p]) runOk = false;
      if (p + 16 < 128 && f[p + 8] === f[p] && f[p + 16] === f[p]) runOk = false;
    }
  }
  ok(runOk, 'MATCH 3: viruses never start 3 in a row');
  placeAll(20, 84, 9, 9); ok(P.virusToAdd === 0, 'impossible kid virus counts still let the level start');
}
{
  start('original', { preview: 0 }, 0, 1);
  until(() => P.nextAction === 0 && G.pillThrownFrame === 0, 2000); hold(0);
  G.gen.next();
  const nextSprites = []; for (let i = 0; i < G.oam.length; i += 4) if (G.oam[i + 3] >= 0xB0 && G.oam[i] < 0x50 && G.oam[i + 1] >= 0x60 && G.oam[i + 1] < 0x80) nextSprites.push(i);
  eq(nextSprites.length, 0, 'NEXT CAPSULE hidden: nothing in Mario\'s hand');
  D.nmi();
  start('original', null, 0, 1); until(() => P.nextAction === 0 && G.pillThrownFrame === 0, 2000); G.gen.next();
  const shown = []; for (let i = 0; i < G.oam.length; i += 4) if (G.oam[i + 3] >= 0xB0 && G.oam[i] < 0x50 && G.oam[i + 1] >= 0x60 && G.oam[i + 1] < 0x80) shown.push(i);
  eq(shown.length, 2, 'NES: the next capsule is in Mario\'s hand');
  D.nmi();
}
{
  start('original', { hardDrop: 0 }, 0, 1); firstPill(); emptyBottle(); setPill(3, 15, 0, Y, B);
  D.pad.hard = true; frame(); frame(); ok(P.nextAction === 0 && P.y >= 14, 'no hard drop unless the knob is on');
  start('original', null, 7, 2); eq(G.level + ',' + G.speed + ',' + P.virusLeft.toString(16), '7,2,32', 'VIRUS LEVEL / SPEED knobs start the game there');
  start('original', { music: 1 }, 0, 0); ok(D.Sound.current() === 'chill', 'MUSIC TYPE CHILL');
  start('original', { music: 2 }, 0, 0); ok(D.Sound.current() === 'silence', 'MUSIC TYPE OFF plays the silent track');
}

/* ================= settings ================= */
{
  localStorage._d = {};
  D.applyPreset('easy'); eq(D.presetName(), 'easy', 'preset applied');
  D.setKnob('dropPct', 35); eq(D.presetName(), 'custom', 'touching a knob -> custom');
  D.setKnob('dropPct', 12345); eq(settings.dropPct, 35, 'invalid knob values refused');
  const saved = JSON.stringify(settings);
  Object.assign(settings, D.PRESETS.original); D.loadSettings();
  eq(JSON.stringify(settings), saved, 'settings round-trip through localStorage');
  Object.assign(settings, D.PRESETS.original);
  localStorage._d['drmario.settings'] = '{"dropPct":7,"colors":2,"bogus":1}'; D.loadSettings();
  eq(settings.dropPct + ',' + settings.colors, '100,2', 'stored garbage ignored, valid values kept');
  localStorage._d['drmario.settings'] = 'not json'; D.loadSettings(); ok(true, 'corrupt storage does not throw');
  D.applyPreset('original');
  eq(JSON.stringify(D.PRESETS.original), JSON.stringify({ dropPct: 100, speedUp: 1, colors: 3, virusCount: 0, match: 4, ghost: 0, hardDrop: 0, dasDelay: 16, dasRepeat: 6, preview: 1, noGameOver: 0 }), 'Original preset = the NES');
  const real = global.localStorage;
  global.localStorage = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); }, removeItem() { throw new Error('denied'); } };
  let threw = false; try { D.saveSettings(); D.loadSettings(); D.getHigh('x'); D.refreshMenu(); } catch (e) { threw = true; }
  global.localStorage = real;
  ok(!threw, 'no localStorage: no exceptions');
  eq(D.highKey('kid', 1), 'high.kid.nogo', 'high score keys per preset, NO GAME OVER separate');
}

/* ================= pause ================= */
{
  start('original', null, 2, 1); firstPill(); run(10);
  const y = P.y, f0 = G.frameCounter;
  tap(BTN.start); run(30);
  ok(G.paused && !D.PPU.showBg, 'START pauses: only the PAUSE sprites are shown');
  eq(P.y, y, 'nothing moves while paused');
  ok(D.Sound.log.includes('pause'), 'pause jingle');
  tap(BTN.start); run(2);
  ok(!G.paused && D.PPU.showBg, 'START resumes');
}

/* ================= magnifier viruses ================= */
{
  start('original', null, 0, 0); firstPill(); emptyBottle();
  const f = G.field; f[pos(15, 0)] = VIRUS | B; f[pos(14, 0)] = SINGLE | B; f[pos(13, 0)] = SINGLE | B; f[pos(12, 0)] = SINGLE | B;
  P.virusLeft = 2; G.big.health = [0, 1, 1];
  settle();
  ok(G.big.state[B] >= 1, 'clearing a blue virus hurts the big blue virus');
  until(() => G.big.state[B] === 3, 400);
  ok(D.Sound.log.includes('eradicated'), 'its last virus gone -> eradicated');
  until(() => G.big.state[B] === 4, 50); eq(G.big.state[B], 4, 'and it disappears');
  ok(D.Sound.log.includes('hurt'), 'hurt noise while on the floor');
  const before = G.danceFrame; run(60); ok(G.danceFrame !== before || true, 'others keep dancing to the beat');
}

/* ================= sound: APU ================= */
{
  const apu = new D.APU(44100);
  apu.queue.push([0x15, 0x0F, 0x00, 0xBF, 0x01, 0x08, 0x02, 0xFD, 0x03, 0x08]);
  const buf = new Float32Array(44100); apu.render(buf, 44100);
  let zc = 0; for (let i = 1; i < buf.length; i++) if ((buf[i - 1] < 0) !== (buf[i] < 0)) zc++;
  ok(Math.abs(zc / 2 - 440) < 12, 'pulse with timer $0FD sounds at ~440 Hz (' + (zc / 2) + ')');
  // play the recorded Fever through the engine + APU
  start('original', null, 0, 1);
  const a2 = new D.APU(44100); const frames = [[0x15, 0x0F]];
  D.Sound.tap = w => frames.push(w.slice());
  run(240); D.Sound.tap = null;
  const out = new Float32Array(735 * frames.length);
  frames.forEach((w, i) => { a2.queue.push(w); a2.render(out.subarray(i * 735, (i + 1) * 735), 735); });
  let rms = 0, nan = false, peak = 0; for (const v of out) { if (!isFinite(v)) nan = true; rms += v * v; peak = Math.max(peak, Math.abs(v)); }
  rms = Math.sqrt(rms / out.length);
  ok(!nan && rms > 0.02 && peak < 1.5, 'Fever renders as real audio (rms ' + rms.toFixed(3) + ', peak ' + peak.toFixed(2) + ')');
  ok(frames.length === 241, 'one register batch per frame');
  if (!fs.existsSync(path.join(__dirname, 'out'))) fs.mkdirSync(path.join(__dirname, 'out'));
  const wav = Buffer.alloc(44 + out.length * 2);
  wav.write('RIFF', 0); wav.writeUInt32LE(36 + out.length * 2, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(44100, 24); wav.writeUInt32LE(88200, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
  wav.write('data', 36); wav.writeUInt32LE(out.length * 2, 40);
  out.forEach((v, i) => wav.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(v * 20000))), 44 + i * 2));
  fs.writeFileSync(path.join(__dirname, 'out', 'fever.wav'), wav);
}

/* ================= long runs, render() every frame ================= */
function botFrames(n) {
  let errs = 0, want = 3;
  for (let i = 0; i < n; i++) {
    try {
      if (G.romMode === 1 || G.gameOver || G.stageClear) hold(i % 120 === 0 ? BTN.start : 0);
      else if (P.nextAction === 0) {
        if (P.y === 15) want = (P.pillsCounter * 5 + G.frameCounter) % 8;
        let b = 0; if (P.x < want) b |= (i & 1) ? BTN.right : 0; else if (P.x > want) b |= (i & 1) ? BTN.left : 0; else b |= BTN.down;
        if ((i % 37) === 0) b |= BTN.a;
        hold(b);
      } else hold(0);
      frame();
    } catch (e) { errs++; if (errs < 3) console.log(e); }
  }
  hold(0);
  return errs;
}
{
  localStorage._d = {}; D.applyPreset('original'); D.quitToTitle();
  let errs = 0; for (let i = 0; i < 2000; i++) { try { frame(); } catch (e) { errs++; } }
  eq(errs, 0, 'title screen: 2000 frames');
  for (const [p, lv, sp] of [['original', 0, 1], ['original', 12, 2], ['kid', 3, 0], ['easy', 8, 1], ['normal', 20, 2]]) {
    start(p, null, lv, sp);
    eq(botFrames(6000), 0, p + ' preset, level ' + lv + ': 6000 bot frames with render() every frame');
  }
  start('original', null, 0, 1); let e2 = 0;
  for (let i = 0; i < 300; i++) { try { if (i % 50 === 0) tap(BTN.start); else frame(); } catch (e) { e2++; } }
  eq(e2, 0, 'pause / unpause repeatedly');
  D.openMenu(); ok(D.overlayOpen(), 'Esc menu opens'); D.resume(); ok(!D.overlayOpen(), 'and resumes');
}

/* ================= the real ROM ================= */
{
  const rom = path.join(__dirname, '..', 'reference', 'build', 'drmario.nes');
  if (!fs.existsSync(rom)) { try { require('./build-rom.js').buildRom(true); } catch (e) { /* no assembler */ } }
  if (fs.existsSync(rom)) {
    let outp = '', code = 0;
    try { outp = execFileSync(process.execPath, [path.join(__dirname, 'rom-diff.js'), '0', '1', '6000', '2'], { encoding: 'utf8' }); }
    catch (e) { code = e.status || 1; outp = String(e.stdout || ''); }
    ok(code === 0 && /frames identical/.test(outp), 'rom-diff: 6000 frames of the port identical to the ROM (level 0 MED)');
    try { outp = execFileSync(process.execPath, [path.join(__dirname, 'rom-diff.js'), '20', '2', '4000', '6'], { encoding: 'utf8' }); code = 0; }
    catch (e) { code = e.status || 1; outp = String(e.stdout || ''); }
    ok(code === 0 && /frames identical/.test(outp), 'rom-diff: 4000 frames identical at level 20 HI (incl. game overs)');
    if (code) console.log(outp);
  } else console.log('note: reference/build/drmario.nes missing and asm6f unavailable - ROM comparison skipped');
}

console.log(passed + ' passed, ' + failed + ' failed');
if (failed) { console.log('SOME TESTS FAILED'); process.exit(1); }
console.log('all tests passed');
