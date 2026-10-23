/* Writes a side-by-side PNG of our maze next to the arcade reference frame,
   upscaled so it can actually be looked at.  Use it for a visual gut check
   after changing anything in drawWalls().

     node tools/compare-image.js [scale]        -> tools/out/compare.png

   Note the left side is drawn by the crude rasteriser in render-maze.js, so
   curves show up ~1px fatter than Chrome draws them.  Judge line POSITIONS
   here, not curve weight. */
const fs = require('fs');
const path = require('path');
const { decodePNG, encodePNG } = require('./png.js');
const { renderMaze } = require('./render-maze.js');

const REF = path.join(__dirname, '..', 'reference', 'pacman-arcade-frame.png');
const HEADER_PX = 24;
const SCALE = Math.max(1, parseInt(process.argv[2] || '3', 10));
const GAP = 6;

const shot = decodePNG(REF);
const mine = renderMaze();
const { W, H } = mine;

const outW = (W * 2 + GAP) * SCALE, outH = H * SCALE;
const out = Buffer.alloc(outW * outH * 3, 0);
const put = (x, y, rgb) => {
  for (let sy = 0; sy < SCALE; sy++) for (let sx = 0; sx < SCALE; sx++) {
    const i = ((y * SCALE + sy) * outW + x * SCALE + sx) * 3;
    out[i] = rgb[0]; out[i + 1] = rgb[1]; out[i + 2] = rgb[2];
  }
};
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  put(x, y, mine.pixel(x, y));
  put(W + GAP + x, y, shot.pixel(x, HEADER_PX + y));
}

const dir = path.join(__dirname, 'out');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, 'compare.png');
encodePNG(file, outW, outH, out);
console.log('wrote ' + file + '  (' + outW + 'x' + outH + ', left: ours, right: arcade)');
