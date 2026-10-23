/* Pulls the game's IIFE out of index.html, appends an export of its internals
   and loads it under the harness.  Shared by test.js, render-frame.js and
   rom-diff.js.  Requires harness.js to have been loaded first. */
const fs = require('fs');
const path = require('path');

const EXPORT = `
globalThis.__DM = { G, P, PPU, T, ART, AUD, AUDIO, Sound, settings, KNOBS, KNOB, PRESETS, PRESET_ORDER,
  applyPreset, setKnob, stepKnob, presetName, highKey, getHigh, loadSettings, saveSettings, makeCfg,
  step, render, fb, img, rand, addVirus, pillFits, checkHorMatch, checkVerMatch, checkDrop, updateField,
  confirmPlacement, generateNextPill, generatePillsReserve, rotateValidation, checkRotate, checkXMove, checkYMove,
  actionPillPlaced, actionSendPill, scoreIncrease, scoreValue, gravityThreshold, startPlaying, quitToTitle, openMenu,
  resume, overlayOpen, padDown, padUp, pad, inflate, unb64, APU, mainProgram, rescue, recordScore, refreshMenu,
  bcdInc, bcdDec, drawText, NES32, BTN, TILES, NTS, nextAction, pillColors, virusDestroyed, update, menu, layout,
  nmi, readPad, checkVirusLeft, levelIntro, initDataLevel, writeHud, renderFieldRow, overlays, danceBeat, bigVirusLvlAnim, scoreValue };
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
  return globalThis.__DM;
}

module.exports = { build };
