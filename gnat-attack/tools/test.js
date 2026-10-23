/* Headless test suite: runs the real game code from index.html under the
   DOM/canvas stubs in harness.js, calling render() every frame.
     node tools/test.js        -> must end with "all tests passed" */
require('./harness.js');
const { build } = require('./build.js');
const G = build();
const { game, settings, input, update, render } = G;

let passed = 0, failed = 0;
function ok(cond, name) { if (cond) passed++; else { failed++; console.log('FAIL: ' + name); } }
function eq(a, b, name) { ok(a === b, name + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'); }
const step = (n = 1) => { for (let i = 0; i < n; i++) { update(); render(); } };
const until = (f, max = 20000) => { for (let i = 0; i < max; i++) { if (f()) return true; update(); render(); } return f(); };
function fresh(preset, extra, keep) {
  if (!keep) localStorage._d = {};
  G.applyPreset(preset || 'original'); settings.invuln = 0;
  if (extra) Object.assign(settings, extra);
  G.startPlaying(); G.seed(777);
  input.x = 128; input.y = 190; input.fire = false;
}
const visible = b => b.x > 24 && b.x < 232 && b.y > 24 && b.y < 200;
function swatAt(x, y) {                          // move there and swat; returns after the swatter is back up
  input.x = Math.round(x); input.y = Math.round(y); input.fire = true;
  step(G.SWAT_UP + G.SWAT_DOWN + G.SWAT_UP + 1);
}
/* a bot that chases the nearest target and swats it */
function botStep(miss) {
  const g = game.glove;
  let t = null, bd = 1e9;
  const cands = game.bugs.filter(b => !b.dead && visible(b));
  if (game.lifeup && visible(game.lifeup)) cands.push(game.lifeup);
  if (game.boss && game.boss.state === 'fight' && !game.boss.hurt) cands.push(game.boss);
  for (const b of cands) { const d = Math.hypot(b.x - g.x, b.y - g.y); if (d < bd) { bd = d; t = b; } }
  if (t) {
    const tx = t.x + (t.vx || 0) * 2, ty = t.y + (t.vy || 0) * 2;
    input.x = Math.round(tx + (miss ? 40 : 0)); input.y = Math.round(ty);
    if (G.canSwat() && G.targetsUnder().length || (miss && G.canSwat())) input.fire = true;
  }
  update(); render();
}

/* ---------------- art ---------------- */
ok(G.SPR.glove.length === 8 && G.SPR.glove.every(s => s.w > 4 && s.h > 4), 'eight glove frames (idle, swing, swat, two splats, three stung)');
ok(G.SPR.fly.length === 2 && G.SPR.parent.length === 5 && G.SPR.child.length === 3, 'fly / parent / child animation frames');
ok(G.SPR.boss.length === 2 && G.SPR.boss[0].w === 64 && G.SPR.boss[0].h === 69, 'King Watinga normal + hurt frames');
ok(G.SPR.digit.length === 10 && G.SPR.tile.length === 3 && G.SPR.icon.length === 15, 'digits, three paper tiles, fifteen award icons');
for (const k of ['glove', 'fly', 'parent', 'bigfly', 'bomb', 'boss']) {
  const s = (Array.isArray(G.SPR[k]) ? G.SPR[k][0] : G.SPR[k]); const c = new Set(s.px.filter(v => v >= 0));
  ok(c.size >= 4, k + ' sprite is multicolour art, not a block');
}
ok(G.BG[0][20 * 256 + 20] !== G.BG[1][20 * 256 + 20] && G.BG[1][20 * 256 + 20] !== G.BG[2][20 * 256 + 20], 'three different paper backgrounds');
eq(G.BG[0][5 * 256 + 5], 0xFF000000, 'black border outside the 224x192 play area');

/* ---------------- music / sound data ---------------- */
for (const n of ['level1', 'level2', 'level3', 'boss', 'clear', 'clearFinal', 'loopClear', 'gameOver']) {
  const s = G.MUSIC.songs[n];
  ok(s && s.notes.length > 20 && s.len > 3, 'song ' + n + ' decoded from the SPC data');
  ok(s.notes.every(x => G.MUSIC.inst[x[5]] && G.MUSIC.samples[G.MUSIC.inst[x[5]].s]), n + ': every note has a real BRR instrument');
}
ok(G.MUSIC.songs.level1.loop > 0 && G.MUSIC.songs.gameOver.loop < 0, 'level music loops, jingles do not');
{ // tempo check against the published transcription: level 3 quarter note = 0.3077 s (MIDI 195 BPM)
  const L3 = G.MUSIC.songs.level3; ok(Math.abs(L3.len - 33.18) < 0.05, 'level 3 loop length from tempo $28 (' + L3.len + ' s)'); }
for (const n of ['swing', 'hit', 'bugdie1', 'bugdie2', 'die', 'extralife', 'minibugs']) ok(G.SFX[n] && G.SFX[n].notes.length, 'sound effect recipe ' + n);

/* ---------------- coordinate mapping through a scaled canvas ---------------- */
{
  const cv = __elements.screen;
  cv.getBoundingClientRect = () => ({ left: 100, top: 50, width: 768, height: 672 });     // 3x
  let p = G.toGame(100, 50); eq(p.x + ',' + p.y, '0,0', 'top-left maps to 0,0');
  p = G.toGame(100 + 3 * 128 + 1, 50 + 3 * 112 + 2); eq(p.x + ',' + p.y, '128,112', 'centre maps through 3x scale');
  p = G.toGame(100 + 767, 50 + 671); eq(p.x + ',' + p.y, '255,223', 'bottom-right pixel');
  p = G.toGame(5000, -300); eq(p.x + ',' + p.y, '255,0', 'clamped to the screen');
  cv.getBoundingClientRect = () => ({ left: 0, top: 0, width: 512, height: 448 });       // 2x
  p = G.toGame(301, 99); eq(p.x + ',' + p.y, '150,49', '2x scale mapping');
  cv.listeners.mousemove[0]({ clientX: 200, clientY: 240 }); eq(input.x + ',' + input.y, '100,120', 'mousemove handler maps');
  fresh('original'); cv.getBoundingClientRect = () => ({ left: 0, top: 0, width: 512, height: 448 });
  cv.listeners.mousedown[0]({ button: 0, clientX: 300, clientY: 200, preventDefault() {} }); ok(input.fire, 'left click queues a swat');
  eq(input.x + ',' + input.y, '150,100', 'click position mapped');
  input.fire = false;
  cv.listeners.mousedown[0]({ button: 2, clientX: 40, clientY: 40, preventDefault() {} }); ok(!input.fire, 'right click does not swat');
  cv.listeners.mousemove[0]({ clientX: 80, clientY: 40 }); step(); eq(game.glove.x + ',' + game.glove.y, '40,20', 'glove hotspot follows the mouse');
  input.x = 2; input.y = 2; step(); eq(game.glove.x + ',' + game.glove.y, '16,15', 'glove clamped to the play area');
  cv.getBoundingClientRect = () => ({ left: 0, top: 0, width: 256, height: 224 });
}

/* ---------------- Original rules ---------------- */
fresh('original');
eq(game.mode, 'intro', 'level starts with LEVEL 1');
eq(game.remaining, 100, '100 bugs per level');
eq(game.lives, 3, '3 lives (three glove icons)');
eq(G.Sound.log[G.Sound.log.length - 1], 'music:level1', 'level 1 music');
step(119); eq(game.mode, 'intro', 'intro lasts 2 seconds'); step(1); eq(game.mode, 'play', 'then play');
ok(until(() => game.bugs.some(b => b.kind === 'gnat' && visible(b)), 2000), 'flies arrive');
{
  const b = game.bugs.find(b => b.kind === 'gnat' && visible(b));
  b.vx = b.vy = 0; b.v = 0; b.tx = b.x; b.ty = b.y;
  const before = game.score; const shots = game.stats.shots;
  input.x = Math.round(b.x); input.y = Math.round(b.y); input.fire = true; step(1);
  eq(game.stats.shots, shots + 1, 'a click is a swat');
  ok(!b.dead, 'nothing is hit while the swatter is still coming down');
  step(G.SWAT_UP + 1);
  ok(b.dead || !game.bugs.includes(b), 'swatted fly is gone');
  eq(game.remaining, 99, 'counter goes down by one');
  ok(game.score > before, 'score added');
  ok(game.fx.some(f => f.kind === 'fall'), 'swatted fly falls off');
  ok(G.Sound.log.includes('swing') && G.Sound.log.includes('bugdie1') && G.Sound.log.includes('hit'), 'swing / splat sounds');
  ok(game.glove.hit && game.glove.phase === 2, 'splat frames while the swatter is down');
}
// hit box is the mesh: a fly just outside is missed
fresh('original'); step(121);
{
  const b = G.spawnBug('gnat', { x: 120, y: 100 }); b.v = 0; b.vx = b.vy = 0;
  const box = G.bugBox(b), m = G.meshRect();
  swatAt(120 + (box.x1 - b.x) + G.MESH.hw + 1, 100);
  ok(!b.dead, 'a swat just beside the fly misses');
  eq(game.stats.hits, 0, 'miss is not a hit'); eq(game.stats.shots, 1, 'but it is a swat');
  swatAt(120 + (box.x1 - b.x) + G.MESH.hw - 1, 100);
  ok(b.dead, 'overlapping the mesh by a pixel hits');
}
// several bugs in one swat (TAS trick: hits are checked every down frame)
fresh('original'); step(121);
{
  const a = G.spawnBug('gnat', { x: 60, y: 100 }), b = G.spawnBug('gnat', { x: 180, y: 100 });
  for (const x of [a, b]) { x.v = 0; x.vx = x.vy = 0; }
  input.x = 60; input.y = 100; input.fire = true; step(G.SWAT_UP + 1);
  input.x = 180; step(2);
  ok(a.dead && b.dead, 'dragging the lowered swatter hits two flies far apart');
  eq(game.remaining, 98, 'both counted');
}
// level 1 mix: flies and big flies only; level 2 adds parents; level 3 adds bombs
{
  G.applyPreset('original'); G.startPlaying(); G.seed(5);
  const kinds = l => { game.level = l; const s = new Set(); for (let i = 0; i < 3000; i++) s.add(G.pickKind()); return [...s].sort().join(','); };
  eq(kinds(1), 'big,gnat', 'level 1 bugs'); eq(kinds(2), 'big,gnat,parent', 'level 2 bugs'); eq(kinds(3), 'big,bomb,gnat,parent', 'level 3 bugs');
}
// big fly fires four orbs; an orb on the hand costs a life
fresh('original'); step(121);
{
  const b = G.spawnBug('big', { x: 100, y: 80 }); b.fire = 1;
  step(1);
  eq(game.shots.length, 4, 'Big Fly fires a four-way blast');
  game.shots = [];
  const h = G.handRect();
  G.fireShot((h.x0 + h.x1) / 2, (h.y0 + h.y1) / 2, 0, 0, 0);
  b.dead = true;
  step(1);
  eq(game.glove.state, 'hurt', 'an orb on the hand stings the glove');
  ok(G.Sound.log.includes('die'), 'sting sound');
  step(60); eq(game.glove.state, 'shrink', 'shocked hand, then it shrinks');
  step(30); eq(game.lives, 2, 'a life is lost'); eq(game.glove.state, 'ok', 'new glove');
  ok(game.glove.inv > 0, 'brief safety after a lost life');
}
// fly parent: charges, then releases homing children
fresh('original'); step(121);
{
  const p = G.spawnBug('parent', { x: 120, y: 60 }); p.fire = 1;
  ok(until(() => game.bugs.filter(b => b.kind === 'child').length >= 5, 200), 'Fly Parent releases five Fly Children');
  const c = game.bugs.find(b => b.kind === 'child'); const h0 = Math.hypot(c.x - game.glove.x, c.y - game.glove.y - 20);
  step(20); const h1 = Math.hypot(c.x - game.glove.x, c.y - game.glove.y - 20);
  ok(h1 < h0, 'children home in on the glove');
  ok(until(() => game.glove.state !== 'ok', 600), 'a child reaching the hand stings');
}
// fly bomb: arms near the hand and explodes
fresh('original'); step(121);
{
  const h = G.handRect();
  const b = G.spawnBug('bomb', { x: (h.x0 + h.x1) / 2 + 10, y: (h.y0 + h.y1) / 2 });
  step(1); eq(b.state, 'armed', 'bomb arms next to the hand');
  ok(until(() => game.fx.some(f => f.kind === 'boom'), 80), 'and explodes');
  ok(until(() => game.glove.state !== 'ok', 10), 'the explosion stings the glove');
}
// extra life every 25 counted bugs
fresh('original'); step(121);
{
  for (let i = 0; i < 25; i++) { const b = G.spawnBug('gnat', { x: 120, y: 120 }); b.v = 0; b.vx = b.vy = 0; swatAt(120, 120); }
  eq(game.remaining, 75, '25 swatted');
  ok(game.lifeup, 'an extra-life glove appears at 25');
  game.lifeup.x = 100; game.lifeup.y = 100; const lives = game.lives;
  swatAt(100, 100);
  eq(game.lives, lives + 1, 'swatting it gives a life'); ok(G.Sound.log.includes('extralife'), 'extra life sound');
}
// 100 bugs -> King Watinga -> 20 swats -> clear -> level 2
fresh('original'); step(121);
{
  game.remaining = 1;
  const b = G.spawnBug('gnat', { x: 120, y: 120 }); b.v = 0; b.vx = b.vy = 0; swatAt(120, 120);
  eq(game.remaining, 0, 'counter reaches 0'); ok(game.ending, 'no more bugs come');
  ok(until(() => game.mode === 'boss', 400), 'King Watinga appears');
  eq(G.Sound.log[G.Sound.log.length - 1], 'music:boss', 'boss music');
  eq(game.boss.hp, 20, 'he takes 20 swats');
  ok(until(() => game.boss.state === 'fight', 400), 'he flies down');
  let swats = 0; game.glove.inv = 1e9;
  while (game.boss && game.boss.state === 'fight' && swats < 40) {
    while (game.boss.hurt) step();
    swatAt(game.boss.x, game.boss.y); swats++;
  }
  eq(swats, 20, 'exactly 20 swats');
  ok(until(() => game.mode === 'clear', 400), 'stage clear');
  ok(G.Sound.log.includes('music:clear'), 'Beat the Big Bug! jingle');
  ok(!G.statsEl.classList.contains('hidden') && /ACCURACY/.test(G.statsEl.innerHTML), 'stage stats shown');
  ok(until(() => game.mode === 'intro' && game.level === 2, 1200), 'level 2 follows');
  eq(game.remaining, 100, 'counter reset');
}
// boss attacks: rings of orbs and fans of children
fresh('original'); step(121); G.startBoss(); until(() => game.boss.state === 'fight');
{
  ok(until(() => game.shots.length >= 8, 400), 'King Watinga fires a ring of orbs');
  game.shots = [];
  game.glove.inv = 9999;
  ok(until(() => game.bugs.filter(b => b.kind === 'child').length >= 12, 400), 'and a fan of Fly Children');
}
// level 3 boss -> loop back to level 1 with an award icon
fresh('original', { startLevel: 3 }); step(121); G.startBoss(); game.boss.state = 'die'; game.boss.t = 0;
{
  ok(until(() => game.mode === 'clear', 400), 'level 3 clear');
  ok(G.Sound.log.includes('music:clearFinal'), 'final jingle');
  ok(until(() => game.mode === 'intro', 1200), 'next loop starts');
  eq(game.level + '/' + game.loop, '1/1', 'back to level 1, loop count 1');
}
// game over
fresh('original'); step(121);
{
  game.lives = 1; G.sting(); step(91);
  eq(game.mode, 'gameover', 'last life lost -> GAME OVER');
  ok(G.Sound.log.includes('music:gameOver'), 'Beaten by Bugs jingle');
  ok(until(() => game.mode === 'menu', 400), 'back to the menu');
  ok(game.lastSummary && game.lastSummary.preset === 'original', 'session summary');
}

/* ---------------- knobs ---------------- */
function gnatSpeed(p) { G.applyPreset('original'); settings.speed = p; G.startPlaying(); step(121); const b = G.spawnBug('gnat', { x: 20, y: 100 }); return b.v; }
ok(Math.abs(gnatSpeed(50) * 2 - gnatSpeed(100)) < 1e-9, 'INSECT SPEED scales flight speed');
{
  G.applyPreset('original'); G.startPlaying(); const b = G.spawnBug('gnat', { x: 100, y: 100 });
  const w1 = G.bugBox(b).x1 - G.bugBox(b).x0; settings.size = 2; const w2 = G.bugBox(b).x1 - G.bugBox(b).x0;
  eq(w2, 2 * w1, 'INSECT SIZE doubles the bug (and its hit box)');
  const m1 = G.meshRect(); settings.glove = 2; const m2 = G.meshRect();
  eq(m2.x1 - m2.x0, 2 * (m1.x1 - m1.x0), 'SWATTER SIZE doubles the mesh');
  settings.glove = 1; settings.pad = 8; const m3 = G.meshRect();
  eq(m3.x1 - m3.x0, (m1.x1 - m1.x0) + 16, 'SWAT HIT RADIUS widens the mesh');
}
fresh('original', { gnats: 10 }); eq(game.remaining, 10, 'BUGS PER LEVEL');
{
  G.applyPreset('original'); settings.attack = 0; G.startPlaying(); G.seed(3);
  for (const l of [1, 2, 3]) { game.level = l; let only = true; for (let i = 0; i < 2000; i++) if (G.pickKind() !== 'gnat') only = false; ok(only, 'ATTACKING BUGS off: level ' + l + ' has only flies'); }
  game.level = 1; step(121); G.startBoss(); until(() => game.boss.state === 'fight'); step(600);
  eq(game.shots.length + game.bugs.length, 0, 'ATTACKING BUGS off: the boss does not fire');
  G.applyPreset('original'); settings.attack = 150; G.startPlaying(); step(121);
  const b1 = G.spawnBug('big', { x: 100, y: 100 }); settings.attack = 50; const b2 = G.spawnBug('big', { x: 100, y: 100 });
  ok(b1.fire < b2.fire, 'ATTACKING BUGS frequency changes fire timers');
}
fresh('original', { bossHits: 3 }); step(121); G.startBoss(); eq(game.boss.hp, 3, 'BOSS SWATS NEEDED');
{
  const run = s => { fresh('original', { bossSpeed: s }); step(121); G.startBoss(); let n = 0; while (game.boss.state === 'enter' && n < 2000) { step(); n++; } return n; };
  ok(run(50) > run(100) * 1.8, 'BOSS SPEED');
}
fresh('original', { lives: 7 }); eq(game.lives, 7, 'LIVES');
fresh('original', { startLevel: 2 }); eq(game.level, 2, 'STARTING LEVEL'); ok(G.Sound.log.includes('music:level2'), 'level 2 music');
fresh('original', { extra: 10 }); step(121);
for (let i = 0; i < 10; i++) { const b = G.spawnBug('gnat', { x: 120, y: 120 }); b.v = 0; b.vx = b.vy = 0; swatAt(120, 120); }
ok(game.lifeup, 'EXTRA LIFE EVERY 10');
fresh('original', { extra: 0 }); step(121);
for (let i = 0; i < 30; i++) { const b = G.spawnBug('gnat', { x: 120, y: 120 }); b.v = 0; b.vx = b.vy = 0; swatAt(120, 120); }
ok(!game.lifeup, 'EXTRA LIFE OFF');
{
  fresh('original', { hudScore: 0 }); step(121); game.score = 1234; render(); const a = Array.from(G.fb.slice(180 * 256, 205 * 256));
  settings.hudScore = 1; render(); const b = Array.from(G.fb.slice(180 * 256, 205 * 256));
  ok(a.join() !== b.join(), 'SCORE ON SCREEN draws the score');
}

/* ---------------- hover-and-hold ---------------- */
fresh('original', { swat: 'hover', dwell: 0.5 }); step(121);
{
  const b = G.spawnBug('gnat', { x: 120, y: 120 }); b.v = 0; b.vx = b.vy = 0;
  input.x = 120; input.y = 120;
  step(20); ok(!b.dead && game.stats.shots === 0, 'hovering for less than the hold time does nothing');
  ok(input.dwell > 0, 'hover progress counts up');
  step(15); ok(game.stats.shots === 1, 'holding for 0.5 s swats');
  step(G.SWAT_UP + 2); ok(b.dead, 'and hits');
  input.x = 40; input.y = 180; step(120); eq(game.stats.shots, 1, 'hovering over nothing never swats');
}

/* ---------------- invulnerable ---------------- */
fresh('original', { invuln: 1 }); step(121);
{
  ok(!G.badgeEl.classList.contains('hidden'), 'INVULNERABLE badge shown');
  for (let i = 0; i < 5; i++) { G.sting(); step(20); }
  eq(game.lives, 3, 'stings never cost a life'); eq(game.glove.state, 'ok', 'play carries on');
  ok(game.stats.stings === 5, 'stings still counted for the stats');
  G.sting(); ok(game.glove.flash > 0, 'a harmless flash shows the hit');
  // explosions and children also harmless
  const h = G.handRect(); const bb = G.spawnBug('bomb', { x: h.x0 + 4, y: h.y0 + 4 }); step(80);
  eq(game.lives, 3, 'bomb explosion harmless');
  game.score = 999; G.endSession(false);
  eq(G.getHigh(G.highKey('original', 1)), 999, 'invulnerable high score kept separately');
  eq(G.getHigh(G.highKey('original', 0)), 0, 'real table untouched');
}
fresh('original'); ok(G.badgeEl.classList.contains('hidden'), 'no badge when off');

/* ---------------- stats and history ---------------- */
fresh('original'); step(121);
{
  const b1 = G.spawnBug('gnat', { x: 120, y: 120 }); b1.v = 0; b1.vx = b1.vy = 0; b1.born = game.frame - 60;
  swatAt(120, 120);                 // hit (about 1 s after it appeared)
  swatAt(40, 180);                  // miss
  for (let i = 0; i < 3; i++) { const b = G.spawnBug('gnat', { x: 120, y: 120 }); b.v = 0; b.vx = b.vy = 0; b.born = game.frame; swatAt(120, 120); }
  const s = G.summarise(game.stats);
  eq(s.shots + '/' + s.hits + '/' + s.acc, '5/4/80', 'accuracy 4 of 5');
  eq(s.best, 3, 'best streak counts consecutive hits');
  ok(s.react > 0.1 && s.react < 0.6, 'average time to swat (' + s.react + ')');
  game.score = 70; G.endSession(false);
  const hist = G.loadJSON('history', []); eq(hist.length, 1, 'session recorded in history');
  eq(hist[0].acc, 80, 'history keeps accuracy');
  const ps = G.loadJSON('stats.original', null); ok(ps && ps.sessions === 1 && ps.best === 3, 'per-preset mouse-skill totals');
  eq(G.getHigh(G.highKey('original', 0)), 70, 'high score per preset');
  for (let i = 0; i < 12; i++) { fresh('kid', null, true); step(122); swatAt(40, 180); G.endSession(false); }
  eq(G.loadJSON('history', []).length, 10, 'history keeps the last 10');
  ok(/LAST 10 GAMES/.test(G.historyHTML()), 'progress page lists them');
  eq(G.getHigh(G.highKey('kid', 0)), 0, 'kid preset has its own (empty) table');
}

/* ---------------- settings ---------------- */
{
  localStorage._d = {};
  G.applyPreset('kid'); eq(G.presetName(), 'kid', 'preset applied');
  ok(settings.speed < 100 && settings.size === 2 && settings.glove === 2 && settings.attack === 0, 'Kid: slow, big bugs, big swatter, no attackers');
  G.stepKnob('lives', -1); eq(G.presetName(), 'custom', 'touching a knob makes it Custom');
  eq(G.PRESETS.original.lives, 3, 'Original preset untouched');
  const saved = JSON.stringify(settings), stored = localStorage._d[G.LS + 'settings'];
  G.applyPreset('original'); localStorage._d[G.LS + 'settings'] = stored; G.loadSettings(); eq(JSON.stringify(settings), saved, 'settings round-trip through localStorage');
  localStorage._d[G.LS + 'settings'] = '{"speed":"fast","lives":99,"swat":"hover"}';
  G.applyPreset('original'); localStorage._d[G.LS + 'settings'] = '{"speed":"fast","lives":99,"swat":"hover"}'; G.loadSettings();
  ok(settings.speed === 100 && settings.lives === 3 && settings.swat === 'hover', 'bad stored values ignored, good ones kept');
  const orig = global.localStorage; global.localStorage = { getItem() { throw new Error('no'); }, setItem() { throw new Error('no'); }, removeItem() { throw new Error('no'); } };
  let threw = false; try { G.saveSettings(); G.loadSettings(); G.getHigh('x'); } catch (e) { threw = true; }
  global.localStorage = orig; ok(!threw, 'no crash without localStorage');
  for (const p of G.PRESET_ORDER) for (const [k, v] of Object.entries(G.PRESETS[p])) ok(G.KNOB[k].vals.includes(v), p + '.' + k + ' is a legal knob value');
}

/* ---------------- pause / menu ---------------- */
fresh('original'); step(130);
{
  G.togglePause(); const f = game.t; step(30); eq(game.t, f, 'P pauses the game'); G.togglePause(); step(1); eq(game.t, f + 1, 'and resumes');
  G.openMenu(); ok(game.paused, 'Esc opens the menu and pauses'); G.resume(); ok(!game.paused, 'resume');
}

/* ---------------- long runs, render every frame ---------------- */
for (const p of ['original', 'normal', 'easy', 'kid']) {
  let err = null;
  try {
    fresh(p); G.seed(p.length * 99);
    for (let i = 0; i < 6000 && game.mode !== 'menu'; i++) botStep(false);
  } catch (e) { err = e; }
  ok(!err, p + ': 6000 bot frames without an exception' + (err ? ' ' + err.stack : ''));
  ok(game.stats.hits > 10, p + ': the bot swats bugs (' + game.stats.hits + ')');
}
{ // a careless bot (always misses) gets stung and reaches game over at Original
  let err = null;
  try { fresh('original', { startLevel: 3 }); for (let i = 0; i < 20000 && game.mode !== 'menu'; i++) botStep(true); } catch (e) { err = e; }
  ok(!err, 'missing bot runs cleanly' + (err ? ' ' + err.stack : ''));
  ok(game.mode === 'menu' && game.lastSummary, 'missing bot loses all lives at level 3');
}
{ // the kid preset bot clears all three levels and loops
  let err = null;
  try { fresh('kid', { gnats: 10, bossHits: 3 }); for (let i = 0; i < 40000 && !(game.loop >= 1 && game.mode === 'play'); i++) botStep(false); } catch (e) { err = e; }
  ok(!err, 'kid bot runs cleanly' + (err ? ' ' + err.stack : ''));
  ok(game.loop >= 1, 'kid bot beats King Watinga three times and loops (loop=' + game.loop + ', level=' + game.level + ')');
}
{ // invulnerable at full Original difficulty can never lose
  let err = null;
  try { fresh('original', { invuln: 1, startLevel: 3 }); for (let i = 0; i < 10000; i++) botStep(true); } catch (e) { err = e; }
  ok(!err && game.lives >= 3 && game.stats.stings > 10 && game.mode !== 'menu' && game.mode !== 'gameover', 'invulnerable bot survives 10000 frames of level 3');
}
{ // every mode renders
  let err = null;
  try { for (const m of ['menu', 'intro', 'play', 'boss', 'clear', 'gameover']) { fresh('original'); step(121); if (m === 'boss') G.startBoss(); if (m === 'clear') G.startClear(); if (m === 'gameover') G.gameOver(); if (m === 'menu') G.quitToMenu(); step(200); } } catch (e) { err = e; }
  ok(!err, 'every screen renders' + (err ? ' ' + err.stack : ''));
}

console.log(passed + ' passed, ' + failed + ' failed');
if (failed) { console.log('TESTS FAILED'); process.exit(1); }
console.log('all tests passed');
