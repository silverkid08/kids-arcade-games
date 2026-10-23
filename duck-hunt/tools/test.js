/* Headless test suite: runs the real game code from index.html under the
   DOM/canvas stubs in harness.js, calling render() every frame.
     node tools/test.js        -> must end with "all tests passed" */
require('./harness.js');
const { build } = require('./build.js');
const G = build();
const { game, settings, input, update, render } = G;

let passed = 0, failed = 0;
function ok(cond, name) {
  if (cond) passed++; else { failed++; console.log('FAIL: ' + name); }
}
function eq(a, b, name) { ok(a === b, name + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'); }
const step = (n = 1) => { for (let i = 0; i < n; i++) { update(); render(); } };
const until = (f, max = 20000) => { for (let i = 0; i < max; i++) { if (f()) return true; update(); render(); } return f(); };
const d0 = () => game.ducks[0], d1 = () => game.ducks[1];
const flying = d => d.active && d.state === 3;
function fresh(preset, extra, keep) {
  if (!keep) localStorage._d = {};
  G.applyPreset(preset || 'original');
  settings.ducks = 1;
  if (extra) Object.assign(settings, extra);
  G.startPlaying(); G.seed(777);
}
function shootDuck(d) { input.x = d.x; input.y = d.y; input.fire = true; step(); }
function missShot() { input.x = 5; input.y = 5; input.fire = true; step(); }
function waitFlying(d, maxY = 150) { return until(() => flying(d) && d.y < maxY, 6000); }

/* ---------------- art ---------------- */
ok(G.DUCK_SPR.length === 3 && G.DUCK_SPR.every(c => c.length === 12 && c.every(s => s && s.w > 10 && s.h > 10)), 'three duck colours x 12 frames');
ok([12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].every(k => G.DOG_SPR[k] && G.DOG_SPR[k].w > 20), 'all dog frames present');
ok(G.BG32.filter(c => c).length > 20000, 'background has real pixels');
ok(G.LOGO.px.some(v => v >= 0), 'title logo present');
ok('ROUNDFLYAWPEGMVOS0123456789'.split('').every(c => G.FONT[c]), 'font covers message text');
let colours = new Set(); G.DUCK_SPR[0][0].px.forEach(v => colours.add(v)); ok(colours.size >= 4, 'duck sprite is multicolour art, not a block');

/* ---------------- coordinate mapping ---------------- */
{
  const cv = __elements.screen;
  cv.getBoundingClientRect = () => ({ left: 100, top: 50, width: 768, height: 720 });   // 3x integer scale
  let p = G.toGame(100, 50); eq(p.x + ',' + p.y, '0,0', 'top-left maps to 0,0');
  p = G.toGame(100 + 3 * 128 + 1, 50 + 3 * 120 + 2); eq(p.x + ',' + p.y, '128,120', 'centre maps through 3x scale');
  p = G.toGame(100 + 767, 50 + 719); eq(p.x + ',' + p.y, '255,239', 'bottom-right pixel');
  p = G.toGame(5000, -300); eq(p.x + ',' + p.y, '255,0', 'clamped to the screen');
  cv.getBoundingClientRect = () => ({ left: 0, top: 0, width: 512, height: 480 });     // 2x
  p = G.toGame(301, 99); eq(p.x + ',' + p.y, '150,49', '2x scale mapping');
  G.aimAt(301, 99); eq(input.x + ',' + input.y, '150,49', 'aimAt sets the crosshair');
  // mousemove + mousedown listeners on the canvas
  cv.listeners.mousemove[0]({ clientX: 20, clientY: 40 }); eq(input.x + ',' + input.y, '10,20', 'mousemove handler maps');
  cv.listeners.mousedown[0]({ button: 0, clientX: 40, clientY: 40, preventDefault() {} }); ok(input.fire, 'left click queues a shot');
  input.fire = false;
  cv.listeners.mousedown[0]({ button: 2, clientX: 40, clientY: 40, preventDefault() {} }); ok(!input.fire, 'right click does not fire');
  cv.listeners.touchstart[0]({ changedTouches: [{ clientX: 200, clientY: 100 }], preventDefault() {} });
  ok(input.fire && input.x === 100 && input.y === 50, 'tap aims and fires');
  input.fire = false;
  cv.getBoundingClientRect = () => ({ left: 0, top: 0, width: 256, height: 240 });
}

/* ---------------- ROM tables ---------------- */
eq(G.QUOTA_TABLE.join(','), '6,6,6,6,6,6,6,6,6,6,7,7,8,8,9,9,9,9,9,10', 'quota table');
G.applyPreset('original');
eq([0, 9, 10, 11, 12, 13, 14, 18, 19, 25, 60].map(i => G.quotaFor(i)).join(','), '6,6,7,7,8,8,9,9,10,10,10', 'quota per round index');
eq([1, 5, 6, 10, 11, 30].map(r => G.duckScore(r, 0)).join(','), '500,500,800,800,1000,1000', 'black duck score by round');
eq([1, 6, 11].map(r => G.duckScore(r, 1)).join(','), '1000,1600,2000', 'blue duck score');
eq([1, 6, 11].map(r => G.duckScore(r, 2)).join(','), '1500,2400,3000', 'red duck score');
eq([1, 10, 11, 15, 16, 20, 21].map(G.perfectBonus).join(','), '10000,10000,15000,15000,20000,20000,30000', 'perfect bonus');
eq([1, 10, 11, 19, 20, 50].map(G.flyTimerFor).join(','), '125,125,93,93,62,62', 'fly-away timer');
eq([1, 2, 4, 6, 8, 10, 11, 12, 40].map(r => G.speedFor(r, 0)).join(','), '16,20,24,28,32,36,36,40,40', 'Game A speed table');
eq([1, 23, 24, 27].map(G.shapeFor).join(','), '9,9,10,11', 'hit box shrinks at rounds 24 / 27');
// steps per frame: speed 0x10 -> 2,2,2,2 ; 0x14 -> 3,2,3,2
{
  const d = G.newDuck(0); d.state = 3; d.speedIdx = 0x14; d.dir = 4; d.x = 50; d.y = 80; d.rising = 0; d.escaping = 0;
  const xs = []; for (let i = 0; i < 4; i++) { const x0 = d.x; G.move(d); xs.push(d.x - x0); }
  eq(xs.join(','), '3,2,3,2', 'speed $14 moves 2.5 px/frame to the right');
}

/* ---------------- Original: intro, flight, shots ---------------- */
fresh('original');
eq(game.round, 1, 'round 1');
eq(game.msg, 0, 'message set by the dog on its first frame');
step(2); eq(game.msg, 1, 'ROUND box during intro');
ok(until(() => game.dog.state === 9, 2000), 'dog walks, sniffs and jumps');
ok(until(() => flying(d0()), 2000), 'first duck takes off after the jump');
eq(game.shots, 3, '3 shots per duck');
eq(game.targets, 1, 'one target released');
ok(d0().y >= 0xA0, 'duck starts in the grass');
missShot(); eq(game.shots, 2, 'a miss uses a shot');
missShot(); missShot(); eq(game.shots, 0, 'three shots used');
ok(!G.fire(10, 10), 'cannot fire with no shots');
ok(until(() => game.msg === 6, 200), 'FLY AWAY right after the last shot');
ok(game.pink, 'sky turns pink');
ok(until(() => d0().state === 0, 600), 'duck flies off');
ok(until(() => game.dog.state === 11, 300), 'dog laughs at a miss');
ok(!game.pink, 'sky back to blue when the dog laughs');

// timeout fly-away: count frames from the end of take-off
fresh('original');
until(() => flying(d0()) && !d0().rising, 4000);
let t0 = game.frame;
ok(until(() => game.msg === 6, 600), 'FLY AWAY on timeout');
let dt = game.frame - t0; ok(dt >= 245 && dt <= 255, 'round 1 timeout is 250 frames (got ' + dt + ')');

// hit and scoring
fresh('original');
waitFlying(d0(), 140);
const col = d0().colour;
shootDuck(d0());
eq(game.hits, 1, 'hit registered');
eq(game.score, G.duckScore(1, col), 'score for the duck colour');
eq(game.hitTable[0], 1, 'hit icon set');
ok(d0().state === 5, 'duck shows the shot pose');
ok(until(() => d0().state === 7, 40), 'then falls');
ok(game.pops.length === 1, 'score pop-up shown');
ok(until(() => game.dog.state === 13, 400), 'dog shows the duck');
ok(G.Sound.log.includes('quack') && G.Sound.log.includes('shot') && G.Sound.log.includes('fall') && G.Sound.log.includes('thud'), 'sound effects triggered');

// hit only within the hit box
fresh('original');
waitFlying(d0(), 120);
{ const d = d0(); const r = G.hitRect(d); ok(r.x1 - r.x0 === 32, 'standard hit box is 32 px wide');
  ok(!G.hitTest(d, d.x + 17, d.y), 'outside the box misses'); ok(G.hitTest(d, d.x + 15, d.y), 'inside the box hits'); }

// a whole round: perfect, then round 2
fresh('original');
for (let i = 0; i < 60 * 300 && game.mode === 'duck'; i++) {
  if (flying(d0()) && d0().y < 140) { input.x = d0().x; input.y = d0().y; input.fire = true; }
  step();
}
eq(game.targets, 10, '10 ducks per round');
eq(game.hits, 10, 'all 10 hit');
ok(until(() => game.msg === 5, 2000), 'PERFECT!! shown');
eq(game.msgArg, 10000, 'perfect bonus 10000 in round 1');
ok(until(() => game.round === 2 && game.mode === 'duck', 2000), 'next round starts');
eq(game.hits, 0, 'hit count reset');
ok(G.Sound.log.includes('roundClear') && G.Sound.log.includes('perfect'), 'round clear + perfect tunes');

// game over when the quota is missed
fresh('original');
ok(until(() => game.mode !== 'duck', 60 * 400), 'round ends with no hits');
ok(until(() => game.msg === 8, 600), 'GAME OVER message');
ok(until(() => game.mode === 'menu', 2000), 'back to the menu after the game over laugh');
ok(game.lastSummary && game.lastSummary.shots === 0, 'session summary recorded');

// quota pass with exactly 6
fresh('original');
{
  let hit = 0;
  for (let i = 0; i < 60 * 300 && game.mode === 'duck'; i++) {
    if (hit < 6 && flying(d0()) && d0().y < 140 && game.shotDucks === 0) { input.x = d0().x; input.y = d0().y; input.fire = true; step(); if (game.shotDucks) hit++; continue; }
    step();
  }
  eq(game.hits, 6, 'six ducks hit');
  ok(until(() => game.round === 2, 3000), '6 of 10 meets the round-1 quota');
}

// hit table shuffle: hits slide left
fresh('original');
game.hitTable = [0, 1, 0, 1, 1, 0, 0, 1, 0, 1]; game.hits = 5; game.quota = 6;
G.startRoundEnd();
until(() => game.mode !== 'roundend', 1000);
eq(game.hitTable.join(''), '1111100000', 'hit icons slide together');
ok(G.Sound.log.includes('hitShuffle'), 'shuffle sound');

/* ---------------- Game B ---------------- */
fresh('original', { ducks: 2 });
ok(until(() => game.pending === 0 && flying(d0()) && flying(d1()), 4000), 'Game B releases two ducks');
eq(game.targets, 2, 'two targets per release');
eq(game.shots, 3, 'three shots for the pair');
ok(G.presetName() === 'original', 'Game B still counts as the Original preset');
ok(until(() => game.mode !== 'duck', 60 * 400), 'Game B round ends');
eq(game.targets, 10, 'Game B: 5 pairs = 10 ducks');

/* ---------------- knobs ---------------- */
function travel(speed) {
  fresh('original', { speed });
  until(() => flying(d0()) && !d0().rising, 4000);
  const d = d0(); d.dir = 4; d.x = 40; d.y = 80; d.pi = 0; d.flyTimer = 200;
  game.ducks[0].speedIdx = 0x10;
  let dist = 0; for (let i = 0; i < 40; i++) { const x = d.x; G.move(d); dist += d.x - x; }
  return dist;
}
{ const a = travel(100), b = travel(50); eq(a, 80, 'speed 100% = 2 px/frame at round 1'); ok(Math.abs(b - 40) <= 1, 'speed 50% halves it (' + b + ')'); }
fresh('original', { size: 2 });
waitFlying(d0(), 110);
{ const r = G.hitRect(d0()); eq(r.x1 - r.x0, 64, 'size 2x doubles the hit box'); }
fresh('original', { pad: 8 });
waitFlying(d0(), 110);
{ const r = G.hitRect(d0()); eq(r.x1 - r.x0, 48, 'hit forgiveness adds 8 px each side'); }
fresh('original', { shots: 5 });
until(() => flying(d0()), 3000); eq(game.shots, 5, 'shots knob = 5');
fresh('original', { shots: 0 });
until(() => flying(d0()), 3000); for (let i = 0; i < 8; i++) missShot(); eq(game.shots, 3, 'unlimited shots never run out'); ok(game.msg !== 6, 'no fly-away from running out');
fresh('original', { fly: 2 });
until(() => flying(d0()) && !d0().rising, 4000); t0 = game.frame; until(() => game.msg === 6, 1200);
dt = game.frame - t0; ok(dt >= 495 && dt <= 505, 'fly-away x2 = 500 frames (got ' + dt + ')');
fresh('original', { fly: 0 });
until(() => flying(d0()), 3000); step(60 * 30); ok(flying(d0()) && game.msg !== 6, 'fly-away NEVER keeps the duck up');
fresh('original', { perRound: 4 });
ok(until(() => game.mode !== 'duck', 60 * 200), 'short round ends'); eq(game.targets, 4, 'ducks per round = 4');
fresh('original', { quota: 3 }); eq(game.quota, 3, 'fixed quota');
fresh('original', { quota: 0 }); eq(game.quota, 0, 'quota off');
ok(until(() => game.mode !== 'duck', 60 * 400), 'quota-off round ends'); ok(until(() => game.round === 2, 3000), 'quota off never fails');
fresh('original', { startRound: 12 }); eq(game.round, 12, 'starting round'); eq(game.quota, 7, 'quota for round 12');
until(() => flying(d0()), 3000); eq(d0().speedIdx & ~3, 0x28, 'round 12 speed');
fresh('original', { laugh: 0 });
until(() => flying(d0()), 3000); for (let i = 0; i < 3; i++) missShot();
{ let laughed = false; for (let i = 0; i < 900; i++) { step(); if (game.dog.state === 11) laughed = true; } ok(!laughed, 'dog laugh off'); ok(game.targets >= 2, 'game goes on without the laugh'); }
fresh('original', { flash: 1 });
until(() => flying(d0()), 3000); missShot(); step(0); ok(true, 'flash frame rendered');
{ fresh('original', { flash: 1 }); until(() => flying(d0()), 3000); input.x = 5; input.y = 5; input.fire = true; update();
  ok(game.flash.length === 1, 'zapper flash on'); render(); eq(G.fb[5 * 256 + 100], G.C.black, 'flash frame is black'); }
{ fresh('original', { flash: 0 }); until(() => flying(d0()), 3000); input.fire = true; update(); ok(game.flash.length === 0, 'zapper flash off'); }
// crosshair size / colour
{
  fresh('original', { xcolor: 1, xsize: 3 }); input.x = 128; input.y = 60; step();
  eq(G.fb[60 * 256 + 128 + 13], 0xFF0028D8, 'red crosshair ring drawn at radius 13');
  fresh('original', { xcolor: 2, xsize: 0 }); input.x = 128; input.y = 60; step();
  eq(G.fb[60 * 256 + 128 + 4], 0xFF00F0FC, 'small yellow crosshair at radius 4');
}
// magnet
{
  fresh('original', { magnet: 0 }); waitFlying(d0(), 120);
  input.x = d0().x + 20; input.y = d0().y; G.aimPoint(); eq(input.ax, input.x, 'no magnet: aim = mouse');
  settings.magnet = 4; G.aimPoint(); ok(input.ax < input.x && input.ax > d0().x, 'magnet pulls the aim toward the duck');
}
// hover-and-hold
{
  fresh('original', { fire: 'hover', dwell: 0.5 });
  waitFlying(d0(), 140);
  const before = game.stats.shots;
  let frames = 0;
  while (flying(d0()) && frames < 60) { input.x = d0().x; input.y = d0().y; step(); frames++; }
  ok(d0().state >= 4 || d0().wasHit, 'hover-and-hold shoots the duck');
  ok(frames >= 29 && frames <= 32, 'after the dwell time (' + frames + ' frames)');
  eq(game.stats.shots, before + 1, 'counts as one shot');
  fresh('original', { fire: 'hover', dwell: 0.5 }); waitFlying(d0(), 140);
  for (let i = 0; i < 40 && flying(d0()); i++) { input.x = (d0().x + 120) & 255; input.y = 20; step(); }
  eq(game.stats.shots, 0, 'hovering on empty sky does not fire');
}
// no-fail mode
{
  fresh('original', { noFail: 1 });
  ok(until(() => game.mode !== 'duck', 60 * 400), 'no-fail round ends');
  ok(until(() => game.msg === 9, 1500), 'TRY AGAIN instead of GAME OVER');
  ok(until(() => game.mode === 'duck' && game.dog.state > 1, 600), 'round replays');
  eq(game.round, 1, 'same round');
  ok(game.msg !== 8, 'never GAME OVER');
  render(); ok(G.fb.slice(2 * 256, 2 * 256 + 60).some(c => c === G.C.orange), 'NO-FAIL badge drawn');
}

/* ---------------- presets, settings, high scores ---------------- */
localStorage._d = {};
G.applyPreset('kid'); eq(G.presetName(), 'kid', 'kid preset');
ok(settings.shots === 0 && settings.fly === 0 && settings.quota === 0 && settings.laugh === 0 && settings.size === 2 && settings.speed <= 50 && settings.pad >= 8, 'kid preset is gentle');
G.stepKnob('speed', 1); eq(G.presetName(), 'custom', 'touching a knob -> Custom');
eq(G.PRESETS.original.speed, 100, 'Original preset unchanged by knobs');
G.applyPreset('easy'); settings.ducks = 2; G.saveSettings();
const saved = localStorage._d['duckhunt.settings'];
G.applyPreset('original'); settings.ducks = 1;
localStorage._d['duckhunt.settings'] = saved; G.loadSettings();
eq(G.presetName(), 'easy', 'settings round-trip (preset)'); eq(settings.ducks, 2, 'settings round-trip (ducks)');
localStorage._d['duckhunt.settings'] = '{broken'; G.loadSettings(); ok(true, 'corrupt settings ignored');
ok(G.highKey('original', 0, 'A') !== G.highKey('original', 1, 'A'), 'no-fail high score key is separate');
eq(G.highKey('kid', 1, 'B'), 'high.kid.B.nofail', 'high key format');
{
  const real = global.localStorage;
  global.localStorage = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); }, removeItem() { throw new Error('denied'); } };
  let threw = false; try { G.saveSettings(); G.loadSettings(); G.getHigh('x'); } catch (e) { threw = true; }
  ok(!threw, 'no localStorage does not throw');
  global.localStorage = real;
}

