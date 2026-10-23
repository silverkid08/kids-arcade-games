/* helpers for driving the emulator from research scripts */
const NES = require('./nes.js'); const { prg, chr } = require('./rom.js');
function boot() { const n = new NES(prg, chr); n.reset(); return n; }
function startRace(n, sel, track) {      // sel 0=A 1=B; track 0..4
  n.run(60, 0);
  for (let i = 0; i < sel; i++) { n.run(3, NES.BTN.SELECT); n.run(6, 0); }
  n.run(5, NES.BTN.START); n.run(60, 0);
  for (let i = 0; i < track; i++) { n.run(3, NES.BTN.RIGHT); n.run(6, 0); }
  n.run(5, NES.BTN.START);
}
function writers(n, addrs, frames, padFn) {
  const set = new Map(); const want = new Set(addrs);
  n.watchW = (a, v) => { if (want.has(a)) { const k = a.toString(16) + '@' + n.lastPC.toString(16); set.set(k, (set.get(k) || 0) + 1); } };
  n.execHook = pc => { n.lastPC = pc; };
  for (let f = 0; f < frames; f++) { n.pad = padFn ? padFn(f) : 0; n.frame(); }
  n.watchW = null; n.execHook = null;
  return set;
}
module.exports = { NES, boot, startRace, writers, prg, chr };
