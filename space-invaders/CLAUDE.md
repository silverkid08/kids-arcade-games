# Space Invaders clone — working notes for Claude

A clone of the 1978 arcade Space Invaders in one `index.html`, following the
repo contract in `../GAME-SPEC.md` and the conventions of `../pac-man/`.
Kid-mode additions: presets/knobs and an invulnerable toggle. Everything else
is meant to match the arcade at the "Original" preset.

## Run it

```
node tools/launch.js            # or double-click index.html
```

## Verify after ANY change

```
node tools/test.js              # must end "all tests passed"
node tools/render-frame.js play # then look at tools/out/play.png with the Read tool
```

`tools/test.js` runs the real game (pulled out of `index.html` by
`tools/build.js`, which appends an export of the internals) under
`tools/harness.js`, calling `render()` every frame. If you add a top-level
function the tests need, add it to the `EXPORT` string in `build.js`.

The claude-in-chrome extension refuses `file://` URLs, and a tab that is not
the active one in its window gets no `requestAnimationFrame`. Verification in
Chrome was done by serving the folder on localhost and, for a hidden tab, a
wrapper that drives rAF from a Web Worker timer (see the report / README).

## Layout

```
index.html         the entire game: markup, CSS, one IIFE of JS, ROM bitmaps as hex
reference/
  ca-si-code.txt      computerarcheology.com disassembly (text) - sprites, tables, logic
  ca-si-hardware.txt  screen geometry, ports, DIP switches
  ca-si-ram.txt       RAM map (object structures and their ROM mirror defaults)
  mame-invaders.lay   the colour overlay zones
tools/             test.js, harness.js, build.js, render-frame.js, png.js, launch.js
```

## The model (don't fight it)

The arcade is a 1-bit 224x256 framebuffer and every object draws itself into
it. This clone does the same: `FB` is `Uint8Array(224*32)`, indexed
`FB[x*32 + (yr>>3)]`, bit `yr&7`.

- **Coordinates**: `x` is screen x (0..223). Vertical positions use the
  arcade's **Yr**: 0 at the bottom, 255 at the top (canvas row = 255 - Yr).
  The ROM's horizontal "Xr" is `x + 32` (`XR`); it matters for `cnt16s`.
- **Primitives** mirror the 8080 routines: `drawSimple` (byte-aligned write),
  `drawShifted(x, yr, bytes, n, M_WRITE | M_OR | M_ERASE)` (returns a collision
  flag in OR mode), `eraseSimple` (clears 2 bytes per column), `clearSmall`,
  `printText`, `clearPlayField` (Yr 16..223).
- Because aliens are drawn with **write** semantics over 16 columns x 2 bytes,
  they erase whatever they pass through (shields, shots), just like the
  arcade. Shots are OR'd with collision detection; explosions are OR'd then
  erased, which is what carves the shields.
- **Rack bump** scans framebuffer columns 9 and 213 (Yr 32..215) for any set
  pixel. The saucer passing those columns can reverse the rack early — the
  arcade does that too.
- **One alien per tick**: `alienTick` draws the alien under the cursor, then
  advances the cursor; passing index 54 moves the reference alien
  (`moveRefAlien`) and toggles the animation frame. The step-rate knob feeds
  an accumulator (`alienAcc`) so 100% is exactly one tick per frame.
- **Timing** reduced from the two-interrupt scheme: player and player shot
  once per frame; the three bombs and the saucer run on frames
  `% 3 === 0/1/2` (4 px per run, saucer 2 px), which is the arcade's net rate.

## Code map (grep the banner comments, not line numbers)

| Section | What |
|---|---|
| Geometry / framebuffer | `SW`, `SH`, `XR`, `FB` |
| Art | `ALIEN_SPR[type][frame]`, `PLAYER_SPR`, `SHIELD_SPR`, `SAUCER_SPR`, bombs, `FONT` |
| Arcade tables | `rackStartYr`, `SAUCER_SCORES`, `COL_FIRE`, `reloadRate`, `fleetDelay`, screen positions |
| Framebuffer primitives | draw/erase/print/clear, `countPixels` |
| Settings | `KNOBS`, `PRESETS`, `settings`, `presetName`, `applyPreset`, `highKey`, load/save |
| Sound | WebAudio synth (`Sound.*`) |
| Game state | the `game` object; `newPlayer/newShot/newAlienShot/newSaucer`; `resetMirror` = CopyRAMMirror |
| Set-up | `newGame` (prompt), `beginWave`, `nextWave`, `gameOver`, `demoScene` |
| The rack | `alienTick`, `moveRefAlien`, `invade`, `rackBump`, `cnt16s/findRow/findColumn` |
| Player | `playerTick` (incl. blow-up), `playerFire` |
| Player shot | `playerShotTick`, `playerShotHit` (the kill/miss/saucer decision), `endOfBlowup` |
| Bombs | `handleAlienShot`, `shotBlowingUp`, `rollingTick/plungerTick/squigglyTick` |
| Saucer | `saucerOrSquigglyTick` |
| Main update | `playTick`, `roundEndTick`, `promptTick`, `gameOverTick`, `demoTick`, `update` |
| Rendering | `paintFramebuffer` (overlay zones), `render` |
| Menu | preset buttons, knob rows, `refreshMenu`, `showOverlay`, `toMenu` |
| Input | keyboard state in `input`, touch zones |
| Main loop | `frame()` fixed 1/60 accumulator |

States: `menu` (demo rack behind the overlay) -> `prompt` ("PLAY PLAYER<1>",
176 frames) -> `play` -> `roundend` (48 frames) -> `play` ... -> `gameover`
(types GAME OVER, then the overlay).

## Gotchas already paid for

- The arcade draws alien 0 on the first tick and advances afterwards. Advance
  first and the whole rack is one frame off (tests catch it).
- The rack keeps moving for the 5 frames between a hit and the first blow-up
  sprite; only then does `playerOK` drop and freeze it. Faithful, not a bug.
- `game.P` is replaced by `newPlayer()` at the end of a death and in
  `resetMirror`; don't cache it across frames.
- A shot fired from directly under a bunker hits the bunker (alien 0 sits
  over bunker 0 at the start). The scoring tests use `shields: 0`.
- The saucer timer only runs once `refYr < 0x78`; wave 1 needs one drop first.
- `shootAt` in the tests teleports the cannon; the old cannon image stays in
  the framebuffer (the arcade never teleports). Harmless there.
- Large bash heredocs fail in this environment; use the Write tool.
- Extra-ship "every N" is a kid-mode addition; `extraAwarded` is the arcade's
  once-only flag.

## State of the work

Done and verified (headless + Chrome screenshots): ROM art and font, HUD
positions, per-alien stepping with the correct period, edge bump/drop and
the 3-px last-alien quirk, cannon and shot speeds and limits, one-shot rule,
scoring per row, alien explosion freeze, bombs (three types, speed, reload
gate, column table, player tracking), shield erosion by shots/bombs/aliens,
saucer timing/movement/score table, death and respawn sequence, invasion,
extra ship (DIP 1500), wave start heights, colour overlay, presets/knobs,
invulnerable mode, localStorage persistence with per-preset and `.inv` keys,
pause/menu/game-over overlays, keyboard and touch input.

Not implemented: two-player mode, attract-mode cartoons, coins/credits, TILT,
score rollover at 10000, exact interrupt interleaving, sampled sound.
