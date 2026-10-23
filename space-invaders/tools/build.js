/* Pulls the game's IIFE out of index.html, appends an export of its internals
   and loads it under the harness.  Shared by test.js and render-frame.js.
   Requires harness.js to have been loaded first. */
const fs = require('fs');
const path = require('path');

const EXPORT = `
globalThis.__SI = { game, settings, input, update, render, FB, SW, SH, XR, img,
  KNOBS, PRESETS, PRESET_ORDER, LS, applyPreset, setKnob, stepKnob, presetName, highKey, loadSettings, saveSettings,
  ALIEN_SPR, PLAYER_SPR, SHIELD_SPR, SAUCER_SPR, FONT, ROLLING, PLUNGER, SQUIGGLY,
  rackStartYr, saucerScoreForShot, SAUCER_SCORES, reloadRate, fleetDelay, ALIEN_SCORE, COL_FIRE,
  PLAYER_YR, PLAYER_MIN_X, PLAYER_MAX_X, SHIELD_X, SHIELD_YR, SAUCER_YR, RACK_X0,
  newGame, beginWave, nextWave, toMenu, startPlaying, togglePause, showOverlay, gameOver,
  countPixels, shieldPixels, columnHasPixels, drawShields, clearPlayField, printText, cnt16s, findRow, findColumn,
  alienTick, rackBump, playerShotHit, addScore, Sound, zoneColor };
})();`;

function build() {
  const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  let src = HTML.slice(HTML.indexOf('<script>') + 8, HTML.lastIndexOf('</script>'));
  if (!src.trimEnd().endsWith('})();')) throw new Error('unexpected script tail in index.html');
  src = src.trimEnd().slice(0, -'})();'.length) + EXPORT;
  const out = path.join(__dirname, '.game.build.js');
  fs.writeFileSync(out, src);
  require(out);
  return globalThis.__SI;
}

module.exports = { build };
