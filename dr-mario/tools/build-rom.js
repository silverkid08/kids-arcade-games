/* Assembles the Dr. Mario disassembly (reference/disasm/nostaljipi, by
   Nostaljipi, github.com/Nostaljipi/dr-mario-disassembly) with the asm6f
   assembler it ships with, in its vanilla configuration (completeCleanup = 0),
   into reference/build/drmario.nes + drmario.lst.  The result is checked
   against the Rev A checksum published with brianhuffman/drmario
   (reference/disasm/huffman/drmario_a.nes.md5).

   Only the offline tools use it (extract.js reads tiles, screens and the sound
   driver from it; rom-diff.js runs it next to the JavaScript port).  Nothing
   from it is loaded by index.html at run time except the extracted data.

     node tools/build-rom.js           (Windows: asm6f.exe)                 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'reference', 'disasm', 'nostaljipi');
const OUT = path.join(ROOT, 'reference', 'build');
const WANT = '8181d696756578fc92e6c4c86da01904';

function copyDir(a, b) {
  fs.mkdirSync(b, { recursive: true });
  for (const e of fs.readdirSync(a, { withFileTypes: true })) {
    if (e.name === '.git') continue;
    const s = path.join(a, e.name), d = path.join(b, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

function buildRom(quiet) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'drmario-'));
  copyDir(SRC, tmp);
  const cfg = path.join(tmp, 'build_config.asm');
  fs.writeFileSync(cfg, fs.readFileSync(cfg, 'utf8').replace(/^completeCleanup\s*=\s*1/m, 'completeCleanup     = 0'));
  execFileSync(path.join(tmp, 'asm6f.exe'), ['drmario.asm', 'drmario.nes', '-l'], { cwd: tmp, stdio: quiet ? 'ignore' : 'inherit' });
  fs.mkdirSync(OUT, { recursive: true });
  fs.copyFileSync(path.join(tmp, 'drmario.nes'), path.join(OUT, 'drmario.nes'));
  fs.copyFileSync(path.join(tmp, 'drmario.lst'), path.join(OUT, 'drmario.lst'));
  fs.rmSync(tmp, { recursive: true, force: true });
  const md5 = crypto.createHash('md5').update(fs.readFileSync(path.join(OUT, 'drmario.nes'))).digest('hex');
  if (md5 !== WANT) throw new Error('assembled ROM md5 ' + md5 + ' != Rev A ' + WANT);
  if (!quiet) console.log('reference/build/drmario.nes: md5 ' + md5 + ' (Dr. Mario Rev A, byte-exact)');
  return md5;
}

if (require.main === module) buildRom(false);
module.exports = { buildRom };
