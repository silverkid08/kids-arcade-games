/* Renders real frames of the game to PNG under node, using a tiny software
   canvas instead of the harness's no-op context, so the art can be checked
   with an image viewer (or the Read tool) without a browser.
     node tools/render-frame.js            -> reference/out/{title,25m,100m,howhigh}.png
*/
require('./harness.js');
const fs = require('fs');
const path = require('path');
const { encodePNG } = require('./png.js');

/* ---- software canvas ---- */
function parseColour(c) {
  if (c[0] === '#') return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16), 255];
  const m = /rgba?\(([^)]+)\)/.exec(c);
  if (m) { const p = m[1].split(',').map(Number); return [p[0], p[1], p[2], p.length > 3 ? Math.round(p[3] * 255) : 255]; }
  return [255, 0, 255, 255];
}
function softCtx(el) {
  const c = {
    fillStyle: '#000',
    createImageData(w, h) { return { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }; },
    putImageData(img, x, y) {
      for (let yy = 0; yy < img.height; yy++) for (let xx = 0; xx < img.width; xx++) {
        const si = (yy * img.width + xx) * 4, di = ((y + yy) * el.width + (x + xx)) * 4;
        el.data[di] = img.data[si]; el.data[di + 1] = img.data[si + 1]; el.data[di + 2] = img.data[si + 2]; el.data[di + 3] = img.data[si + 3];
      }
    },
    fillRect(x, y, w, h) {
      const [r, g, b, a] = parseColour(c.fillStyle);
      x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
      for (let yy = Math.max(0, y); yy < Math.min(el.height, y + h); yy++) for (let xx = Math.max(0, x); xx < Math.min(el.width, x + w); xx++) {
        const i = (yy * el.width + xx) * 4;
        if (a === 255) { el.data[i] = r; el.data[i + 1] = g; el.data[i + 2] = b; el.data[i + 3] = 255; }
        else { const k = a / 255; el.data[i] = el.data[i] * (1 - k) + r * k; el.data[i + 1] = el.data[i + 1] * (1 - k) + g * k; el.data[i + 2] = el.data[i + 2] * (1 - k) + b * k; el.data[i + 3] = 255; }
      }
    },
    drawImage(img, x, y) {
      x = Math.round(x); y = Math.round(y);
      for (let yy = 0; yy < img.height; yy++) for (let xx = 0; xx < img.width; xx++) {
        const si = (yy * img.width + xx) * 4;
        if (img.data[si + 3] === 0) continue;
        const dx = x + xx, dy = y + yy;
        if (dx < 0 || dy < 0 || dx >= el.width || dy >= el.height) continue;
        const di = (dy * el.width + dx) * 4;
        el.data[di] = img.data[si]; el.data[di + 1] = img.data[si + 1]; el.data[di + 2] = img.data[si + 2]; el.data[di + 3] = 255;
      }
    }
  };
  return c;
}
const origCreate = document.createElement;
function softCanvas(el) {
  let w = 0, h = 0;
  Object.defineProperty(el, 'width', { get() { return w; }, set(v) { w = v; el.data = new Uint8ClampedArray(w * h * 4); } });
  Object.defineProperty(el, 'height', { get() { return h; }, set(v) { h = v; el.data = new Uint8ClampedArray(w * h * 4); } });
  el.getContext = () => el._ctx || (el._ctx = softCtx(el));
  return el;
}
document.createElement = function (tag) { const el = origCreate(tag); return tag === 'canvas' ? softCanvas(el) : el; };
softCanvas(document.getElementById('screen'));

/* ---- run the game ---- */
const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
let src = HTML.slice(HTML.indexOf('<script>') + 8, HTML.lastIndexOf('</script>'));
src = src.trimEnd().slice(0, -'})();'.length) + '\nglobalThis.__DK = { game, settings, update, render, applyPreset, setKnob, STAGE_100, beginStage };\n})();';
const build = path.join(__dirname, '.render.build.js');
fs.writeFileSync(build, src);
require(build);
const D = globalThis.__DK, { game } = D;
const outDir = path.join(__dirname, '..', 'reference', 'out');
fs.mkdirSync(outDir, { recursive: true });
const screen = document.getElementById('screen');
function save(name) {
  const rgb = Buffer.alloc(screen.width * screen.height * 3);
  for (let i = 0; i < screen.width * screen.height; i++) { rgb[i * 3] = screen.data[i * 4]; rgb[i * 3 + 1] = screen.data[i * 4 + 1]; rgb[i * 3 + 2] = screen.data[i * 4 + 2]; }
  encodePNG(path.join(outDir, name + '.png'), screen.width, screen.height, rgb);
  console.log('wrote reference/out/' + name + '.png');
}
function frames(n, inp) { for (let i = 0; i < n; i++) { if (inp) inp(i); D.update(); game.input.jumpEdge = false; } D.render(); }

frames(30);
save('title');
D.applyPreset('original');
globalThis.__elements['play'].click();
frames(60);
save('howhigh');
frames(100); frames(100);     // into the intro
save('intro');
let guard = 0;
while (game.state !== 'play' && guard++ < 1200) { D.update(); game.input.jumpEdge = false; }
frames(60 * 9, i => { game.input.right = i % 400 < 150; game.input.left = i % 400 >= 200 && i % 400 < 300; });
game.input.right = false; game.input.left = false;
game.mario.hammer = 300; game.mario.hammerT = 0;
frames(5);
save('25m');
// 100m
game.stageIndex = 1; D.beginStage(false);
guard = 0;
while (game.state !== 'play' && guard++ < 1200) { D.update(); game.input.jumpEdge = false; }
frames(60 * 5, i => { game.input.right = i < 120; });
game.input.right = false;
save('100m');
