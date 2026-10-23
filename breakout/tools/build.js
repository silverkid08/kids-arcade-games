/* Pulls the game's IIFE out of index.html, appends an export of its internals
   and loads it under the harness.  Shared by test.js and render-frame.js.
   Requires harness.js to have been loaded first.  (Copied from duck-hunt.) */
const fs = require('fs');
const path = require('path');

const EXPORT = `
globalThis.__BO = { game, ball, settings, input, update, render, fb, mono, img, canvas, W, H, FPS, LINE_HZ, FRAME_TICKS,
  WALL_W, RWALL_X, TOP_Y0, TOP_Y1, ROWS, COLS, BRICK_Y0, ROW_PITCH, BRICK_LIT, BRICK_X0, COL_PITCH, BRICK_W, ROW_VALUE,
  PAD_Y0, PAD_Y1, PAD_W, PAD_W_SHRUNK, BALL_W, BALL_H, LOST_Y, SERVE_Y, SND, BEEP_GAP, BLINK_FRAMES, COL, ROWCOL, BANDS,
  SEG7, SEG_RECT, DIGIT_POS, TINY, KNOBS, KNOB, PRESETS, PRESET_ORDER, LS,
  applyPreset, setKnob, stepKnob, presetName, highKey, getHigh, loadSettings, saveSettings, loadJSON,
  wrapX, vOfX, fillWall, bricksLeft, padRect, padTarget, updatePaddle, paddleSeg, shrunkW, ballSpeed, countHit, moveBall,
  findBrick, brickHit, collide, ballLost, serveTick, startGame, attractTick, playTick, finishGame, endSession, closeSession,
  summarise, toGame, toGameX, aimAt, openMenu, resume, togglePause, quitToMenu, refreshMenu, showOverlay, historyHTML, layout,
  overlayOpen, seed, rnd, Sound, drawDigit, drawTiny, newStats };
})();`;

function build() {
  const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  let src = HTML.slice(HTML.indexOf('<script>') + 8, HTML.lastIndexOf('</script>'));
  if (!src.trimEnd().endsWith('})();')) throw new Error('unexpected script tail in index.html');
  src = src.trimEnd().slice(0, -'})();'.length) + EXPORT;
  const out = path.join(__dirname, '.game.build.js');
  fs.writeFileSync(out, src);
  delete require.cache[out];
  require(out);
  return globalThis.__BO;
}

module.exports = { build };
