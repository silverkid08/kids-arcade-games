# Duck Hunt clone: working notes for Claude

A clone of NES Duck Hunt (1984) in a single `index.html`, played with the mouse.
It follows `../GAME-SPEC.md`. The spec's "invulnerable mode" becomes **no-fail mode**
here. Rules are transcribed from the disassembly in `reference/disasm/Duck-ssembly.asm`.
Comments in the code cite ROM labels (CA19, CB77, D2C9 and so on); grep the asm for them.

## Run and verify

```
node tools/launch.js                 # open in Chrome
node tools/test.js                   # must end "all tests passed" (~150 checks, ~7 s)
node tools/render-frame.js play      # then Read tools/out/play.png
```

`render-frame.js` scenarios: menu intro sniff jump play shot fall hold flyaway laugh
gameb roundend perfect gameover kid sheet. `sheet` lays out every sprite frame and
marks the entity origin, which is the quickest art check.

`tools/build.js` cuts the IIFE out of index.html and appends an `EXPORT` of the
internals as `globalThis.__DH`. If a test needs a new top-level function, add it there.

To check in Chrome: the claude-in-chrome extension refuses `file://`, so serve the
folder on localhost. The automation tab also gets no `requestAnimationFrame` (it acts
as a background tab), so the game appears frozen. What worked was a wrapper page that
injects a Web-Worker `setInterval` rAF shim before the game script, served from a tiny
node server. Extension clicks on menu buttons were unreliable; `element.click()` and
dispatched `MouseEvent('mousedown')` from javascript_tool work.

## Generated data (do not hand-edit the blocks in index.html)

- `/*ART-BEGIN*/ ... /*ART-END*/` holds `const ART`.
  - Rebuilt by `node tools/extract-art.js`, which writes `reference/art.gen.js`.
  - `tools/asm-meta.js` parses the metasprite tables so frames land on the ROM's tile
    positions; the extract report must show `outside=0 emptyTiles=0` for every frame.
  - Palette indices 0-16 are a fixed order (see the `C` object in index.html).
    Index 2 is the sky: transparent in the BG layer, and remapped to pink in HUD tiles.
- `/*MUSIC-BEGIN*/ ... /*MUSIC-END*/` holds `const MUSIC`.
  - Rebuilt by `node tools/extract-music.js`, which writes `reference/music.gen.js`.
    It runs the ROM's music player offline.
  - `tunes.<name>.{sq1,sq2,tri,noise}` are flat `[frames, Hz, ...]` arrays, plus
    `triGate` and `env`.
  - `sfx.*` are per-frame tables.
  - `dmc.quack` and `dmc.bark` are raw 1-bit delta sample bytes (base64).
- After running either extractor, run `node tools/inject.js`.

## Model

- **Coordinates and drawing.**
  - NES pixels, 256x240. A duck's (x, y) is its centre; the dog's is its ROM anchor
    (y = $AC).
  - Coordinates are 8-bit and wrap with `& 0xFF`. A duck going above y=0 wraps to
    ≥$F0 and is removed, as in the ROM.
  - Rendering is software into a `Uint32Array` over ImageData. The order is:
    1. sky colour
    2. behind-BG sprites (all ducks; the dog after its `$FD` command)
    3. BG layer (sky pixels transparent)
    4. dynamic HUD
    5. messages
    6. front sprites (the dog, score pop-ups)
    7. stats box, badge, zapper flash
    8. crosshair
- **Timing.** `update()` is one NES frame.
  - `timer2B` ticks every frame.
  - `timer2D` ticks every 11 frames (HandleGlobalTimers).
  - `timedChange(next, ticks)` copies StartTimedGameplayModeChange.
- **Modes.** `game.mode` is one of `menu`, `duck`, `roundend`, `wait` or `gameover`.
  The dog's state machine (`dogTick`, states 0-18 as in ExecuteDogEntityCode_CCA9)
  drives the intro, spawns the ducks (state 14 = SpawnDucks) and ends the round
  (state 15).
- **Ducks.** Duck states 0-8 follow ExecuteDuckEntityCode_C902.
  - `duckFly` is CA19.
  - `move` is CBC3, using the step count from `stepsThisFrame` (D81B). The speed
    knob is applied there, in flight only.
  - `bounce` is CAED, `scriptPath` is CB59, `escapeMove` is CF16.
- **Animations.** `animStep` interprets the ROM's animation byte scripts (CE4D/CE72),
  including the dog's per-frame jump triples (state 9) and the (count, dy, image)
  movers (states $0B, $0D, $11).
- **Game B.** Game B uses the scripts only when fly-away = original. With any other
  fly-away setting, both ducks use the Game A free-flight logic (`ai_mode`). Fly-away
  "never" also converts a finished Game B script into free flight.
- **Shooting.** `fire()` is the Zapper check: flying ducks only, duck 0 first, at most
  one hit, and hit squares at y ≥ $A8 do not count. `hitRect` applies size and padding.
  `aimPoint()` applies the magnet. `hoverTick()` handles hover-and-hold.
- **Stats.** `game.stats` covers the session. `endSession()` writes the high score
  (keyed by preset, game, and `.nofail`), `stats.<preset>` and `history` (last 10).
- **Sound.** `Sound.log` records every tune and effect name, even without
  AudioContext. The tests use it.

## Gotchas already paid for

- The rip sheet lists every duck animation set in **reverse** order compared with the
  ROM image indices; extract-art.js maps them. Falling image 10 is the mirror of 11.
- On this rip sheet the TOP SCORE digits sit 1 px off the letter grid, and the
  copyright line has a single ".," tile (stored as the backtick key). The digits 0, 3,
  5 and 9 are taken from the real screenshot.
- In Game B the ROM never shows FLY AWAY. That is faithful, not a bug.
- SHOT, the bullets' highlight and the quota bar are drawn in the backdrop colour on
  the NES, so they turn pink during FLY AWAY. This is faithful.
- `fresh()` in test.js clears localStorage. Pass `keep=true` when testing history.

## State

Done and verified headless:
- all ROM rules listed in the README
- every knob, hover mode, no-fail mode, coordinate mapping, stats and history
- settings round-trip and long bot runs with `render()` every frame
- PNG renders of every scenario were viewed

Verified in Chrome (localhost plus the rAF shim):
- menu, intro, flight, FLY AWAY with the pink sky
- a shot consuming a bullet, the hit icon blinking, a duck behind the tree
- no console errors

Not done: Game C (clay shooting), the round-0 kill screen, and controller-2 duck steering.
