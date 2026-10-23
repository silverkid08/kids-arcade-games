/* Runs the real game headlessly and writes what the canvas would show to a
   PNG, so the art can be checked with an image viewer (or the Read tool).

     node tools/render-frame.js [scenario] [out.png] [scale]

   scenarios:  menu      the attract/menu backdrop (default)
               play      wave 1 a few seconds in, cannon firing
               action    further in: shields eroded, aliens lower, saucer
               gameover  the GAME OVER text
*/
require('./harness.js');
const path = require('path');
const fs = require('fs');
const { build } = require('./build.js');
const { encodePNG } = require('./png.js');

const scenario = process.argv[2] || 'menu';
const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
const outFile = process.argv[3] || path.join(outDir, scenario + '.png');
const scale = parseInt(process.argv[4] || '3', 10);

const G = build();
const { game, input, update, render, settings } = G;

function frames(n) { for (let i = 0; i < n; i++) update(); }

G.applyPreset('original');
if (scenario !== 'menu') {
  G.startPlaying();
  frames(176 + 1);           // PLAY PLAYER<1> prompt
  frames(130);               // cannon appears, rack has drawn
  if (scenario === 'play') {
    input.right = true; frames(40); input.right = false;
    input.fire = true; frames(2); input.fire = false; frames(20);
  } else if (scenario === 'action' || scenario === 'gameover') {
    // play for a while with a simple bot: fire constantly, drift left/right
    for (let t = 0; t < 60 * 40 && game.state === 'play'; t++) {
      input.fire = (t % 20) < 2;
      input.left = Math.floor(t / 150) % 2 === 0;
      input.right = !input.left;
      update();
    }
    if (scenario === 'gameover') {
      settings.lives = 1;
      game.ships = 0;
      game.P.alive = 0;                       // trigger the death sequence
      for (let t = 0; t < 400 && game.state !== 'gameover'; t++) update();
      frames(70);
    }
  }
}
render();

const { SW, SH, img } = G;
const rgb = Buffer.alloc(SW * scale * SH * scale * 3);
for (let y = 0; y < SH * scale; y++) for (let x = 0; x < SW * scale; x++) {
  const si = ((Math.floor(y / scale)) * SW + Math.floor(x / scale)) * 4;
  const di = (y * SW * scale + x) * 3;
  rgb[di] = img.data[si]; rgb[di + 1] = img.data[si + 1]; rgb[di + 2] = img.data[si + 2];
}
encodePNG(outFile, SW * scale, SH * scale, rgb);
console.log('wrote ' + outFile + '  (state=' + game.state + ', score=' + game.score + ', aliens=' + game.numAliens + ', wave=' + game.wave + ')');
