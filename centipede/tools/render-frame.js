/* Runs the real game headlessly and writes what the canvas would show to a
   PNG, so the art can be checked with an image viewer (or the Read tool).

     node tools/render-frame.js [scenario] [out.png] [scale]

   scenarios:
     attract   the attract mode the menu sits on (high score table, wandering gun)
     play      wave 1 shortly after the start, gun firing
     bottom    the centipede bouncing in the player area, new heads arriving
     spider    the spider in the player area
     points    a shot spider showing its points
     flea      a flea dropping mushrooms (wave 2)
     scorpion  a scorpion poisoning mushrooms (wave 4)
     death     the gun exploding
     restore   mushrooms being restored after a death
     wave2 / wave3 / wave5 / wave8   later waves (palette swaps)
     invuln    invulnerable mode: the gun flashing after a hit
     initials  GREAT SCORE / ENTER YOUR INITIALS
     kid       Kid preset
     sheet     every motion-object picture in the wave-1 palette, plus the stamps
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
const scale = parseInt(process.argv[4] || '3', 10);

const G = build();
const { M, P, H, V, game, input, update, settings } = G;
const frames = n => { for (let i = 0; i < n; i++) update(); };
const until = (f, max) => { for (let i = 0; i < (max || 20000) && !f(); i++) update(); return f(); };
localStorage._d = {};
G.applyPreset('original');
if (scenario === 'kid') G.applyPreset('kid');
const wave = { wave2: 2, wave3: 3, wave5: 5, wave8: 8, flea: 2, scorpion: 4 }[scenario];
if (wave) settings.startWave = wave;
if (scenario === 'invuln') settings.invuln = 1;
G.seed(1234);
if (scenario !== 'attract' && scenario !== 'sheet') { G.startPlaying(); G.seed(4321); }
input.has = true; input.gx = 120; input.gy = 250;
function dodge() {          // keep the gun away from everything (simple bot)
  input.gy = 250;
  let best = 120, bestD = -1;
  for (let x = 20; x < 220; x += 10) {
    let d = 999;
    for (let i = 0; i < 14; i++) if (!(P[i] & 0x80) && V[i] < 0x40) d = Math.min(d, Math.abs((247 - H[i]) - x));
    if (d > bestD) { bestD = d; best = x; }
  }
  input.gx = best;
}
const alive = () => !(P[15] & 0xAF);
switch (scenario) {
  case 'attract': frames(400); break;
  case 'play': input.fireHeld = true; frames(150); break;
  case 'bottom': until(() => { dodge(); return M.NEWD && [...Array(12).keys()].filter(i => !(P[i] & 0x80) && V[i] < 0x30).length > 3; }, 8000); frames(5); break;
  case 'spider': until(() => { dodge(); return P[13] >= 0x14 && P[13] < 0x1C && H[13] > 0x30 && H[13] < 0xD0; }, 8000); break;
  case 'points': until(() => { dodge(); return P[13] >= 0x14 && P[13] < 0x1C && H[13] > 0x30 && H[13] < 0xD0; }, 8000);
    input.gx = 247 - H[13]; input.fireHeld = true; until(() => P[13] >= 0xB6 && P[13] <= 0xB8, 400); frames(2); break;
  case 'flea': until(() => { dodge(); return P[12] < 0x20 && V[12] < 0xA0 && V[12] > 0x40; }, 20000); break;
  case 'scorpion': until(() => { dodge(); return P[12] >= 0x30 && P[12] < 0x34 && H[12] > 0x40; }, 30000); frames(30); break;
  case 'death': until(() => !alive(), 20000); frames(10); break;
  case 'restore': for (let i = 0; i < 400; i++) { input.gx = 40 + (i % 160); input.fireHeld = true; update(); } input.fireHeld = false; until(() => !alive(), 20000); until(() => P[11] >= 0xFA && M.MEM, 3000); break;
  case 'wave2': case 'wave3': case 'wave5': case 'wave8': input.fireHeld = true; frames(200); break;
  case 'invuln': until(() => game.flash > 20, 20000); frames(3); break;
  case 'initials': M.score = 23456; M.LIVES = 0; G.PLAYEX(0); until(() => game.entering, 3000); frames(20); break;
  case 'kid': input.fireHeld = true; frames(300); break;
}
G.render();
let W = G.SW, Hh = G.SH, data = G.img.data;
if (scenario === 'sheet') {
  // 128 motion-object pictures (16x8 on screen) with pens 1/2/3 = legs/eyes/body, then the 64 stamps
  const cell = 20; W = 16 * cell; Hh = 8 * cell + 4 * 12;
  data = new Uint8ClampedArray(W * Hh * 4);
  const px32 = new Uint32Array(data.buffer); px32.fill(0xFF202020);
  const cr = M.colorRam, pens = [0, G.PAL32[cr[9]], G.PAL32[cr[10]], G.PAL32[cr[11]]];
  for (let s = 0; s < 128; s++) {
    const ox = (s % 16) * cell + 2, oy = Math.floor(s / 16) * cell + 6, sp = G.SPR[s];
    for (let uy = 0; uy < 16; uy++) for (let ux = 0; ux < 8; ux++) { const v = sp[uy * 8 + ux]; if (v) px32[(oy + 7 - ux) * W + ox + uy] = pens[v]; }
  }
  const tp = [0xFF000000, G.PAL32[cr[1]], G.PAL32[cr[2]], G.PAL32[cr[3]]];
  for (let t = 0; t < 64; t++) {
    const ox = (t % 16) * cell + 6, oy = 8 * cell + Math.floor(t / 16) * 12 + 2, tl = G.TILES[t];
    for (let dy = 0; dy < 8; dy++) for (let dx = 0; dx < 8; dx++) px32[(oy + dy) * W + ox + dx] = tp[tl[dy * 8 + dx]];
  }
}
const rgb = Buffer.alloc(W * scale * Hh * scale * 3);
for (let y = 0; y < Hh * scale; y++) for (let x = 0; x < W * scale; x++) {
  const si = ((Math.floor(y / scale)) * W + Math.floor(x / scale)) * 4;
  const di = (y * W * scale + x) * 3;
  rgb[di] = data[si]; rgb[di + 1] = data[si + 1]; rgb[di + 2] = data[si + 2];
}
encodePNG(outFile, W * scale, Hh * scale, rgb);
console.log('wrote ' + outFile + '  (mode=' + M.MODE + ', score=' + M.score + ', lives=' + M.LIVES + ', CENTIN=' + M.CENTIN + ', CENTIS=' + M.CENTIS + ', palette=' + M.LCOLOR + ')');
