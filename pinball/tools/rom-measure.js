/* Measures the REAL game's physics by running the Pinball ROM (rebuilt
   byte-exact from reference/disasm/pinball.asm) in the offline emulator and
   reading the ball's RAM: X = $16.$15, Y = $18.$17 (8.8 fixed point, the
   ball's centre is X+0.5, Y+0.5), $BF = screen (0 upper, 1 lower, 2 bonus),
   $1D = ball steps per frame.  Prints the numbers index.html is built on.

     node tools/rom-measure.js                                            */
'use strict';
const { NES } = require('./nes.js');

function boot(gameB) {
  const n = new NES(); n.run(120);
  if (gameB) { n.run(3, NES.BTN.select); n.run(10, 0); }
  n.run(5, NES.BTN.start); n.run(400, 0);
  return n;
}
function clone(b) {
  const n = Object.create(Object.getPrototypeOf(b)); Object.assign(n, b);
  n.ram = b.ram.slice(); n.vram = b.vram.slice(); n.pal = b.pal.slice(); n.oam = b.oam.slice(); n.apu = b.apu.slice();
  n.pad = [0, 0]; n.padShift = [0, 0]; n.apuLog = [];
  const c = Object.create(Object.getPrototypeOf(b.cpu)); Object.assign(c, b.cpu); c.read = a => n.read(a); c.write = (a, v) => n.write(a, v); n.cpu = c;
  return n;
}
const pos = n => [n.ram[0x16] + n.ram[0x15] / 256, n.ram[0x18] + n.ram[0x17] / 256];
function place(n, x, y) { n.ram[0x16] = x; n.ram[0x15] = 0; n.ram[0x18] = y; n.ram[0x17] = 0; for (const a of [0x0A, 0x0B, 0x0C, 0x0D, 0x19, 0x1A]) n.ram[a] = 0; }
const s16 = (lo, hi) => { const v = hi * 256 + lo; return v >= 32768 ? v - 65536 : v; };

for (const gb of [0, 1]) {
  const L = gb ? 'B' : 'A';
  const base = boot(gb);
  console.log('=== Game ' + L + ' ===');
  // launch speed vs frames held (vy in 1/256 px per step, most negative after release)
  const rows = [];
  for (const hold of [1, 3, 5, 8, 10, 15, 19, 30]) {
    const n = clone(base); let minv = 0;
    for (let f = 0; f < hold + 30; f++) { n.pad[0] = f < hold ? NES.BTN.a : 0; n.runFrame(); minv = Math.min(minv, s16(n.ram[0x0C], n.ram[0x0D])); }
    rows.push(hold + ':' + (-minv));
  }
  console.log('striker launch speed (held frames:1/256 px per step): ' + rows.join('  '));
  // free fall from rest on the upper table
  const up = clone(base); up.run(25, NES.BTN.a); up.run(40, 0);
  { const n = clone(up); place(n, 176, 130); n.runFrame(); const y0 = pos(n)[1]; n.run(40, 0); const d = pos(n)[1] - y0; console.log('free fall in 40 frames: ' + d.toFixed(2) + ' px  ->  ' + Math.sqrt(2 * d / (0.8 / 256 * 1600)).toFixed(2) + ' ball steps per frame at 0.8/256 px per step^2'); }
  // flipper pose timing
  { const n = clone(up); let s = ''; for (let f = 0; f < 30; f++) { n.pad[0] = f < 14 ? NES.BTN.left : 0; n.runFrame(); s += { 0xC0: 'd', 0xC5: 'm', 0xC9: 'u' }[n.oam[15 * 4 + 1]] || '?'; } console.log('left flipper pose per frame (press 14 frames): ' + s); }
  // flipper exit speed by contact position (upper left flipper, pivot ~108,204)
  const ex = [];
  for (const x0 of [110, 114, 118, 122, 126]) {
    const n0 = clone(up); place(n0, x0, 186); let best = 0;
    for (let pf = 0; pf < 40; pf += 2) {
      const n = clone(n0); for (let f = 0; f < pf; f++) n.runFrame();
      const ps = []; for (let f = 0; f < 25; f++) { n.pad[0] = NES.BTN.left; n.runFrame(); ps.push(pos(n)); }
      best = Math.min(best, (ps[18][1] - ps[14][1]) / 4);
    }
    ex.push('x' + x0 + ':' + best.toFixed(2));
  }
  console.log('flipper exit vy (px/frame, best over press timings): ' + ex.join('  '));
  // hole kicker
  { const n = clone(up); place(n, 208, 170); let held = 0, rel = -1, v = null; const tr = [];
    for (let f = 0; f < 200; f++) { n.runFrame(); const b = pos(n); tr.push(b); if (Math.abs(b[0] - 208) < 0.1 && Math.abs(b[1] - 179.8) < 0.3) held++; else if (held && rel < 0) rel = f; }
    if (rel > 0) v = [(tr[rel + 6][0] - tr[rel + 2][0]) / 4, (tr[rel + 6][1] - tr[rel + 2][1]) / 4];
    console.log('hole kicker: holds ' + held + ' frames, then ' + (v ? v.map(t => t.toFixed(2)).join(', ') : '?') + ' px/frame'); }
  // pop bumper bounce (drop from rest onto the scene A bumper)
  { const n = clone(up); place(n, 144, 72); let prev = pos(n), out = 0;
    for (let f = 0; f < 50; f++) { n.runFrame(); const p = pos(n); if (p[1] < prev[1]) out = Math.max(out, prev[1] - p[1]); prev = p; }
    console.log('pop bumper: ball dropped ~10 px leaves at up to ' + out.toFixed(2) + ' px/frame'); }
}
// slot target and Mario speeds
{
  const n = boot(0); n.run(25, NES.BTN.a); n.run(40, 0); place(n, 150, 60);
  const xs = []; for (let f = 0; f < 240; f++) { n.runFrame(); xs.push(n.oam[61 * 4 + 3]); }
  console.log('pink slot target x range ' + Math.min(...xs) + '-' + Math.max(...xs) + ', moves 1 px per ' + (() => { let c = 0, k = 0; for (let i = 1; i < 60; i++) if (xs[i] !== xs[i - 1]) { c++; } return (59 / c).toFixed(1); })() + ' frames');
  const b = boot(0); b.run(3, NES.BTN.a); b.run(1, 0); place(b, 207, 31);
  for (let i = 0; i < 400 && b.ram[0xBF] !== 2; i++) b.runFrame();
  const mx = []; for (let f = 0; f < 100; f++) { b.pad[0] = NES.BTN.right; b.runFrame(); const o = []; for (let s = 0; s < 64; s++) if (b.oam[s * 4 + 1] === 0x25 && b.oam[s * 4] < 0xEF) o.push(b.oam[s * 4 + 3]); if (o.length) mx.push(Math.min(...o)); }
  console.log('bonus stage: Mario paddle left edge ' + Math.min(...mx) + '-' + Math.max(...mx) + ', ' + ((mx[30] - mx[10]) / 20).toFixed(2) + ' px/frame');
}
