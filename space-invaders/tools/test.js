/* Headless tests for the Space Invaders clone.  Runs the real game (including
   render() every frame) under the DOM stub and asserts the arcade rules at
   the "Original" preset, the kid-mode knobs, invulnerability and persistence.
     node tools/test.js            -> must end with "all tests passed" */
require('./harness.js');
const { build } = require('./build.js');
const G = build();
const { game, settings, input, update, render, FB } = G;

let failures = 0;
function check(name, cond, extra) {
  if (cond) console.log('  ok   ' + name);
  else { failures++; console.log('  FAIL ' + name + (extra !== undefined ? '  -> ' + extra : '')); }
}
function section(name) { console.log('\n[' + name + ']'); }

/* ---------- driving helpers ---------- */
function frames(n, fn) {
  for (let i = 0; i < n; i++) { if (fn) fn(i); update(); render(); }
}
function clearInput() { input.left = input.right = input.fire = false; }
function startOriginal(overrides) {
  G.applyPreset('original');
  settings.invulnerable = 0;
  if (overrides) Object.assign(settings, overrides);
  clearInput();
  G.startPlaying();
  frames(176);                      // "PLAY PLAYER<1>" prompt (176 frames, then play with no alien tick yet)
  if (game.state !== 'play') throw new Error('expected play after the prompt, got ' + game.state);
}
function untilCannon() { while (game.P.timer > 0) frames(1); frames(1); }
function popcount(bytes) { let n = 0; for (const b of bytes) for (let k = 0; k < 8; k++) if (b & (1 << k)) n++; return n; }
function overlayHidden() { return globalThis.__elements['overlay'].classList.contains('hidden'); }
function activeBombs() { return [game.roll, game.plunger, game.squig].filter(s => s.status & 0x80).length; }
/* aim the cannon so the shot column is x and fire; returns when the shot is gone */
function shootAt(x) {
  game.P.x = x - 8;
  input.fire = true; frames(2); input.fire = false;
  let n = 0;
  while (game.shot.status !== 0 && n++ < 200) frames(1);
}

/* ---------- 1. art: the ROM bitmaps ---------- */
section('art');
check('squid frame 0 is the 8-wide 1C20 bitmap', G.ALIEN_SPR[2][0][4] === 0x19 && G.ALIEN_SPR[2][0][11] === 0x19 && G.ALIEN_SPR[2][0][3] === 0);
check('octopus frame 0 is the 12-wide 1C00 bitmap', G.ALIEN_SPR[0][0][2] === 0x39 && G.ALIEN_SPR[0][0][13] === 0x39);
check('crab frame 1 is the 1C40 bitmap', G.ALIEN_SPR[1][1][3] === 0x0E && G.ALIEN_SPR[1][1][7] === 0x3D);
check('cannon is the 1C60 bitmap', G.PLAYER_SPR.join() === [0,0,0x0F,0x1F,0x1F,0x1F,0x1F,0x7F,0xFF,0x7F,0x1F,0x1F,0x1F,0x1F,0x0F,0].join());
check('shield is 22 columns x 2 bytes', G.SHIELD_SPR.length === 44 && G.SHIELD_SPR[0] === 0xFF && G.SHIELD_SPR[1] === 0x0F);
check('saucer is 24 columns', G.SAUCER_SPR.length === 24 && G.SAUCER_SPR[11] === 0x7E);
check('font A glyph (1E00)', G.FONT['A'][1] === 0x1F && G.FONT['A'][3] === 0x44);
check('font digits 0 and 1', G.FONT['0'][1] === 0x3E && G.FONT['1'][3] === 0x7F);
const SHIELD_BITS = popcount(G.SHIELD_SPR);
check('shield bitmap has 294 set pixels', SHIELD_BITS === 294, SHIELD_BITS);

