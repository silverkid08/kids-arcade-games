/* Rebuilds the Pinball (World) cartridge image IN MEMORY from the public
   disassembly in reference/disasm/pinball.asm (rbmichael/pinball_nes_disassembly,
   author "ninespaces").  Every code line there carries its address and raw
   bytes in a comment ("; $C000  D8"), data lines carry their address
   (".byte ... ; $C16A"), and the TILES segment is the 8 KB CHR ROM.
   Nothing is written to disk; the tools that need the ROM call load().

   The PRG / CHR CRC32s are checked against the ones the disassembly quotes. */
'use strict';
const fs = require('fs');
const path = require('path');

const ASM = path.join(__dirname, '..', 'reference', 'disasm', 'pinball.asm');

function crc32(buf) {
  let c, crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = (crc ^ buf[i]) & 0xFF;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

let cache = null;
function load() {
  if (cache) return cache;
  const text = fs.readFileSync(ASM, 'utf8');
  const prg = new Uint8Array(0x4000);
  const chr = [];
  const labels = {};
  let seg = '', filled = 0;
  for (const raw of text.split(/\r?\n/)) {
    const s = raw.match(/^\.segment\s+"(\w+)"/);
    if (s) { seg = s[1]; continue; }
    if (seg === 'CODE') {
      const lab = raw.match(/^([A-Za-z_][A-Za-z0-9_]*):/);
      if (lab) { labels[lab[1]] = -1; labels._pending = lab[1]; continue; }
      let m = raw.match(/;\s*\$([0-9A-F]{4})\s+([0-9A-F]{2}(?: [0-9A-F]{2}){0,2})(?=\s|$)/);
      if (m && !/^\s*\.byte/.test(raw)) {
        const a = parseInt(m[1], 16);
        const bytes = m[2].trim().split(/\s+/).map(h => parseInt(h, 16));
        if (labels._pending) { labels[labels._pending] = a; labels._pending = null; }
        bytes.forEach((b, i) => { prg[a - 0xC000 + i] = b; filled++; });
        continue;
      }
      m = raw.match(/^\s*\.byte\s+([^;]*);\s*\$([0-9A-F]{4})/);
      if (m) {
        const a = parseInt(m[2], 16);
        if (labels._pending) { labels[labels._pending] = a; labels._pending = null; }
        m[1].split(',').map(t => t.trim()).filter(Boolean).forEach((t, i) => { prg[a - 0xC000 + i] = parseInt(t.replace('$', ''), 16); filled++; });
      }
    } else if (seg === 'TILES') {
      const m = raw.match(/^\s*\.byte\s+([^;]*)/);
      if (m) m[1].split(',').map(t => t.trim()).filter(Boolean).forEach(t => chr.push(parseInt(t.replace('$', ''), 16)));
    } else if (seg === 'VECTORS') {
      const m = raw.match(/\.addr\s+(\w+),\s*(\w+),\s*(\w+)/);
      if (m) {
        const v = [labels[m[1]], labels[m[2]], labels[m[3]]];
        [0, 1, 2].forEach(i => { prg[0x3FFA + i * 2] = v[i] & 0xFF; prg[0x3FFB + i * 2] = v[i] >> 8; filled += 2; });
      }
    }
  }
  delete labels._pending;
  while (chr.length < 8192) chr.push(0);   // the listing stops 4 zero bytes short of the 8 KB CHR
  const chrBuf = Uint8Array.from(chr);
  const out = {
    prg, chr: chrBuf, labels, filled,
    prgCRC: crc32(prg), chrCRC: crc32(chrBuf),
    ok: crc32(prg) === 0x91d33e3c && crc32(chrBuf) === 0xf2a53b3d
  };
  cache = out;
  return out;
}

module.exports = { load, crc32 };

if (require.main === module) {
  const r = load();
  console.log('PRG bytes filled ' + r.filled + '/16384  CRC ' + r.prgCRC.toString(16) + '  CHR ' + r.chr.length + ' bytes CRC ' + r.chrCRC.toString(16) + '  match=' + r.ok);
}
