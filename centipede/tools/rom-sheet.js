/* Renders the genuine Centipede picture ROMs (136001-211/212, identical to the
   .201/.202 files in reference/src/revision.v2) to a PNG sheet so the art can be
   inspected:  node tools/rom-sheet.js  ->  reference/sheets/rom-sheet.png
   Top: the 64 playfield stamps (chars 0x40-0x7F), rotated to the display.
   Below: all 128 motion-object pictures (8x16 unrotated = 16x8 on the display). */
const fs = require('fs');
const path = require('path');
const { encodePNG } = require('./png.js');
const R = path.join(__dirname, '..', 'reference');
const lo = fs.readFileSync(path.join(R, 'src/revision.v2/136001.201'));
const hi = fs.readFileSync(path.join(R, 'src/revision.v2/136001.202'));
const PAL = [[40, 40, 40], [0, 255, 0], [255, 0, 0], [255, 255, 192]];
const S = 3, cell = 20;
const W = 16 * cell, H = 4 * cell + 8 * cell + 8;
const img = Buffer.alloc(W * S * H * S * 3, 0x10);
function put(x, y, c) {
  for (let a = 0; a < S; a++) for (let b = 0; b < S; b++) {
    const i = ((y * S + a) * W * S + x * S + b) * 3; img[i] = c[0]; img[i + 1] = c[1]; img[i + 2] = c[2];
  }
}
// unrotated pixel (ux, uy) of a picture starting at byte off, rows = bytes
function px(off, ux, uy) { const b = 7 - ux; return (((hi[off + uy] >> b) & 1) << 1) | ((lo[off + uy] >> b) & 1); }
for (let t = 0; t < 64; t++) {
  const off = (0x40 + t) * 8, ox = (t % 16) * cell + 2, oy = Math.floor(t / 16) * cell + 2;
  for (let uy = 0; uy < 8; uy++) for (let ux = 0; ux < 8; ux++) put(ox + uy, oy + 7 - ux, PAL[px(off, ux, uy)]);
}
for (let s = 0; s < 128; s++) {
  const off = s * 16, ox = (s % 16) * cell + 2, oy = 4 * cell + 8 + Math.floor(s / 16) * cell + 2;
  for (let uy = 0; uy < 16; uy++) for (let ux = 0; ux < 8; ux++) put(ox + uy, oy + 7 - ux, PAL[px(off, ux, uy)]);
}
const out = path.join(R, 'sheets', 'rom-sheet.png');
encodePNG(out, W * S, H * S, img);
console.log('wrote ' + out);
