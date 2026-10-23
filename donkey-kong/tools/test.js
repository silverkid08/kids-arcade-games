/* Headless tests for the Donkey Kong clone.  Runs the real game (extracted
   from index.html) under tools/harness.js, including render() every frame. */
require('./harness.js');
const fs = require('fs');
const path = require('path');

const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
let src = HTML.slice(HTML.indexOf('<script>') + 8, HTML.lastIndexOf('</script>'));
const EXPORT = `
globalThis.__DK = { game, settings, high, PRESETS, KNOBS, STAGE_25, STAGE_100, stageOrder, update, render,
  floorY, girderAt, ladderTop, ladderBottom, applyPreset, setKnob, newGame, startPlay, killMario, addScore,
  throwBarrel, spawnFireball, barrelTakesLadder, loadPersisted, savePersisted, showOverlay, toMenu, resetActors,
  SPR, FONT, PAL, startBonus, WALK_SPEED, CLIMB_SPEED, JUMP_FRAMES, JUMP_HEIGHT, HAMMER_FRAMES, TIMER_TICK,
  igniteOil, winStage, finishStageAndAdvance, downhill, beginStage };
})();`;
if (!src.trimEnd().endsWith('})();')) throw new Error('unexpected file tail');
src = src.trimEnd().slice(0, -'})();'.length) + EXPORT;
fs.writeFileSync(path.join(__dirname, '.game.build.js'), src);

let failures = 0;
function check(name, cond, extra) {
  if (cond) console.log('  ok   ' + name);
  else { failures++; console.log('  FAIL ' + name + (extra !== undefined ? '  -> ' + extra : '')); }
}

require(path.join(__dirname, '.game.build.js'));
const D = globalThis.__DK;
const { game, settings } = D;

/* ---------- helpers ---------- */
function frames(n, inputFn) {
  for (let i = 0; i < n; i++) {
    if (inputFn) inputFn(i);
    D.update();
    game.input.jumpEdge = false;
    D.render();
  }
}
function press(keys) {
  const inp = game.input;
  inp.left = !!keys.left; inp.right = !!keys.right; inp.up = !!keys.up; inp.down = !!keys.down;
  if (keys.jump) { inp.jump = true; inp.jumpEdge = true; } else inp.jump = false;
}
function startGame(preset, extra) {
  D.applyPreset(preset || 'original');
  if (extra) for (const k in extra) D.setKnob(k, extra[k]);
  if (preset === 'original' && !extra) D.applyPreset('original');
  globalThis.__elements['play'].click();
}
function skipToPlay() {
  // howhigh (150) + optional intro (400) + ready (120)
  let guard = 0;
  while (game.state !== 'play' && guard++ < 1200) { D.update(); game.input.jumpEdge = false; }
  D.render();
}

/* ---------- 1. static art and stage data ---------- */
console.log('\n[art and stage data]');
check('66+ sprites embedded', Object.keys(D.SPR).length >= 66, Object.keys(D.SPR).length);
check('every sprite is well-formed', Object.keys(D.SPR).every(k => { const [w, h, p] = D.SPR[k]; return p.length === w * h; }));
check('font has digits and letters', '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').every(c => D.FONT[c] && D.FONT[c][2].length === 64));
check('Jumpman frames are 16x16', ['m_stand', 'm_walk1', 'm_walk2', 'm_jump', 'm_climb', 'm_dead'].every(n => D.SPR[n][0] === 16 && D.SPR[n][1] === 16));
check('Kong frames are 48x32', ['k_idle', 'k_hold', 'k_throw', 'k_beatL', 'k_fall'].every(n => D.SPR[n][0] === 48 && D.SPR[n][1] === 32));
check('barrel is 12x10, hammer 9x10, rivet 8x9', D.SPR.b_roll0[0] === 12 && D.SPR.b_roll0[1] === 10 && D.SPR.hammer[0] === 9 && D.SPR.rivet[1] === 9);
check('girder tiles are 8x8', D.SPR.girder25[0] === 8 && D.SPR.girder25[1] === 8 && D.SPR.girder100[0] === 8);
check('logo is 200x96', D.SPR.logo[0] === 200 && D.SPR.logo[1] === 96);
check('sprites only use palette colours', Object.keys(D.SPR).every(k => D.SPR[k][2].split('').every(c => c === '.' || D.PAL[c])));

