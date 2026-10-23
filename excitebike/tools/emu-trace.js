/* node tools/emu-trace.js <sel> <track> <frames> <padexpr> [addrs]
   prints per-frame changes of rider-0 variables.  padexpr is a JS expression of f. */
const L = require('./emu-lib.js');
const [sel, track, frames, padexpr, addrs] = process.argv.slice(2);
const n = L.boot(); L.startRace(n, +sel, +track);
const padFn = new Function('f', 'n', 'return ' + (padexpr || '0x80'));
let list = addrs ? addrs.split(',').map(s => parseInt(s, 16)) : [];
if (!list.length) { for (let a = 0x50; a < 0xE8; a += 4) list.push(a); for (let a = 0x360; a < 0x3A4; a += 4) list.push(a); list.push(0x3b6, 0x4c, 0x52, 0x26, 0x0a, 0x12, 0x3e0, 0x3e1, 0x3b5); }
const h = x => x.toString(16).padStart(2, '0');
let prev = list.map(a => n.ram[a]);
for (let f = 0; f < +frames; f++) {
  n.pad = padFn(f, n); n.frame();
  const ch = [];
  list.forEach((a, i) => { const v = n.ram[a]; if (v !== prev[i]) { ch.push(a.toString(16) + '=' + h(v)); prev[i] = v; } });
  if (ch.length) console.log(f, ch.join(' '));
}
