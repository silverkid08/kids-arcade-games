/* Pulls the game's IIFE out of index.html, appends an export of its internals
   and loads it under the harness.  Shared by test.js and render-frame.js.
   Requires harness.js to have been loaded first. */
const fs = require('fs');
const path = require('path');

const EXPORT = `
globalThis.__PONG = { game, settings, keys, mouse, touchTarget, wins, update, render, canvas, ctx, resize,
  SW, SH, FPS, H_TOTAL, V_TOTAL, H_BLANK, V_BLANK, NET_X, PAD_X, PAD_W, PAD_H, BALL_W, BALL_H, SERVE_X, SCORE_Y, DIGIT_X,
  SERVE_FRAMES, SC_FRAMES, HIT_HZ, LOW_HZ, HSPEED, PAD_TOP_GAP, PAD_BOTTOM_LIMIT, KEY_SPEED, SEG7, SEG_RECT, FONT,
  KNOBS, PKNOBS, PRESETS, PRESET_ORDER, MODES, CPU_LEVELS, LS, DEFAULT_NAMES,
  applyPreset, presetName, getKnob, setKnob, stepKnob, knobDef, setName, cleanName, saveSettings, loadSettings, defaultSettings,
  isCpu, playerName, recordWin, clearWins, loadWins, speedTier, encodeV, loadValue, padSegment, padRange, checkHit, miss,
  receiver, gameOver, startGame, requestServe, keyDir, movePaddles, cpuMove, predictBallY, reflectY,
  toGame, onKeyDown, onKeyUp, onMouseMove, onMouseDown, onTouch, onTouchEnd, mouseSide,
  openMenu, resume, play, togglePause, toggleMute, refreshMenu, drawText, textWidth, seed, rnd, Sound,
  get menuOpen() { return menuOpen; }, get menuSel() { return menuSel; }, menuRows };
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
  return globalThis.__PONG;
}

module.exports = { build };
