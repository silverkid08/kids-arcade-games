# Space Invaders

A clone of Taito's 1978 arcade **Space Invaders** that runs in Chrome from a
single file, with two additions for kids: an **invulnerable mode** and
**difficulty presets with knobs**. At the "Original" preset it is meant to play
like the real machine on its default DIP settings.

## Play

Double-click `index.html`, or:

```
node tools/launch.js
```

No install, no server, no dependencies, no network.

| | |
|---|---|
| Move | `←` `→` or `A` `D` (touch: left / right third of the screen) |
| Fire | `Space` (also `Enter`, `↑`, `W`; touch: middle third) |
| Pause | `P` |
| Sound | `M` |
| Menu | `Esc` (also from the pause screen) |
| Menu navigation | `↑` `↓` pick a row, `←` `→` change it, `1`-`4` pick a preset, `Enter` / `Space` play |

Sound starts on your first keypress or click (Chrome blocks audio until you
interact with the page).

## Presets and knobs

| | Kid | Easy | Normal | Original |
|---|---|---|---|---|
| Alien step rate | 45% | 70% | 85% | 100% |
| Bomb frequency | 25% | 50% | 75% | 100% |
| Cannon speed | 150% | 125% | 100% | 100% |
| Lives | 9 | 5 | 3 | 3 |
| Starting wave | 1 | 1 | 1 | 1 |
| Extra life | every 1000 | at 1000 | at 1500 | at 1500 |
| Shields | 4 | 4 | 4 | 4 |
| Shield repair | each life | each life | off | off |

Touching any knob turns the preset into **Custom**. The **Invulnerable** toggle
is independent of the presets: with it on, bombs still explode on the cannon
(with a yellow flash) but no ship is lost, and if the rack reaches the ground
the aliens retreat to the wave's starting height instead of ending the game.

Settings and high scores are kept in `localStorage` (`spaceinvaders.settings`,
`spaceinvaders.high.<preset>`); an invulnerable run's best is stored under
`spaceinvaders.high.<preset>.inv` and shown with a `*`, so it never overwrites
the real table.

### Knob semantics

- **Alien step rate**: the arcade advances exactly one alien per frame, so a
  rack of N aliens steps every N frames. The knob scales that advance rate
  (50% = one alien every two frames); it does not change the per-alien model.
- **Bomb frequency**: scales the arcade's score-based reload gap, and below 100%
  adds a pause between bombs (25% = about 1.5 s). "None" disables alien fire.
- **Cannon speed**: 100% is the arcade's 1 pixel per frame.
- **Extra life**: the arcade awards one extra ship, once, at 1500 (or 1000 by
  DIP). "Every N" is a kid-mode addition.
- **Shields / Shield repair**: 4, 2 or 0 bunkers; repair rebuilds them whenever
  a ship is lost (the arcade only rebuilds them at the start of a wave).

## What's faithful (and where the numbers come from)

