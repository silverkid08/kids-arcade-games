/* Headless tests for the Frogger clone.  Runs the real game (index.html's
   script) under the DOM/canvas stubs in harness.js, with render() every
   frame, and checks the arcade rules, the kid-mode knobs, invulnerable
   mode and the localStorage round trip.
     node tools/test.js        -> must end "all tests passed" */
require('./harness.js');
const { load } = require('./load-game.js');

let failures = 0;
function check(name, cond, extra) {
  if (cond) console.log('  ok   ' + name);
  else { failures++; console.log('  FAIL ' + name + (extra !== undefined ? '  -> ' + extra : '')); }
}

const P = load();
const { game, S } = P;
const el = globalThis.__elements;

function tick(n) { for (let i = 0; i < (n || 1); i++) { P.tick(); P.render(); } }
function play(preset) {
  P.applyPreset(preset || 'original');
  el['play'].click();
  tick(61 + 25);                  // the READY pause and the spawn input lock
}
function hop(dir) {
  const ok = P.press(dir);
  tick(P.HOP_FRAMES + 1);
  return ok;
}
/* put the frog somewhere safe and settled */
function place(x, y) { const f = game.frog; f.x = x; f.y = y; f.hop = null; f.lock = 0; f.grace = 0; f.furthest = Math.min(f.furthest, y); }
/* a river lane object's current screen x */
function firstObjX(lane) { return P.objXs(lane, lane.objs[0])[0]; }

/* ---------- 1. static tables ---------- */
console.log('\n[tables]');
check('ten lanes, five river and five road', P.LANE_DEF.length === 10 && P.LANE_DEF.filter(l => l.y < P.MEDIAN_Y).length === 5);
check('lane rows are 16px apart from 48 to 208', P.LANE_DEF.every((l, i) => l.y === 48 + 16 * i + (i >= 5 ? 16 : 0)));
check('five difficulty tiers of eleven arms', P.LANE_TIERS.length === 5 && P.LANE_TIERS.every(t => t.length === 11));
check('tier 0 road: 2 trucks, 1 racer, 3 purple, 3 dozers, 3 yellow', [6, 7, 8, 9, 10].map(a => P.LANE_TIERS[0][a][2]).join() === '2,1,3,3,3');
check('tier 0 river: 3 logs(4), 4 turtle pairs, 2 logs(6), 3 logs(3), 4 turtle triples',
  [0, 1, 2, 3, 4].map(a => P.LANE_TIERS[0][a][1] + 'x' + P.LANE_TIERS[0][a][2]).join() === '8x3,4x4,12x2,6x3,6x4');
check('speed ring is 10 frames of 11 bytes', P.SPEED_RING.length === 10 && P.SPEED_RING.every(r => r.length === 11));
check('median arm never moves', P.SPEED_RING.every(r => r[5] === 0));
check('ring slot period is 22 frames', P.RING_PERIOD === 22 && P.RING_SLOTS.length === 11);
check('100 sprite cells of 256 pixels', P.SPRITE_ROWS.length === 100 && P.SPRITE_ROWS.every(s => s.length === 256));
check('background decodes to 224 x 216', P.unrle(P.BG_RLE).length === 224 * P.BG_H && P.BG_H === 216);
check('font has digits, letters and dash', '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-'.split('').every(ch => P.FONT[ch] && P.FONT[ch].length === 16));
check('frog sprite is green and yellow', /3/.test(P.SPRITE_ROWS[2]) && /5/.test(P.SPRITE_ROWS[2]));
check('hop is 8 frames of 2px', P.HOP_FRAMES * P.HOP_STEP === 16);
check('timer is 60 ticks of 32 frames', P.TIMER_STEPS === 60 && P.TIMER_PACE === 32);

/* ---------- 2. boot and menu ---------- */
console.log('\n[boot]');
check('booted into the menu', game.state === 'menu');
check('lanes built for the menu backdrop', game.lanes.length === 10);
check('raf registered', typeof globalThis.__raf === 'function');
tick(200);
check('menu backdrop animates without errors', game.frame >= 200);

