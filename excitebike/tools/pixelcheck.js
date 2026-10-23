/* Renders the port and the emulator at chosen frames of a lockstep script and
   reports pixel differences (and writes both PNGs to tools/out/).
     node tools/pixelcheck.js <script> <frames...>      (scripts as in tools/lockstep.js) */
require('./harness.js');
const L = require('./emu-lib.js'); const { build } = require('./build.js'); const F = require('./frame-png.js');
const { script } = require('./lockstep.js');
const S = script(process.argv[2] || 'a1');
const shots = (process.argv.slice(3).length ? process.argv.slice(3) : ['300', '900', '1500']).map(Number);
const n = L.boot(); const G = build(); G.setRng(0); G.powerOn();
let rng = null, padRead = 0; const done = [];
n.execHook = pc => { if (pc === 0xC23B) rng = n.ram.slice(0x18, 0x20); if (pc === 0xD347) padRead = n.pad; if (pc === 0xC27E) done.push({ rng, pad: padRead }); };
const seq = []; for (const [f, p] of S.setup) for (let i = 0; i < f; i++) seq.push(p);
let bad = 0;
for (let f = 0; f < seq.length + Math.max(...shots) + 1; f++) {
  const k = f - seq.length;
  n.pad = f < seq.length ? seq[f] : S.drive(k);
  n.frame();
  while (done.length) { const d = done.shift(); G.m.set(d.rng, 0x18); G.pad.now = d.pad; G.step(); }
  if (shots.includes(k)) {
    G.render();
    const e = F.emuRGBA(n), dif = F.diff(G.img.data, e);
    F.writeRGBA(__dirname + '/out/px-js-' + k + '.png', G.img.data, 256, 240);
    F.writeRGBA(__dirname + '/out/px-emu-' + k + '.png', e, 256, 240);
    console.log('frame ' + k + ' (mode ' + n.ram[0x41] + '): ' + dif + ' pixels differ');
    if (dif) bad++;
  }
}
process.exitCode = bad ? 1 : 0;
