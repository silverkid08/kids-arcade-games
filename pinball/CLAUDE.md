# Pinball clone: working notes for Claude

This is a clone of NES Pinball (1984) in a single `index.html`. It follows `../GAME-SPEC.md`. The rules and players' view are in `README.md`; this file is the code map.

## Run and verify

```
node tools/launch.js                  # open in Chrome
node tools/test.js                    # must end "all tests passed" (~25 s); "quick" = smaller fuzz
VERBOSE=1 node tools/test.js          # prints every check
node tools/render-frame.js colliders  # then Read tools/out/colliders.png
node tools/rom-measure.js             # physics numbers measured from the real ROM
node tools/serve.js                   # http://localhost:8737/shim.html for Chrome checks
```

`render-frame.js` scenarios: `title`, `plunger`, `upper`, `lower`, `colliders`, `features`, `slots`, `bonus`, `kid`.

`tools/build.js` cuts the IIFE out of `index.html` and appends `globalThis.__PB` with the internals. If a test needs another function, add it there.

For Chrome checks:
- the extension refuses `file://`;
- automation tabs get no `requestAnimationFrame`, hence the Worker shim served by `serve.js`;
- `element.click()` and dispatched `KeyboardEvent`s from `javascript_tool` drive the page.

## The ROM pipeline (offline tools, nothing ships)

- `reference/disasm/pinball.asm` is the public disassembly. Every line carries its address and bytes.
- `tools/rom.js` rebuilds the 16 KB PRG and 8 KB CHR in memory and checks the CRCs. The listing is 4 zero bytes short of 8 KB of CHR, so they are padded.
- `tools/nes.js` is a 6502 core (`cpu6502.js`, copied from `../dr-mario`) plus NROM, horizontal mirroring, and register-level PPU/APU logging.
- `tools/ppu-render.js` draws what the emulator captured.

Useful RAM:

| Address | Meaning |
|---|---|
| `$16.$15`, `$18.$17` | ball X, Y (8.8 fixed point); the centre is +0.5 |
| `$BF` | screen: 0 upper, 1 lower, 2 bonus |
| `$0118`-`$011A` | slot symbols: 0 penguin, 1 three, 2 seven |
| `$0127` | spinning bits |
| `$0128` | cards |
| `$0130`, `$0131` | flags (upper, lower) |
| `$0132` | seal bounces |
| `$012D`-`$012F` | eggs |
| `$0129`, `$012A` | stoppers |
| `$012B` | exit |
| `$D0` | lane lights |
| `$F0` | up-post |
| `$0155` | table colour |
| `$EE` | slot-target x |

Sound requests are `$FF`, `$FE` and `$FD`, one bit each; the names in `extract-audio.js` follow the call sites.

There is a `place(x, y)` poke in the tools: it zeroes `$0A`-`$0D` and `$19`/`$1A`, which drops the ball at rest. The ROM's velocity representation was not decoded; only drop-from-rest probes are reliable.

## Generated data (do not hand-edit the blocks in index.html)

| Block in `index.html` | Rebuilt by | Writes |
|---|---|---|
| `/*ART-BEGIN*/ ... /*ART-END*/` | `node tools/extract-art.js` | `reference/art.gen.js` |
| `/*SOUNDS-BEGIN*/ ... /*SOUNDS-END*/` | `node tools/extract-audio.js` | `reference/audio.gen.js` |
| `/*WALLS-BEGIN*/ ... /*WALLS-END*/` | `node tools/trace.js` | `reference/colliders.gen.js` |

- **ART** holds the CHR, the NES palette, and `nt`/`pal`/`ctrl` for `title`, `upper`, `lower` and `bonus`, plus `cards` (the face-up tile patches).
- **SOUNDS**: per sound, `len` and per-frame RLE channel lists. `sq1`/`sq2`/`noise` are `[frames, a, b, c]`; `tri` is `[frames, hz, on]`.
- **WALLS** are segments in scene-local coordinates. The tracer's `CONFIG` lists the decoration rectangles that are not walls (labels, arrows, the bumpers, which get circles, the cards and the striker box). It also writes `tools/out/trace-*.png`.

After any extractor, run `node tools/inject.js`.

Sprite layouts (flipper poses, Mario, Pauline, seals, slots, spring) are constant tables in `index.html`, copied from OAM captures. The comments there name the ROM routine.

## Model

- **World.** Scenes A and B form one world 480 px high: A is y 0-239, B is y 240-479. The screen shown is the one holding the ball. The bonus stage is its own world (`BONUSW`).
- **Time.** A "tick" is one ROM ball step. Each frame advances `TICKS[game] × speed%` ticks, sub-stepped so that the ball moves at most 1.5 px per sub-step. Flipper swings are defined in ticks, so the speed knob slows everything consistently.
- **Collision.**
  - `World` has segments (`r` = capsule radius) and circles, with a 16 px grid.
  - `earliestHit` does swept-circle continuous collision. One-way colliders (`oneWay: [dx, dy]`) are skipped when moving in their allowed direction.
  - `respond()` reflects with `e` and applies `kick`: bumpers use max(e·vn, kick); slingshots add kick. Friction applies only on impacts.
  - `depenetrate()` is a safety net.
- **Flippers.** `flipperContacts` is a discrete overlap check per sub-step against a tapered capsule (pivot r 5, tip r 2, length 26 × size%). It pushes the ball out and gives surface velocity ω × (contact + 14 px along the blade) × strength%. `FL.down` is 25° and `FL.up` -24°. The three art poses are picked from the angle.
- **Hit zones.** `sensors()` handles everything the ball passes over: chutes, the right lane, lane lights, flags, targets, eggs, card lanes, side lanes, the hole kicker and the bonus hole. `bonusSensors()` handles the lamps.
- **Ball states.**

  | State | Meaning |
  |---|---|
  | `plunger` | resting on the striker |
  | `play` | in play |
  | `kicker` | held in the scene A hole |
  | `hole` | shrinking into the scene B hole |
  | `emerge` | coming out of the bonus hole |
  | `gone` | off the table |

  `ballLost()` applies the ball saver, then invulnerable, then decrements; `resetBallState()` is the ROM's `$C06C`.
- **Rendering.** Software into a 256x240 `Uint32Array`. Each screen's background is cached and re-rendered only when its live nametable or palette changes (`setTile`, `setAttrQuad`, `applyPalettes`). The HUD digits are written into the nametable. Messages go in the HUD column, so the table stays as on the NES.

## Gotchas already paid for

- The scene A "posts" at the top corners are **one-way flaps**. A ball rolling back right rests against the top-right one in the ROM.
- The right-lane flap turns the ball **left**; it is solid only against balls moving up into the lane.
- Lots of things are not solid in the ROM: cards, eggs, seals, penguins, and the flag and target columns. Making them solid creates resting spots the original never has.
- The kicker hold is 240 ticks (80 frames in A, 60 in B). Its eject is the same per tick in both games.
- The test bot must let go of a cradled ball; the game's auto-shove (5 s stationary) skips cradles.
- `loadSettings` only accepts values in a knob's `vals`. A preset value missing from `vals` silently reverts; this happened to speed 75.

## State

Done and verified headless: everything listed under Verification in the README.

Verified in Chrome: the menu, play, flipper input, feature graphics, and no console errors.

Not done: 2-player games, the attract demo, decoding the ROM's own collision and velocity routines (the physics are fitted, not transcribed).
