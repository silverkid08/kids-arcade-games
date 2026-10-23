/* Runs the real game headlessly and writes what the canvas would show to a
   PNG (256x224, scaled), so the art can be checked with an image viewer.

     node tools/render-frame.js [scenario] [out.png] [scale]

   scenarios: title gametype levela levelb play lineclear tetris curtain pause
              kid btype success entry rescue level9 sheet
*/
require('./harness.js');
const path = require('path');
const fs = require('fs');
const { build } = require('./build.js');
const { encodePNG } = require('./png.js');
const { makeBot } = require('./bot.js');

const scenario = process.argv[2] || 'play';
const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
const outFile = process.argv[3] || path.join(outDir, scenario + '.png');
const scale = parseInt(process.argv[4] || '3', 10);

const G = build();
const { g, settings } = G;
localStorage._d = {};
G.applyPreset(scenario === 'kid' || scenario === 'rescue' ? 'kid' : 'original');
G.hideOverlay();
const frames = (n, bot) => { for (let i = 0; i < n; i++) { if (bot) bot(); G.update(); } };
const until = (f, max, bot) => { for (let i = 0; i < (max || 20000) && !f(); i++) { if (bot) bot(); G.update(); } };
const bot = makeBot(G);

switch (scenario) {
  case 'title': G.toTitle(); break;
  case 'gametype': G.toGameType(); frames(6); break;
  case 'levela': settings.gameType = 0; G.toLevelMenu(); frames(6); break;
  case 'levelb': settings.gameType = 1; G.toLevelMenu(); frames(6); break;
  case 'play': G.startGame(0, 0); frames(60 * 40, bot); break;
  case 'level9': G.startGame(9, 0); frames(60 * 30, bot); break;
  case 'lineclear': G.startGame(5, 0); until(() => g.playState === 4 && g.rowY >= 2, 60000, bot); break;
  case 'tetris': {
    G.startGame(3, 0);
    for (let r = 16; r < 20; r++) for (let c = 0; c < 9; c++) g.pf[r * 10 + c] = 0x7B;
    g.vramRow = 0;
    until(() => g.cur === 0x12 && g.playState === 1, 20000);
    g.cur = 0x11; g.x = 9; frames(1);
    until(() => g.playState === 4 && g.flash, 3000, () => G.input.keys.add('arrowdown'));
    break;
  }
  case 'curtain': G.startGame(15, 0); until(() => g.playState === 10 && g.curtainRow > 10, 60000, makeBot(G, { bad: true })); break;
  case 'pause': G.startGame(0, 0); frames(600, bot); G.input.keys.add('enter'); G.update(); G.input.keys.clear(); frames(3); break;
  case 'kid': G.startGame(0, 0); frames(60 * 60, bot); g.hold = 0x12; break;
  case 'btype': settings.gameType = 1; G.startGame(5, 5); frames(30); break;
  case 'success': settings.gameType = 1; G.startGame(2, 0); until(() => g.playState === 13 && g.successT > 30, 60000, bot); break;
  case 'entry': G.startGame(0, 0); g.score = [0x20, 0x00, 0x02]; g.playState = 0; frames(3); break;
  case 'rescue': G.startGame(0, 0); until(() => g.playState === 12 && g.rescueT === 6, 60000, makeBot(G, { bad: true })); break;
}
G.render();

const { SW, SH, img } = G;
const W = SW, H = SH, data = img.data;
const rgb = Buffer.alloc(W * scale * H * scale * 3);
for (let y = 0; y < H * scale; y++) for (let x = 0; x < W * scale; x++) {
  const si = ((Math.floor(y / scale)) * W + Math.floor(x / scale)) * 4;
  const di = (y * W * scale + x) * 3;
  rgb[di] = data[si]; rgb[di + 1] = data[si + 1]; rgb[di + 2] = data[si + 2];
}
encodePNG(outFile, W * scale, H * scale, rgb);
console.log('wrote ' + outFile + '  (mode=' + g.mode + ', playState=' + g.playState + ', level=' + g.level + ', score=' + (g.score ? G.scoreInt() : 0) + ')');