/* ---------- 3. lane speeds at Original ---------- */
console.log('\n[lane speeds, Original]');
P.applyPreset('original');
game.lanes = P.buildLanes(0);
const before = game.lanes.map(l => l.scroll);
const moved = game.lanes.map(() => 0);
for (let i = 0; i < 2200; i++) { P.tick(); game.lanes.forEach((l, k) => { moved[k] += Math.abs(l.dx); }); }
const avg = moved.map(m => m / 2200);
/* expected px/frame straight from the ROM ring: average over the 11-slot cycle */
function ringAvg(arm) {
  let s = 0;
  for (const slot of P.RING_SLOTS) { const c = P.SPEED_RING[slot][arm]; s += c === 0 ? 0 : (c & 0x10) ? 1 / (c & 15) : (c & 15); }
  return s / P.RING_SLOTS.length;
}
check('racing car is the fastest lane (~1.47 px/frame)', Math.abs(avg[6] - ringAvg(7)) < 0.03 && avg[6] > Math.max(...avg.filter((v, i) => i !== 6)), avg[6].toFixed(3));
check('yellow cars are the slowest road lane (~0.37 px/frame)', Math.abs(avg[9] - ringAvg(10)) < 0.03 && avg[9] < Math.min(...avg.slice(5, 9)), avg[9].toFixed(3));
check('trucks match the ring (~0.61 px/frame)', Math.abs(avg[5] - ringAvg(6)) < 0.03, avg[5].toFixed(3));
check('medium logs match the ring (~0.42 px/frame)', Math.abs(avg[0] - ringAvg(0)) < 0.03, avg[0].toFixed(3));
check('every lane matches its ROM ring average', game.lanes.every((l, i) => Math.abs(avg[i] - ringAvg(l.arm)) < 0.03), avg.map(v => v.toFixed(2)).join());
check('all lane shifts are whole pixels', game.lanes.every(l => Number.isInteger(l.dx)));
check('directions: river R L R R L, road L R L R L', game.lanes.map(l => l.dir > 0 ? 'R' : 'L').join('') === 'RLRRLLRLRL');
const t0 = P.LANE_TIERS[0];
check('tier 0 object pitch = (gap+width) cells', game.lanes.every(l => l.pitch === (t0[l.arm][0] + t0[l.arm][1]) * 8));
check('objects spaced one pitch apart on the ring', game.lanes.every(l => l.objs.every((o, k) => o.pos === k * l.pitch)));

/* traffic speed knob halves the road, leaves the river alone */
P.setKnob('traffic', 50);
game.lanes = P.buildLanes(0);
const m2 = game.lanes.map(() => 0);
for (let i = 0; i < 2200; i++) { P.tick(); game.lanes.forEach((l, k) => { m2[k] += Math.abs(l.dx); }); }
check('traffic 50% halves the racing car', Math.abs(m2[6] / 2200 - avg[6] / 2) < 0.03, (m2[6] / 2200).toFixed(3));
check('traffic knob leaves the river alone', Math.abs(m2[0] / 2200 - avg[0]) < 0.03);
P.setKnob('river', 50);
game.lanes = P.buildLanes(0);
const m3 = game.lanes.map(() => 0);
for (let i = 0; i < 2200; i++) { P.tick(); game.lanes.forEach((l, k) => { m3[k] += Math.abs(l.dx); }); }
check('river 50% halves the logs', Math.abs(m3[0] / 2200 - avg[0] / 2) < 0.03, (m3[0] / 2200).toFixed(3));
check('touching a knob makes the preset Custom', S.preset === 'custom');
P.applyPreset('original');
check('Original preset restores arcade values', S.traffic === 100 && S.river === 100 && S.timer === 32 && S.lives === 3 && S.extra === 20000 && S.diving === true && S.vehicles === 100);

/* vehicles knob */
P.setKnob('vehicles', 50);
game.lanes = P.buildLanes(0);
check('vehicles 50% halves the car counts (3 -> 2, 2 -> 1, 1 -> 1)', game.lanes[7].objs.length === 2 && game.lanes[5].objs.length === 1 && game.lanes[6].objs.length === 1, game.lanes.slice(5).map(l => l.objs.length).join());
check('vehicles knob leaves the river alone', game.lanes[0].objs.length === 3 && game.lanes[4].objs.length === 4);
P.applyPreset('original');

