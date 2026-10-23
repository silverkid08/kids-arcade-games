# Breakout clone: working notes for Claude

A clone of Atari's 1976 arcade Breakout (discrete TTL, no CPU) in a single `index.html`, played with
the mouse. It follows `../GAME-SPEC.md` and reuses duck-hunt's tooling. Rules come from the MAME
gate-level netlist in `reference/nl_breakout.cpp`. Code comments name chips and signals (B5, A6, D5,
F7, BP_HIT, VB_HIT ...), so grep the netlist for them. README.md has the full derivation summary and
the sources.

## Run and verify

```
node tools/test.js                 # must end "all tests passed" (~270 checks, ~10 s)
node tools/render-frame.js play    # then Read tools/out/play.png
node tools/launch.js               # Chrome via file://
node tools/serve.js                # http://localhost:8791/shim.html for claude-in-chrome
```

- `render-frame.js` scenarios: attract serve play hit behind shrunk wall2 kid flash gameover. Optional
  args set the stretch (default 3x4).
- `tools/build.js` cuts the IIFE out of index.html and exports internals as `globalThis.__BO`. Add any
  new top-level function a test needs to its EXPORT list.

Chrome checks:
- claude-in-chrome refuses `file://`; use `tools/serve.js`.
- Automation tabs are background tabs: there is no rAF (the shim fixes that), and page
  `setInterval`/`setTimeout` run at 1 Hz. Drive any in-page bot from a Worker's `onmessage`, or the
  bot misses every ball.
- `element.click()` and dispatched `MouseEvent('mousedown'|'mousemove')` on the canvas work.
- Real hover moves also steer the paddle.

## Model

**Coordinates**
- The monitor is rotated, so x = scan line and y = H tick.
- Visible area: W=228 by H=240.
- x = 223 − V for V 0..223. The ball's x wraps over all 252 lines of a frame (XMIN −24 .. 227); see
  `vOfX`/`wrapX`.
- `ball.x`/`ball.y` are floats for the top-left of the 4x2 ball. Collisions use floor().

**Timing**
- `update()` is one machine frame at 63.42 Hz (`FPS`). The main loop is a fixed-step accumulator.

**Motion and collisions**
- `ballSpeed()` turns `game.hits` (B5), `game.ro` (D5#2 orange/red flag) and `ball.outer` (A6#2)
  into lines and ticks per frame, scaled by the speed knob.
- `collide(live)` runs everything the coincidence logic sees at the new position, in this order: side
  bounce (VB_HIT and V16), top wall (BTB), paddle (BP_HIT, segment from the leftmost touched line),
  bricks (only while `game.armed`, i.e. F7), floor. `live=false` is attract mode: no score, no sound.

**Serving**
- `serveTick()`: in arcade mode the invisible ball keeps moving down 1 tick/frame. `game.served` is
  the A3#1 latch. The ball emerges when it crosses H 143..144.
- Sticky mode parks the ball on the paddle instead.

**Walls**
- `wallCleared()` sets `pendingRefill`. `onCatch()` refills on the next paddle contact. After the
  last wall it sets `finished` + `endTimer`.

**Rendering**
- `render()` draws a 1-bit `mono` buffer (the monitor), then colours each row by `ROWCOL` (the
  cellophane).
- Kid badges (the tiny 3x5 font), the pause text and the floor flash are drawn on top in their own
  colours.

**Sound and stats**
- `Sound.log` records every effect name, even without AudioContext, and the tests use it.
  `game.beeps` / `BEEP_GAP` queue brick beeps.
- `game.stats` holds catches, misses, rally, best, bricks and saves. `endSession()` writes the high
  score (`high.<preset>[.inv]`), `stats.<preset>` and `history`.

## Gotchas already paid for

- Test placement: the ball moves before collisions are checked. Use `shootBrick(r, c)` and
  `place(x, 210)` in test.js, and reset `game.hits` when testing segments, or vx creeps up to 3.
- `applyPreset()` saves settings, so set stored JSON *after* calling it when testing `loadSettings`.
- `fresh()` clears localStorage unless `keep=true`.
- With invulnerable on and endless off, a parked paddle can still finish the game by clearing walls.

## Deliberate decisions

- **Original serve = click.** The netlist has no automatic serve outside attract mode. This differs
  from the original request's assumption; it is documented in the README.
- **Hits 8..11 really do slow the vertical speed back to 1** while horizontal goes to 3 (X0 = !QC,
  V_SLOW = !QD).
- **The shrunk paddle keeps its right edge**, because D4 starts counting at the 555 edge.

## State

Done and verified headless: every rule above, every knob, invulnerable mode, coordinate mapping
through the 2x3 canvas, settings and high-score round-trips, stats, and long bot runs with
`render()` every frame. PNGs of all scenarios were viewed.

Verified in Chrome (localhost and the shim):
- the menu, gameplay with the bot knocking out bricks, and the game-over screen with the catch-rate
  stats;
- real-mouse hover steering;
- the score blink;
- no console errors.

Not done: two-player alternation, credits and free-game logic.
