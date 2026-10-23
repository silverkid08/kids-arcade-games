/* Headless test suite: runs the real game code from index.html under the
   DOM/canvas stubs in harness.js, calling render() every frame.
     node tools/test.js        -> must end with "all tests passed" */
require('./harness.js');
const { build } = require('./build.js');
const G = build();
const { game, ball, settings, input, update, render } = G;

let passed = 0, failed = 0;
function ok(cond, name) { if (cond) passed++; else { failed++; console.log('FAIL: ' + name); } }
function eq(a, b, name) { ok(a === b, name + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'); }
function near(a, b, tol, name) { ok(Math.abs(a - b) <= tol, name + ' (got ' + a + ', want ' + b + ' +-' + tol + ')'); }
const step = (n = 1) => { for (let i = 0; i < n; i++) { update(); render(); } };
const until = (f, max = 20000) => { for (let i = 0; i < max; i++) { if (f()) return true; update(); render(); } return f(); };
const px = (x, y) => G.fb[y * G.W + x];

function fresh(preset, extra, keep) {
  if (!keep) localStorage._d = {};
  G.applyPreset(preset || 'original');
  if (extra) Object.assign(settings, extra);
  G.seed(777);
  input.keyL = input.keyR = input.keyMode = false; input.serve = false;
  input.gx = (G.W - 1) / 2;
  G.startGame();
}
/* put the ball in play at (x, y) */
function place(x, y, o) {
  o = o || {};
  game.serveWait = false; game.served = false;
  ball.x = x; ball.y = y; ball.up = !!o.up; ball.left = !!o.left; ball.outer = !!o.outer;
  game.armed = o.armed === undefined ? true : o.armed;
  game.padContact = false; game.wallContact = false;
}
/* paddle at a given right edge (via the mouse mapping) */
function paddleAt(rightEdge) {
  const w0 = settings.width, travel = G.W - w0;
  const t = (rightEdge - (w0 - 1)) / travel;
  input.gx = (t - 0.5) * (G.W - 1) / (settings.sens / 100) + (G.W - 1) / 2;
  input.keyMode = false;
  G.updatePaddle();
}
/* a perfect-ish player: paddle centre follows the ball */
function bot(aim) {
  const p = G.padRect();
  input.gx += (ball.x + 2 + (aim || 0) - (p.l + p.r) / 2);
  input.gx = Math.max(-80, Math.min(310, input.gx));
  if (game.serveWait) input.serve = true;
}
/* send the ball straight into brick (r, c) from just below it (slow, middle segment: 1 line, 1 tick per frame) */
function shootBrick(r, c) {
  game.hits = 0; game.ro = false;
  place(G.BRICK_X0 + 16 * c + 3, G.BRICK_Y0 + 4 * r + 5, { up: true });
}
function clearBricks(keep) { game.bricks.fill(0); for (const i of keep || []) game.bricks[i] = 1; }
const idx = (r, c) => r * G.COLS + c;

/* ---------------- machine numbers ---------------- */
near(G.FPS, 63.42, 0.01, 'frame rate from the H/V counters (14.318 MHz / 3.5 / 64508 ticks)');
near(G.LINE_HZ, 15980, 1, 'line rate');
eq(G.FRAME_TICKS, 64508, 'ticks per frame');
near(G.SND.paddle[0], 1997.5, 0.5, 'paddle tone = line rate / 8 (B7 QC)');
near(G.SND.wall[0], 998.8, 0.5, 'wall tone = line rate / 16 (B7 QD)');
near(G.SND.brick[0], 499.4, 0.5, 'brick tone = line rate / 32 (B8 QA)');
eq(G.BEEP_GAP, 5, 'brick beeps every 5 frames (A7#2 71 ms)');
eq(G.ROWS + 'x' + G.COLS, '8x14', '8 rows of 14 bricks');
eq(G.ROW_VALUE.join(','), '7,7,5,5,3,3,1,1', 'row values top to bottom (red, orange, green, yellow)');
eq(G.ROW_VALUE.reduce((a, b) => a + b, 0) * G.COLS, 448, 'one wall is worth 448');
eq(G.BRICK_X0 + ',' + (G.BRICK_X0 + 13 * G.COL_PITCH + G.BRICK_W - 1), '2,223', 'bricks span x 2..223 (first one half under the left wall)');
eq(G.BRICK_Y0 + ',' + (G.BRICK_Y0 + 8 * G.ROW_PITCH - 1), '64,95', 'brick rows H 64..95');
eq(G.TOP_Y0 + ',' + G.TOP_Y1, '24,31', 'top wall H 24..31');
eq(G.PAD_Y0 + ',' + G.PAD_Y1 + ',' + G.PAD_W + ',' + G.PAD_W_SHRUNK, '212,215,15,7', 'paddle rows, width and half width');
eq(G.BALL_W + 'x' + G.BALL_H, '4x2', 'ball 4 lines x 2 ticks');
eq([0, 223, -1, -12, -13, -24, 224, 227].map(G.vOfX).join(','), '223,0,228,239,240,251,255,252', 'x -> V counter mapping');
eq(G.wrapX(228) + ',' + G.wrapX(-25), '-24,227', 'ball line counter wraps over 252 lines');
const bandAt = y => Object.keys(G.COL).find(k => G.COL[k] === G.ROWCOL[y]);
eq([60, 64, 71, 72, 80, 88, 95, 96, 211, 212, 217, 218].map(bandAt).join(','),
  'white,red,red,orange,green,yellow,yellow,white,white,blue,blue,white', 'cellophane bands');

/* ---------------- rendering ---------------- */
fresh('original', { blink: 0 });
render();
eq(px(8, 64), G.COL.red, 'red brick pixel'); eq(px(8, 72), G.COL.orange, 'orange brick');
eq(px(8, 80), G.COL.green, 'green brick'); eq(px(8, 88), G.COL.yellow, 'yellow brick');
eq(px(8, 67), G.COL.black, 'gap between brick rows'); eq(px(16, 64), G.COL.black, 'gap between columns');
eq(px(1, 64), G.COL.red, 'left wall is coloured by the strip'); eq(px(1, 150), G.COL.white, 'left wall white elsewhere');
eq(px(225, 100), G.COL.white, 'right wall'); eq(px(100, 26), G.COL.white, 'top wall');
eq(px(100, 20), G.COL.black, 'black above the top wall');
{ const p = G.padRect(); eq(px(p.l + 2, 213), G.COL.blue, 'paddle seen through the blue strip'); eq(p.w, 15, 'paddle 15 lines'); }
eq(px(148, 48), G.COL.white, 'player-2 score digit (segment a of 0)'); eq(px(152, 52), G.COL.black, 'inside the 0');
eq(px(20, 48), G.COL.white, 'player-1 hundreds digit'); eq(px(12, 34), G.COL.white, 'player number 1 (segment b)');
eq(px(4, 34), G.COL.black, 'player number is a 1, no segment f');
eq(px(140, 34), G.COL.white, 'ball number 1');
place(100, 66); render(); eq(px(101, 66), G.COL.red, 'ball turns red inside the red strip');
place(100, 150); render(); eq(px(101, 150), G.COL.white, 'ball white below the bricks'); eq(px(104, 150), G.COL.black, 'ball is 4 lines wide');
eq(px(101, 152), G.COL.black, 'ball is 2 ticks tall');
// digits through the 7448 font
{
  const segs = Object.keys(G.SEG7).map(d => G.SEG7[d].length).join('');
  eq(segs, '6255456376', 'segment counts 0-9 (7448 tails on 6 and 9)');
  game.score = 896; render(); eq(px(20 + 5, 48 + 6), G.COL.white, '8 has its middle bar');
}

/* ---------------- coordinate mapping through a scaled canvas ---------------- */
{
  const cv = __elements.screen;
  const s = G.layout(); eq(s.join('x'), '2x3', '1200x900 window picks 2x3 stretch');
  eq(cv.style.width + ' ' + cv.style.height, '456px 720px', 'canvas CSS size');
  cv.getBoundingClientRect = () => ({ left: 100, top: 50, width: 456, height: 720 });
  let p = G.toGame(100, 50); eq(p.x + ',' + p.y, '0,0', 'top-left');
  p = G.toGame(100 + 455, 50 + 719); eq(p.x + ',' + p.y, '227,239', 'bottom-right');
  p = G.toGame(100 + 2 * 114 + 1, 50 + 3 * 120 + 2); eq(p.x + ',' + p.y, '114,120', 'unequal 2x3 scale');
  p = G.toGame(5000, -300); eq(p.x + ',' + p.y, '227,0', 'clamped');
  near(G.toGameX(100 + 456 / 2), 114, 1e-9, 'unclamped x for the paddle');
  fresh('original');
  cv.listeners.mousemove[0]({ clientX: 100, clientY: 300 }); step();
  eq(G.padRect().l, 0, 'mouse at the left edge -> paddle at the far left');
  cv.listeners.mousemove[0]({ clientX: 100 + 455.9, clientY: 300 }); step();
  eq(G.padRect().r, 227, 'mouse at the right edge -> paddle at the far right');
  cv.listeners.mousemove[0]({ clientX: 100 + 228, clientY: 300 }); step();
  const mid = G.padRect(); near((mid.l + mid.r) / 2, 113.5, 1, 'mouse in the middle -> paddle centred');
  __winListeners.mousemove[0]({ clientX: 100 + 114, clientY: 10 }); step();
  near(G.padRect().l, Math.round(0.25 * 213), 1, 'window mousemove (cursor off the canvas) also steers');
  __winListeners.mousemove[0]({ clientX: -400, clientY: 10 }); step();
  eq(G.padRect().l, 0, 'cursor far outside clamps to the travel');
  cv.listeners.mousedown[0]({ button: 0, clientX: 300, clientY: 300, preventDefault() {} });
  ok(input.serve, 'left click presses SERVE');
  input.serve = false;
  cv.listeners.mousedown[0]({ button: 2, clientX: 300, clientY: 300, preventDefault() {} });
  ok(!input.serve, 'right click does nothing');
  cv.listeners.touchstart[0]({ changedTouches: [{ clientX: 100 + 456, clientY: 0 }], preventDefault() {} });
  ok(input.serve && Math.round(input.gx) === 228, 'tap steers and serves');
  input.serve = false;
  // sensitivity: 200% reaches the end at a quarter of the canvas from the centre
  fresh('original', { sens: 200 });
  cv.listeners.mousemove[0]({ clientX: 100 + 228 + 114, clientY: 300 }); step();
  eq(G.padRect().r, 227, 'sensitivity 200%: three quarters across already reaches the right end');
  fresh('original', { sens: 50 });
  cv.listeners.mousemove[0]({ clientX: 100 + 455.9, clientY: 300 }); step();
  near(G.padRect().l, Math.round(0.75 * 213), 1, 'sensitivity 50%: the right edge only gets three quarters of the way');
  cv.getBoundingClientRect = () => ({ left: 0, top: 0, width: 228, height: 240 });
  // keyboard
  fresh('original'); paddleAt(100);
  __winListeners.keydown[0]({ key: 'ArrowRight', preventDefault() {} }); step(5);
  eq(G.padRect().r, 115, 'arrow key moves the paddle 3 lines a frame');
  __winListeners.keyup[0]({ key: 'ArrowRight' }); step(3);
  eq(G.padRect().r, 115, 'paddle stays put after the key is released');
  __winListeners.keydown[0]({ key: ' ', preventDefault() {} }); ok(input.serve, 'space presses SERVE');
  input.serve = false;
}

/* ---------------- serve rules ---------------- */
fresh('original');
ok(game.serveWait, 'a game starts waiting for the serve');
step(600);
ok(game.serveWait, 'Original: no serve without the SERVE button (the netlist has no auto-serve)');
ok(Math.floor(ball.y) >= 0 && Math.floor(ball.y) < 256, 'the invisible ball keeps cycling');
input.serve = true; step();
ok(game.served, 'one click latches the serve (A3#1)');
ok(until(() => !game.serveWait, 300), 'ball appears within one 256-frame cycle');
eq(Math.floor(ball.y), 143, 'served at H 143..144');
ok(!ball.up, 'serve goes down');
eq(game.hits + ',' + game.ro, '0,false', 'serve starts slow');
// timing after a loss: the hidden ball continues down at 1 tick per frame and wraps
fresh('original'); input.serve = true; until(() => !game.serveWait, 400);
place(100, 236); step(3);
ok(game.serveWait && game.ballsLost === 1, 'ball lost at the bottom');
input.serve = true; step();
{ let n = 0; while (game.serveWait && n < 400) { step(); n++; } ok(n > 140 && n < 170, 'reappears ~2.5 s after the loss (got ' + n + ' frames)'); }
// clicks during play do not pre-arm the next serve
fresh('original'); input.serve = true; until(() => !game.serveWait, 400);
input.serve = true; step(); input.serve = true; step();
place(100, 236); step(3); ok(game.serveWait && !game.served, 'clicks while the ball is in play are ignored');
step(600); ok(game.serveWait, 'still waiting');
// auto
fresh('original', { serve: 'auto' });
ok(until(() => !game.serveWait, 400), 'auto serve without a click');
eq(Math.floor(ball.y), 143, 'auto serve from mid-screen');
// sticky
fresh('original', { serve: 'sticky' });
paddleAt(150); step(30);
ok(game.serveWait, 'sticky: waits');
{ const p = G.padRect(); eq(Math.floor(ball.y), 210, 'ball rests on the paddle'); near(ball.x + 2, (p.l + p.r + 1) / 2, 1, 'centred on it'); }
paddleAt(60); step(1); near(ball.x + 2, (G.padRect().l + G.padRect().r + 1) / 2, 1, 'ball follows the paddle');
render(); ok(px(Math.floor(ball.x) + 1, 210) === G.COL.white, 'resting ball is drawn');
input.serve = true; step();
ok(!game.serveWait && ball.up, 'click launches it upwards');

/* ---------------- side walls, top wall, bottom ---------------- */
fresh('original');
place(3, 150, { left: true }); step(1); ok(ball.left, 'still going left at x=2');
until(() => !ball.left, 10); eq(Math.floor(ball.x), -1, 'bounces off the left wall when the ball reaches x=-1 (VB_HIT, V16 low)');
ok(G.Sound.log.includes('wall'), 'wall tone');
place(218, 150, { left: false }); until(() => ball.left, 10); eq(Math.floor(ball.x) + 3, 224, 'bounces off the right wall on touching it (V 252..255, V16 high)');
place(100, 40, { up: true }); until(() => !ball.up, 20); eq(Math.floor(ball.y), 31, 'top wall bounce at H 31');

/* ---------------- scoring per row ---------------- */
for (let r = 0; r < 8; r++) {
  fresh('original', { speedups: 0 });
  clearBricks([idx(r, 5)]);
  shootBrick(r, 5);
  G.Sound.log.length = 0;
  until(() => game.score > 0, 400);
  eq(game.score, G.ROW_VALUE[r], 'row ' + r + ' scores ' + G.ROW_VALUE[r]);
  ok(!ball.up, 'row ' + r + ': ball bounces back down');
  eq(game.bricks[idx(r, 5)], 0, 'row ' + r + ': brick removed');
  step(5 * 8 + 5);
  eq(G.Sound.log.filter(s => s === 'brick').length, G.ROW_VALUE[r], 'row ' + r + ': one beep per point');
}
// hitting two bricks at once only takes one; raster order: rightmost, then topmost
fresh('original');
clearBricks([idx(7, 3), idx(7, 4)]);
place(2 + 16 * 4 - 3 - 5, 100, { up: true });        // after 5 frames it straddles the gap between columns 3 and 4
until(() => game.score > 0, 200);
eq(game.bricks[idx(7, 3)] + ',' + game.bricks[idx(7, 4)], '1,0', 'overlapping two bricks: the right one (smaller V) goes');
// F7: one brick per paddle / top-wall contact
fresh('original');
clearBricks([idx(7, 5), idx(6, 5)]); for (let c = 0; c < 14; c++) game.bricks[idx(5, c)] = 1;
shootBrick(7, 5);
until(() => game.score > 0, 200);
eq(game.score, 1, 'first brick taken');
ok(!game.armed, 'disarmed after a brick (F7 reset)');
ball.up = true; step(30);
eq(game.score, 1, 'disarmed ball passes through bricks without breaking them');
eq(G.bricksLeft(), 15, 'the other bricks are still there');
until(() => !ball.up, 60); ok(game.armed, 're-armed by the top wall');
until(() => game.score > 1, 100); eq(game.score, 4, 'then breaks a brick from above (green, behind the wall)');
ok(ball.up, 'and bounces back up behind the wall');

/* ---------------- speed-up points ---------------- */
function paddleHit(seg) {                       // bounce the ball off the paddle once
  const p = G.padRect();
  const lx = p.r - (seg === undefined ? 6 : [1, 5, 9, 13][seg]);
  place(lx, 210, { up: false, outer: false, left: false });
  until(() => ball.up, 20);
  step(10);                                     // get clear of the paddle
}
fresh('original'); clearBricks([]); paddleAt(120);
let sp = G.ballSpeed(); eq(sp.rawY + ',' + sp.rawX, '1,1', 'start: 1 tick and 1 line per frame (middle segment)');
for (let i = 0; i < 3; i++) paddleHit();
eq(game.hits, 3, '3 hits counted'); eq(G.ballSpeed().rawY, 1, 'still slow after 3 hits');
paddleHit(); eq(game.hits, 4, '4 hits'); eq(G.ballSpeed().rawY, 2, 'speeds up after 4 hits (B5 QC)');
for (let i = 0; i < 4; i++) paddleHit();
sp = G.ballSpeed(); eq(sp.rawY + ',' + sp.rawX, '1,3', 'after 8 hits V_SLOW drops: 3 lines but only 1 tick a frame');
for (let i = 0; i < 4; i++) paddleHit();
sp = G.ballSpeed(); eq(sp.rawY + ',' + sp.rawX, '2,3', 'after 12 hits: 2 ticks, 3 lines');
for (let i = 0; i < 5; i++) paddleHit();
eq(game.hits, 12, 'counter stops at 12');
// orange / red contact
for (const [r, expect] of [[7, false], [5, false], [3, true], [1, true]]) {
  fresh('original'); clearBricks([idx(r, 5)]);
  shootBrick(r, 5);
  until(() => game.score > 0, 400);
  eq(game.ro, expect, 'row ' + r + (expect ? ' (orange/red) sets' : ' does not set') + ' the top speed flag');
  if (expect) { const s2 = G.ballSpeed(); eq(s2.rawY + ',' + s2.rawX + ',' + game.hits, '3,3,15', 'top speed: 3 ticks and 3 lines a frame'); }
}
// measured motion matches
fresh('original'); clearBricks([]);
place(100, 150, { up: true, left: true, outer: true });
{ const x0 = ball.x, y0 = ball.y; step(); eq((x0 - ball.x) + ',' + (y0 - ball.y), '2,1', 'outer segment slow: moves 2 lines left, 1 tick up per frame'); }
// resets per ball
game.hits = 15; game.ro = true; game.shrunk = true;
place(100, 236); step(3);
eq(game.hits + ',' + game.ro + ',' + game.shrunk, '0,false,false', 'losing the ball resets speed and paddle (SERVE_WAIT clears B5, D5, F5)');
// speedups off
fresh('original', { speedups: 0 }); clearBricks([idx(1, 5)]); paddleAt(120);
for (let i = 0; i < 14; i++) paddleHit();
eq(game.hits, 0, 'speed-ups off: no hit counting');
shootBrick(1, 5); game.hits = 0; until(() => game.score > 0, 400);
eq(game.ro + ',' + G.ballSpeed().rawY, 'false,1', 'speed-ups off: red row does not speed up');

/* ---------------- paddle segments and angles ---------------- */
fresh('original'); clearBricks([]); paddleAt(150);
{
  const p = G.padRect();
  const expectSeg = i => (i >> 2);
  for (let i = 0; i < 15; i++) {
    game.hits = 0; place(p.r - i - 1, 210, { up: false, left: false, outer: false });   // moves 1 line right first
    until(() => ball.up, 20);
    const seg = expectSeg(i);
    eq((ball.left ? 'L' : 'R') + (ball.outer ? 'o' : 'm'), (seg >= 2 ? 'L' : 'R') + (seg === 0 || seg === 3 ? 'o' : 'm'),
      'paddle line ' + i + ' from the right edge -> segment ' + seg);
  }
  // the four segments as speeds (slow phase)
  const res = [0, 1, 2, 3].map(sg => { game.hits = 0; place(p.r - [1, 5, 9, 13][sg] - 1, 210); until(() => ball.up, 20); const x0 = ball.x; step(); return Math.round(ball.x - x0); });
  eq(res.join(','), '2,1,-1,-2', 'segments right->left send the ball +2, +1, -1, -2 lines per frame');
  // ball overlapping the paddle's left end: uses the leftmost line it touches
  game.hits = 0; place(p.l - 2, 210); until(() => ball.up, 20); ok(ball.left && ball.outer, 'hit on the left tip goes left at the flat angle');
  game.hits = 0; place(p.r - 1, 210); until(() => ball.up, 20); ok(!ball.left && ball.outer, 'hit on the right tip goes right at the flat angle');
  ok(G.Sound.log.includes('paddle'), 'paddle tone');
}

/* ---------------- paddle shrink ---------------- */
fresh('original'); clearBricks([]); paddleAt(150);
place(100, 40, { up: true }); until(() => !ball.up, 20);
ok(game.shrunk, 'back wall hit halves the paddle (F5)');
{ const p = G.padRect(); eq(p.w + ',' + p.r, '7,150', 'half paddle is 7 lines and keeps its right edge'); }
render(); eq(px(150 - 7, 213), G.COL.black, 'shrunk paddle drawn 7 wide'); eq(px(150 - 6, 213), G.COL.blue, 'shrunk paddle left line');
place(100, 236); step(3); eq(G.padRect().w, 15, 'full width again for the next ball');
fresh('original', { shrink: 0 }); place(100, 40, { up: true }); until(() => !ball.up, 20);
ok(!game.shrunk, 'shrink knob off: no shrink');
fresh('original', { width: 40 }); eq(G.padRect().w, 40, 'paddle width knob');
place(100, 40, { up: true }); until(() => !ball.up, 20); eq(G.padRect().w, 19, 'a wide paddle shrinks to about half');
fresh('original', { width: 56 }); paddleAt(120);
{ const p = G.padRect(); place(p.r - 31, 210); until(() => ball.up, 20); ok(ball.left && !ball.outer, 'wide paddle keeps 4 proportional segments'); }

/* ---------------- two walls ---------------- */
fresh('original'); paddleAt(120);
clearBricks([idx(7, 6)]); game.score = 447;
shootBrick(7, 6);
until(() => game.score === 448, 400);
eq(game.score, 448, 'first wall complete: 448');
ok(game.pendingRefill && G.bricksLeft() === 0, 'wall cleared, refill pending');
step(20); eq(G.bricksLeft(), 0, 'no new wall until the paddle is hit');
paddleHit();
eq(game.wall + ',' + G.bricksLeft(), '2,112', 'second wall appears on the next paddle hit (F4 / FPD1)');
clearBricks([idx(7, 6)]); game.score = 895;
shootBrick(7, 6);
until(() => game.score === 896, 400);
ok(game.finished && !game.pendingRefill, 'second wall cleared: no third wall at Original');
ok(until(() => game.mode !== 'play', 200), 'game ends after the second wall');
eq(game.lastSummary.score, 896, 'maximum score 896');
eq(game.lastSummary.walls, 2, 'two walls cleared');
ok(G.overlayOpen(), 'game-over menu shown');
ok(/GAME OVER/.test(__elements.sub.innerHTML) && /CATCH RATE/.test(__elements.sub.innerHTML), 'game-over text shows the mouse stats');
// endless
fresh('original', { endless: 1 }); paddleAt(120);
game.wall = 2; clearBricks([idx(7, 6)]);
shootBrick(7, 6); until(() => G.bricksLeft() === 0, 400);
ok(game.pendingRefill && !game.finished, 'endless: a fresh wall is coming');
paddleHit(); eq(game.wall + ',' + G.bricksLeft(), '3,112', 'endless: third wall');
render(); eq(px(190, 4), G.COL.hint, 'WALL 3 badge');
// rows knob
fresh('original', { rows: 4 }); eq(G.bricksLeft(), 56, '4 rows = 56 bricks');
eq(game.bricks[idx(3, 0)] + ',' + game.bricks[idx(4, 0)], '0,1', 'the bottom rows are kept (green + yellow)');
fresh('original', { rows: 1 }); eq(G.bricksLeft(), 14, '1 row');

/* ---------------- balls ---------------- */
fresh('original'); input.serve = true;
for (let b = 1; b <= 3; b++) {
  render(); eq(px(140, 34), G.COL.white, 'ball digit shows ball ' + b);
  ok(until(() => !game.serveWait, 600), 'ball ' + b + ' served');
  place(100, 236); step(3);
  eq(game.ballsLost, b, 'ball ' + b + ' lost');
  input.serve = true;
}
ok(game.over, '3 balls per game');
ok(until(() => game.mode !== 'play', 200), 'game over after the third ball');
ok(G.overlayOpen(), 'menu after game over');
fresh('original', { balls: 5 });
for (let b = 1; b <= 5; b++) { place(100, 236); step(3); }
ok(game.over, '5-ball DIP setting');
fresh('original', { balls: 9 });
for (let b = 1; b <= 8; b++) { place(100, 236); step(3); }
ok(!game.over, '9 balls: 8 lost, still playing');
render(); eq(px(141, 34 + 8), G.COL.white, 'ball digit 9 drawn');

/* ---------------- invulnerable ---------------- */
fresh('original', { inv: 1, endless: 1 });
place(100, 236); step(3);
eq(game.ballsLost, 0, 'invulnerable: ball not lost');
ok(ball.up && game.flash > 0, 'bounces off the floor with a flash');
eq(game.stats.misses + ',' + game.stats.saves, '1,1', 'counted as a miss for the stats');
ok(G.Sound.log.includes('bounce'), 'bounce sound');
render(); eq(px(8, 4), G.COL.badge, 'INVULNERABLE badge drawn');
{
  let flashSeen = false;
  for (let i = 0; i < 20; i++) { step(); if (px(100, 239) === G.COL.badge) flashSeen = true; }
  ok(flashSeen, 'floor flash drawn');
}
input.gx = -500;
for (let i = 0; i < 20000; i++) { update(); if (i % 7 === 0) render(); }
eq(game.mode + ',' + game.ballsLost, 'play,0', '20000 frames with the paddle parked: never loses a ball');
ok(game.stats.saves > 10, 'many floor bounces');
game.score = Math.max(game.score, 5);
G.openMenu(); G.quitToMenu();
eq(G.getHigh('high.custom.inv'), game.lastSummary.score, 'invulnerable score saved under its own key');
eq(localStorage._d['breakout.high.custom'], undefined, 'invulnerable run never touches the real high score');

/* ---------------- speed knob ---------------- */
fresh('original', { speed: 50 }); clearBricks([]);
place(100, 150, { up: true, left: false, outer: true });
{ const x0 = ball.x, y0 = ball.y; step(2); eq((ball.x - x0) + ',' + (y0 - ball.y), '2,1', 'speed 50%: half the distance per frame'); }
fresh('original', { speed: 125 }); clearBricks([]);
place(100, 150, { up: true, left: false, outer: true });
{ const x0 = ball.x; step(4); eq(ball.x - x0, 10, 'speed 125%'); }

/* ---------------- score blink ---------------- */
fresh('original'); game.score = 888;
{
  let on = 0, off = 0;
  for (let i = 0; i < 64; i++) { step(); if (px(25, 54) === G.COL.white) on++; else off++; }
  ok(on > 20 && off > 20, 'player score flashes at ~4 Hz (555 B2) (on ' + on + ', off ' + off + ')');
}
fresh('original', { blink: 0 }); game.score = 888;
{ let off = 0; for (let i = 0; i < 64; i++) { step(); if (px(25, 54) !== G.COL.white) off++; } eq(off, 0, 'blink off: steady score'); }

/* ---------------- presets, knobs and storage ---------------- */
localStorage._d = {};
G.applyPreset('original'); eq(G.presetName(), 'original', 'preset detected');
G.setKnob('speed', 70); eq(G.presetName(), 'custom', 'touching a knob -> custom');
eq(G.PRESETS.original.speed, 100, 'Original preset values untouched');
G.setKnob('speed', 33); eq(settings.speed, 70, 'invalid knob value rejected');
G.stepKnob('balls', 1); eq(settings.balls, 4, 'stepKnob');
G.stepKnob('serve', 5); eq(settings.serve, 'sticky', 'stepKnob clamps');
G.saveSettings();
const saved = JSON.stringify(settings);
G.applyPreset('kid'); localStorage._d['breakout.settings'] = saved;
G.loadSettings(); eq(JSON.stringify(settings), saved, 'settings round-trip through localStorage');
G.applyPreset('original'); localStorage._d['breakout.settings'] = JSON.stringify({ speed: 'fast', balls: 99, rows: 5 });
G.loadSettings(); eq(settings.balls + ',' + settings.rows + ',' + settings.speed, '3,5,100', 'bad stored values ignored');
localStorage._d['breakout.settings'] = '{not json'; G.loadSettings(); ok(true, 'corrupt settings do not throw');
for (const p of G.PRESET_ORDER) { G.applyPreset(p); eq(G.presetName(), p, 'preset ' + p + ' round-trips'); }
eq(G.PRESETS.kid.inv + ',' + G.PRESETS.original.inv, '1,0', 'Kid is invulnerable, Original is not');
ok(G.KNOBS.length >= 10, 'at least 10 knobs');
{
  const real = global.localStorage;
  global.localStorage = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); }, removeItem() { throw new Error('denied'); } };
  let threw = false;
  try { G.saveSettings(); G.loadSettings(); G.getHigh(G.highKey()); G.Sound.setMuted(false); } catch (e) { threw = true; }
  ok(!threw, 'no localStorage: no exceptions');
  global.localStorage = real;
}
// high scores per preset
fresh('original'); game.score = 120; G.endSession(true);
eq(G.getHigh('high.original'), 120, 'Original high score saved');
fresh('original', null, true); game.score = 10; G.endSession(true);
ok(!game.lastSummary.newHigh, 'lower score is not a new high'); eq(G.getHigh('high.original'), 120, 'high score kept');
fresh('kid', null, true); game.score = 50; G.endSession(true);
eq(G.getHigh('high.kid.inv'), 50, 'Kid (invulnerable) high score under .inv');
eq(G.getHigh('high.original') + ',' + G.getHigh('high.kid'), '120,0', 'separate tables per preset and for invulnerable');

