/* Pulls the game's IIFE out of index.html, appends an export of its internals
   and loads it under the harness.  Shared by test.js and render-frame.js.
   Requires harness.js to have been loaded first. */
const fs = require('fs');
const path = require('path');

const EXPORT = `
globalThis.__DH = { game, settings, input, update, render, fb, img, SW, SH, C, PAL32, BG32,
  KNOBS, KNOB, PRESETS, PRESET_ORDER, LS, applyPreset, setKnob, stepKnob, presetName, highKey, getHigh, loadSettings, saveSettings,
  DUCK_SPR, DOG_SPR, FONT, HUD, LOGO, DIR_PAT, STEPS, SPEED_A, SPEED_B, SCRIPTS, QUOTA_TABLE, SHAPES, DUCK_SCORE,
  quotaFor, duckScore, perfectBonus, flyTimerFor, speedFor, shapeFor, hitRect, hitTest, fire, aimPoint, hoverTick,
  startPlaying, initRound, startRoundEnd, roundEndTick, spawnDucks, setDir, move, bounce, duckTick, dogTick,
  toGame, aimAt, openMenu, resume, togglePause, quitToMenu, endSession, closeSession, summarise, historyHTML,
  refreshMenu, showOverlay, toMenu_, seed, rnd, Sound, newDuck, drawText };
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
  return globalThis.__DH;
}

module.exports = { build };
