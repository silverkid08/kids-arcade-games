/* Builds the embedded sprite block for index.html from the genuine art in
   reference/ (Mario Wiki arcade rips, the Spriters-Resource rips mirrored in
   the j-saro clone repo, and two real 224x256 arcade frames).

     node tools/build-sprites.js            # writes reference/sprites.js and
                                            # splices it into index.html
     node tools/build-sprites.js --montage  # also renders reference/montage.png

   Every sprite becomes {w, h, rows} where each row is a string with one
   palette letter per pixel ('.' = transparent).  Colours of each source are
   mapped onto one canonical arcade palette (PAL below). */
const fs = require('fs');
const path = require('path');
const { decodePNG, encodePNG } = require('./png.js');
const { decodeGIF } = require('./gif.js');

const REF = path.join(__dirname, '..', 'reference');
const MW = f => path.join(REF, 'mariowiki', f);
const JS = f => path.join(REF, 'jsaro', f);

/* Canonical palette (sampled from the real arcade frames in reference/). */
const PAL = {
  W: '#ffffff', R: '#ff0000', B: '#0000d8', S: '#ffb855', O: '#ff6800', D: '#b80000',
  P: '#ff44aa', M: '#f057e8', C: '#00ffff', L: '#0000ff', Y: '#ffb600', G: '#ec3194', g: '#8e0406'
};

/* source colour -> palette letter.  '.' = transparent. */
const BASE = {
  '0,0,0': '.', '40,40,40': '.', '0,128,0': '.',
  '255,255,255': 'W', '252,252,252': 'W', '254,252,255': 'W', '251,251,255': 'W',
  '255,0,0': 'R', '232,7,9': 'R', '232,7,10': 'R', '245,0,7': 'R', '255,16,16': 'R', '247,49,0': 'R', '255,49,0': 'R', '255,8,16': 'R', '255,99,0': 'R', '216,40,0': 'R',
  '0,0,170': 'B', '3,1,220': 'B', '4,2,220': 'B', '0,0,173': 'B',
  '255,184,85': 'S', '245,187,159': 'S', '245,188,160': 'S', '252,188,176': 'S', '255,189,82': 'S', '255,182,85': 'S', '255,181,115': 'S', '255,165,99': 'S',
  '255,104,0': 'O', '255,107,0': 'O', '238,117,17': 'O', '252,116,96': 'O', '255,101,0': 'O',
  '184,0,0': 'D', '182,0,0': 'D', '172,5,7': 'D', '189,0,0': 'D', '140,0,0': 'D',
  '255,68,170': 'P', '255,66,173': 'P', '255,85,180': 'P', '255,41,173': 'P', '255,49,181': 'P', '255,41,181': 'P',
  '240,87,232': 'M',
  '0,255,255': 'C', '20,243,255': 'C', '19,243,255': 'C', '32,253,255': 'C', '99,231,255': 'C', '173,255,255': 'C', '0,232,216': 'C', '49,222,255': 'C',
  '0,0,255': 'L', '3,3,255': 'L', '4,3,255': 'L', '32,56,236': 'L', '24,24,255': 'L',
  '255,182,0': 'Y', '244,186,21': 'Y', '255,194,0': 'Y', '247,172,9': 'Y', '251,186,9': 'Y', '250,185,1': 'Y', '255,255,0': 'Y',
  '236,49,148': 'G', '142,4,6': 'g'
};
const DK_SHEET = { '164,0,0': 'D', '0,0,168': 'B' };          // Kong's fur on the j-saro sheet
const BARREL_SHEET = { '164,0,0': 'O', '252,152,56': 'S', '0,0,168': 'L' };
const PAULINE_SHEET = { '255,41,173': 'M', '255,49,181': 'M', '255,41,181': 'M', '0,0,255': 'L' };

const cache = {};
function load(file) {
  if (cache[file]) return cache[file];
  let img;
  if (file.endsWith('.gif')) {
    const g = decodeGIF(file);
    img = g.frames.map(f => ({ w: g.w, h: g.h, pixel: f.pixel, alpha: f.alpha }));
  } else img = decodePNG(file);
  return (cache[file] = img);
}

