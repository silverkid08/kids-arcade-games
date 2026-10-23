/* Runs the real game headlessly and writes what the canvas would show to a
   PNG (the harness rasterises every fillRect), so the look can be checked
   with an image viewer or the Read tool.

     node tools/render-frame.js [scenario] [out.png]

   scenarios:
     attract   idle screen behind the menu: net, last scores, ball, no paddles
     play      a rally in progress (Original preset)
     serve     just after a point: ball gone, score updated
     wait      "press to serve" prompt (serve style = wait)
     edge      ball straddling the bottom edge as it bounces (split by blanking)
     gameover  11-x with the winner message
     kid       Kid preset, big paddles, bumper badge and bumper flash
     paused    PAUSED
     digits    every score digit 0-19 drawn by the 7448 pattern (art check)
     native    smallest scale (one device row per scan line), no scanlines

   The CSS phosphor halo and vignette are not part of the canvas, so they do
   not appear in the PNG. */
require('./harness.js');
global.__RASTER = true;
const path = require('path');
const fs = require('fs');
const { build } = require('./build.js');
const { encodePNG } = require('./png.js');

const scenario = process.argv[2] || 'play';
const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
const outFile = process.argv[3] || path.join(outDir, scenario + '.png');

const G = build();
const { game, settings, update, render, canvas } = G;
const frames = n => { for (let i = 0; i < n; i++) update(); };
const until = (f, max) => { for (let i = 0; i < (max || 20000) && !f(); i++) update(); };
G.seed(4242);
G.applyPreset('original');
settings.mode = '2p';

function bothTrack() {   // hold both paddles on the ball so a rally keeps going
  for (let s = 0; s < 2; s++) { G.keys.delete(s ? 'ArrowUp' : 'KeyW'); G.keys.delete(s ? 'ArrowDown' : 'KeyS'); }
  for (let s = 0; s < 2; s++) {
    const p = game.pad[s], c = p.y + p.h / 2, t = game.ballY + 2 + (s ? 3 : -3);
    if (t < c - 2) G.keys.add(s ? 'ArrowUp' : 'KeyW'); else if (t > c + 2) G.keys.add(s ? 'ArrowDown' : 'KeyS');
  }
}
function rally(n) { for (let i = 0; i < n; i++) { bothTrack(); update(); } }

if (scenario === 'native') { window.innerWidth = 360; window.innerHeight = 270; G.resize(); }   // 1x: one device row per line

switch (scenario) {
  case 'attract': game.score = [7, 11]; frames(40); break;
  case 'play': case 'native':
    G.play(); frames(G.SERVE_FRAMES + 2); rally(260); break;
  case 'serve': G.play(); frames(G.SERVE_FRAMES + 2); until(() => game.hidden && game.score[0] + game.score[1] > 0); frames(20); break;
  case 'wait': settings.serve = 'wait'; G.play(); frames(G.SERVE_FRAMES + 5); break;
  case 'edge': G.play(); frames(G.SERVE_FRAMES + 2); game.seg = 7; game.rev = 0;
    for (let i = 0; i < 4000; i++) { game.x = 120; game.dir = 1; update();
      if (game.rows.length && game.rows[0] === 0 && game.rows[game.rows.length - 1] > 200) break; } break;
  case 'gameover': G.play(); game.score = [10, 6]; frames(G.SERVE_FRAMES + 2);
    for (let i = 0; i < 4000 && !game.over; i++) { G.keys.clear(); update(); } frames(30); break;
  case 'kid': G.applyPreset('kid'); settings.p[1].bumper = true; settings.p[0].size = 44; G.play(); frames(G.SERVE_FRAMES + 2);
    G.requestServe(); game.serveReq = true; frames(1); game.dir = 1;
    for (let i = 0; i < 3000 && game.flash[1] === 0; i++) { G.keys.clear(); G.keys.add('KeyS'); update(); }
    frames(1); break;
  case 'paused': G.play(); frames(G.SERVE_FRAMES + 30); G.togglePause(); break;
  case 'digits': break;
}
if (scenario !== 'attract' && G.menuOpen) G.resume();
if (scenario === 'paused') { game.paused = true; }
render();

let W = canvas.width, H = canvas.height, data = canvas._buf;
if (scenario === 'digits') {
  // draw 0..19 for both players across several frames into one strip
  const cells = [];
  for (let v = 0; v < 20; v++) { game.score = [v, 19 - v]; game.mode = 'attract'; game.hidden = true; render(); cells.push(Uint8ClampedArray.from(canvas._buf)); }
  const cw = Math.round(120 * G.SW / 374 * (canvas.width / G.SW)), ch = Math.round(40 * canvas.height / G.SH);
  const x0 = Math.round(55 * canvas.width / G.SW), y0 = Math.round(12 * canvas.height / G.SH);
  const cols = 5; W = cols * cw; H = Math.ceil(cells.length / cols) * ch;
  data = new Uint8ClampedArray(W * H * 4);
  cells.forEach((b, n) => {
    const ox = (n % cols) * cw, oy = Math.floor(n / cols) * ch;
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      const si = ((y0 + y) * canvas.width + x0 + x) * 4, di = ((oy + y) * W + ox + x) * 4;
      data[di] = b[si]; data[di + 1] = b[si + 1]; data[di + 2] = b[si + 2]; data[di + 3] = b[si + 3];
    }
  });
}
// composite on the tube's glass colour
const BG = [5, 6, 5];
const rgb = Buffer.alloc(W * H * 3);
for (let i = 0, j = 0; i < W * H; i++, j += 3) {
  const a = data[i * 4 + 3] / 255;
  rgb[j] = data[i * 4] * a + BG[0] * (1 - a); rgb[j + 1] = data[i * 4 + 1] * a + BG[1] * (1 - a); rgb[j + 2] = data[i * 4 + 2] * a + BG[2] * (1 - a);
}
encodePNG(outFile, W, H, rgb);
console.log('wrote ' + outFile + ' ' + W + 'x' + H + '  (mode=' + game.mode + ' score=' + game.score + ' speed=' + game.speedCount + ' rally=' + game.rally + ' hidden=' + game.hidden + ')');
