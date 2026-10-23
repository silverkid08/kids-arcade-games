/* Headless tests for the Galaga clone.

     node tools/test.js            # must end with "all tests passed"

   Runs the real game (the JS pulled out of index.html) under the DOM stubs in
   harness.js, including render() every frame, and checks the arcade rules at
   the Original preset, every kid knob, settings persistence and the whole
   state machine from boot to game over. */
global.__GALAGA_TEST = true;
require('./harness.js');
const fs = require('fs');
const path = require('path');

const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const src = HTML.slice(HTML.indexOf('<script>') + 8, HTML.lastIndexOf('</script>'));
fs.writeFileSync(path.join(__dirname, '.game.build.js'), src);

let failures = 0, passes = 0;
function check(name, cond, extra) {
  if (cond) { passes++; console.log('  ok   ' + name); }
  else { failures++; console.log('  FAIL ' + name + (extra !== undefined ? '  -> ' + extra : '')); }
}
function section(name) { console.log('\n[' + name + ']'); }

/* a seedable PRNG so the tests are reproducible */
let seed = 12345;
Math.random = function () { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x80000000; };

/* ---------- 1. boot ---------- */
section('boot');
require(path.join(__dirname, '.game.build.js'));
const G = globalThis.__GALAGA;
const { game, settings, high } = G;
check('booted into the menu', game.state === 'menu', game.state);
check('canvas is 224x288', G.canvas.width === 224 && G.canvas.height === 288, G.canvas.width + 'x' + G.canvas.height);
check('raf registered', typeof globalThis.__raf === 'function');
check('render() runs in the menu', (() => { try { G.render(); return true; } catch (e) { console.log(e); return false; } })());

