# Frogger

A clone of the 1981 Konami/Sega arcade **Frogger** that runs in Chrome from a
single file, with two additions for kids: an **invulnerable mode** and
**difficulty presets with knobs**. The "Original" preset follows the arcade
ROM's own tables for lane layouts and lane speeds.

## Play

Double-click `index.html`, or:

```
node tools/launch.js
```

No install, no server, no network. Sound starts on your first key press or
click (Chrome's autoplay rule).

| | |
|---|---|
| Hop | Arrow keys or WASD (one hop per press, like the arcade); swipe or tap on touch |
| Pause | `P` (or Space / Enter during play) |
| Sound | `M` |
| Menu | `Esc` |
| Presets | `1`-`4` on the menu, or click KID / EASY / NORMAL / ORIGINAL |
| Invulnerable | `I` on the menu, or the toggle button |
| Start | Space / Enter / PLAY |

Get a frog from the sidewalk at the bottom across five lanes of traffic, over
the median, across five lanes of river on logs, turtles and crocodile backs,
and into one of the five home bays at the top. Fill all five bays to clear the
level.

## Presets and knobs

| Knob | Kid | Easy | Normal | Original |
|---|---|---|---|---|
| Traffic speed | 50% | 75% | 100% | 100% |
| River speed | 60% | 80% | 100% | 100% |
| Timer | off | 60 s | 45 s | 32 s (arcade: 60 ticks of 32 frames) |
| Turtles dive | off | on | on | on |
| Vehicles | 50% | 75% | 100% | 100% |
| Lives | 5 | 5 | 3 | 3 (DIP default; the DIP offers 3/5/7/256) |
| Start level | 1 | 1 | 1 | 1 |
| Extra life at | 10000 | 10000 | 20000 | 20000 |

Touching any knob turns the preset display into CUSTOM. The Original values
never change. **Invulnerable** is a separate toggle: the frog still gets
visibly squashed or splashes, but it just blinks and carries on (from the
median if it was in the river); the clock just restarts when it runs out.
A badge on screen shows when it is on, and its high scores are kept under
their own key (shown with `*`) so they never overwrite the real table.

Settings and high scores (one per preset, plus one per preset for
invulnerable runs) live in `localStorage` under `frogger.settings`,
`frogger.high.<preset>` and `frogger.high.<preset>.invuln`.

## What's faithful (and where the numbers come from)

The screen is the arcade's 224x256 portrait raster at 60 Hz on a 16px grid:
home bays at y=32, five river lanes 48..112, the median at 128, five road
lanes 144..208, the sidewalk at 224 and the status row at 240. The frog's
columns are offset half a cell from the lane grid (x = 8 + 16k), so the home
bays sit at x = 8, 56, 104, 152, 200 and the frog starts at x=104, exactly as
the ROM places them.

Numbers taken from Karl Stiefvater's main-board disassembly hosted at
[computerarcheology.com/Arcade/Frogger](https://www.computerarcheology.com/Arcade/Frogger/)
(the text is saved in `reference/ca/`; `tools/romdata.js` pulls byte ranges
out of it):

- **Lane layouts, five difficulty tiers** (ROM `0x2260`-`0x230E`): for each
  of the eleven lane "arms" a triple of gap cells, object width in 8px cells
  and object count. Level 1 is 3 medium logs / 4 turtle pairs / 2 long logs /
  3 short logs / 4 turtle triples on the river and 2 trucks / 1 racing car /
  3 purple cars / 3 bulldozers / 3 yellow cars on the road; level 2 adds a
  third truck and a second racer, and so on. The tier index is
  `(level-1) mod 5` and wraps, as in the ROM (`0x0601`).
- **Lane speeds** (ROM `0x186B`, the lane-control ring): ten frames of eleven
  control bytes, stepped every 22 vblanks; the low nibble is pixels per frame,
  or with bit 4 set, one pixel every N frames. The game runs that ring
  byte-for-byte, so the racing car averages 1.47 px/frame, trucks 0.61, yellow
  cars 0.37, logs 0.42-0.55 and turtles 0.62-0.65. Directions (right for arms
  0/2/3/7/9, left for 1/4/6/8/10) are the ROM's mover table at `0x14C7`.
- **Hop**: 8 frames of 2px (`FROG_HOP_*_ANIM_RELOAD = 9`, step 2), one hop
  per joystick press, no sideways hops from the home row, and the frog is
  resolved against a lane only when it is within 8px of that lane's top edge
  (`0x11D0`), which is why a hop halfway into open water drowns.
- **Timer**: 60 ticks of 32 frames (`0x0AE2: LD HL,$3C20`), bonus figure 60,
  low-time warning at 10, drawn as a bar of 2px per tick.
- **Scoring** (`0x1FD6` and friends): 10 per new forward row *except the
  median row, which pays nothing* (100 maximum per crossing), 50 per home,
  200 for the fly, 200 for escorting the lady frog, 10 per remaining timer
  tick, 1000 for filling all five bays, extra life once per game at 20,000
  (`0x2E08`). Lives DIP 3/5/7/256 (`0x2E00`), default 3.
- **Deaths**: 16 frames per death sprite (`0x171F`), 4 sprites for a squash
  and for a drowning, then the frog respawns.
- **Home bays**: the fly and the alligator share one slot machine driven by a
  256-frame counter: fly visible for 112 frames, gator emerging to 80 and
  fully out to 176; odd levels get the fly, even levels the gator (`0x1A77`).
- **Hazards by level**: a crocodile swims in the top log lane from level 2
  (`0x28C4`); snakes and otters (and the lady frog) from level 3, with spawn
  probability `(level*8+128)/256` per attempt and a second drifting creature
  from level 6 (`0x2970`-`0x29A1`, `0x2A6A`). Where the creatures go
  (snake on the median, later on the long logs; otter in the turtle lanes;
  lady frog on a long log) and their speeds follow play descriptions rather
  than the ROM, which does not spell them out.
- **Music**: the intro ("Inu no Omawarisan", 3 voices) and the in-play theme
  ("Araiguma Rascal", 2 voices), the level-complete, extra-life and game-over
  tunes are the arcade's note data from the same site's sound-ROM dig, played
  a half step low exactly like the machine (its off-by-one note table).
  Synthesised with WebAudio square waves; the hop chirp, splat, splash and the
  home jingle are approximations.

Other sources used for the general rules: [Wikipedia](https://en.wikipedia.org/wiki/Frogger)
(scoring, timer, DIP lives, bonus frog at 20,000),
[arcade-history.com](https://www.arcade-history.com/game/879/frogger-model-gx392)
(lane directions, snake from level 3, per-home scoring),
and the excamera.com Gameduino Frogger tutorial (lane y positions and the
hop animation table).

### Stages

All five arcade difficulty tiers are implemented from the ROM table, so
levels 1-5 are the arcade's layouts. From level 6 the layouts loop (as in the
arcade) while the creature density and the second drifting creature keep
scaling with the level counter. There is no attract-mode demo and no
initials entry for the high-score table.

### Known shortfalls

- Lane objects start the board at a fixed phase (object 0 at ring position 0
  plus a random scroll) rather than the ROM's seeded phases.
- The snake/otter/lady-frog movement patterns and the turtle dive cycle
  (300 frames up, 150 down) are plausible rather than disassembled.
- The ROM holds eleven further lane-control frames after the ten the game
  uses; nothing in the lifted code references them, so they are not used.
- The croc's closed mouth is drawn by covering the jaws, not with a separate
  arcade tile.
- Home jingle: the arcade has 20 variations; one short synthesised fanfare
  stands in for them.

## Art

Every sprite is the genuine arcade bitmap. `reference/frogger1-img1.png` is
GaryCXJk's "Frogger arcade version" rip (768x704; downloaded from the
excamera.com Gameduino Frogger tutorial page, which embeds it), with
`reference/frogger1-img3.png` the 16x16-cell cut of it and
`reference/frogger1-img2.png` the 224x256 arcade background screen.
`tools/art.js` decodes those PNGs, writes the 100 sprite cells, the
background (rows 24..239, run-length encoded) and the 8x8 character-ROM font
as palette-indexed strings into `index.html` between the `ART-BEGIN` /
`ART-END` markers. The 15-colour palette is the rip's. spriters-resource.com
could not be fetched (Cloudflare), so this rip is the source of truth.

## Repository

```
index.html             the whole game
README.md              this file
CLAUDE.md              orientation notes for future work
reference/             the sprite rip, the arcade background, the disassembly text, song data
tools/test.js          headless logic suite (node tools/test.js -> "all tests passed")
tools/harness.js       DOM/canvas/audio stubs with a small software canvas
tools/load-game.js     loads index.html's script under the harness
tools/render-frame.js  renders menu/play/level-3 frames to tools/out/*.png
tools/art.js           regenerates the embedded art block from reference/
tools/romdata.js       hex dumps from the disassembly text
tools/sheet.js         ASCII dump of a PNG region (for reading sprite sheets)
tools/png.js           dependency-free PNG decode/encode
tools/launch.js        opens the game in Chrome
```

Checks:

```
node tools/test.js            # game logic, runs headlessly under node (121 checks)
node tools/render-frame.js    # then look at tools/out/*-3x.png
```

Verified in Chrome (served from localhost because the browser extension
refuses file:// URLs; the file itself needs no server): title screen, preset
and knob buttons, PLAY, the READY frame with the arcade art, a clean console
and settings persisted. Hopping, deaths, homes, levels and the knobs are
verified by the headless suite and the rendered frames.
