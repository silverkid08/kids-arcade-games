/* Cuts every sprite the game uses out of the reference images and writes
   them as palette-indexed, run-length-encoded strings.

     node tools/extract-art.js      -> reference/art.gen.js (+ tools/out/art-check.png)
     node tools/inject.js           -> splices ART into index.html

   Sources (all genuine Mario Paint graphics, see README "Art"):
     reference/flicewater/   sprite rips shipped with Knucklesfan's open-source
                             "flicewater" Gnat Attack recreation (GitHub)
     reference/mariowiki/    Super Mario Wiki sprite rips + native 224x192 / 256x224
                             emulator screenshots + Nintendo Music artwork
                             (official Nintendo screenshots, 2296x1722)
   Screenshot crops remove the background by flood-filling from the crop
   edge through pixels that match the known background tile, so sprite
   pixels that happen to share a background colour inside the sprite stay.
   The Nintendo Music images are upscaled, filtered captures; those crops are
   resampled at the fitted pixel centres (10.27 x 9.0 px per SNES pixel) and
   snapped to the nearest colour of a small palette; README lists them as
   "resampled" art.                                                        */
const fs = require('fs');
const path = require('path');
const { decodePNG, encodePNG } = require('./png.js');

const REF = path.join(__dirname, '..', 'reference');
const img = f => decodePNG(path.join(REF, f));
const q5 = v => v & 0xF8;                         // SNES colours are 5 bits per channel

/* ---------------- palette ---------------- */
const PAL = [];                                   // 0xRRGGBB
const palIdx = new Map();
function pal(rgb) {
  const c = (q5(rgb[0]) << 16) | (q5(rgb[1]) << 8) | q5(rgb[2]);
  if (!palIdx.has(c)) { palIdx.set(c, PAL.length); PAL.push(c); }
  return palIdx.get(c);
}

/* sprite = {w,h,x,y,px:Int16Array(-1 = transparent)}; x,y = top-left relative to the anchor */
function fromImage(im, sx, sy, w, h, ax, ay, opaque) {
  const px = new Int16Array(w * h).fill(-1);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const X = sx + x, Y = sy + y;
    if (X < 0 || Y < 0 || X >= im.w || Y >= im.h) continue;
    if (opaque ? !opaque(X, Y) : im.alpha(X, Y) < 128) continue;
    px[y * w + x] = pal(im.pixel(X, Y));
  }
  return trim({ w, h, x: -ax, y: -ay, px });
}
function trim(s) {
  let x0 = s.w, y0 = s.h, x1 = -1, y1 = -1;
  for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) if (s.px[y * s.w + x] >= 0) {
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  if (x1 < 0) throw new Error('empty sprite');
  const w = x1 - x0 + 1, h = y1 - y0 + 1, px = new Int16Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) px[y * w + x] = s.px[(y + y0) * s.w + x + x0];
  return { w, h, x: s.x + x0, y: s.y + y0, px };
}
function mirrorLeft(s, axis2) {                   // axis2 = 2*axis in sprite-local coords; rebuilds the right half from the left
  const w = axis2, px = new Int16Array(w * s.h).fill(-1);
  for (let y = 0; y < s.h; y++) for (let x = 0; x < w; x++) {
    const src = 2 * x < axis2 ? x : axis2 - 1 - x;
    if (src >= 0 && src < s.w) px[y * w + x] = s.px[y * s.w + src];
  }
  return { w, h: s.h, x: -axis2 / 2, y: s.y, px };
}

/* background-aware crop from a screenshot: flood fill from the crop border through
   pixels equal to bgAt(x,y); everything not reached is sprite */
function cropScreenshot(im, sx, sy, w, h, ax, ay, bgAt, keep, tol) {
  const out = new Uint8Array(w * h);           // 1 = background
  const stack = [];
  const isBg = (x, y) => {
    const p = im.pixel(sx + x, sy + y), bs = bgAt(sx + x, sy + y);
    const list = Array.isArray(bs[0]) ? bs : [bs];
    return list.some(b => Math.abs(p[0] - b[0]) + Math.abs(p[1] - b[1]) + Math.abs(p[2] - b[2]) < (tol || 24));
  };
  for (let x = 0; x < w; x++) { stack.push([x, 0], [x, h - 1]); }
  for (let y = 0; y < h; y++) { stack.push([0, y], [w - 1, y]); }
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= w || y >= h || out[y * w + x] || !isBg(x, y)) continue;
    out[y * w + x] = 1;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return fromImage(im, sx, sy, w, h, ax, ay, (X, Y) => !out[(Y - sy) * w + (X - sx)] && (!keep || keep(X, Y)));
}

