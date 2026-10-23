/* Rebuilds the 16 KB PRG ROM from the byte columns of the BZK listing
   (reference/disasm/bank_FF.asm, 32JP/NES-Games-Disassembly) and loads the
   8 KB CHR ROM.  Used only by the offline extraction tools; the game itself
   never contains the ROM.
     const { prg, chr } = require('./rom.js'); */
const fs = require('fs');
const path = require('path');
const D = path.join(__dirname, '..', 'reference', 'disasm');
function load() {
  const src = fs.readFileSync(path.join(D, 'bank_FF.asm'), 'utf8').split(/\r?\n/);
  const prg = new Uint8Array(0x4000);
  const seen = new Uint8Array(0x4000);
  const re = /0x00([0-9A-F]{4}) 00:([0-9A-F]{4}): ((?:[0-9A-F]{2} ){1,3})/;
  for (const line of src) {
    const m = re.exec(line); if (!m) continue;
    const addr = parseInt(m[2], 16) - 0xC000;
    let bytes = m[3].trim().split(' ').map(h => parseInt(h, 16));
    const mb = /\.byte\s+([^;]+)/.exec(line);
    if (mb && mb[1].indexOf(',') >= 0) bytes = mb[1].split(',').map(v => parseInt(v.trim().slice(1), 16));
    bytes.forEach((b, i) => { prg[addr + i] = b; seen[addr + i] = 1; });
  }
  let missing = 0; for (let i = 0; i < 0x4000; i++) if (!seen[i]) missing++;
  const chr = new Uint8Array(fs.readFileSync(path.join(D, 'CHR_ROM.chr')));
  return { prg, chr, missing };
}
module.exports = load();
if (require.main === module) {
  const r = module.exports;
  console.log('missing bytes', r.missing, 'reset', (r.prg[0x3FFD] << 8 | r.prg[0x3FFC]).toString(16), 'nmi', (r.prg[0x3FFB] << 8 | r.prg[0x3FFA]).toString(16));
  const z = require('zlib');
  if (z.crc32) console.log('crc32 prg', z.crc32(Buffer.from(r.prg)).toString(16), 'chr', z.crc32(Buffer.from(r.chr)).toString(16));
}
