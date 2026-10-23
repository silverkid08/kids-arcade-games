# BREAKOUT (Atari, 1976): mouse edition

A clone of Atari's 1976 arcade **Breakout**, built for kids and kept faithful to the arcade. It is one
`index.html` that runs from `file://` in Chrome with no network access. The mouse stands in for the
paddle knob, so the game also gives children mouse-control practice.

```
node tools/launch.js        # open it in Chrome (or just double-click index.html)
node tools/test.js          # headless suite, ends "all tests passed"
```

## How to play

Move the mouse left and right and the paddle follows. The cursor's position across the screen maps
directly onto the paddle's travel, the same way the arcade knob is absolute. Click, or press Space,
to serve. Bounce the ball into the wall: yellow bricks are worth 1 point, green 3, orange 5 and red 7.
If you clear the wall, a second wall appears. Clearing that one too is the arcade's perfect game,
worth 896 points.

| Control | Action |
|---|---|
| Mouse / touch drag | move the paddle |
| Left click / tap / Space / Enter / Up / W | serve (the arcade's SERVE button) |
| Left/Right arrows, A / D | move the paddle from the keyboard |
| P | pause |
| M | sound on/off |
| Esc | menu (settings, resume). Q quits while paused |

## Presets and knobs

| Knob | Original | Normal | Easy | Kid |
|---|---|---|---|---|
| Ball speed | 100% | 90% | 70% | 50% |
| Ball speeds up (4/8/12 hits, orange/red rows) | on | on | on | off |
| Paddle width (lines) | 15 (arcade) | 15 | 24 | 40 |
| Paddle shrinks after hitting the back wall | on | on | off | off |
| Brick rows | 8 | 8 | 6 | 4 |
| Balls | 3 | 5 | 5 | 9 |
| Mouse sensitivity | 100% | 100% | 125% | 150% |
| Serve | click (arcade) | automatic | sticky paddle | sticky paddle |
| Endless walls | off | off | off | on |
| Score blinks | on | on | off | off |
| Invulnerable | off | off | off | on |

- **Original** matches the machine at its default DIP settings: 3 balls and no free game. 5 balls is
  the other DIP setting; set it with the Balls knob.
- **Brick rows** below 8 keep the bottom rows, so the bricks stay under their correct colour strips.
- **Mouse sensitivity** above 100% means a smaller sweep of the mouse covers the whole travel. Below
  100%, the mouse has to move past the screen edges, and it is still tracked outside the canvas.
- **Serve:**
  - *click*: the arcade rule, described below.
  - *automatic*: the serve button is pressed for you.
  - *sticky paddle*: the ball sits on the paddle until you click, then launches upward.
- **Endless**: a fresh wall comes after the second one instead of the game ending.
- **Invulnerable**: the ball bounces off the floor with a cyan flash instead of being lost, and an
  INVULNERABLE badge shows above the wall.
- Touching any knob switches the preset display to CUSTOM. Settings, high scores (one table per
  preset; invulnerable runs are kept separately and marked `*`), per-preset mouse statistics and the
  last 10 games are saved in `localStorage` under `breakout.*`.

**Mouse-skill stats.** The game-over screen shows:
- **catch rate**: paddle hits divided by balls that reached the paddle line. An invulnerable floor
  bounce counts as a miss.
- **longest rally**: the most paddle hits in a row without a miss.
- bricks broken.

PROGRESS shows the last 10 games and compares the older half with the newer half.

## What is faithful (Original preset)

The 1976 machine has no CPU. It is about 100 TTL chips driving a black-and-white monitor turned on
its side, with strips of coloured cellophane glued to the glass. MAME's Breakout driver is a
gate-level netlist transcribed from the Atari schematics. Every rule below was read off that netlist,
chip by chip, and the code comments name the chips and signals involved.

**Screen and timing**
- The screen is 228 scan lines (playfield x) by 240 H-clock ticks (playfield y). An H tick is about
  1.4 times taller than a scan line is wide, so the canvas is stretched by unequal integer factors:
  2x3 or 3x4.
- The frame rate is 63.42 Hz, not 60:
  - 14.318 MHz / 3.5 = one H tick.
  - 256 ticks per line.
  - 252 lines per frame, because the V counter jumps from 224 to 228.

**Layout**
- Top wall: H 24..31.
- Side walls: 4 lines each, x 0..3 and 224..227.
- Bricks: 8 rows by 14 columns. Each brick is 14 lines by 3 ticks, with a 2-line and 1-tick gap.
  The rows sit at H 64..95. The leftmost column is partly hidden under the left wall, and the
  rightmost column touches the right wall, exactly as in captures of the real machine.
- Paddle: H 212..215.
- Colour strips, taken from MAME's `breakout.lay` overlay:
  - red H 64..71, orange 72..79, green 80..87, yellow 88..95;
  - blue 212..217, which colours the paddle, the walls and the ball as it passes.

**Score digits**
- The digits are the 7448 seven-segment decoder's shapes, including the tails on 6 and 9. Each digit
  is 12 lines by 14 ticks; the vertical strokes are 4 lines thick and the horizontal ones 2 ticks.
- They sit where the 9312 multiplexers put them: the player-1 score, the player-2 score (000 in a
  one-player game), the player number top-left and the ball number top-middle.
- During play the current player's score flashes at about 4 Hz. This comes from 555 timer B2
  (560 Ω + 1.8 MΩ, 0.1 µF). The *Score blinks* knob can turn it off.

**Ball**
- The ball is 4 lines by 2 ticks, so it looks roughly square on the tube.
- It moves (4 − Y) lines and (4 − L) ticks per frame, where Y and L are the values loaded into its
  counters, B7 and C7. That gives these speeds:
  - Hits 0-3: 1 tick per frame vertically. Horizontally, 1 line per frame off the paddle's middle
    segments and 2 off its outer segments.
  - **After 4 hits** (B5 QC): 2 ticks per frame.
  - **After 8 hits** (B5 QD, V_SLOW low): 3 lines per frame horizontally on every segment, but back
    to 1 tick vertically. This is what the logic does; it is not a typo.
  - **After 12 hits**: 2 ticks and 3 lines per frame. Counter B5 stops at 12.
  - **First contact with an orange or red brick** (D5#2 loads B5 with 15): 3 ticks and 3 lines per
    frame.
  - Losing the ball resets all of this.
- "Hits" means rising edges of the up/down flip-flop. In practice that is paddle hits, plus bricks
  hit from above behind the wall.

**Paddle**
- The paddle is 15 lines wide. Its counter, D4, runs from 0 to 14 starting at the right edge.
  - Bits PD/PC split it into 4 segments of 4/4/4/3 lines.
  - PD (the left half) sends the ball left.
  - PC xor PD tells middle segments from outer ones.
  - The segment that counts is the leftmost paddle line the ball touches, because A6 latches on the
    last coincidence in each frame.
- When the ball hits the back wall, flip-flop F5 makes D4 count twice per line, so the paddle halves
  to 7 lines **and keeps its right edge**. It returns to full size when the ball is lost.

**Bricks**
- Only one brick can be broken per paddle or back-wall contact: latch F7 disarms on each brick hit.
  A disarmed ball passes straight through bricks.
- When the ball touches two bricks at once, the first one in raster order breaks: the rightmost line
  wins, then the topmost row.
- Every brick hit flips the vertical direction. That produces the "breakthrough" behaviour: once the
  ball is above the wall it rattles between the back wall and the tops of the bricks.

**Walls and losing the ball**
- Side-wall bounces happen when the ball is drawn during vertical blank, and A6 latches V16. On the
  left the ball goes fully into the wall before turning back; on the right it turns as soon as it
  touches. This asymmetry is real.
- The back wall is silent.
- A ball is lost when it reaches H 240, inside horizontal sync.

**Serving**
- The machine **does not serve automatically**. You press SERVE, which presets A3#1. Then the
  invisible ball, which keeps moving down 1 tick per frame and wraps around the screen, appears when
  it next passes H 144, moving down at a pseudo-random x.
- In practice the ball reappears about 2.5 s after it was lost, or up to about 4 s after a late
  press. Clicks made while the ball is in play are ignored.

**Walls, scoring and game end**
- Second wall: the brick RAM is rewritten (F4 latch, then FPD1 one-shot) on the first paddle hit
  after the score reaches the 448 pattern. It is not refilled the instant the last brick goes.
- The game ends after the second wall (896) or when the balls run out. Each wall is worth
  14 × 2 × (7+5+3+1) = 448.
- The score is 3 digits, as on the machine; in Endless mode it wraps past 999 on screen.

**Sounds** (square waves taken from the ball's line counter, gated by 9602 one-shots)

| Sound | Frequency | Length | Source |
|---|---|---|---|
| Paddle | 1998 Hz (line rate / 8) | 8.7 ms | A8#1 |
| Side wall | 999 Hz (line rate / 16) | 21 ms | A7#1 |
| Brick | 499 Hz (line rate / 32) | 8.7 ms | one beep per point |

- Brick beeps are queued in up/down counter F6 and spaced by one-shot A7#2 (71 ms), so they play
  every 5 frames. A red brick sounds as 7 quick beeps.
- In attract mode the machine is silent and scores nothing.

**Attract mode** (behind the menu): the paddle fills every line along the bottom (ATTRACT forces
C3.11), and the ball bounces around knocking out bricks.

## What is approximate or omitted

- **The paddle's analog range.** The knob drives a 555 timer through a log-taper 5 kΩ pot. Here the
  mouse maps linearly over x 0..227: the paddle can slide under the walls but not past them.
- **Paddle width phase.** On the machine the paddle is 14 or 15 lines wide, depending on where in a
  line the 555 fires; here it is always 15 (shrunk: always 7). The H clock's uneven 2:2:1 tick
  widths are drawn as even pixels, and the brick-row gap is a whole tick. On the tube, capacitor C36
  makes the gap about 0.6 tick.
- **Where the serve appears.** The serve x position depends on the hidden ball's drift, which is
  modelled. The exact phase at power-on is random.
- **Picture size.** The screen shows the full raster window (H 0..239), as in the arcade capture on
  Wikipedia. MAME crops to about H 26..232.
- **Cabinet extras.** Two-player alternation, credits, coins, free-game DIP thresholds and the
  free-game tone are omitted. Player 2's score is shown as 000.
- **The end of the game.** On the machine, after the second wall the ball just keeps bouncing
  harmlessly. Here the game ends 2 seconds after the second wall is cleared.
- **Sound.** These are clean square waves; the real speaker and LM380 amplifier are not modelled.

**On "auto serve".** The original request assumed the arcade serves automatically. The netlist shows
that SERVE_WAIT only clears after the SERVE switch, active low on `SERVE.1`, presets A3#1. The only
automatic serve is in attract mode. So Original uses click-to-serve. *Automatic* and *sticky paddle*
are available as knob values.

## Sources

- **MAME netlist driver**: `src/mame/atari/nl_breakout.cpp` (DICE team / Couriersud), copied into
  `reference/`. Most of the rules come from here.
- **MAME machine driver**: `src/mame/atari/pong.cpp`. It gives the 14.318 MHz clock, 448-cycle lines,
  252-line frames, the DIP list (3/5 balls) and the screen parameters; copied into `reference/`.
- **MAME colour overlay**: `src/mame/layout/breakout.lay`, copied into `reference/`.
- **Wikipedia**, ["Breakout (video game)"](https://en.wikipedia.org/wiki/Breakout_(video_game)): the
  wikitext is in `reference/wikipedia-breakout.html`, and the arcade screenshot used for the layout
  comparison is `reference/wikipedia-screenshot.png`. Wikipedia also gives the row values, the 4/12
  hit and orange/red speed-ups, the half-size paddle and the 896 maximum.
- **Gameplay video**: the Breakout capture linked from MAME's `pong.cpp`
  (https://www.youtube.com/watch?v=NOGO49j5gCE). It is cited by MAME; it was not viewed here.
- **Atari schematics**: the Atari Breakout service manual and schematics are what the MAME netlist
  transcribes. Chip names (A3, B5, D4, F7 ...) follow them.

## Files

```
index.html             the whole game
tools/test.js          headless test suite (node tools/test.js)
tools/harness.js       DOM / canvas / audio stubs (from duck-hunt / pac-man)
tools/build.js         extracts the game IIFE and exposes its internals to the tests
tools/render-frame.js  renders a scenario to tools/out/<name>.png
tools/png.js           dependency-free PNG encode/decode
tools/launch.js        opens index.html in Chrome
tools/serve.js         localhost server with a requestAnimationFrame shim, for browser automation
reference/             MAME netlist, driver, overlay layout, Wikipedia text and screenshot
```