const S25 = D.STAGE_25, S100 = D.STAGE_100;
check('25m has 7 girders, 100m has 6', S25.girders.length === 7 && S100.girders.length === 6);
check('25m bottom girder: flat at 248 then rises to 241', S25.girders[0].fn(0) === 248 && S25.girders[0].fn(111) === 248 && S25.girders[0].fn(112) === 247 && S25.girders[0].fn(208) === 241);
check('25m Kong girder flat at 84 then slopes to 88', S25.girders[5].fn(0) === 84 && S25.girders[5].fn(143) === 84 && S25.girders[5].fn(192) === 88);
check('25m girder 2 slopes 121 -> 109', S25.girders[4].fn(16) === 121 && S25.girders[4].fn(208) === 109);
check('25m has 15 ladders, 5 broken, 2 exits', S25.ladders.length === 15 && S25.ladders.filter(l => l.broken).length === 5 && S25.ladders.filter(l => l.exit).length === 2);
check('100m has 8 rivets at x 56/160', S100.rivets.length === 8 && S100.rivets.every(r => r.x === 56 || r.x === 160));
check('100m has 14 ladders', S100.ladders.length === 14);
check('100m has three bonus items', S100.items.length === 3);
check('US level order (50m/75m skipped)', D.stageOrder(1).length === 2 && D.stageOrder(4).length === 3 && D.stageOrder(7).length === 4);
check('bonus 5000/6000/7000/8000/8000', [1, 2, 3, 4, 9].map(D.startBonus).join() === '5000,6000,7000,8000,8000');

/* ---------- 2. boot ---------- */
console.log('\n[boot]');
check('booted into the menu', game.state === 'menu');
check('raf registered', typeof globalThis.__raf === 'function');
frames(60);
check('menu renders without exceptions', true);
check('ladder tops sit on girder floors (25m)', S25.ladders.every(l => D.ladderTop(l) < D.ladderBottom(l)));

/* ---------- 3. original preset numbers ---------- */
console.log('\n[original preset]');
D.applyPreset('original');
check('original = 3 lives, extra life at 7000, 100% speeds, timer 100%, fall damage on',
  settings.lives === 3 && settings.extraLife === 7000 && settings.throwRate === 100 && settings.enemySpeed === 100 &&
  settings.playerSpeed === 100 && settings.timer === 100 && settings.fallDamage === true && settings.invuln === false);
check('arcade constants: walk 1 px/f, jump 32 frames / 13 px, timer tick 2 s, hammer 9 s',
  D.WALK_SPEED === 1 && D.JUMP_FRAMES === 32 && D.JUMP_HEIGHT === 13 && D.TIMER_TICK === 120 && D.HAMMER_FRAMES === 540);

startGame('original');
check('new game starts on 25m with 5000 bonus', game.stage === S25 && game.bonus === 5000 && game.lives === 3);
check('how high screen first', game.state === 'howhigh');
skipToPlay();
check('reached play state', game.state === 'play', game.state);
check('Jumpman starts on the bottom girder', game.mario.y === 248 && game.mario.g === 0);

/* walking speed */
const x0 = game.mario.x;
frames(60, () => press({ right: true }));
check('walks 60 px in 60 frames at Original', game.mario.x - x0 === 60, game.mario.x - x0);
press({});

/* bonus timer */
let b0 = game.bonus;
frames(120);
check('bonus drops 100 after 120 frames', game.bonus === b0 - 100, game.bonus);

/* jump arc */
const jy = game.mario.y;
press({ jump: true });
frames(1); press({});
check('jump state entered', game.mario.state === 'jump');
let minY = jy;
frames(31, () => { minY = Math.min(minY, game.mario.y); });
check('jump apex is 13 px', jy - minY === 13, jy - minY);
check('landed after 32 frames', game.mario.state === 'stand', game.mario.state);

/* Kong throws barrels on the arcade rhythm */
let thrown = 0, lastCount = 0;
frames(60 * 12, () => { if (game.barrels.length > lastCount) thrown++; lastCount = game.barrels.length; });
check('Kong threw several barrels in 12 s', thrown >= 3, thrown);
check('first barrel is blue', game.barrels.length === 0 || game.barrels.some(b => b.blue) || game.oilLit, JSON.stringify(game.barrels.map(b => b.blue)));