function tileColours(t) { const m = new Map(); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) m.set(t.pixel(x, y).join(), t.pixel(x, y)); return [...m.values()]; }
/* Nintendo Music artwork -> native pixels */
function nmImage(f) {
  const im = img(f);
  const W = 224, H = 192, buf = new Uint8Array(W * H * 3);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const X = Math.max(0, Math.min(im.w - 1, Math.round((x + 0.5) * 10.27 - 3.6)));
    const Y = Math.max(0, Math.min(im.h - 1, Math.round((y + 0.5) * 9.0 - 3.5)));
    const p = im.pixel(X, Y); buf.set(p, (y * W + x) * 3);
  }
  return { w: W, h: H, pixel: (x, y) => Array.from(buf.slice((y * W + x) * 3, (y * W + x) * 3 + 3)), alpha: () => 255 };
}
/* snap a resampled crop to a fixed set of colours */
function snap(s, colours) {
  const cols = colours.map(c => [c >> 16 & 255, c >> 8 & 255, c & 255]);
  const px = Int16Array.from(s.px, v => {
    if (v < 0) return v;
    const c = PAL[v], r = c >> 16 & 255, g = c >> 8 & 255, b = c & 255;
    let best = 0, bd = 1e9;
    cols.forEach((k, i) => { const d = (k[0] - r) ** 2 + (k[1] - g) ** 2 + (k[2] - b) ** 2; if (d < bd) { bd = d; best = i; } });
    return pal(cols[best]);
  });
  // drop isolated pixels (resampling noise)
  const op = (x, y) => x >= 0 && y >= 0 && x < s.w && y < s.h && px[y * s.w + x] >= 0;
  const clean = Int16Array.from(px, (v, i) => {
    if (v < 0) return v;
    const x = i % s.w, y = Math.floor(i / s.w);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && op(x + dx, y + dy)) return v;
    return -1;
  });
  return { ...s, px: clean };
}

/* ---------------- the sprites ---------------- */
const S = {};
const fw = n => img('flicewater/' + n + '.png');
const mw = n => img('mariowiki/' + n + '.png');

// swatter glove: 8 cells of 32x64.  anchor = centre of the swatter mesh (16,20)
{ const im = fw('cursor'); S.glove = []; for (let i = 0; i < 8; i++) S.glove.push(fromImage(im, i * 32, 0, 32, 64, 16, 20)); }
{ const im = fw('fly'); S.fly = [0, 1].map(i => fromImage(im, i * 15, 0, 15, 8, 7, 4)); }
{ const im = fw('shitter'); S.parent = [0, 1, 2, 3, 4].map(i => fromImage(im, i * 24, 0, 24, 16, 12, 8)); }
{ const im = fw('shitflies'); S.child = [0, 1, 2].map(i => fromImage(im, i * 7, 0, 7, 5, 3, 2)); }
S.bigfly = [fromImage(mw('Bigfly'), 0, 0, 16, 15, 8, 7)];
S.bomb = [fromImage(mw('BombFlyGnat'), 0, 0, 16, 16, 8, 9)];
S.boss = [fromImage(mw('Watinga_sprite'), 0, 0, 64, 69, 32, 34)];
{ const im = fw('digits'); S.digit = []; for (let i = 0; i < 10; i++) S.digit.push(fromImage(im, i * 16, 0, 16, 16, 0, 0));
  S.handIcon = fromImage(im, 160, 0, 16, 16, 0, 0); }
{ const im = fw('extralife'); S.lifeup = [0, 1].map(i => fromImage(im, i * 16, 0, 16, 16, 8, 8)); }
S.txtGameOver = fromImage(fw('gameover'), 0, 0, 72, 16, 0, 0);
S.txtLevel = fromImage(fw('level'), 0, 0, 40, 16, 0, 0);
{ const im = fw('mario'); S.mario = [0, 1, 2, 3].map(i => fromImage(im, i * 16, 0, 16, 24, 8, 23)); }
S.tile = ['level1bg', 'level2bg', 'level3bg'].map(n => fromImage(fw(n), 0, 0, 16, 16, 0, 0));
{ const im = mw('Gnat_Attack_Icons'); S.icon = [];
  for (let i = 0; i < 15; i++) S.icon.push(fromImage(im, (i % 5) * 16, Math.floor(i / 5) * 16, 16, 16, 0, 0, (X, Y) => im.pixel(X, Y)[0] < 128)); }

