/* Runs the real game headlessly and writes what the canvas would show to a
   PNG, so the look can be checked with an image viewer (or the Read tool).

     node tools/render-frame.js [scenario] [out.png] [sx] [sy]

   sx / sy are the integer stretch factors (default 3 x 4, close to the
   arcade monitor's ~1.4:1 pixel shape; the browser picks 2 x 3 or 3 x 4).

   scenarios:
     attract   the attract-mode screen behind the menu (full-width paddle)
     serve     a new game waiting for the serve (CLICK TO SERVE badge)
     play      the ball in flight towards the wall
     hit       a few bricks knocked out of the bottom rows
     behind    the ball broken through, bouncing behind the wall
     shrunk    the half-size paddle after the ball hit the back wall
     wall2     the second wall has just appeared
     kid       Kid preset: huge paddle, 4 rows, invulnerable badge
     flash     invulnerable floor bounce flash
     gameover  all balls lost
*/
require('./harness.js');
const path = require('path');
const fs = require('fs');
const { build } = require('./build.js');
const { encodePNG } = require('./png.js');

const scenario = process.argv[2] || 'play';
const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
const outFile = process.argv[3] || path.join(outDir, scenario + '.png');
const sx = parseInt(process.argv[4] || '3', 10), sy = parseInt(process.argv[5] || '4', 10);

const G = build();
const { game, ball, input, update, render, settings } = G;
const frames = n => { for (let i = 0; i < n; i++) update(); };
const until = (f, max) => { for (let i = 0; i < (max || 20000) && !f(); i++) update(); return f(); };
// a simple bot: keeps the paddle centre under the ball, offset by `aim` lines
let aim = 0;
function bot() {
  const p = G.padRect();
  const want = ball.x + 2 + aim;                     // where the paddle centre should be
  input.gx += (want - (p.l + p.r) / 2) * 1.0;
  input.gx = Math.max(-50, Math.min(280, input.gx));
  if (game.serveWait) input.serve = true;
}
const play = (n, f) => { for (let i = 0; i < n && !(f && f()); i++) { bot(); update(); } };

G.applyPreset('original');
G.seed(2024);
if (scenario === 'kid' || scenario === 'flash') G.applyPreset('kid');
if (scenario !== 'attract') G.startGame();

switch (scenario) {
  case 'attract': frames(300); break;
  case 'serve': frames(20); break;
  case 'play': play(3000, () => !game.serveWait && ball.up && ball.y < 120 && ball.y > 100); break;
  case 'hit': play(20000, () => G.bricksLeft() <= 100 && !game.serveWait && ball.y > 120 && !ball.up); break;
  case 'behind': play(60000, () => !game.serveWait && ball.y < 60 && ball.y > 36 && G.bricksLeft() > 10 && game.wall === 1); break;
  case 'shrunk': play(60000, () => game.shrunk && !game.serveWait && ball.y > 150 && !ball.up); break;
  case 'wall2': {
    game.bricks.fill(0); game.bricks[7 * 14 + 6] = 1; game.score = 447;
    play(20000, () => game.wall === 2); frames(1); break;
  }
  case 'kid': play(600, () => !game.serveWait && ball.y > 150 && ball.up); break;
  case 'flash': {
    play(300, () => !game.serveWait);
    input.gx = ball.x > 114 ? 0 : 227;               // move away and let it hit the floor
    until(() => game.flash > 10, 3000); break;
  }
  case 'gameover': {
    input.gx = 0;
    for (let i = 0; i < 40000 && game.mode === 'play'; i++) { input.serve = true; update(); }
    break;
  }
}
render();

const { W, H, img } = G;
const data = img.data;
const OW = W * sx, OH = H * sy;
const rgb = Buffer.alloc(OW * OH * 3);
for (let y = 0; y < OH; y++) for (let x = 0; x < OW; x++) {
  const si = (Math.floor(y / sy) * W + Math.floor(x / sx)) * 4, di = (y * OW + x) * 3;
  rgb[di] = data[si]; rgb[di + 1] = data[si + 1]; rgb[di + 2] = data[si + 2];
}
encodePNG(outFile, OW, OH, rgb);
console.log('wrote ' + outFile + '  (mode=' + game.mode + ' score=' + game.score + ' balls lost=' + game.ballsLost + ' bricks=' + G.bricksLeft() +
  ' hits=' + game.hits + ' ro=' + game.ro + ' shrunk=' + game.shrunk + ' wall=' + game.wall + ')');