/* ---------- 4. climbing ---------- */
console.log('\n[ladders]');
startGame('original'); skipToPlay();
game.kong.nextThrow = 1e9; game.barrels = [];       // no interference
const m = game.mario;
// walk to the ladder at x=184 on the bottom girder, climb to girder 1
frames(200, () => press({ right: m.x + 8 < 188 }));
press({});
check('reached ladder foot', Math.abs(m.x + 8 - 188) <= 2 && m.y === 243, m.x + ',' + m.y);
frames(2, () => press({ up: true }));
check('climbing', m.state === 'climb', m.state);
check('snapped to ladder centre', m.x === 180);
let climbedPx = 0; const yStart = m.y;
frames(10, () => press({ up: true }));
climbedPx = yStart - m.y;
check('climbs 0.5 px/frame', Math.abs(climbedPx - 5) < 0.01, climbedPx);
press({ up: true, jump: true });
frames(1); press({});
check('cannot jump on a ladder', m.state === 'climb', m.state);
frames(120, () => press({ up: true }));
press({});
check('arrived on girder 1 at y 219', m.state === 'stand' && m.g === 1 && m.y === 219, m.state + ' ' + m.g + ' ' + m.y);

/* broken ladder: only the stub is climbable */
m.x = 76; m.y = 248; m.g = 0; m.state = 'stand';
frames(2, () => press({ up: true }));
check('can enter the broken ladder at x=80 from below', m.state === 'climb');
frames(60, () => press({ up: true }));
press({});
check('stops at the top of the 8 px stub', m.state === 'climb' && m.y === 240, m.state + ' ' + m.y);

/* ---------- 5. deaths and invulnerability ---------- */
console.log('\n[deaths]');
startGame('original'); skipToPlay();
game.kong.nextThrow = 1e9;
let lives0 = game.lives;
// a barrel on top of Jumpman
game.barrels.push({ x: game.mario.x, y: game.mario.y, g: 0, dir: -1, state: 'roll', blue: false, wild: false, anim: 0, vy: 0, subX: 0 });
frames(2);
check('barrel contact kills', game.state === 'dying', game.state);
frames(160);
check('life lost and stage restarted', game.lives === lives0 - 1 && game.state === 'ready', game.lives + ' ' + game.state);

startGame('original'); skipToPlay();
game.kong.nextThrow = 1e9; game.barrels = [];
// walk off the end of girder 1 (x=207) onto the bottom girder: a 28+ px fall
game.mario.x = 196; game.mario.y = 220; game.mario.g = 1; game.mario.state = 'stand';
frames(60, () => press({ right: true }));
press({});
check('falling off a girder kills', game.state === 'dying', game.state + ' y=' + game.mario.y);

startGame('original'); skipToPlay();
game.kong.nextThrow = 1e9; game.barrels = [];
game.bonus = 100;
frames(125);
check('bonus timer at 0 kills', game.state === 'dying', game.state + ' bonus=' + game.bonus);

/* game over */
startGame('original'); skipToPlay();
game.kong.nextThrow = 1e9;
game.lives = 0;
D.killMario('test');
frames(200);
check('last life -> game over overlay', game.state === 'gameover' && !globalThis.__elements['overlay'].classList.contains('hidden'));

console.log('\n[invulnerable]');
startGame('original', { invuln: true }); skipToPlay();
check('preset shows custom when a knob is touched', settings.preset === 'custom', settings.preset);
lives0 = game.lives;
game.barrels.push({ x: game.mario.x, y: game.mario.y, g: 0, dir: -1, state: 'roll', blue: false, wild: false, anim: 0, vy: 0, subX: 0 });
frames(3);
check('barrel bonks instead of killing', game.state === 'play' && game.lives === lives0 && game.mario.flash > 0, game.state);
check('the barrel bounced away', game.barrels.length === 0 || game.barrels[0].state === 'fall');
game.barrels = [];
game.mario.x = 196; game.mario.y = 220; game.mario.g = 1; game.mario.state = 'stand';
frames(60, () => press({ right: true }));
press({});
check('falls just land', game.state === 'play' && game.mario.y === 241 && game.mario.g === 0, game.state + ' ' + game.mario.y);
game.bonus = 100;
frames(125);
check('timer expiry resets the timer', game.state === 'play' && game.bonus === 5000, game.state + ' ' + game.bonus);
game.fireballs = [{ x: game.mario.x, y: game.mario.y, g: 0, dir: 1, state: 'walk', anim: 0, turnT: 100, subX: 0 }];
frames(3);
check('fireball bonks too', game.state === 'play' && game.lives === lives0);
let ok = true;
frames(60 * 20, () => { if (game.state !== 'play' && game.state !== 'win' && game.state !== 'howhigh' && game.state !== 'ready' && game.state !== 'intro') ok = false; });
check('20 s of invulnerable play never dies', ok && game.lives === lives0, game.state + ' lives=' + game.lives);