// native boss screenshot (224x192 playfield, level 1 tiles): hurt frame, hit star, orb
{
  const im = mw('Watinga');
  const t = fw('level1bg');
  const bg = (x, y) => t.pixel(x & 15, (y - 1) & 15);    // 224x192 captures start one line above the tile grid
  const notStar = (X, Y) => !(X >= 149);                       // the right half is rebuilt by mirroring
  let hurt = cropScreenshot(im, 108, 14, 82, 78, 0, 0, bg, notStar);
  // the sprite is left/right symmetric about x = 148.5 (checked against the normal frame)
  hurt = mirrorLeft(hurt, 2 * (148.5 - (108 + hurt.x)) + 1);
  // align with the normal frame: chest stripes (first row containing magenta) line up
  const firstRow = (s, c) => { for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) if (PAL[s.px[y * s.w + x]] === c) return y; return -1; };
  const MAG = 0xF828F8;
  const dyN = firstRow(S.boss[0], MAG) + S.boss[0].y, dyH = firstRow(hurt, MAG) + hurt.y;
  hurt.y += dyN - dyH;
  S.boss.push(hurt);
  // hit star: right of x=149 the star sits over the boss; keep star colours only (red, magenta, the star yellow)
  const STARC = new Set(['248,0,0', '248,40,248', '248,248,0']);
  const star = cropScreenshot(im, 150, 8, 30, 26, 0, 0, bg, (X, Y) => STARC.has(im.pixel(X, Y).join(',')) && !(Y > 26 && X < 160));
  // the burst is 8-pointed and symmetric about its centre column; rebuild the part hidden by the eye
  S.star = trim(star);
  S.orb = cropScreenshot(im, 140, 90, 18, 12, 0, 0, bg);
}

// pause panel + menu pointer from the native 256x224 pause screenshot
{
  const im = mw('MP_Gnat_Attack_Pause');
  const t = fw('level1bg');
  const bg = (x, y) => { const c = t.pixel((x - 16) & 15, (y - 16) & 15); return c[0] > 220 ? [255, 255, 255] : [197, 198, 197]; };
  S.pausePanel = cropScreenshot(im, 78, 45, 106, 116, 0, 0, bg);
  S.pointer = cropScreenshot(im, 178, 152, 32, 30, 0, 0, bg);
}

// resampled from Nintendo Music artwork (approximate)
{
  const clear = nmImage('mariowiki/NM_MPaint_Gnat_Attack_Stage_Clear.png');
  const t2 = fw('level2bg');
  const T2 = tileColours(t2); const bg2 = () => T2;
  // CONGRATULATIONS! : 16 letters of 8x16 at (48,56); outline font = black + white
  const congr = cropScreenshot(clear, 46, 54, 132, 20, 0, 0, bg2, null, 60);
  S.txtCongrats = snap(congr, [0x000000, 0xF8F8F8]);
  { // outline font: white only inside a black outline
    const T = S.txtCongrats, isK = (x, y) => x >= 0 && y >= 0 && x < T.w && y < T.h && PAL[T.px[y * T.w + x]] === 0;
    T.px = Int16Array.from(T.px, (v, i) => { if (v < 0 || PAL[v] === 0) return v; const x = i % T.w, y = Math.floor(i / T.w);
      return (isK(x - 1, y) || isK(x + 1, y)) && (isK(x, y - 1) || isK(x, y + 1) || isK(x - 1, y - 1) || isK(x + 1, y + 1)) ? v : -1; });
    S.txtCongrats = trim(T); }
  const koopa = cropScreenshot(clear, 128, 104, 24, 32, 0, 0, bg2, null, 75);
  S.koopa = snap(koopa, [0x000000, 0xF8F8F8, 0xF87800, 0xC04000, 0xF8B800, 0x803000]);
  S.koopa = { ...S.koopa, x: -8, y: -27 };
  const over = nmImage('mariowiki/NM_MPaint_Gnat_Attack_Game_Over.png');
  const t3 = fw('level3bg');
  const T3 = tileColours(t3); const bg3 = () => T3;
  const near = (p, c, d) => Math.abs(p[0] - c[0]) + Math.abs(p[1] - c[1]) + Math.abs(p[2] - c[2]) < d;
  const laugh = cropScreenshot(over, 2, 12, 76, 72, 0, 0, bg3, (X, Y) => { const p = over.pixel(X, Y); return !near(p, [112, 64, 128], 70) && !near(p, [248, 176, 248], 60); }, 75);
  let L0 = snap(laugh, [0x000000, 0xF8F8E8, 0xE8B8A8, 0xC88878, 0xA06858, 0x704838, 0xF8F800, 0xD0A000, 0xF828F8, 0xA870D0]);
  // grid-line remnants snap to the lavender of the chest stripes: keep lavender only next to the magenta stripes
  let L = { ...L0, px: Int16Array.from(L0.px, (v, i) => {
    if (v < 0 || PAL[v] !== 0xA870D0) return v;
    const x = i % L0.w, y = Math.floor(i / L0.w);
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < L0.w && Y < L0.h && PAL[L0.px[Y * L0.w + X]] === 0xF828F8) return v; }
    return -1;
  }) };
  // symmetric sprite: centre column of the magenta chest stripes, then rebuild the right half from the left
  { let sx = 0, n = 0; for (let y = 0; y < L.h; y++) for (let x = 0; x < L.w; x++) if (PAL[L.px[y * L.w + x]] === 0xF828F8) { sx += x; n++; }
    const axis2 = Math.round(2 * (sx / n) + 1);
    L = trim(mirrorLeft(L, axis2)); }
  const l3 = nmImage('mariowiki/NM_MPaint_Gnat_Attack_Level_3.png');
  const armed = cropScreenshot(l3, 112, 116, 24, 26, 0, 0, bg3, null, 75);
  S.bombArmed = snap(armed, [0x000000, 0xF8F8F8, 0xF8F800, 0xF80000, 0xC8C8C0]);
  S.bombArmed = { ...trim(S.bombArmed), x: -8, y: -9 };
  S.bossLaugh = { ...L, x: -Math.floor(L.w / 2), y: -34 };
}

