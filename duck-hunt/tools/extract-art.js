/* Builds the embedded art block for index.html from the genuine rips in
   reference/sheets/ and writes it to reference/art.gen.js.  build-art.js
   (or `node tools/extract-art.js --inject`) splices it into index.html
   between the ART-BEGIN / ART-END markers.

   Sources (see README.md "Where the art came from"):
     wikipedia-gameplay.png  256x224 NES screenshot of Game A (en.wikipedia
                             "Duck hunt pic.PNG"): the whole backdrop, the
                             HUD frames, bullet / duck icon / quota tiles.
     kenwheeler-sprites.png  1x rip (same sheet as the spriters-resource rip
                             mirrored by PakkuDon at 2x): the ducks in three
                             colours and all the dog frames.
     etiene-sprites.png      Tyler Alverson's 1x rip: title logo, the font
                             (TOP SCORE / copyright / game-select text).

   Sprite placement: every frame is positioned relative to the entity
   (x, y) exactly where the NES metasprite puts its tiles.  asm-meta.js
   parses the metasprite tables in the disassembly; fit() slides each ripped
   frame over that tile mask until every opaque pixel lands inside an
   occupied tile and every occupied tile holds at least one pixel. */
const fs = require('fs');
const path = require('path');
const { decodePNG } = require('./png.js');
const { imageCells } = require('./asm-meta.js');

const REF = path.join(__dirname, '..', 'reference');
const SHEETS = path.join(REF, 'sheets');

/* ---- palette: FCEUX default NES palette entries used by the game ---- */
const NES = {
  0x0F: [0, 0, 0], 0x30: [252, 252, 252], 0x21: [60, 188, 252], 0x29: [128, 208, 16],
  0x0A: [0, 80, 0], 0x07: [124, 8, 0], 0x18: [136, 112, 0], 0x16: [216, 40, 0],
  0x26: [252, 116, 96], 0x17: [200, 76, 12], 0x02: [0, 0, 168], 0x14: [188, 0, 188],
  0x05: [168, 0, 16], 0x36: [252, 188, 176], 0x2C: [0, 232, 216], 0x27: [252, 152, 56],
  0x2A: [76, 220, 72]
};
const PAL = [];             // [r,g,b]
const PAL_KEY = {};
function palIndex(rgb) {
  const k = rgb.join(',');
  if (!(k in PAL_KEY)) { PAL_KEY[k] = PAL.length; PAL.push(rgb.slice()); }
  return PAL_KEY[k];
}
// fixed order for the first entries so the game can refer to them by name
for (const c of [0x0F, 0x30, 0x21, 0x29, 0x0A, 0x07, 0x18, 0x16, 0x26, 0x17, 0x02, 0x14, 0x05, 0x36, 0x2C, 0x27, 0x2A]) palIndex(NES[c]);
const SKY = palIndex(NES[0x21]);

const CH = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
/* pixel array (-1 = transparent) -> RLE string: run lengths >1 are written as
   a decimal prefix, '.' is transparent, letters index PAL. */
function rle(px) {
  let s = '', i = 0;
  while (i < px.length) {
    let j = i; while (j < px.length && px[j] === px[i]) j++;
    const n = j - i, c = px[i] < 0 ? '.' : CH[px[i]];
    s += (n > 1 ? n : '') + c; i = j;
  }
  return s;
}

/* ---- background from the screenshot ---- */
function buildBackground() {
  const p = decodePNG(path.join(SHEETS, 'wikipedia-gameplay.png'));
  const W = 256, H = 240, px = new Array(W * H);
  const at = (x, sy) => palIndex(p.pixel(x, Math.max(0, Math.min(223, sy))));
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let sy = y - 8;                          // the screenshot shows NES lines 8..231
    if (y < 8) sy = 0;                       // sky
    if (y >= 232) sy = 223 - ((y - 232) % 6); // plain dirt
    px[y * W + x] = at(x, sy);
  }
  // remove the shot duck (screenshot x 84..125, y 68..102) -> sky
  for (let y = 68 + 8; y <= 102 + 8; y++) for (let x = 84; x <= 125; x++) px[y * W + x] = SKY;
  // grab dynamic HUD tiles before blanking them
  const tile = (x0, y0, w, h) => { const t = []; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) t.push(px[(y0 + y) * W + x0 + x]); return { w, h, d: t }; };
  const hud = {
    bullet: tile(24, 208, 8, 8),
    duckHit: tile(96, 208, 8, 8),
    duckLive: tile(112, 208, 8, 8),
    quota: tile(96, 216, 8, 8),
    shotWord: tile(24, 216, 24, 8)
  };
  const BLACK = palIndex(NES[0x0F]);
  const blank = (x0, y0, w, h) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) px[y * W + x] = BLACK; };
  blank(40, 192, 8, 8);      // round digit
  blank(24, 208, 24, 8);     // bullets
  blank(96, 208, 80, 8);     // hit icons
  blank(96, 216, 80, 8);     // quota bar
  blank(192, 208, 48, 8);    // score digits
  // sky pixels are transparent in the BG layer: ducks fly behind the scenery
  return { bg: px.map(v => (v === SKY ? -1 : v)), hud };
}