/* ---------- 2. boot ---------- */
section('boot');
check('booted into the menu', game.state === 'menu');
check('raf registered', typeof globalThis.__raf === 'function');
check('score header drawn in the HUD band', G.countPixels(0, 223, 240, 247) > 200);
check('four shields drawn on the menu backdrop', G.shieldPixels() === 4 * SHIELD_BITS, G.shieldPixels());
check('colour zones: saucer row red, shields green, aliens white', G.zoneColor(100, 44)[0] === 255 && G.zoneColor(100, 44)[1] === 32 &&
  G.zoneColor(100, 200)[1] === 255 && G.zoneColor(100, 200)[0] === 32 && G.zoneColor(100, 100).join() === '255,255,255');

/* ---------- 3. presets and knobs ---------- */
section('presets');
G.applyPreset('kid');
check('kid preset recognised', G.presetName() === 'kid');
const origSnapshot = JSON.stringify(G.PRESETS.original);
G.stepKnob('lives', 1);
check('touching a knob makes the preset custom', G.presetName() === 'custom');
G.applyPreset('original');
check('original preset: 3 lives, bonus at 1500, 100% everything', settings.lives === 3 && settings.extraLife === 1500 &&
  settings.stepRate === 100 && settings.bombRate === 100 && settings.playerSpeed === 100 && settings.shields === 4 && settings.shieldRepair === 0);
G.stepKnob('stepRate', -1); G.stepKnob('bombRate', 1);
check('knob edits never change the Original preset values', JSON.stringify(G.PRESETS.original) === origSnapshot);
G.applyPreset('original');
settings.invulnerable = 1;
check('invulnerable does not change the preset name', G.presetName() === 'original');
check('invulnerable high scores use their own key', G.highKey() === 'spaceinvaders.high.original.inv');
settings.invulnerable = 0;
check('plain high score key', G.highKey() === 'spaceinvaders.high.original');

/* ---------- 4. the rack at Original ---------- */
section('rack (Original)');
startOriginal();
check('wave 1 reference alien at Yr 0x78, x 24, moving right', game.refYr === 0x78 && game.refX === 24 && game.dx === 2 && game.rackDir === 0);
check('55 aliens alive', game.numAliens === 55);
frames(54);
check('one alien drawn per frame: 54 placed after 54 frames, alien 0 first', game.alienPos.slice(0, 54).every(p => p !== null) && game.alienPos[54] === null && game.alienPos[0].x === 24);
check('rack has not stepped before the cursor wraps', game.refX === 24);
frames(1);
check('rack steps 2 px when the cursor passes the last alien (frame 55)', game.refX === 26 && game.alienPos[54] !== null);
frames(1);
check('alien 0 redrawn at the new position on frame 56', game.alienPos[0].x === 26);
frames(54);
check('next step 55 frames later', game.refX === 28);
check('animation frame toggles with each step', game.animFrame === 0);
check('player cannot move yet (128-frame delay) but aliens do', game.P.timer > 0);
// run until the right edge bump
let bumpFrame = -1, maxRefX = 0;
for (let i = 0; i < 2000 && bumpFrame < 0; i++) { frames(1); maxRefX = Math.max(maxRefX, game.refX); if (game.rackDir === 1) bumpFrame = i; }
check('rack reverses at the right edge', bumpFrame > 0 && game.dx === -2);
check('right bump when the reference alien is at x 40 (rightmost octopus column 13 touching column 213)', maxRefX === 40, maxRefX);
check('a reversal queues an 8 px drop', game.dy === -8);
const yrBefore = game.refYr;
let dropped = false;
for (let i = 0; i < 60 && !dropped; i++) { frames(1); if (game.refYr === yrBefore - 8) dropped = true; }
check('rack dropped 8 px on the next step and now moves left', dropped && game.dx === -2);
check('saucer timer does not run until the rack has dropped below 0x78', game.tillSaucer === 0x600 || game.refYr < 0x78);

