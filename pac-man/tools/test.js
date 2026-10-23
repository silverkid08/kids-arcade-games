/* Headless tests for the Pac-Man clone. */
require('./harness.js');
const fs = require('fs');
const path = require('path');

const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
let src = HTML.slice(HTML.indexOf('<script>') + 8, HTML.lastIndexOf('</script>'));
const EXPORT = `
globalThis.__PAC = { game, tiles, terrain, walkable, tileX, tileY, totalDots,
  UP, DOWN, LEFT, RIGHT, setWant, update, levelData, MAZE, COLS, ROWS, T,
  OPEN, WALL, DOOR, VOID, DOT, ENERGIZER, ghostTarget, startPellets };
})();`;
if (!src.trimEnd().endsWith('})();')) throw new Error('unexpected file tail');
src = src.trimEnd().slice(0, -'})();'.length) + EXPORT;
fs.writeFileSync(path.join(__dirname, '.game.build.js'), src);

let failures = 0;
function check(name, cond, extra) {
  if (cond) console.log('  ok   ' + name);
  else { failures++; console.log('  FAIL ' + name + (extra !== undefined ? '  -> ' + extra : '')); }
}

/* ---------- 1. static maze checks (independent of the engine) ---------- */
console.log('\n[maze]');
require(path.join(__dirname, '.game.build.js'));
const P = globalThis.__PAC;
const { MAZE, COLS, ROWS, T, tiles, terrain, OPEN, DOT, ENERGIZER } = P;

check('31 rows', MAZE.length === ROWS, MAZE.length);
check('every row is 28 wide', MAZE.every(r => r.length === COLS));

let dots = 0, energizers = 0;
for (const row of MAZE) for (const ch of row) { if (ch === '.') dots++; if (ch === 'o') energizers++; }
check('240 dots', dots === 240, dots);
check('4 energizers', energizers === 4, energizers);
check('totalDots = 244', P.totalDots === 244, P.totalDots);

/* flood fill from Pac-Man's start tile, honouring the tunnel wrap */
function flood(startC, startR) {
  const seen = new Set();
  const q = [[startC, startR]];
  seen.add(startR * COLS + startC);
  while (q.length) {
    const [c, r] = q.pop();
    for (const [dc, dr] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
      let nc = c + dc, nr = r + dr;
      if (nr < 0 || nr >= ROWS) continue;
      if (nc < 0) nc += COLS; else if (nc >= COLS) nc -= COLS;
      if (terrain(nc, nr) !== OPEN) continue;
      const k = nr * COLS + nc;
      if (seen.has(k)) continue;
      seen.add(k); q.push([nc, nr]);
    }
  }
  return seen;
}
const reach = flood(13, 23);
let unreachable = 0;
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  const ch = MAZE[r][c];
  if ((ch === '.' || ch === 'o') && !reach.has(r * COLS + c)) unreachable++;
}
check('every pellet is reachable from the start tile', unreachable === 0, unreachable);
check('tile above the ghost door is reachable', reach.has(11 * COLS + 13));
check('fruit tile (13,17) is reachable', reach.has(17 * COLS + 13));
check('tunnel wraps (col 0 row 14 open)', terrain(0, 14) === OPEN && terrain(-1, 14) === OPEN);
for (const [c, r] of [[12, 11], [15, 11], [12, 23], [15, 23]]) {
  check('no-up tile (' + c + ',' + r + ') is a corridor', terrain(c, r) === OPEN);
}

/* ---------- 2. boot ---------- */
console.log('\n[boot]');
const game = P.game;
check('booted into the menu', game.state === 'menu');
check('maze loaded', game.dotsLeft === 244, game.dotsLeft);
check('raf registered', typeof globalThis.__raf === 'function');

/* ---------- driving helpers ---------- */
const STEP = 1 / 120;
function step(seconds) {
  const n = Math.round(seconds / STEP);
  for (let i = 0; i < n; i++) P.update(STEP);
}
function startGame(ghosts) {
  const btns = globalThis.__elements['pickrow'].children;
  btns[ghosts].listeners.click[0]({});
  globalThis.__elements['play'].click();
}

