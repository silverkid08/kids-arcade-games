# Asteroids

A clone of Atari's 1979 vector arcade game *Asteroids* that runs in Chrome from a
single file, with two additions for kids: an **invulnerable mode** and a set of
**difficulty presets and knobs**. At the **Original** preset it plays by the Rev. 2
ROM's rules, numbers and timings, and every shape on screen is the arcade's own
vector data.

## Play

Double-click `index.html`, or:

```
node tools/launch.js
```

No install, no server, no network.

| | |
|---|---|
| Rotate | `←` `→` or `A` `D` |
| Thrust | `↑` or `W` |
| Fire | `Space` (or `Enter`) - one shot per press, four on screen, like the arcade |
| Hyperspace | `↓`, `S` or `Shift` |
| Pause | `P` |
| Sound | `M` |
| Menu | `Esc` (from play or pause; abandons the game) |
| Menu keys | `1`-`4` pick a preset, `↑` `↓` choose a knob, `←` `→` change it, `I` toggles invulnerable, `Space`/`Enter` play |

Sound starts on your first key press or click (Chrome blocks audio until you
interact with the page).

## Presets and knobs

| | Kid | Easy | Normal | Original |
|---|---|---|---|---|
| Asteroid speed | 45% | 75% | 100% | 100% |
| Starting rocks | 2 | 3 | 4 | 4 |
| Saucer frequency | 25% | 60% | 100% | 100% |
| Saucer accuracy | 20% | 50% | 80% | 100% |
| Ship drag | 8 | 3 | 1 (arcade) | 1 (arcade) |
| Ships | 9 | 5 | 4 | 3 |
| Extra ship every | 5,000 | 5,000 | 10,000 | 10,000 |
| Safe hyperspace | on | on | off | off |

Touching any knob turns the preset into **Custom**; the Original preset itself
never changes. **Invulnerable** (toggle, off by default) means the ship cannot be
lost: rocks, saucers and saucer shots pass straight through it with a flash of the
ship-explosion fragments, and hyperspace never fails. A badge shows while it is on.

Settings persist in `localStorage` under `asteroids.settings`. Best scores are kept
per preset under `asteroids.high`; a best set with invulnerable on is stored under
its own key (`<preset>.inv`) and shown with a `*`, so it never overwrites a real score.

## What's faithful (Original preset)