// speed-up: fewer aliens => shorter period
for (let i = 5; i < 55; i++) game.alive[i] = 0;
game.alienPos.fill(null);
frames(1);
const rx = game.refX;
frames(5);
check('with 5 aliens the rack steps every 5 frames', Math.abs(game.refX - rx) === 2, game.refX - rx);
// one alien: right delta 3
for (let i = 1; i < 55; i++) game.alive[i] = 0;
game.numAliens = 1; game.curIndex = 0;
game.rackDir = 1; game.dx = -2; game.dy = 0; game.refX = 7; game.alienAcc = 0;   // octopus column 2 lands on screen column 9
G.clearPlayField();
frames(1);
check('last alien moves right at 3 px per step', game.dx === 3 && game.rackDir === 0, game.dx);

/* ---------- 5. the cannon ---------- */
section('cannon (Original)');
startOriginal({ bombRate: 0 });      // no bombs so the cannon survives the measurements
untilCannon();
check('cannon appears at the left edge after the delay', game.P.x === G.PLAYER_MIN_X && game.P.timer === 0);
check('cannon drawn in the framebuffer', G.countPixels(16, 31, 32, 39) === popcount(G.PLAYER_SPR));
input.right = true; frames(10); input.right = false;
check('moves 1 px per frame', game.P.x === G.PLAYER_MIN_X + 10, game.P.x);
input.right = true; frames(400); input.right = false;
check('stops at the right limit (Xr 0xD9)', game.P.x === G.PLAYER_MAX_X, game.P.x);
input.left = true; frames(400); input.left = false;
check('stops at the left limit (Xr 0x30)', game.P.x === G.PLAYER_MIN_X, game.P.x);

/* ---------- 6. the player shot ---------- */
section('player shot (Original)');
game.alienExploding = 1; game.expTimer = 1e9;   // freeze the rack and empty the field so the column is clear
G.clearPlayField();
game.P.x = 100;
input.fire = true; frames(1);
check('fire starts a shot', game.shot.status === 1 || game.shot.status === 2);
frames(1);
check('shot starts at Yr 0x28 above the cannon centre', game.shot.x === 108 && game.shot.yr >= 0x28 && game.shot.yr <= 0x2C, game.shot.yr);
const sy = game.shot.yr;
frames(5);
check('shot climbs 4 px per frame', game.shot.yr - sy === 20, game.shot.yr - sy);
frames(1);
check('holding fire does not spawn a second shot', game.shot.status === 2 && game.shot.yr - sy === 24);
let explodedAtTop = false;
for (let i = 0; i < 80; i++) { frames(1); if (game.shot.status === 3) { explodedAtTop = true; break; } }
check('shot explodes when it reaches Yr 0xD8', explodedAtTop && game.shot.yr + 2 >= 0xD8, game.shot.yr);
frames(2);
check('top explosion is the 8-wide 1C91 bitmap', G.countPixels(game.shot.x, game.shot.x + 7, game.shot.yr, game.shot.yr + 7) === popcount([0x99,0x3C,0x7E,0x3D,0xBC,0x3E,0x7C,0x99]));
frames(16);
check('explosion lasts 16 frames then the shot is free', game.shot.status === 0);
check('shot count advanced the saucer score pointer', game.shotCount === 1 && game.sauScoreIdx === 1);
frames(3);
check('fire must be released before the next shot', game.shot.status === 0);
input.fire = false; frames(2); input.fire = true; frames(2); input.fire = false;
check('released and pressed again -> new shot', game.shot.status === 2);
while (game.shot.status !== 0) frames(1);