/* autopilot: walk to the nearest remaining pellet */
function bfsStep() {
  const p = game.pac;
  const c = P.tileX(p), r = P.tileY(p);
  const prev = new Map();
  const startKey = r * COLS + c;
  const q = [[c, r]];
  prev.set(startKey, null);
  let goal = null;
  while (q.length) {
    const [cc, rr] = q.shift();
    if (game.pellets[rr][cc] !== 0 && !(cc === c && rr === r)) { goal = [cc, rr]; break; }
    for (const [dc, dr, d] of [[0, -1, P.UP], [-1, 0, P.LEFT], [0, 1, P.DOWN], [1, 0, P.RIGHT]]) {
      let nc = cc + dc, nr = rr + dr;
      if (nr < 0 || nr >= ROWS) continue;
      if (nc < 0) nc += COLS; else if (nc >= COLS) nc -= COLS;
      if (terrain(nc, nr) !== OPEN) continue;
      const k = nr * COLS + nc;
      if (prev.has(k)) continue;
      prev.set(k, [cc, rr, d]);
      q.push([nc, nr]);
    }
  }
  if (!goal) return null;
  let k = goal[1] * COLS + goal[0], node = prev.get(k), dir = null;
  while (node) { dir = node[2]; k = node[1] * COLS + node[0]; node = prev.get(k); }
  return dir;
}

function legalPositions(label) {
  const p = game.pac;
  const t = terrain(P.tileX(p), P.tileY(p));
  if (t !== OPEN) { failures++; console.log('  FAIL ' + label + ': pac inside terrain ' + t + ' at ' + P.tileX(p) + ',' + P.tileY(p)); return false; }
  for (const g of game.ghosts) {
    if (g.state !== 'out' && g.state !== 'eaten') continue;
    const gt = terrain(P.tileX(g), P.tileY(g));
    if (gt !== OPEN && gt !== P.DOOR) {
      failures++; console.log('  FAIL ' + label + ': ghost ' + g.key + ' inside terrain ' + gt + ' at ' + P.tileX(g) + ',' + P.tileY(g));
      return false;
    }
  }
  return true;
}

/* ---------- 3. full level with 0 ghosts ---------- */
console.log('\n[level clear, 0 ghosts]');
startGame(0);
check('0 ghosts spawned', game.ghosts.length === 0, game.ghosts.length);
check('state is ready', game.state === 'ready');
let ok = true, frames = 0, fruitSpawns = 0, fruitSeen = false, fruitAt = [];
while (game.level === 1 && frames < 120 * 400) {
  const d = bfsStep();
  if (d) P.setWant(d);
  P.update(STEP);
  if (game.fruit && !fruitSeen) { fruitSeen = true; fruitSpawns++; fruitAt.push(game.dotsEaten); }
  if (!game.fruit) fruitSeen = false;
  if (frames % 7 === 0 && ok) ok = legalPositions('0-ghost run');
  frames++;
}
check('pac stayed on open tiles', ok);
check('level 1 cleared', game.level === 2, 'level=' + game.level + ' dotsLeft=' + game.dotsLeft + ' t=' + (frames / 120).toFixed(1) + 's');
check('score = 240 dots + 4 energizers = 2600', game.score === 2600, game.score);
check('fruit appeared twice, at 70 and 170 dots', fruitSpawns === 2 && fruitAt[0] === 70 && fruitAt[1] === 170, fruitAt.join(','));
check('level 2 begins in ready state', game.state === 'ready');

/* fruit collection: park Pac-Man on the fruit tile */
startGame(0);
step(4.5);
while (game.dotsEaten < 70) { const d = bfsStep(); if (d) P.setWant(d); P.update(STEP); }
check('fruit is on screen', !!game.fruit);
const before = game.score;
game.pac.x = game.fruit.x; game.pac.y = game.fruit.y;
P.update(STEP);
check('fruit collected', game.fruitHistory.length === 1 && game.fruit === null);
check('cherry scored 100', game.score - before === 100, game.score - before);

/* ---------- 4. four ghosts, long random-ish run ---------- */
console.log('\n[four ghosts]');
startGame(4);
check('4 ghosts spawned', game.ghosts.length === 4);
check('blinky starts outside', game.ghosts[0].state === 'out');
check('pinky/inky/clyde start in the house', game.ghosts.slice(1).every(g => g.state === 'house'));
check('inky dot limit is 30 on level 1', game.ghosts[2].limit === 30, game.ghosts[2].limit);
check('clyde dot limit is 60 on level 1', game.ghosts[3].limit === 60, game.ghosts[3].limit);

