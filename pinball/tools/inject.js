/* Splices the generated data blocks into index.html:
     reference/art.gen.js        -> ART-BEGIN / ART-END       (tools/extract-art.js)
     reference/audio.gen.js      -> SOUNDS-BEGIN / SOUNDS-END (tools/extract-audio.js)
     reference/colliders.gen.js  -> WALLS-BEGIN / WALLS-END   (tools/trace.js)
   Run after any of those:   node tools/inject.js */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const file = path.join(root, 'index.html');
let html = fs.readFileSync(file, 'utf8');

function splice(tag, src) {
  const a = html.indexOf('/*' + tag + '-BEGIN*/'), b = html.indexOf('/*' + tag + '-END*/');
  if (a < 0 || b < 0 || b < a) throw new Error(tag + ' markers not found in index.html');
  const body = fs.readFileSync(path.join(root, 'reference', src), 'utf8').trim();
  html = html.slice(0, a + tag.length + 10) + '\n' + body + '\n' + html.slice(b);
}

splice('ART', 'art.gen.js');
splice('SOUNDS', 'audio.gen.js');
splice('WALLS', 'colliders.gen.js');
fs.writeFileSync(file, html);
console.log('index.html updated (' + html.length + ' bytes)');