/* ---------- 4. a game: hopping, scoring, home ---------- */
console.log('\n[hopping and scoring]');
play('original');
check('game starts in play with 3 lives', game.state === 'play' && game.lives === 3);
check('frog starts centred on the sidewalk', game.frog.x === 104 && game.frog.y === 224);
check('timer starts at 60 ticks', game.timer.steps === 60);
game.lanes.forEach(l => { if (l.isRoad) l.objs = []; });     // clear the road for a controlled crossing
const s0 = game.score;
hop('up');
check('frog hopped exactly one cell', game.frog.y === 208 && game.frog.x === 104 && !game.frog.hop);
check('forward hop scores 10', game.score - s0 === 10, game.score - s0);
hop('down');
check('backward hop scores nothing', game.score - s0 === 10);
hop('up');
check('re-hopping the same row scores nothing', game.score - s0 === 10);
hop('left');
check('left hop moves 16px', game.frog.x === 88);
hop('right');
check('right hop moves back', game.frog.x === 104);
for (let i = 0; i < 5; i++) hop('up');
check('frog on the median', game.frog.y === P.MEDIAN_Y);
check('five road rows scored 50', game.score - s0 === 50, game.score - s0);
check('median hop pays nothing (ROM)', game.score - s0 === 50);
check('cannot hop down from the start row', (place(104, 224), !P.canHop('down')));
check('cannot hop left from the left column', (place(8, 224), !P.canHop('left')));
check('cannot hop right from the right column', (place(200, 224), !P.canHop('right')));
check('can hop up from anywhere on the sidewalk', (place(200, 224), P.canHop('up')));

/* press-and-hold gives one hop: a second press mid-hop is refused */
place(104, 224);
P.press('up');
check('second press during a hop is refused', !P.press('up'));
tick(P.HOP_FRAMES + 1);

/* timer */
play('original');
game.lanes.forEach(l => { if (l.isRoad) l.objs = []; });
tick(32 * 5);
check('timer loses a tick every 32 frames', game.timer.steps === 55, game.timer.steps);
tick(32 * 55);
check('timer expiry kills the frog', !!game.frog.dying && game.frog.dying.why === 'timeout', JSON.stringify(game.frog.dying));
tick(P.DEATH_DWELL * 5 + 2);
check('a life is lost and the frog respawns', game.lives === 2 && game.state === 'play' && game.frog.y === 224, game.lives + ' ' + game.state);
check('timer resets to 60 on the new frog', game.timer.steps === 60);

/* home arrival with time bonus: park the frog under a bay, clear the way */
play('original');
game.lanes.forEach(l => { l.objs = []; });                   // empty river: use a bridge object
const lane0 = game.lanes[0];
lane0.objs = [{ pos: 0, w: 224, kind: 'log', dive: null, croc: false }];
lane0.scroll = 16;                                           // log covers the whole screen
game.timer.steps = 40; game.timer.pace = 32;
place(104, 48); game.frog.furthest = 48;
const sHome = game.score;
hop('up');
check('arrival in bay 3 registers home', game.homes[2] === true && game.state === 'home', game.state);
check('home pays 50 + 10 per tick left (40) = 450', game.score - sHome === 450, game.score - sHome);
tick(75);
check('play resumes with a fresh frog after a home', game.state === 'play' && game.frog.y === 224);
check('hedge beside a bay is deadly', (place(104 + 16, 48), game.frog.furthest = 48, hop('up'), !!game.frog.dying && game.frog.dying.why === 'hedge'));
tick(P.DEATH_DWELL * 5 + 2);
check('occupied bay is deadly', (place(104, 48), game.frog.furthest = 48, hop('up'), !!game.frog.dying && game.frog.dying.why === 'occupied'));
tick(P.DEATH_DWELL * 5 + 2);

/* fill the other four bays -> 1000 bonus and a new level */
for (const bx of [8, 56, 152, 200]) {
  place(bx, 48); game.frog.furthest = 48;
  hop('up');
  if (game.state !== 'home') { check('bay at ' + bx + ' accepted', false, game.state); break; }
  if (game.homes.every(h => h)) break;
  tick(75);
  game.lanes.forEach(l => { l.objs = []; }); lane0.objs = [{ pos: 0, w: 224, kind: 'log', dive: null, croc: false }]; lane0.scroll = 16;
}
check('all five bays filled', game.homes.every(h => h));
const sLevel = game.score;
tick(75);
check('level clear bonus 1000', game.score - sLevel === 1000 && game.state === 'levelend', game.score - sLevel);
tick(160);
check('level 2 begins with tier 1 lanes', game.level === 2 && game.tier === 1 && game.state === 'play');
check('tier 1 has three trucks and two racers', game.lanes[5].objs.length === 3 && game.lanes[6].objs.length === 2);
check('level 2 adds a crocodile to the top lane', game.lanes[0].objs[0].croc === true);
check('bay creature on level 2 is the gator (even level)', (game.bay.counter = 255, P.tick(), game.bay.kind === 'gator'), game.bay.kind);