/* crop(img, x, y, w, h, map, {ox, oy, bw, bh}) -> rows[] */
function crop(img, x, y, w, h, map, opt) {
  opt = opt || {};
  const bw = opt.bw || w, bh = opt.bh || h, ox = opt.ox || 0, oy = opt.oy || 0;
  const m = Object.assign({}, BASE, map || {});
  const rows = [];
  for (let yy = 0; yy < bh; yy++) {
    let row = '';
    for (let xx = 0; xx < bw; xx++) {
      const sx = x + xx - ox, sy = y + yy - oy;
      if (xx < ox || yy < oy || xx >= ox + w || yy >= oy + h || sx >= img.w || sy >= img.h) { row += '.'; continue; }
      if (img.alpha && img.alpha(sx, sy) === 0) { row += '.'; continue; }
      const k = img.pixel(sx, sy).join(',');
      if (!(k in m)) throw new Error('unmapped colour ' + k + ' at ' + sx + ',' + sy);
      row += m[k];
    }
    rows.push(row);
  }
  return rows;
}
function blank(rows, x, y, w, h) {
  return rows.map((r, i) => (i >= y && i < y + h) ? r.slice(0, x) + '.'.repeat(w) + r.slice(x + w) : r);
}
function recolour(rows, from, to) {
  return rows.map(r => r.split('').map(c => { const i = from.indexOf(c); return i >= 0 ? to[i] : c; }).join(''));
}
function mirror(rows) { return rows.map(r => r.split('').reverse().join('')); }
function rot90(rows) { /* clockwise */
  const h = rows.length, w = rows[0].length, out = [];
  for (let x = 0; x < w; x++) { let s = ''; for (let y = h - 1; y >= 0; y--) s += rows[y][x]; out.push(s); }
  return out;
}

const S = {};
function add(name, rows) { S[name] = rows; }

/* ---------------- Jumpman (all native frames face LEFT) ---------------- */
const run = load(MW('DK_Arcade_Mario_Run.gif'));
add('m_stand', crop(run[0], 0, 0, 16, 16));
add('m_walk1', crop(run[1], 0, 0, 16, 16));
add('m_walk2', crop(run[2], 0, 0, 16, 16));
add('m_jump', crop(load(MW('DK_Arcade_Mario_Jumping_Sprite.png')), 0, 0, 16, 15, null, { bh: 16, oy: 1 }));
add('m_climb', crop(load(MW('DK_Arcade_Mario_Climbing.png')), 0, 0, 13, 16, null, { bw: 16, ox: 1 }));
add('m_top', crop(load(MW('DK_Arcade_Mario_After_Climbing_Ladder.png')), 0, 0, 16, 15, null, { bh: 16, oy: 1 }));
add('m_dead', crop(load(MW('DK_Arcade_Mario_Dead.png')), 0, 0, 16, 16));
const ham = load(MW('DK_Arcade_Mario_Hammering_Sprite.gif'));
add('m_hammer0', crop(ham[0], 0, 0, 30, 26));   // hammer held in front (down)
add('m_hammer1', crop(ham[1], 0, 0, 30, 26));   // hammer raised
add('m_life', crop(load(MW('DK_Arcade_100m_Screenshot.png')), 24, 24, 8, 8));

/* ---------------- Donkey Kong ---------------- */
const dk = load(JS('donkey_kong_sprite_sheet.png'));
add('k_idle', crop(dk, 5, 21, 40, 32, DK_SHEET, { bw: 48, ox: 4 }));
add('k_beatL', crop(dk, 54, 21, 46, 32, DK_SHEET, { bw: 48, ox: 1 }));
add('k_beatR', crop(dk, 104, 21, 46, 32, DK_SHEET, { bw: 48, ox: 1 }));
add('k_grab', crop(dk, 156, 21, 43, 32, DK_SHEET, { bw: 48, ox: 1 }));
add('k_throw', crop(dk, 257, 21, 43, 32, DK_SHEET, { bw: 48, ox: 4 }));
add('k_fall', crop(dk, 5, 78, 40, 32, DK_SHEET, { bw: 48, ox: 4 }));
add('k_dead1', crop(dk, 55, 81, 46, 29, DK_SHEET, { bw: 48, bh: 32, ox: 1, oy: 3 }));
add('k_dead2', crop(dk, 102, 83, 47, 27, DK_SHEET, { bw: 48, bh: 32, ox: 1, oy: 5 }));
add('k_climb1', crop(dk, 159, 84, 43, 32, DK_SHEET, { bw: 48, ox: 2 }));
add('k_climb2', crop(dk, 207, 80, 38, 36, DK_SHEET, { bw: 48, bh: 36, ox: 5 }));
add('k_climbB0', crop(dk, 251, 82, 33, 36, DK_SHEET, { bw: 48, ox: 7 }));
add('k_climbB1', crop(dk, 284, 82, 33, 36, DK_SHEET, { bw: 48, ox: 7 }));
add('k_hold', crop(load(MW('DK_Arcade_Donkey_Kong_Holding_Barrel_Sprite.png')), 0, 0, 40, 32, null, { bw: 48, ox: 4 }));
add('k_holdBlue', crop(load(MW('DK_Arcade_Donkey_Kong_Holding_Blue_Barrel.png')), 0, 0, 40, 32, null, { bw: 48, ox: 4 }));
add('k_head', crop(load(MW('DK_Arcade_How_High_Can_You_Get.png')), 0, 0, 46, 32));

