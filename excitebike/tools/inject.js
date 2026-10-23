/* Splices the generated data blocks into index.html:
     reference/data.gen.js                         -> DATA-BEGIN / DATA-END
     reference/music.gen.js + reference/sound.gen.js -> MUSIC-BEGIN / MUSIC-END
   Run after tools/extract-data.js or tools/extract-music.js:  node tools/inject.js */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const file = path.join(root, 'index.html');
let html = fs.readFileSync(file, 'utf8');
function splice(tag, srcs) {
  const a = html.indexOf('/*' + tag + '-BEGIN*/'), b = html.indexOf('/*' + tag + '-END*/');
  if (a < 0 || b < 0 || b < a) throw new Error(tag + ' markers not found in index.html');
  const have = srcs.filter(s => fs.existsSync(path.join(root, 'reference', s)));
  if (!have.length) { console.log('skip ' + tag + ' (no source files yet)'); return; }
  const body = have.map(s => fs.readFileSync(path.join(root, 'reference', s), 'utf8').trim()).join('\n');
  html = html.slice(0, a + tag.length + 10) + '\n' + body + '\n' + html.slice(b);
}
splice('DATA', ['data.gen.js']);
splice('MUSIC', ['music.gen.js', 'sound.gen.js']);
fs.writeFileSync(file, html);
console.log('index.html updated (' + html.length + ' bytes)');