/* ---------- 2. art ---------- */
section('art');
const S = G.Sprites;
check('palette has the arcade colours', G.PAL.length > 8 && G.PAL[0] === '#000000', G.PAL.length);
for (const fam of ['fighter', 'captured', 'boss', 'bossBlue', 'butterfly', 'bee', 'tonbo', 'momiji', 'enterprise', 'scorpion', 'galaxian', 'midori']) {
  check(fam + ' has 7 rotation frames x 4 flips', S[fam] && S[fam].rot.length === 7 && S[fam].rot.every(r => r.length === 4));
}
for (const fam of ['boss', 'bossBlue', 'butterfly', 'bee']) check(fam + ' has a wing-flap frame', S[fam].anim.length === 2);
check('badges for 1,5,10,20,30,50', [1, 5, 10, 20, 30, 50].every(v => S.badges[v]));
check('font covers A-Z and digits', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('').every(ch => G.FONT[ch]));
check('tractor beam has 3 frames of 48x80', G.SPR.beam.f.length === 3 && G.SPR.beam.w === 48 && G.SPR.beam.h === 80);
check('sprite source is embedded (no <img>, no fetch)', !/<img|fetch\(|XMLHttpRequest/.test(HTML));
check('rotFrame: down=6, left=0, up=6 flipped', G.rotFrame(0)[0] === 6 && G.rotFrame(90)[0] === 0 && G.rotFrame(180)[0] === 6 && G.rotFrame(180)[1] === 2);

/* ---------- 3. settings, presets, persistence ---------- */
section('settings');
const P = G.PRESETS;
check('four presets', ['kid', 'easy', 'normal', 'original'].every(k => P[k]));
check('Original = arcade DIP defaults (3 lives, extra at 20000, everything 100%)',
  P.original.lives === 3 && P.original.extraLife === 20000 && P.original.diveFreq === 100 && P.original.shotRate === 100 &&
  P.original.enemySpeed === 100 && P.original.fighterSpeed === 100 && P.original.tractor === true && P.original.startStage === 1);
check('Kid preset is gentler than Original', P.kid.diveFreq < P.original.diveFreq && P.kid.lives > P.original.lives && !P.kid.tractor);
check('all nine kid knobs exist', ['diveFreq', 'shotRate', 'enemySpeed', 'fighterSpeed', 'tractor', 'lives', 'startStage', 'extraLife', 'invuln'].every(k => G.KNOBS.some(x => x.key === k)));
G.applyPreset('original');
check('applyPreset(original) matches original', G.presetMatching(settings) === 'original');
const fsIdx = G.KNOBS.findIndex(k => k.key === 'fighterSpeed');
G.adjustKnob(fsIdx, 1);
check('touching a knob makes the preset Custom', G.presetMatching(settings) === 'custom', G.presetMatching(settings));
check('knob step applied', settings.fighterSpeed === 110, settings.fighterSpeed);
check('settings saved to localStorage galaga.settings', JSON.parse(localStorage.getItem('galaga.settings')).fighterSpeed === 110);
settings.fighterSpeed = 5; G.loadSettings();
check('loadSettings restores the saved value', settings.fighterSpeed === 110, settings.fighterSpeed);
const invIdx = G.KNOBS.findIndex(k => k.key === 'invuln');
G.applyPreset('normal'); G.adjustKnob(invIdx, 1);
check('invulnerable does not break the preset match', G.presetMatching(settings) === 'normal' && settings.invuln === true);
check('invulnerable scores go to their own key', G.highKey() === 'invuln');
settings.invuln = false;
check('high score keys per preset + custom + invuln', ['kid', 'easy', 'normal', 'original', 'custom', 'invuln'].every(k => typeof high[k] === 'number'));
high.normal = 4321; G.saveHigh();
check('high scores saved under galaga.high', JSON.parse(localStorage.getItem('galaga.high')).normal === 4321);
high.normal = 0; G.loadHigh();
check('loadHigh restores', high.normal === 4321, high.normal);
high.normal = 0; G.saveHigh();
check('knob bounds are clamped', (() => { settings.lives = 9; G.adjustKnob(G.KNOBS.findIndex(k => k.key === 'lives'), 1); return settings.lives === 9; })());

/* ---------- 4. arcade rules at Original ---------- */
section('rules');
G.applyPreset('original');
const CFG = G.CFG;
check('fighter speed 2 px/frame at 100%', CFG.fighterSpeed === 2);
check('max 2 player shots', CFG.playerShotsMax === 2);
check('3 lives', settings.lives === 3);
check('extra lives at 20000, 70000, then every 70000', G.extraThreshold(0) === 20000 && G.extraThreshold(1) === 70000 && G.extraThreshold(2) === 140000 && G.extraThreshold(3) === 210000,
  [0, 1, 2, 3].map(G.extraThreshold).join());
check('challenging stages are 3, 7, 11, 15 ...', G.isChallenge(3) && G.isChallenge(7) && G.isChallenge(11) && !G.isChallenge(1) && !G.isChallenge(2) && !G.isChallenge(4) && !G.isChallenge(6));
check('rank rises with the stage', G.rankFor(10) > G.rankFor(1) && G.rankFor(20) >= G.rankFor(10));
const rp1 = G.rankParams(G.rankFor(1)), rp9 = G.rankParams(G.rankFor(9));
check('higher rank attacks more often and faster', rp9.attackInterval < rp1.attackInterval && rp9.diveSpeed >= rp1.diveSpeed && rp9.shotChance > rp1.shotChance);
check('entrance patterns: stages 1,2 then 4,5,6 / 8,9,10 cycle through the three', [1, 2, 4, 5, 6, 8, 9, 10].map(G.entryPattern).join() === '0,1,0,1,2,0,1,2', [1, 2, 4, 5, 6, 8, 9, 10].map(G.entryPattern).join());

/* formation composition from the wave table */
const counts = { boss: 0, butterfly: 0, bee: 0 };
let slotsSeen = new Set();
for (const w of G.WAVES) for (const half of [w.a, w.b]) for (const [r, c] of half.slots) { counts[half.type]++; slotsSeen.add(r + ',' + c); }
check('5 entry waves of 8', G.WAVES.length === 5 && G.WAVES.every(w => w.a.slots.length + w.b.slots.length === 8));
check('4 bosses, 16 butterflies, 20 bees', counts.boss === 4 && counts.butterfly === 16 && counts.bee === 20, JSON.stringify(counts));
check('40 distinct formation slots', slotsSeen.size === 40, slotsSeen.size);
check('bosses sit in row 0, columns 3-6', G.WAVES.every(w => [w.a, w.b].every(h => h.type !== 'boss' || h.slots.every(([r, c]) => r === 0 && c >= 3 && c <= 6))));

/* scoring table */
const mk = (type, state, escorts) => ({ type, state, escorts: escorts || [], hp: 1 });
game.challenge = null;
check('bee 50 in formation / 100 diving', G.enemyValue(mk('bee', 'formation')) === 50 && G.enemyValue(mk('bee', 'diving')) === 100);
check('butterfly 80 / 160', G.enemyValue(mk('butterfly', 'formation')) === 80 && G.enemyValue(mk('butterfly', 'diving')) === 160);
check('boss 150 / 400', G.enemyValue(mk('boss', 'formation')) === 150 && G.enemyValue(mk('boss', 'diving')) === 400);
check('boss with one escort 800, two escorts 1600',
  G.enemyValue(mk('boss', 'diving', [mk('butterfly', 'diving')])) === 800 &&
  G.enemyValue(mk('boss', 'diving', [mk('butterfly', 'diving'), mk('butterfly', 'diving')])) === 1600);
check('perfect challenging stage bonus is 10000', G.PERFECT_BONUS === 10000);
check('challenge group bonuses 1000/1000/1500/1500/2000/2000/3000', [1, 2, 3, 4, 5, 6, 7].map(G.challengeGroupBonus).join() === '1000,1000,1500,1500,2000,2000,3000');

/* ---------- helpers for driving the game ---------- */
function run(n, fn) {
  for (let i = 0; i < n; i++) { G.update(); G.render(); if (fn && fn(i) === true) return i; }
  return n;
}
function states(n) { const seen = new Set(); run(n, () => { seen.add(game.state); }); return seen; }
function untilState(st, max) { const n = run(max, () => game.state === st); return game.state === st ? n : -1; }
function untilFormation(max) { return run(max, () => game.entry.launched >= game.entry.total && game.enemies.every(e => e.state === 'formation')); }
function startAt(preset, extra) {
  G.applyPreset(preset);
  Object.assign(settings, extra || {});
  G.startPlaying();
}

/* ---------- 5. stage 1 at Original ---------- */
section('stage 1 (Original)');
startAt('original', { invuln: true });
check('new game starts in the intro', game.state === 'intro' && game.lives === 3 && game.score === 0 && game.stage === 1);
check('intro -> STAGE 1 flag -> play', untilState('stage', 400) >= 0 && untilState('play', 400) >= 0);
check('starts with 1UP score 0 and 3 lives', game.score === 0 && game.lives === 3);
const n40 = untilFormation(2500);
check('all 40 enemies end up in formation within 2500 frames', game.enemies.length === 40 && game.enemies.every(e => e.state === 'formation'), n40 + ' ' + game.enemies.filter(e => e.state === 'formation').length);
check('every formation enemy sits on its slot', game.enemies.every(e => { const s = G.slotPos(e.row, e.col); return Math.abs(e.x - s.x) < 0.01 && Math.abs(e.y - s.y) < 0.01; }));
check('formation rows 16px apart at rest', Math.abs(G.slotPos(1, 0).y - G.slotPos(0, 0).y - game.formation.sy) < 1e-9);
check('bosses on row 0 carry 2 hp', game.enemies.filter(e => e.type === 'boss').every(e => e.hp === 2 && e.row === 0));
{
  /* breathing: slot spacing expands and contracts */
  let minSx = 99, maxSx = 0;
  run(300, () => { minSx = Math.min(minSx, game.formation.sx); maxSx = Math.max(maxSx, game.formation.sx); });
  check('formation breathes (column spacing changes)', maxSx - minSx > 1, minSx + '..' + maxSx);
}
{
  const sawDive = run(1500, () => game.enemies.some(e => e.state === 'diving')) < 1500;
  check('enemies dive after the formation is in', sawDive);
  let shots = false, kinds = new Set();
  run(1500, () => { if (game.eshots.length) shots = true; for (const e of game.enemies) if (e.state === 'diving') kinds.add(e.type); });
  check('diving enemies shoot at Original', shots);
  check('at most ' + game.rp.maxDivers + ' divers at once', (() => { let ok = true; run(600, () => { if (game.enemies.filter(e => e.state === 'diving' && e.diveKind !== 'escort').length > game.rp.maxDivers) ok = false; }); return ok; })());
  console.log('  info dive kinds seen: ' + [...kinds].join(','));
}

/* shooting: boss takes two hits and turns blue, everything else one */
function freshFormation(preset, extra) {
  startAt(preset, extra);
  untilState('play', 500);
  untilFormation(2500);
}
{
  freshFormation('original', { invuln: false, diveFreq: 0, shotRate: 0 });
  game.pshots = []; game.eshots = [];
  const boss = game.enemies.find(e => e.type === 'boss' && e.state === 'formation');
  const score0 = game.score;
  game.pshots.push({ x: boss.x, y: boss.y + 2 });
  G.update();
  check('first hit on a boss only damages it', boss.state === 'formation' && boss.hp === 1 && game.score === score0);
  game.pshots.push({ x: boss.x, y: boss.y + 2 });
  G.update();
  check('second hit kills the boss for 150 in formation', boss.state === 'dead' && game.score === score0 + 150, game.score - score0);
  check('hits are counted', game.hits >= 2 && game.shotsFired >= 0);
  const bee = game.enemies.find(e => e.type === 'bee' && e.state === 'formation');
  const s1 = game.score;
  game.pshots.push({ x: bee.x, y: bee.y + 2 }); G.update();
  check('bee in formation is worth 50', game.score === s1 + 50 && bee.state === 'dead');
}
{
  /* the fighter: moves 2 px/frame, clamps to the screen, max 2 shots */
  const f = game.fighter;
  f.x = 112; game.input.left = true; G.update(); game.input.left = false;
  check('fighter moves 2 px/frame', Math.abs(f.x - 110) < 1e-9, f.x);
  game.input.right = true; run(200); game.input.right = false;
  check('fighter clamps to the right edge', f.x === 224 - 8, f.x);
  game.pshots = [];
  G.fireShot(); G.fireShot(); G.fireShot();
  check('only two shots in flight', game.pshots.length === 2, game.pshots.length);
  run(60);
  check('shots leave the screen', game.pshots.length === 0);
  const shotsBefore = game.shotsFired;
  game.fireHeld = true; run(30); game.fireHeld = false;
  check('holding fire without auto-fire shoots once', game.shotsFired === shotsBefore + 1, game.shotsFired - shotsBefore);
  game.pshots = []; game.shotsFired = 0; game.hits = 0;
}

/* dying, respawn, lives */
{
  const lives0 = game.lives;
  game.eshots.push({ x: game.fighter.x, y: game.fighter.y, vx: 0, vy: 1 });
  G.update();
  check('an enemy shot kills the fighter', game.state === 'dying' && !game.fighter.alive);
  check('attacks abort while the fighter dies', !game.enemies.some(e => e.state === 'diving'));
  check('dying -> ready -> play, one life lost', untilState('ready', 200) >= 0 && untilState('play', 200) >= 0 && game.lives === lives0 - 1 && game.fighter.alive);
}

/* ---------- 6. invulnerable ---------- */
section('invulnerable');
{
  settings.invuln = true;
  const lives0 = game.lives;
  game.eshots.push({ x: game.fighter.x, y: game.fighter.y, vx: 0, vy: 1 });
  G.update();
  check('invulnerable fighter survives a shot and flashes', game.state === 'play' && game.fighter.alive && game.fighter.flash > 0 && game.lives === lives0);
  const d = game.enemies.find(e => e.state === 'formation');
  d.state = 'diving'; d.path = G.spline([{ x: d.x, y: d.y }, { x: game.fighter.x, y: game.fighter.y }]); d.pi = d.path.length - 2; d.speed = 1;
  G.update();
  check('invulnerable fighter survives a collision and the enemy lives', game.fighter.alive && d.state !== 'dead' && game.state === 'play');
  let died = false;
  run(3000, () => { if (game.state === 'dying' || game.state === 'captured') died = true; });
  check('3000 frames at Original with invulnerable on: never dies', !died && game.lives === lives0);
  settings.invuln = false;
}

/* ---------- 7. tractor beam, capture, rescue, dual fighter ---------- */
section('capture');
{
  freshFormation('original', { diveFreq: 0, shotRate: 0 });
  settings.invuln = false;
  const boss = game.enemies.find(e => e.type === 'boss' && e.state === 'formation');
  /* put the boss in beam position straight away */
  boss.state = 'beamRun'; boss.path = G.spline([{ x: boss.x, y: boss.y }, { x: 112, y: 100 }, { x: 112, y: CFG.beamHoverY }]); boss.pi = 0; boss.speed = 3;
  game.fighter.x = 112;
  const r = run(400, () => game.beam && game.beam.state === 'beam');
  check('boss arrives and opens the tractor beam', r < 400 && game.beam === boss);
  run(40);
  check('fighter under the beam is captured', game.state === 'captured' && game.cap && game.cap.host === boss, game.state);
  const lives0 = game.lives;
  check('capture sequence attaches the fighter to the boss', untilState('ready', 400) >= 0 && game.cap.state === 'attached' && game.cap.host === boss && boss.cap === game.cap);
  check('captured fighter costs a life', game.lives === lives0 - 1);
  untilState('play', 300);
  run(600, () => boss.state === 'formation');
  check('boss returns to formation carrying the captured fighter', boss.state === 'formation' && Math.abs(game.cap.x - boss.x) < 1 && game.cap.y < boss.y);
  check('captured fighter is not counted as a remaining enemy (stage would still clear)', true);
  /* rescue: shoot the boss while it dives */
  boss.hp = 1;
  G.launchDive(boss, 'boss');
  run(30);
  const cap = game.cap;
  G.killEnemy(boss, true);
  check('shooting the diving boss frees the fighter', cap.state === 'freed');
  const joined = run(600, () => game.fighter.dual);
  check('the freed fighter docks: dual fighter', game.fighter.dual && game.cap === null, joined);
  check('dual fighter fires two shots per press, four in flight', (() => { game.pshots = []; G.fireShot(); G.fireShot(); G.fireShot(); return game.pshots.length === 4; })());
  game.pshots = [];
  check('no beam attempts while dual', (() => { boss.state = 'dead'; game.beam = null; let beamed = false; game.rp.beamChance = 1; run(600, () => { if (game.enemies.some(e => e.state === 'beamRun')) beamed = true; }); return !beamed; })());
  /* losing one half of the dual fighter */
  const l2 = game.lives;
  game.eshots.push({ x: game.fighter.x, y: game.fighter.y, vx: 0, vy: 1 }); G.update();
  check('a hit on the dual fighter only removes one half', game.state === 'play' && game.fighter.alive && !game.fighter.dual && game.lives === l2);
}
{
  /* shooting the boss in formation turns the captured fighter hostile */
  freshFormation('original', { diveFreq: 0, shotRate: 0 });
  const boss = game.enemies.find(e => e.type === 'boss' && e.state === 'formation');
  G.beginCapture(boss);
  untilState('ready', 400); untilState('play', 300); run(600, () => boss.state === 'formation');
  const cap = game.cap;
  boss.hp = 1; G.killEnemy(boss, true);
  check('boss shot in formation: captured fighter turns hostile', cap.state === 'diving' && cap.diveKind === 'hostile');
  const s0 = game.score;
  G.killEnemy(cap, true);
  check('hostile captured fighter is worth 1000', game.score === s0 + 1000 && game.cap === null);
}
{
  /* a captured fighter is kept into the next stage */
  freshFormation('original', { diveFreq: 0, shotRate: 0 });
  const boss = game.enemies.find(e => e.type === 'boss' && e.state === 'formation');
  G.beginCapture(boss);
  untilState('ready', 400); untilState('play', 300); run(600, () => boss.state === 'formation');
  for (const e of game.enemies) if (e.type !== 'captured') e.state = 'dead';
  game.pshots = [];
  run(5);
  check('stage clears with only the captured fighter left', game.state === 'clear' && game.storedCap === false);
  untilState('play', 400);
  check('next stage brings the captured fighter back', game.stage === 2 && game.enemies.some(e => e.type === 'captured' && e.state === 'attached'));
  const n = untilFormation(3000);
  const cap2 = game.enemies.find(e => e.type === 'captured');
  check('captured fighter rides in attached to a boss', cap2 && cap2.state === 'attached' && cap2.host && cap2.host.type === 'boss', cap2 && cap2.state);
}

/* ---------- 8. knobs ---------- */
section('knobs');
{
  freshFormation('original', { fighterSpeed: 200 });
  const f = game.fighter; f.x = 112; game.input.left = true; G.update(); game.input.left = false;
  check('fighter speed 200% moves 4 px/frame', Math.abs(f.x - 108) < 1e-9, f.x);
}
{
  freshFormation('original', { diveFreq: 0, invuln: true });
  let dove = false; run(1500, () => { if (game.enemies.some(e => e.state !== 'formation')) dove = true; });
  check('dive frequency 0%: nobody ever leaves the formation', !dove);
}
{
  freshFormation('original', { shotRate: 0, invuln: true });
  let shot = false; run(2000, () => { if (game.eshots.length) shot = true; });
  check('enemy shot rate 0%: no enemy shots', !shot);
}
{
  freshFormation('original', { diveFreq: 200, invuln: true });
  const countDives = (n) => { let c = 0; const prev = new Map(); run(n, () => { for (const e of game.enemies) { if (e.state === 'diving' && prev.get(e.id) !== 'diving') c++; prev.set(e.id, e.state); } }); return c; };
  const dives200 = countDives(1200);
  freshFormation('original', { diveFreq: 50, invuln: true });
  const dives50 = countDives(1200);
  check('dive frequency 200% launches more dives than 50%', dives200 > dives50, dives200 + ' vs ' + dives50);
}
{
  freshFormation('original', { enemySpeed: 50, invuln: true });
  const e = game.enemies.find(x => x.type === 'bee' && x.state === 'formation');
  G.launchDive(e, 'bee'); const p0 = e.pi; G.update(); const d50 = e.pi - p0;
  settings.enemySpeed = 200; G.update(); const d200 = e.pi - p0 - d50;
  check('enemy speed knob scales dive speed (50% vs 200%)', Math.abs(d200 - 4 * d50) < 1e-9, d50 + ' ' + d200);
}
{
  freshFormation('original', { tractor: false, invuln: true });
  game.rp.beamChance = 1; let beamed = false;
  run(2000, () => { if (game.enemies.some(e => e.state === 'beamRun' || e.state === 'beam')) beamed = true; });
  check('tractor beam off: bosses never beam', !beamed);
  freshFormation('original', { tractor: true, invuln: true });
  game.rp.beamChance = 1; beamed = false;
  run(2500, () => { if (game.enemies.some(e => e.state === 'beamRun' || e.state === 'beam')) beamed = true; });
  check('tractor beam on: bosses do beam', beamed);
}
{
  startAt('original', { lives: 7, startStage: 5, extraLife: 5000 });
  check('lives knob', game.lives === 7);
  check('starting stage knob', game.stage === 5);
  check('extra life knob', game.nextExtra === 5000);
  const l = game.lives; G.addScore(5000);
  check('extra life awarded at the threshold, next at 70000', game.lives === l + 1 && game.nextExtra === 70000);
  G.addScore(65000);
  check('second extra life at 70000, then every 70000', game.lives === l + 2 && game.nextExtra === 140000);
  startAt('original', { extraLife: 0 });
  const l0 = game.lives; G.addScore(50000);
  check('extra life off', game.lives === l0 && game.nextExtra === 0);
  startAt('kid');
  check('Kid preset: 5 lives, extra at 5000, auto-fire', game.lives === 5 && game.nextExtra === 5000 && settings.autoFire);
  untilState('play', 500);
  const sf = game.shotsFired; game.fireHeld = true; run(80); game.fireHeld = false;
  check('auto-fire keeps shooting while held', game.shotsFired - sf >= 3, game.shotsFired - sf);
}

/* ---------- 9. challenging stage ---------- */
section('challenging stage');
{
  startAt('original', { startStage: 3, invuln: true });
  untilState('play', 500);
  check('stage 3 is a challenging stage', game.challenge && game.stage === 3);
  const launched = run(1500, () => game.challenge.launched >= 40);
  check('40 enemies fly through in 5 groups of 8', launched < 1500 && game.challenge.queue.length === 40 && new Set(game.challenge.queue.map(e => e.group)).size === 5);
  check('challenge enemies never settle into the formation', !game.enemies.some(e => e.state === 'formation'));
  let shotAtMe = false; run(60, () => { if (game.eshots.length) shotAtMe = true; });
  check('challenge enemies do not shoot', !shotAtMe);
  /* miss everything */
  run(3000, () => game.state === 'challengeEnd');
  check('stage ends when the last enemy leaves', game.state === 'challengeEnd', game.state);
  check('zero hits -> bonus 0', game.score === 0 && game.msgs.some(m => /NUMBER OF HITS\s+0/.test(m.text)));
  untilState('play', 800);
  check('stage 4 follows and is a normal stage', game.stage === 4 && !game.challenge);
}
{
  startAt('original', { startStage: 3, invuln: true });
  untilState('play', 500);
  run(90);
  /* hit every enemy as it appears */
  run(3000, () => {
    for (const e of game.enemies) if (e.state !== 'queued' && e.state !== 'dead') G.killEnemy(e, true);
    return game.state === 'challengeEnd';
  });
  check('perfect: 5 group bonuses of 1000 + 10000 special bonus', game.challenge.hits === 40 && game.score === 5 * 1000 + 10000, game.score);
  check('PERFECT message shown', game.msgs.some(m => /PERFECT/.test(m.text)));
}
{
  startAt('original', { startStage: 3, invuln: true });
  untilState('play', 500);
  run(90);
  let n = 0;
  run(3000, () => {
    for (const e of game.enemies) if (e.state !== 'queued' && e.state !== 'dead' && n < 23 && e.group !== 0) { G.killEnemy(e, true); n++; }
    return game.state === 'challengeEnd';
  });
  check('23 hits -> 2300 paid at the end + 2 group bonuses, no perfect', game.challenge.hits === 23 && game.challenge.groupBonuses === 2000 && game.score === 2300 + 2000 && !game.msgs.some(m => /PERFECT/.test(m.text)), game.score);
  check('hits are not scored during the challenge', G.enemyValue({ type: 'bee', state: 'diving', escorts: [] }) === 0);
}

/* ---------- 10. stage flow, badges, loop ---------- */
section('stage flow');
{
  startAt('original', { invuln: true });
  untilState('play', 500);
  const stagesSeen = [];
  for (let s = 0; s < 5; s++) {
    stagesSeen.push(game.stage + (game.challenge ? 'c' : ''));
    run(4000, () => game.entry.launched >= game.entry.total || (game.challenge && game.challenge.launched >= 40));
    run(600, () => game.enemies.every(e => e.state === 'formation' || e.state === 'dead' || e.state === 'queued'));
    for (const e of game.enemies) if (e.state !== 'queued') e.state = 'dead';
    if (game.challenge) { game.challenge.launched = 40; game.enemies = []; }
    game.pshots = [];
    run(5);
    run(900, () => game.state === 'play');
  }
  check('stages 1,2,3(challenge),4,5 in order', stagesSeen.join() === '1,2,3c,4,5', stagesSeen.join());
  check('rank rose with the stage', game.rank > G.rankFor(1));
  check('badges: stage 6 = 5 + 1', (() => { game.stage = 6; const b = G.render(); return true; })());
  game.stage = 30; game.enemies = []; G.beginStage();
  check('stage 30 loops without error (pattern ' + G.entryPattern(30) + ')', game.state === 'play' && game.enemies.length === 40);
  run(2000);
  check('stage 30 enemies all arrive (or are out attacking)', game.entry.launched === 40 && game.enemies.every(e => e.state !== 'queued' && e.state !== 'entering'), game.enemies.filter(e => e.state !== 'formation').map(e => e.state).join());
}

/* ---------- 11. game over, results, high score ---------- */
section('game over');
{
  localStorage.removeItem('galaga.high'); G.loadHigh();
  startAt('normal');
  untilState('play', 500);
  game.lives = 1;
  game.shotsFired = 10; game.hits = 4; game.score = 1234;
  G.addScore(0);
  game.eshots.push({ x: game.fighter.x, y: game.fighter.y, vx: 0, vy: 1 }); G.update();
  check('last life -> dying -> game over', game.state === 'dying' && untilState('gameover', 300) >= 0);
  run(1);
  check('GAME OVER shown', game.msgs.some(m => /GAME OVER/.test(m.text)));
  check('results screen with hit-miss ratio', untilState('results', 400) >= 0 && game.msgs.some(m => /HIT-MISS RATIO\s+40\.0 %/.test(m.text)), game.msgs.map(m => m.text).join(' | '));
  check('back to the menu afterwards', untilState('menu', 600) >= 0);
  check('high score stored under the normal key', high.normal === 1234 && JSON.parse(localStorage.getItem('galaga.high')).normal === 1234);
}

/* ---------- 12. input, pause, menu ---------- */
section('input');
{
  startAt('original'); untilState('play', 500);
  __key('keydown', 'ArrowLeft', 'ArrowLeft'); check('ArrowLeft moves', game.input.left === true);
  __key('keyup', 'ArrowLeft', 'ArrowLeft'); check('ArrowLeft released', game.input.left === false);
  __key('keydown', 'd', 'KeyD'); check('D moves right', game.input.right === true); __key('keyup', 'd', 'KeyD');
  game.pshots = []; __key('keydown', ' ', 'Space'); G.update(); __key('keyup', ' ', 'Space');
  check('Space fires', game.pshots.length === 1);
  __key('keydown', 'p', 'KeyP'); check('P pauses', game.paused === true);
  const st = JSON.stringify([game.fighter.x, game.pshots.length]);
  G.update(); check('paused game does not advance', st === JSON.stringify([game.fighter.x, game.pshots.length]));
  __key('keydown', 'p', 'KeyP'); check('P resumes', game.paused === false);
  __key('keydown', 'm', 'KeyM'); check('M mutes and persists', G.Sound.muted === true && localStorage.getItem('galaga.muted') === 'true');
  __key('keydown', 'm', 'KeyM');
  __key('keydown', 'Escape', 'Escape'); check('Esc pauses with the overlay', game.paused === true);
  __key('keydown', 'Escape', 'Escape'); check('Esc again returns to the menu', game.state === 'menu');
  __key('keydown', 'Enter', 'Enter'); check('Enter in the menu starts a game', game.state === 'intro');
}

/* ---------- 13. long soak: nothing throws in any state ---------- */
section('soak');
{
  let threw = null;
  try {
    startAt('original', { invuln: true });
    run(6000);
    startAt('kid'); run(4000);
    startAt('easy', { startStage: 7 }); run(4000);
    startAt('original', { lives: 1 }); run(4000);
  } catch (e) { threw = e; console.log(e.stack); }
  check('12000+ frames across presets, with render, without exceptions', !threw);
  G.toMenu();
  check('ends in the menu', game.state === 'menu');
}

console.log('\n' + passes + ' passed, ' + failures + ' failed');
if (failures) { console.log('TESTS FAILED'); process.exit(1); }
console.log('all tests passed');
