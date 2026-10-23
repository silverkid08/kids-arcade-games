/* A tiny placement bot for the headless tools: when a new piece is active it
   picks the best (orientation, column) by the classic height / holes / lines /
   bumpiness score, teleports the piece there (if the spot is reachable from the
   top) and then holds Down.  It drives the real game code; only the steering is
   faked.  bot(G, opts) -> call once per frame before G.update(). */
function orientationsOf(G, orient) {
  const out = [orient]; let o = G.ROTATION[orient * 2 + 1];
  while (o !== orient && out.length < 4) { out.push(o); o = G.ROTATION[o * 2 + 1]; }
  return out;
}
function evaluate(G, pf) {
  const h = new Array(10).fill(0); let holes = 0, lines = 0;
  for (let r = 0; r < 20; r++) {
    let full = true;
    for (let c = 0; c < 10; c++) if (pf[r * 10 + c] === G.TILE_EMPTY) full = false;
    if (full) lines++;
  }
  for (let c = 0; c < 10; c++) {
    let seen = false;
    for (let r = 0; r < 20; r++) {
      const filled = pf[r * 10 + c] !== G.TILE_EMPTY;
      if (filled && !seen) { seen = true; h[c] = 20 - r; }
      else if (!filled && seen) holes++;
    }
  }
  let agg = 0, bump = 0;
  for (let c = 0; c < 10; c++) { agg += h[c]; if (c) bump += Math.abs(h[c] - h[c - 1]); }
  return -0.51 * agg + 0.76 * lines - 0.36 * holes - 0.18 * bump;
}
function bestPlacement(G, opts) {
  const g = G.g, saved = { x: g.x, y: g.y, cur: g.cur };
  let best = null;
  for (const o of orientationsOf(G, g.cur)) {
    for (let x = 0; x < 10; x++) {
      if (!G.isPositionValid(x, g.y, o)) continue;
      let y = g.y; while (G.isPositionValid(x, y + 1, o)) y++;
      const pf = g.pf.slice();
      for (let m = 0; m < 4; m++) { const k = o * 12 + m * 3; pf[((y + G.ORIENT[k]) * 10 + x + G.ORIENT[k + 2]) & 0xFF] = G.ORIENT[k + 1] & 0xFF; }
      let s = evaluate(G, pf);
      if (opts && opts.bad) s = -s;            // a bot that tries to top out
      if (!best || s > best.s) best = { s, x, o };
    }
  }
  Object.assign(g, saved);
  return best;
}
function makeBot(G, opts) {
  let lastPiece = -1;
  opts = opts || {};
  return function () {
    const g = G.g, I = G.input;
    I.keys.clear();
    if (g.mode !== 'play' || g.paused) return;
    if (g.playState === 1 && g.y <= 1 && lastPiece !== g.pieceSerial) {
      lastPiece = g.pieceSerial;
      const b = bestPlacement(G, opts);
      if (b && G.isPositionValid(b.x, g.y, b.o)) { g.cur = b.o; g.x = b.x; }
      return;                                  // release Down for a frame: the NES needs a fresh press
    }
    if (g.playState === 1 && !opts.noDown) I.keys.add('arrowdown');
  };
}
module.exports = { makeBot, bestPlacement, evaluate };
