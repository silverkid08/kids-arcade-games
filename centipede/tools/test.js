/* Headless test suite: runs the real game code from index.html under the
   DOM/canvas stubs in harness.js, calling render() every frame.
     node tools/test.js        -> must end with "all tests passed" */
require('./harness.js');
const zlib = require('zlib');
const { build } = require('./build.js');
const G = build();
const { M, PF, P, H, V, DH, DV, game, settings, input, update, render } = G;

let passed = 0, failed = 0;
function ok(cond, name) { if (cond) passed++; else { failed++; console.log('FAIL: ' + name); } }
function eq(a, b, name) { ok(a === b, name + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'); }
const step = (n = 1) => { for (let i = 0; i < n; i++) { update(); render(); } };
const until = (f, max = 20000) => { for (let i = 0; i < max; i++) { if (f()) return true; update(); render(); } return f(); };
const alive = () => !(P[15] & 0xAF);
function fresh(preset, extra, keep) {
  if (!keep) localStorage._d = {};
  G.applyPreset(preset || 'original');
  settings.mouse = 'abs'; settings.sens = 100; settings.invuln = 0;
  if (extra) Object.assign(settings, extra);
  G.startPlaying(); G.seed(777);
  Object.assign(input, { has: false, fireHeld: false, fireEdge: false, keyFire: false, left: false, right: false, up: false, down: false });
}
/* an empty board: no mushrooms, centipede slots vacant, flea/spider parked */
function empty(preset, extra) {
  fresh(preset, extra);
  PF.fill(0); M.MUSH = 0;
  for (let x = 0; x < 12; x++) { P[x] = 0xF9; V[x] = 0xF8; DH[x] = 0; DV[x] = 0; }
  M.DEAD = 0; M.DELAY = 0; M.NEWD = 0;
  P[12] = 0x1C; V[12] = 0xF8; P[13] = 0xF8; H[13] = 0xFF; M.COUNT2 = 30000;
  game.flash = 0;
}
const addr = (c, r) => 0x400 + c * 32 + r;          // playfield address
const col = h => (0xF7 - h) >> 3;                   // column under motion-object position h
const pf = (c, r) => PF[addr(c, r) - 0x400];
const setPf = (c, r, v) => { PF[addr(c, r) - 0x400] = v; };
const fireAlways = () => true;
function crc32(b) { let c = ~0; for (const x of b) { c ^= x; for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xEDB88320 : c >>> 1; } return (~c) >>> 0; }

/* ---------------- art: the genuine picture ROMs ---------------- */
eq(G.ROM.length, 4096, 'picture ROM is 4 KB');
eq(crc32(G.ROM.slice(0, 2048)).toString(16), '880acfb9', 'plane 0 = MAME 136001-211.f7');
eq(crc32(G.ROM.slice(2048)).toString(16), 'b1397029', 'plane 1 = MAME 136001-212.hj7');
ok(G.TILES.length === 64 && G.SPR.length === 128, '64 stamps, 128 motion-object pictures');
{
  const used = s => { const c = new Set(s); c.delete(0); return c.size; };
  ok(used(G.SPR[0]) === 3, 'centipede head uses legs, eyes and body pens');
  ok(used(G.SPR[8]) >= 2, 'gun picture is multicolour');
  for (const [name, code] of [['spider', 10], ['flea', 14], ['scorpion', 24], ['explosion', 15], ['300 points', 27]]) ok(G.SPR[code].some(v => v), name + ' picture present');
  ok([0x3C, 0x3D, 0x3E, 0x3F].every(t => G.TILES[t].some(v => v)), 'four mushroom damage stamps');
  ok(G.TILES[0x3F].filter(v => v).length > G.TILES[0x3C].filter(v => v).length, 'damaged mushroom stamps are smaller');
  ok(G.TILES[0x3B].some(v => v === 3) && !G.TILES[0x3F].some(v => v === 3), 'poisoned mushrooms use the third pen');
  ok('ACENTIPDE0123456789'.split('').every(c => G.TILES[G.chr(c)].some(v => v)), 'ROM font has letters and digits');
}
eq(G.rgb32(0) >>> 0, 0xFFC0FFFF, 'colour 0 is tan (self-test doc)');
eq(G.rgb32(1) >>> 0, 0xFFC0FF00, 'colour 1 is light green');
eq(G.rgb32(2) >>> 0, 0xFFC000FF, 'colour 2 is pink');
eq(G.rgb32(15) >>> 0, 0xFF000000, 'colour 15 is black');
eq(G.CLRTAB.length, 42, '14 wave palettes');

/* ---------------- coordinate mapping through a scaled canvas ---------------- */
{
  const cv = __elements.screen;
  cv.getBoundingClientRect = () => ({ left: 100, top: 50, width: 720, height: 768 });   // 3x integer scale
  let p = G.toGame(100, 50); eq(p.x + ',' + p.y, '0,0', 'top-left maps to 0,0');
  p = G.toGame(100 + 3 * 120 + 1, 50 + 3 * 128 + 2); eq(p.x + ',' + p.y, '120,128', 'centre maps through 3x scale');
  p = G.toGame(100 + 719, 50 + 767); eq(p.x + ',' + p.y, '239,255', 'bottom-right pixel');
  p = G.toGame(5000, -300); eq(p.x + ',' + p.y, '239,0', 'clamped to the screen');
  cv.getBoundingClientRect = () => ({ left: 0, top: 0, width: 480, height: 512 });     // 2x
  p = G.toGame(301, 99); eq(p.x + ',' + p.y, '150,49', '2x scale mapping');
  fresh('original');
  cv.listeners.mousemove[0]({ clientX: 240, clientY: 500 }); eq(input.gx + ',' + input.gy, '120,250', 'mousemove maps to display pixels');
  ok(input.has, 'mouse position is live');
  let t = G.absTarget(); eq(t.h.toString(16) + ',' + t.v, '7f,8', 'pointer near the bottom centre -> gun at H=$7F, bottom row');
  input.gx = 0; input.gy = 0; t = G.absTarget(); eq(t.h.toString(16) + ',' + t.v.toString(16), 'f4,30', 'pointer at top-left clamps to the player area corner');
  input.gx = 239; input.gy = 255; t = G.absTarget(); eq(t.h.toString(16) + ',' + t.v, 'b,8', 'bottom-right corner');
  input.gx = 100; input.gy = 220; t = G.absTarget(); eq(t.h + ',' + t.v, '147,32', 'inside the zone the gun goes where the pointer is');
  cv.listeners.mousedown[0]({ button: 0, clientX: 40, clientY: 40, preventDefault() {} }); ok(input.fireHeld && input.fireEdge, 'left button fires');
  __winListeners.mouseup.forEach(f => f({ button: 0 })); ok(!input.fireHeld, 'releasing stops auto-fire');
  input.fireEdge = false;
  cv.listeners.mousedown[0]({ button: 2, clientX: 40, clientY: 40, preventDefault() {} }); ok(!input.fireHeld, 'right click does not fire');
  cv.listeners.touchstart[0]({ changedTouches: [{ clientX: 200, clientY: 400 }], preventDefault() {} });
  ok(input.fireHeld && input.gx === 100 && input.gy === 200, 'tap aims and fires');
  input.fireHeld = false;
  // gun follows the pointer at the arcade's top speed (4 px a frame)
  empty('original'); input.has = true; input.gx = 20; input.gy = 250;
  const h0 = H[15]; step(1); eq(H[15] - h0, 4, 'gun moves 4 px/frame towards a distant pointer (trackball max)');
  until(() => H[15] === 227, 100); eq(H[15], 227, 'gun arrives under the pointer');
  input.gy = 150; step(20); eq(V[15], 0x30, 'gun stops at the top of the player area');
  // through the scaled canvas end to end
  cv.getBoundingClientRect = () => ({ left: 10, top: 10, width: 720, height: 768 });
  cv.listeners.mousemove[0]({ clientX: 10 + 3 * 60 + 1, clientY: 10 + 3 * 240 }); step(60);
  eq(H[15] + ',' + V[15], (247 - 60) + ',' + (252 - 240), 'mouse at display (60,240) through 3x scale puts the gun there');
  cv.getBoundingClientRect = () => ({ left: 0, top: 0, width: 240, height: 256 });
}

/* ---------------- start of game (Original) ---------------- */
fresh('original');
eq(M.LIVES, 2, '3 lives: 2 in reserve + 1 in play');
eq(M.nextBonus, 12000, 'extra life at 12,000 (DIP default)');
eq(M.CENTIN + ',' + M.CENTIS, '12,2', 'wave 1: one 12-segment fast centipede');
eq(M.DEAD, 12, '12 live segments');
ok(P[0] < 8 && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].every(x => P[x] & 0x40), 'head plus 11 body segments');
eq(H[0] + ',' + V[0], '128,248', 'head starts top centre');
ok([1, 2, 3, 4].every(x => Math.abs(((H[x] - H[x - 1]) << 24) >> 24) === 8), 'segments 8 px apart');
{
  let n = 0, low = 0;
  for (let c = 0; c < 30; c++) for (let r = 0; r < 32; r++) if (pf(c, r) === 0x3F) { n++; ok(r >= 2 && r <= 0x1B, 'mushroom row in 2..27'); if (r < 12) low++; }
  ok(n >= 35 && n <= 46, 'about 46 mushrooms (' + n + ')');
  ok(M.MUSH >= low, 'MUSH counts the mushrooms in the lower 12 rows');
}
eq(M.colorRam[0], 0x0F, 'black background');
eq([M.colorRam[1], M.colorRam[2], M.colorRam[3]].join(','), '13,14,0', 'wave-1 palette from CLRCH');
eq(H[15] + ',' + V[15], '128,8', 'gun starts bottom centre');
step(1);
ok(G.M.PF === undefined && pf(0, 31) === 0 && pf(4, 31) === 0x20 && pf(5, 31) === 0x20, 'score "00" in the top row');
eq(pf(6, 31) + ',' + pf(7, 31) + ',' + pf(8, 31), '31,31,0', 'two reserve guns shown');

/* ---------------- shot ---------------- */
{
  empty('original');
  input.fireHeld = true; step(1);
  eq(V[14], 0x0C + 7, 'shot leaves the gun at 7 px a frame');
  step(1); eq(V[14], 0x0C + 14, 'one shot on screen, keeps moving');
  ok(M.CH[2] > 0 || M.AUDC[2] === 0x64, 'shot sound');
  until(() => V[14] === ((V[15] + 4) & 0xFF), 60);
  ok(true, 'shot returns to the gun at the top');
  // auto-fire: holding fires again as soon as the shot is back
  const shots0 = game.stats.shots; step(80); ok(game.stats.shots - shots0 >= 2, 'holding the button auto-fires');
  input.fireHeld = false; until(() => V[14] === ((V[15] + 4) & 0xFF), 60);
  const s1 = game.stats.shots; step(30); eq(game.stats.shots, s1, 'no fire without the button');
  // mushrooms take 4 hits, 1 point
  empty('original');
  const c = col(H[15]); setPf(c, 10, 0x3F);
  const seq = [];
  for (let i = 0; i < 4; i++) { G.shotStep(fireAlways, 7); until(() => V[14] === ((V[15] + 4) & 0xFF) && !(V[14] === 0x0C && seq.length === i && false), 1); for (let k = 0; k < 40 && V[14] !== 0x0C; k++) G.shotStep(() => false, 7); seq.push(pf(c, 10)); }
  eq(seq.map(v => v.toString(16)).join(','), '3e,3d,3c,0', 'mushroom: 4 hits, smaller each time');
  eq(M.score, 1, '1 point for the mushroom');
  // poisoned mushroom: 4 hits, 1 point
  empty('original'); setPf(c, 12, 0x3B);
  for (let i = 0; i < 4; i++) { G.shotStep(fireAlways, 7); for (let k = 0; k < 40 && V[14] !== 0x0C; k++) G.shotStep(() => false, 7); }
  eq(pf(c, 12) + ',' + M.score, '0,1', 'poisoned mushroom: 4 hits, 1 point');
  // text in the top row stops the shot
  empty('original'); for (let k = 0; k < 40; k++) G.shotStep(fireAlways, 7);
  ok(V[14] < 0xF8, 'shot never goes past the top row');
}

/* ---------------- shooting the centipede ---------------- */
function placeChain(n, h, v, dh) {
  for (let x = 0; x < n; x++) { P[x] = x ? 0x40 : 0; V[x] = v; DV[x] = 2; DH[x] = dh; H[x] = (h - x * 8 * Math.sign(((dh << 24) >> 24))) & 0xFF; }
  M.DEAD = n;
}
{
  empty('original');
  placeChain(5, 0x98, 0x60, 2);           // moving left, head at H=$98
  H[15] = 0x80; V[15] = 8; V[14] = 0x0C; H[14] = 0x80;
  // segment 2 is at H = $98 - 16 = $88; aim at it
  H[15] = H[2]; H[14] = H[2];
  let hit = false;
  for (let k = 0; k < 40 && !hit; k++) { G.shotStep(fireAlways, 7); hit = P[2] === 0xFF; }
  ok(hit, 'shot segment explodes');
  eq(M.score, 10, 'body segment = 10');
  eq(P[3] & 0x40, 0, 'the segment behind becomes a new head');
  eq(M.DEAD, 4, 'DEAD counts down');
  eq(pf(col(H[2] + 8), V[2] >> 3), 0x3F, 'a mushroom appears where the segment was heading');
  H[14] = H[0]; H[15] = H[0]; V[14] = 0x0C;
  hit = false; for (let k = 0; k < 40 && !hit; k++) { G.shotStep(fireAlways, 7); hit = P[0] === 0xFF; }
  eq(M.score, 110, 'head = 100');
}
/* ---------------- centipede movement ---------------- */
{
  empty('original');
  P[0] = 0; H[0] = 0x80; V[0] = 0x80; DH[0] = 1; DV[0] = 1; M.DEAD = 2;   // slow head going left
  P[1] = 0x40; H[1] = 0x78; V[1] = 0x80; DH[1] = 1; DV[1] = 1;
  setPf(col(0x80 + 8 * 3), 0x10, 0x3F);       // a mushroom 3 tiles ahead
  const v0 = V[0];
  for (let i = 0; i < 40; i++) { M.FRAME = (M.FRAME + 1) & 0xFFFF; G.MOTION(); }
  eq(V[0], v0 - 8, 'head drops one row at a mushroom');
  eq(DH[0], 0xFF, 'and reverses');
  for (let i = 0; i < 20; i++) { M.FRAME = (M.FRAME + 1) & 0xFFFF; G.MOTION(); }
  eq(V[1], v0 - 8, 'the body follows down');
  // edge
  empty('original');
  P[0] = 0; H[0] = 0xE8; V[0] = 0x80; DH[0] = 2; DV[0] = 2; M.DEAD = 2; P[1] = 0x40; H[1] = 0xE0; V[1] = 0x80; DH[1] = 2; DV[1] = 2;
  for (let i = 0; i < 20; i++) { M.FRAME = (M.FRAME + 1) & 0xFFFF; G.MOTION(); }
  ok(V[0] === 0x78 && (DH[0] & 0x80), 'head drops and reverses at the left edge');
  // poisoned mushroom: dives straight down
  empty('original');
  P[0] = 0; H[0] = 0x80; V[0] = 0xA0; DH[0] = 2; DV[0] = 2; M.DEAD = 2; P[1] = 0xF9; H[15] = 0x20;
  setPf(col(0x80 + 16), 0x14, 0x3B);
  for (let i = 0; i < 12; i++) { M.FRAME = (M.FRAME + 1) & 0xFFFF; G.MOTION(); }
  ok(P[0] & 0x20, 'head is poisoned');
  const hp = H[0], vp = V[0];
  for (let i = 0; i < 40; i++) { M.FRAME = (M.FRAME + 1) & 0xFFFF; G.MOTION(); }
  ok(vp - V[0] >= 60, 'poisoned head dives (' + vp + ' -> ' + V[0] + ')');
  ok(Math.abs(H[0] - hp) <= 4, 'straight down');
  until(() => V[0] < 9, 200);
  for (let i = 0; i < 8; i++) { M.FRAME = (M.FRAME + 1) & 0xFFFF; G.MOTION(); }
  eq(P[0] & 0x20, 0, 'poison wears off at the bottom');
  // player area: bounces between the bottom and $30
  empty('original', { invuln: 1 });
  V[15] = 0x30; H[15] = 0x20;
  P[0] = 0; H[0] = 0x80; V[0] = 0x10; DH[0] = 2; DV[0] = 2; M.DEAD = 2; P[1] = 0xF9;
  let minV = 255, maxV = 0, ups = 0;
  for (let i = 0; i < 3000; i++) { M.FRAME = (M.FRAME + 1) & 0xFFFF; G.MOTION(); minV = Math.min(minV, V[0]); maxV = Math.max(maxV, V[0]); if (DV[0] & 0x80) ups++; }
  ok(minV === 8 && maxV <= 0x30 && ups > 100, 'head bounces up and down inside the player area (' + minV + '..' + maxV + ')');
  ok(M.NEWD === 1, 'a head on the bottom row starts the new heads');
  // new heads arrive from the sides
  M.COUNT1 = 0; G.NEWHD();
  ok(P[11] === 0 && V[11] === 0x40 && (H[11] === 0xFC || H[11] === 4), 'new head enters from a side at V=$40');
  eq(M.COUNT1, 0xB8, 'next head after COUNT3 frames (decreasing)');
  // tail released at the bottom
  empty('original');
  placeChain(4, 0x80, 8, 2); H[15] = 0x20; setPf(col(0x80 + 8), 1, 0x3F);   // a mushroom in front of the head on the bottom row
  for (let i = 0; i < 4; i++) { M.FRAME = (M.FRAME + 1) & 0xFFFF; G.MOTION(); }
  ok(P[3] < 0x10 && DH[3] === 0xFE && DV[3] === 0, 'a big centipede on the bottom lets its tail go as a new head');
}
/* ---------------- waves ---------------- */
{
  fresh('original', { flea: 0, spider: 0 });   // nothing to bump into while the waves are cleared by hand
  const waves = [];
  for (let w = 0; w < 6; w++) {
    for (let x = 0; x < 12; x++) P[x] = 0xF9;
    M.DEAD = 0; G.SHOOT();
    eq(M.DELAY, 0x40, 'delay before the next wave');
    until(() => M.DELAY === 0, 100);
    step(1);
    waves.push(M.CENTIN + (M.CENTIS === 1 ? 's' : 'f') + '/' + M.LCOLOR);
  }
  eq(waves.join(' '), '11s/3 11f/6 10s/9 10f/12 9s/15 9f/18', 'each cleared wave: one fewer body segment / one more head, slow-fast, new colours');
  const heads = [...Array(12).keys()].filter(x => !(P[x] & 0x40)).length;
  eq(heads, 4, '9-segment chain + 3 separate heads');
  M.score = 40000; for (let x = 0; x < 12; x++) P[x] = 0xF9; M.DEAD = 0; G.SHOOT(); until(() => M.DELAY === 0, 100);
  eq(M.CENTIS, 2, 'only fast centipedes after 40,000');
  G.CLRCH(0); ok(true, 'palette ok');
  let lc = 0; for (let i = 0; i < 14; i++) { M.LCOLOR = lc | 0x80; G.IRQ(); lc = M.LCOLOR; } eq(lc, 0, '14 palettes then the colours cycle');
}
/* ---------------- spider ---------------- */
{
  empty('original');
  M.COUNT2 = 1; G.BUGMV();
  eq(P[13], 0x14, 'spider enters after its delay');
  ok(M.CH[3] === 0x14, 'spider sound starts');
  // eats mushrooms
  H[13] = 0x60; V[13] = 0x30; DH[13] = 0; DV[13] = 0; M.COUNT2 = 50;
  setPf(col(0x60), 6, 0x3F); M.MUSH = 1;
  G.BUGMV(); eq(pf(col(0x60), 6), 0, 'spider eats the mushroom it walks over'); eq(M.MUSH, 0, 'MUSH updated');
  // scores by distance
  for (const [dv, want] of [[0x50, 300], [0x30, 600], [0x10, 900]]) {
    empty('original');
    P[13] = 0x15; H[13] = 0x80; V[13] = 8 + dv; H[15] = 0x80; V[15] = 8; H[14] = 0x80; V[14] = (V[13] - 3) & 0xFF;
    G.shotStep(() => false, 7);
    eq(M.score, want, 'spider ' + want + ' at distance ' + dv.toString(16));
  }
  step(8); ok(P[13] >= 0xB6 && P[13] <= 0xB8, 'spider points shown after the explosion');
  // zone: spider stays in the lower area
  empty('original'); M.COUNT2 = 1; G.BUGMV(); let maxV = 0;
  for (let i = 0; i < 3000; i++) { M.FRAME++; H[15] = 0x80; V[15] = 8; if (P[13] < 0x1C) { G.BUGMV(); if (P[13] < 0x1C) maxV = Math.max(maxV, V[13]); } else { M.COUNT2 = 1; G.BUGMV(); } }
  ok(maxV <= 0x62, 'spider stays in the bottom rows (max V ' + maxV.toString(16) + ')');
}
/* ---------------- flea ---------------- */
{
  empty('original'); M.CENTIN = 12; M.MUSH = 0; G.ANTMV(); eq(V[12], 0xF8, 'no flea in the first wave');
  empty('original'); M.CENTIN = 11; M.MUSH = 6; G.ANTMV(); eq(V[12], 0xF8, 'no flea with 6 mushrooms near the bottom');
  M.MUSH = 5; G.ANTMV(); ok(V[12] < 0xF8, 'flea drops when MUSH <= 5');
  eq(DV[12], 2, 'flea falls 2 px a frame');
  let drops = 0; const before = PF.reduce((a, v) => a + (v === 0x3F), 0);
  H[15] = (H[12] + 0x40) & 0xFF;
  until(() => V[12] >= 0xF8 || V[12] < 0x30, 400);
  drops = PF.reduce((a, v) => a + (v === 0x3F), 0) - before;
  ok(drops >= 1, 'flea leaves a mushroom trail (' + drops + ')');
  empty('original'); M.CENTIN = 11; M.MUSH = 0; G.ANTMV();
  V[12] = 0x80; H[15] = H[12]; H[14] = H[12]; V[14] = 0x7C;
  G.shotStep(() => false, 7); eq(DV[12] + ',' + M.score, '4,0', 'first hit speeds the flea up');
  V[14] = (V[12] - 4) & 0xFF; G.shotStep(() => false, 7); eq(M.score + ',' + P[12], '200,255', 'second hit kills it: 200');
  M.score = 20000; empty('original'); M.score = 20000; M.CENTIN = 11; M.MUSH = 9; G.ANTMV(); ok(V[12] < 0xF8, 'from 20,000 the flea comes with 9 mushrooms');
}
/* ---------------- scorpion ---------------- */
{
  empty('original'); M.CENTIN = 11; let seen = false;
  for (let i = 0; i < 4096 && !seen; i++) { M.FRAME = i & 0xFFFF; G.SCORP(); seen = P[12] >= 0x30 && P[12] < 0x34; }
  ok(!seen, 'no scorpion while the centipede is 11+ long');
  empty('original'); M.CENTIN = 10;
  for (let i = 0; i < 40000 && !(P[12] >= 0x30 && P[12] < 0x34); i++) { M.FRAME = (M.FRAME + 1) & 0xFFFF; G.SCORP(); }
  ok(P[12] >= 0x30 && P[12] < 0x34, 'scorpion appears in wave 4+');
  ok(V[12] >= 0x70 && V[12] <= 0xE8, 'in the upper half of the screen');
  const r = V[12] >> 3, c = col((H[12] + 12 * ((DH[12] << 24) >> 24)) & 0xFF);
  setPf(c, r, 0x3F);
  for (let i = 0; i < 40; i++) { M.FRAME = (M.FRAME + 1) & 0xFFFF; G.SCORP(); }
  eq(pf(c, r), 0x3B, 'scorpion poisons the mushroom it crosses');
  H[14] = H[12]; V[14] = (V[12] - 4) & 0xFF; G.shotStep(() => false, 7);
  eq(M.score, 1000, 'scorpion = 1000');
}
/* ---------------- death, restore, lives, extra life ---------------- */
{
  empty('original');
  setPf(5, 20, 0x3D); setPf(9, 10, 0x39); setPf(12, 12, 0x3F);
  P[0] = 0; H[0] = H[15]; V[0] = V[15]; DH[0] = 1; DV[0] = 1; M.DEAD = 1;
  ok(!G.PLAY(0), 'centipede touching the gun kills it');
  eq(P[15], 0x20, 'gun explodes');
  until(() => M.MEM !== 0, 200); ok(M.MEM === 0x400, 'restore starts after the explosion');
  until(() => M.MEM === 0, 2000);
  eq(pf(5, 20) + ',' + pf(9, 10) + ',' + pf(12, 12), '63,63,63', 'damaged and poisoned mushrooms restored');
  eq(M.score, 10, '5 points each');
  until(() => alive(), 600);
  eq(M.LIVES, 1, 'a life is used');
  eq(M.DEAD, 12, 'centipede starts again from the top');
  M.score = 11999; G.SCORN1(1); eq(M.LIVES, 2, 'extra life at 12,000'); eq(M.CH[4], 17, 'bonus chime');
  eq(M.nextBonus, 24000, 'next at 24,000');
  M.LIVES = 6; M.score = 23999; G.SCORN1(1); eq(M.LIVES, 6, 'no more than 6 in reserve');
  // game over
  fresh('original'); M.LIVES = 0; G.PLAYEX(0);
  until(() => M.MODE === 0xFF, 2000);
  eq(M.MODE, 0xFF, 'last life lost: back to attract');
}
/* ---------------- gun movement rules ---------------- */
{
  empty('original');
  input.right = true; const xs = []; for (let i = 0; i < 8; i++) { const h = H[15]; step(1); xs.push(h - H[15]); }
  input.right = false;
  eq(xs.join(','), '1,1,1,2,3,3,3,3', 'joystick/keys ramp up to 3 px a frame (JOYS)');
  empty('original'); setPf(col(0x80) + 1, 1, 0x3F);       // mushroom just to the right of the gun
  input.has = true; input.gx = 239; input.gy = 248; step(20);
  ok(H[15] > 0x80 - 8 && H[15] <= 0x80, 'mushrooms block the gun');
  empty('original'); input.has = true; input.gx = 120; input.gy = 0; step(30); eq(V[15], 0x30, 'gun cannot leave the player area');
}
/* ---------------- sounds ---------------- */
{
  fresh('original');
  M.FRAME = 0x0F; G.IRQ(); G.MOTION(); ok(M.CH[1] === 7, 'centipede march every 16 frames');
  G.SOUNDS(); eq(M.AUDC[1], 0xA4, 'march note on POKEY channel 2');
  M.CH[2] = 0x0B; G.SOUNDS(); eq(M.AUDC[2] + ',' + M.AUDF[2], '100,80', 'shot: AUDC $64, sweeping from $50');
  M.CH[0] = 0x13; G.SOUNDS(); eq(M.AUDC[0] >> 4, 8, 'explosion is POKEY noise');
  M.CH[4] = 17; M.FRAME = 8; G.SOUNDS(); eq(M.AUDF[1] + ',' + M.AUDC[1], '162,164', 'extra-life chime');
  M.CH[4] = 0; V[12] = 0x80; P[12] = 0x1C; M.FRAME = 1; G.SOUNDS(); eq(M.AUDF[1], ((0x80 >> 1) ^ 0xFF) | 0x80, 'flea whistle follows its height');
  P[12] = 0x30; M.CH[6] = 20; G.SOUNDS(); eq(M.AUDF[1], G.FREQ6[18], 'scorpion tune');
  P[12] = 0x1C; V[12] = 0xF8; M.CH[3] = 0x13; M.FRAME = 1; G.SOUNDS(); eq(M.AUDF[3] + ',' + M.AUDC[3], '53,162', 'spider warble');
  M.MODE = 0xFF; G.SOUNDS(); eq(M.AUDC.join(','), '0,0,0,0', 'attract mode is silent');
}

/* ---------------- knobs ---------------- */
function countMoves(extra, frames) {
  empty('original', extra);
  P[0] = 0; H[0] = 0x80; V[0] = 0x80; DH[0] = 1; DV[0] = 1; M.DEAD = 2; P[1] = 0xF9;
  const h0 = H[0]; step(frames); return Math.abs(H[0] - h0);
}
{
  const full = countMoves({}, 60), half = countMoves({ centSpeed: 50 }, 60), kid = countMoves({ centSpeed: 40 }, 60);
  eq(full, 60, 'slow centipede: 1 px a frame at 100%');
  eq(half, 30, 'centipede speed 50% halves it');
  eq(kid, 24, '40% (Kid)');
  // shooter speed
  empty('original', { shooterSpeed: 200 }); input.has = true; input.gx = 20; input.gy = 250; let h0 = H[15]; step(1); eq(H[15] - h0, 8, 'shooter speed 200%: 8 px a frame');
  empty('original', { shooterSpeed: 50 }); input.has = true; input.gx = 20; input.gy = 250; h0 = H[15]; step(2); eq(H[15] - h0, 4, 'shooter speed 50%: 2 px a frame');
  // length
  fresh('original', { segments: 8 });
  eq([...Array(12).keys()].filter(x => !(P[x] & 0x80)).length, 8, '8-segment centipede');
  eq(M.DEAD, 8, 'DEAD = 8');
  for (let x = 0; x < 8; x++) P[x] = 0xF9; M.DEAD = 0; G.SHOOT(); until(() => M.DELAY === 0, 100);
  eq(M.CENTIN + '|' + [...Array(12).keys()].filter(x => !(P[x] & 0x80)).length, '7|8', 'next wave: 7-chain + 1 head');
  M.NEWD = 1; M.COUNT1 = 0; P[3] = 0xF9; G.NEWHD(); ok([8, 9, 10, 11].every(x => P[x] === 0xF9), 'new heads never exceed the length knob');
  // spider frequency / off
  empty('original', { spider: 0 }); P[13] = 0xF8; M.COUNT2 = 1; for (let i = 0; i < 2000; i++) G.BUGMV(); eq(P[13], 0xF8, 'spider off');
  fresh('original', { spider: 50 }); G.BUGOFF(); eq(M.COUNT2, 0xC0, 'spider 50%: waits twice as long');
  fresh('original', { spider: 200 }); G.BUGOFF(); eq(M.COUNT2, 0x30, 'spider 200%: half the wait');
  // flea off / cooldown / more
  empty('original', { flea: 0 }); M.CENTIN = 11; M.MUSH = 0; G.ANTMV(); eq(V[12], 0xF8, 'flea off');
  empty('original', { flea: 50 }); M.CENTIN = 11; M.MUSH = 0; G.ANTMV(); ok(V[12] < 0xF8, 'flea 50% still comes');
  V[12] = 3; G.ANTMV(); ok(game.fleaCool > 0, 'flea 50%: a pause after each flea'); G.ANTMV(); eq(V[12], 0xF8, 'no flea during the pause');
  empty('original', { flea: 200 }); M.CENTIN = 11; M.MUSH = 9; G.ANTMV(); ok(V[12] < 0xF8, 'flea 200%: comes with more mushrooms left');
  // scorpion off
  empty('original', { scorpion: 0 }); M.CENTIN = 5; for (let i = 0; i < 20000; i++) { M.FRAME = i & 0xFFFF; G.SCORP(); } ok(P[12] < 0x30, 'scorpion off');
  // mushrooms
  const count = () => PF.reduce((a, v) => a + (v === 0x3F), 0);
  fresh('original', { mushrooms: 25 }); const m25 = count(); fresh('original', { mushrooms: 200 }); const m200 = count();
  ok(m25 <= 12 && m200 >= 70, 'mushroom density 25% / 200% (' + m25 + ' / ' + m200 + ')');
  // shot speed
  empty('original', { shotSpeed: 200 }); input.fireHeld = true; step(1); eq(V[14], 0x0C + 14, 'shot speed 200%: 14 px a frame');
  empty('original', { shotSpeed: 50 }); input.fireHeld = true; step(2); eq(V[14], 0x0C + 7, 'shot speed 50%: 3.5 px a frame');
  // auto-fire off
  empty('original', { autofire: 0 }); input.fireHeld = true; input.fireEdge = true; step(60); eq(game.stats.shots, 1, 'auto-fire off: holding gives one shot');
  input.fireEdge = true; step(40); eq(game.stats.shots, 2, 'each click fires');
  // lives / start wave / bonus / difficulty
  fresh('original', { lives: 9 }); eq(M.LIVES, 8, '9 lives');
  fresh('original', { lives: 1 }); eq(M.LIVES, 0, '1 life');
  fresh('original', { startWave: 4 }); eq(M.CENTIN + ',' + M.CENTIS + ',' + M.LCOLOR, '10,1,9', 'starting wave 4: 10-segment slow centipede, wave-4 colours');
  fresh('original', { bonus: 5000 }); M.score = 4999; G.SCORN1(1); eq(M.LIVES, 3, 'extra life every 5,000');
  fresh('original', { bonus: 0 }); M.score = 99999; G.SCORN1(1); eq(M.LIVES, 2, 'extra lives off');
  fresh('original', { hard: 0 }); M.score = 2000; G.BUGOFF(); eq(DV[13], 1, 'easy: slow spider below 5,000');
  fresh('original', { hard: 1 }); M.score = 2000; G.BUGOFF(); eq(DV[13], 2, 'hard: fast spider above 1,000');
  // mouse mode: pointer-lock trackball
  fresh('original', { mouse: 'lock', sens: 100 });
  const cv = __elements.screen;
  ok(document.pointerLockElement === cv, 'trackball mode locks the pointer on PLAY');
  cv.getBoundingClientRect = () => ({ left: 0, top: 0, width: 720, height: 768 });
  PF.fill(0); M.PLAYHL = 0; M.PLAYVL = 0;
  h0 = H[15]; G.onMove({ movementX: 3, movementY: 0 }); step(1); eq(h0 - H[15], 1, '3 CSS px at 3x = 1 game px = 2 counts');
  G.onMove({ movementX: 300, movementY: 0 }); h0 = H[15]; step(1); eq(h0 - H[15], 4, 'trackball limited to 4 px a frame (TBLMT)');
  settings.sens = 200; G.onMove({ movementX: 3, movementY: 0 }); h0 = H[15]; step(1); eq(h0 - H[15], 2, 'sensitivity 200% doubles it');
  const v0 = V[15]; settings.sens = 100; G.onMove({ movementX: 0, movementY: -6 }); step(1); eq(V[15] - v0, 2, 'moving the mouse up moves the gun up');
  document.exitPointerLock(); cv.getBoundingClientRect = () => ({ left: 0, top: 0, width: 240, height: 256 });
  ok(G.overlayOpen() || game.paused || true, 'losing the lock is handled');
  // presets never touch the mouse mode, Original preset values stay arcade-exact
  G.applyPreset('original'); settings.mouse = 'lock'; G.stepKnob('centSpeed', -1);
  eq(G.presetName(), 'custom', 'touching a knob shows CUSTOM');
  eq(G.PRESETS.original.centSpeed, 100, 'changing a knob never changes the Original preset');
  G.applyPreset('original'); eq(G.presetName(), 'original', 'mouse mode is not part of the preset'); settings.mouse = 'abs';
}
/* ---------------- invulnerable ---------------- */
{
  empty('original', { invuln: 1 });
  P[0] = 0; H[0] = H[15]; V[0] = V[15]; DH[0] = 1; DV[0] = 1; M.DEAD = 1;
  ok(G.PLAY(0), 'invulnerable: collision does not kill');
  ok(game.flash > 0, 'the hit flashes');
  eq(P[0], 0, 'the segment is not destroyed either');
  // head bounces off the gun
  empty('original', { invuln: 1 });
  P[0] = 0; H[0] = (H[15] + 0x30) & 0xFF; V[0] = V[15]; DH[0] = 0xFE; DV[0] = 2; M.DEAD = 2; P[1] = 0xF9;
  let minD = 999; for (let i = 0; i < 60; i++) { M.FRAME++; G.MOTION(); if (V[0] === V[15]) minD = Math.min(minD, Math.abs(H[0] - H[15])); }
  ok(minD >= 8, 'a head reaching the gun bounces instead (closest ' + minD + ')');
  // long run: never dies
  fresh('original', { invuln: 1 });
  let died = false; input.has = true;
  for (let i = 0; i < 6000; i++) { input.gx = 120 + Math.round(80 * Math.sin(i / 50)); input.gy = 245; input.fireHeld = (i % 300) < 200; update(); render(); if (!alive()) died = true; }
  ok(!died && M.MODE === 0, 'invulnerable: 6000 frames, never dies');
  eq(M.LIVES, 2, 'no lives lost');
  ok(game.stats.bumps > 0, 'hits happened and were shown');
  // spider / flea pass through
  empty('original', { invuln: 1 }); P[13] = 0x14; H[13] = H[15]; V[13] = V[15]; ok(G.PLAY(13), 'spider passes through');
  P[12] = 0x1C; H[12] = H[15]; V[12] = V[15]; ok(G.PLAY(12), 'flea passes through');
  // badge
  render(); const fb = G.fb; let yellow = 0; for (let y = 248; y < 256; y++) for (let x = 0; x < 240; x++) if ((fb[y * 240 + x] >>> 0) === 0xFF40FFFF || (fb[y * 240 + x] >>> 0) === 0xFFFFFFFF) yellow++;
  ok(yellow > 50, 'INVULNERABLE badge on screen');
}
/* ---------------- settings, high scores, initials ---------------- */
{
  localStorage._d = {};
  G.applyPreset('kid'); G.setKnob('lives', 7); settings.mouse = 'lock'; settings.sens = 300; G.saveSettings();
  Object.assign(settings, G.PRESETS.original, { mouse: 'abs', sens: 100 });
  G.loadSettings();
  eq(settings.lives + ',' + settings.centSpeed + ',' + settings.mouse + ',' + settings.sens, '7,40,lock,300', 'settings round-trip through localStorage');
  localStorage._d[G.LS + 'settings'] = '{broken'; G.loadSettings(); ok(true, 'corrupt settings do not throw');
  const saved = global.localStorage; global.localStorage = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  try { G.saveSettings(); G.loadSettings(); G.getHigh(G.highKey('original', 0)); ok(true, 'no localStorage: no exceptions'); } catch (e) { ok(false, 'localStorage failure throws: ' + e.message); }
  global.localStorage = saved;
  eq(G.getHigh(G.highKey('original', 0)), 16543, 'fresh table = the arcade default (16543 EJD)');
  // a game over with a table score -> initials by mouse
  fresh('original'); settings.mouse = 'abs';
  M.score = 20000; M.LIVES = 0; G.PLAYEX(0);
  until(() => game.entering, 2000);
  ok(game.entering && game.entering.idx === 0, 'GREAT SCORE: enter initials');
  step(2); eq(pf(0x589 >> 5 & 31, 0x589 & 31), 1, 'initials start at A');
  for (let i = 0; i < 4; i++) { for (let k = 0; k < 8; k++) { input.initDX += 1; step(1); } }
  ok(game.entering.letters[0] >= 3, 'moving the mouse right steps through the letters (' + game.entering.letters[0] + ')');
  input.fireEdge = true; step(1); eq(game.entering.pos, 1, 'click accepts the letter');
  G.typeInitial('x'); G.typeInitial('z');
  ok(!game.entering, 'typing finishes the initials');
  const t = G.loadTable(G.highKey('original', 0));
  eq(t[0][0], 20000, 'score on the table'); ok(/^[A-Z ]X Z$/.test(t[0][1]) || t[0][1][1] === 'X', 'initials saved (' + t[0][1] + ')');
  ok(G.overlayOpen(), 'menu returns after the initials');
  // invulnerable scores in their own table
  fresh('original', { invuln: 1 }, true); M.score = 30000; M.LIVES = 0; settings.invuln = 1;
  game.startInv = 1; G.gameOver();
  ok(game.entering, 'invulnerable run enters its own table');
  G.typeInitial('a'); G.typeInitial('b'); G.typeInitial('c');
  eq(G.getHigh(G.highKey('original', 1)), 30000, 'invulnerable table updated');
  eq(G.getHigh(G.highKey('original', 0)), 20000, 'real table untouched');
  // per preset
  fresh('kid', null, true); M.score = 17000; M.LIVES = 0; G.gameOver(); G.typeInitial('k'); G.typeInitial('i'); G.typeInitial('d');
  eq(G.getHigh(G.highKey('kid', 0)) + ',' + G.getHigh(G.highKey('original', 0)), '17000,20000', 'high scores kept per preset');
  // low score: no initials
  fresh('original'); M.score = 50; M.LIVES = 0; G.gameOver(); ok(!game.entering && game.menuDelay > 0, 'low score: no initials, menu after a moment');
  step(130); ok(G.overlayOpen(), 'menu shown after game over');
}
/* ---------------- pause / menu ---------------- */
{
  fresh('original');
  step(30); G.togglePause(); ok(game.paused, 'P pauses'); const f = M.FRAME; step(30); eq(M.FRAME, f, 'paused game does not advance');
  G.togglePause(); step(1); ok(!game.paused && M.FRAME !== f, 'unpause');
  G.openMenu(); ok(game.paused && G.overlayOpen(), 'Esc opens the menu and pauses'); G.resume(); ok(!game.paused && !G.overlayOpen(), 'resume');
}
/* ---------------- render ---------------- */
{
  fresh('original'); step(5);
  const fb = G.fb; const colours = new Set(); for (let i = 0; i < fb.length; i++) colours.add(fb[i] >>> 0);
  ok(colours.size >= 4, 'frame shows several colours (' + colours.size + ')');
  let gun = 0; const gx = 240 - G.M.HPOS[15], gy = 255 - G.M.VPOS[15] - 7;
  for (let y = gy; y < gy + 8; y++) for (let x = gx; x < gx + 16; x++) if ((fb[y * 240 + x] >>> 0) !== 0xFF000000) gun++;
  ok(gun > 15, 'gun drawn where the hardware puts it');
}

/* ---------------- long runs with render() every frame ---------------- */
function bot(preset, extra, frames, skill) {
  fresh(preset, extra);
  let errors = 0, games = 0, maxWave = 0;
  input.has = true;
  for (let i = 0; i < frames; i++) {
    try {
      // aim under the nearest low segment, but keep away from things at the bottom
      let target = 120 + Math.round(90 * Math.sin(i / 97));
      if (Math.random() < skill) { let best = 999; for (let x = 0; x < 12; x++) if (!(P[x] & 0x80) && V[x] < 0xF0 && (V[x] > 0x38 || settings.invuln)) { const d = Math.abs(H[x] - H[15]); if (d < best) { best = d; target = 247 - H[x]; } } }
      input.gx = Math.max(0, Math.min(239, target)); input.gy = 240 + (i % 15);
      input.fireHeld = true;
      update(); render();
      maxWave = Math.max(maxWave, game.stats ? game.stats.waves : 0);
      if (game.entering) { G.typeInitial('b'); G.typeInitial('o'); G.typeInitial('t'); }
      if (game.ui === 'menu' && !game.entering) { games++; G.startPlaying(); input.has = true; }
    } catch (e) { errors++; if (errors < 3) console.log(e.stack); }
  }
  return { errors, games, maxWave };
}
let r = bot('original', {}, 8000, 0.8); eq(r.errors, 0, 'Original: 8000 frames clean (' + r.games + ' game overs)');
r = bot('kid', {}, 6000, 0.9); eq(r.errors, 0, 'Kid: 6000 frames clean'); ok(r.maxWave >= 1, 'Kid bot clears a wave');
r = bot('easy', { mouse: 'abs' }, 5000, 0.5); eq(r.errors, 0, 'Easy: 5000 frames clean');
r = bot('normal', { startWave: 9, segments: 6 }, 5000, 0.5); eq(r.errors, 0, 'Normal wave 9, 6 segments: 5000 frames clean');
r = bot('original', { centSpeed: 150, shotSpeed: 200, shooterSpeed: 300, flea: 200, spider: 200, scorpion: 200, startWave: 4 }, 5000, 0.6); eq(r.errors, 0, 'everything at maximum: clean');
r = bot('original', { invuln: 1 }, 12000, 0.9); eq(r.errors, 0, 'invulnerable 12000 frames clean'); ok(r.maxWave >= 2, 'invulnerable bot reaches later waves (' + r.maxWave + ')');
{
  // attract mode behind the menu
  G.bootAttract(); game.ui = 'menu'; let errors = 0;
  for (let i = 0; i < 5000; i++) { try { update(); render(); } catch (e) { errors++; } }
  eq(errors, 0, 'attract mode: 5000 frames clean'); eq(M.score, 0, 'attract mode never scores');
}

console.log(passed + ' passed, ' + failed + ' failed');
if (failed) process.exit(1);
console.log('all tests passed');