/* ---------------- Pauline ---------------- */
const peach = load(JS('peach_sprite_sheet.png'));
add('p_0', crop(peach, 0, 1, 15, 22, PAULINE_SHEET, { bw: 16 }));
add('p_1', crop(peach, 39, 1, 15, 22, PAULINE_SHEET, { bw: 16 }));
add('help', crop(load(MW('Donkey_Kong_Arcade_25m_Screenshot.png')), 104, 32, 24, 8));

/* ---------------- barrels, oil, fire ---------------- */
const en = load(JS('enemy_sprite_sheet.png'));
for (let i = 0; i < 4; i++) add('b_roll' + i, crop(en, i * 12, 20, 12, 10, BARREL_SHEET));
add('b_side0', crop(en, 50, 20, 16, 10, BARREL_SHEET));
add('b_side1', crop(en, 66, 20, 16, 10, BARREL_SHEET));
add('bb_roll0', crop(load(MW('DK_Arcade_Blue_Barrel.png')), 0, 0, 12, 10));
for (let i = 1; i < 4; i++) add('bb_roll' + i, recolour(S['b_roll' + i], 'OSL', 'LCW'));
add('bb_side0', recolour(S.b_side0, 'OSL', 'LCW'));
add('bb_side1', recolour(S.b_side1, 'OSL', 'LCW'));
add('b_stack', crop(load(MW('Donkey_Kong_Arcade_25m_Screenshot.png')), 0, 51, 20, 32));
add('oil', crop(load(MW('DK_Arcade_Oil_Drum.png')), 0, 0, 16, 16));
const st = load(JS('static_entities_sprite_sheet.png'));
add('flame0', crop(st, 21, 1, 16, 15, null, { bh: 16, oy: 1 }));
add('flame1', crop(st, 37, 1, 16, 15, null, { bh: 16, oy: 1 }));
add('flame2', crop(st, 54, 1, 16, 15, null, { bh: 16, oy: 1 }));
add('flame3', crop(st, 70, 1, 16, 15, null, { bh: 16, oy: 1 }));
add('f_0', crop(en, 0, 1, 13, 15, null, { bw: 16, bh: 16, ox: 1, oy: 1 }));
add('f_1', crop(en, 15, 0, 15, 16, null, { bw: 16 }));
add('hammer', crop(load(MW('DK_Arcade_Hammer_Sprite.png')), 0, 0, 9, 10));
add('parasol', crop(load(MW('DK_Arcade_Parasol_Sprite.png')), 0, 0, 16, 15));
add('hat', crop(load(MW('DK_Arcade_Hat_Sprite.png')), 0, 0, 15, 8));
add('purse', crop(load(MW('DK_Arcade_Bag_Sprite.png')), 0, 0, 9, 9));
add('rivet', crop(load(MW('DK_Arcade_Bolt.png')), 0, 0, 8, 9));

/* ---------------- tiles ---------------- */
add('girder25', crop(load(MW('Donkey_Kong_Arcade_25m_Screenshot.png')), 0, 84, 8, 8));
add('girder100', crop(load(MW('DK_Arcade_100m_Screenshot.png')), 80, 88, 8, 8));
add('bonusbox', blank(crop(load(MW('Donkey_Kong_Arcade_25m_Screenshot.png')), 171, 40, 43, 19), 3, 7, 37, 9));

/* ---------------- effects, popups, hearts ---------------- */
const fx = load(JS('effects_sprite_sheet.png'));
for (let i = 0; i < 4; i++) add('x_' + i, crop(fx, 1 + i * 16, 1, 16, 16));
add('heart', crop(fx, 0, 19, 16, 14));
add('heartBroken', crop(fx, 19, 19, 17, 14));
add('s100', crop(fx, 46, 23, 16, 7));
add('s300', crop(fx, 46, 35, 16, 7));
add('s800', crop(fx, 70, 35, 16, 7));
add('s500', crop(fx, 46, 47, 16, 7));

