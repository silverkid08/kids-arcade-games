/* Renders game frames headlessly to PNG so the art can be checked with an
   image viewer (or the Read tool):
     node tools/render-frame.js            -> tools/out/menu.png, play.png, level3.png
   Uses the software canvas in harness.js and the game's own render(). */
require('./harness.js');
const fs = require('fs');
const path = require('path');
const { encodePNG } = require('./png.js');
const { load } = require('./load-game.js');

const P = load();
const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

function savePNG(name) {
  P.render();
  const cv = globalThis.__elements['screen'];
  const rgb = Buffer.alloc(cv.width * cv.height * 3);
  for (let i = 0, j = 0; i < cv._buf.length; i += 4, j += 3) { rgb[j] = cv._buf[i]; rgb[j + 1] = cv._buf[i + 1]; rgb[j + 2] = cv._buf[i + 2]; }
  const file = path.join(outDir, name);
  encodePNG(file, cv.width, cv.height, rgb);
  /* and a 3x copy that is easier to look at */
  const S3 = 3, W = cv.width * S3, H = cv.height * S3, big = Buffer.alloc(W * H * 3);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const s = (((y / S3) | 0) * cv.width + ((x / S3) | 0)) * 3, d = (y * W + x) * 3; big[d] = rgb[s]; big[d + 1] = rgb[s + 1]; big[d + 2] = rgb[s + 2]; }
  encodePNG(file.replace('.png', '-3x.png'), W, H, big);
  console.log('wrote ' + file + ' (' + cv.width + 'x' + cv.height + ') and the 3x copy');
}

/* menu backdrop after a few seconds of lane movement */
for (let i = 0; i < 300; i++) P.tick();
savePNG('menu.png');

/* gameplay on the Original preset: hop up a few rows */
P.applyPreset('original');
globalThis.__elements['play'].click();
for (let i = 0; i < 90; i++) P.tick();
const hops = ['up', 'up', 'up'];
for (const h of hops) { P.press(h); for (let i = 0; i < 14; i++) P.tick(); }
savePNG('play.png');

/* level 3 with creatures, a crocodile, the lady frog and a diving turtle */
P.setKnob('level', 3);
globalThis.__elements['play'].click();
for (let i = 0; i < 90; i++) P.tick();
P.game.lady = null; P.game.ladyCool = 0;
for (let i = 0; i < 400; i++) P.tick();
if (!P.game.creatures.some(c => c.active)) { P.game.creatures.forEach(c => { c.cool = 1; }); for (let i = 0; i < 40; i++) P.tick(); }
P.game.bay.counter = 255; P.game.bay.slot = -1; P.tick();
savePNG('level3.png');
P.setKnob('level', 1);
