/* Splices the generated data blocks into index.html:
     reference/art.gen.js    -> between ART-BEGIN / ART-END
     reference/audio.gen.js  -> between AUDIO-BEGIN / AUDIO-END
   Run after tools/extract.js:   node tools/inject.js */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const file = path.join(root, 'index.html');
let html = fs.readFileSync(file, 'utf8');

function splice(tag, src) {
  const open = '/*' + tag + '-BEGIN*/', close = '/*' + tag + '-END*/';
  const a = html.indexOf(open), b = html.indexOf(close);
  if (a < 0 || b < 0 || b < a) throw new Error(tag + ' markers not found in index.html');
  const body = fs.readFileSync(path.join(root, 'reference', src), 'utf8').trim();
  html = html.slice(0, a + open.length) + '\n' + body + '\n' + html.slice(b);
}

splice('ART', 'art.gen.js');
splice('AUDIO', 'audio.gen.js');
fs.writeFileSync(file, html);
console.log('index.html updated (' + html.length + ' bytes)');