/* ---------------- encode ---------------- */
const CH = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&()*+,-/:;<=>?@[]^_{|}~';
function enc(s) {
  let out = '', i = 0;
  while (i < s.px.length) {
    const v = s.px[i]; let n = 1; while (i + n < s.px.length && s.px[i + n] === v) n++;
    const c = v < 0 ? '.' : CH[v];
    out += (n > 1 ? n : '') + c; i += n;
  }
  return [s.w, s.h, s.x, s.y, out];
}
// compact the palette to the colours actually used (resampled crops registered raw colours before snapping)
{
  const used = new Map(), NEW = [];
  const all = []; for (const v of Object.values(S)) (Array.isArray(v) ? v : [v]).forEach(sp => all.push(sp));
  for (const sp of all) for (const v of sp.px) if (v >= 0 && !used.has(v)) { used.set(v, NEW.length); NEW.push(PAL[v]); }
  for (const sp of all) sp.px = Int16Array.from(sp.px, v => (v < 0 ? v : used.get(v)));
  PAL.length = 0; NEW.forEach(c => PAL.push(c));
}
if (PAL.length > CH.length) throw new Error('palette too big: ' + PAL.length);
const ART = { pal: PAL };
for (const [k, v] of Object.entries(S)) ART[k] = Array.isArray(v) ? v.map(enc) : enc(v);
fs.writeFileSync(path.join(REF, 'art.gen.js'), 'const ART = ' + JSON.stringify(ART) + ';');

/* ---------------- contact sheet for checking ---------------- */
{
  const list = [];
  for (const [k, v] of Object.entries(S)) (Array.isArray(v) ? v : [v]).forEach((s, i) => list.push([k + i, s]));
  const cols = 8, cw = 84, chh = 92;
  const W = cols * cw, H = Math.ceil(list.length / cols) * chh, sc = 2;
  const rgb = Buffer.alloc(W * H * 3 * sc * sc);
  const put = (x, y, c) => { for (let a = 0; a < sc; a++) for (let b = 0; b < sc; b++) { const i = ((y * sc + b) * W * sc + x * sc + a) * 3; rgb[i] = c >> 16 & 255; rgb[i + 1] = c >> 8 & 255; rgb[i + 2] = c & 255; } };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) put(x, y, ((x >> 2) + (y >> 2)) & 1 ? 0x9090B0 : 0xA0A0C0);
  list.forEach(([, s], n) => {
    const ox = (n % cols) * cw + 42, oy = Math.floor(n / cols) * chh + 46;
    for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) { const v = s.px[y * s.w + x]; if (v >= 0) { const X = ox + s.x + x, Y = oy + s.y + y; if (X >= 0 && Y >= 0 && X < W && Y < H) put(X, Y, PAL[v]); } }
    if (ox < W && oy < H) put(ox, oy, 0xFF0000);
  });
  const od = path.join(__dirname, 'out'); if (!fs.existsSync(od)) fs.mkdirSync(od);
  encodePNG(path.join(od, 'art-check.png'), W * sc, H * sc, rgb);
  console.log(list.map(([k, s]) => k + ':' + s.w + 'x' + s.h).join(' '));
}
console.log('palette', PAL.length, 'bytes', fs.statSync(path.join(REF, 'art.gen.js')).size);
