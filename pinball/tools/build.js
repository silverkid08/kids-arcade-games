/* Pulls the game's IIFE out of index.html, appends an export of its internals
   and loads it under the harness.  Shared by test.js and render-frame.js.
   Requires harness.js to have been loaded first. */
const fs = require('fs');
const path = require('path');

const EXPORT = `
globalThis.__PB = { game, settings, input, ball, update, render, fb, SW, SH, SCN, TILES, NES32, ART, SOUNDS, WALLS,
  UPPER, LOWER, BONUS, TITLE, TABLE, BONUSW, T, FLIPPERS, FL, KNOBS, KNOB, PRESETS, PRESET_ORDER, LS,
  TICKS, GRAV, BALL_R, LAUNCH_BASE, LAUNCH_STEP, LAUNCH_MAXP, POSE_FRAMES, KICKER_HOLD, VMAX,
  applyPreset, setKnob, stepKnob, presetName, highKey, getHigh, loadSettings, saveSettings,
  startPlaying, toPlunger, launch, ballLost, resetBallState, addScore, onHit, sensors, hitEgg, slotJackpot,
  enterBonus, leaveBonus, bonusTick, shrinkFloor, physicsFrame, earliestHit, sweepSeg, sweepCircle, flipTip,
  ticksPerFrame, nudge, openMenu, resume, togglePause, toMenu_, refreshMenu, overlayOpen, setCard,
  seed, rnd, Sound, drawText, physStats, getAttrQuad, slotWindowUnderBar };
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
  return globalThis.__PB;
}

module.exports = { build };
