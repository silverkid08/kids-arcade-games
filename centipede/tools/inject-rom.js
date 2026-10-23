/* Embeds the genuine Centipede picture ROMs into index.html as base64.
     node tools/inject-rom.js
   Source: reference/src/revision.v2/136001.201 + .202 (historicalsource/centipede).
   Their CRCs (880acfb9, b1397029) equal MAME's 136001-211.f7 / 136001-212.hj7,
   the picture ROMs of the "centiped" (revision 4) set. */
const fs = require('fs');
const path = require('path');
const R = path.join(__dirname, '..');
const lo = fs.readFileSync(path.join(R, 'reference/src/revision.v2/136001.201'));
const hi = fs.readFileSync(path.join(R, 'reference/src/revision.v2/136001.202'));
const b64 = Buffer.concat([lo, hi]).toString('base64');
const file = path.join(R, 'index.html');
let html = fs.readFileSync(file, 'utf8');
const a = html.indexOf('/*ROM-BEGIN*/'), b = html.indexOf('/*ROM-END*/');
if (a < 0 || b < 0) throw new Error('ROM markers not found');
html = html.slice(0, a) + "/*ROM-BEGIN*/const PICT_ROM = '" + b64 + "';" + html.slice(b);
fs.writeFileSync(file, html);
console.log('embedded ' + (lo.length + hi.length) + ' bytes of picture ROM');
