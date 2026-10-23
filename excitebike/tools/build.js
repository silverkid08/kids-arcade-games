/* Pulls the game's IIFE out of index.html, appends an export of its internals
   and loads it under the harness.  Shared by test.js, render-frame.js and lockstep.js.
   Requires harness.js to have been loaded first. */
const fs = require('fs');
const path = require('path');

const EXPORT = `
globalThis.__EB = { m, vram, palram, ppu, frameView, R, PRG, CHR, TILE, PAL32, fb, img, SW, SH, render, step, nmi, pad, BTN, KID, fx,
  settings, KNOBS, KNOB, PRESETS, PRESET_ORDER, applyPreset, setKnob, stepKnob, presetName, loadSettings, saveSettings, applyKid,
  recKey, loadRecordsIntoRom, timeStr, timeVal, toTitle, startMode, powerOn, openMenu, resume, game, design, Sound, MODE,
  designToTrack, loadDesignIntoRom, letterSeq, LETTERS, LETTER_COLS, chunkCols,
  sub_C2A9, sub_C27F, mode_C99A, sub_D326, sub_D0AB, sub_D14E, ppuList, setFrameHook: f => { frameHook = f; },
  setRng: n => { mainLoopRng = n; }, overlayOpen, refreshMenu, keys, updatePad,
  get spriteLimit() { return spriteLimit; },
  sub_DFD5, sub_C485, sub_DC1A, sub_E733, sub_D918, sub_CD59, sub_E359, sub_E96C, sub_DD8D, sub_E42B, sub_DA9F, sub_F4FF, sub_C875, crash, wobble,
  ED, mode_C97C, editorClick, placeLetter, clearAt, setEnd, designChanged, loadDesignSlot, validDesign, openSlots, pickSlot, closeSlots, designMap, itemAt,
  recordsHTML, lsGet, lsSet, loadJSON, LETTER_ID, chunkPtr, trackPtr, seqColumns, MAX_COLS, cpuCarry: () => cpuCarry };
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
  return globalThis.__EB;
}
module.exports = { build };