/* ---------------- mouse-skill stats ---------------- */
fresh('original'); clearBricks([]); paddleAt(120);
for (let i = 0; i < 6; i++) paddleHit();
place(10, 236); step(3);                         // miss
for (let i = 0; i < 3; i++) paddleHit();
{
  const s = G.summarise(game.stats);
  eq(s.catches + '/' + s.tries + ' ' + s.rate + '% best ' + s.best, '9/10 90% best 6', 'catch rate and longest rally');
}
for (let b = 0; b < 2; b++) { place(10, 236); step(3); }
until(() => game.mode !== 'play', 200);
eq(game.lastSummary.rate, 75, 'summary at game over: 9 of 12');
ok(/LONGEST RALLY <b>6<\/b>/.test(__elements.sub.innerHTML), 'game-over screen shows the longest rally');
{
  const ps = JSON.parse(localStorage._d['breakout.stats.original']);
  eq(ps.games + ',' + ps.catches + ',' + ps.best, '1,9,6', 'per-preset stats stored');
  const hist = JSON.parse(localStorage._d['breakout.history']); eq(hist.length, 1, 'history entry');
  ok(/9\/12/.test(G.historyHTML()), 'progress table');
}

/* ---------------- pause / menu ---------------- */
fresh('original'); input.serve = true; until(() => !game.serveWait, 400);
G.togglePause(); const y0 = ball.y; step(30); eq(ball.y, y0, 'paused: nothing moves');
render(); eq(px(102, 150), G.COL.white, 'PAUSED text');
G.togglePause(); step(); ok(ball.y !== y0, 'unpaused');
G.openMenu(); ok(game.paused && G.overlayOpen(), 'Esc opens the menu and pauses');
G.resume(); ok(!game.paused && !G.overlayOpen(), 'resume');

