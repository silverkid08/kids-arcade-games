/* Runs the real game headlessly and writes what the canvas would show to a
   PNG, so the art can be checked with an image viewer (or the Read tool).

     node tools/render-frame.js [scenario] [out.png] [scale]

   scenarios:
     title      the ROM title screen (menu backdrop)
     plunger    ball on the striker, spring pulled
     upper      scene A in play, flippers up
     lower      scene B in play
     colliders  scene A + B side by side with every collider drawn over the
                art (walls red, circles yellow, flippers cyan, sensors green)
     features   cards face up, chicks, stoppers, exit open, up-post (scene B)
     slots      777 jackpot: up-post, pink table, seals bouncing (scene A)
     bonus      the bonus stage with Mario, Pauline and lit lamps
     kid        Kid preset: big flippers, drain posts, invulnerable badge
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

const G = build();
const { game, input, update, render, settings, ball } = G;
const frames = n => { for (let i = 0; i < n; i++) update(); };
G.applyPreset('original'); G.seed(99);

function grab() {
  render();
  const out = Buffer.alloc(G.SW * G.SH * 3);
  for (let i = 0; i < G.fb.length; i++) { const c = G.fb[i]; out[i * 3] = c & 255; out[i * 3 + 1] = (c >> 8) & 255; out[i * 3 + 2] = (c >> 16) & 255; }
  return out;
}
function place(x, y, vx, vy) { ball.world = 'table'; ball.state = 'play'; ball.x = x; ball.y = y; ball.vx = vx || 0; ball.vy = vy || 0; }

let W = G.SW, H = G.SH, rgb;
if (scenario !== 'title') G.startPlaying();
switch (scenario) {
  case 'title': rgb = grab(); break;
  case 'plunger': input.plunger = true; frames(14); rgb = grab(); break;
  case 'upper': place(150, 120, 0.3, -0.2); input.left = input.right = true; frames(12); rgb = grab(); break;
  case 'lower': place(140, 360, -0.4, 0); frames(4); rgb = grab(); break;
  case 'features': {
    for (let k = 0; k < 5; k++) G.setCard(k, 1);
    game.upostB = 1; game.tableColour[G.LOWER] = 0x27;
    G.resetBallState; game.eggs = [6, 6, 3]; game.stoppers = [1, 1]; game.targets = [1, 0, 1, 0, 0, 1, 0];
    // up-post tiles + exit via the real handlers
    game.cards = [1, 1, 1, 1, 0]; place(170, 293, 0, 0.4); frames(8);          // drop through card lane 5
    G.onHit(G.T.targets[1], 1); G.onHit(G.T.targets[3], 1); G.onHit(G.T.targets[4], 1); G.onHit(G.T.targets[6], 1);
    place(150, 380, 0, 0); frames(2); rgb = grab(); break;
  }
  case 'slots': {
    place(150, 60, 0, 0); game.slots = [2, 2, 2]; G.slotJackpot(2); game.sealBounce = 20; game.sealT = 3; game.pills = [0, 0, 0, 0, 0, 0, 0, 0];
    game.spin = 0; frames(3); rgb = grab(); break;
  }
  case 'bonus': {
    G.enterBonus(); frames(30); game.lamps[0] = 1; game.lamps[4] = 2; game.lamps[8] = 1;
    for (const i of [0, 4, 8]) G.SCN[G.BONUS].nt[0x3C0] = G.SCN[G.BONUS].nt[0x3C0];
    input.right = true; frames(20); input.right = false;
    rgb = grab(); break;
  }
  case 'kid': G.applyPreset('kid'); G.startPlaying(); place(130, 400, 0, 0.5); frames(3); rgb = grab(); break;
  case 'colliders': {
    // two screens side by side with colliders drawn over the art
    W = G.SW * 2 + 8; H = G.SH;
    rgb = Buffer.alloc(W * H * 3);
    const shots = [];
    place(150, 120); game.scene = G.UPPER; shots.push(grab());
    place(150, 360); game.scene = G.LOWER; ball.state = 'gone'; shots.push(grab());
    for (let s = 0; s < 2; s++) for (let y = 0; y < H; y++) for (let x = 0; x < G.SW; x++) {
      const si = (y * G.SW + x) * 3, di = (y * W + x + s * (G.SW + 8)) * 3;
      for (let c = 0; c < 3; c++) rgb[di + c] = shots[s][si + c] * 0.55;
    }
    const plot = (x, y, r, g, b) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; const d = (y * W + x) * 3; rgb[d] = r; rgb[d + 1] = g; rgb[d + 2] = b; };
    const line = (x1, y1, x2, y2, col) => { const n = Math.ceil(Math.hypot(x2 - x1, y2 - y1) * 2) + 1; for (let i = 0; i <= n; i++) plot(x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n, ...col); };
    const toScreen = (x, y) => (y < 240 ? [x, y] : [x + G.SW + 8, y - 240]);
    for (const c of G.TABLE.all) {
      const col = c.tag ? [255, 230, 0] : [255, 50, 50];
      if (c.kind === 's') { const a = toScreen(c.x1, c.y1), b = toScreen(c.x2, c.y2); if ((c.y1 < 240) === (c.y2 < 240)) line(a[0], a[1], b[0], b[1], col); }
      else for (let k = 0; k < 48; k++) { const a = toScreen(c.x + c.r * Math.cos(k / 48 * 6.283), c.y + c.r * Math.sin(k / 48 * 6.283)); plot(a[0], a[1], ...col); }
    }
    for (const f of G.FLIPPERS) { const t = G.flipTip(f), a = toScreen(f.px, f.py), b = toScreen(t[0], t[1]); line(a[0], a[1], b[0], b[1], [0, 255, 255]); }
    break;
  }
  default: throw new Error('unknown scenario ' + scenario);
}
const big = Buffer.alloc(W * scale * H * scale * 3);
for (let y = 0; y < H * scale; y++) for (let x = 0; x < W * scale; x++) {
  const si = (Math.floor(y / scale) * W + Math.floor(x / scale)) * 3, di = (y * W * scale + x) * 3;
  big[di] = rgb[si]; big[di + 1] = rgb[si + 1]; big[di + 2] = rgb[si + 2];
}
encodePNG(outFile, W * scale, H * scale, big);
console.log('wrote ' + outFile + '  (mode=' + game.mode + ', scene=' + game.scene + ', score=' + game.score + ', ball=' + ball.state + ' ' + ball.x.toFixed(1) + ',' + ball.y.toFixed(1) + ')');
