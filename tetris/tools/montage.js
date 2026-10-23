/* Renders several scenarios with render-frame.js and lays them out on one PNG.
     node tools/montage.js out.png scenario1 scenario2 ...   (scale 1 each) */
const { execFileSync } = require('child_process');
const path = require('path');
const { decodePNG, encodePNG } = require('./png.js');
const out = process.argv[2], list = process.argv.slice(3);
const cols = Math.min(4, list.length), W = 256, H = 224;
const big = Buffer.alloc(cols * W * Math.ceil(list.length / cols) * H * 3);
const BW = cols * W;
list.forEach((s, i) => {
  const f = path.join(__dirname, 'out', 'm_' + s + '.png');
  console.log(execFileSync('node', [path.join(__dirname, 'render-frame.js'), s, f, '1']).toString().trim());
  const p = decodePNG(f), ox = (i % cols) * W, oy = Math.floor(i / cols) * H;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = p.pixel(x, y), o = ((oy + y) * BW + ox + x) * 3; big[o] = c[0]; big[o + 1] = c[1]; big[o + 2] = c[2]; }
});
encodePNG(out, BW, Math.ceil(list.length / cols) * H, big);
