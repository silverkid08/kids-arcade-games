/* Runs the REAL game (tools/nes.js on the ROM rebuilt from the disassembly)
   and the JavaScript port side by side with the same joypad input, and
   compares the work RAM after every frame.  It prints the first frames where
   they differ.  This is how the port was checked to be frame-exact.

     node tools/lockstep.js [script] [frames] [maxReports]

   scripts: a1 (Selection A, track 1, a varied drive), b1 (Selection B track 1),
            t2..t5 (Selection A track N), demo (attract mode), all
   Both machines share the random register: the ROM advances it in its idle
   loop a variable number of times per frame, so its value at the start of
   each NMI is copied into the port before each frame.
*/
require('./harness.js');
const NES = require('./nes.js');
const L = require('./emu-lib.js');
const { build } = require('./build.js');

const B = NES.BTN;
function script(name) {
  // returns { setup: [[frames, pad]...], drive: f => pad }
  const nav = (sel, track) => {
    const s = [[60, 0]];
    for (let i = 0; i < sel; i++) s.push([3, B.SELECT], [6, 0]);
    s.push([5, B.START], [60, 0]);
    for (let i = 0; i < track; i++) s.push([3, B.RIGHT], [6, 0]);
    s.push([5, B.START]);
    return s;
  };
  const varied = f => {                       // throttle, turbo bursts, lane changes, leaning
    const t = f % 900;
    let p = B.A;
    if (t > 200 && t < 330) p = B.B;
    if (t > 400 && t < 420) p |= B.UP;
    if (t > 520 && t < 540) p |= B.DOWN;
    if ((f % 97) < 12) p |= B.LEFT;
    if ((f % 131) < 10) p |= B.RIGHT;
    if (f > 1500 && f < 1530) p = 0;
    return p;
  };
  switch (name) {
    case 'a1': return { setup: nav(0, 0), drive: varied };
    case 'b1': return { setup: nav(1, 0), drive: varied };
    case 't2': return { setup: nav(0, 1), drive: varied };
    case 't3': return { setup: nav(0, 2), drive: varied };
    case 't4': return { setup: nav(0, 3), drive: varied };
    case 't5': return { setup: nav(0, 4), drive: varied };
    case 'b3': return { setup: nav(1, 2), drive: varied };
    case 'demo': return { setup: [[60, 0]], drive: () => 0 };
    case 'crash': return { setup: nav(1, 1), drive: f => {      // turbo all the time, wild leaning: overheats and crashes
      let p = B.B | ((f % 1200) < 150 ? B.A : 0);
      if ((f % 53) < 20) p |= B.LEFT; else if ((f % 41) < 15) p |= B.RIGHT;
      if ((f % 200) < 8) p |= B.UP; if ((f % 170) < 6) p |= B.DOWN;
      if ((f % 400) === 0) p &= ~B.B;
      return p; } };
    case 'b5': return { setup: nav(1, 4), drive: varied };
    default: throw new Error('unknown script ' + name);
  }
}

function run(name, frames, maxReports) {
  const S = script(name);
  const n = L.boot();
  // capture the random register at each NMI entry, and which RAM the sound code writes
  let rngAtNmi = null, padAtRead = 0;
  const soundRam = new Set();
  const done = [];                            // RAM snapshots at each NMI exit (RTI at C27E)
  n.execHook = pc => {
    n.lastPC = pc;
    if (pc === 0xC23B) rngAtNmi = n.ram.slice(0x18, 0x20);
    if (pc === 0xD347) padAtRead = n.pad;
    if (pc === 0xC27E) done.push({ rng: rngAtNmi, ram: n.ram.slice(), pad: padAtRead, mode: n.ram[0x41] });
  };
  const stats = { crashes: 0, overheats: 0, jumps: 0 };
  n.watchW = (a, v) => {
    if (a < 0x800 && n.lastPC >= 0xF844) soundRam.add(a);
    if (a === 0x98 && v === 0xFF && n.ram[0x98] !== 0xFF) stats.crashes++;
    if (a === 0x3E0 && v && !n.ram[0x3E0]) stats.overheats++;
    if (a === 0xB0 && v === 2 && n.ram[0xB0] !== 2) stats.jumps++;
  };
  const G = build();
  G.setRng(0);
  G.powerOn();
  G.loadDesignIntoRom = G.loadDesignIntoRom;   // (unchanged)
  // the ROM's RESET runs for 2 frames before NMIs are enabled; mimic by stepping the emulator
  // until its first NMI, then running frame by frame
  const excluded = a => (a < 0x10) || (a >= 0x18 && a < 0x20) || (a >= 0x100 && a < 0x200) || soundRam.has(a) || (a >= 0x7E0);
  const pads = [];
  for (const [f, p] of S.setup) for (let i = 0; i < f; i++) pads.push(p);
  const total = pads.length + frames;
  let reports = 0, firstBad = -1, nmiCount = 0;
  for (let f = 0; f < total; f++) {
    const p = f < pads.length ? pads[f] : S.drive(f - pads.length);
    n.pad = p;
    n.frame();
    while (done.length) {
    const d = done.shift();
    nmiCount++;
    G.m.set(d.rng, 0x18);
    G.pad.now = d.pad;
    G.step();
    let bad = [];
    for (let a = 0; a < 0x800; a++) {
      if (excluded(a)) continue;
      if (d.ram[a] !== G.m[a]) bad.push(a);
    }
    if (bad.length) {
      if (firstBad < 0) firstBad = f;
      if (reports < maxReports) {
        console.log('frame ' + f + ' (nmi ' + nmiCount + ', mode ' + d.mode + '): ' + bad.length + ' bytes differ: ' +
          bad.slice(0, 16).map(a => a.toString(16) + ' emu=' + d.ram[a].toString(16) + ' js=' + G.m[a].toString(16)).join(', '));
        reports++;
      }
      // resync so later differences are independent
      for (const a of bad) G.m[a] = d.ram[a];
    }
    }
  }
  const r = n.ram, crashes = stats.crashes;
  console.log(name + ': mode ' + r[0x41] + ' track ' + (r[0x43] + 1) + ' main ' + r[0x46] + ' place ' + r[0x53] + ' crashes ' + crashes + ' overheats ' + stats.overheats + ' jumps ' + stats.jumps);
  console.log(name + ': ' + total + ' frames, ' + (firstBad < 0 ? 'RAM identical every frame' : 'first difference at frame ' + firstBad) +
    ' (sound RAM excluded: ' + soundRam.size + ' bytes)');
  return firstBad < 0;
}

module.exports = { script };
if (require.main === module) {
const name = process.argv[2] || 'a1';
const frames = +(process.argv[3] || 3000);
const maxR = +(process.argv[4] || 12);
if (name === 'all') {
  let ok = true;
  for (const s of ['a1', 'b1', 't2', 't3', 't4', 't5', 'b3', 'b5', 'crash', 'demo']) ok = run(s, frames, maxR) && ok;
  process.exit(ok ? 0 : 1);
} else run(name, frames, maxR);
}
