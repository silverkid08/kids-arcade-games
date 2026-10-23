# Pong clone: working notes for Claude

A clone of Atari's 1972 arcade Pong in a single `index.html`. It follows
`../GAME-SPEC.md`. The spec's "invulnerable mode" is the per-player **bumper
wall** here. The game rules are transcribed from the TTL schematic via MAME's
netlist (`reference/nl_pong.cpp`) and Holden's analysis
(`reference/holden-pong-circuit-analysis.pdf`). The PDF is image-heavy, but its
text streams extract with zlib. Comments cite board chips (F1, H2, H3, A2,
B3/A3, G7, C5...).

## Run and verify

```
node tools/launch.js                 # open in Chrome (file://)
node tools/test.js                   # must end "all tests passed" (206 checks, ~1-2 s)
node tools/render-frame.js play      # then Read tools/out/play.png
node tools/serve.js                  # http://localhost:8737/shim.html for claude-in-chrome
```

- `render-frame.js` scenarios: attract play serve wait edge gameover kid
  paused digits native.
- The harness rasterises `fillRect` when `global.__RASTER` is set. Everything
  on the canvas is a `fillRect`, including the 5 × 7 font, so the PNG is
  exactly the canvas. The CSS halo and vignette are not captured.
- `tools/build.js` cuts the IIFE out of index.html and exports internals as
  `globalThis.__PONG`. If a test needs a new top-level name, add it to `EXPORT`.

**Chrome checks.**
- The extension refuses `file://`, and automation tabs get no
  `requestAnimationFrame`. `serve.js` serves `/shim.html` with a Web Worker
  setInterval rAF shim.
- Drive it with dispatched `KeyboardEvent`s that carry `code`, and with
  `element.click()` on menu buttons.
- The game's internals are inside the IIFE and not reachable from the page.
- Open your own tab and close it when done; other agents share the browser.

## Model (all in machine units)

- **Coordinates.** x = H − 81 (0..373), y = V − 16 (0..245). One `update()` is
  one 60.05 Hz frame.
- **`update()` follows the raster:**
  1. paddles move
  2. horizontal move: lines V 0..3 are H2's move window, 2/3/4 clocks by
     `speedTier()`
  3. miss check: HVID meets HBLANK when x < 0 or x + 4 > 374
  4. serve timer
  5. V16 bounce check: `vc >= 252` toggles `game.rev` (A2)
  6. 246 visible lines step the vertical ball counter `game.vc`. It wraps 255 →
     `loadValue()`, so the period is 256 − load. Rows with `vc >= 252` are
     ball rows, collected in `game.rows`; `checkHit()` runs on each of them.
- **`encodeV(seg, rev)`** is the 7483 adder output (7..13). `loadValue()`
  applies the walls knob and ball-speed % through an accumulator. At 100% it
  is integer-exact.
- **Hits.** The latch updates on every overlapping line, so the last line
  wins. A hit clears `rev` and sets `dir`. `hitSoundOn` (C2) is cleared when
  `vc` reaches 240. Arcade speed-up adds 8 to `speedCount` per hit-sound start
  (F1 counts tone cycles) and stops at 12. Gradual adds 1.
- **`miss(side)`:**
  - attract: H3 toggles on the SC rising edge (`scHigh`)
  - bumper: the ball bounces, a flash shows, speed resets
  - otherwise: the opponent scores, the score tone plays, the ball is hidden
    for `SERVE_FRAMES`, and its direction is unchanged (it is served toward
    the player who missed)
- **Attract** (`game.mode === 'attract'`). There are no paddles and no sound.
  The ball's x wraps through the blanking like the real counter.
- **Paddles.** `game.pad[s].y` is a float top line and `.h` its height.
  `padSegment()` scales any height onto the 15-line count. `padRange()` gives
  the arcade gap (`PAD_TOP_GAP` 10, `PAD_BOTTOM_LIMIT` SH − 6) or the whole
  screen.
- **Input.**
  - `keys` is a Set of held `e.code` values; repeats are ignored for actions.
  - `sideKeys()`: 2P gives left W/S and right arrows; vs CPU, either set
    works.
  - Mouse: `toGame()` maps through `getBoundingClientRect`, and the paddle is
    absolute.
  - Touch: `touchSide[id]` pins each finger to the half it started on.
- **CPU.** `cpuMove()` uses `CPU_LEVELS` (react frames, speed fraction, error
  lines, aim chance). It predicts with `reflectY()`.
- **Settings.**
  - Knob ids: `'ballSpeed'` etc. for globals, `'L.size'` / `'R.bumper'` for
    per-player.
  - Presets only touch `GLOBAL_PRESET_KEYS` and `PLAYER_PRESET_KEYS`; mode,
    names, controls and mute are left alone.
  - Storage keys: `pong.settings`, `pong.wins` (name → count; `NAME*` = won
    with the bumper).
- **Rendering.**
  - `resize()` picks an integer number of device rows per line, k, and a 4:3
    width. `rect()` rounds edges at device resolution.
  - Scanlines darken the last device row of each line with `source-atop` when
    k ≥ 3.
  - Don't draw opaque boxes behind text: the CSS `drop-shadow` would make them
    glow.

## Decisions worth knowing

- **Serve direction.** The serve goes toward the player who missed. This
  contradicts some summaries ("toward the scorer"), but it is what Holden and
  the netlist show. Change it in `miss()` if a different choice is wanted.
- **Speed-up.** Arcade speed-up reaches top speed after two returns because F1
  counts HIT SOUND cycles. This is how the netlist is wired. The patent's
  4/12-hit reading is the "gradual" option.
- **Paddle gap.** The gap size is a judgment call (analog pot range); see the
  README.

## State

Done and verified headless:
- all rules above, every knob, CPU, input paths, settings and wins
- PNG renders of every scenario were viewed

Verified in Chrome (localhost + shim):
- menu over the attract screen
- a game started with Space
- W and ↓ held together moving both paddles at once
- switching the right player to the mouse through the menu buttons, with the
  paddle following the pointer
- no console errors

Not verified by ear: the audio. The tones are logged (`Sound.log`) and
checked in tests.