/* ---------- 7. scoring ---------- */
section('scoring');
startOriginal({ stepRate: 25, bombRate: 0, shields: 0 });   // slow rack, no bombs, no bunker in the way (scoring itself is Original)
untilCannon();
frames(4);
check('alien 0 (bottom-left octopus) drawn', !!game.alienPos[0]);
let before = game.score, rxFreeze = game.refX;
shootAt(game.alienPos[0].x + 8);
check('bottom row octopus scores 10', game.score - before === 10, game.score - before);
check('alien 0 is dead and the count is 54', game.alive[0] === 0 && game.numAliens === 54);
check('alien explosion lasts 16 frames and the rack is frozen meanwhile', game.refX === rxFreeze);
check('explosion erased: cell empty', G.countPixels(game.alienPos[11].x, game.alienPos[11].x + 15, game.refYr, game.refYr + 7) === 0);
before = game.score; shootAt(game.alienPos[11].x + 8);
check('second row octopus scores 10', game.score - before === 10, game.score - before);
before = game.score; shootAt(game.alienPos[22].x + 8);
check('third row crab scores 20', game.score - before === 20, game.score - before);
before = game.score; shootAt(game.alienPos[33].x + 8);
check('fourth row crab scores 20', game.score - before === 20, game.score - before);
before = game.score; shootAt(game.alienPos[44].x + 8);
check('top row squid scores 30', game.score - before === 30, game.score - before);
check('score shown as 4 digits in the HUD', G.countPixels(24, 55, 224, 231) > 0 && game.score === 90);
check('reload rate table: <300 -> 0x30, <1100 -> 0x10, <2100 -> 0x0B, <3100 -> 8, else 7',
  G.reloadRate(0) === 0x30 && G.reloadRate(299) === 0x30 && G.reloadRate(300) === 0x10 && G.reloadRate(1099) === 0x10 &&
  G.reloadRate(1100) === 0x0B && G.reloadRate(2100) === 8 && G.reloadRate(3100) === 7);
check('fleet sound delay: 55 aliens -> 52 frames, 1 alien -> 5', G.fleetDelay(55) === 52 && G.fleetDelay(43) === 46 && G.fleetDelay(1) === 5);

/* ---------- 8. the mystery ship ---------- */
section('mystery ship');
check('saucer score table (1D54): 300 on the 8th, 23rd, 38th shot', G.saucerScoreForShot(8) === 300 && G.saucerScoreForShot(23) === 300 &&
  G.saucerScoreForShot(38) === 300 && G.saucerScoreForShot(1) === 50 && G.saucerScoreForShot(0) === 100 && G.saucerScoreForShot(22) === 50);
check('only 15 of the 16 table entries are ever used', G.SAUCER_SCORES.length === 15);
startOriginal();
untilCannon();
game.refYr = 0x70;                        // the rack has dropped once: the saucer timer runs
game.tillSaucer = 3;
let appeared = -1;
for (let i = 0; i < 400 && appeared < 0; i++) { frames(1); if (game.saucer.active) appeared = i; }
check('saucer appears once the timer expires (period 0x600 frames)', appeared >= 0 && game.tillSaucer > 0x600 - 420);
check('saucer flies at Yr 0xD0 in the red band', game.saucer.active === 1 && G.countPixels(0, 223, 0xD0, 0xD7) > 0);
const sx0 = game.saucer.x;
frames(30);
check('saucer moves 2 px every 3 frames', Math.abs(game.saucer.x - sx0) === 20, game.saucer.x - sx0);
check('no squiggly shot while the saucer is up', !(game.squig.status & 0x80));
game.sauScoreIdx = 8;                    // as after the 23rd shot
before = game.score;
game.saucer.hit = 1;
frames(3 * 9);
check('saucer hit: explosion then score text after 8 ticks', game.score - before === 300 && game.saucer.scoreStr === '300', game.score - before);
frames(3 * 24 + 3);
check('saucer cleaned up after the hit sequence', game.saucer.active === 0 && G.countPixels(0, 223, 0xD0, 0xD7) === 0);
for (let i = 7; i < 55; i++) game.alive[i] = 0;
game.saucer.start = 1; game.squig = Object.assign(game.squig, { stepCnt: 0, status: 0 });
frames(60);
check('no saucer with fewer than 8 aliens', game.saucer.active === 0);

