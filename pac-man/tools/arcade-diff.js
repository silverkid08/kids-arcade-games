/* Regression check against the real thing.
 *
 * Decodes reference/pacman-arcade-frame.png (a pixel-perfect arcade frame),
 * classifies each of its 28x31 maze tiles as wall / not-wall, renders the
 * game's own maze code the same way, and diffs the two.
 *
 * Five tiles in the reference frame are covered by ghost and Pac-Man
 * sprites.  Ghost eye pupils are #2121ff - the exact wall blue - so those
 * tiles read as "wall" no matter what the maze says; they are listed below
 * and excluded.  Everything else must match exactly.
 *
 *   node tools/arcade-diff.js
 */
const path = require('path');
const { decodePNG } = require('./png.js');
const { renderMaze, COLS, ROWS, T } = require('./render-maze.js');

const REF = path.join(__dirname, '..', 'reference', 'pacman-arcade-frame.png');
const HEADER_PX = 24;              // the arcade screen has 3 rows of score above the maze

/* tiles hidden behind sprites in the reference frame: [col, row] */
const SPRITE_TILES = [[15, 4], [10, 5], [11, 5], [10, 8], [11, 8]];
const isSprite = (c, r) => SPRITE_TILES.some(t => t[0] === c && t[1] === r);

const isWallBlue = p => p[2] > 120 && p[0] < 110 && p[1] < 110 && p[2] - p[1] > 60;

const shot = decodePNG(REF);
const mine = renderMaze();

function tileGrid(pixel, oy) {
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    let line = '';
    for (let c = 0; c < COLS; c++) {
      let hit = false;
      for (let y = 0; y < T && !hit; y++) {
        for (let x = 0; x < T; x++) {
          if (isWallBlue(pixel(c * T + x, oy + r * T + y))) { hit = true; break; }
        }
      }
      line += hit ? '#' : '.';
    }
    grid.push(line);
  }
  return grid;
}

const arcade = tileGrid(shot.pixel, HEADER_PX);
const ours = tileGrid(mine.pixel, 0);

let bad = 0, excused = 0;
console.log('row  ours                          arcade                        diff');
for (let r = 0; r < ROWS; r++) {
  let mark = '';
  for (let c = 0; c < COLS; c++) {
    if (ours[r][c] === arcade[r][c]) { mark += ' '; continue; }
    if (isSprite(c, r)) { mark += 's'; excused++; continue; }
    mark += 'X'; bad++;
  }
  const flag = mark.includes('X') ? '  <<< MISMATCH' : (mark.includes('s') ? '  (sprite)' : '');
  console.log(String(r).padStart(3) + '  ' + ours[r] + '  ' + arcade[r] + '  ' + mark + flag);
}

/* pixel-level agreement, skipping the band where the sprites sit */
let both = 0, onlyOurs = 0, onlyArcade = 0;
for (let y = 0; y < ROWS * T; y++) {
  for (let x = 0; x < COLS * T; x++) {
    const r = Math.floor(y / T), c = Math.floor(x / T);
    if (isSprite(c, r)) continue;
    const a = isWallBlue(shot.pixel(x, HEADER_PX + y));
    const m = isWallBlue(mine.pixel(x, y));
    if (a && m) both++; else if (m) onlyOurs++; else if (a) onlyArcade++;
  }
}

console.log('\ntile mismatches: ' + bad + '   (excused sprite tiles: ' + excused + ')');
console.log('wall pixels: ' + both + ' shared, ' + onlyOurs + ' ours only, ' + onlyArcade + ' arcade only');
console.log('pixel agreement: ' + (100 * both / (both + onlyOurs + onlyArcade)).toFixed(1) + '%');
console.log(bad === 0 ? '\nmaze matches the arcade' : '\nMAZE DOES NOT MATCH');
process.exit(bad === 0 ? 0 : 1);