/* ---------------- stats & history ---------------- */
{
  const s = G.summarise({ shots: 8, hits: 6, reactSum: 7.5, reactN: 6, streak: 2, best: 4 });
  eq(s.acc, 75, 'accuracy = hits / shots'); eq(s.react, 1.25, 'average reaction time'); eq(s.best, 4, 'best streak');
  eq(G.summarise({ shots: 0, hits: 0, reactSum: 0, reactN: 0, best: 0 }).acc, 0, 'no shots -> 0%');
  localStorage._d = {};
  fresh('original');
  waitFlying(d0(), 140); shootDuck(d0()); missShot();
  until(() => flying(d0()) && d0().y < 140, 3000); shootDuck(d0());
  eq(game.stats.shots, 3, 'shots counted'); eq(game.stats.hits, 2, 'hits counted'); eq(game.stats.best, 1, 'streak broken by a miss');
  ok(game.stats.reactN === 2 && game.stats.reactSum > 0, 'reaction times recorded');
  G.quitToMenu();
  const hist = JSON.parse(localStorage._d['duckhunt.history']);
  eq(hist.length, 1, 'session saved to history'); eq(hist[0].acc, 67, 'history accuracy');
  const ps = JSON.parse(localStorage._d['duckhunt.stats.original']); eq(ps.sessions, 1, 'per-preset stats saved');
  for (let i = 0; i < 12; i++) { fresh('original', null, true); waitFlying(d0(), 140); if (i === 0) shootDuck(d0()); else missShot(); G.quitToMenu(); }
  eq(JSON.parse(localStorage._d['duckhunt.history']).length, 10, 'history keeps the last 10');
  ok(G.historyHTML().includes('ACCURACY'), 'history view renders');
  ok(parseInt(localStorage._d['duckhunt.high.original.A'] || '0', 10) > 0, 'high score saved per preset/game');
}