/* ---------- 5. deaths ---------- */
console.log('\n[deaths]');
play('original');
const road = game.lanes[9];                                   // yellow cars, y 208
place(104, 208);
const car = road.objs[0];
road.scroll = ((104 + 16 - car.pos) % 256 + 256) % 256;        // put the car on the frog
P.tick();
check('a car squashes the frog', !!game.frog.dying && game.frog.dying.cause === 'squash', JSON.stringify(game.frog.dying));
tick(P.DEATH_DWELL * 5 + 2);
check('life lost after the squash animation', game.lives === 2);
game.lanes.forEach(l => { if (!l.isRoad) l.objs = []; });
place(104, 112);
P.tick();
check('open water drowns the frog', !!game.frog.dying && game.frog.dying.cause === 'drown' && game.frog.dying.why === 'water');
tick(P.DEATH_DWELL * 5 + 2);
check('second life lost', game.lives === 1);
/* riding: a log carries the frog */
const lane3 = game.lanes[3];                                  // short logs moving right
lane3.objs = [{ pos: 0, w: 48, kind: 'log', dive: null, croc: false }];
lane3.scroll = 16 + 88;                                      // log at screen x 88..136
place(104, 96);
const xBefore = game.frog.x;
tick(60);
check('frog rides the log to the right', !game.frog.dying && game.frog.x > xBefore, game.frog.x);
/* carried off the edge */
let edgeWhy = null;
for (let i = 0; i < 600 && !edgeWhy; i++) { P.tick(); if (game.frog.dying) edgeWhy = game.frog.dying.why; }
check('riding off the edge is fatal', edgeWhy === 'edge', edgeWhy + ' x=' + game.frog.x);
tick(P.DEATH_DWELL * 5 + 2);
check('game over after the last frog', game.state === 'gameover', game.state + ' lives=' + game.lives);
tick(160);
check('game-over overlay shown', !el['overlay'].classList.contains('hidden') && el['title'].textContent === 'GAME OVER');

/* diving turtles */
play('original');
const tl = game.lanes[4];
check('turtle lane has diving groups when the knob is on', tl.objs.some(o => o.dive));
const diver = tl.objs.find(o => o.dive);
diver.dive.t = 340;
check('a submerged turtle is not rideable', P.turtleSubmerged(diver));
diver.dive.t = 10;
check('a surfaced turtle is rideable', !P.turtleSubmerged(diver));
P.setKnob('diving', false);
game.lanes = P.buildLanes(0);
check('turtle diving knob off: no group dives', game.lanes[1].objs.every(o => !o.dive) && game.lanes[4].objs.every(o => !o.dive));
P.applyPreset('original');

/* ---------- 6. invulnerable mode ---------- */
console.log('\n[invulnerable]');
S.invulnerable = true;
play('original');
check('high score key is separate for invulnerable', P.highKey() === 'frogger.high.original.invuln');
const livesI = game.lives;
place(104, 208);
const road2 = game.lanes[9];
road2.scroll = ((104 + 16 - road2.objs[0].pos) % 256 + 256) % 256;
P.tick();
check('car hit shows a splat but does not kill', game.ouch && game.ouch.cause === 'squash' && !game.frog.dying);
check('no life lost', game.lives === livesI);
game.lanes.forEach(l => { if (!l.isRoad) l.objs = []; });
place(104, 112);
tick(2);
check('water shows a splash and puts the frog back on the median', game.ouch && game.ouch.cause === 'drown' && game.frog.y === P.MEDIAN_Y && !game.frog.dying);
game.timer.steps = 1; game.timer.pace = 1;
tick(2);
check('timer expiry just resets the clock', game.timer.steps === P.timerSteps() && !game.frog.dying && game.lives === livesI, game.timer.steps);
let ok = true;
for (let i = 0; i < 3000; i++) {
  if (game.state === 'play' && !game.frog.hop && game.frog.lock === 0) P.press(['up', 'left', 'right', 'up'][i % 4]);
  P.tick(); P.render();
  if (game.frog && game.frog.dying) { ok = false; break; }
}
check('3000 frames of random hopping: the invulnerable frog never dies', ok && game.lives === livesI && game.state !== 'gameover', game.state);
S.invulnerable = false;

/* ---------- 7. extra life, lives knob, level knob ---------- */
console.log('\n[knobs]');
play('original');
P.addScore(19990);
check('no extra life below 20000', game.lives === 3);
P.addScore(10);
check('extra life at 20000', game.lives === 4);
P.addScore(20000);
check('only one extra life per game', game.lives === 4);
P.setKnob('lives', 7); P.setKnob('level', 4);
play('custom');
check('lives knob gives 7 frogs', game.lives === 7);
check('start level knob starts on level 4 (tier 3)', game.level === 4 && game.tier === 3);
P.setKnob('extra', 0);
play('custom');
P.addScore(50000);
check('extra life OFF never awards', game.lives === 7);
P.setKnob('timer', 0);
play('custom');
tick(32 * 70);
check('timer OFF never expires', !game.frog.dying && !isFinite(game.timer.steps));
P.applyPreset('kid');
check('Kid preset: slow, no clock, five frogs, no diving', S.traffic === 50 && S.timer === 0 && S.lives === 5 && S.diving === false && S.vehicles === 50);
P.applyPreset('original');

