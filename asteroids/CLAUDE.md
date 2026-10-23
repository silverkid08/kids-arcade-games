# Asteroids clone — working notes for Claude

A faithful clone of the 1979 arcade Asteroids (Rev. 2 ROM) in one file, plus the
kid additions required by `../GAME-SPEC.md`: invulnerable mode and difficulty
presets/knobs. The Original preset is meant to be the machine; everything the
knobs do is layered on top of the ROM's own constants.

## Run / verify

```
node tools/launch.js          # or double-click index.html (file://, no network)
node tools/test.js            # headless rules suite - must end "all tests passed"
node tools/render-frame.js    # real frames -> tools/out/title.png, play.png (view with the Read tool)
```

`test.js` and `render-frame.js` pull the JS out of `index.html` by string match
(everything between `<script>` and `</script>`), chop the closing `})();` and
append an export line. If you rename something that the export list in
`tools/test.js` references, update the list.

## Where the numbers come from

- Program ROM: Lonnie McClure's commented disassembly, 6502disassembly.com/va-asteroids
  (saved nowhere locally - it is large; addresses are cited in code comments).
- Vector ROM: computerarcheology.com/Arcade/Asteroids/VectorROM.html, saved as
  `reference/vector-rom-listing.txt` and parsed into `reference/vector-shapes.json`.
- DVG scale semantics: MAME `avgdvg.cpp` (`scale = (global + local) & 15`, vector runs
  `2 << scale` clocks). Hence `dvgScale(nibble)`: 0 = x1, 1 = x2, 15 = x1/2, 14 = x1/4.
  The listing's "(x, y)" numbers are what the DVG draws at global scale 0.
- Sounds: MAME `audio/asteroid.cpp` discrete netlist.

## Units (do not mix them up)

- Positions: 1/8 px, x 0..8191, y 0..6143, **y up**. `objX/objY` convert to canvas.
- Velocities: 1/8 px per frame. Rock velocities are stored unscaled in `rvx/rvy`
  (ROM values 6..31) and multiplied by the speed knob only when moving.
- Ship velocity `vx/vy`: 8.8 fixed point of the above (int part -64..63). Only the
  integer part moves the ship each frame, like the ROM.
- Directions: 0..255, 0 = right, 64 = up. Rotation 3 per frame.
- Hit boxes: quarter pixels (position difference >> 1), see `hits()`.
- Shapes: "listing units" x `dvgScale`. Ship/small rock/small saucer/life icon x1/4,
  medium rock/large saucer x1/2, large rock x1, score text x2, copyright x1.
- Canvas: 1044 x 788 logical (MAME's visible area); DVG (x, y) -> (x + 10, 906 - y).

## Code map (one IIFE in index.html, banner comments mark sections)

| Section | Notes |
|---|---|
| Geometry / `dvgScale` | field size, canvas size, DVG mapping |
| `SHAPES` | embedded by the build step from reference/vector-shapes.json (see below) |
| `THRUST_TBL`, `velX/velY` | ROM sine quarter-wave and `CalcThrustDir` |
| `rnd` / `seedRng` | the ROM's LFSR (`$77B5`); tests seed it |
| `KNOBS`, `PRESETS`, settings | persistence under `asteroids.settings`, `asteroids.high` |
| `Sound` | WebAudio approximations of the seven analogue circuits |
| Game state | `game` object; `ship.status` 0 none/hyperspace, 1 alive, 0xA0.. exploding |
| Rocks | `spawnWaveAsteroids`, `startWave`, `breakAsteroid`, `setAstVel` |
| Ship | `updateShipStatus` (spawn/hyperspace/rotate/thrust/decel), `updateShipFire`, `makeShot` |
| Saucer | `updateSaucer` (every 4th frame), `spawnSaucer`, `saucerAimDir`, `saucerShoot` |
| `updateObjects` | movement, explosion counters, shot timers (ROM `UpdateObjects`) |
| `hitDetection` | the ROM's obj1 x obj2 matrix and box sizes; invulnerable branches here |
| `updateThump` | heartbeat timers |
| `newGame`, `demoField`, `update` | `update()` follows `GameRunningLoop` order |
| Rendering | two-pass glow/core strokes; `drawShip` folds direction into the 17 ROM ships |
| Menu / input / loop / boot | overlay DOM is built in JS; fixed 1/60 accumulator |

## Editing the shapes

`index.html` is self-contained, but the `SHAPES` literal was generated from
`reference/vector-shapes.json`. If a shape needs fixing, fix the JSON and paste the
regenerated literal (any script that `JSON.stringify`s each entry as `{segs: [...]}`
will do); `ThrustDir64` is the one entry corrected by hand (the listing labels it a
word early).

## Gotchas already paid for

- The DVG scale nibble is *signed in effect*: 14 means x1/4, not x16384. Getting
  this wrong makes the ship 1.5x the size of a large rock.
- The ROM's `GetRandNum` can return 0 (only the 16-bit state is kept non-zero).
- Shots are created and then moved in the same frame (ROM order), so a fresh shot
  is 94 + 63 units ahead of the ship, not 94.
- Explosion pitch uses the *shrunken* size (`explodeCode(newSize)`).
- Negative-velocity deceleration overshoots to +1 before reaching 0 (the ROM does
  this too); loops that wait for a stop must test `!== 0`.
- The saucer spawn timer and the saucer fire timer are the same counter in the ROM
  (`ScrTimer`); the code keeps that.
- Collisions do not wrap across screen edges; the ROM subtracts raw positions.
- Large bash heredocs fail in this environment; use the Write tool and small node
  scripts for file surgery.

## Browser automation notes

The Claude-in-Chrome extension refuses `file://` URLs, so for an automated check
serve the folder with a throwaway node static server on a free localhost port and
open that (the game itself needs no server). A tab that is not in the foreground
has its `requestAnimationFrame` frozen by Chrome, so the game only advances while a
screenshot is being taken; drive inputs with `KeyboardEvent`s from the JS tool and
expect to see progress only between screenshots.

## State of the work

Done and verified headlessly: all the rules in README "What's faithful", the four
presets, every knob, invulnerable mode, settings/high-score persistence, pause/menu
flow, thousands of simulated frames with `render()` each frame, PNG snapshots of
the title and gameplay. Not implemented: two players, initials entry, coin text.
