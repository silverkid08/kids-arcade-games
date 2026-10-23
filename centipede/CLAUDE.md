# Centipede clone: working notes for Claude

This is a clone of Atari Centipede (1981) in a single `index.html`, played with the
mouse. It follows `../GAME-SPEC.md`. The tooling is copied from `../duck-hunt/`.

The source of truth is **Atari's own source for revision 4**, which is MAME's
`centiped` (the ROM CRCs match):

- `reference/src/revision.v4/CENTI4.MAC` (game) and `CENIR4.MAC` (IRQ, messages,
  trackball).
- `CENDE4.MAC` (RAM map).
- `.txt` copies with the CR/form feeds stripped sit next to them.

Pictures:

- `reference/src/revision.v2/CENPIC.MAC` (labelled picture source).
- `136001.201/.202` (the picture ROM bytes that are embedded).

MAME's driver is in `reference/mame/`.

## Run and verify

```
node tools/test.js                    # must end "all tests passed" (~270 checks, ~7 s)
node tools/render-frame.js <scenario> # then Read tools/out/<scenario>.png
```

Scenarios:

- attract, play, bottom
- spider, points, flea, scorpion
- death, restore
- wave2, wave3, wave5, wave8
- invuln, initials, kid
- sheet (every sprite and stamp in the wave-1 palette)

`tools/build.js` cuts the IIFE out of index.html and exports internals as
`globalThis.__CP`. Add new functions to its EXPORT list when tests need them.

Checking in Chrome works the same way as for duck-hunt:

- The extension refuses `file://`, so serve the folder on localhost.
- The automation tab gets no rAF, so inject a Web-Worker `setInterval` rAF shim
  before the script.
- Drive it with `element.click()` and dispatched `MouseEvent`s from javascript_tool.

## Code map (index.html)

- **`PICT_ROM`** sits between the `/*ROM-BEGIN*/ /*ROM-END*/` markers and is written
  by `tools/inject-rom.js`.
  - `TILES[64]` holds the stamps, pre-rotated to the display.
  - `SPR[128]` holds the motion objects, unrotated 8x16.
  - `rgb32()` is MAME's colour-RAM formula.
- **`M`** is the machine state, named as in CENDE4: MOBJP/MOBJH/MOBJV/MOBJDH/MOBJDV
  [16], DEAD, CENTIN, CENTIS, COUNT*, CH[7]=CHAN0-6, colorRam, PICT/HPOS/VPOS/COLOR.
  `PF` is the playfield RAM at $400-$7FF, indexed by `addr - 0x400`.
  - Slots: 0-11 centipede, 12 flea/scorpion (ANT), 13 spider (BUG), 14 shot,
    15 gun.
  - `P/H/V/DH/DV` are aliases of the arrays.
  - All values are bytes. Directions are $01/$02/$FF/$FE.
  - `comp`/`abs8` are COMP/ABS.
  - `sbcDec` is NMOS decimal-mode SBC. It is used where the asm is in SED mode,
    which includes the COUNT3 quirk.
  - Score is a plain integer. `SCORE1()`/`SCORE2()` give the BCD bytes the asm
    compares against.
- **Routines**, one function each, same names and order as the asm main loop:
  `update()` = IRQ, SOUNDS, (GETINT), ATTRT, UPSCRE, MOTION, EXPLOD, MOVE, BUGMV,
  SHOOT, NEWHD, SCORP, ANTMV, CHKEND, RESTOR.
  - MOTION's labels became a `path` variable (12/15/20/25 = the asm's 12$/15$/20$/25$).
  - `releaseTail` is 163$-164$.
- **Coordinates:** H grows to the LEFT, V grows UP.
  - Sprite on the display: x = 240 - HPOS (+uy), y = 255 - VPOS - ux.
  - Stamp (c, r) on the display: x = 8c, y = 8(31 - r).
  - `OBSTAC` is ported bit-for-bit, including the rounding and the right-edge fold.
- **Knobs** are hooks layered on the port. All are neutral at Original:
  - centipede speed: an accumulator around MOTION.
  - shot speed: the step size, or extra 7-px steps.
  - shooter speed: the TBLMT limit.
  - segments: `NSEG` replaces NCENT in CENTPC/NEWHD/flea/scorpion conditions.
  - spider: COUNT2/COUNT waits.
  - flea: `game.fleaCool` / threshold.
  - scorpion: a chance gate.
  - mushrooms: INITSC count.
  - invulnerable: `bump()` in PLAY plus `gunAhead()` in MOTION's obstacle check.
- **Sound:** SOUNDS writes `M.AUDF/M.AUDC`. `Sound.push()` queues one snapshot per
  frame into a ScriptProcessor POKEY emulator. Tests read the registers.
- **Input:** both mouse modes feed the gun the same way.
  - POINTER mode becomes `absTarget()` deltas.
  - LOCK mode becomes `trackball()` counts into `M.TB/M.TBV`.
  - Keys go through `JOYS` in IRQ.
  - Initials use `input.initDX` (mouse dx) every 8th frame, as GETINT does.

## Gotchas already paid for

- `presetName()` ignores mouse, sens and invuln (they are `nopreset`). Without this,
  an invulnerable game would count as CUSTOM and land in the wrong high-score table.
- In tests, `applyPreset` saves settings. Use `Object.assign(settings, PRESETS.x)`
  when testing the round-trip.
- In SHOOT the shot is compared to objects at its new V (old + 7). Test set-ups
  must place the shot 3-4 px below the target.
- Fleas run during the between-wave DELAY (ANTMV does not check DELAY). Hand-driven
  wave tests turn the flea off, or it may kill the gun.
- The FREQ3/CONT3 spider table has 20 entries. Index y-1 counts down from 19.
- INITSC can place mushrooms in columns 30-31 (motion-object RAM on the board).
  They are counted in MUSH and then wiped. This is faithful.

## State

Done and verified headless:

- every Original rule listed in the README
- every knob, invulnerable mode, both mouse modes, and the mapping through a scaled
  canvas
- initials and per-preset/invulnerable tables, and the settings round-trip
- long bot runs with `render()` every frame
- PNG renders viewed for every scenario

Verified in Chrome on localhost with the rAF shim:

- the menu over the attract mode
- PLAY, mouse-driven gameplay (scoring, shot, mushrooms damaged), the Esc pause
  menu
- no console errors

Audio could not be listened to in automation. Only the AudioContext/ScriptProcessor
start-up was exercised without errors.

Not done: two players, cocktail, timed game, coin modes.
