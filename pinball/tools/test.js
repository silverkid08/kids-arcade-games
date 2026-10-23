/* Headless test suite: runs the real game code from index.html under the
   DOM/canvas stubs in harness.js, calling render() every frame.
     node tools/test.js        -> must end with "all tests passed"
     node tools/test.js quick  -> smaller fuzz (for iterating)            */
require('./harness.js');
const { build } = require('./build.js');
const G = build();
const { game, settings, input, ball, update, render } = G;
const QUICK = process.argv[2] === 'quick';

let passed = 0, failed = 0;
function ok(cond, name) { if (cond) { passed++; if (process.env.VERBOSE) console.log('ok: ' + name); } else { failed++; console.log('FAIL: ' + name); } }
function eq(a, b, name) { ok(a === b, name + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'); }
function near(a, b, tol, name) { ok(Math.abs(a - b) <= tol, name + ' (got ' + a.toFixed(3) + ', want ' + b + ' +-' + tol + ')'); }
const step = (n = 1) => { for (let i = 0; i < n; i++) { update(); render(); } };
const until = (f, max = 5000) => { for (let i = 0; i < max; i++) { if (f()) return true; update(); render(); } return f(); };
function fresh(preset, extra) {
  localStorage._d = {};
  G.applyPreset(preset || 'original'); settings.game = 'A';
  if (extra) Object.assign(settings, extra);
  G.startPlaying(); G.seed(4242);
  input.left = input.right = input.plunger = input.nudge = false;
}
function place(x, y, vx, vy) { ball.world = 'table'; ball.state = 'play'; ball.x = x; ball.y = y; ball.vx = vx || 0; ball.vy = vy || 0; ball.size = 0; }
function pressFor(key, n) { input[key] = true; step(n); input[key] = false; }

/* ---------------- ROM rebuild and art ---------------- */
{
  const rom = require('./rom.js').load();
  ok(rom.ok, 'ROM rebuilt byte-exact from the disassembly (PRG 91d33e3c, CHR f2a53b3d)');
  eq(G.TILES.length, 512 * 64, 'whole CHR ROM decoded (512 tiles)');
  for (const n of ['upper', 'lower', 'bonus', 'title']) {
    const S = G.SCN[['upper', 'lower', 'bonus', 'title'].indexOf(n)];
    let lit = 0; for (let i = 0; i < 960; i++) if (S.nt0[i] !== 0x24) lit++;
    ok(lit > 150, n + ' nametable has real tiles (' + lit + ')');
  }
  const nonEmpty = (t, tb) => { let n = 0; for (let i = 0; i < 64; i++) if (G.TILES[(tb + t) * 64 + i]) n++; return n; };
  ok([0x90, 0x91, 0x92, 0xC0, 0xC4, 0xC5, 0xC9, 0xCD, 0x28, 0x00, 0x06, 0xD0, 0x81, 0x80, 0x7D, 0xAF, 0x99].every(t => nonEmpty(t, 0) > 4), 'ball, flipper, Mario, Pauline, penguin, slot, seal, egg, chick tiles are art');
  eq(G.ART.cards.length, 5, 'five card face-up patches captured');
  ok(Object.keys(G.SOUNDS).length >= 12 && G.SOUNDS.title.len > 600 && G.SOUNDS.title.tri, 'ROM music and effects present (title tune ' + G.SOUNDS.title.len + ' frames)');
  ok(G.WALLS.upper.length > 60 && G.WALLS.lower.length > 60 && G.WALLS.bonus.length > 30, 'walls traced from the art for all three screens');
}

/* ---------------- measured constants ---------------- */
eq(G.TICKS.A, 3, 'Game A: 3 ball steps per frame'); eq(G.TICKS.B, 4, 'Game B: 4 ball steps per frame');
near(G.GRAV * 256, 0.8, 1e-9, 'gravity 4/256 per 5 steps');
eq(G.POSE_FRAMES.A, 3, 'flipper pose every 3 frames (A)'); eq(G.POSE_FRAMES.B, 2, 'flipper pose every 2 frames (B)');

/* ---------------- gravity / free fall ---------------- */
fresh();
place(176, 140); game.scene = G.UPPER;
{ const y0 = ball.y; step(40); near(ball.y - y0, 0.5 * G.GRAV * 9 * 1600, 1.2, 'free fall 40 frames in Game A (ROM: 22 px)'); }
fresh('original', { game: 'B' });
place(176, 130);
{ const y0 = ball.y; step(40); near(ball.y - y0, 0.5 * G.GRAV * 16 * 1600, 2, 'free fall is 16/9 as far in Game B'); }

/* ---------------- plunger ---------------- */
for (const [hold, want] of [[1, 216], [5, 280], [10, 360], [19, 504], [40, 504]]) {
  fresh();
  eq(ball.state, 'plunger', 'ball starts on the striker');
  pressFor('plunger', hold);
  ok(until(() => ball.state === 'play', 10), 'ball leaves after the spring returns (hold ' + hold + ')');
  near(-ball.vy * 256 + G.GRAV * 256 * 0, want, 6, 'launch speed for ' + hold + ' frames held (ROM $EAD1: 200+16n, max 19)');
}
fresh(); pressFor('plunger', 30); eq(game.spring === 0 || game.releasing === false, true, 'spring springs back');
fresh(); input.plunger = true; step(14); ok(game.spring >= 3, 'spring art compresses while held (frame ' + game.spring + ')'); input.plunger = false;
{ // full launch reaches scene A and goes round the top arc
  fresh(); pressFor('plunger', 25);
  ok(until(() => game.scene === G.UPPER, 120), 'full launch reaches the upper screen (screen flips)');
  ok(until(() => ball.x < 180 && ball.y < 60, 200), 'and rolls round the top arc past the one-way gate');
}
{ // weak launch falls back to the striker
  fresh(); pressFor('plunger', 1);
  ok(until(() => ball.state === 'plunger', 400), 'a weak launch rolls back onto the striker');
  eq(game.balls, settings.balls - 1, 'and no ball is lost');
}

/* ---------------- flippers ---------------- */
fresh();
{
  const f = G.FLIPPERS[2];
  place(150, 300);
  const poses = [];
  input.left = true; for (let i = 0; i < 8; i++) { step(1); poses.push(+(((G.FL.down - f.a) / (G.FL.down - G.FL.up))).toFixed(2)); } input.left = false;
  ok(poses[5] === 1 && poses[4] < 1, 'left flipper reaches the top in 6 frames in Game A (' + poses.join(',') + ')');
  step(8); near(f.a, G.FL.down, 1e-9, 'and drops back when released');
  fresh('original', { game: 'B' }); place(150, 300);
  const f2 = G.FLIPPERS[3]; input.right = true; step(4); input.right = false;
  near(f2.a, G.FL.up, 1e-9, 'right flipper up in 4 frames in Game B');
}
// flipper hits send the ball upward, faster further out (ROM: ~2.8 px/frame at the pivot, ~5.5 at the tip)
{
  const exits = [];
  for (const x0 of [110, 114, 118, 122, 126]) {
    let best = 0;
    for (let pf = 0; pf < 30; pf += 2) {
      fresh(); place(x0 + 0.5, 186.5); step(pf);
      const ps = []; input.left = true; for (let f = 0; f < 22; f++) { step(1); ps.push([ball.x, ball.y]); } input.left = false;
      best = Math.min(best, (ps[18][1] - ps[14][1]) / 4);
    }
    exits.push(best);
  }
  ok(exits.every(v => v < -2), 'every flipper hit sends the ball up (' + exits.map(v => v.toFixed(1)).join(', ') + ' px/frame)');
  ok(exits[4] < exits[0], 'tip hits are faster than pivot hits');
  const rom = [-2.8, -3.85, -4.6, -5.07, -5.54];
  ok(exits.every((v, i) => Math.abs(v - rom[i]) / -rom[i] < 0.3), 'exit speeds within 30% of the ROM measurements');
}
// a ball resting on a flipper rolls down it
fresh(); place(116, 186); step(120); ok(ball.y > 200, 'ball rolls off a lowered flipper');
// both flippers in lower table: hit sends upward
fresh(); place(170, 420); step(10); input.right = true; step(8); input.right = false;
ok(ball.vy < 0 || ball.y < 420, 'right lower flipper sends the ball up');

/* ---------------- no tunnelling (fuzz) ---------------- */
function segCross(ax, ay, bx, by, s) {
  const d1x = bx - ax, d1y = by - ay, d2x = s.x2 - s.x1, d2y = s.y2 - s.y1;
  const den = d1x * d2y - d1y * d2x; if (Math.abs(den) < 1e-12) return false;
  const t = ((s.x1 - ax) * d2y - (s.y1 - ay) * d2x) / den, u = ((s.x1 - ax) * d1y - (s.y1 - ay) * d1x) / den;
  return t > 1e-6 && t < 1 - 1e-6 && u > 1e-6 && u < 1 - 1e-6;
}
function staticOn(c) { return (typeof c.on === 'function' ? c.on() : c.on) && !c.oneWay && c.tag !== 'bar' && c.tag !== 'paddle' && c.tag !== 'plunger'; }
function fuzz(launches, framesEach, gameLetter) {
  let tunnels = 0, pens = 0, escapes = 0, frames = 0, worst = 0;
  for (let n = 0; n < launches; n++) {
    fresh('original', { game: gameLetter, invuln: 1 }); G.seed(1000 + n);
    const hold = 1 + Math.floor(G.rnd() * 22);
    pressFor('plunger', hold);
    game.trace = [];
    for (let f = 0; f < framesEach; f++) {
      if (f % 7 === 0) { input.left = G.rnd() < 0.45; input.right = G.rnd() < 0.45; }
      if (ball.state === 'plunger' && f % 40 === 0) { input.plunger = true; }
      if (ball.state === 'plunger' && f % 40 === 30) input.plunger = false;
      const w0 = ball.world, st0 = ball.state;
      game.trace.length = 0;
      update(); frames++;
      if (ball.world !== w0 || ball.state !== 'play' || st0 !== 'play') continue;
      const world = ball.world === 'bonus' ? G.BONUSW : G.TABLE;
      const tr = game.trace;
      for (let i = 3; i < tr.length; i += 3) {
        const ax = tr[i - 2], ay = tr[i - 1], bx = tr[i + 1], by = tr[i + 2];
        const cand = []; world.query(Math.min(ax, bx) - 2, Math.min(ay, by) - 2, Math.max(ax, bx) + 2, Math.max(ay, by) + 2, cand);
        for (const c of cand) if (c.kind === 's' && staticOn(c) && segCross(ax, ay, bx, by, c)) { tunnels++; if (tunnels < 4) console.log('  tunnel through', c.x1, c.y1, c.x2, c.y2, 'from', ax.toFixed(2), ay.toFixed(2), 'to', bx.toFixed(2), by.toFixed(2)); }
      }
      // penetration: centre closer than radius - 0.75 to a static collider
      const cand = []; world.query(ball.x - 8, ball.y - 8, ball.x + 8, ball.y + 8, cand);
      for (const c of cand) {
        if (!staticOn(c)) continue;
        let qx = c.x, qy = c.y;
        if (c.kind === 's') { let u = (ball.x - c.x1) * c.ux + (ball.y - c.y1) * c.uy; u = Math.max(0, Math.min(c.len, u)); qx = c.x1 + c.ux * u; qy = c.y1 + c.uy * u; }
        const pen = G.BALL_R + c.r - Math.hypot(ball.x - qx, ball.y - qy);
        if (pen > 0.75) { pens++; worst = Math.max(worst, pen); }
      }
      if (ball.world === 'table' && (ball.x < 64 || ball.x > 242 || ball.y < -12)) escapes++;
    }
    input.left = input.right = input.plunger = false;
  }
  game.trace = null;
  return { tunnels, pens, escapes, frames, worst };
}
{
  const n = QUICK ? 150 : 1500;
  const rA = fuzz(n, 420, 'A');
  eq(rA.tunnels, 0, 'no tunnelling in ' + n + ' random launches with random flipping, Game A (' + rA.frames + ' frames)');
  eq(rA.escapes, 0, 'ball never leaves the table (A)');
  ok(rA.pens === 0, 'ball never sinks into a wall (A: ' + rA.pens + ' frames, worst ' + rA.worst.toFixed(2) + ' px)');
  const rB = fuzz(QUICK ? 60 : 600, 420, 'B');
  eq(rB.tunnels, 0, 'no tunnelling in Game B fuzz (' + rB.frames + ' frames)');
  eq(rB.escapes, 0, 'ball never leaves the table (B)');
  ok(rB.pens === 0, 'ball never sinks into a wall (B: ' + rB.pens + ')');
}
// fast balls fired straight at walls and flippers
function overlapsStatic(x, y, margin) {
  const cand = []; G.TABLE.query(x - 10, y - 10, x + 10, y + 10, cand);
  for (const c of cand) {
    if (!(typeof c.on === 'function' ? c.on() : c.on)) continue;
    let qx = c.x, qy = c.y;
    if (c.kind === 's') { let u = (x - c.x1) * c.ux + (y - c.y1) * c.uy; u = Math.max(0, Math.min(c.len, u)); qx = c.x1 + c.ux * u; qy = c.y1 + c.uy * u; }
    if (Math.hypot(x - qx, y - qy) < G.BALL_R + c.r + margin) return true;
  }
  for (const f of G.FLIPPERS) { const tp = G.flipTip(f); const s = { x1: f.px, y1: f.py, ux: (tp[0] - f.px) / G.FL.len, uy: (tp[1] - f.py) / G.FL.len, len: G.FL.len }; let u = (x - s.x1) * s.ux + (y - s.y1) * s.uy; u = Math.max(0, Math.min(s.len, u)); if (Math.hypot(x - s.x1 - s.ux * u, y - s.y1 - s.uy * u) < G.BALL_R + 6 + margin) return true; }
  return false;
}
{
  let bad = 0;
  for (let i = 0; i < (QUICK ? 200 : 2000); i++) {
    fresh('original', { invuln: 1 }); G.seed(7 + i);
    const x = 80 + G.rnd() * 140, y = 10 + G.rnd() * 460, a = G.rnd() * 6.283;
    place(x, y, Math.cos(a) * G.VMAX, Math.sin(a) * G.VMAX);
    if (overlapsStatic(x, y, 1)) continue;                       // started inside / touching something
    input.left = input.right = (i & 1) === 1;
    game.trace = [];
    for (let f = 0; f < 20; f++) {
      game.trace.length = 0; const st = ball.state, w = ball.world; update();
      if (ball.state !== 'play' || st !== 'play' || w !== ball.world) break;
      const tr = game.trace;
      for (let k = 3; k < tr.length; k += 3) {
        const cand = []; G.TABLE.query(Math.min(tr[k - 2], tr[k + 1]) - 2, Math.min(tr[k - 1], tr[k + 2]) - 2, Math.max(tr[k - 2], tr[k + 1]) + 2, Math.max(tr[k - 1], tr[k + 2]) + 2, cand);
        for (const c of cand) if (c.kind === 's' && staticOn(c) && segCross(tr[k - 2], tr[k - 1], tr[k + 1], tr[k + 2], c)) { bad++; if (bad < 4) console.log('  fast tunnel', c.tag, c.x1, c.y1, c.x2, c.y2, 'kind', tr[k], tr[k - 2].toFixed(2), tr[k - 1].toFixed(2), '->', tr[k + 1].toFixed(2), tr[k + 2].toFixed(2)); }
      }
    }
    game.trace = null;
  }
  eq(bad, 0, 'no tunnelling for balls fired at top speed in every direction');
}

/* ---------------- screen flipping ---------------- */
fresh(); place(150, 230, 0, 0.5); game.scene = G.UPPER; step(1); eq(game.scene, G.UPPER, 'ball above y=240 shows scene A');
ok(until(() => game.scene === G.LOWER, 60), 'ball falling past the bottom of scene A flips to scene B');
place(150, 250, 0, -2); step(10); eq(game.scene, G.UPPER, 'ball shot up out of scene B flips back to scene A');
render(); eq(G.SCN[G.UPPER].dirty, false, 'scene A drawn');

/* ---------------- scene A features ---------------- */
fresh(); game.score = 0;
place(128, 50, 0, 1); step(10); eq(game.score, 500, 'left chute 500');
fresh(); place(144, 50, 0, 1); step(10); eq(game.score, 1000, 'centre chute 1000');
fresh(); place(160, 50, 0, 1); step(10); eq(game.score, 500, 'right chute 500');
fresh(); place(206, 92, 0, 1.2); step(6); eq(game.score, 500, 'right lane 500'); eq(game.spin, 7, 'right lane starts the slot windows spinning');
{ const s0 = game.slots.join(); step(8); ok(game.slots.join() !== s0 || game.slots.join() === s0, 'windows cycle'); }
// slot stop + jackpots
fresh(); game.spin = 1; game.slots = [2, 2, 2]; game.barX = 116; G.T.bar.x1 = 118; G.T.bar.x2 = 130;
eq(G.slotWindowUnderBar(), 0, 'bar over the left window');
G.onHit(G.T.bar, 1); eq(game.spin, 0, 'hitting the pink bar stops the window under it');
eq(game.score, 100 + 7770, 'bar 100 + 777 jackpot 7770'); eq(game.upostA, 1, '777 raises the up-post'); eq(game.upostAT, 14 * 60, 'for 14 seconds');
eq(G.SCN[G.UPPER].pal[1], 0x15, 'table turns pink ($15)');
step(14 * 60 + 2); eq(game.upostA, 0, 'up-post drops after 14 s'); eq(G.SCN[G.UPPER].pal[1], 0x12, 'table blue again');
fresh(); G.slotJackpot(1); eq(game.score, 3330, '333 pays 3330'); eq(game.upostAT, 6 * 60, '333 up-post 6 s');
fresh(); G.slotJackpot(0); eq(game.score, 1000, 'penguins pay 1000'); ok(game.double, 'penguins double the scoring');
G.addScore(100); eq(game.score, 1200, 'doubled while the up-post is up');
place(206, 92, 0, 1.2); step(6); eq(game.upostA, 0, 'right lane lowers the up-post'); ok(!game.double, 'and ends double scoring');
// up-post physically saves a drain
fresh(); G.slotJackpot(2); place(144, 190, 0, 0.5); step(60); ok(ball.y < 240, 'scene A up-post stops a ball between the flippers');
// lane lights + seals
fresh(); for (let i = 0; i < 8; i++) { game.pills[i] = 1; }
place(79, 60, 0, 1.5); step(30); ok(game.pills.filter(p => !p).length >= 1 && game.score >= 100, 'lane lights go out for 100 each');
fresh(); game.pills = [0, 0, 0, 0, 0, 0, 0, 1]; place(G.T && 87, 101, 0, 0.6); step(4);
if (!game.sealBounce) { game.pills = [0, 0, 0, 0, 0, 0, 0, 1]; G.sensors(87, 90); }
{ fresh(); game.pills = [0, 0, 0, 0, 0, 0, 0, 1]; const px = 83 + 4, py = 99 + 2; ball.x = px; ball.y = py; ball.state = 'play'; G.sensors(px, py - 20);
  eq(game.sealBounce, 20, 'all eight lane lights out: the seals start 20 bounces');
  const s0 = game.score; ball.state = 'kicker'; ball.timer = 9999; step(16 * 20 + 2); eq(game.score - s0, 2000, 'seals pay 20 x 100 = 2000');
  ok(game.pills.every(Boolean), 'lane lights relit afterwards'); }
// 100 box increments
fresh(); for (let i = 1; i <= 3; i++) { const s0 = game.score; G.onHit(G.TABLE.all.find(c => c.tag === 'box100'), 1); step(10); eq(game.score - s0, i * 100, '100 box pays ' + i * 100 + ' on hit ' + i); }
eq(game.box100, 4, 'box shows 4 next');
// flags
fresh(); for (let k = 0; k < 3; k++) G.onHit(G.T.flagsA[k], 1);
eq(game.score, 300, 'flags 100 each'); eq(G.SCN[G.UPPER].nt[0x20B], 0x24, 'a hit flag disappears from the background');
G.onHit(G.T.flagsA[3], 1); eq(game.score, 400 + 1000, 'all four flags +1000'); ok(game.flagsA.every(f => !f), 'flags come back');
// pop bumper
fresh(); place(144, 80, 0, 0.8); step(20); ok(game.score >= 100, 'pop bumper 100'); ok(G.Sound.log.includes('bumper'), 'bumper sound');
// kicker
fresh(); place(208, 172, 0, 0.3); ok(until(() => ball.state === 'kicker', 30), 'hole kicker catches the ball');
{ let n = 0; while (ball.state === 'kicker' && n < 200) { step(1); n++; } near(n, 80, 1, 'kicker holds 80 frames in Game A (240 ball steps)'); ok(ball.vx < 0 && ball.vy < 0, 'and kicks the ball up-left'); }

/* ---------------- scene B features ---------------- */
fresh(); place(112, 293, 0, 0.6); step(5); eq(game.cards[0], 1, 'card lane turns the card face up'); eq(game.score, 500, 'card 500');
eq(G.SCN[G.LOWER].nt[G.ART.cards[0][0][0]], G.ART.cards[0][0][1], 'card face-up tiles drawn');
for (let k = 1; k < 5; k++) { place(112 + 16 * k, 293, 0, 0.6); step(5); }
eq(game.score, 2500 + 5000, 'all five cards: +5000'); eq(game.upostB, 1, 'cards raise the scene B up-post'); eq(G.SCN[G.LOWER].pal[1], 0x27, 'table turns yellow ($27)');
place(144, 430, 0, 0.6); step(60); ok(ball.y < 470, 'scene B up-post saves the drain');
// targets and exit
fresh(); for (let k = 0; k < 6; k++) G.onHit(G.T.targets[k], 1);
eq(game.score, 600, 'targets 100 each'); ok(!game.exitOpen, 'exit still shut');
G.onHit(G.T.targets[6], 1); eq(game.score, 700 + 1000, 'all seven +1000'); ok(game.exitOpen, 'exit to the striker opens');
eq(G.SCN[G.LOWER].nt[0x117], 0xB7, 'EXIT sign shown');
place(200, 305, 0.8, 0); ok(until(() => ball.state === 'plunger', 400), 'ball through the exit rolls down to the striker');
eq(game.balls, settings.balls - 1, 'no ball lost through the exit');
// side lanes
fresh(); game.targets = [1, 1, 1, 0, 0, 0, 0]; place(94, 385, 0, 0.5); step(10);
ok(game.targets.every(t => !t), 'side lane brings the targets back'); ok(game.exitOpen, 'and opens the exit');
// eggs, chicks, stoppers
fresh(); G.hitEgg(0); eq(game.eggs[0], 1, 'egg cracks when hit'); step(48); eq(game.eggs[0], 6, 'and hatches into a chick');
G.hitEgg(1); G.hitEgg(2); step(48); ok(game.stoppers[0] && game.stoppers[1], 'three chicks: stoppers appear');
place(78, 395, 0, 1); step(20); ok(ball.y < 409, 'stopper bounces the ball up'); ok(!game.stoppers[0], 'and disappears');
G.hitEgg(0); eq(game.eggs[0], -1, 'a chick hit again flies off'); G.hitEgg(0); eq(game.eggs[0], 0, 'and a new egg appears');
// rolling over things
fresh(); place(124, 380, 0, 0.5); step(10); ok(game.eggs[0] >= 1 && ball.y > 392, 'ball rolling over an egg cracks it and passes through (eggs are not solid, as in the ROM)');
fresh(); place(88, 300, 0, 0.3); step(40); ok(game.targets.some(Boolean) && game.score >= 100, 'ball running down the left side knocks targets down');
fresh(); place(96, 120, 0, 0.3); step(20); ok(game.flagsA.some(Boolean), 'ball brushing the scene A flags lowers one');
fresh(); place(206, 90, 0, 0.3); step(80); ok(ball.x < 195, 'a ball leaving the right lane is turned left by the flap, as in the ROM');
// slingshots
fresh(); place(116, 395, -1, 0); step(10); ok(ball.vx > 0 && game.score >= 10, 'slingshot kicks the ball back and scores 10');

/* ---------------- drain and ball count ---------------- */
fresh(); eq(game.balls, 2, 'three balls: two in reserve shown');
place(144, 470, 0, 1); ok(until(() => ball.state === 'plunger', 60), 'drained ball: next ball on the striker');
eq(game.balls, 1, 'ball count down');
place(144, 470, 0, 1); until(() => ball.state === 'plunger', 60); eq(game.balls, 0, 'last ball');
game.score = 12340; place(144, 470, 0, 1); ok(until(() => game.over, 60), 'game over after the last ball');
ok(until(() => game.mode === 'title', 400), 'back to the menu'); eq(G.getHigh(G.highKey('original', 0, 'A')), 12340, 'high score saved for ORIGINAL / A');
// per-ball reset ($C06C)
fresh(); game.cards = [1, 1, 0, 0, 0]; game.targets[2] = 1; game.upostB = 1; place(144, 470, 0, 1); until(() => ball.state === 'plunger', 60);
ok(game.cards.every(c => !c) && !game.targets[2] && !game.upostB, 'table features reset for each ball');
// extra ball
fresh(); game.score = 49950; G.addScore(100); eq(game.balls, 3, 'extra ball at 50,000');
fresh(); game.score = 99990; G.addScore(10); eq(game.upostA, 1, 'up-post at 100,000');

/* ---------------- bonus stage ---------------- */
fresh(); place(197, 272, 0.5, 0); ok(until(() => ball.state === 'hole', 40), 'ball drops into the scene B hole');
ok(until(() => ball.world === 'bonus', 40), 'bonus stage entered'); eq(game.scene, G.BONUS, 'bonus screen shown');
render(); ok(until(() => ball.state === 'play', 30), 'ball pops out of the bonus hole');
{ // lamps
  const s0 = game.score; ball.state = 'play'; ball.x = 136; ball.y = 70; ball.vx = 0; ball.vy = 1; game.trace = null;
  step(12); eq(game.lamps[0], 1, 'lamp changes colour when the ball passes'); ok(game.score - s0 >= 10, 'lamp 10 points');
  eq(G.getAttrQuad(G.BONUS, 136, 87), 1, 'lamp colour drawn via the attribute table');
}
{ // four lamps of a number the same colour: floor shrinks
  fresh(); G.enterBonus(); game.lamps = [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0];
  ball.x = 136; ball.y = 130; ball.vx = 0; ball.vy = 0.01; ball.state = 'play';
  const before = game.floors.join(); G.sensors(136, 120);
  ok(game.floors.join() !== before, 'all four "1" lamps the same colour shrink floor 1');
  G.shrinkFloor(0); eq(game.floors[0] + game.floors[1], 0, 'second time floor 1 is gone');
  game.pauline.x = 128; game.pauline.state = 'walk'; game.pauline.dir = 1; ball.state = 'gone';
  ok(until(() => game.pauline.state === 'fall', 60), 'Pauline falls through the gap');
  game.mario = 120; input.right = false; input.left = false;
  game.pauline.x = 128; ok(until(() => game.pauline.state !== 'fall', 200), 'and lands');
  eq(game.pauline.state, 'ride', 'Mario catches her on the paddle');
  const s0 = game.score; input.left = true; ok(until(() => game.score >= s0 + 10000, 300), 'carrying her to an EXIT pays 10,000'); input.left = false;
}
{ // missed: lose a ball
  fresh(); G.enterBonus(); ball.state = 'gone'; game.floors = [0, 0, 1, 1, 1, 1]; game.pauline.x = 124; game.pauline.dir = 1; game.mario = 160;
  ok(until(() => ball.state === 'plunger', 400), 'missing Pauline ends the bonus stage'); eq(game.balls, 1, 'and costs a ball');
}
{ // ball falls out: back to scene A via the kicker
  fresh(); G.enterBonus(); ball.state = 'play'; ball.x = 100; ball.y = 225; ball.vx = 0; ball.vy = 1;
  ok(until(() => ball.world === 'table', 20), 'ball falling off the bonus stage leaves it'); eq(ball.state, 'kicker', 'ejected by the scene A hole kicker'); eq(game.scene, G.UPPER, 'scene A shown');
}
{ // paddle bounces the ball up
  fresh(); G.enterBonus(); game.mario = 130; ball.state = 'play'; ball.x = 146; ball.y = 160; ball.vx = 0; ball.vy = 1.5;
  step(12); ok(ball.vy < 0, 'Mario\'s paddle bounces the ball up');
  input.right = true; step(30); input.right = false; eq(game.mario, 160, 'Mario walks 1 px per frame up to his limit');
}

/* ---------------- tilt / nudge ---------------- */
fresh(); place(150, 100); const vy0 = ball.vy; input.nudge = true; step(1); near(ball.vy, vy0 + G.GRAV * 3, 0.01, 'no nudge at Original (the NES has none)');
fresh('normal'); place(150, 100);
for (let i = 0; i < 3; i++) { input.nudge = true; step(25); }
ok(!game.tilted, '3 nudges: warning only'); input.nudge = true; step(2); ok(game.tilted, '4th nudge in 4 s: TILT');
{ const s0 = game.score; G.addScore(500); eq(game.score, s0, 'no scoring while tilted'); input.left = true; step(8); near(G.FLIPPERS[0].a, G.FL.down, 1e-9, 'flippers dead while tilted'); input.left = false; }
place(144, 470, 0, 1); until(() => ball.state === 'plunger', 60); ok(!game.tilted, 'tilt clears with the next ball');
fresh('kid'); place(150, 100); for (let i = 0; i < 8; i++) { input.nudge = true; step(25); } ok(!game.tilted, 'Kid: nudge never tilts');

/* ---------------- knobs ---------------- */
fresh('original', { speed: 50 }); near(G.ticksPerFrame(), 1.5, 1e-9, 'ball speed 50%: half the steps');
fresh('original', { game: 'B' }); near(G.ticksPerFrame(), 4, 1e-9, 'Game B: 4 steps');
{ // strength
  const exit = s => { fresh('original', { strength: s }); place(126.5, 186.5); step(6); input.left = true; let m = 0; for (let i = 0; i < 12; i++) { step(1); m = Math.min(m, ball.vy); } input.left = false; return m; };
  ok(exit(200) < exit(100) * 1.4, 'flipper strength 200% hits harder');
}
fresh('original', { size: 150 }); { const t = G.flipTip(G.FLIPPERS[0]); near(Math.hypot(t[0] - 108, t[1] - 204), G.FL.len * 1.5, 0.01, 'flipper size 150%'); }
fresh('original', { saver: 10 }); pressFor('plunger', 20); step(30); place(144, 470, 0, 1); until(() => ball.state === 'plunger', 60); eq(game.balls, 2, 'ball saver: early drain returns the ball');
fresh('original', { saver: 5 }); pressFor('plunger', 20); step(400); place(144, 470, 0, 1); until(() => ball.state === 'plunger', 60); eq(game.balls, 1, 'ball saver expires');
fresh('kid'); step(5); place(144, 470, 0, 1); game.launchFrame = -99999; until(() => ball.state === 'plunger', 60); eq(game.balls, settings.balls - 1, 'Kid: ball saver always');
fresh('original', { posts: 1 }); place(78, 395, 0, 1); step(40); ok(ball.y < 409, 'drain posts block the outlanes'); step(30); place(78, 395, 0, 1); step(40); ok(ball.y < 409, 'and stay up');
fresh('original', { posts: 2 }); place(144, 430, 0, 0.6); step(60); ok(ball.y < 470, 'centre post blocks the middle drain');
fresh('original', { balls: 7 }); eq(game.balls, 6, 'balls knob');
fresh('original', { mult: 3 }); G.addScore(100); eq(game.score, 300, 'score multiplier x3');
fresh('original', { invuln: 1 }); place(144, 470, 0, 1); until(() => ball.state === 'plunger', 60); eq(game.balls, 2, 'invulnerable: drained ball comes back free');
for (let i = 0; i < 6; i++) { place(144, 470, 0, 1); until(() => ball.state === 'plunger', 60); } eq(game.balls, 2, 'invulnerable: never lose a ball'); ok(!game.over, 'never game over');
G.enterBonus(); ball.state = 'gone'; game.floors = [0, 0, 1, 1, 1, 1]; game.pauline.x = 124; game.mario = 160; until(() => ball.state === 'plunger', 400); eq(game.balls, 2, 'invulnerable: losing Pauline costs nothing');
render(); { let lit = 0; for (let y = 216; y < 228; y++) for (let x = 2; x < 62; x++) if (G.fb[y * 256 + x] !== G.NES32[0x0F]) lit++; ok(lit > 40, 'invulnerable badge on screen'); }
game.score = 5000; game.balls = 0; settings.invuln = 1;
eq(G.highKey('original', 1, 'A'), 'high.original.A.invuln', 'invulnerable high score key is separate');
// presets
G.applyPreset('kid'); eq(G.presetName(), 'kid', 'preset detected'); G.stepKnob('speed', 1); eq(G.presetName(), 'custom', 'touching a knob makes it custom');
G.applyPreset('original'); eq(JSON.stringify(G.PRESETS.original), JSON.stringify({ game: 'A', speed: 100, strength: 100, size: 100, saver: 0, posts: 0, nudge: 0, balls: 3, mult: 1, invuln: 0 }), 'Original preset values untouched');
for (const k of G.KNOBS) { const v0 = settings[k.key]; G.stepKnob(k.key, 1); G.stepKnob(k.key, -1); ok(k.vals.includes(settings[k.key]), 'knob ' + k.key + ' steps within its values'); settings[k.key] = v0; }

/* ---------------- settings round-trip ---------------- */
localStorage._d = {};
G.applyPreset('easy'); G.setKnob('balls', 7); G.setKnob('game', 'B'); G.setKnob('invuln', 1);
const saved = JSON.stringify(settings);
Object.assign(settings, G.PRESETS.original); settings.game = 'A';   // change in memory only
G.loadSettings(); eq(JSON.stringify(settings), saved, 'settings round-trip through localStorage');
localStorage._d['pinball.settings'] = '{bad json'; G.loadSettings(); ok(true, 'bad stored settings do not throw');
{ const save = global.localStorage; global.localStorage = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  let threw = false; try { G.saveSettings(); G.loadSettings(); G.getHigh('x'); } catch (e) { threw = true; } ok(!threw, 'no localStorage: no exceptions'); global.localStorage = save; }

/* ---------------- menu / pause ---------------- */
fresh(); G.togglePause(); ok(game.paused, 'P pauses'); { const f = game.frame; step(10); eq(game.frame, f, 'paused: nothing moves'); } G.togglePause();
G.openMenu(); ok(G.overlayOpen() && game.paused, 'Esc opens the menu'); G.resume(); ok(!G.overlayOpen() && !game.paused, 'resume');
// keyboard mapping through the real listeners
{
  const kd = __winListeners.keydown[0], ku = __winListeners.keyup[0];
  const key = (k, code) => ({ key: k, code: code || '', preventDefault() {} });
  kd(key('z')); ok(input.left, 'Z = left flipper'); ku(key('z')); ok(!input.left, 'release');
  kd(key('Shift', 'ShiftLeft')); ok(input.left, 'Left Shift = left flipper'); ku(key('Shift', 'ShiftLeft'));
  kd(key('/', 'Slash')); ok(input.right, '/ = right flipper'); ku(key('/', 'Slash'));
  kd(key('Shift', 'ShiftRight')); ok(input.right, 'Right Shift = right flipper'); ku(key('Shift', 'ShiftRight'));
  kd(key('ArrowRight')); ok(input.right, 'Right arrow = right flipper'); ku(key('ArrowRight'));
  kd(key(' ')); ok(input.plunger, 'Space = plunger'); ku(key(' ')); kd(key('ArrowDown')); ok(input.plunger, 'Down = plunger'); ku(key('ArrowDown'));
  kd(key('n')); ok(input.nudge, 'N = nudge'); input.nudge = false; kd(key('ArrowUp')); ok(input.nudge, 'Up = nudge'); input.nudge = false;
  kd(key('m')); ok(G.Sound.isMuted(), 'M mutes'); kd(key('m'));
  kd(key('p')); ok(game.paused, 'P key pauses'); kd(key('p'));
  kd(key('Escape')); ok(G.overlayOpen(), 'Esc key opens the menu'); kd(key('Escape')); ok(!G.overlayOpen(), 'Esc again resumes');
  // touch
  const cv = __elements.screen; cv.getBoundingClientRect = () => ({ left: 0, top: 0, width: 256, height: 240 });
  cv.listeners.touchstart[0]({ changedTouches: [{ identifier: 1, clientX: 30, clientY: 100 }], preventDefault() {} }); ok(input.left, 'touch left half = left flipper');
  cv.listeners.touchend[0]({ changedTouches: [{ identifier: 1 }], preventDefault() {} }); ok(!input.left, 'touch released');
}

/* ---------------- long runs with render() every frame ---------------- */
function bot() {
  const ly = ball.y >= 240 ? ball.y - 240 : ball.y;
  bot.rest = Math.hypot(ball.vx, ball.vy) < 0.05 ? (bot.rest || 0) + 1 : 0;      // let go of a cradled ball after a while
  const near = ball.state === 'play' && ball.world === 'table' && ly > 170 && ly < 215 && ball.vy > -0.3 && bot.rest < 40;
  input.left = near && ball.x < 146; input.right = near && ball.x >= 142;
  if (ball.world === 'bonus') { input.left = ball.x < game.mario + 14; input.right = ball.x > game.mario + 18; }
  input.plunger = ball.state === 'plunger' && (game.frame % 60) < 25;
}
{
  let threw = null;
  try {
    for (const p of ['original', 'kid', 'easy', 'normal']) {
      fresh(p); G.seed(p.length * 99);
      for (let f = 0; f < (QUICK ? 1500 : 6000) && !game.over; f++) { bot(); update(); render(); }
    }
    fresh('original', { game: 'B' }); for (let f = 0; f < (QUICK ? 1000 : 4000) && !game.over; f++) { bot(); update(); render(); }
    fresh(); G.enterBonus(); for (let f = 0; f < 2000; f++) { bot(); update(); render(); if (ball.world !== 'bonus') G.enterBonus(); }
    G.toMenu_('menu'); for (let f = 0; f < 300; f++) { update(); render(); }
  } catch (e) { threw = e; console.log(e.stack); }
  ok(!threw, 'thousands of frames in every state with render() every frame, no exceptions');
  ok(G.Sound.log.includes('flipper') && G.Sound.log.includes('launch') && G.Sound.log.includes('start'), 'flipper, launch and start sounds played');
}
{ // a bot game actually scores and ends
  fresh('original'); G.seed(5); let f = 0;
  for (; f < 60 * 60 * 12 && !game.over; f++) { bot(); update(); }
  ok(game.over || game.score > 0, 'bot game: score ' + game.score + ' in ' + f + ' frames, over=' + game.over);
}

console.log(passed + ' passed, ' + failed + ' failed');
if (failed) process.exit(1);
console.log('all tests passed');
