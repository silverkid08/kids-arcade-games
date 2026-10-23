/* Traces the collision walls of each table screen from the REAL background
   art (the nametables in reference/art.gen.js drawn with the CHR ROM):

     1. every BG pixel of the table area whose colour is a wall colour (the
        table colour $12 and the white outline $30) is "solid", except inside
        the decoration rectangles listed in CONFIG (score labels, arrows,
        the Nintendo logo, bumpers, which get exact circle colliders instead)
     2. the boundary between solid and empty pixels is followed into closed
        pixel-edge loops
     3. each loop is simplified (Ramer-Douglas-Peucker, 0.9 px) so the
        staircase diagonals become straight segments

   Output: reference/colliders.gen.js (const WALLS = {upper:[[x1,y1,x2,y2],...],
   lower:[...], bonus:[...]}) and tools/out/trace-<scene>.png overlays (art
   dimmed, segments red, circles yellow) to check that they line up.

     node tools/trace.js            (then node tools/inject.js)           */
'use strict';
const fs = require('fs');
const path = require('path');
const { encodePNG } = require('./png.js');

const ROOT = path.join(__dirname, '..');
global.ART = null;
eval(fs.readFileSync(path.join(ROOT, 'reference', 'art.gen.js'), 'utf8').replace('const ART', 'global.ART'));
const CHR = Buffer.from(ART.chr, 'base64');

/* rectangles [x0,y0,x1,y1) whose pixels are NOT walls (decor, or objects with
   their own colliders), and the table's x range */
const CONFIG = {
  upper: {
    x0: 66, x1: 240,
    skip: [
      [122, 40, 136, 48], [136, 32, 153, 40], [154, 40, 169, 48],      // 500 1000 500 labels
      [122, 48, 135, 55], [138, 40, 151, 47], [153, 48, 167, 55],      // chute arrows (table colour, not walls)
      [128, 84, 160, 116],                                                // pop bumper (circle collider)
      [186, 70, 202, 82],                                                 // "500" label over the green bar
      [120, 176, 168, 186],                                               // Nintendo logo
      [86, 126, 92, 160],                                                 // left flags (own colliders)
      [100, 200, 116, 212], [172, 200, 188, 212]                          // flipper pivot caps (part of the flippers)
    ]
  },
  lower: {
    x0: 66, x1: 240,
    skip: [
      [104, 70, 136, 98], [152, 70, 184, 98], [128, 102, 160, 130],       // three bumpers (circles)
      [100, 22, 186, 48],                                                 // cards (own collider: a block)
      [100, 192, 116, 204], [172, 192, 188, 204],                         // flipper pivot caps
      [214, 158, 240, 215]                                                // striker box (own collider)
    ]
  },
  bonus: {
    x0: 66, x1: 240,
    skip: [
      [80, 0, 226, 64],                                                   // BONUS STAGE sign + Pauline box (own colliders)
      [86, 86, 120, 124], [182, 86, 218, 124],                            // blue bumpers (circles)
      [128, 76, 184, 146],                                                // bingo lamps (pass-through)
      [80, 166, 112, 178], [196, 166, 228, 178],                          // EXIT signs
      [88, 200, 216, 240]                                                 // Mario's floor art
    ]
  }
};

function decode(scene) {
  const s = ART[scene];
  const nt = Buffer.from(s.nt, 'base64');
  const bgBase = (s.ctrl & 0x10) ? 0x1000 : 0;
  const col = new Uint8Array(256 * 240);
  for (let ty = 0; ty < 30; ty++) for (let tx = 0; tx < 32; tx++) {
    const t = nt[ty * 32 + tx];
    const at = nt[0x3C0 + (ty >> 2) * 8 + (tx >> 2)];
    const pal = (at >> (((ty & 2) << 1) | (tx & 2))) & 3;
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const o = bgBase + t * 16 + y;
      const p = ((CHR[o] >> (7 - x)) & 1) | (((CHR[o + 8] >> (7 - x)) & 1) << 1);
      col[(ty * 8 + y) * 256 + tx * 8 + x] = s.pal[p ? pal * 4 + p : 0] & 0x3F;
    }
  }
  return col;
}

function mask(scene, col) {
  const c = CONFIG[scene];
  const solidCols = scene === 'bonus' ? [0x2A, 0x30, 0x27] : [0x12, 0x30];
  const m = new Uint8Array(256 * 240);
  for (let y = 0; y < 240; y++) for (let x = c.x0; x < c.x1; x++) {
    if (!solidCols.includes(col[y * 256 + x])) continue;
    if (c.skip.some(r => x >= r[0] && x < r[2] && y >= r[1] && y < r[3])) continue;
    m[y * 256 + x] = 1;
  }
  return m;
}

