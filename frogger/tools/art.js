/* Builds the embedded art block for index.html from the GaryCXJk arcade rip
   in reference/ (see README.md "Art"):
     reference/frogger1-img3.png   10x10 grid of 16x16 arcade sprites
     reference/frogger1-img2.png   the 224x256 arcade background screen
     reference/frogger1-img1.png   the full 768x704 sheet (used for the font)
   Output: a JS fragment written between the markers
     // ART-BEGIN ... // ART-END
   in index.html (run `node tools/art.js` to regenerate).  Everything is a
   palette-indexed string so the game needs no image decoding at runtime. */
const fs = require('fs');
const path = require('path');
const { decodePNG } = require('./png.js');

const REF = path.join(__dirname, '..', 'reference');
const sheet = decodePNG(path.join(REF, 'frogger1-img3.png'));
const bg = decodePNG(path.join(REF, 'frogger1-img2.png'));
const big = decodePNG(path.join(REF, 'frogger1-img1.png'));

/* The 15 colours of the rip (the arcade's 3-bit-per-gun palette as GaryCXJk
   captured it).  Index 0 is black, and the sheet's blue backdrop (#0000f7)
   becomes '.' = transparent in sprites. */
const PAL = ['000000', '000047', 'dedef7', '21de00', '9700f7', 'ffff00', 'ff0000', '00def7',
             'de684f', 'ff47f7', 'ff4700', '0000f7', '97684f', '97ff00', 'ff00f7'];
const CH = '0123456789abcde';           // palette index -> character
const TRANSPARENT = 11;                  // #0000f7, the sprite backdrop

function idx(img, x, y) {
  const p = img.pixel(x, y);
  const k = p.map(v => v.toString(16).padStart(2, '0')).join('');
  const i = PAL.indexOf(k);
  if (i < 0) throw new Error('unknown colour ' + k + ' at ' + x + ',' + y);
  return i;
}

/* sprites: 100 cells, each a 256-char string, row-major */
const sprites = [];
for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
  let s = '';
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const i = idx(sheet, c * 16 + x, r * 16 + y);
    s += i === TRANSPARENT ? '.' : CH[i];
  }
  sprites.push(s);
}

/* background: rows 24..239 of the arcade screen (hedges, river, median,
   road, sidewalk).  The score header and the bottom status row are drawn
   by the game.  RLE: run char followed by a decimal count when > 1. */
function rle(str) {
  let out = '', i = 0;
  while (i < str.length) {
    let j = i;
    while (j < str.length && str[j] === str[i] && j - i < 999) j++;
    out += str[i] + (j - i > 1 ? (j - i) : '');
    i = j;
  }
  return out;
}
const BG_TOP = 24, BG_BOTTOM = 240;
let bgStr = '';
for (let y = BG_TOP; y < BG_BOTTOM; y++) for (let x = 0; x < 224; x++) bgStr += CH[idx(bg, x, y)];
const bgRle = rle(bgStr);
// sanity: decode and compare
(function () {
  let s = '', i = 0;
  while (i < bgRle.length) {
    const ch = bgRle[i++]; let n = '';
    while (i < bgRle.length && bgRle[i] >= '0' && bgRle[i] <= '9' && ch !== undefined && !(n === '' && false)) {
      // digits are palette chars too, so a count is only the digits that FOLLOW a char
      // and are not themselves the next run's char -- resolved by the decoder rule below
      break;
    }
    s += ch;
  }
})();

/* Digits are palette characters, so a plain "char+count" RLE is ambiguous.
   Use a different scheme: emit the run character, then the count encoded in
   letters g-z (base 20, little-endian digit chunks) so counts never collide
   with palette chars 0-9a-e. */
function rle2(str) {
  let out = '', i = 0;
  while (i < str.length) {
    let j = i;
    while (j < str.length && str[j] === str[i]) j++;
    let n = j - i;
    out += str[i];
    if (n > 1) {
      let enc = '';
      while (n > 0) { enc += String.fromCharCode(103 + (n % 20)); n = Math.floor(n / 20); }
      out += enc;
    }
    i = j;
  }
  return out;
}
function unrle2(enc) {
  let out = '', i = 0;
  while (i < enc.length) {
    const ch = enc[i++];
    let n = 0, mul = 1;
    while (i < enc.length && enc.charCodeAt(i) >= 103) { n += (enc.charCodeAt(i) - 103) * mul; mul *= 20; i++; }
    out += ch.repeat(n || 1);
  }
  return out;
}
const bgEnc = rle2(bgStr);
if (unrle2(bgEnc) !== bgStr) throw new Error('bg RLE round-trip failed');

