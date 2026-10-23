/* node tools/emu-shot.js <script> <out.png>
   script: comma list of  N (run N frames idle) | N:BTNS (hold buttons, e.g. 30:START, 200:A+RIGHT) */
const NES = require('./nes.js'); const { prg, chr } = require('./rom.js'); const { encodePNG } = require('./png.js');
const n = new NES(prg, chr); n.reset();
const script = (process.argv[2] || '120').split(',');
for (const step of script) { const [f, b] = step.split(':'); let pad = 0; if (b) for (const k of b.split('+')) pad |= NES.BTN[k]; n.run(+f, pad); }
const out = process.argv[3] || 'tools/out/emu.png';
const S = 2, rgb = n.rgb(), big = Buffer.alloc(256 * S * 240 * S * 3);
for (let y = 0; y < 240 * S; y++) for (let x = 0; x < 256 * S; x++) rgb.copy(big, (y * 256 * S + x) * 3, ((y / S | 0) * 256 + (x / S | 0)) * 3, ((y / S | 0) * 256 + (x / S | 0)) * 3 + 3);
require('fs').mkdirSync('tools/out', { recursive: true });
encodePNG(out, 256 * S, 240 * S, big);
console.log('frame', n.frameNo, 'PC', n.PC.toString(16));
