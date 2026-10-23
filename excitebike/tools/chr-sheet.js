/* Renders the CHR ROM as a labelled sheet: node tools/chr-sheet.js [out.png] */
const { chr } = require('./rom.js'); const { encodePNG } = require('./png.js');
const S = 3, W = 2 * (16 * 9 + 1), H = 16 * 9 + 1;
const pal = [[0, 0, 80], [255, 255, 255], [240, 140, 40], [200, 30, 30]];
const rgb = Buffer.alloc(W * S * H * S * 3, 40);
function px(x, y, c) { for (let dy = 0; dy < S; dy++) for (let dx = 0; dx < S; dx++) { const i = ((y * S + dy) * W * S + x * S + dx) * 3; rgb[i] = c[0]; rgb[i + 1] = c[1]; rgb[i + 2] = c[2]; } }
for (let t = 0; t < 512; t++) {
  const half = t >> 8, tt = t & 255, ox = half * (16 * 9 + 1) + 1 + (tt % 16) * 9, oy = 1 + (tt >> 4) * 9;
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    const p0 = chr[t * 16 + y], p1 = chr[t * 16 + y + 8], b = 7 - x;
    px(ox + x, oy + y, pal[((p0 >> b) & 1) | (((p1 >> b) & 1) << 1)]);
  }
}
encodePNG(process.argv[2] || 'tools/out/chr.png', W * S, H * S, rgb);
