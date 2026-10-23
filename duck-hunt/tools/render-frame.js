/* Runs the real game headlessly and writes what the canvas would show to a
   PNG, so the art can be checked with an image viewer (or the Read tool).

     node tools/render-frame.js [scenario] [out.png] [scale]

   scenarios:
     menu      the NES title screen drawn behind the menu
     intro     the dog walking in with the ROUND box
     sniff     the dog sniffing
     jump      the dog jumping into the grass
     play      a duck flying (Game A, round 1)
     shot      a duck just hit (the "shot" pose) with the score pop-up
     fall      a duck spinning down
     hold      the dog holding up the duck
     flyaway   FLY AWAY with the pink sky
     laugh     the dog laughing
     gameb     Game B, two ducks in the air
     roundend  the end-of-round tally (hit icons sliding, stats box)
     perfect   PERFECT!! with the bonus
     gameover  GAME OVER
     kid       Kid preset: big ducks, big crosshair
     sheet     every duck and dog frame laid out on a strip (art check)
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
const frames = n => { for (let i = 0; i < n; i++) update(); };
const until = (f, max) => { for (let i = 0; i < (max || 5000) && !f(); i++) update(); };
const duck0 = () => game.ducks[0];

G.applyPreset('original');
G.seed(1234);
if (scenario === 'kid') G.applyPreset('kid');
if (scenario === 'gameb') settings.ducks = 2;
if (scenario !== 'menu' && scenario !== 'sheet') {
  G.startPlaying(); G.seed(4321);
  input.x = 200; input.y = 60;
}
function aimAtDuck(d) { input.x = d.x; input.y = d.y; }

switch (scenario) {
  case 'intro': frames(90); break;
  case 'sniff': until(() => game.dog.state === 5); frames(12); break;
  case 'jump': until(() => game.dog.state === 9); frames(14); break;
  case 'play': until(() => duck0().state === 3 && duck0().y < 110); frames(20); break;
  case 'kid': until(() => duck0().state === 3 && duck0().y < 110); frames(20); aimAtDuck(duck0()); input.x += 10; frames(1); break;
  case 'shot': until(() => duck0().state === 3 && duck0().y < 100); aimAtDuck(duck0()); input.fire = true; frames(12); break;
  case 'fall': until(() => duck0().state === 3 && duck0().y < 100); aimAtDuck(duck0()); input.fire = true; until(() => duck0().state === 7); frames(14); break;
  case 'hold': until(() => duck0().state === 3 && duck0().y < 100); aimAtDuck(duck0()); input.fire = true; until(() => game.dog.state === 13); frames(24); break;
  case 'flyaway': until(() => game.msg === 6); frames(10); break;
  case 'laugh': until(() => game.dog.state === 11); frames(22); break;
  case 'gameb': until(() => game.ducks[1].state === 3 && game.ducks[1].y < 120 && game.ducks[0].state === 3); frames(10); break;
  case 'roundend': case 'perfect': case 'gameover': {
    // shoot every duck (perfect) or none (game over)
    const shoot = scenario !== 'gameover';
    for (let t = 0; t < 60 * 200 && game.mode === 'duck'; t++) {
      const d = duck0();
      if (shoot && d.state === 3 && d.y < 130 && (t % 20) === 0) { aimAtDuck(d); input.fire = true; }
      update();
    }
    if (scenario === 'roundend') frames(60);
    if (scenario === 'perfect') until(() => game.msg === 5, 3000);
    if (scenario === 'gameover') until(() => game.mode === 'gameover', 3000), frames(60);
    break;
  }
}
render();

const { SW, SH, img } = G;
let W = SW, H = SH, data = img.data;
if (scenario === 'sheet') {
  // lay out all frames on a sky background, 48x48 cells
  const cols = 12, cell = 56;
  const list = [];
  for (let c = 0; c < 3; c++) for (let i = 0; i < 12; i++) list.push(['duck', c, i]);
  for (const k of Object.keys(G.DOG_SPR)) list.push(['dog', 0, +k]);
  W = cols * cell; H = Math.ceil(list.length / cols) * cell;
  data = new Uint8ClampedArray(W * H * 4);
  const px32 = new Uint32Array(data.buffer); px32.fill(G.C.sky);
  list.forEach(([kind, c, i], n) => {
    const s = kind === 'duck' ? G.DUCK_SPR[c][i] : G.DOG_SPR[i];
    const ox = (n % cols) * cell + cell / 2, oy = Math.floor(n / cols) * cell + cell / 2 + (kind === 'dog' ? 6 : 0);
    for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) {
      const v = s.px[y * s.w + x]; if (v < 0) continue;
      const X = ox + s.x + x, Y = oy + s.y + y; if (X >= 0 && X < W && Y >= 0 && Y < H) px32[Y * W + X] = G.PAL32[v];
    }
    px32[oy * W + ox] = 0xFF0000FF;     // entity origin marker
  });
}
const rgb = Buffer.alloc(W * scale * H * scale * 3);
for (let y = 0; y < H * scale; y++) for (let x = 0; x < W * scale; x++) {
  const si = ((Math.floor(y / scale)) * W + Math.floor(x / scale)) * 4;
  const di = (y * W * scale + x) * 3;
  rgb[di] = data[si]; rgb[di + 1] = data[si + 1]; rgb[di + 2] = data[si + 2];
}
encodePNG(outFile, W * scale, H * scale, rgb);
console.log('wrote ' + outFile + '  (mode=' + game.mode + ', round=' + game.round + ', score=' + game.score + ', hits=' + game.hits + ', dog=' + game.dog.state + ')');
