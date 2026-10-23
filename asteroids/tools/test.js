/* Headless tests for the Asteroids clone.  Runs the real game from
   index.html under the DOM stub, including render() every frame. */
require('./harness.js');
const fs = require('fs');
const path = require('path');

const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
let src = HTML.slice(HTML.indexOf('<script>') + 8, HTML.lastIndexOf('</script>'));
const EXPORT = `
globalThis.__A = { game, update, render, settings, KNOBS, PRESETS, PRESET_ORDER, SHAPES, THRUST_TBL,
  velX, velY, seedRng, rnd, newGame, demoField, applyPreset, setKnob, setInvuln, loadSettings, saveSettings,
  highs, recordHigh, currentHigh, hits, shipPattern, decel, startWave, breakAsteroid, enterHyperspace,
  spawnSaucer, saucerAimDir, saucerShoot, makeShot, scoreString, togglePause, toMenu, dvgScale,
  FW, FH, VIEW_W, VIEW_H, getOverlayMode: () => overlayMode };
})();`;
if (!src.trimEnd().endsWith('})();')) throw new Error('unexpected file tail');
src = src.trimEnd().slice(0, -'})();'.length) + EXPORT;
fs.writeFileSync(path.join(__dirname, '.game.build.js'), src);

/* file:// sanity: nothing may be fetched at runtime */
const head = HTML.slice(0, HTML.indexOf('<script>'));
if (/<script[^>]+src=|<link[^>]+href=|fetch\(|XMLHttpRequest|import\s/.test(head + src.replace(/\/\*[\s\S]*?\*\//g, ''))) {
  console.log('  FAIL index.html must not reference external resources'); process.exit(1);
}

let failures = 0;
function check(name, cond, extra) {
  if (cond) console.log('  ok   ' + name);
  else { failures++; console.log('  FAIL ' + name + (extra !== undefined ? '  -> ' + extra : '')); }
}
function section(s) { console.log('\n[' + s + ']'); }

require(path.join(__dirname, '.game.build.js'));
const A = globalThis.__A;
const game = A.game;
const ctx = globalThis.__elements.screen.getContext();
const el = globalThis.__elements;

function run(n, input) {
  for (let i = 0; i < n; i++) {
    if (input) input(i);
    A.update(); A.render();
  }
}
function startGame(preset) {
  A.applyPreset(preset || 'original');
  el.play.click();
}
function clearInput() { for (const k in game.input) game.input[k] = false; }
function press(flag, frames) { game.input[flag] = true; run(frames || 1); game.input[flag] = false; }
/* skip the PLAYER 1 banner and wait for the ship to materialise */
function waitForShip() { let n = 0; while (game.ship.status !== 1 && n++ < 1000) run(1); }
function clearRocks() { game.asteroids = []; game.curAsteroids = 0; game.thumpSpeedTmr = 0x7fffff; }

/* ---------- 1. the arcade's vector data ---------- */
section('vector shapes');
const SH = A.SHAPES;
function sumDrawn(segs) { let x = 0, y = 0; for (const s of segs) if (s[2] > 0) { x += s[0]; y += s[1]; } return [x, y]; }
for (let i = 1; i <= 4; i++) {
  const [x, y] = sumDrawn(SH['Rock' + i].segs);
  check('Rock' + i + ' outline closes', x === 0 && y === 0, x + ',' + y);
}
check('four rock outlines, 11-13 segments each', [1, 2, 3, 4].every(i => SH['Rock' + i].segs.length >= 11 && SH['Rock' + i].segs.length <= 13));
let shipsOk = true, thrustOk = true;
for (let d = 0; d <= 64; d += 4) {
  if (!SH['ShipDir' + d] || SH['ShipDir' + d].segs.length !== 6) shipsOk = false;
  if (!SH['ThrustDir' + d] || SH['ThrustDir' + d].segs.length !== 2) thrustOk = false;
}
check('17 pre-rotated ships of 6 segments (ROM $5290..)', shipsOk);
check('17 thrust flames of 2 segments', thrustOk);
/* ShipDir0: blank to (-24,-16), then crossbar up, tail, nose, tail, crossbar */
const s0 = SH.ShipDir0.segs;
check('ShipDir0 nose is 56 units ahead (14 px), tail corners at (-40, +-32)', s0[0][0] === -24 && s0[3][0] === 96 && s0[3][1] === -32 && s0[4][0] === -96);
check('ShipDir0 outline closes', sumDrawn(s0).join() === '0,0');
check('ShipDir64 points straight up', SH.ShipDir64.segs[3][1] === 96 && SH.ShipDir64.segs[3][0] === 32);
const sauc = SH.Saucer.segs;
let minx = 0, maxx = 0, px = 0;
for (const s of sauc) { px += s[0]; minx = Math.min(minx, px); maxx = Math.max(maxx, px); }
check('saucer outline is 80 units wide', maxx - minx === 80, maxx - minx);
check('ship explosion: 6 fragments with 6 velocities', SH.ShipExplosion.segs.length === 6 && SH.ShipExplosionVel.segs.length === 6);
check('four shrapnel patterns of 10 dots', [1, 2, 3, 4].every(i => SH['Shrapnel' + i].segs.filter(s => s[2] > 0 && s[0] === 0 && s[1] === 0).length === 10));
const font = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789 '.split('');
check('vector font has A-Z, 1-9 and space (0 shares O)', font.every(c => SH['char_' + c]));
check('every glyph advances 12 units', font.every(c => sumDrawnAll(SH['char_' + c].segs)[0] === 12), font.filter(c => sumDrawnAll(SH['char_' + c].segs)[0] !== 12).join(''));
function sumDrawnAll(segs) { let x = 0, y = 0; for (const s of segs) { x += s[0]; y += s[1]; } return [x, y]; }
check('DVG scale nibble: 0 = x1, 1 = x2, 15 = x1/2, 14 = x1/4, 11 = x1/32', A.dvgScale(0) === 1 && A.dvgScale(1) === 2 && A.dvgScale(15) === 0.5 && A.dvgScale(14) === 0.25 && A.dvgScale(11) === 1 / 32);
check('ship pattern folding: 0 -> idx0, 64 -> idx16, 128 -> idx0 mirrored, 192 -> idx16 flipped',
  A.shipPattern(0).idx === 0 && A.shipPattern(64).idx === 16 && A.shipPattern(128).idx === 0 && A.shipPattern(128).fx === -1 &&
  A.shipPattern(192).idx === 16 && A.shipPattern(192).fy === -1 && A.shipPattern(5).idx === 1);

/* ---------- 2. tables ---------- */
section('tables');
check('thrust table has 65 entries, 0 .. 127', A.THRUST_TBL.length === 65 && A.THRUST_TBL[0] === 0 && A.THRUST_TBL[64] === 127);
check('thrust table is monotonic', A.THRUST_TBL.every((v, i, t) => i === 0 || v >= t[i - 1]));
check('velocity components: dir 0 = right, 64 = up, 128 = left, 192 = down',
  A.velX(0) === 127 && A.velY(0) === 0 && A.velY(64) === 127 && A.velX(64) === 0 && A.velX(128) === -127 && A.velY(192) === -127);
check('velocity components are symmetric', A.velY(65) === A.velY(63) && A.velY(200) === -A.velY(56));
A.seedRng(1, 0);
let zero = 0, seen = new Set();
for (let i = 0; i < 5000; i++) { const r = A.rnd(); if (r === 0) zero++; seen.add(r); }
check('ROM random generator covers the whole byte range', seen.size === 256, seen.size);
check('score string: "00", 120 -> "120", wraps at 99,990', A.scoreString(0) === '00' && A.scoreString(120) === '120' && A.scoreString(99990) === '99990' && A.scoreString(100010) === '10');

/* ---------- 3. boot ---------- */
section('boot');
check('booted into the menu with the attract field', game.state === 'menu' && game.asteroids.length === 6);
check('raf registered', typeof globalThis.__raf === 'function');
ctx.resetRecording(); A.render();
check('render() draws vector strokes', ctx.lines.length > 200 && ctx.strokes > 0, ctx.lines.length);
check('canvas is 4:3 (MAME visible area 1044x788)', A.VIEW_W === 1044 && A.VIEW_H === 788);
check('presets built: KID EASY NORMAL ORIGINAL', el.presets.children.length === 4);
check('eight knobs built', el.knobs.children.length === 8 && A.KNOBS.length === 8);

/* ---------- 4. original rules ---------- */
section('original preset = the arcade');
A.seedRng(0x77, 0x11);
startGame('original');
check('3 ships (DIP default)', game.lives === 3);
check('PLAYER 1 banner for 128 frames, ship not yet in play', game.playerDispTimer === 0x80 && game.ship.status === 0);
run(127);
check('first wave of 4 large rocks appears after the thump timer (127 frames)', game.asteroids.length === 4 && game.asteroids.every(a => a.size === 4), game.asteroids.length);
check('rocks start on the screen edges', game.asteroids.every(a => a.x === 0 || a.y === 0));
check('rock speeds within 6..31 (1/8 px per frame) per axis', game.asteroids.every(a => Math.abs(a.rvx) >= 6 && Math.abs(a.rvx) <= 31 && Math.abs(a.rvy) >= 6 && Math.abs(a.rvy) <= 31));
waitForShip();
check('ship appears at screen centre', game.ship.status === 1 && game.ship.x === 0x1060 && game.ship.y === 0x0C60);
clearRocks();   // keep the ship safe for the control tests
const d0 = game.ship.dir;
press('left', 1);
check('rotate left = +3 direction units per frame (256 per turn)', game.ship.dir === (d0 + 3) & 255);
press('right', 86);
check('a full turn takes 86 frames (1.43 s)', game.ship.dir === ((d0 + 3 - 258) & 255));
game.ship.dir = 64; game.ship.vx = 0; game.ship.vy = 0;
const f0 = game.frame;
press('thrust', 2);
check('thrust adds 2 x 127 (8.8 fixed) to velocity every other frame', game.ship.vy === 254 && game.ship.vx === 0, game.ship.vy);
game.ship.dir = 64; game.ship.vx = 0; game.ship.vy = 0;
press('thrust', 300);
check('max speed: integer part 63 (7.9 px per frame)', Math.floor(game.ship.vy / 256) === 63, game.ship.vy);
let v = 63 * 256 + 255, frames = 0;
while (v > 0 && frames < 100000) { v = A.decel(v); frames += 2; }
check('arcade friction: coasting from max speed to a stop takes ' + (frames / 60).toFixed(1) + ' s (> 15 s)', frames > 900, frames);
v = -64 * 256 + 1; frames = 0;
while (v !== 0 && frames < 100000) { v = A.decel(v); frames += 2; }
check('friction also stops a negative velocity', v === 0 && frames > 900, v);

game.ship.vx = 0; game.ship.vy = 0; game.ship.dir = 64; game.shipShots = [];
press('fire', 1);
check('fire makes one shot with an 18-tick life', game.shipShots.length === 1 && game.shipShots[0].life === 18);
check('shot speed = half the direction vector (63) + ship speed, straight up', game.shipShots[0].vy === 63 && game.shipShots[0].vx === 0);
/* spawned 94 units (3/4 of 127) ahead, then moved 63 in the same frame, as in the ROM */
check('shot spawns 3/4 of a direction vector ahead of the ship (11.9 px) and moves the same frame', game.shipShots[0].y - game.ship.y === 94 + 63, game.shipShots[0].y - game.ship.y);
press('fire', 40);
check('holding fire does not autofire', game.shipShots.length === 1);
for (let i = 0; i < 6; i++) { press('fire', 1); run(1); }
check('at most 4 shots on screen', game.shipShots.length === 4);
let life = 0; while (game.shipShots.length && life < 200) { run(1); life++; }
check('shots live 69-72 frames (18 ticks x 4 frames)', life >= 60 && life <= 72, life);

game.ship.vx = 0; game.ship.vy = 0; game.ship.dir = 0;
press('thrust', 20);
check('thrust along dir 0 is pure +x', game.ship.vx > 0 && game.ship.vy === 0);
game.ship.vx = 0; game.ship.vy = 0;

/* waves */
clearRocks(); game.thumpSpeedTmr = 0;
const waveSizes = [];
for (let w = 0; w < 6; w++) { game.saucer = null; A.startWave(); waveSizes.push(game.asteroids.length); clearRocks(); }
check('waves grow 6, 8, 10, 11, 11 after the first 4 (cap 11)', waveSizes.join() === '6,8,10,11,11,11', waveSizes.join());

/* splitting, scoring, the 27 limit */
clearRocks(); game.score = 0;
const big = { size: 4, type: 0, status: 1, x: 1000, y: 1000, rvx: 6, rvy: 6 };
game.asteroids.push(big); game.curAsteroids = 1;
A.breakAsteroid(big, true);
check('large rock: 20 points, splits into 2 medium, parent explodes in place', game.score === 20 && game.asteroids.length === 3 && game.asteroids.filter(a => a.size === 2 && a.status === 1).length === 2 && big.status === 0xA0,
  game.score + ' ' + JSON.stringify(game.asteroids.map(a => [a.size, a.status])));
const med = game.asteroids.find(a => a.size === 2 && a.status === 1);
A.breakAsteroid(med, true);
check('medium rock: 50 points, 2 small', game.score === 70 && game.asteroids.filter(a => a.size === 1 && a.status === 1).length === 2,
  game.score + ' ' + JSON.stringify(game.asteroids.map(a => [a.size, a.status])));
const sm = game.asteroids.find(a => a.size === 1 && a.status === 1);
A.breakAsteroid(sm, true);
check('small rock: 100 points, no children', game.score === 170 && game.asteroids.filter(a => a.size === 1 && a.status === 1).length === 1);
check('children inherit the parent velocity +-16 within 6..31', game.asteroids.filter(a => a.status === 1).every(a => Math.abs(a.rvx) >= 6 && Math.abs(a.rvx) <= 31));
ctx.resetRecording(); A.render();
check('exploding rocks render as shrapnel dots', ctx.dots.length >= 10, ctx.dots.length);
let expl = 0; while (big.status & 0x80) { run(1); expl++; }
check('rock explosion lasts 96 frames', expl === 96, expl);
clearRocks();
for (let i = 0; i < 20; i++) game.asteroids.push({ size: 4, type: 0, status: 1, x: 100 + i * 300, y: 3000, rvx: 6, rvy: 6 });
game.curAsteroids = 20;
for (const a of game.asteroids.slice()) if (a.size === 4) A.breakAsteroid(a, false);
check('never more than 27 rocks on screen', game.asteroids.length === 27, game.asteroids.length);
clearRocks();

/* saucer */
game.score = 0; game.saucer = null; game.scrReload = 0x92; game.astBreakTimer = 0;
game.scrTimer = 1; run(8);
check('saucer spawns on a screen edge at +-16 (2 px per frame)', !!game.saucer && (game.saucer.x < 200 || game.saucer.x > A.FW - 200) && Math.abs(game.saucer.vx) === 16, game.saucer && game.saucer.x);
check('first saucers are large while the timer reload is >= 128', game.saucer.size === 2);
check('each saucer spawn shortens the reload by 6 ticks (146 -> 140)', game.scrReload === 0x8c);
const sau = game.saucer;
game.shipShots = [{ x: sau.x, y: sau.y, vx: 0, vy: 0, life: 18 }];
run(1);
check('large saucer = 200 points and explodes', game.score === 200 && sau.status === 0xA0);
while (game.saucer) run(1);
game.scrReload = 0x40; game.score = 30000; game.scrTimer = 1; game.astBreakTimer = 0; run(8);
check('above 30,000 points every saucer is the small one', !!game.saucer && game.saucer.size === 1);
game.shipShots = [{ x: game.saucer.x, y: game.saucer.y, vx: 0, vy: 0, life: 18 }];
run(1);
check('small saucer = 1000 points', game.score === 31000);
while (game.saucer) run(1);
// aim test
game.score = 0; game.ship.x = 4000; game.ship.y = 3000;
game.saucer = { x: 1000, y: 3000, vx: 16, vy: 0, size: 1, status: 1 };
let maxErr = 0;
for (let i = 0; i < 60; i++) { const d = A.saucerAimDir(); let e = (d - 0) & 255; if (e > 128) e = 256 - e; maxErr = Math.max(maxErr, e); }
check('small saucer aims at the ship within +-16 units (22 deg) below 35,000', maxErr <= 16 && maxErr > 0, maxErr);
game.score = 40000; maxErr = 0;
for (let i = 0; i < 60; i++) { const d = A.saucerAimDir(); let e = d & 255; if (e > 128) e = 256 - e; maxErr = Math.max(maxErr, e); }
check('above 35,000 the jitter shrinks to +-8', maxErr <= 8, maxErr);
game.saucer.x = 7800; game.ship.x = 500; // ship far to the left (> half a screen) -> aim right, through the wrap
const dWrap = A.saucerAimDir(); let eWrap = dWrap & 255; if (eWrap > 128) eWrap = 256 - eWrap;
check('a far-away ship is aimed at through the screen wrap', eWrap <= 8, dWrap);
game.saucer = null; game.score = 0;

/* extra life, wraparound */
game.lives = 3; game.score = 9980;
game.asteroids.push({ size: 4, type: 0, status: 1, x: 5000, y: 5000, rvx: 6, rvy: 6 }); game.curAsteroids = 1;
A.breakAsteroid(game.asteroids[game.asteroids.length - 1], true);
check('extra ship at 10,000', game.lives === 4 && game.score === 10000);
clearRocks();
game.score = 99990;
game.asteroids.push({ size: 4, type: 0, status: 1, x: 5000, y: 5000, rvx: 6, rvy: 6 }); game.curAsteroids = 1;
A.breakAsteroid(game.asteroids[game.asteroids.length - 1], true);
check('score wraps at 99,990 (+20 -> 10)', game.score === 10);
clearRocks(); game.lives = 3;

/* hit boxes */
check('hit box: large rock 132 (33 px square) with the 1.5x diamond cut', A.hits(0, 0, 0, 0, 132) && A.hits(0, 0, 262, 0, 132) && !A.hits(0, 0, 266, 0, 132) && A.hits(0, 0, 196, 196, 132) && !A.hits(0, 0, 200, 200, 132));
check('no collisions across the screen wrap (raw subtraction)', !A.hits(10, 100, A.FW - 10, 100, 132));

/* hyperspace */
clearRocks(); game.curAsteroids = 4;
game.asteroids.push({ size: 4, type: 0, status: 1, x: 100, y: 100, rvx: 0, rvy: 0 });
let fails = 0, trials = 0, badPos = 0, gone = 0;
for (let t = 0; t < 120; t++) {
  game.ship.status = 1; game.ship.spawnTimer = 0; game.ship.hyperFlag = 0; game.lives = 3; game.input.hyper = false; run(1);
  game.input.hyper = true; run(1); game.input.hyper = false;
  if (game.ship.status === 0 && game.ship.spawnTimer === 0x30 - 1) gone++;   // 48, minus the frame just run
  if (game.ship.hyperFlag === 0x80) fails++;
  const hx = game.ship.x >> 8, hy = game.ship.y >> 8;
  if (hx < 3 || hx > 28 || hy < 3 || hy > 20) badPos++;
  run(48);
  trials++;
}
check('hyperspace hides the ship for 48 frames', gone === trials, gone);
check('re-entry lands in x 3..28, y 3..20 (high bytes)', badPos === 0, badPos);
check('with 4 rocks about a quarter of jumps are fatal (' + fails + '/' + trials + ')', fails > trials * 0.1 && fails < trials * 0.45, fails);
A.setKnob('safeHyper', 1); fails = 0;
for (let t = 0; t < 80; t++) {
  game.ship.status = 1; game.ship.spawnTimer = 0; game.ship.hyperFlag = 0; game.lives = 3; game.input.hyper = false; run(1);
  game.input.hyper = true; run(1); game.input.hyper = false;
  if (game.ship.hyperFlag === 0x80) fails++;
  run(48);
}
check('SAFE HYPERSPACE knob: no fatal jumps', fails === 0 && A.settings.preset === 'custom', fails);
A.applyPreset('original');
clearRocks(); game.ship.status = 1; game.ship.spawnTimer = 0; game.ship.hyperFlag = 0; game.lives = 3;

/* death and respawn timing */
game.ship.x = 2000; game.ship.y = 2000; game.ship.vx = 0; game.ship.vy = 0; game.score = 0;
game.asteroids.push({ size: 4, type: 0, status: 1, x: 2000, y: 2000, rvx: 0, rvy: 0 }); game.curAsteroids = 1;
run(1);
check('ramming a rock kills the ship, scores 20 and splits the rock', game.ship.status === 0xA0 && game.lives === 2 && game.score === 20, game.ship.status + ' ' + game.lives + ' ' + game.score);
let t = 0; while (game.ship.status & 0x80) { run(1); t++; }
check('ship explosion lasts 192 frames (half speed)', t === 192, t);
clearRocks();
t = 0; while (game.ship.status !== 1 && t < 1000) { run(1); t++; }
check('respawn about 2.2 s after the explosion (0x81 timer)', t >= 128 && t <= 136, t);
check('respawned at centre', game.ship.x === 0x1060 && game.ship.y === 0x0C60);

/* thump */
check('heartbeat starts at 48 frames off + 4 on and speeds up to 8', game.thumpOffReload <= 0x30 && game.thumpOffReload >= 8);

/* ---------- 5. invulnerable mode ---------- */
section('invulnerable');
A.setInvuln(true);
startGame('original');
run(127); waitForShip();
clearRocks();
const rock = { size: 4, type: 1, status: 1, x: game.ship.x, y: game.ship.y, rvx: 6, rvy: 0 };
game.asteroids.push(rock); game.curAsteroids = 1;
const livesBefore = game.lives;
run(3);
check('rock passes through the ship: no death, no split, flash shown', game.lives === livesBefore && game.ship.status === 1 && rock.status === 1 && game.asteroids.length === 1 && game.flash > 0);
clearRocks();
game.saucerShots = [{ x: game.ship.x, y: game.ship.y, vx: 0, vy: 0, life: 18 }];
run(1);
check('saucer shot is absorbed harmlessly', game.saucerShots.length === 0 && game.lives === livesBefore && game.ship.status === 1);
game.saucer = { x: game.ship.x, y: game.ship.y, vx: 16, vy: 0, size: 2, status: 1 };
run(1);
check('saucer passes through too', game.lives === livesBefore && game.ship.status === 1 && game.saucer && game.saucer.status === 1);
game.saucer = null;
game.input.hyper = true; run(1); game.input.hyper = false; run(48);
check('hyperspace is never fatal when invulnerable', game.ship.status === 1);
check('badge is shown while playing', el.badge.classList.contains('on'));
A.setInvuln(false);

/* ---------- 6. knobs ---------- */
section('knobs');
A.applyPreset('original');
A.setKnob('astSpeed', 50);
check('touching a knob makes the preset CUSTOM', A.settings.preset === 'custom');
startGame('custom'); run(130);
const a0 = game.asteroids[0]; const sx = a0.x, sy = a0.y;
run(10);
const moved = Math.hypot(a0.x - sx, a0.y - sy), expect = Math.hypot(a0.rvx, a0.rvy) * 10 * 0.5;
check('ASTEROID SPEED 50% halves rock movement', Math.abs(moved - expect) < 1, moved + ' vs ' + expect);
A.applyPreset('original'); A.setKnob('startAst', 2); startGame('custom'); run(130);
check('STARTING ROCKS 2 -> first wave has 2 rocks', game.asteroids.length === 2);
A.applyPreset('original'); A.setKnob('saucerFreq', 0); startGame('custom'); run(130); waitForShip(); clearRocks(); run(3000);
check('SAUCER FREQUENCY NEVER -> no saucer in 3000 frames', game.saucer === null);
A.applyPreset('original'); startGame('original'); run(130); waitForShip(); clearRocks();
let fr = 0; while (!game.saucer && fr < 2000) { run(1); fr++; }
const firstSaucer = fr;
check('ORIGINAL: first saucer about 8.5 s after the wave starts (127 ticks x 4 frames)', fr > 450 && fr < 560, fr);
A.applyPreset('original'); A.setKnob('saucerFreq', 200); startGame('custom'); run(130); waitForShip(); clearRocks();
fr = 0; while (!game.saucer && fr < 2000) { run(1); fr++; }
check('SAUCER FREQUENCY 200% -> saucer twice as soon', fr < firstSaucer * 0.6, fr + ' vs ' + firstSaucer);
A.applyPreset('original'); A.setKnob('saucerAim', 0); startGame('custom'); run(130); waitForShip(); clearRocks();
game.ship.x = 4000; game.ship.y = 3000; game.saucer = { x: 1000, y: 3000, vx: 16, vy: 0, size: 1, status: 1 };
maxErr = 0; for (let i = 0; i < 60; i++) { let e = A.saucerAimDir() & 255; if (e > 128) e = 256 - e; maxErr = Math.max(maxErr, e); }
check('SAUCER ACCURACY 0% -> wild shots (max error > 40 units)', maxErr > 40, maxErr);
game.saucer = null;
A.applyPreset('original'); A.setKnob('drag', 6);
v = 63 * 256 + 255; frames = 0;
while (v > 0 && frames < 100000) { for (let i = 0; i < 6; i++) v = A.decel(v); frames += 2; }
check('SHIP DRAG 6 -> stops in ' + (frames / 60).toFixed(1) + ' s (< 5 s)', frames < 300, frames);
v = 63 * 256 + 255; frames = 0;
while (v > 0 && frames < 100000) { for (let i = 0; i < A.PRESETS.kid.drag; i++) v = A.decel(v); frames += 2; }
check('KID drag stops the ship from full speed in ' + (frames / 60).toFixed(1) + ' s (< 4 s)', frames < 240, frames);
A.applyPreset('original'); A.setKnob('lives', 9); startGame('custom');
check('SHIPS 9', game.lives === 9);
A.applyPreset('original'); A.setKnob('extraLife', 5000); startGame('custom'); run(130); waitForShip(); clearRocks();
game.score = 4990; game.lives = 3;
game.asteroids.push({ size: 4, type: 0, status: 1, x: 5000, y: 5000, rvx: 6, rvy: 6 }); game.curAsteroids = 1;
A.breakAsteroid(game.asteroids[game.asteroids.length - 1], true);
check('EXTRA SHIP EVERY 5000', game.lives === 4);
A.applyPreset('original'); A.setKnob('extraLife', 0); startGame('custom'); run(130); waitForShip(); clearRocks();
game.score = 9990; game.lives = 3;
game.asteroids.push({ size: 4, type: 0, status: 1, x: 5000, y: 5000, rvx: 6, rvy: 6 }); game.curAsteroids = 1;
A.breakAsteroid(game.asteroids[game.asteroids.length - 1], true);
check('EXTRA SHIP NEVER', game.lives === 3);
A.applyPreset('kid'); startGame('kid'); run(130);
check('KID preset: 9 ships, 2 slow rocks', game.lives === 9 && game.asteroids.length === 2 && A.settings.knobs.astSpeed === 45);
check('changing knobs never alters the ORIGINAL preset', A.PRESETS.original.lives === 3 && A.PRESETS.original.astSpeed === 100 && A.PRESETS.original.saucerAim === 100);

/* ---------- 7. persistence ---------- */
section('persistence');
A.applyPreset('easy'); A.setKnob('lives', 7);
const saved = JSON.parse(localStorage.getItem('asteroids.settings'));
check('settings saved under asteroids.settings', saved && saved.knobs.lives === 7 && saved.knobs.astSpeed === 75);
A.settings.knobs.lives = 3; A.settings.knobs.astSpeed = 100;
A.loadSettings();
check('settings round-trip through localStorage', A.settings.knobs.lives === 7 && A.settings.knobs.astSpeed === 75 && A.settings.preset === 'custom');
A.applyPreset('kid');
for (const kk in A.highs) delete A.highs[kk];
A.recordHigh(1500);
A.setInvuln(true); A.recordHigh(9000); A.setInvuln(false);
check('high scores kept per preset, invulnerable runs under their own key', A.highs.kid === 1500 && A.highs['kid.inv'] === 9000);
const hs = JSON.parse(localStorage.getItem('asteroids.high'));
check('high scores saved under asteroids.high', hs && hs.kid === 1500 && hs['kid.inv'] === 9000);
A.applyPreset('normal');
check('a different preset has its own best', A.currentHigh() === 0);
globalThis.localStorage = null;
let threw = false;
try { A.saveSettings(); A.recordHigh(1); } catch (e) { threw = true; }
globalThis.localStorage = { _d: {}, getItem(k) { return k in this._d ? this._d[k] : null; }, setItem(k, v) { this._d[k] = String(v); } };
check('survives localStorage being unavailable', !threw);

/* ---------- 8. menu / pause / game over flow ---------- */
section('flow');
A.applyPreset('original');
startGame('original');
check('overlay hidden while playing', el.overlay.classList.contains('hidden'));
globalThis.__key('p');
check('P pauses with the pause overlay', game.paused && A.getOverlayMode() === 'pause');
globalThis.__key('p');
check('P resumes', !game.paused);
globalThis.__key('ArrowLeft'); run(1);
check('keyboard rotates', game.input.left === true && game.ship.dir !== 64 || game.playerDispTimer > 0);
globalThis.__key('ArrowLeft', false);
globalThis.__key('Escape');
check('Esc returns to the menu with the attract field', game.state === 'menu' && A.getOverlayMode() === 'menu' && !el.overlay.classList.contains('hidden'));
globalThis.__key('1');
check('1-4 pick presets on the menu', A.settings.preset === 'kid');
globalThis.__key('4');
check('4 = original', A.settings.preset === 'original');
startGame('original'); run(130); waitForShip(); clearRocks();
game.lives = 1;
game.asteroids.push({ size: 1, type: 0, status: 1, x: game.ship.x, y: game.ship.y, rvx: 0, rvy: 0 }); game.curAsteroids = 1;
run(2);
check('last ship lost', game.lives === 0 && (game.ship.status & 0x80));
run(192 + 1);
check('game over state after the explosion', game.state === 'gameover');
run(200);
for (let i = 0; i < 3; i++) { A.update(); if (typeof globalThis.__raf === 'function') {} }
// the main loop's tick() opens the overlay; emulate it
check('GAME OVER overlay after the pause', game.gameOverTimer === 0);

/* ---------- 9. stability: thousands of frames in every state ---------- */
section('stability');
let err = null;
try {
  A.applyPreset('original'); startGame('original');
  A.seedRng(0x42, 0x24);
  let kills = 0, prevLives = game.lives, waves = 0, prevWave = 0, saucers = 0, hadSaucer = false, shots = 0;
  run(6000, (i) => {
    game.input.left = (i >> 5) % 3 === 0;
    game.input.right = (i >> 5) % 3 === 1;
    game.input.thrust = (i >> 4) % 4 === 0;
    game.input.fire = i % 9 === 0;
    game.input.hyper = i % 700 === 0;
    if (game.lives < prevLives) kills++;
    prevLives = game.lives;
    if (game.wave !== prevWave) waves++;
    prevWave = game.wave;
    if (game.saucer && !hadSaucer) saucers++;
    hadSaucer = !!game.saucer;
    shots += game.shipShots.length;
    if (game.state === 'gameover') { el.play.click(); prevLives = game.lives; }
  });
  console.log('     (6000 frames: ' + kills + ' deaths, ' + saucers + ' saucers, waves started ' + waves + ', score ' + game.score + ')');
  check('saucers appeared during the run', saucers > 0);
  clearInput();
  A.toMenu(); run(600);
  A.setInvuln(true); startGame('kid');
  run(3000, (i) => { game.input.thrust = i % 50 < 25; game.input.fire = i % 7 === 0; game.input.left = true; });
  check('invulnerable run never loses a ship', game.lives === 9 && game.state === 'play', game.lives);
  A.setInvuln(false); clearInput();
  A.toMenu();
} catch (e) { err = e; }
check('no exceptions across menu, play, game over and invulnerable runs', !err, err && err.stack);

console.log('\n' + (failures ? failures + ' FAILURE(S)' : 'all tests passed'));
process.exit(failures ? 1 : 0);
