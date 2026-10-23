/* Prints a pixel-level ASCII view of one region of the maze, ours beside the
   arcade reference, for when arcade-diff.js reports a mismatch and you need
   to see exactly which pixels moved.
 *
 *   node tools/arcade-ascii.js <x> <y> <width> <height>
 *
 * Coordinates are maze pixels: x 0..223, y 0..247 (y=0 is the top wall, the
 * arcade's three score rows are already subtracted).  Tile boundaries are
 * marked with | in the header.  '#' wall blue, 'o' pellet/door peach.
 *
 *   node tools/arcade-ascii.js 0 0 40 20        top-left corner
 *   node tools/arcade-ascii.js 76 96 48 44      the ghost house
 */
const path = require('path');
const { decodePNG } = require('./png.js');
const { renderMaze } = require('./render-maze.js');

const REF = path.join(__dirname, '..', 'reference', 'pacman-arcade-frame.png');
const HEADER_PX = 24;

const x0 = parseInt(process.argv[2] || '0', 10);
const y0 = parseInt(process.argv[3] || '0', 10);
const w = parseInt(process.argv[4] || '48', 10);
const h = parseInt(process.argv[5] || '24', 10);

const shot = decodePNG(REF);
const mine = renderMaze();

const isBlue = p => p[2] > 120 && p[0] < 110 && p[1] < 110;
const isPeach = p => p[0] > 180 && p[1] > 120 && p[1] < 220;
const ch = p => isBlue(p) ? '#' : isPeach(p) ? 'o' : '.';

let ruler = '';
for (let x = x0; x < x0 + w; x++) ruler += (x % 8 === 0 ? '|' : ' ');
console.log('x:' + x0 + '-' + (x0 + w - 1) + '  y:' + y0 + '-' + (y0 + h - 1) +
            '     (left OURS  ||  right ARCADE)');
console.log(ruler + '  ||  ' + ruler);
for (let y = y0; y < y0 + h; y++) {
  let a = '', b = '';
  for (let x = x0; x < x0 + w; x++) {
    a += ch(mine.pixel(x, y));
    b += ch(shot.pixel(x, HEADER_PX + y));
  }
  console.log(a + '  ||  ' + b + '  y=' + y + (y % 8 === 0 ? ' <' : ''));
}
