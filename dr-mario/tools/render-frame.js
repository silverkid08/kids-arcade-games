/* Runs the real game headlessly and writes what the canvas would show to a
   PNG (the visible 256x224 NTSC area), so the art can be checked with the
   Read tool.

     node tools/render-frame.js [scenario] [out.png] [scale]

   scenarios:
     title     title screen (logo, dancing blue virus and Dr. Mario)
     options   1 PLAYER GAME options screen
     intro     viruses being placed at level 10
     play      a capsule falling at level 5, Mario mid-throw, magnifier viruses
     busy      a bot has played for a while: capsules, halves, popped cells
     hurt      a big virus jumping after its colour was cleared
     clear     STAGE CLEAR / TRY NEXT box
     gameover  GAME OVER box, Dr. Mario fail pose, laughing viruses
     pause     the PAUSE screen
     kid       Kid preset: 2 colours, landing preview, NO GAME OVER badge
     rescue    NO GAME OVER rescue flash
     sheet     every metasprite of the level sprite bank laid out (art check)
*/
require('./harness.js');
const path = require('path');
const fs = require('fs');
const { build } = require('./build.js');
const { encodePNG } = require('./png.js');

const scenario = process.argv[2] || 'title';
const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
const outFile = process.argv[3] || path.join(outDir, scenario + '.png');
const scale = parseInt(process.argv[4] || '3', 10);

const D = build();
const { G, P, BTN } = D;
const frames = n => { for (let i = 0; i < n; i++) D.update(); };
const until = (f, max) => { for (let i = 0; i < (max || 20000) && !f(); i++) D.update(); return f(); };
function press(bit, hold) { D.padDown(bit); frames(hold || 1); D.padUp(bit); }
function startLevel(level, speed, opts) {
  localStorage._d = {};
  D.applyPreset((opts && opts.preset) || 'original');
  D.settings.level = level; D.settings.speed = speed;
  if (opts && opts.extra) Object.assign(D.settings, opts.extra);
  D.startPlaying();
  frames(20); press(BTN.start); until(() => G.romMode === 8, 200);
}
/* a simple bot: drop each capsule in a column picked from the frame counter */
function bot(n) {
  for (let i = 0; i < n; i++) {
    if (P.nextAction === 0) {
      const want = (P.pillsCounter * 3) % 7;
      if (P.x < want) D.padDown(BTN.right); else D.padUp(BTN.right);
      if (P.x > want) D.padDown(BTN.left); else D.padUp(BTN.left);
      if (P.x === want) D.padDown(BTN.down); else D.padUp(BTN.down);
    } else { D.padUp(BTN.right); D.padUp(BTN.left); D.padUp(BTN.down); }
    D.update();
    if (G.romMode !== 4) break;
  }
  D.padUp(BTN.right); D.padUp(BTN.left); D.padUp(BTN.down);
}

switch (scenario) {
  case 'title': D.resume(); frames(40); break;
  case 'options': D.startPlaying(); frames(30); press(BTN.down); frames(4); press(BTN.right); frames(8); break;
  case 'intro': startLevel(10, 1); frames(20); break;
  case 'play': startLevel(5, 1); until(() => G.romMode === 4); until(() => P.nextAction === 0 && P.y < 12); frames(3); break;
  case 'busy': startLevel(3, 2); until(() => G.romMode === 4); bot(1500); until(() => P.nextAction === 6 && G.pillThrownFrame > 8, 400); break;
  case 'hurt': startLevel(0, 0); until(() => G.romMode === 4); {
    // put a matching column on a virus to hurt it
    const f = G.field; let v = -1; for (let p = 0; p < 128; p++) if ((f[p] & 0xF0) === 0xD0) { v = p; break; }
    const c = f[v] & 3; f[v - 8] = 0x80 | c; f[v - 16] = 0x80 | c; f[v - 24] = 0x80 | c; P.nextAction = 1; P.step = 0; P.status = 0xFF;
    until(() => G.big.state.includes(1), 200); frames(5);
  } break;
  case 'clear': startLevel(0, 1); until(() => G.romMode === 4); {
    const f = G.field; for (let p = 0; p < 128; p++) if ((f[p] & 0xF0) === 0xD0) D.virusDestroyed(p), f[p] = 0xFF;
    until(() => G.stageClear, 400); frames(30);
  } break;
  case 'gameover': startLevel(0, 2); until(() => G.romMode === 4); until(() => G.romMode === 7, 30000); until(() => G.gameOver, 400); frames(9); break;
  case 'pause': startLevel(2, 1); until(() => G.romMode === 4); frames(30); press(BTN.start); frames(10); break;
  case 'kid': startLevel(4, 0, { preset: 'kid' }); until(() => G.romMode === 4); until(() => P.nextAction === 0 && P.y < 13); frames(2); break;
  case 'rescue': startLevel(2, 2, { preset: 'kid', extra: { dropPct: 100, virusCount: 0 } }); until(() => G.romMode === 4); until(() => G.flash > 0, 40000); frames(4); break;
  case 'sheet': break;
}
D.render();

let W = 256, H = 224, data;
if (scenario === 'sheet') {
  // all metasprites of the level sprite bank on a grey background, 48x48 cells
  const cols = 10, cell = 48, n = D.ART.meta.length;
  W = cols * cell; H = Math.ceil(n / cols) * cell;
  data = new Uint8ClampedArray(W * H * 4); const px = new Uint32Array(data.buffer); px.fill(0xFF404040);
  const pal = D.ART.pal.level;
  D.ART.meta.forEach((m, i) => {
    const ox = (i % cols) * cell + 16, oy = Math.floor(i / cols) * cell + 16;
    const bank = (i >= 0x19 && i <= 0x1E) || (i >= 1 && i <= 5) ? 5 : 2;
    for (const [dy, t, at, dx] of m) for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const p = D.TILES[(bank * 256 + t) * 64 + ((at & 0x80) ? 7 - y : y) * 8 + ((at & 0x40) ? 7 - x : x)];
      if (!p) continue;
      const X = ox + dx + x, Y = oy + dy + y + 1; if (X < 0 || Y < 0 || X >= W || Y >= H) continue;
      px[Y * W + X] = D.NES32[pal[16 + (at & 3) * 4 + p]];
    }
    px[oy * W + ox] = 0xFF0000FF;
  });
} else {
  data = new Uint8ClampedArray(W * H * 4);
  data.set(D.img.data.subarray(8 * 256 * 4, (8 + 224) * 256 * 4));
}
const rgb = Buffer.alloc(W * scale * H * scale * 3);
for (let y = 0; y < H * scale; y++) for (let x = 0; x < W * scale; x++) {
  const si = (Math.floor(y / scale) * W + Math.floor(x / scale)) * 4, di = (y * W * scale + x) * 3;
  rgb[di] = data[si]; rgb[di + 1] = data[si + 1]; rgb[di + 2] = data[si + 2];
}
encodePNG(outFile, W * scale, H * scale, rgb);
console.log('wrote ' + outFile + '  (romMode=' + G.romMode + ' level=' + G.level + ' virus=' + P.virusLeft.toString(16) +
  ' score=' + D.scoreValue() + ' action=' + P.nextAction + ' frames=' + G.frames + ')');