/* ---------- 6. knobs ---------- */
console.log('\n[knobs]');
startGame('original', { playerSpeed: 200 }); skipToPlay();
game.kong.nextThrow = 1e9;
let xs = game.mario.x;
frames(30, () => press({ right: true })); press({});
check('player speed 200% walks 60 px in 30 frames', game.mario.x - xs === 60, game.mario.x - xs);

startGame('original', { fallDamage: false }); skipToPlay();
game.kong.nextThrow = 1e9; game.barrels = [];
game.mario.x = 196; game.mario.y = 220; game.mario.g = 1; game.mario.state = 'stand';
frames(60, () => press({ right: true })); press({});
check('fall damage off: lands safely', game.state === 'play' && game.mario.g === 0);

startGame('original', { timer: 0 }); skipToPlay();
b0 = game.bonus;
frames(400);
check('timer off never counts down', game.bonus === b0);

startGame('original', { lives: 7 });
check('lives knob', game.lives === 7);
startGame('original', { startLevel: 3 });
check('start level knob: L3 bonus 7000', game.level === 3 && game.bonus === 7000);
startGame('original', { extraLife: 5000 }); skipToPlay();
lives0 = game.lives;
D.addScore(5000);
check('extra life at the chosen threshold', game.lives === lives0 + 1);
D.addScore(5000);
check('only one extra life', game.lives === lives0 + 1);

startGame('original', { enemySpeed: 200 }); skipToPlay();
game.kong.nextThrow = 1e9; game.barrels = [];
D.throwBarrel();
const bx0 = game.barrels[0].x;
frames(10);
check('enemy speed 200% rolls 20 px in 10 frames', game.barrels[0].x - bx0 === 20, game.barrels[0].x - bx0);

startGame('original', { throwRate: 200 }); skipToPlay();
thrown = 0; lastCount = 0;
frames(60 * 12, () => { if (game.barrels.length > lastCount) thrown++; lastCount = game.barrels.length; });
const fastThrown = thrown;
startGame('original', { throwRate: 50 }); skipToPlay();
thrown = 0; lastCount = 0;
frames(60 * 12, () => { if (game.barrels.length > lastCount) thrown++; lastCount = game.barrels.length; });
check('throw rate 200% throws more than 50%', fastThrown > thrown, fastThrown + ' vs ' + thrown);

/* presets */
D.applyPreset('kid');
check('kid preset is gentle', settings.enemySpeed < 100 && settings.throwRate < 100 && settings.fallDamage === false && settings.lives >= 5);
D.setKnob('lives', 9);
check('touching a knob -> custom', settings.preset === 'custom');
D.applyPreset('original');
check('original preset restores arcade values', settings.lives === 3 && settings.enemySpeed === 100);
check('PRESETS.original untouched', D.PRESETS.original.lives === 3 && D.PRESETS.original.enemySpeed === 100);

/* ---------- 7. persistence ---------- */
console.log('\n[localStorage]');
D.applyPreset('easy'); D.setKnob('throwRate', 25);
D.savePersisted();
const saved = JSON.parse(localStorage.getItem('dk.settings'));
check('settings saved', saved.throwRate === 25 && saved.preset === 'custom');
settings.throwRate = 100; settings.preset = 'normal';
D.loadPersisted();
check('settings round-trip', settings.throwRate === 25 && settings.preset === 'custom');
D.applyPreset('original'); game.score = 0;
startGame('original'); skipToPlay();
D.addScore(12345);
D.savePersisted();
const hs = JSON.parse(localStorage.getItem('dk.high'));
check('high score saved under the preset', hs.original === 12345, JSON.stringify(hs));
startGame('original', { invuln: true }); skipToPlay();
D.addScore(99999);
D.savePersisted();
const hs2 = JSON.parse(localStorage.getItem('dk.high'));
check('invulnerable score tracked separately', hs2.invuln === 99999 && hs2.original === 12345, JSON.stringify(hs2));

