/* Pulls the game's IIFE out of index.html, appends an export of its internals
   and loads it under the harness.  Shared by test.js and render-frame.js.
   Requires harness.js to have been loaded first. */
const fs = require('fs');
const path = require('path');

const EXPORT = `
globalThis.__CP = { M, PF, P, H, V, DH, DV, game, settings, input, update, render, fb, img, SW, SH,
  ROM, TILES, SPR, PAL32, rgb32, CLRTAB, KNOBS, KNOB, PRESETS, PRESET_ORDER, LS, DEFAULT_TABLE,
  applyPreset, setKnob, stepKnob, presetName, highKey, loadTable, saveTable, getHigh, loadSettings, saveSettings,
  OBSTAC, OVRLAP, PLAY, PLAYEX, MUSHER, MUSHDC, SCORN1, CENTPC, ANTPC, BUGOFF, INIT, INIT1, INITSC, CLRCH,
  MOTION, EXPLOD, MOVE, BUGMV, SHOOT, shotStep, NEWHD, SCORP, ANTMV, CHKEND, RESTOR, SOUNDS, IRQ, UPSCRE, DLIVES,
  ATTRT, GETINT, UPDATE, SCORES, gameOver, startPlaying, bootAttract, toMenu_, openMenu, resume, togglePause,
  refreshMenu, toGame, aimAt, absTarget, trackball, onMove, typeInitial, waveAdvance, sbcDec, SCORE1, SCORE2,
  seed, rnd, Sound, chr, mess, digits, drawMO, overlayOpen, setNSEG: n => { NSEG = n; }, getNSEG: () => NSEG,
  FREQ0, FREQ1, FREQ2, FREQ3, FREQ4, FREQ6 };
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
  return globalThis.__CP;
}

module.exports = { build };
