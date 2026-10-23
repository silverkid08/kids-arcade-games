/* Pulls the game's IIFE out of index.html, appends an export of its internals
   and loads it under the harness.  Shared by test.js, render-frame.js and
   romsim.js.  Requires harness.js to have been loaded first. */
const fs = require('fs');
const path = require('path');

const EXPORT = `
globalThis.__TT = { g, settings, input, update, render, fb, img, SW, SH, YOFF, FPS, PAL32, CHR, NT, R, DATA,
  KNOBS, KNOB, PRESETS, PRESET_ORDER, LS, applyPreset, setKnob, stepKnob, presetName, loadSettings, saveSettings,
  highKey, getTable, setTable, defaultTable, bcdToInt, intToBcd, topScore,
  FRAMES_PER_DROP, ORIENT, ROTATION, SPAWN_TABLE, TYPE_FROM_ORIENT, HIDDEN, TILE_EMPTY, MUSIC_SEL,
  DOWN, UP, LEFT, RIGHT, BTN_A, BTN_B, SELECT, START,
  makeCPU, makeAPU, Sound, rngNext, nmiTick, pickRandomTetrimino, chooseNextTetrimino, isPositionValid, gravityFrames,
  startGame, playFrame, playNmi, toTitle, toGameType, toLevelMenu, toEntry, gameOver, readInput,
  openMenu, resume, startPlaying, quitToMenu, showOverlay, hideOverlay, refreshMenu, initPlayfieldForTypeB,
  updateLinesAndStatistics, checkForCompletedRows, lockTetrimino, spawnNextTetrimino, addPoints, scoreInt, charTile };
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
  return globalThis.__TT;
}

module.exports = { build };