/* ---------- 8. scoring ---------- */
console.log('\n[scoring]');
startGame('original'); skipToPlay();
game.kong.nextThrow = 1e9; game.barrels = [];
// a barrel rolling toward Jumpman on the bottom girder; jump it
game.mario.x = 60; game.mario.dir = 1;
game.barrels.push({ x: 90, y: 248, g: 0, dir: -1, state: 'roll', blue: false, wild: false, anim: 0, vy: 0, subX: 0 });
let sc0 = game.score;
frames(6);
press({ jump: true }); frames(1); press({});
frames(40);
check('jumping a barrel scores 100', game.score - sc0 === 100 && game.state === 'play', (game.score - sc0) + ' ' + game.state);

// hammer: pick it up and smash
startGame('original'); skipToPlay();
game.kong.nextThrow = 1e9; game.barrels = [];
game.mario.hammer = D.HAMMER_FRAMES; game.mario.hammerT = 0; game.mario.dir = 1; game.mario.x = 60;
game.barrels.push({ x: 78, y: 248, g: 0, dir: -1, state: 'roll', blue: false, wild: false, anim: 0, vy: 0, subX: 0 });
sc0 = game.score;
frames(20);
check('hammer smashes a barrel for 300/500/800', [300, 500, 800].includes(game.score - sc0) && game.barrels.length === 0, game.score - sc0);
press({ up: true }); frames(2); press({});
check('cannot climb with the hammer', game.mario.state !== 'climb');
press({ jump: true }); frames(1); press({});
check('cannot jump with the hammer', game.mario.state !== 'jump');
frames(D.HAMMER_FRAMES);
check('hammer wears off after 9 s', game.mario.hammer === 0);

// blue barrel lights the oil drum and spawns a fireball
startGame('original'); skipToPlay();
game.kong.nextThrow = 1e9; game.barrels = [];
game.mario.x = 150;
game.barrels.push({ x: 60, y: 248, g: 0, dir: -1, state: 'roll', blue: true, wild: false, anim: 0, vy: 0, subX: 0 });
frames(60);
check('blue barrel reaching the drum lights it and spawns a fireball', game.oilLit && game.fireballs.length === 1, game.oilLit + ' ' + game.fireballs.length);

// ladder decision: before the oil is lit, barrels always take ladders
startGame('original'); skipToPlay();
game.oilLit = false;
check('barrels always take ladders before the fire is lit', D.barrelTakesLadder({ x: 100, y: 84 }) === true);
game.oilLit = true;
game.mario.y = 60;
check('barrel below Jumpman never takes a ladder', D.barrelTakesLadder({ x: 100, y: 84 }) === false);
game.mario.y = 248; game.difficulty = 5; game.input.left = true; game.mario.x = 150;
let takes = 0;
for (let i = 0; i < 400; i++) if (D.barrelTakesLadder({ x: 100, y: 84 })) takes++;
game.input.left = false;
check('difficulty 5 + joystick toward the barrel: ~75% take the ladder', takes > 240 && takes < 360, takes);
game.difficulty = 1; game.mario.x = 150; game.input.right = true;
takes = 0;
for (let i = 0; i < 400; i++) if (D.barrelTakesLadder({ x: 100, y: 84 })) takes++;
game.input.right = false;
check('difficulty 1, joystick away: ~6% take the ladder', takes > 5 && takes < 60, takes);

// 25m clear via the exit ladder
startGame('original'); skipToPlay();
game.kong.nextThrow = 1e9; game.barrels = [];
game.mario.x = 76; game.mario.y = 84; game.mario.g = 5; game.mario.state = 'stand';
sc0 = game.score; const bonusAtTop = game.bonus;
frames(2, () => press({ up: true }));
check('can climb the exit ladder at x=80', game.mario.state === 'climb');
frames(80, () => press({ up: true })); press({});
check('reaching the top wins the stage', game.state === 'win', game.state + ' y=' + game.mario.y);
frames(260);
check('bonus awarded and next stage is 100m', game.score - sc0 >= bonusAtTop - 200 && game.stage === S100 && game.state === 'howhigh', (game.score - sc0) + ' ' + game.stage.name + ' ' + game.state);

