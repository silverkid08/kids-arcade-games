/* Scale up a region of a PNG (with an optional pixel grid) so the Read tool can
   show it legibly, and dump the distinct colours.
     node tools/sheet-view.js <in.png> <out.png> [x y w h] [scale] [grid]
   With no region the whole image is used. */
const { decodePNG, encodePNG } = require('./png.js');
const [,, inFile, outFile, ...rest] = process.argv;
const img = decodePNG(inFile);
let x = 0, y = 0, w = img.w, h = img.h, scale = 6, grid = 8;
if (rest.length >= 4) { [x, y, w, h] = rest.slice(0, 4).map(Number); rest.splice(0, 4); }
if (rest.length) scale = Number(rest.shift());
if (rest.length) grid = Number(rest.shift());
const W = w * scale, H = h * scale;
const rgb = Buffer.alloc(W * H * 3);
const colours = new Map();
for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
  const sx = x + xx, sy = y + yy;
  let p = (sx < img.w && sy < img.h) ? img.pixel(sx, sy) : [40, 40, 40];
  if (img.alpha && img.alpha(sx, sy) === 0) p = [40, 40, 40];
  const key = p.join(',');
  colours.set(key, (colours.get(key) || 0) + 1);
  for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) {
    const gx = (xx * scale + dx), gy = (yy * scale + dy);
    let c = p;
    if (grid && ((xx + x) % grid === 0 && dx === 0 || (yy + y) % grid === 0 && dy === 0)) c = [90, 90, 160];
    const i = (gy * W + gx) * 3;
    rgb[i] = c[0]; rgb[i + 1] = c[1]; rgb[i + 2] = c[2];
  }
}
encodePNG(outFile, W, H, rgb);
console.log(`${inFile}: ${img.w}x${img.h} region ${x},${y} ${w}x${h} -> ${outFile}`);
console.log('colours:', [...colours.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => k + ' x' + n).join(' | '));
