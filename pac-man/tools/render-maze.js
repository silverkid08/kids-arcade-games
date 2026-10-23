/* Rasterises the game's OWN drawWalls() (pulled straight out of index.html)
   plus the pellets into a 224x248 RGB buffer, so the shipped rendering code
   can be compared pixel-for-pixel against the arcade reference frame.

   It is a deliberately crude rasteriser: every sampled point on a line or
   arc paints one pixel.  Straight lines land exactly where the canvas puts
   them; curves come out up to 1px fatter than Chrome's anti-aliased arcs,
   so expect a handful of extra pixels on corners. */
const fs = require('fs');
const path = require('path');

const COLS = 28, ROWS = 31, T = 8;
const WALL = 1, DOOR = 2, VOID = 3, OPEN = 0;
const W = COLS * T, H = ROWS * T;

const WALL_RGB = [0x21, 0x21, 0xff];
const DOOR_RGB = [0xff, 0xb8, 0xae];
const DOT_RGB = [0xff, 0xb8, 0xae];

function renderMaze() {
  const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const MAZE = HTML.match(/const MAZE = \[([\s\S]*?)\];/)[1].match(/'[^']*'/g).map(s => s.slice(1, -1));
  const tiles = MAZE.map(r => [...r].map(ch =>
    ch === '#' ? WALL : ch === '=' ? DOOR : ch === '_' ? VOID : OPEN));

  /* same flood fill the game uses to find the sealed ghost house */
  const openAir = [];
  for (let r = 0; r < ROWS; r++) openAir.push(new Array(COLS).fill(false));
  const stack = [[13, 23]];
  openAir[23][13] = true;
  while (stack.length) {
    const [c, r] = stack.pop();
    for (const [dc, dr] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
      let nc = c + dc; const nr = r + dr;
      if (nr < 0 || nr >= ROWS) continue;
      if (nc < 0) nc += COLS; else if (nc >= COLS) nc -= COLS;
      if (tiles[nr][nc] !== OPEN || openAir[nr][nc]) continue;
      openAir[nr][nc] = true;
      stack.push([nc, nr]);
    }
  }

  const buf = Buffer.alloc(W * H * 3, 0);
  let cur = WALL_RGB, tx = 0, ty = 0;
  const px = (x, y) => {
    x = Math.floor(x + tx); y = Math.floor(y + ty);
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 3;
    buf[i] = cur[0]; buf[i + 1] = cur[1]; buf[i + 2] = cur[2];
  };
  const seg = (x0, y0, x1, y1) => {
    const n = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 4));
    for (let i = 0; i <= n; i++) px(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n);
  };

  const ctx = {
    strokeStyle: '', fillStyle: '', lineWidth: 1, lineCap: '', lineJoin: '',
    _cur: null, _segs: [],
    beginPath() { this._segs = []; this._cur = null; },
    moveTo(x, y) { this._cur = [x, y]; },
    lineTo(x, y) { if (this._cur) this._segs.push([...this._cur, x, y]); this._cur = [x, y]; },
    arc(cx, cy, r, a0, a1) {
      let p = this._cur;
      for (let i = 0; i <= 16; i++) {
        const a = a0 + (a1 - a0) * i / 16;
        const q = [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
        if (p) this._segs.push([...p, ...q]);
        p = q;
      }
      this._cur = p;
    },
    stroke() { cur = WALL_RGB; for (const s of this._segs) seg(...s); },
    fillRect(x, y, w, h) {
      cur = DOOR_RGB;
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(x + i, y + j);
      cur = WALL_RGB;
    },
    translate(dx, dy) { tx += dx; ty += dy; },
    save() {}, restore() { tx = 0; ty = 0; }, setTransform() {}, closePath() {}, fill() {}
  };

  const src = HTML.slice(HTML.indexOf('function drawWalls'), HTML.indexOf('function buildMazeCache'));
  const drawWalls = new Function(
    'tiles', 'ROWS', 'COLS', 'T', 'WALL', 'DOOR', 'VOID', 'OPEN', 'TUNNEL_ROW', 'DOOR_COLOR', 'openAir',
    src + '; return drawWalls;'
  )(tiles, ROWS, COLS, T, WALL, DOOR, VOID, OPEN, 14, '#ffb8ae', openAir);
  drawWalls(ctx, '#2121ff');

  /* pellets, drawn the same way the game draws them */
  cur = DOT_RGB;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const ch = MAZE[r][c];
    if (ch === '.') {
      for (let y = 3; y < 5; y++) for (let x = 3; x < 5; x++) px(c * T + x, r * T + y);
    } else if (ch === 'o') {
      for (let y = -4; y <= 3; y++) for (let x = -4; x <= 3; x++) {
        if ((x + 0.5) ** 2 + (y + 0.5) ** 2 <= 16) px(c * T + 4 + x, r * T + 4 + y);
      }
    }
  }

  const pixel = (x, y) => {
    const i = (y * W + x) * 3;
    return [buf[i], buf[i + 1], buf[i + 2]];
  };
  return { W, H, COLS, ROWS, T, buf, pixel, MAZE, tiles };
}

module.exports = { renderMaze, W, H, COLS, ROWS, T, WALL, DOOR, VOID, OPEN };