/* ---------- 9. alien bombs ---------- */
section('alien bombs (Original)');
startOriginal();
untilCannon();
check('aliens may not fire for 48 frames after the cannon appears', game.enableAlienFire === 0);
frames(48);
check('alien fire enabled', game.enableAlienFire === 1);
let firstBomb = null;
for (let i = 0; i < 300 && !firstBomb; i++) { frames(1); firstBomb = [game.roll, game.plunger, game.squig].find(s => s.status & 0x80) || null; }
check('a bomb is fired', !!firstBomb);
const by0 = firstBomb.yr, bx0 = firstBomb.x;
frames(30);
check('bombs fall 4 px every 3 frames', (firstBomb.status & 0x80) && by0 - firstBomb.yr === 40, by0 - firstBomb.yr);
check('bomb is 3 px wide and starts under an alien column', G.countPixels(bx0, bx0 + 2, firstBomb.yr, firstBomb.yr + 7) > 0 && ((bx0 - 7 - game.refX) % 16) === 0);
let maxBombs = 0;
for (let i = 0; i < 600; i++) { frames(1); maxBombs = Math.max(maxBombs, activeBombs()); }
check('below 300 points only one bomb is in flight at a time', maxBombs === 1, maxBombs);
// shield erosion by bombs: park under shield 0 with the rack frozen high and the player safe-ish
startOriginal();
untilCannon();
game.P.x = G.SHIELD_X[0] + 3;
settings.invulnerable = 1;
const sp0 = G.shieldPixels();
frames(1500);
check('bombs erode the shields pixel by pixel', G.shieldPixels() < sp0, G.shieldPixels() + ' < ' + sp0);
settings.invulnerable = 0;
check('bomb types use the real bitmaps', G.ROLLING[1][0] === 0x24 && G.PLUNGER[0][1] === 0xFC && G.SQUIGGLY[0][1] === 0xAA);
check('column-fire table (1D00) plunger order starts 1,7,1,1,1,4,11', G.COL_FIRE.slice(0, 7).join() === '1,7,1,1,1,4,11');

/* ---------- 10. shields eaten by the rack ---------- */
section('shields vs rack');
startOriginal();
game.refYr = 0x30;                       // put the rack at shield height
game.alienPos.fill(null);
const sp1 = G.shieldPixels();
frames(120);
check('aliens passing through the bunkers erase them', G.shieldPixels() < sp1 - 100, G.shieldPixels() + ' vs ' + sp1);

/* ---------- 11. death, lives, invulnerability ---------- */
section('death and lives');
function bombThePlayer() {
  const s = game.roll;
  Object.assign(s, { status: 0x80, stepCnt: 5, img: G.ROLLING[0], size: 3, x: game.P.x + 7, yr: 0x27 + 6, imgIdx: 0 });
}
startOriginal();
untilCannon();
check('3 ships: 2 in reserve shown', game.ships === 2);
bombThePlayer();
let died = false;
for (let i = 0; i < 12 && !died; i++) { frames(1); if (game.P.alive !== 0xFF) died = true; }
check('a bomb in the cannon band kills the player', died);
frames(5);                                // first blow-up tick: playerOK drops
check('first explosion frame after 5 frames', game.playerOK === 0 && game.P.expCount === 11);
const rxDead = game.refX, cur = game.curIndex;
frames(10);
check('rack freezes while the cannon explodes', game.refX === rxDead && game.curIndex === cur);
check('explosion sprite drawn over the cannon', G.countPixels(game.P.x, game.P.x + 15, 32, 39) > 0);
frames(50);
check('after 12 x 5 frames the cannon is gone and a ship was taken', game.P.alive === 0xFF && game.P.timer >= 120 && game.ships === 1, game.P.timer);
check('cannon area empty during the respawn delay', G.countPixels(16, 200, 32, 39) === 0);
check('aliens stay frozen until the cannon returns', game.playerOK === 0);
untilCannon();
check('cannon respawns at the left', game.P.x === G.PLAYER_MIN_X);
check('rack moving again', game.playerOK === 1);

// invulnerable
startOriginal();
settings.invulnerable = 1;
untilCannon();
bombThePlayer();
frames(12);
check('invulnerable: the bomb explodes but the player does not die', game.P.alive === 0xFF && game.ships === 2 && game.flash > 0);
settings.invulnerable = 0;

