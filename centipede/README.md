# Centipede (Atari, 1981) for kids

A clone of Atari's arcade Centipede that you play with the **mouse** instead of the
trackball. It doubles as mouse-skills practice. Open `index.html` in Chrome
(double-click it, or run `node tools/launch.js`). It runs from `file://` with no
network and nothing to install.

## Controls

| Input | Action |
|---|---|
| Mouse move | steer the shooter (default **POINTER** mode: the shooter follows the pointer inside the player area at the arcade's top speed; above the area it stays on the top line, and a small grey cross shows where the pointer is) |
| Hold left button / tap | fire. As on the arcade, holding the button auto-fires: a new shot leaves as soon as the old one is gone. Only one shot is on screen at a time. |
| Space / Enter | fire (hold) |
| Arrows / WASD | move like the arcade's joystick option: speed ramps up to 3 px a frame |
| P | pause |
| M | sound on/off |
| Esc | menu (pauses; RESUME continues, PLAY restarts) |
| Menu | ↑↓ choose a row, ←→ change it, 1-4 pick a preset, Enter plays. Everything can be clicked too. |

**TRACKBALL LOCK** mode uses the Pointer Lock API: the mouse cursor disappears and
mouse movement is fed in as trackball counts (2 counts per screen pixel, scaled by
TRACKBALL SENSITIVITY), limited per frame exactly like the arcade's TBLMT routine. Esc
releases the lock and pauses. Clicking the game takes the lock back.

After a game over with a score that makes the table you get the arcade's
**GREAT SCORE / ENTER YOUR INITIALS** screen: roll the mouse left/right to pick a
letter and click to accept it (or just type the letters).

## Presets and options

**Original** is the arcade with MAME's default DIP switches: 3 lives, bonus every
12,000, difficulty Easy. Changing any option after picking a preset shows **CUSTOM**.
Mouse mode, sensitivity and INVULNERABLE are not part of any preset.

| Option | Original | Kid | Easy | Normal | What it does |
|---|---|---|---|---|---|
| Centipede speed | 100% | 40% | 65% | 85% | Fraction of frames the centipede moves on. Slow/fast waves still alternate. |
| Shooter speed | 100% | 200% | 150% | 125% | 100% = 4 px a frame, the arcade's trackball limit. |
| Centipede length | 12 | 8 | 10 | 12 | Total segments, including the separate heads of later waves and the new heads from the sides. |
| Spider | on | 25% | 50% | 75% | Off, or how often (scales the off-screen wait). |
| Flea | on | off | 50% | 75% | Off; below 100% there is a pause after each flea; 150/200% lets it come with 2/4 more mushrooms left. |
| Scorpion | on | off | 50% | 75% | Off, or the chance of entering at each 256-frame check. |
| Mushrooms | 100% | 50% | 75% | 100% | Starting field (the arcade places 46). |
| Shot speed | 100% | 150% | 100% | 100% | 100% = 7 px a frame. |
| Auto-fire | on | on | on | on | Off: one shot per click. |
| Starting lives | 3 | 9 | 5 | 4 | 1-9. At most 6 reserve guns are shown, and extra lives stop at 6, as on the arcade. |
| Starting wave | 1 | 1 | 1 | 1 | 1-16, with that wave's length, speed and colours. |
| Extra life every | 12,000 | 5,000 | 10,000 | 10,000 | Never, 5,000, 8,000 or the arcade's 10,000 / 12,000 / 15,000 / 20,000. |
| Arcade difficulty | Easy | Easy | Easy | Easy | The arcade's DIP switch. Hard brings the fast spider in at 1,000 instead of 5,000 and changes how often it turns. |
| Invulnerable | off | | | | The gun cannot die. A hit makes the gun flash white with a small bonk sound. Spiders and fleas pass through. A centipede head that reaches the gun bounces off it as if it were a mushroom. An **INVULNERABLE** badge sits on the bottom row. |

High scores are an 8-entry table (score + initials) for each preset, seeded with
the arcade's own default table (16543 EJD ...). Games played with INVULNERABLE on
go into a separate table for that preset, so they never overwrite the real one.
The menu marks those scores with `*`. Settings and tables live in
`localStorage` under `centipede.*`. The game still works if storage is blocked.

## What is faithful

The game logic is a routine-by-routine port of **Atari's original 6502 source for
revision 4** (`CENTI4.MAC`, `CENIR4.MAC`, `CENDE4.MAC` by Ed Logg and Dona Bailey),
published at <https://github.com/historicalsource/centipede>. A copy is in
`reference/src/`. Revision 4 is the ROM set MAME calls `centiped`: the CRCs of the
program ROMs 136001-407..410 in that repo match MAME's exactly
(`reference/mame/centiped.cpp`). The arcade's own variable and routine names are
used throughout `index.html`.

- **Screen:** 240x256 portrait at 60 Hz, a 30x32 grid of 8x8 stamps. Drawn the way
  MAME draws the board: an unrotated 256x240 picture turned ROT270, with motion
  objects clipped out of the score row. The player area is V 8..$30 (the bottom six
  rows). The very bottom row is empty during play, as on the arcade.
- **Gun:** at most 8 trackball counts a frame (4 px), with half-pixel fractions
  (TBLMT). Mushrooms block it. The shot moves 7 px a frame, and only one is in
  flight.
- **Centipede:** wave 1 is a 12-segment fast centipede (1 px a frame is slow, 2 is
  fast). Segments turn down a row when they hit a mushroom, the edge or another
  segment, then reverse. In the player area they bounce between the bottom row and
  V=$30. A shot segment becomes a mushroom one tile ahead of where it was going,
  and the segment behind it becomes a head. When a big centipede reaches the bottom
  it lets its tail go as a new head. Once any head has reached the bottom, new fast
  heads enter from the sides at V=$40. The interval starts at 192 frames, drops by
  8 per head down to 88, and drops by about 2 more every 10,000 points (decimal-mode
  quirk included). The last head speeds up. Poisoned mushrooms send a head diving
  straight down until it reaches the bottom or is shot.
- **Waves:** each cleared wave toggles slow/fast and, after each fast wave, the main
  centipede loses a body segment (12f, 11s, 11f, 10s, 10f ...). The missing segments
  enter as separate heads. From 40,000 points only fast waves come, so every wave is
  shorter. After the all-heads wave it starts again at 12. Each wave moves to the
  next of the 14 colour-RAM palettes in the ROM's CLRCH table.
- **Flea:** never in the first wave. It drops when 5 or fewer mushrooms are in the
  lower 12 rows (9 or fewer from 20,000; more from 120,000). It falls 2 px a frame,
  3 px from 60,000. It drops a mushroom on 1/4 of every 4th frame. The first hit
  speeds it up to 4 px a frame, and the second hit scores 200.
- **Spider:** waits 96 frames off screen, then enters from a random side. It is slow
  below 5,000 (Easy). It zigzags in the bottom rows, and its upper limit comes down
  from 60,000. It eats mushrooms. It scores 300 / 600 / 900 by vertical distance to
  the gun (≥$40 / ≥$16 / closer). The points stay on screen for about 2 seconds.
- **Scorpion:** checked every 256 frames once the centipede is 10 or shorter (wave
  4), with a 1-in-4 chance. It crosses the upper half of the screen, faster from
  20,000, and poisons every mushroom it walks over. It scores 1000.
- **Scoring:** head 100, body 10, mushroom 1 (4 hits, poisoned ones too), flea 200,
  scorpion 1000, spider 300/600/900. There is an extra life every 12,000, with at
  most 6 in reserve. After a death the gun explodes. Then every damaged or poisoned
  mushroom is restored one at a time, with a little explosion, for 5 points each.
  Then the wave's centipede starts again from the top.
- **Sound:** the arcade's SOUNDS routine runs every frame and writes POKEY registers
  from the ROM's tables. A POKEY emulator (1.512 MHz clock, 4/5/17-bit polynomial
  counters, AUDCTL $20 so channel 3 runs on the fast clock) plays them. This gives
  the "little feet" march, spider warble, flea whistle (its pitch follows its
  height), scorpion tune, shot, explosions, the player explosion and the extra-life
  chime. The attract mode is silent, as on the arcade.