All numbers below come from Lonnie McClure's commented disassembly of the Rev. 2
program ROM (<https://6502disassembly.com/va-asteroids/>) and the Computer
Archeology vector-ROM listing (<https://computerarcheology.com/Arcade/Asteroids/>),
with the DVG scale semantics checked against MAME's `avgdvg.cpp` and the sound
circuits against MAME's `audio/asteroid.cpp`. ROM addresses are quoted so they can
be re-checked.

**Field and timing.** 60 frames per second. Positions are kept in the arcade's
1/8-pixel units on a 1024 x 768 field that wraps on all four edges; the canvas is
MAME's 1044 x 788 visible area (10 px of overscan) and scales to fit the window.

**Ship** (`$7086`-`$7138`). Rotates 3 units per frame out of 256 (a full turn in
86 frames, 1.43 s). Velocity is 8.8 fixed point, updated every other frame: thrust
adds 2 x the sine-table value (`$57B9`, 0..127) along the heading; the integer
part is clamped to -64..63 (7.9 px per frame). Without thrust the arcade's
deceleration is applied exactly (`V -= 2*int(V) + 1` every other frame), which is
why the ship coasts for over 20 seconds from full speed. 4 shots on screen; a shot
is half the heading vector (63) plus the ship's velocity, capped at 111, spawned
3/4 of a heading vector out, and lives 18 ticks of 4 frames (`$6CFD`). The fire
button only fires on a fresh press (shift register at `$6CDB`). Hyperspace
(`$6E74`) hides the ship for 48 frames and lands at a random spot in the inner
area; 8 in 32 jumps roll the "danger" branch, and the jump is fatal when
`(r & 7) * 2 + 4 >= number of rocks`, so hyperspace is more dangerous when few
rocks are left. The ship is drawn with the 17 pre-rotated ROM ships (`$5290`)
mirrored into the other quadrants, exactly as `UpdateShipDraw` (`$750B`) does, and
the thrust flame flickers on 4 frames / off 4 frames.

**Rocks** (`$7168`, `$7203`, `$75EC`). Wave 1 has 4, then +2 per wave to a cap of
11; the next wave starts 127 frames after the last rock's explosion ends, and
never while a saucer is on screen. Each rock's velocity component is the parent's
plus a random -16..15, clamped to 6..31 (1/8 px per frame), so pieces do not get
systematically faster, only more varied. Large rocks split into two medium, medium
into two small; 20 / 50 / 100 points; 27 slots total (the arcade's maximum of 27,
exploding rocks included). The hit box is 132 / 72 / 42 quarter-pixels, with the
arcade's `|dx| + |dy| < 1.5 x box` cut that rounds the corners (`$6A55`), and no
collisions across the screen wrap. Ramming a rock kills the ship and still scores.
Explosions are the four shrapnel dot patterns stepping through the DVG scales over
96 frames; the ship's explosion is the six ROM line fragments drifting apart for
192 frames, vanishing one at a time.

**Saucers** (`$6B93`-`$6CD6`). Spawn timer 146 ticks of 4 frames at game start
(127 at each wave start), running only while the ship is alive; every spawn shortens
the reload by 6 ticks down to 32. After a rock is hit, a saucer is held back for
320 frames unless fewer than the "speed-up" count of rocks remain (5, +1 per wave,
max 11) - the anti-lurking rule. Large while the reload is 128 or more; above
30,000 points always small; otherwise small with probability `1 - reload/512`.
Moves at 2 px per frame, changes vertical drift every 128 frames, leaves when it
reaches the far edge, fires every 40 frames with 2 shots on screen. The large
saucer fires at random; the small one leads the ship by half its own velocity,
aims through the wrap when the ship is more than half a screen away, then jitters
+-16 units (+-8 once the score passes 35,000). 200 / 1000 points (the ROM's `$99`
plus the carry bit). Hit boxes 42 / 72 for shots, 61 / 79 against the ship.

**Score and lives.** 3 ships (DIP default, `$6EDD`; the CAGDC/Twin Galaxies
settings sheet also lists 3). The score is four BCD digits with a fixed trailing
zero, so it wraps at 99,990 and an extra ship is awarded every 10,000 (`$73A4`).
The HUD is laid out at the ROM's beam coordinates: score at (100, 876) at twice
the font size, reserve ships at (160, 852), high score at (480, 876), the
`(c) 1979 ATARI INC` line at (400, 128), `PLAYER 1` for 128 frames, `GAME OVER` at
(400, 628), `PUSH START` blinking on the menu.

**Heartbeat.** Thump on 4 frames, off 48 frames at a wave's start, the off time
shrinking by one every 64 frames to a floor of 8; two alternating tones. The
explosion, fire, saucer, thrust and extra-ship sounds are synthesised in WebAudio
from the component values in MAME's discrete netlist (sweep rates, warble rates,
filter corners, the 12 kHz sample-and-hold noise, the 3 kHz extra-ship beeper).
The exact pitches of the two thump tones are not documented and were tuned by ear.

## What's not

- The analogue sounds are approximations of the circuits, not samples of them.
- No two-player mode, no high-score initials entry, no coin/credit attract text;
  the menu replaces those. The attract-mode rock field and `PUSH START` are kept.
- The vector monitor's glow is a two-pass canvas stroke; lines are anti-aliased by
  the canvas (no `image-rendering: pixelated`, this is not a raster game).
- The small saucer's aim uses `atan2` instead of the ROM's 16-entry angle table;
  the difference is below the table's own 2-unit quantisation.

## Repository

```
index.html                   the whole game (markup, CSS, one IIFE, embedded vector tables)
reference/
  vector-shapes.json         every ROM shape used, in DVG listing units
  vector-rom-listing.txt     the Computer Archeology vector ROM listing they were parsed from
tools/
  test.js                    headless rules suite (node tools/test.js)
  harness.js                 DOM / canvas / audio stubs; the canvas records strokes
  render-frame.js            renders real frames to tools/out/*.png without a browser
  png.js                     dependency-free PNG encode/decode
  launch.js                  opens index.html in Chrome
CLAUDE.md                    orientation notes for future work
```

Checks:

```
node tools/test.js            # must end "all tests passed"
node tools/render-frame.js    # writes tools/out/title.png and play.png
```