step(5);
check('scatter wave first', game.mode === 'scatter');
const blinkyMovedOut = game.ghosts[0].x !== 112 || game.ghosts[0].y !== 92;
check('blinky started moving', blinkyMovedOut);

ok = true;
let sawFright = false, sawEaten = false, sawChase = false, sawAllOut = false, deaths = 0, maxScore = 0;
let livesBefore = game.lives;
for (let i = 0; i < 120 * 240; i++) {
  if (game.state === 'play') {
    const d = bfsStep();
    if (d) P.setWant(d);
  }
  P.update(STEP);
  if (game.fright > 0) sawFright = true;
  if (game.mode === 'chase') sawChase = true;
  if (game.ghosts.some(g => g.state === 'eaten' || g.state === 'entering')) sawEaten = true;
  if (game.ghosts.every(g => g.state === 'out')) sawAllOut = true;
  if (game.lives < livesBefore) { deaths++; livesBefore = game.lives; }
  if (i % 11 === 0 && ok) ok = legalPositions('4-ghost run');
  maxScore = Math.max(maxScore, game.score);
  if (game.state === 'gameover') break;
}
check('no illegal positions in a 4-ghost run', ok);
check('ghosts all left the house', sawAllOut);
check('chase wave happened', sawChase);
check('energizer triggered fright', sawFright);
check('a ghost was eaten and returned home', sawEaten);
check('score accumulated', maxScore > 1000, maxScore);
check('run reached a sane state', ['play', 'ready', 'dying', 'levelend', 'gameover'].includes(game.state), game.state);
console.log('     (deaths in run: ' + deaths + ', score ' + maxScore + ', level ' + game.level + ')');

/* ---------- 5. targeting rules ---------- */
console.log('\n[ghost targeting]');
startGame(4);
step(2.5);
const [blinky, pinky, inky, clyde] = game.ghosts;
game.mode = 'chase';
const pac = game.pac;
pac.x = 13 * 8 + 4; pac.y = 23 * 8 + 4; pac.dir = P.LEFT;
let t = P.ghostTarget(blinky);
check('blinky targets pac', t.c === 13 && t.r === 23, JSON.stringify(t));
t = P.ghostTarget(pinky);
check('pinky targets 4 ahead', t.c === 9 && t.r === 23, JSON.stringify(t));
pac.dir = P.UP;
t = P.ghostTarget(pinky);
check('pinky up-overflow bug (4 up, 4 left)', t.c === 9 && t.r === 19, JSON.stringify(t));
pac.dir = P.LEFT;
blinky.x = 8 * 8 + 4; blinky.y = 23 * 8 + 4;   // blinky at (8,23)
t = P.ghostTarget(inky);
check('inky doubles the blinky->ahead vector', t.c === 2 * 11 - 8 && t.r === 23, JSON.stringify(t));
clyde.x = 1 * 8 + 4; clyde.y = 29 * 8 + 4;     // far from pac
t = P.ghostTarget(clyde);
check('clyde chases when far', t.c === 13 && t.r === 23, JSON.stringify(t));
clyde.x = 13 * 8 + 4; clyde.y = 26 * 8 + 4;    // within 8 tiles
t = P.ghostTarget(clyde);
check('clyde retreats to his corner when near', t.c === 0 && t.r === 32, JSON.stringify(t));
game.mode = 'scatter';
t = P.ghostTarget(pinky);
check('scatter sends pinky to the top-left', t.c === 2 && t.r === -3, JSON.stringify(t));

/* ---------- 6. level tables ---------- */
console.log('\n[level tables]');
const l1 = P.levelData(1), l5 = P.levelData(5), l21 = P.levelData(21);
check('L1 pac speed 80%', l1.pacSpeed === 0.8);
check('L1 ghost speed 75%', l1.ghostSpeed === 0.75);
check('L1 fright 6s', l1.frightTime === 6);
check('L5 fright 2s', l5.frightTime === 2);
check('L21 no fright', l21.frightTime === 0);
check('L1 fruit is a cherry', l1.fruit.name === 'cherry' && l1.fruit.value === 100);
check('L5 fruit is an apple', l5.fruit.name === 'apple');
check('L1 elroy at 20 dots', l1.elroy1 === 20);

console.log('\n' + (failures ? failures + ' FAILURE(S)' : 'all tests passed'));
process.exit(failures ? 1 : 0);