/* ---------------- attract mode ---------------- */
G.quitToMenu();
eq(game.mode, 'attract', 'attract behind the menu');
{ const p = G.padRect(); eq(p.l + ',' + p.r, '0,227', 'attract: paddle covers every line (ATTRACT forces C3.11)'); }
const scoreBefore = game.lastScore; G.Sound.log.length = 0;
let minBricks = 999;
for (let i = 0; i < 5000; i++) { update(); render(); minBricks = Math.min(minBricks, G.bricksLeft()); }
eq(game.lastScore, scoreBefore, 'attract scores nothing');
eq(G.Sound.log.length, 0, 'attract is silent');
ok(minBricks < 112, 'attract ball knocks bricks out (' + minBricks + ' left at the lowest)');

/* ---------------- long runs, render every frame ---------------- */
function longRun(preset, extra, frames, aimJitter) {
  fresh(preset, extra);
  let err = null, maxScore = 0;
  try {
    for (let i = 0; i < frames && game.mode === 'play'; i++) {
      bot(aimJitter ? ((i >> 6) % 9) - 4 : 0);
      update(); render();
      maxScore = Math.max(maxScore, game.score);
    }
  } catch (e) { err = e; }
  ok(!err, preset + ' long run without exceptions' + (err ? ': ' + err.stack : ''));
  return maxScore;
}
{
  const s1 = longRun('original', null, 60000, true);
  ok(s1 > 100, 'Original bot run scores (' + s1 + ')');
  ok(s1 <= 896, 'never above 896 at Original');
  const s2 = longRun('kid', null, 20000, true); ok(s2 > 50, 'Kid bot run scores (' + s2 + ')');
  ok(game.mode === 'play', 'Kid run never ends');
  longRun('easy', null, 20000, true);
  longRun('normal', null, 20000, true);
  const s3 = longRun('original', { endless: 1, inv: 1, speed: 125 }, 30000, true); ok(s3 > 100, 'endless invulnerable fast run (' + s3 + ')');
  // random flailing player
  fresh('original', { serve: 'auto' }); let err = null;
  try { for (let i = 0; i < 30000; i++) { input.gx = (Math.sin(i / 37) * 140 + 114); if (i % 97 === 0) input.serve = true; update(); render(); if (game.mode !== 'play') { G.startGame(); } } } catch (e) { err = e; }
  ok(!err, 'random play with restarts' + (err ? ': ' + err.stack : ''));
}

console.log(passed + ' passed, ' + failed + ' failed');
if (failed) { console.log('TESTS FAILED'); process.exit(1); }
console.log('all tests passed');
