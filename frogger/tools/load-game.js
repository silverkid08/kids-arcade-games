/* Loads the game's script out of index.html under the harness and returns
   its internals (the IIFE gets an export appended at the EXPORT-POINT
   marker).  Shared by test.js and render-frame.js. */
const fs = require('fs');
const path = require('path');

function load() {
  const HTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  let src = HTML.slice(HTML.indexOf('<script>') + 8, HTML.lastIndexOf('</script>'));
  const EXPORT = `
globalThis.__FROGGER = { game, S, tick, press, canHop, render, newGame, startLevel, applyPreset, setKnob,
  loadSettings, saveSettings, loadHigh, saveHigh, highKey, presetOf, timerSteps, buildLanes, stepLane, objX, objXs,
  laneAtY, rideableAt, vehicleHit, killFrog, addScore, resetFrog, toMenu, togglePause, showOverlay,
  LANE_DEF, LANE_TIERS, SPEED_RING, RING_SLOTS, RING_PERIOD, PRESETS, KNOBS, BAY_X, SP, PAL, SPRITE_ROWS, FONT,
  HOP_FRAMES, HOP_STEP, TIMER_STEPS, TIMER_PACE, DEATH_DWELL, HOME_Y, RIVER_TOP, MEDIAN_Y, ROAD_TOP, START_Y,
  FROG_START_X, SW, SH, Sound, sprite, unrle, BG_RLE, BG_H, bayVisible, turtleSubmerged, crocMouthOpen };`;
  if (src.indexOf('// EXPORT-POINT') < 0) throw new Error('EXPORT-POINT marker missing');
  src = src.replace('// EXPORT-POINT', EXPORT);
  const build = path.join(__dirname, '.game.build.js');
  fs.writeFileSync(build, src);
  delete require.cache[require.resolve(build)];
  require(build);
  return globalThis.__FROGGER;
}
module.exports = { load };
