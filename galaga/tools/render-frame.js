/* Renders real frames of the game to PNG files under tools/out/ using the
   harness's software canvas, so the art can be checked without a browser:

     node tools/render-frame.js            # writes tools/out/*.png

   Scenes: entry (wave 1 looping in), formation (all 40 in, a boss diving
   with escorts), beam (tractor beam on the fighter), challenge (stage 3),
   dual (dual fighter firing). Each is a 3x upscale. */
global.__HARNESS_PIXELS = true;
global.__GALAGA_TEST = true;
require('./harness.js');
const fs = require('fs');
const path = require('path');
const { encodePNG } = require('./png.js');

const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const src = HTML.slice(HTML.indexOf('<script>') + 8, HTML.lastIndexOf('</script>'));
fs.writeFileSync(path.join(__dirname, '.game.build.js'), src);
require(path.join(__dirname, '.game.build.js'));
const G = globalThis.__GALAGA;

const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

function save(name, scale) {
  scale = scale || 3;
  const c = G.canvas, W = c.width, H = c.height, buf = c._buf;
  const rgb = Buffer.alloc(W * scale * H * scale * 3);
  for (let y = 0; y < H * scale; y++) for (let x = 0; x < W * scale; x++) {
    const si = ((Math.floor(y / scale)) * W + Math.floor(x / scale)) * 4, di = (y * W * scale + x) * 3;
    rgb[di] = buf[si]; rgb[di + 1] = buf[si + 1]; rgb[di + 2] = buf[si + 2];
  }
  const file = path.join(outDir, name + '.png');
  encodePNG(file, W * scale, H * scale, rgb);
  console.log('wrote ' + file);
}
function run(n) { for (let i = 0; i < n; i++) { G.update(); } G.render(); }

G.applyPreset('original');
G.settings.invuln = true;           // keep the fighter alive while we take pictures
G.startPlaying();
run(340 + 260);                     // intro + stage flag + wave 1 in flight
save('entry');
run(900);
save('formation');
/* force a boss dive with escorts and a bee dive for the picture */
const boss = G.game.enemies.find(e => e.type === 'boss' && e.state === 'formation');
if (boss) { G.game.attackTimer = 1; G.game.rp.beamChance = 0; G.settings.diveFreq = 100; }
run(2); G.game.attackTimer = 1; run(60);
G.fireShot(); run(6);
save('dive');
/* tractor beam */
const b2 = G.game.enemies.find(e => e.type === 'boss' && e.state === 'formation');
if (b2) { b2.state = 'beamRun'; b2.path = G.spline([{ x: b2.x, y: b2.y }, { x: b2.x, y: 100 }, { x: 112, y: 164 }]); b2.pi = 0; b2.speed = 3; }
run(120);
save('beam');
/* challenging stage */
G.game.stage = 3; G.game.enemies = []; G.beginStage(); run(60 + 130);
save('challenge');
/* dual fighter */
G.game.fighter.dual = true; G.fireShot(); run(8);
save('dual');