/* ---------- 8. settings and high score round trip ---------- */
console.log('\n[storage]');
P.setKnob('traffic', 70); S.invulnerable = true; P.saveSettings();
const saved = JSON.parse(globalThis.localStorage.getItem('frogger.settings'));
check('settings persisted', saved.traffic === 70 && saved.invulnerable === true && saved.preset === 'custom');
S.traffic = 100; S.invulnerable = false;
P.loadSettings();
check('settings reload', S.traffic === 70 && S.invulnerable === true && S.preset === 'custom');
P.saveHigh(12340);
check('high score stored under the preset/invulnerable key', globalThis.localStorage.getItem('frogger.high.custom.invuln') === '12340');
S.invulnerable = false; P.applyPreset('original');
check('plain Original high score untouched by the invulnerable run', (globalThis.localStorage.getItem('frogger.high.original') || '0') !== '12340');
/* localStorage failure must not throw */
const realLS = globalThis.localStorage;
globalThis.localStorage = { getItem() { throw new Error('nope'); }, setItem() { throw new Error('nope'); } };
let threw = false;
try { P.saveSettings(); P.loadSettings(); P.saveHigh(1); P.loadHigh(); } catch (e) { threw = true; }
globalThis.localStorage = realLS;
check('localStorage failures are swallowed', !threw);

/* ---------- 9. long soak across states, levels 1-6 ---------- */
console.log('\n[soak]');
S.invulnerable = true;
for (const lvl of [1, 2, 3, 5, 6]) {
  P.setKnob('level', lvl);
  play('custom');
  let okSoak = true, sawCreature = false, sawLady = false, sawBay = false;
  try {
    for (let i = 0; i < 2400; i++) {
      if (game.state === 'play' && !game.frog.hop && game.frog.lock === 0 && i % 9 === 0) P.press(['up', 'up', 'left', 'right'][(i / 9) % 4 | 0]);
      P.tick(); if (i % 4 === 0) P.render();
      if (game.creatures.some(c => c.active)) sawCreature = true;
      if (game.lady) sawLady = true;
      if (P.bayVisible()) sawBay = true;
    }
  } catch (e) { okSoak = false; console.log('     exception: ' + (e.stack || e)); }
  check('level ' + lvl + ': 2400 frames without exceptions', okSoak, game.state);
  if (lvl >= 3) check('level ' + lvl + ': a snake or otter appeared', sawCreature);
  if (lvl >= 3) check('level ' + lvl + ': the lady frog appeared', sawLady);
  check('level ' + lvl + ': a fly or gator visited a bay', sawBay);
}
S.invulnerable = false;
P.setKnob('level', 1);
P.applyPreset('original');
P.toMenu();
check('back on the menu', game.state === 'menu' && !el['overlay'].classList.contains('hidden'));
P.togglePause();
check('pause is ignored on the menu', game.paused === false);

/* ---------- 10. a rendered frame has the real art ---------- */
console.log('\n[render]');
play('original');
P.render();
const cv = el['screen'];
function px(x, y) { const i = (y * cv.width + x) * 4; return [cv._buf[i], cv._buf[i + 1], cv._buf[i + 2]]; }
check('canvas is 224x256 under the harness', cv.width === 224 && cv.height === 256, cv.width + 'x' + cv.height);
check('river is arcade navy (top pixel row of a lane is never covered)', px(2, 48).join() === '0,0,71' && px(2, 64).join() === '0,0,71', px(2, 48).join());
check('median is arcade purple', px(0, 129).join() === '151,0,247', px(0, 129).join());
check('frog pixels are green on the sidewalk', (() => { for (let y = 224; y < 240; y++) for (let x = 104; x < 120; x++) if (px(x, y).join() === '33,222,0') return true; return false; })());
check('time bar is green', px(100, 250).join() === '33,222,0');
check('score digits drawn in red', (() => { for (let y = 8; y < 16; y++) for (let x = 24; x < 64; x++) if (px(x, y).join() === '255,0,0') return true; return false; })());

console.log('\n' + (failures ? failures + ' FAILURE(S)' : 'all tests passed'));
process.exit(failures ? 1 : 0);
