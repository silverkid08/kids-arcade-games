/* Pull byte ranges out of the computerarcheology Frogger disassembly text
   (reference/ca/Code.txt), which lists ROM bytes as "ADDR: XX XX ..." lines.
     node tools/romdata.js 1841 1952        -> hex dump of that range
   The lane tables the game embeds (LANE_TIERS, SPEED_RING) were read with
   this; see README.md "Where the numbers come from". */
const fs = require('fs');
const path = require('path');
const txt = fs.readFileSync(path.join(__dirname, '..', 'reference', 'ca', 'Code.txt'), 'utf8');
const mem = new Map();
for (const line of txt.split(/\r?\n/)) {
  const m = /^([0-9A-F]{4}): ((?:[0-9A-F]{2}(?: |$))+)/.exec(line);
  if (!m) continue;
  const addr = parseInt(m[1], 16);
  const bytes = m[2].trim().split(' ');
  // instruction lines also match ("0119: CD B7 14 CALL ..."): bytes end where the mnemonic starts
  bytes.forEach((b, i) => mem.set(addr + i, parseInt(b, 16)));
}
function range(a, b) { const out = []; for (let i = a; i < b; i++) out.push(mem.has(i) ? mem.get(i) : -1); return out; }
module.exports = { mem, range };
if (require.main === module) {
  const [a, b] = process.argv.slice(2).map(s => parseInt(s, 16));
  const r = range(a, b);
  for (let i = 0; i < r.length; i += 16) {
    console.log((a + i).toString(16).toUpperCase().padStart(4, '0') + ': ' +
      r.slice(i, i + 16).map(v => v < 0 ? '??' : v.toString(16).toUpperCase().padStart(2, '0')).join(' '));
  }
}