- **Attract mode** runs behind the menu. The gun wanders and fires by itself, and the
  screen shows the high score table, BONUS EVERY 12000 and ©1980 ATARI, all written
  into the playfield as the arcade does. The centipede bumps into the text.

## What is approximate or missing

- **Random numbers:** the arcade reads POKEY's free-running polynomial counter,
  which depends on exact CPU timing. This uses a normal PRNG.
- **Mouse to trackball:** POINTER mode is not a trackball. The gun moves toward the
  pointer at up to the arcade's top speed. If a mushroom blocks a full step, it tries
  a shorter one, so it can slide up to a mushroom. The arcade simply stops for that
  frame.
- The IRQ's trackball direction-glitch filter is not emulated (no real trackball).
- Sprite positions are taken once per frame (in "vblank") instead of being raced
  against the beam. Like the hardware, this gives a one-frame sprite lag.
- One player only: no 2-player alternation, no cocktail flip. The coin, timed-game
  and EAROM bookkeeping options are not implemented.
- The menu logo is drawn with the ROM's font and centipede sprite. The arcade has no
  title logo in ROM.
- The kid knobs (speed %, frequencies, length, density, invulnerable) are additions
  layered on top of the ported logic. At **Original** they are all neutral.

## Where the art comes from

The **genuine picture ROMs** are embedded byte for byte. 136001-201/202 come from
`reference/src/revision.v2` in the historicalsource repo. Their CRCs (880acfb9,
b1397029) equal MAME's 136001-211.f7 / 136001-212.hj7. They are decoded at start-up
exactly as the board's video hardware decodes them: 2-bitplane 8x8 playfield stamps
$40-$7F, and 8x16 motion objects. Colours are computed from the arcade's colour-RAM
values with MAME's palette formula, which matches the self-test notes in
CENTIP.DOC (colour 0 tan, 1 light green, 2 pink, 15 black). The source file
`CENPIC.MAC` names every picture (HEAD0-F, GUN, BUG0-7, ANT0-3, SCORP0-3, THREE /
SIX / NINE, EXPLD0-5, PLAY0-8). `tools/rom-sheet.js` writes
`reference/sheets/rom-sheet.png`. The `render-*.png` files there are frames
rendered by the real game code.

## Developer notes

```
node tools/test.js                 # headless suite, ends "all tests passed"
node tools/render-frame.js play    # PNG of a game frame in tools/out/ (see the file for scenarios)
node tools/inject-rom.js           # re-embed the picture ROM into index.html
node tools/launch.js               # open in Chrome
```