// game over on last ship
startOriginal();
untilCannon();
game.ships = 0;
bombThePlayer();
frames(80);
check('losing the last ship ends the game', game.state === 'gameover');
frames(60);
check('GAME OVER printed with the ROM font', G.countPixels(72, 143, 192, 199) > 0);
frames(130);
check('game-over overlay shown afterwards', !overlayHidden());

// invasion
startOriginal({ lives: 9 });
untilCannon();
game.refYr = 0x20; game.curIndex = 54;   // the cursor wraps to alien 0, which would sit at Yr 32 (< 0x28)
frames(2);
check('rack reaching the cannon row kills the player even with ships left', game.invaded === 1 && game.P.alive !== 0xFF);
frames(70);
check('invasion is game over regardless of lives', game.state === 'gameover' && game.ships > 0);
startOriginal({ lives: 9 });
settings.invulnerable = 1;
untilCannon();
game.refYr = 0x20; game.curIndex = 54;
frames(2);
check('invulnerable: the rack retreats instead', game.state === 'play' && game.refYr === 0x78 && game.invaded === 0);
settings.invulnerable = 0;

/* ---------- 12. extra ships ---------- */
section('extra ships');
startOriginal({ bombRate: 0 });
untilCannon();
const shipsA = game.ships;
game.score = 1490; G.addScore(10);
check('extra ship awarded once at 1500 (DIP default)', game.ships === shipsA + 1 && game.score === 1500, game.ships + ' ' + game.score);
game.score = 2990; G.addScore(10);
check('no second extra ship at 3000', game.ships === shipsA + 1);
check('reserve ships redrawn in the HUD', G.countPixels(24, 135, 8, 15) > 0);
G.applyPreset('kid');
G.startPlaying(); frames(176); untilCannon();
const shipsK = game.ships;
game.score = 990; G.addScore(10);
check('kid preset: extra ship every 1000', game.ships === shipsK + 1);
game.score = 1990; G.addScore(10);
check('... and again at 2000', game.ships === shipsK + 2);
game.score = 2000; G.addScore(2500);
check('a big jump awards every threshold crossed', game.ships === shipsK + 4);

/* ---------- 13. waves ---------- */
section('waves');
check('starting heights: 78,60,50,48,48,48,40,40,40 then 60 again', [1,2,3,4,5,6,7,8,9,10].map(G.rackStartYr).join() ===
  [0x78,0x60,0x50,0x48,0x48,0x48,0x40,0x40,0x40,0x60].join());
startOriginal();
untilCannon();
game.tillSaucer = 7; game.shotCount = 9;
for (let i = 0; i < 55; i++) game.alive[i] = 0;
frames(2);
check('clearing the rack enters the round-end pause', game.state === 'roundend');
frames(60);
check('wave 2 begins with the rack one row lower (Yr 0x60)', game.state === 'play' && game.wave === 2 && game.refYr === 0x60 && game.refX === 24);
check('55 fresh aliens, fresh shields, saucer timer and shot count reset', game.numAliens === 55 && G.shieldPixels() === 4 * SHIELD_BITS &&
  game.tillSaucer > 0x600 - 60 && game.shotCount === 0 && game.P.timer > 0);
startOriginal({ startWave: 3 });
check('starting wave knob: wave 3 starts at Yr 0x50', game.wave === 3 && game.refYr === 0x50);

