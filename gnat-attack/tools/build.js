/* Pulls the game's IIFE out of index.html, appends an export of its internals
   and loads it under the harness.  Shared by test.js and render-frame.js.
   Requires harness.js to have been loaded first. */
const fs = require('fs');
const path = require('path');

const EXPORT = `
globalThis.__GA = { game, settings, input, update, render, fb, img, SW, SH, PF, PAL32, BG, SPR, ART, MUSIC, SFX,
  KNOBS, KNOB, PRESETS, PRESET_ORDER, LS, applyPreset, setKnob, stepKnob, presetName, highKey, getHigh, loadSettings, saveSettings, loadJSON,
  LEVELS, COUNTED, POINTS, MESH, HAND, SWAT_UP, SWAT_DOWN,
  startPlaying, startLevel, startBoss, startClear, nextLevel, gameOver, spawnBug, pickKind, spawner, bugTick, explode, fireShot,
  meshRect, handRect, bugBox, overlap, targetsUnder, canSwat, swat, swatHits, gloveTick, hoverTick, sting, damageTick, bossHit, bossTick,
  summarise, endSession, closeSession, historyHTML, refreshMenu, showOverlay, toMenu_, openMenu, resume, togglePause, quitToMenu,
  toGame, aimAt, seed, rnd, Sound, draw, unrle, newGlove, statsEl: document.getElementById('statsbox'), badgeEl: document.getElementById('badge') };
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
  return globalThis.__GA;
}

module.exports = { build };