/* ---------------- pause / menu ---------------- */
fresh('original');
step(30); G.togglePause(); ok(game.paused, 'P pauses'); const fr = game.frame; step(30); eq(game.frame, fr, 'paused game does not advance');
G.togglePause(); step(50); ok(!game.paused, 'unpauses after the 48-frame delay');
G.openMenu(); ok(game.paused, 'Esc opens the menu and pauses'); G.resume(); ok(!game.paused, 'resume');

/* ---------------- long runs with render() every frame ---------------- */
function bot(preset, extra, frames, accuracy) {
  fresh(preset, extra);
  let errors = 0;
  for (let i = 0; i < frames; i++) {
    try {
      const t = [d0(), d1()].find(d => flying(d));
      if (t && (i % 23) === 0) { input.x = t.x + (Math.random() < accuracy ? 0 : 40); input.y = t.y; input.fire = true; }
      else { input.x = (input.x + 3) & 255; input.y = 30 + (i % 150); }
      update(); render();
      if (game.mode === 'menu') { G.startPlaying(); }
    } catch (e) { errors++; if (errors < 3) console.log(e.stack); }
  }
  return errors;
}
eq(bot('original', {}, 6000, 0.7), 0, 'Original Game A: 6000 frames clean');
eq(bot('original', { ducks: 2 }, 6000, 0.7), 0, 'Original Game B: 6000 frames clean');
eq(bot('kid', {}, 4000, 0.9), 0, 'Kid: 4000 frames clean');
eq(bot('easy', { fire: 'hover', ducks: 2 }, 4000, 0.5), 0, 'Easy hover Game B: 4000 frames clean');
eq(bot('normal', { startRound: 25, size: 1.5 }, 4000, 0.3), 0, 'Normal round 25: 4000 frames clean');
eq(bot('original', {}, 9000, 0), 0, 'miss everything through game over: clean');

console.log(passed + ' passed, ' + failed + ' failed');
if (failed) process.exit(1);
console.log('all tests passed');
