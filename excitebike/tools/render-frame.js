/* Runs the real game headlessly and writes what the canvas would show to a
   PNG, so the art can be checked with an image viewer (or the Read tool).

     node tools/render-frame.js [scenario] [out.png] [scale]

   scenarios: title select start race jump crash run overheat selb finish
              results message designmenu design designrace kid sheet all
*/
require('./harness.js');
const path = require('path');
const fs = require('fs');
const { build } = require('./build.js');
const { writeRGBA } = require('./frame-png.js');

const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
const G = build();
const { m, BTN } = G;

function boot(preset) {
  G.applyPreset(preset || 'original');
  G.toTitle(false);
  for (let i = 0; i < 30; i++) G.step();
}
const frames = (n, pad) => { for (let i = 0; i < n; i++) { G.pad.now = typeof pad === 'function' ? pad(i) : (pad || 0); G.step(); } };
const until = (f, max, pad) => { for (let i = 0; i < (max || 20000) && !f(); i++) { G.pad.now = typeof pad === 'function' ? pad(i) : (pad || 0); G.step(); } };
const tap = b => { frames(4, b); frames(8, 0); };
function toRace(sel, track) {
  G.startMode(sel === 1 ? 'B' : 'A');
  until(() => m[0x41] === 1 && m[0x40], 600);
  frames(10, 0);
  for (let i = 0; i < track; i++) tap(BTN.R);
  tap(BTN.START);
  until(() => m[0x47] && m[0x40], 600);
}
const drive = i => ((i % 500) < 380 ? BTN.A : BTN.B);

const scenarios = {
  title() { boot(); frames(30); },
  select() { boot(); G.startMode('A'); frames(60); tap(BTN.R); tap(BTN.R); },
  start() { boot(); toRace(0, 0); frames(200); },
  race() { boot(); toRace(0, 0); until(() => m[0x4F], 2000); frames(700, BTN.A); },
  jump() { boot(); toRace(0, 0); until(() => m[0x4F], 2000); until(() => m[0xB0] === 2 && m[0x8C] < 0x70, 6000, BTN.A | BTN.L); },
  crash() { boot(); toRace(0, 1); until(() => m[0x4F], 2000); until(() => m[0x98] === 0xFF, 8000, i => BTN.B | ((i & 64) ? BTN.R : BTN.L)); frames(12, 0); },
  run() { boot(); toRace(0, 1); until(() => m[0x4F], 2000); until(() => m[0x9C] === 3, 8000, i => BTN.B | ((i & 64) ? BTN.R : BTN.L)); frames(30, 0); },
  overheat() { boot(); toRace(0, 0); until(() => m[0x4F], 2000); until(() => m[0x3E0] && (m[0x3C] & 1), 6000, BTN.B); frames(3, BTN.B); },
  selb() { boot(); toRace(1, 0); until(() => m[0x4F], 2000); frames(900, drive); until(() => m[0xA9] + m[0xAA] + m[0xAB] >= 2, 3000, drive); },
  finish() { boot('kid'); toRace(0, 0); until(() => m[0x52] === 1, 30000, BTN.A); frames(40); },
  results() { boot('kid'); toRace(0, 0); until(() => m[0x52] === 1, 30000, BTN.A); until(() => m[0x41] === 3 && m[0x44] === 2 && m[0x33] < 0x18, 3000); frames(40); },
  message() { boot('kid'); toRace(0, 0); until(() => m[0x52] === 1, 30000, BTN.A); until(() => m[0x41] === 4 && m[0x40], 6000); frames(30); },
  designmenu() { boot(); G.startMode('D'); frames(80); },
  design() { boot(); G.design.cur = { laps: 3, items: [{ col: 4, letter: 'A' }, { col: 12, letter: 'E' }, { col: 24, letter: 'M' }, { col: 30, letter: 'R' }], length: 120 };
    G.startMode('D'); frames(60); tap(BTN.D); tap(BTN.D); tap(BTN.START); frames(60); },
  designrace() { boot(); G.design.cur = { laps: 1, items: [{ col: 2, letter: 'C' }, { col: 14, letter: 'H' }, { col: 26, letter: 'K' }], length: 80 };
    G.loadDesignIntoRom(G.design.cur); G.startMode('D'); frames(60); tap(BTN.START); until(() => m[0x47] && m[0x40], 600); until(() => m[0x4F], 2000); frames(330, BTN.A); },
  kid() { boot('kid'); toRace(1, 0); until(() => m[0x4F], 2000); frames(400, drive); }
};

function shoot(name, file, scale) {
  scenarios[name]();
  G.render();
  writeRGBA(file || path.join(outDir, name + '.png'), G.img.data, G.SW, G.SH, scale || 2);
  console.log('wrote ' + name + '  (mode ' + m[0x41] + ', track ' + (m[0x43] + 1) + ', time ' + m[0x68] + ':' + m[0x69] + ':' + m[0x6A] + ')');
}
const scen = process.argv[2] || 'title';
if (scen === 'sheet') {                         // every rider picture (D892/D8A9) on one strip
  boot(); toRace(0, 0);
  const pics = [...Array(0x17).keys()];
  m.fill(0xF8, 0x200, 0x300);
  pics.forEach((y, i) => {
    m[0x00] = 8 + (i % 8) * 30; m[0x01] = 16 + Math.floor(i / 8) * 34; m[0x02] = G.R(0xD892 + y); m[0x03] = y === 0x16 ? 0x23 : 0x33;
    m[0x04] = (4 + i * 0x24) & 0xFF; m[0x0B] = 0;
  });
  console.log('(sheet: see the race / crash / run scenarios for the rider frames in use)');
} else if (scen === 'all') {
  for (const k of Object.keys(scenarios)) shoot(k);
} else shoot(scen, process.argv[3], +(process.argv[4] || 2));