/* ---- font from the etiene title rip ---- */
function buildFont() {
  const p = decodePNG(path.join(SHEETS, 'etiene-sprites.png'));
  const glyphs = {};
  function line(x0, y0, text) {
    for (let i = 0; i < text.length; i++) {
      const c = text[i]; if (c === ' ') continue;
      const rows = [];
      for (let y = 0; y < 8; y++) {
        let b = 0;
        for (let x = 0; x < 8; x++) if (p.pixel(x0 + i * 8 + x, y0 + y).join() !== '0,0,0') b |= 0x80 >> x;
        rows.push(b);
      }
      if (glyphs[c] && glyphs[c].join() !== rows.join()) { console.log('glyph mismatch for ' + c, glyphs[c].map(b => b.toString(2).padStart(8, '0')).join(' '), '|', rows.map(b => b.toString(2).padStart(8, '0')).join(' ')); continue; }
      glyphs[c] = rows;
    }
  }
  line(10, 129, 'TOP SCORE =');
  line(105, 129, '0123456789');          // the digits sit 1 px left of the letters' grid on this sheet
  line(63, 165, '©1984 NINTENDO CO`LTD.');   // '`' is the single '.,' tile
  line(42, 202, 'GAME A   1 DUCK');
  line(42, 218, 'GAME B   2 DUCKS');
  line(42, 234, 'GAME C   CLAY SHOOTING');
  line(26, 202, '>');                       // the select cursor (a filled triangle)
  // the score digits in the real NES screenshot are the ground truth for 0 3 5 9
  const w = decodePNG(path.join(SHEETS, 'wikipedia-gameplay.png'));
  '039500'.split('').forEach((c, i) => {
    const rows = [];
    for (let y = 0; y < 8; y++) { let b = 0; for (let x = 0; x < 8; x++) if (w.pixel(192 + i * 8 + x, 200 + y).join() === '252,252,252') b |= 0x80 >> x; rows.push(b); }
    glyphs[c] = rows;
  });
  return glyphs;
}

function buildLogo() {
  const p = decodePNG(path.join(SHEETS, 'etiene-sprites.png'));
  const x0 = 15, y0 = 15, w = 192, h = 96, px = [];
  const LOGO = palIndex(NES[0x2C]), LINE = palIndex(NES[0x27]);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const k = p.pixel(x0 + x, y0 + y).join();
    px.push(k === '0,0,0' ? -1 : (k === '255,255,255' ? LINE : LOGO));
  }
  return { w, h, d: rle(px) };
}

/* ---- sprites ---- */
function crop(p, x0, y0, w, h, transparent) {
  const d = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const k = p.pixel(x0 + x, y0 + y);
    d.push(transparent.includes(k.join()) ? -1 : palIndex(k));
  }
  return { w, h, d };
}

/* slide frame over the metasprite tile mask */
function fit(frame, cells) {
  const occ = new Set(cells.map(c => c.x + ',' + c.y));
  const xs = cells.map(c => c.x), ys = cells.map(c => c.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs) + 8, minY = Math.min(...ys), maxY = Math.max(...ys) + 8;
  let best = null;
  for (let oy = minY - 8; oy <= Math.max(minY, maxY - frame.h) + 8; oy++) for (let ox = minX - 8; ox <= Math.max(minX, maxX - frame.w) + 8; ox++) {
    let outside = 0; const hit = new Set();
    for (let y = 0; y < frame.h; y++) for (let x = 0; x < frame.w; x++) {
      if (frame.d[y * frame.w + x] < 0) continue;
      const px = ox + x, py = oy + y;
      const k = (Math.floor((px - minX) / 8) * 8 + minX) + ',' + (Math.floor((py - minY) / 8) * 8 + minY);
      // cells are not necessarily on a common grid; test membership directly
      let inside = false;
      for (const c of cells) if (px >= c.x && px < c.x + 8 && py >= c.y && py < c.y + 8) { inside = true; hit.add(c.x + ',' + c.y); break; }
      if (!inside) outside++;
      void k; void occ;
    }
    const score = outside * 1000 + (cells.length - hit.size);
    if (!best || score < best.score) best = { score, ox, oy, outside, empty: cells.length - hit.size };
  }
  return best;
}

