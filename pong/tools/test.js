/* Headless test suite: runs the real game code from index.html under the
   DOM/canvas stubs in harness.js, calling render() every frame.
     node tools/test.js        -> must end with "all tests passed" */
require('./harness.js');
const { build } = require('./build.js');
const G = build();
const { game, settings, keys, update, render } = G;

let passed = 0, failed = 0;
function ok(cond, name) { if (cond) passed++; else { failed++; console.log('FAIL: ' + name); } }
function eq(a, b, name) { ok(a === b, name + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'); }
function near(a, b, tol, name) { ok(Math.abs(a - b) <= tol, name + ' (got ' + a + ', want ' + b + ' +-' + tol + ')'); }
const step = (n = 1) => { for (let i = 0; i < n; i++) { update(); render(); } };
const until = (f, max = 20000) => { for (let i = 0; i < max; i++) { if (f()) return true; update(); render(); } return f(); };
const key = (code, down, repeat) => (down ? G.onKeyDown : G.onKeyUp)({ code, key: code, repeat: !!repeat, preventDefault() {} });

function fresh(preset, extra, pextra) {
  localStorage._d = {};
  keys.clear();
  G.loadSettings();
  G.applyPreset(preset || 'original');
  settings.mode = '2p';
  if (extra) Object.assign(settings, extra);
  if (pextra) for (let s = 0; s < 2; s++) Object.assign(settings.p[s], pextra);
  G.seed(777);
  G.play();
  step(G.SERVE_FRAMES + 1);            // ball is served
}
/* Put the ball so that, on the next update, its top row lands on `top` (after the
   frame's horizontal move) with a given direction and velocity. */
function place(x, top, dir, seg, rev) {
  game.hidden = false; game.dir = dir; game.hacc = 0;
  const n = G.HSPEED[G.speedTier()];
  game.x = x - dir * n;
  game.vc = 251 - top; game.vacc = 0;
  if (seg !== undefined) { game.seg = seg; game.rev = rev || 0; }
}
function freezePaddles() { keys.clear(); }
/* measure the ball's vertical motion over a few frames */
function measureDy(frames = 3) { const y0 = game.ballY; step(frames); return (game.ballY - y0) / frames; }

/* ================= machine constants ================= */
eq(G.SW, 374, 'visible width = 455 clocks - 81 inhibited');
eq(G.SH, 246, 'visible height = 262 lines - 16 blanked');
near(G.FPS, 60.05, 0.01, 'frame rate 7.159 MHz / 455 / 262');
eq(G.NET_X, 175, 'net at H=256');
eq(G.PAD_X.join(','), '47,303', 'paddles at H=128 and H=384');
eq(G.PAD_W + 'x' + G.PAD_H, '4x15', 'paddle 4 clocks x 15 lines');
eq(G.BALL_W + 'x' + G.BALL_H, '4x4', 'square ball 4 x 4');
eq(G.SERVE_X, 181, 'serve position just right of the net (H=262)');
eq(G.SERVE_FRAMES, 102, 'serve delay 1.71 s (330k x 4.7uF 555)');
eq(G.SC_FRAMES, 15, 'score tone 0.24 s (220k x 1uF 555)');
near(G.HIT_HZ, 491.7, 0.2, 'hit tone 491 Hz');
near(G.LOW_HZ, 245.8, 0.2, 'wall/score tone 246 Hz');
eq(G.SCORE_Y + ',' + G.DIGIT_X.map(d => d.join('/')).join(','), '16,63/95,255/287', 'score digit window positions');
eq(G.SEG7[6] + ',' + G.SEG7[9], 'cdefg,abcfg', '7448 draws 6 and 9 without tails');

/* ================= paddle segments -> vertical velocity ================= */
eq([0, 1, 2, 3, 4, 5, 6, 7].map(s => G.encodeV(s, 0)).join(','), '13,12,11,10,10,9,8,7', 'encoder load values, 8 segments');
eq([0, 1, 2, 3, 4, 5, 6, 7].map(s => G.encodeV(s, 1)).join(','), '7,8,9,10,10,11,12,13', 'encoder with A2 reversed');
{
  const pad = { y: 100, h: 15 };
  eq(Array.from({ length: 15 }, (_, i) => G.padSegment(pad, 100 + i)).join(''), '001122334455667', '15-line paddle: 7 two-line segments + 1');
  const big = { y: 50, h: 30 };
  eq(G.padSegment(big, 50) + ',' + G.padSegment(big, 64) + ',' + G.padSegment(big, 79), '0,3,7', 'handicap paddle keeps 8 segments');
}
fresh('original');
{
  const want = [-3, -2, -1, 0, 0, 1, 2, 3];
  for (let s = 0; s < 8; s++) {
    fresh('original');
    freezePaddles(); game.pad[0].y = 100;
    // ball's lowest row meets paddle line 2s (segment s): the last overlapping line wins
    place(G.PAD_X[0] + 2, 100 + 2 * s - 3, -1, 3, 0);
    step(1);
    eq(game.dir, 1, 'segment ' + s + ': left paddle sends ball right');
    eq(game.seg, s, 'segment ' + s + ' latched');
    step(1);
    eq(measureDy(4), want[s], 'segment ' + s + ' vertical speed');
  }
  // right paddle, ball fully inside lines 4..7 -> last line 7 -> segment 3 -> flat
  fresh('original'); freezePaddles(); game.pad[1].y = 60;
  place(G.PAD_X[1] - 2, 64, 1, 0, 0); step(1);
  eq(game.dir + ',' + game.seg, '-1,3', 'right paddle: last overlapping line picks the segment');
  step(1); eq(measureDy(4), 0, 'centre hit flies flat');
  // a miss: ball passes above the paddle
  fresh('original'); freezePaddles(); game.pad[0].y = 100;
  place(G.PAD_X[0] + 2, 90, -1, 3, 0); step(1);
  eq(game.dir, -1, 'ball above the paddle is not hit');
}

/* ================= speed-up ================= */
// the ball arrives just touching the paddle face (overlap depth 1), as in play
function hitLeft() { freezePaddles(); game.pad[0].y = 100; place(G.PAD_X[0] + G.PAD_W - 1, 104, -1, 3, 0); step(1); }
function hitRight() { freezePaddles(); game.pad[1].y = 100; place(G.PAD_X[1] - G.BALL_W + 1, 104, 1, 3, 0); step(1); }
function stepSize() { const x0 = game.x; step(1); return Math.abs(game.x - x0); }
fresh('original');
eq(G.speedTier() + '/' + stepSize(), '0/2', 'serve speed: 2 clocks per frame');
hitLeft(); step(60);   // let the hit sound end
eq(game.speedCount, 8, 'arcade: F1 counts 8 hit-sound cycles per hit');
eq(G.speedTier() + '/' + stepSize(), '1/3', 'after the first return: 3 per frame');
hitRight(); step(60);
eq(game.speedCount, 12, 'F1 stops at 12');
eq(G.speedTier() + '/' + stepSize(), '2/4', 'after the second return: 4 per frame (top speed)');
for (let i = 0; i < 3; i++) { hitLeft(); step(30); hitRight(); step(30); }
eq(stepSize(), 4, 'stays at top speed');
fresh('original', { speedup: 'gradual' });
{
  const tiers = [];
  for (let h = 1; h <= 13; h++) { (h % 2 ? hitLeft : hitRight)(); step(40); tiers.push(G.speedTier()); }
  eq(tiers.join(''), '0001111111122', 'gradual: faster at 4 and 12 hits (patent / Holden)');
}
fresh('original', { speedup: 'off' });
for (let h = 0; h < 14; h++) { (h % 2 ? hitRight : hitLeft)(); step(30); }
eq(G.speedTier() + '/' + stepSize(), '0/2', 'speed-up off: always 2 per frame');
fresh('original');
hitLeft(); step(40); hitRight(); step(40);
eq(G.speedTier(), 2, 'fast before miss');
game.dir = 1; game.x = G.SW - 6; freezePaddles(); game.pad[1].y = 200; step(3);
eq(game.speedCount, 0, 'a miss resets the speed counter');

/* ================= paddle reach: the arcade gap ================= */
fresh('original');
key('KeyW', true); step(120); key('KeyW', false);
eq(game.pad[0].y, G.PAD_TOP_GAP, 'Original: paddle stops short of the top (gap)');
ok(game.pad[0].y >= 6, 'gap is wide enough for the 4-line ball');
key('KeyS', true); step(120); key('KeyS', false);
eq(game.pad[0].y + game.pad[0].h, G.PAD_BOTTOM_LIMIT, 'Original: paddle stops short of the bottom too');
{
  // ball skimming the top wall slips past the paddle at its highest
  fresh('original'); key('KeyW', true); step(80); key('KeyW', false);
  freezePaddles(); place(G.PAD_X[0] + 3, 2, -1, 3, 0); step(1);
  eq(game.dir, -1, 'ball in the top gap passes the paddle');
}
fresh('original', { reach: 'full' });
key('ArrowUp', true); step(120); key('ArrowUp', false);
eq(game.pad[1].y, 0, 'reach = whole screen: paddle reaches the top');
key('ArrowDown', true); step(120); key('ArrowDown', false);
eq(game.pad[1].y + game.pad[1].h, G.SH, 'reach = whole screen: paddle reaches the bottom');

/* ================= walls ================= */
fresh('original');
freezePaddles();
place(150, 30, 1, 0, 0);          // moving up 3 lines a frame
step(2); const dyUp = measureDy(3);
eq(dyUp, -3, 'ball rising 3 lines/frame');
G.Sound.log.length = 0;
{ let ys = []; for (let i = 0; i < 25; i++) { step(1); ys.push(game.ballY); }
  ok(Math.min.apply(null, ys) <= 0 && ys[ys.length - 1] > 30, 'ball bounces off the top wall'); }
ok(G.Sound.log.indexOf('wall') >= 0, 'wall tone at the top');
eq(measureDy(3), 3, 'reflected at the same speed downward');
G.Sound.log.length = 0;
{ let maxRow = 0, split = false;
  for (let i = 0; i < 90; i++) { step(1); maxRow = Math.max(maxRow, game.rows[game.rows.length - 1] || 0);
    if (game.rows.length && game.rows[0] === 0 && game.rows[game.rows.length - 1] > 200) split = true; }
  eq(maxRow, G.SH - 1, 'ball reaches the very bottom line');
  ok(G.Sound.log.indexOf('wall') >= 0, 'wall tone at the bottom');
  ok(game.dy < 0, 'ball heading up again after the bottom wall');
  ok(split, 'at the bottom the ball straddles the blanking and is drawn split, as on the arcade'); }

/* ================= serve direction and timing ================= */
fresh('original');
freezePaddles(); game.pad[1].y = 10; game.pad[0].y = 200;
place(G.SW - 10, 150, 1, 3, 0);
until(() => game.hidden, 30);
eq(game.score.join('-'), '1-0', 'ball past the right paddle: left scores');
ok(G.Sound.log.lastIndexOf('score') >= 0, 'score tone');
{
  let hiddenFrames = 0; while (game.hidden && hiddenFrames < 500) { step(1); hiddenFrames++; }
  near(hiddenFrames, G.SERVE_FRAMES, 1, 'ball reappears after the serve delay');
  eq(game.x, G.SERVE_X, 'served from beside the net');
  eq(game.dir, 1, 'served toward the player who missed (right), as the circuit does');
  eq(G.speedTier(), 0, 'serve at the slowest speed');
}
fresh('original');
freezePaddles(); game.pad[0].y = 200;
place(8, 20, -1, 3, 0);
until(() => game.hidden, 30);
eq(game.score.join('-'), '0-1', 'ball past the left paddle: right scores');
until(() => !game.hidden, 300);
eq(game.dir, -1, 'served toward the left player who missed');
{
  // vertical motion carries on while the ball is invisible
  fresh('original'); freezePaddles(); game.pad[0].y = 200;
  place(8, 100, -1, 7, 0); until(() => game.hidden, 30);
  const y0 = game.ballY; step(10); ok(game.ballY !== y0, 'ball keeps moving vertically during the serve delay');
}

/* ================= scoring to 11 and the end of the game ================= */
function missRight() { freezePaddles(); game.pad[1].y = 10; place(G.SW - 6, 200, 1, 3, 0); until(() => game.hidden || game.over, 30); until(() => !game.hidden || game.over, 300); }
fresh('original');
for (let i = 0; i < 10; i++) missRight();
eq(game.score.join('-') + ' ' + game.mode, '10-0 play', '10 points: still playing');
missRight();
eq(game.score[0], 11, 'eleventh point');
ok(game.over && game.mode === 'attract' && game.winner === 0, 'first to 11 wins; machine returns to attract');
eq(G.wins.session['PLAYER 1'], 1, 'win recorded for the session');
ok(JSON.parse(localStorage.getItem('pong.wins'))['PLAYER 1'] === 1, 'all-time tally saved');
step(200);
ok(!game.hidden && game.rows.length > 0, 'ball keeps bouncing after the game (attract)');
{ const xs = []; for (let i = 0; i < 600; i++) { step(1); xs.push(game.x); }
  ok(Math.min.apply(null, xs) < 40 && Math.max.apply(null, xs) > G.SW - 40, 'attract ball crosses the screen and bounces off the sides'); }
fresh('original', { points: 5 }); for (let i = 0; i < 5; i++) missRight(); ok(game.over && game.score[0] === 5, 'points to win = 5');
fresh('original', { points: 15 }); for (let i = 0; i < 14; i++) missRight(); ok(!game.over, '14 of 15: still playing'); missRight(); ok(game.over, 'points to win = 15');
fresh('original', { points: 0 }); for (let i = 0; i < 25; i++) missRight(); ok(!game.over && game.score[0] === 25, 'endless: no winner at 25');
render();

/* ================= both players at once on one keyboard ================= */
fresh('original');
game.pad[0].y = 100; game.pad[1].y = 100;
key('KeyW', true); key('ArrowDown', true);
step(5);
eq(game.pad[0].y + ',' + game.pad[1].y, (100 - 5 * G.KEY_SPEED) + ',' + (100 + 5 * G.KEY_SPEED), 'W and Down held together move both paddles each frame');
key('KeyS', true);               // left now holds W and S: cancels
const ly = game.pad[0].y; step(3);
eq(game.pad[0].y, ly, 'opposite keys cancel for one player without affecting the other');
ok(game.pad[1].y > 100 + 5 * G.KEY_SPEED, 'right player still moving');
key('KeyW', false); key('KeyS', false); key('ArrowDown', false);
const ry = game.pad[1].y;
for (let i = 0; i < 30; i++) key('ArrowDown', true, true);   // OS key-repeat events
step(1); eq(game.pad[1].y, ry + G.KEY_SPEED, 'auto-repeat events add nothing: state is read once per frame');
key('ArrowDown', false);
key('ArrowUp', true); __winListeners.blur.forEach(f => f()); step(2);
eq(keys.size, 0, 'window blur releases every key (no stuck paddles)');
fresh('original'); game.pad[0].y = 100; game.pad[1].y = 100;
key('ArrowUp', true); step(4); key('ArrowUp', false);
eq(game.pad[0].y + ',' + game.pad[1].y, '100,' + (100 - 4 * G.KEY_SPEED), '2 players: arrows only move the right paddle');

/* ================= mouse through a scaled canvas, and touch ================= */
{
  const cv = __elements.screen;
  cv.getBoundingClientRect = () => ({ left: 100, top: 50, width: 656, height: 492 });   // CSS size at 2x for a dpr-2 canvas
  let p = G.toGame(100, 50); eq(p.x + ',' + p.y, '0,0', 'top-left maps to 0,0');
  p = G.toGame(100 + 328, 50 + 246); eq(p.x + ',' + p.y, '187,123', 'centre maps through the scale');
  p = G.toGame(100 + 656, 50 + 492); eq(p.x + ',' + p.y, G.SW + ',' + G.SH, 'bottom-right');
  p = G.toGame(-999, 9999); eq(p.x + ',' + p.y, '0,' + G.SH, 'clamped');
  fresh('original', { reach: 'full' });
  ok(G.setKnob('R.control', 'mouse'), 'right player can use the mouse');
  cv.listeners.mousemove[0]({ clientX: 500, clientY: 50 + 2 * 120 });
  step(1);
  eq(game.pad[1].y + game.pad[1].h / 2, 120, 'mouse y is the paddle centre (absolute, like the knob)');
  ok(G.setKnob('L.control', 'mouse') && settings.p[1].control === 'keys', 'only one paddle on the mouse at a time');
  step(1); eq(game.pad[0].y + game.pad[0].h / 2, 120, 'left paddle follows the mouse now');
  G.setKnob('L.control', 'keys');
  // touch: one finger on each half
  fresh('original', { reach: 'full' });
  cv.listeners.touchstart[0]({ changedTouches: [{ identifier: 1, clientX: 120, clientY: 50 + 2 * 40 }, { identifier: 2, clientX: 700, clientY: 50 + 2 * 200 }], preventDefault() {} });
  step(1);
  eq(game.pad[0].y + game.pad[0].h / 2 + ',' + (game.pad[1].y + game.pad[1].h / 2), '40,200', 'two fingers drive the two paddles');
  cv.listeners.touchmove[0]({ changedTouches: [{ identifier: 2, clientX: 300, clientY: 50 + 2 * 100 }], preventDefault() {} });
  step(1);
  eq(game.pad[1].y + game.pad[1].h / 2, 100, 'a finger keeps its side even when it drifts across the net');
  cv.listeners.touchend[0]({ changedTouches: [{ identifier: 1 }, { identifier: 2 }] });
  eq(G.touchTarget.join(','), ',', 'lifting fingers releases the paddles');
  cv.getBoundingClientRect = () => ({ left: 0, top: 0, width: cv.width, height: cv.height });
}

/* ================= the computer player ================= */
function cpuMatch(level, frames, cpuSide) {
  fresh('original', { mode: cpuSide === 1 ? 'cpuR' : 'cpuL', cpu: level, points: 0 });
  settings.p[1 - cpuSide].bumper = true;     // the "human" side is a wall
  let errors = 0;
  for (let i = 0; i < frames; i++) { try { update(); render(); } catch (e) { errors++; if (errors < 3) console.log(e.stack); } }
  return { conceded: game.score[1 - cpuSide], hits: game.hits[cpuSide], errors };
}
{
  ok(G.isCpu(1) === false, '2 players: no CPU');
  const ace = cpuMatch(5, 7200, 1), rookie = cpuMatch(1, 7200, 1);
  if (process.env.VERBOSE) console.log('cpu ace', ace, 'rookie', rookie, 'mid', cpuMatch(3, 7200, 1));
  eq(ace.errors + rookie.errors, 0, 'CPU matches run clean');
  ok(ace.hits > 20, 'ace CPU returns the ball (' + ace.hits + ' hits)');
  ok(ace.hits > ace.conceded * 2, 'ace CPU returns most balls (hits ' + ace.hits + ', missed ' + ace.conceded + ')');
  ok(rookie.conceded > ace.conceded, 'rookie CPU misses more than ace (' + rookie.conceded + ' vs ' + ace.conceded + ')');
  const left = cpuMatch(4, 4000, 0);
  ok(left.hits > 10 && left.errors === 0, 'CPU can play the left side (' + left.hits + ' hits)');
  fresh('original', { mode: 'cpuR' });
  eq(G.playerName(1), 'CPU', 'CPU side is named CPU');
  game.pad[0].y = 100; key('ArrowUp', true); step(3); key('ArrowUp', false);
  eq(game.pad[0].y, 100 - 3 * G.KEY_SPEED, 'vs CPU: the human may use either key set');
  fresh('original', { mode: 'cpuL', serve: 'wait' });
  ok(G.isCpu(0) && !G.isCpu(1), 'human can choose the right side');
}

/* ================= knobs ================= */
fresh('original', { ballSpeed: 50 });
{ const x0 = game.x; step(10); eq(Math.abs(game.x - x0), 10, 'ball speed 50%: 1 clock per frame at serve speed'); }
fresh('original', { ballSpeed: 150 });
{ const x0 = game.x; step(10); eq(Math.abs(game.x - x0), 30, 'ball speed 150%: 3 clocks per frame'); }
fresh('original', { ballSpeed: 50 }); freezePaddles(); place(150, 120, 1, 0, 0); step(2);
eq(measureDy(4), -1.5, 'ball speed 50% halves vertical speed too');
fresh('original', { walls: 'flat' });
for (let s = 0; s < 8; s++) { game.seg = s; game.rev = 0; G.loadValue(); ok(game.dy === 0, 'flat: no vertical motion (seg ' + s + ')'); }
fresh('original', { walls: 'gentle' });
ok([0, 1, 2, 3, 4, 5, 6, 7].every(s => { game.seg = s; game.rev = 0; G.loadValue(); return Math.abs(game.dy) <= 1; }), 'gentle: at most 1 line per frame');
fresh('original', { serve: 'wait' });
missRight();
ok(game.hidden, 'serve = wait: ball stays hidden after the delay');
step(300); ok(game.hidden, 'still waiting for the receiver');
key('KeyW', true); step(1); key('KeyW', false);
ok(game.hidden, 'the scorer pressing does not serve');
key('ArrowDown', true); step(1); key('ArrowDown', false);
ok(!game.hidden && game.x === G.SERVE_X, 'receiver presses: ball served from the net');
eq(game.dir, 1, 'served toward the receiver');
fresh('original', { serve: 'wait' }); missRight(); key('Space', true); step(1); key('Space', false);
ok(!game.hidden, 'Space serves too');
fresh('original', { serve: 'wait', mode: 'cpuR' }); missRight();
ok(!game.hidden, 'CPU receiver serves itself after the delay');
// per-player handicaps
fresh('original', null, null);
G.setKnob('L.size', 44); step(1);
eq(game.pad[0].h + ',' + game.pad[1].h, '44,15', 'per-player paddle size');
G.setKnob('R.speed', 200); G.setKnob('L.speed', 50);
game.pad[0].y = 100; game.pad[1].y = 100;
key('KeyS', true); key('ArrowDown', true); step(4); key('KeyS', false); key('ArrowDown', false);
eq((game.pad[0].y - 100) + ',' + (game.pad[1].y - 100), (4 * G.KEY_SPEED * 0.5) + ',' + (4 * G.KEY_SPEED * 2), 'per-player paddle speed');
{ // a big paddle catches a ball the small one would miss
  fresh('original'); G.setKnob('L.size', 60); step(1); freezePaddles(); game.pad[0].y = 100;
  place(G.PAD_X[0] + 2, 150, -1, 3, 0); step(1);
  eq(game.dir, 1, 'big paddle returns a ball 50 lines below its top');
  eq(game.seg, 6, 'big paddle: near its bottom is a steep segment');
  fresh('original'); G.setKnob('L.size', 60); step(1); freezePaddles(); game.pad[0].y = 100;
  place(G.PAD_X[0] + 2, 127, -1, 3, 0); step(1);
  eq(game.seg, 3, 'big paddle: its middle is still the flat segment');
}
// bumper
fresh('original'); G.setKnob('R.bumper', true);
freezePaddles(); game.pad[1].y = 10; place(G.SW - 6, 200, 1, 3, 0); step(3);
eq(game.score.join('-'), '0-0', 'bumper: no point scored against that player');
eq(game.dir, -1, 'bumper: ball bounces back off the wall');
ok(!game.hidden && game.flash[1] > 0, 'bumper flash shown, ball stays in play');
ok(G.Sound.log.lastIndexOf('bumper') >= 0, 'bumper tone');
place(5, 200, -1, 3, 0); freezePaddles(); game.pad[0].y = 10; until(() => game.hidden, 20);
eq(game.score.join('-'), '0-1', 'the other side (no bumper) still concedes');
fresh('original', { points: 5 }); G.setKnob('L.bumper', true); G.wins.session = {};
for (let i = 0; i < 5; i++) missRight();
ok(game.over && G.wins.session['PLAYER 1*'] === 1 && !G.wins.session['PLAYER 1'], 'a win with the bumper is tallied separately (*)');

/* ================= presets, knobs, settings round-trip ================= */
localStorage._d = {};
G.applyPreset('kid'); eq(G.presetName(), 'kid', 'kid preset');
eq(settings.p[0].size + ',' + settings.ballSpeed + ',' + settings.points + ',' + settings.serve, '34,60,5,wait', 'kid values');
G.stepKnob('ballSpeed', 1); eq(G.presetName(), 'custom', 'touching a knob shows Custom');
G.applyPreset('original');
eq(G.presetName(), 'original', 'original preset');
eq([settings.ballSpeed, settings.speedup, settings.points, settings.serve, settings.walls, settings.reach, settings.p[0].size, settings.p[1].bumper].join(','),
   '100,arcade,11,auto,bounce,gap,15,false', 'Original = the arcade exactly');
G.setKnob('L.size', 26); eq(G.presetName(), 'custom', 'a per-player handicap also makes it Custom');
eq(G.PRESETS.original.size, 15, 'changing a knob never alters the Original preset');
G.applyPreset('easy'); eq(G.presetName(), 'easy', 'easy preset');
G.applyPreset('normal'); eq(G.presetName(), 'normal', 'normal preset');
ok(!G.setKnob('ballSpeed', 333), 'invalid knob values are refused');
for (const k of G.KNOBS) { const before = G.getKnob(k.key); G.stepKnob(k.key, 1); G.stepKnob(k.key, -1); ok(G.knobDef(k.key).opts.indexOf(G.getKnob(k.key)) >= 0, 'knob ' + k.key + ' steps within its options'); G.setKnob(k.key, before); }
// round trip
G.applyPreset('kid'); settings.mode = 'cpuL'; G.setKnob('cpu', 5); G.setKnob('R.bumper', true); G.setKnob('L.speed', 150);
G.setKnob('L.control', 'mouse'); G.setName(0, 'anna!'); G.setName(1, 'dad 2'); settings.muted = true; G.saveSettings();
const snap = JSON.stringify(settings);
Object.assign(settings, G.defaultSettings());
G.loadSettings();
eq(JSON.stringify(settings), snap, 'settings round-trip through localStorage');
eq(settings.p[0].name + '|' + settings.p[1].name, 'ANNA!|DAD 2', 'names are upper-cased and kept');
eq(G.cleanName('<script>verylongname'), 'SCRIPTVE', 'names are cleaned and cut to 8');
localStorage._d['pong.settings'] = '{nonsense';
G.loadSettings(); eq(settings.mode + ',' + G.presetName(), '2p,normal', 'corrupt settings fall back to defaults');
localStorage._d['pong.settings'] = JSON.stringify({ ballSpeed: 9999, points: 7, p: [{ size: 3 }, { control: 'mouse' }] });
G.loadSettings(); eq(settings.ballSpeed + ',' + settings.points + ',' + settings.p[0].size + ',' + settings.p[1].control, '100,11,15,mouse', 'out-of-range values are ignored');
{
  const real = global.localStorage;
  global.localStorage = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  let threw = false;
  try { G.saveSettings(); G.loadSettings(); G.recordWin('X', false); G.loadWins(); } catch (e) { threw = true; }
  ok(!threw, 'no exceptions when localStorage is unavailable');
  global.localStorage = real;
}
localStorage._d = {};
G.loadSettings();
eq(G.playerName(0) + '|' + G.playerName(1), 'PLAYER 1|PLAYER 2', 'default player names');
G.clearWins(); G.recordWin('ANNA', false); G.recordWin('ANNA', false); G.recordWin('DAD', true);
G.wins.session = {}; G.loadWins();
eq(JSON.stringify(G.wins.all), '{"ANNA":2,"DAD*":1}', 'all-time wins reload');

/* ================= menu, pause, mute ================= */
fresh('original');
key('KeyP', true); key('KeyP', false); ok(game.paused, 'P pauses');
const f0 = game.frame; step(20); eq(game.frame, f0, 'paused game does not advance');
key('KeyP', true); key('KeyP', false); ok(!game.paused, 'P resumes');
key('Escape', true); key('Escape', false); ok(G.menuOpen && game.paused, 'Esc opens the menu and pauses');
key('Escape', true); key('Escape', false); ok(!G.menuOpen && !game.paused, 'Esc again resumes');
key('KeyM', true); key('KeyM', false); ok(settings.muted, 'M mutes'); key('KeyM', true); key('KeyM', false); ok(!settings.muted, 'M unmutes');
G.openMenu();
key('Digit1', true); key('Digit1', false); eq(G.presetName(), 'kid', 'menu: 1 picks Kid');
key('Digit4', true); key('Digit4', false); eq(G.presetName(), 'original', 'menu: 4 picks Original');
const sel0 = G.menuSel; key('ArrowDown', true); key('ArrowDown', false); eq(G.menuSel, sel0 + 1, 'menu: arrow moves the selection');
key('ArrowRight', true); key('ArrowRight', false); eq(G.presetName(), 'original', 'menu: right on the preset row at the end stays');
key('ArrowLeft', true); key('ArrowLeft', false); eq(G.presetName(), 'normal', 'menu: left on the preset row picks the previous preset');
key('Space', true); key('Space', false); ok(!G.menuOpen && game.mode === 'play' && game.hidden, 'menu: Space starts a game');
G.openMenu();
__elements.name0.value = 'zoe'; __elements.name0.listeners.input[0]({});
eq(settings.p[0].name, 'ZOE', 'typing a name in the menu');
__elements.name0.focus(); key('KeyW', true); key('KeyW', false); key('Space', true); key('Space', false);
ok(G.menuOpen, 'typing in a name box does not start the game');
__elements.name0.blur();
G.resume();
// game over -> Space plays again
fresh('original', { points: 5 }); for (let i = 0; i < 5; i++) missRight();
ok(game.over, 'game over'); key('Space', true); key('Space', false);
ok(game.mode === 'play' && game.score.join() === '0,0', 'Space after game over starts a rematch');

/* ================= rendering ================= */
{
  global.__RASTER = true;
  const cv = __elements.screen;
  fresh('original'); render();
  const W = cv.width, sx = W / G.SW, sy = cv.height / G.SH, px = (x, y) => cv._buf[((Math.floor(y * sy) + 1) * W + Math.floor((x + 0.5) * sx)) * 4 + 3];
  ok(px(G.NET_X, 1) > 0 && px(G.NET_X, 9) > 0, 'net lit on lines 0-3, 8-11');
  ok(px(G.NET_X, 5) === 0 && px(G.NET_X + 2, 1) === 0, 'net dark on lines 4-7 and only one clock wide');
  ok(px(G.PAD_X[0] + 1, Math.round(game.pad[0].y) + 7) > 0, 'left paddle drawn');
  ok(px(G.DIGIT_X[0][1] + 1, G.SCORE_Y + 8) > 0 && px(G.DIGIT_X[0][1] + 8, G.SCORE_Y + 8) === 0, 'score 0 drawn with a hollow middle');
  ok(px(G.DIGIT_X[0][0] + 13, G.SCORE_Y + 8) === 0, 'no leading tens digit below 10');
  game.score = [11, 3]; render();
  ok(px(G.DIGIT_X[0][0] + 13, G.SCORE_Y + 8) > 0 && px(G.DIGIT_X[0][0] + 1, G.SCORE_Y + 8) === 0, '11: the tens "1" is the right-hand bars');
  // 7448 tail-less 6: no top bar
  game.score = [6, 9]; render();
  ok(px(G.DIGIT_X[0][1] + 8, G.SCORE_Y + 1) === 0 && px(G.DIGIT_X[1][1] + 8, G.SCORE_Y + 30) === 0, '6 has no top bar, 9 no bottom bar');
  ok(cv._buf.some((v, i) => (i & 3) === 3 && v > 0), 'something is drawn');
  global.__RASTER = false;
}
{
  // fillRect count per frame stays small (perf sanity)
  fresh('original'); const c = __elements.screen._ctx; c.fillRectCount = 0; render();
  ok(c.fillRectCount < 400, 'one frame is a few hundred fillRects (' + c.fillRectCount + ')');
}

/* ================= long runs with render() every frame ================= */
function bot(preset, extra, frames, skill) {
  fresh(preset, extra);
  let errors = 0, points = 0, games = 0;
  for (let i = 0; i < frames; i++) {
    try {
      keys.clear();
      for (let s = 0; s < 2; s++) {
        const p = game.pad[s], c = p.y + p.h / 2, t = game.ballY + 2 + (G.rnd() - 0.5) * (1 - skill) * 80;
        if (t < c - 3) keys.add(s ? 'ArrowUp' : 'KeyW'); else if (t > c + 3) keys.add(s ? 'ArrowDown' : 'KeyS');
      }
      if (i % 97 === 0) G.requestServe();
      const sc = game.score[0] + game.score[1];
      update(); render();
      if (game.score[0] + game.score[1] !== sc) points++;
      if (game.over) { games++; G.play(); }
    } catch (e) { errors++; if (errors < 3) console.log(e.stack); }
  }
  return { errors, points, games };
}
{
  let r = bot('original', {}, 9000, 0.6); eq(r.errors, 0, 'Original 2P: 9000 frames clean'); ok(r.points > 5, 'points get scored (' + r.points + ')');
  r = bot('kid', {}, 5000, 0.4); eq(r.errors, 0, 'Kid: 5000 frames clean');
  r = bot('easy', { mode: 'cpuR' }, 5000, 0.5); eq(r.errors, 0, 'Easy vs CPU: 5000 frames clean');
  r = bot('normal', { mode: 'cpuL', serve: 'wait' }, 5000, 0.7); eq(r.errors, 0, 'Normal CPU-left wait-serve: 5000 frames clean');
  r = bot('original', { points: 5, ballSpeed: 150, walls: 'gentle' }, 8000, 0.2); eq(r.errors, 0, 'fast, games ending and restarting: clean'); ok(r.games > 0, 'games completed (' + r.games + ')');
  r = bot('original', { points: 0, walls: 'flat', ballSpeed: 50 }, 4000, 0.9); eq(r.errors, 0, 'endless flat slow: clean');
  // attract mode alone (menu showing)
  fresh('original'); G.openMenu(); game.mode = 'attract'; game.paused = false; let e = 0;
  for (let i = 0; i < 4000; i++) { try { update(); render(); } catch (x) { e++; } }
  eq(e, 0, 'attract mode 4000 frames clean');
  ok(game.x > -G.H_BLANK && game.x < G.SW, 'attract ball stays on the line');
}

console.log(passed + ' passed, ' + failed + ' failed');
if (failed) process.exit(1);
console.log('all tests passed');