/* boundary loops along pixel edges; corners are integer lattice points */
function loops(m) {
  const W = 256, H = 240, solid = (x, y) => x >= 0 && y >= 0 && x < W && y < H && m[y * W + x];
  // directed edges with solid on the right-hand side (y down): key "x,y" -> list of next points
  const next = new Map();
  const add = (x1, y1, x2, y2) => { const k = x1 + ',' + y1; if (!next.has(k)) next.set(k, []); next.get(k).push([x2, y2]); };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!solid(x, y)) continue;
    if (!solid(x, y - 1)) add(x, y, x + 1, y);
    if (!solid(x + 1, y)) add(x + 1, y, x + 1, y + 1);
    if (!solid(x, y + 1)) add(x + 1, y + 1, x, y + 1);
    if (!solid(x - 1, y)) add(x, y + 1, x, y);
  }
  const out = [];
  for (const [k0] of next) {
    while (next.has(k0) && next.get(k0).length) {
      let [x, y] = k0.split(',').map(Number);
      const loop = [[x, y]];
      for (let guard = 0; guard < 100000; guard++) {
        const k = x + ',' + y, l = next.get(k);
        if (!l || !l.length) break;
        const [nx, ny] = l.shift();
        x = nx; y = ny;
        if (x + ',' + y === k0) break;
        loop.push([x, y]);
      }
      if (loop.length >= 4) out.push(loop);
    }
  }
  return out;
}

function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
  let best = -1, bi = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / L;
    if (d > best) { best = d; bi = i; }
  }
  if (best <= eps) return [pts[0], pts[pts.length - 1]];
  const a = rdp(pts.slice(0, bi + 1), eps), b = rdp(pts.slice(bi), eps);
  return a.slice(0, -1).concat(b);
}

function simplifyLoop(loop, eps) {
  // split the closed loop at its two farthest-apart points and simplify each half
  let i0 = 0, i1 = 0, best = -1;
  for (let i = 0; i < loop.length; i += Math.max(1, loop.length >> 6)) for (let j = 0; j < loop.length; j++) {
    const d = (loop[i][0] - loop[j][0]) ** 2 + (loop[i][1] - loop[j][1]) ** 2;
    if (d > best) { best = d; i0 = i; i1 = j; }
  }
  if (i1 < i0) [i0, i1] = [i1, i0];
  const a = loop.slice(i0, i1 + 1), b = loop.slice(i1).concat(loop.slice(0, i0 + 1));
  return rdp(a, eps).slice(0, -1).concat(rdp(b, eps).slice(0, -1));
}

function trace(scene) {
  const col = decode(scene);
  const m = mask(scene, col);
  const segs = [];
  for (const loop of loops(m)) {
    if (loop.length < 6) continue;
    const p = simplifyLoop(loop, 1.1);
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length];
      if (a[0] !== b[0] || a[1] !== b[1]) segs.push([a[0], a[1], b[0], b[1]]);
    }
  }
  return { col, m, segs };
}

function overlay(scene, t, extra) {
  const S = 4, W = 256 * S, H = 240 * S, buf = Buffer.alloc(W * H * 3);
  const NP = ART.nespal;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = NP[t.col[(y / S | 0) * 256 + (x / S | 0)]];
    const d = (y * W + x) * 3;
    buf[d] = (c >> 16) * 0.45; buf[d + 1] = ((c >> 8) & 255) * 0.45; buf[d + 2] = (c & 255) * 0.45;
  }
  const line = (x1, y1, x2, y2, r, g, b) => {
    const n = Math.ceil(Math.hypot(x2 - x1, y2 - y1) * S * 2) + 1;
    for (let i = 0; i <= n; i++) {
      const X = Math.round((x1 + (x2 - x1) * i / n) * S), Y = Math.round((y1 + (y2 - y1) * i / n) * S);
      if (X >= 0 && Y >= 0 && X < W && Y < H) { const d = (Y * W + X) * 3; buf[d] = r; buf[d + 1] = g; buf[d + 2] = b; }
    }
  };
  for (const s of t.segs) line(s[0], s[1], s[2], s[3], 255, 40, 40);
  for (const e of (extra || [])) {
    if (e.c) for (let a = 0; a < 64; a++) line(e.c[0] + e.c[2] * Math.cos(a / 64 * 6.283), e.c[1] + e.c[2] * Math.sin(a / 64 * 6.283),
      e.c[0] + e.c[2] * Math.cos((a + 1) / 64 * 6.283), e.c[1] + e.c[2] * Math.sin((a + 1) / 64 * 6.283), 255, 230, 0);
    if (e.s) line(e.s[0], e.s[1], e.s[2], e.s[3], 0, 255, 255);
  }
  encodePNG(path.join(__dirname, 'out', 'trace-' + scene + '.png'), W, H, buf);
}

module.exports = { trace, overlay, decode, CONFIG };

if (require.main === module) {
  const WALLS = {};
  for (const scene of ['upper', 'lower', 'bonus']) {
    const t = trace(scene);
    WALLS[scene] = t.segs;
    overlay(scene, t);
    console.log(scene + ': ' + t.segs.length + ' segments');
  }
  const body = '/* generated by tools/trace.js from the real table art - do not edit */\nconst WALLS = ' + JSON.stringify(WALLS) + ';';
  fs.writeFileSync(path.join(ROOT, 'reference', 'colliders.gen.js'), body);
  console.log('wrote reference/colliders.gen.js (' + body.length + ' bytes)');
}