function buildSprites(report) {
  const p = decodePNG(path.join(SHEETS, 'kenwheeler-sprites.png'));
  const T = ['0,136,255', '60,188,252'];
  const cells = imageCells();
  // frame boxes on the sheet (from a connected-component scan, checked by eye)
  // black duck column; blue is at -130, red at +130
  const duckBoxes = {          // NES image index -> rip frame (the sheet lists each set in reverse)
    8: [130, 119, 34, 28], 7: [170, 119, 34, 28], 6: [211, 119, 32, 28],   // side view (horizontal flight)
    2: [134, 157, 25, 31], 1: [171, 157, 32, 31], 0: [213, 157, 27, 31],   // angled (diagonal flight)
    5: [135, 197, 24, 31], 4: [171, 197, 32, 31], 3: [212, 197, 30, 31],   // back view (straight up)
    9: [131, 237, 31, 30], 11: [178, 237, 18, 30]                          // shot, falling
  };
  const colours = { blue: -130, black: 0, red: 130 };
  const ducks = {};
  for (const [col, dx] of Object.entries(colours)) {
    ducks[col] = [];
    for (const [idx, b] of Object.entries(duckBoxes)) {
      // grow the box to the union of opaque pixels around it
      const f = crop(p, b[0] + dx, b[1], b[2], b[3], T);
      const r = fit(f, cells[idx].cells);
      if (col === 'black') report.push(`duck img ${idx}: ${f.w}x${f.h} at (${r.ox},${r.oy}) outside=${r.outside} emptyTiles=${r.empty}`);
      ducks[col][idx] = { x: r.ox, y: r.oy, w: f.w, h: f.h, d: rle(f.d) };
    }
    // image 10 is image 11 mirrored (E718 alternates them)
    const b11 = duckBoxes[11];
    const f11 = crop(p, b11[0] + dx, b11[1], b11[2], b11[3], T);
    const m = []; for (let y = 0; y < f11.h; y++) for (let x = 0; x < f11.w; x++) m.push(f11.d[y * f11.w + (f11.w - 1 - x)]);
    const fm = { w: f11.w, h: f11.h, d: m };
    const r = fit(fm, cells[10].cells);
    if (col === 'black') report.push(`duck img 10 (mirror of 11): at (${r.ox},${r.oy}) outside=${r.outside} emptyTiles=${r.empty}`);
    ducks[col][10] = { x: r.ox, y: r.oy, w: fm.w, h: fm.h, d: rle(fm.d) };
  }
  const dogBoxes = {
    12: [5, 1, 53, 43], 13: [66, 1, 51, 43], 15: [126, 1, 52, 43], 14: [184, 1, 55, 43], 16: [245, 1, 53, 43],
    20: [332, 1, 43, 42],
    17: [5, 59, 53, 48], 18: [74, 59, 35, 48], 19: [135, 67, 33, 32],
    22: [197, 63, 29, 39], 23: [257, 63, 29, 39], 21: [319, 63, 56, 39]
  };
  const dog = {};
  for (const [idx, b] of Object.entries(dogBoxes)) {
    const f = crop(p, b[0], b[1], b[2], b[3], T);
    const r = fit(f, cells[idx].cells);
    report.push(`dog img ${idx}: ${f.w}x${f.h} at (${r.ox},${r.oy}) outside=${r.outside} emptyTiles=${r.empty}`);
    dog[idx] = { x: r.ox, y: r.oy, w: f.w, h: f.h, d: rle(f.d) };
  }
  return { ducks, dog };
}

function main() {
  const report = [];
  const { bg, hud } = buildBackground();
  const font = buildFont();
  const logo = buildLogo();
  const { ducks, dog } = buildSprites(report);
  const tileOut = t => ({ w: t.w, h: t.h, d: rle(t.d) });
  const art = {
    pal: PAL.map(c => (c[0] << 16) | (c[1] << 8) | c[2]),
    bg: rle(bg),
    hud: Object.fromEntries(Object.entries(hud).map(([k, v]) => [k, tileOut(v)])),
    font: Object.fromEntries(Object.entries(font).map(([k, v]) => [k, v.map(b => b.toString(16).padStart(2, '0')).join('')])),
    logo, ducks, dog
  };
  const js = 'const ART = ' + JSON.stringify(art) + ';';
  fs.writeFileSync(path.join(REF, 'art.gen.js'), js);
  console.log(report.join('\n'));
  console.log('palette', PAL.length, 'colours; art block', js.length, 'chars');
  if (process.argv.includes('--inject')) {
    const file = path.join(__dirname, '..', 'index.html');
    const html = fs.readFileSync(file, 'utf8');
    const a = html.indexOf('/*ART-BEGIN*/'), b = html.indexOf('/*ART-END*/');
    if (a < 0 || b < 0) throw new Error('ART markers not found in index.html');
    fs.writeFileSync(file, html.slice(0, a + 13) + '\n' + js + '\n' + html.slice(b));
    console.log('injected into index.html');
  }
}

main();
