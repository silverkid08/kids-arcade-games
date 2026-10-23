/* Runs the real game headlessly and writes what the canvas would show to a
   PNG, so the art can be checked with an image viewer (or the Read tool).

     node tools/render-frame.js [scenario] [out.png] [scale]

   scenarios:
     menu      the backdrop behind the menu
     intro     LEVEL 1 at the start of a level
     play      level 1: flies and the swatter
     swat      a swat landing on a fly (yellow / red splat frames)
     level2    level 2 (blue tiles): Fly Parents, Fly Children
     level3    level 3 (pink tiles): bombs, parents, big flies
     hurt      the glove stung (shocked hand)
     lifeup    the extra-life glove floating down
     boss      King Watinga firing
     bosshit   King Watinga swatted (hurt frame + star)
     clear     the walk across after level 2's boss
     final     CONGRATULATIONS! after level 3
     gameover  GAME OVER with King Watinga
     pause     the original pause panel
     kid       Kid preset: big bugs, big swatter
     hover     hover-and-hold progress ring
     loops     award icons after several loops
     sheet     every sprite laid out (art check)
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
const until = (f, max) => { for (let i = 0; i < (max || 6000) && !f(); i++) update(); };
const aim = (x, y) => { input.x = x; input.y = y; };

G.applyPreset(scenario === 'kid' ? 'kid' : 'original');
if (scenario === 'hover') G.setKnob('swat', 'hover');
if (['level2', 'clear'].includes(scenario)) settings.startLevel = 2;
if (['level3', 'final'].includes(scenario)) settings.startLevel = 3;
if (scenario !== 'menu' && scenario !== 'sheet') { G.startPlaying(); G.seed(4321); aim(150, 150); }
const firstBug = k => game.bugs.find(b => (!k || b.kind === k) && b.x > 30 && b.x < 226 && b.y > 30 && b.y < 200);

switch (scenario) {
  case 'intro': frames(60); break;
  case 'play': until(() => game.mode === 'play' && game.bugs.filter(b => b.entered).length >= 2); frames(20); aim(110, 130); frames(1); break;
  case 'swat': { until(() => firstBug('gnat')); const b = firstBug('gnat'); aim(Math.round(b.x), Math.round(b.y)); input.fire = true; frames(SW_DOWN()); break; }
  case 'level2': until(() => game.bugs.some(b => b.kind === 'child') && firstBug('parent'), 20000); frames(6); break;
  case 'level3': game.mode = 'play'; until(() => game.bugs.filter(b => b.entered && b.kind !== 'child').length >= 4 && game.bugs.some(b => b.kind === 'bomb'), 30000); break;
  case 'hurt': until(() => game.mode === 'play'); G.sting(); frames(20); break;
  case 'lifeup': until(() => game.mode === 'play'); game.lifeup = { kind: 'lifeup', x: 120, y: 60, t: 0 }; frames(30); break;
  case 'boss': case 'bosshit':
    until(() => game.mode === 'play'); G.startBoss(); until(() => game.boss.state === 'fight'); frames(scenario === 'boss' ? 135 : 30);
    if (scenario === 'bosshit') { aim(Math.round(game.boss.x + 10), Math.round(game.boss.y - 10)); input.fire = true; frames(G.SWAT_UP + 2); }
    else aim(200, 180);
    break;
  case 'clear': case 'final': until(() => game.mode === 'play'); G.startBoss(); game.boss.state = 'die'; game.boss.t = 0; until(() => game.mode === 'clear'); frames(380); break;
  case 'gameover': until(() => game.mode === 'play'); game.lives = 1; G.sting(); until(() => game.mode === 'gameover'); frames(40); break;
  case 'pause': until(() => game.mode === 'play' && game.bugs.length >= 2); frames(30); G.togglePause(); break;
  case 'kid': until(() => game.mode === 'play' && game.bugs.filter(b => b.entered).length >= 2); frames(10); { const b = firstBug(); if (b) aim(Math.round(b.x) + 18, Math.round(b.y) + 4); } frames(1); break;
  case 'hover': { until(() => firstBug('gnat')); for (let i = 0; i < 30; i++) { const b = firstBug('gnat'); if (b) aim(Math.round(b.x), Math.round(b.y)); update(); if (input.dwell > 0.4) break; } break; }
  case 'loops': game.loop = 6; game.lives = 4; frames(140); break;
}
function SW_DOWN() { return G.SWAT_UP + 3; }
render();

const { SW, SH, img } = G;
let W = SW, H = SH, data = img.data;
if (scenario === 'sheet') {
  const list = [];
  for (const [k, v] of Object.entries(G.SPR)) (Array.isArray(v) ? v : [v]).forEach(s => list.push(s));
  const cols = 10, cell = 84;
  W = cols * cell; H = Math.ceil(list.length / cols) * cell;
  data = new Uint8ClampedArray(W * H * 4);
  const px32 = new Uint32Array(data.buffer); px32.fill(0xFFB09090);
  list.forEach((s, n) => {
    const ox = (n % cols) * cell + cell / 2, oy = Math.floor(n / cols) * cell + cell / 2;
    for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) {
      const v = s.px[y * s.w + x]; if (v < 0) continue;
      const X = ox + s.x + x, Y = oy + s.y + y; if (X >= 0 && X < W && Y >= 0 && Y < H) px32[Y * W + X] = G.PAL32[v];
    }
    px32[oy * W + ox] = 0xFF0000FF;
  });
}
const rgb = Buffer.alloc(W * scale * H * scale * 3);
for (let y = 0; y < H * scale; y++) for (let x = 0; x < W * scale; x++) {
  const si = ((Math.floor(y / scale)) * W + Math.floor(x / scale)) * 4;
  const di = (y * W * scale + x) * 3;
  rgb[di] = data[si]; rgb[di + 1] = data[si + 1]; rgb[di + 2] = data[si + 2];
}
encodePNG(outFile, W * scale, H * scale, rgb);
console.log('wrote ' + outFile + '  (mode=' + game.mode + ', level=' + game.level + ', left=' + game.remaining + ', lives=' + game.lives + ', bugs=' + game.bugs.length + ', score=' + game.score + ')');
