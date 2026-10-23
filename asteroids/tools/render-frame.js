/* Renders real frames of the game headlessly and writes them as PNGs,
   so the vector art can be eyeballed without a browser.
     node tools/render-frame.js        -> tools/out/title.png, tools/out/play.png
   The harness canvas records every stroke; this file rasterises those
   lines (with a soft glow) into an RGB buffer and encodes it. */
require('./harness.js');
const fs = require('fs');
const path = require('path');
const { encodePNG } = require('./png.js');

const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
let src = HTML.slice(HTML.indexOf('<script>') + 8, HTML.lastIndexOf('</script>'));
src = src.trimEnd().slice(0, -'})();'.length) +
  '\nglobalThis.__A = { game, update, render, seedRng, applyPreset, VIEW_W, VIEW_H };\n})();';
fs.writeFileSync(path.join(__dirname, '.frame.build.js'), src);
require(path.join(__dirname, '.frame.build.js'));
const A = globalThis.__A;
const ctx = globalThis.__elements.screen.getContext();
const W = A.VIEW_W, H = A.VIEW_H;

function parseRGBA(s) {
  const m = /rgba?\(([^)]+)\)/.exec(s);
  if (!m) return [255, 255, 255, 1];
  const p = m[1].split(',').map(Number);
  return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
}
function rasterise(ctx) {
  const buf = new Float32Array(W * H * 3);
  function add(x, y, r, g, b, a) {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 3;
    buf[i] += r * a; buf[i + 1] += g * a; buf[i + 2] += b * a;
  }
  function blob(x, y, radius, r, g, b, a) {
    for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) {
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > radius) continue;
      add(x + dx, y + dy, r, g, b, a * (1 - d / (radius + 1)));
    }
  }
  for (const l of ctx.lines) {
    const [x0, y0, x1, y1, style, lw] = l;
    const [r, g, b, a] = parseRGBA(style);
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
    const radius = Math.max(0, Math.round(lw / 2));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      blob(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, radius, r, g, b, a * (radius ? 0.5 : 1));
    }
  }
  for (const d of ctx.dots) {
    const [x, y, radius, style] = d;
    const [r, g, b, a] = parseRGBA(style);
    blob(x, y, Math.round(radius), r, g, b, a);
  }
  const out = Buffer.alloc(W * H * 3);
  for (let i = 0; i < out.length; i++) out[i] = Math.min(255, Math.round(buf[i]));
  return out;
}
function snap(name) {
  ctx.resetRecording();
  A.render();
  const dir = path.join(__dirname, 'out');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const file = path.join(dir, name + '.png');
  encodePNG(file, W, H, rasterise(ctx));
  console.log('wrote', file, '(' + ctx.lines.length + ' lines, ' + ctx.dots.length + ' dots)');
}

A.seedRng(0x12, 0x34);
for (let i = 0; i < 90; i++) A.update();
snap('title');

A.applyPreset('original');
globalThis.__elements.play.click();
const g = A.game;
for (let i = 0; i < 700; i++) {
  g.input.thrust = i > 200 && i < 260;
  g.input.left = i > 150 && i < 190;
  g.input.fire = (i > 300 && i % 20 < 2) || (i > 420 && i < 423);
  A.update();
}
// make sure something is exploding and a saucer is on screen for the picture
if (!g.saucer) { g.scrTimer = 1; g.astBreakTimer = 0; for (let i = 0; i < 8; i++) A.update(); }
snap('play');