/* font: 8x8 1-bit glyphs from the big sheet's white alphabet
   digits at (208+16k, 32), A-J at y=48, K-T at y=64, U-Z and '-' at y=80 */
const font = {};
function glyph(gx, gy) {
  const rows = [];
  for (let y = 0; y < 8; y++) {
    let bits = 0;
    for (let x = 0; x < 8; x++) {
      const p = big.pixel(gx + x, gy + y);
      if (p[0] > 100 && p[1] > 100 && p[2] > 100) bits |= 0x80 >> x;
    }
    rows.push(bits.toString(16).padStart(2, '0'));
  }
  return rows.join('');
}
const ROWS = ['0123456789', 'ABCDEFGHIJ', 'KLMNOPQRST', 'UVWXYZ-'];
ROWS.forEach((chars, r) => {
  for (let k = 0; k < chars.length; k++) font[chars[k]] = glyph(208 + 16 * k, 32 + 16 * r);
});

/* small HUD icons from the background screen: the life frog (8x7 at 1,241)
   and the level marker (6x6 at 203,241) */
function icon(img, x0, y0, w, h) {
  let s = '';
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = idx(img, x0 + x, y0 + y);
    s += i === 0 ? '.' : CH[i];
  }
  return s;
}
const lifeIcon = icon(bg, 1, 241, 7, 7);
const levelIcon = icon(bg, 202, 241, 6, 7);

const block = [
  '// ART-BEGIN  (generated by tools/art.js from the GaryCXJk arcade rip in reference/ -- do not hand-edit)',
  'const PAL = ' + JSON.stringify(PAL.map(h => '#' + h)) + ';',
  "const PALCH = '" + CH + "';",
  'const SPRITE_ROWS = ' + JSON.stringify(sprites) + ';',
  "const BG_TOP = " + BG_TOP + ", BG_H = " + (BG_BOTTOM - BG_TOP) + ";",
  "const BG_RLE = '" + bgEnc + "';",
  'const FONT = ' + JSON.stringify(font) + ';',
  "const LIFE_ICON = { w: 7, h: 7, px: '" + lifeIcon + "' };",
  "const LEVEL_ICON = { w: 6, h: 7, px: '" + levelIcon + "' };",
  '// ART-END'
].join('\n');

const htmlPath = path.join(__dirname, '..', 'index.html');
if (fs.existsSync(htmlPath)) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const a = html.indexOf('// ART-BEGIN'), b = html.indexOf('// ART-END');
  if (a < 0 || b < 0) throw new Error('index.html has no ART markers');
  fs.writeFileSync(htmlPath, html.slice(0, a) + block + html.slice(b + '// ART-END'.length));
  console.log('spliced art block into index.html (' + block.length + ' chars)');
} else {
  fs.writeFileSync(path.join(__dirname, '.art-block.js'), block);
  console.log('wrote tools/.art-block.js (' + block.length + ' chars)');
}

/* verification dump of a few cells when asked */
if (process.argv[2] === 'show') {
  const cells = process.argv.slice(3).map(Number);
  for (const n of cells) {
    console.log('cell ' + n);
    for (let y = 0; y < 16; y++) console.log('  ' + sprites[n].slice(y * 16, y * 16 + 16));
  }
  for (const ch of ['0', 'A', 'M', 'T', '-']) {
    console.log('glyph ' + ch);
    for (let y = 0; y < 8; y++) console.log('  ' + parseInt(font[ch].slice(y * 2, y * 2 + 2), 16).toString(2).padStart(8, '0').replace(/0/g, '.').replace(/1/g, '#'));
  }
  console.log('life icon'); for (let y = 0; y < 7; y++) console.log('  ' + lifeIcon.slice(y * 7, y * 7 + 7));
  console.log('level icon'); for (let y = 0; y < 7; y++) console.log("  " + levelIcon.slice(y * 6, y * 6 + 6));
}