/* ---------------- font (7x7 glyphs in 8x8 cells, stored as 'W') ---------------- */
const FONT = {};
for (let i = 0; i < 10; i++) FONT[String(i)] = crop(st, 1 + 8 * i, 53, 8, 8);
for (let i = 0; i < 26; i++) FONT[String.fromCharCode(65 + i)] = crop(st, 8 * i, 63, 8, 8);
FONT['.'] = crop(st, 85, 53, 8, 8);
FONT['-'] = crop(st, 93, 53, 8, 8);
FONT['?'] = crop(st, 101, 53, 8, 8);
FONT[':'] = crop(st, 109, 53, 8, 8);
FONT['='] = crop(st, 117, 53, 8, 8);
FONT['('] = crop(st, 125, 53, 8, 8);
FONT[')'] = crop(st, 133, 53, 8, 8);
FONT['!'] = ['...WW...', '...WW...', '...WW...', '...WW...', '...WW...', '........', '...WW...', '........'];
FONT[','] = ['........', '........', '........', '........', '........', '...WW...', '...WW...', '..WW....'];
FONT['%'] = ['.WW...W.', '.WW..W..', '....W...', '...W....', '..W.....', '.W..WW..', 'W...WW..', '........'];
FONT["'"] = ['...WW...', '...WW...', '..WW....', '........', '........', '........', '........', '........'];
FONT['/'] = ['......W.', '.....W..', '....W...', '...W....', '..W.....', '.W......', 'W.......', '........'];
FONT['+'] = ['........', '...WW...', '...WW...', '.WWWWWW.', '.WWWWWW.', '...WW...', '...WW...', '........'];
FONT['_'] = ['........', '........', '........', '........', '........', '........', '.WWWWWW.', '........'];
FONT['m'] = ['........', '........', '.WW.WW..', 'WW.W.WW.', 'WW.W.WW.', 'WW...WW.', 'WW...WW.', '........'];
FONT[' '] = ['........', '........', '........', '........', '........', '........', '........', '........'];
// make every glyph monochrome
for (const k in FONT) FONT[k] = FONT[k].map(r => r.replace(/[^.]/g, 'W'));

/* ---------------- title logo ---------------- */
add('logo', crop(load(MW('DK_Arcade_In-game_Logo.png')), 0, 0, 200, 96));

/* ---------------- emit ---------------- */
function pack(rows) { return [rows[0].length, rows.length, rows.join('')]; }
let out = '/*SPRITES-BEGIN*/\n';
out += '/* Generated by tools/build-sprites.js from the genuine arcade art in reference/. Do not hand-edit. */\n';
out += 'const PAL = ' + JSON.stringify(PAL) + ';\n';
out += 'const SPR = {\n' + Object.keys(S).map(k => '  ' + k + ': ' + JSON.stringify(pack(S[k]))).join(',\n') + '\n};\n';
out += 'const FONT = {\n' + Object.keys(FONT).map(k => '  ' + JSON.stringify(k) + ': ' + JSON.stringify(pack(FONT[k]))).join(',\n') + '\n};\n';
out += '/*SPRITES-END*/';
fs.writeFileSync(path.join(REF, 'sprites.js'), out);
const html = path.join(__dirname, '..', 'index.html');
if (fs.existsSync(html)) {
  const h = fs.readFileSync(html, 'utf8');
  const a = h.indexOf('/*SPRITES-BEGIN*/'), b = h.indexOf('/*SPRITES-END*/');
  if (a < 0 || b < 0) throw new Error('index.html has no SPRITES markers');
  fs.writeFileSync(html, h.slice(0, a) + out + h.slice(b + '/*SPRITES-END*/'.length));
  console.log('spliced sprites into index.html');
}
console.log(Object.keys(S).length + ' sprites, ' + Object.keys(FONT).length + ' glyphs, ' + out.length + ' bytes');

if (process.argv.includes('--montage')) {
  const names = Object.keys(S).filter(n => n !== 'logo');
  const scale = 3, cellW = 52, cellH = 40, cols = 8;
  const rowsN = Math.ceil(names.length / cols);
  const W = cellW * cols * scale, H = (cellH * rowsN + 10) * scale;
  const rgb = Buffer.alloc(W * H * 3);
  for (let i = 0; i < rgb.length; i += 3) { rgb[i] = 30; rgb[i + 1] = 30; rgb[i + 2] = 60; }
  const put = (x, y, hex) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const i = (y * W + x) * 3; rgb[i] = parseInt(hex.slice(1, 3), 16); rgb[i + 1] = parseInt(hex.slice(3, 5), 16); rgb[i + 2] = parseInt(hex.slice(5, 7), 16); };
  names.forEach((n, i) => {
    const cx = (i % cols) * cellW, cy = Math.floor(i / cols) * cellH;
    const rows = S[n];
    rows.forEach((r, y) => r.split('').forEach((c, x) => {
      if (c === '.') return;
      for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) put((cx + 2 + x) * scale + dx, (cy + 2 + y) * scale + dy, PAL[c]);
    }));
  });
  // font strip
  const fy = rowsN * cellH + 1;
  Object.keys(FONT).forEach((k, i) => {
    FONT[k].forEach((r, y) => r.split('').forEach((c, x) => {
      if (c === '.') return;
      for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) put((i * 8 + x) * scale + dx, (fy + y) * scale + dy, '#ffffff');
    }));
  });
  encodePNG(path.join(REF, 'montage.png'), W, H, rgb);
  console.log('wrote reference/montage.png (' + names.join(', ') + ')');
}