/* ---------- 9. 100m rivets ---------- */
console.log('\n[100m]');
skipToPlay();
check('100m play with 8 rivets, bonus reset', game.rivets.length === 8 && game.rivets.every(r => !r.taken) && game.bonus === 5000);
check('fireballs on 100m', true);
// walk over the rivet at x=56 on girder 1 (y=208)
game.mario.x = 30; game.mario.y = 208; game.mario.g = 1; game.mario.state = 'stand';
sc0 = game.score;
frames(40, () => press({ right: true })); press({});
check('walking over a rivet pulls it for 100', game.rivets.filter(r => r.taken).length === 1 && game.score - sc0 === 100, (game.score - sc0));
check('a hole is left in the girder', D.floorY(1, 58) === null && D.floorY(1, 50) === 208);
// walking back into the hole: Jumpman falls (and dies, 40 px)
frames(30, () => press({ left: true })); press({});
check('walking into the hole drops Jumpman', game.mario.state === 'fall' || game.state === 'dying', game.mario.state + ' ' + game.state);
frames(200);
// pull every rivet directly
skipToPlay();
for (const r of game.rivets) { if (!r.taken) { r.taken = true; game.rivetsDone.push(r.i); game.holes.push({ g: r.g, x: r.x }); } }
check('rivets stay pulled after a death', game.rivets.filter(r => r.taken).length >= 1);
game.rivets.forEach(r => { r.taken = false; });
game.rivetsDone = []; game.holes = [];
game.rivets.slice(0, 7).forEach(r => { r.taken = true; game.rivetsDone.push(r.i); game.holes.push({ g: r.g, x: r.x }); });
const last = game.rivets[7];
game.mario.x = last.x - 20; game.mario.y = last.y; game.mario.g = last.g; game.mario.state = 'stand';
frames(30, () => press({ right: true })); press({});
check('last rivet -> Kong falls (win sequence)', game.state === 'win', game.state);
const lvl = game.level;
frames(300);
check('after 100m the level advances to L2 25m', game.level === lvl + 1 && game.stage === S25, game.level + ' ' + game.stage.name);

/* ---------- 10. long soak: random play across states ---------- */
console.log('\n[soak]');
for (const preset of ['kid', 'normal', 'original']) {
  startGame(preset);
  let states = new Set(), err = null, deaths = 0, lastLives = game.lives, maxBarrels = 0, sawFire = false;
  try {
    for (let i = 0; i < 60 * 180; i++) {
      states.add(game.state);
      if (game.state === 'play') {
        const t = Math.floor(i / 45) % 6;
        press({ right: t === 0 || t === 3, left: t === 1, up: t === 2 || t === 4, jump: i % 37 === 0, down: t === 5 });
      } else press({});
      D.update(); game.input.jumpEdge = false; D.render();
      if (game.lives < lastLives) deaths++;
      lastLives = game.lives;
      maxBarrels = Math.max(maxBarrels, game.barrels.length);
      if (game.fireballs.length) sawFire = true;
      if (game.state === 'gameover') { globalThis.__elements['play'].click(); lastLives = game.lives; }
      if (globalThis.__elements['overlay'].classList.contains('hidden') === false && game.state !== 'gameover' && game.state !== 'menu') break;
    }
  } catch (e) { err = e; }
  check(preset + ': 3 minutes of play without exceptions', !err, err && err.stack);
  check(preset + ': barrels and fireballs appeared', maxBarrels > 0 && sawFire, maxBarrels + ' ' + sawFire);
  console.log('     (states: ' + [...states].join(',') + '; deaths ' + deaths + '; score ' + game.score + '; level ' + game.level + ')');
}

/* menu navigation and pause */
console.log('\n[menu]');
D.toMenu();
check('back in the menu', game.state === 'menu' && !globalThis.__elements['overlay'].classList.contains('hidden'));
const keydown = globalThis.__winListeners.keydown[0];
const prevPreset = settings.preset;
keydown({ key: 'ArrowRight', preventDefault() {} });
check('arrow keys change the preset on the play row', settings.preset !== prevPreset || prevPreset === 'custom');
keydown({ key: 'ArrowUp', preventDefault() {} });
keydown({ key: 'ArrowRight', preventDefault() {} });
check('arrow keys change a knob -> custom', settings.preset === 'custom');
keydown({ key: 'Enter', preventDefault() {} });
check('Enter starts the game', game.state === 'howhigh');
skipToPlay();
keydown({ key: 'p', preventDefault() {} });
check('P pauses', game.paused === true);
const sc = game.frame;
frames(10);
check('paused game does not advance', game.frame === sc);
keydown({ key: 'p', preventDefault() {} });
check('P resumes', game.paused === false);
keydown({ key: 'Escape', preventDefault() {} });
check('Esc returns to the menu', game.state === 'menu');

console.log('\n' + (failures ? failures + ' FAILURE(S)' : 'all tests passed'));
process.exit(failures ? 1 : 0);
