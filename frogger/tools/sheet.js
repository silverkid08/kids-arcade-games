/* ASCII dump of a region of a PNG, one letter per palette colour.
     node tools/sheet.js <png> <x> <y> <w> <h>
   Used to read frame coordinates off the GaryCXJk arcade sprite sheet. */
const path = require('path');
const { decodePNG } = require('./png.js');

const [file, x0, y0, w, h] = process.argv.slice(2);
const img = decodePNG(path.resolve(file));
const X = +x0 || 0, Y = +y0 || 0, W = +w || img.w, H = +h || img.h;

/* Frogger arcade palette as it appears on the sheet. */
const KEY = {
  '000000': '.', '000047': '.', 'dedef7': 'w', '21de00': 'g', '9700f7': 'p',
  'ffff00': 'y', 'ff0000': 'r', '00def7': 'c', 'de684f': 'b', 'ff47f7': 'm',
  'ff4700': 'o', '0000f7': 'B', '97684f': 'd', '97ff00': 'l', 'ff00f7': 'M'
};
let header = '     ';
for (let x = X; x < X + W; x++) header += (x % 16 === 0) ? '|' : (x % 8 === 0 ? ':' : ' ');
console.log(header);
for (let y = Y; y < Y + H; y++) {
  let s = String(y).padStart(4) + ' ';
  for (let x = X; x < X + W; x++) {
    const p = img.pixel(x, y);
    const k = p.map(v => v.toString(16).padStart(2, '0')).join('');
    s += KEY[k] || '?';
  }
  console.log(s);
}