Everything below was taken from the annotated 8080 disassembly at
[computerarcheology.com/Arcade/SpaceInvaders](https://computerarcheology.com/Arcade/SpaceInvaders/)
(Code, Hardware and RAM Use pages; text copies are in `reference/`), plus the
MAME `invaders.lay` overlay for the colours.

- **Screen**: 224x256 portrait (the 256x224 raster rotated), 60 Hz, 1 bit per
  pixel. The game keeps a real 1-bit framebuffer and every object draws itself
  into it with the ROM's own primitives (write / OR-with-collision / erase), so
  shield erosion, aliens eating shields, collisions and the rack reversal are
  all emergent, exactly as on the board.
- **Art**: every bitmap is the ROM data (addresses in `index.html`): three
  alien types with two frames each (`1C00`-`1C5F`), cannon (`1C60`), the two
  cannon-explosion frames (`1C70`, `1C80`), player shot and its explosion
  (`1C90`, `1C91`), alien explosion (`1CC0`), the squiggly/plunger/rolling bombs
  with 4 frames each (`1CD0`, `1CE2`, `1CEE`), bomb explosion (`1CDC`), the
  22x16 shield (`1D20`), saucer and saucer explosion (`1D64`, `1D7C`), and the
  character set (`1E00`). A sprite-rip download was attempted first
  (spriters-resource returns 403 to non-browsers), but the ROM bytes are the
  better source anyway.
- **Rack**: 5 rows x 11 = 55 aliens in 16x16 cells; bottom two rows octopus
  (10 pts), middle two crab (20), top squid (30) (`AlienScores` at `1DA0`).
  Reference (bottom-left) alien starts at Xr `0x38`, Yr `0x78`; one alien is
  advanced and redrawn per frame; the reference moves 2 px per pass (3 px to
  the right when one alien is left); hitting a drawn pixel in screen column 9
  or 213 reverses the rack and queues an 8 px drop (`RackBump`). Waves 2-9
  start at Yr `60,50,48,48,48,40,40,40` and the table repeats
  (`AlienStartTable`). An alien reaching Yr < `0x28` (the cannon's row) ends
  the game regardless of lives.
- **Cannon**: appears 128 frames after the start of each life, moves 1 px per
  frame between Xr `0x30` and `0xD9`, one shot at a time, 4 px per frame, fire
  must be released between shots. Kill freezes the rack for the 16-frame
  explosion. Death: 12 sprite changes x 5 frames, then the 128-frame wait with
  the rack frozen; 48 more frames before aliens may fire again.
- **Bombs**: three objects (rolling tracks the player's column, plunger and
  squiggly follow the `1D00` column table), each moving 4 px every 3 frames
  (5 px with fewer than 9 aliens), sharing the arcade's reload gate keyed to
  the score (`<300: 0x30, <1100: 0x10, <2100: 0x0B, <3100: 8, else 7` steps);
  the plunger stops when one alien remains; the squiggly and saucer share an
  object so they never overlap.
- **Mystery ship**: appears every `0x600` = 1536 frames (25.6 s) once the rack
  has dropped below the wave-1 height, only with 8+ aliens, from the side set
  by the player's shot count parity, 2 px every 3 frames at Yr `0xD0`. Score is
  the `1D54` table indexed by the number of player shots that have ended, mod
  15 (the code wraps one entry early), so 300 lands on the 8th, 23rd, 38th ...
  shot and the others give 50/100/150.
- **Lives / bonus**: 3 ships (DIP), one extra at 1500 (DIP), reserve ships
  drawn bottom-left, "CREDIT 00" bottom-right, score header and the 4-digit
  scores at the ROM's screen addresses.
- **Fleet sound**: the four-note loop changes every N frames from the
  `1A11/1A21` table (52 frames with 50+ aliens down to 5 with one left).
- **Colour overlay**: red band for the mystery ship, green over the shields,
  cannon and reserve ships (MAME `invaders.lay`). Aliens that descend into the
  green band turn green, as on the cabinet.

### Deviations and shortfalls

- Sounds are WebAudio approximations of the analogue circuits (the four bass
  notes, shot, explosions and saucer warble are synthesised, not sampled).
- The score does not roll over at 10000 (the arcade's 4-digit BCD counter
  does); five digits are shown instead. The HI-SCORE updates at game over,
  like the arcade.
- Single player only: no two-player alternation, no attract-mode animations
  (the "upside-down Y" and "C" gags), no coin/credit handling, no TILT.
- The arcade's exact interrupt interleaving (mid-screen vs end-of-screen) is
  reduced to its effective per-frame rates; the three bombs are staggered over
  consecutive frames rather than the original's sync scheme.
- A grid lookup that falls outside the rack counts as a miss; the arcade's
  `CodeBug1` (a shot in your own shield killing a far-away alien when the
  rack is far right) is not reproduced.
- Reserve ship icons are capped at 6 so they never overlap the credit text.

## Stages

Every wave is implemented: the rack, shields and cannon are the same each
time and only the starting height changes, following the arcade's 8-entry
table which repeats forever (wave 10 starts where wave 2 did).

## Verification

```
node tools/test.js                 # 125 headless checks, must end "all tests passed"
node tools/render-frame.js play    # writes tools/out/play.png of what the canvas shows
```

The test suite runs the real game under a DOM stub, including `render()` every
frame, and asserts the rack stepping period, bump positions, cannon and shot
speeds, scoring per row, saucer timing and score table, bomb speed and the
one-at-a-time rule, shield erosion by bombs and by aliens, the death sequence,
invasion, extra ships, wave heights, every knob, invulnerability, settings and
high-score persistence, and a long random soak.

## Repository

```
index.html          the whole game
README.md           this file
CLAUDE.md           orientation notes for future work
reference/          the disassembly pages (text) and MAME overlay used as sources
tools/
  test.js           headless logic suite
  harness.js        DOM / canvas / audio stubs so the game runs under node
  build.js          extracts the game from index.html and exposes its internals
  render-frame.js   renders a frame to PNG for eyeballing
  png.js            dependency-free PNG decode/encode
  launch.js         opens index.html in Chrome
```
