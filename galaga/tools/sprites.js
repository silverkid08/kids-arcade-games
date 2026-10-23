/* Extracts the sprite frames the game uses from the ripped arcade sheet in
   reference/galaga-arcade-sheet.png and prints them as the JS data block
   embedded in index.html (between the @sprites-begin / @sprites-end markers).

     node tools/sprites.js            # print the block
     node tools/sprites.js --splice   # rewrite the block inside index.html

   Encoding: one global palette, then every frame is a run-length string:
   '.' = transparent, 'A'.. = palette index 1.., an optional base-36 run
   count follows the character (so "A3" is three pixels of colour 1). */
const fs = require('fs');
const path = require('path');
const { decodePNG } = require('./png.js');

const sheet = decodePNG(path.join(__dirname, '..', 'reference', 'galaga-arcade-sheet.png'));

/* Palette: index 0 is transparent (the sheet's black). */
const palette = ['#000000'];
const palIndex = { '0,0,0': 0 };
function colourIndex(rgb) {
  const k = rgb.join(',');
  if (!(k in palIndex)) {
    palIndex[k] = palette.length;
    palette.push('#' + rgb.map(v => v.toString(16).padStart(2, '0')).join(''));
  }
  return palIndex[k];
}

function encodeFrame(x0, y0, w, h) {
  let out = '', run = 0, last = null;
  const flush = () => {
    if (!last) return;
    out += last + (run > 1 ? run.toString(36) : '');
  };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const idx = colourIndex(sheet.pixel(x0 + x, y0 + y));
    const ch = idx === 0 ? '.' : String.fromCharCode(64 + idx);
    if (ch === last) run++;
    else { flush(); last = ch; run = 1; }
  }
  flush();
  return out;
}

/* [name, x, y, w, h, frameCount, stride] - frames laid out horizontally. */
const defs = [
  ['fighter',     0,   0, 16, 16, 7, 16],   // rotation frames: 0 = right ... 6 = up
  ['captured',  128,   0, 16, 16, 7, 16],   // the red captured fighter, same frames
  ['boss',        0,  16, 16, 16, 8, 16],   // Boss Galaga green: 0 = left ... 6 = down, 7 = wing flap
  ['bossBlue',  128,  16, 16, 16, 8, 16],   // Boss Galaga after one hit
  ['butterfly',   0,  32, 16, 16, 8, 16],   // Goei
  ['bee',       128,  32, 16, 16, 8, 16],   // Zako
  ['scorpion',    0,  64, 16, 16, 7, 16],   // Sasori transform (stages 4-6)
  ['tonbo',     112,  64, 16, 16, 7, 16],   // Dragonfly - challenging stages
  ['enterprise',  0,  80, 16, 16, 7, 16],   // challenging stages
  ['momiji',    112,  80, 16, 16, 7, 16],   // Satellite - challenging stages
  ['galaxian',    0,  96, 16, 16, 7, 16],   // Galaxian flagship transform
  ['midori',    112,  96, 16, 16, 7, 16],   // Bosconian spy ship transform
  ['pmissile',  240,  48, 16, 16, 1, 16],   // player missile (vertical)
  ['pmissileD', 224,  48, 16, 16, 1, 16],   // player missile (diagonal)
  ['emissile',  240,  64, 16, 16, 1, 16],   // enemy missile (vertical)
  ['emissileD', 224,  64, 16, 16, 1, 16],   // enemy missile (diagonal)
  ['fighterExpl', 64, 112, 32, 32, 4, 32],
  ['beam',        0, 144, 48, 80, 3, 48]
];

const SPR = {};
for (const [name, x, y, w, h, n, stride] of defs) {
  const frames = [];
  for (let i = 0; i < n; i++) frames.push(encodeFrame(x + i * stride, y, w, h));
  SPR[name] = { w, h, f: frames };
}
/* enemy explosion: three 16x16 frames then two 32x32 ones; stored as 32x32 */
SPR.enemyExpl = { w: 32, h: 32, f: [] };
for (const [x, y] of [[224, 80], [240, 80], [224, 96]]) {
  /* centre the 16x16 frame in a 32x32 box */
  let out = '';
  const rows = [];
  for (let yy = 0; yy < 32; yy++) {
    let row = '';
    for (let xx = 0; xx < 32; xx++) {
      const inside = xx >= 8 && xx < 24 && yy >= 8 && yy < 24;
      const idx = inside ? colourIndex(sheet.pixel(x + xx - 8, y + yy - 8)) : 0;
      row += idx === 0 ? '.' : String.fromCharCode(64 + idx);
    }
    rows.push(row);
  }
  const flat = rows.join('');
  let run = 0, last = null;
  for (const ch of flat) {
    if (ch === last) run++;
    else { if (last) out += last + (run > 1 ? run.toString(36) : ''); last = ch; run = 1; }
  }
  out += last + (run > 1 ? run.toString(36) : '');
  SPR.enemyExpl.f.push(out);
}
SPR.enemyExpl.f.push(encodeFrame(0, 112, 32, 32), encodeFrame(32, 112, 32, 32));

/* stage badges: the sheet holds them in the order 50, 30, 20, 10, 5, 1 */
const badgeCells = [[13, 1, 8], [12, 5, 8], [11, 10, 14], [10, 20, 16], [9, 30, 16], [8, 50, 16]];
SPR.badges = {};
for (const [cell, value, w] of badgeCells) {
  SPR.badges[value] = { w, h: 16, f: [encodeFrame(cell * 16, 48, w, 16)] };
}

/* 8x8 font: A-Z on the first row, 0-9 and punctuation on the second */
const FONT = {};
for (let i = 0; i < 26; i++) FONT[String.fromCharCode(65 + i)] = encodeFrame(i * 8, 224, 8, 8);
const row2 = '0123456789-  :!,@.%';
for (let i = 0; i < row2.length; i++) {
  const ch = row2[i];
  if (ch === ' ') continue;
  FONT[ch] = encodeFrame(i * 8, 232, 8, 8);
}

/* 4x8 score-popup digits (the compressed numerals on the sheet's last font row) */
SPR.smallDigits = { w: 4, h: 8, f: [] };
for (let i = 0; i < 10; i++) SPR.smallDigits.f.push(encodeFrame(i * 4, 240, 4, 8));

const block = [
  '/* @sprites-begin  (generated by tools/sprites.js from reference/galaga-arcade-sheet.png - do not edit by hand) */',
  'const PAL = ' + JSON.stringify(palette) + ';',
  'const SPR = ' + JSON.stringify(SPR) + ';',
  'const FONT = ' + JSON.stringify(FONT) + ';',
  '/* @sprites-end */'
].join('\n');

if (process.argv.includes('--splice')) {
  const file = path.join(__dirname, '..', 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const a = html.indexOf('/* @sprites-begin'), b = html.indexOf('/* @sprites-end */');
  if (a < 0 || b < 0) throw new Error('markers not found in index.html');
  fs.writeFileSync(file, html.slice(0, a) + block + html.slice(b + '/* @sprites-end */'.length));
  console.log('spliced ' + block.length + ' bytes of sprite data into index.html');
} else {
  process.stdout.write(block + '\n');
}