/* ---------- 14. kid-mode knobs ---------- */
section('knobs');
startOriginal({ stepRate: 50 });
frames(109);
check('alien step rate 50%: rack steps every 110 frames', game.refX === 24);
frames(1);
check('... exactly', game.refX === 26, game.refX);
startOriginal({ playerSpeed: 200 });
untilCannon();
input.right = true; frames(10); input.right = false;
check('cannon speed 200%: 2 px per frame', game.P.x === G.PLAYER_MIN_X + 20, game.P.x);
startOriginal({ lives: 5 });
check('lives knob: 5 ships -> 4 in reserve', game.ships === 4);
startOriginal({ shields: 2 });
check('shields knob: 2 bunkers', G.shieldPixels() === 2 * SHIELD_BITS);
startOriginal({ shields: 0 });
check('shields knob: none', G.shieldPixels() === 0);
startOriginal({ bombRate: 0 });
untilCannon();
frames(1500);
check('bomb frequency 0: no bombs in 1500 frames', activeBombs() === 0 && game.ships === 2);
startOriginal({ shieldRepair: 1, lives: 5, bombRate: 0 });
untilCannon();
game.refYr = 0x30; game.alienPos.fill(null); frames(120);
const spEroded = G.shieldPixels();
game.refYr = 0x78; game.alienPos.fill(null); G.clearPlayField(); frames(1);
bombThePlayer(); frames(80);
check('shield repair: bunkers rebuilt after a life is lost', spEroded < 4 * SHIELD_BITS && G.shieldPixels() === 4 * SHIELD_BITS, G.shieldPixels());
startOriginal({ bombRate: 25, lives: 9 });
settings.invulnerable = 1;
untilCannon(); frames(48);
let bombsIn = 0, lastActive = 0;
for (let i = 0; i < 1800; i++) { frames(1); const a = activeBombs(); if (a > lastActive) bombsIn++; lastActive = a; }
check('bomb frequency 25% fires far fewer bombs than Original', bombsIn > 0 && bombsIn < 14, bombsIn);
settings.invulnerable = 0;

/* ---------- 15. persistence ---------- */
section('persistence');
G.applyPreset('easy');
G.setKnob('lives', 7);
const stored = JSON.parse(globalThis.localStorage.getItem('spaceinvaders.settings'));
check('settings saved to localStorage', stored && stored.lives === 7 && stored.stepRate === 70);
globalThis.localStorage.setItem('spaceinvaders.settings', JSON.stringify({ stepRate: 25, bombRate: 10, lives: 9, invulnerable: 1, startWave: 4, bogus: 1, extraLife: 12345 }));
G.loadSettings();
check('settings round-trip (bad values ignored)', settings.stepRate === 25 && settings.bombRate === 10 && settings.lives === 9 &&
  settings.invulnerable === 1 && settings.startWave === 4 && settings.extraLife === 1000);
settings.invulnerable = 0;
G.applyPreset('original');
startOriginal();
untilCannon();
game.score = 1230; game.ships = 0; game.P.alive = 0; frames(80);
check('high score saved per preset at game over', globalThis.localStorage.getItem('spaceinvaders.high.original') === '1230');
startOriginal(); settings.invulnerable = 1;
untilCannon();
game.score = 9000; game.ships = 0; game.P.alive = 0; frames(80);
check('invulnerable high score kept under its own key, real table untouched',
  globalThis.localStorage.getItem('spaceinvaders.high.original.inv') === '9000' &&
  globalThis.localStorage.getItem('spaceinvaders.high.original') === '1230');
settings.invulnerable = 0;

/* ---------- 16. soak: random play, every state, render each frame ---------- */
section('soak');
let threw = null;
try {
  G.applyPreset('kid');
  G.startPlaying();
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let i = 0; i < 6000; i++) {
    if (i % 17 === 0) { input.left = rnd() < 0.4; input.right = !input.left && rnd() < 0.5; input.fire = rnd() < 0.6; }
    if (i === 2500) G.togglePause();
    if (i === 2520) G.togglePause();
    if (i === 4000) { G.toMenu(); G.applyPreset('original'); G.startPlaying(); }
    update(); render();
  }
  G.toMenu();
  for (let i = 0; i < 2000; i++) { update(); render(); }
} catch (e) { threw = e; }
check('no exceptions across 8000 frames of random play, pause, menu and demo', !threw, threw && (threw.stack || threw));

console.log('\n' + (failures ? failures + ' FAILURE(S)' : 'all tests passed'));
process.exit(failures ? 1 : 0);
