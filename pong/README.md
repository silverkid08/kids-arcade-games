# PONG (Atari, 1972)

A faithful clone of the arcade Pong. Two players share one keyboard, so a parent
and child, or two siblings, can play each other. You can also play one player
against the computer. The game is one `index.html` that runs from `file://` in
Chrome with no network.

Open `index.html`, or run `node tools/launch.js`.

## Controls

| | Left player | Right player |
|---|---|---|
| Keys | **W** up, **S** down | **↑** up, **↓** down |
| Mouse (set in the menu) | vertical mouse position | vertical mouse position |
| Touch | drag on the left half | drag on the right half |

- **Space**: start a game, serve (with "press to serve"), or rematch after a game.
- **P**: pause. **M**: sound on or off. **Esc**: menu (pauses the game).
- Both players can hold keys at the same time. The game tracks each key as
  held or released and reads the state once per frame. It ignores the
  keyboard's auto-repeat, so both paddles move smoothly together.
  (Some cheap keyboards cannot report certain key combinations. W/S plus the
  arrows is a combination nearly every keyboard handles.)
- **vs CPU**: choose *VS CPU (YOU LEFT)* or *VS CPU (YOU RIGHT)*. The human can
  then use either key set.
- **Mouse**: the arcade paddle was an absolute knob, so the mouse is absolute
  too. The paddle centre follows the pointer's height. Only one player can use
  the mouse at a time.

Menu keys: ↑↓ pick a row, ←→ change it, 1-4 choose a preset, Enter or Space
plays. Type short names (up to 8 characters) in the LEFT and RIGHT boxes.

## Settings

**Presets**: Kid / Easy / Normal / Original. Changing any knob shows "CUSTOM".
**Original** is the arcade machine exactly.

| Knob | Kid | Easy | Normal | Original |
|---|---|---|---|---|
| Ball speed | 60% | 80% | 100% | 100% |
| Ball speeds up | never | at 4 / 12 hits | at 4 / 12 hits | arcade |
| Points to win (5, 11, 15, endless) | 5 | 11 | 11 | 11 |
| Serve | press to serve | press to serve | arcade auto | arcade auto |
| Angles / walls | gentle | arcade | arcade | arcade |
| Paddle reach | whole screen | whole screen | whole screen | arcade gap |
| CPU skill (1-5) | 1 | 2 | 3 | 3 |
| Paddle size, each player | 34 | 20 | 15 | 15 |
| Paddle speed, each player | 100% | 100% | 100% | 100% |
| Bumper wall, each player | off | off | off | off |

**Per-player handicaps** let a younger child play an older sibling or a parent
fairly. Each player has their own settings for:
- paddle size: 15 (arcade), 20, 26, 34, 44 or 60 lines
- paddle speed: 50-200%
- control: keys or mouse
- **bumper wall** (the "invulnerable" mode): the ball bounces off that
  player's back wall instead of scoring. The wall flashes, a tone sounds, the
  ball drops back to its slowest speed, and a BUMPER badge shows on that side.

Other settings:
- **Angles / walls**: *gentle* limits returns to 1 line per frame. *Flat*
  sends the ball straight across every time, so it never reaches the walls
  (the simplest game).
- **Serve: press to serve**: after the arcade's serve delay, the ball waits
  until the receiving player presses one of their keys, taps their half, or
  presses Space. A CPU receiver serves itself.

**Win record.** The menu shows wins per player name for this session and an
all-time tally saved in `localStorage` (`pong.wins`). A win by a player who had
the bumper on is counted separately, with a `*`. Settings are saved in
`pong.settings`. The game still works if storage is blocked.

## What is faithful (Original preset)

Pong has no CPU and no ROM. It is about 66 TTL chips, so the "source code" is
the schematic. The rules below come from the Atari schematic as captured in
**MAME's netlist driver** (`reference/nl_pong.cpp`), checked against **Dr. H.
Holden's circuit analysis** (`reference/holden-pong-circuit-analysis.pdf`). Chip
names are board locations.

- **Screen.** 7.159 MHz clock, 455 clocks × 262 lines, 60.05 Hz. The visible
  field is 374 clocks × 246 lines (the ball counters are inhibited for 81
  clocks and 16 lines). It is shown on a 4:3 tube, so pixels are slightly
  taller than wide.
- **Net.** One clock wide at H=256 (F3/G3/G2), on for 4 lines and off for 4
  (4V).
- **Paddles.** 4 clocks wide at H=128 and H=384 (H3 latch). They are 15 lines
  tall: the B8/A8 7493 counts 15 lines after the 555 delay.
- **Ball.** 4 × 4.
- **Paddle segments.** The paddle's line count, minus its low bit, makes 8
  segments. The vertical-velocity encoder (A6/B6 to A5/B5 latches, XOR with
  A2, 7483 adder +6/+7) turns them into 9316 load values 13,12,11,10,10,9,8,7.
  That means 3/2/1 lines per frame up, flat, flat, then 1/2/3 down. The latch
  is re-clocked on every line where ball and paddle overlap, so the **lowest**
  overlapping line picks the angle.
- **Walls.** A2 toggles when the ball is still lit as vertical blanking ends.
  The ball reflects at the same speed. At the bottom it pokes into the
  blanking and is briefly drawn split between bottom and top, as on the real
  monitor.
- **Horizontal speed.** The H2 "move" window opens for 2, 3 or 4 lines per
  frame, giving 2, 3 or 4 clocks per frame. The F1 hit counter selects the
  window: under 4, 4-11, or 12. A miss resets the counter.
- **Speed-up (arcade).** F1 is clocked by the HIT SOUND signal, the 491 Hz
  tone gated for about a frame. That makes it count about 8 per paddle hit:
  medium speed after the first return, top speed after the second. The
  "4 and 12 hits" often quoted (Atari's speed-control patent, Holden) is
  available as the *at 4 / 12 hits* setting, used by Easy and Normal.
- **Serve.** After a miss, the serve 555 (330 kΩ, 4.7 µF) hides the ball for
  1.71 s (102 frames). The ball reappears just right of the net at H=262. It
  keeps its vertical motion, which carried on unseen, and its **horizontal
  direction, so it is served toward the player who missed**. Holden says this
  explicitly, and the netlist agrees: H3 is only changed by paddle hits during
  play. Each new point starts at the slowest speed.
- **Score.** 7490 counters plus a tens flip-flop. First to **11** wins (the
  board switch also allows 15). The game then returns to attract mode: the
  paddles disappear, the scores stay, and the ball bounces silently off every
  side.
- **Score digits.** Drawn by the 7448 decoder in a 16 × 32 window with
  4-wide strokes, at V 32-63, in the cells at H 128-191 and 320-383. The
  7448's tail-less 6 and 9 are reproduced. The leading "1" is the decoder's
  right-hand bars. The digits are slightly dimmer than the ball because they
  mix in through 1.2 kΩ instead of 1 kΩ.
- **Sounds.** All are square waves:
  - paddle hit: 491.7 Hz (VPOS16) for about one frame
  - wall bounce: 245.9 Hz (VPOS32) for one frame
  - point scored: 245.9 Hz for the score 555's 0.24 s (220 kΩ, 1 µF)
- **CRT feel.** Elements are drawn as hard rectangles at device resolution,
  with darker scanline rows, a phosphor halo, a vignette and rounded glass.
  Nothing is blurred.

## What is approximate or added

- **The paddle gap.** The paddle's range comes from an analog 555 and the
  player's potentiometer, adjusted per cabinet. Its exact size cannot be read
  from the schematic. Holden notes that the ball could pass both above and
  below the paddle "even when ideally set". This clone stops the paddle
  10 lines short of the top and 6 short of the bottom, enough for the 4-line
  ball to slip past. Normal, Easy and Kid use the whole screen.
- **Keyboard paddles.** The real knob turns as fast as your hand. With keys,
  the paddle moves 4 lines per frame at 100%. The mouse is absolute, like the
  knob.
- **Small timing simplifications.**
  - The serve is released at the start of a frame, rather than on the left
    paddle's first line.
  - When a game ends, the ball restarts from the serve position.
  - The 555 serve and score timers are rounded to whole frames.
- **Additions not on the arcade.**
  - a computer player
  - presets and handicaps
  - the bumper wall
  - "press to serve"
  - on-screen names and prompts in a small 5 × 7 font
  - the pause screen
  - endless mode (scores above 19 get extra digits; the real counter would
    wrap)
- **No coin slot.** PLAY starts a game, which the arcade did with a coin
  (SRST).

## Sources

- MAME, `src/mame/atari/nl_pong.cpp` and `pong.cpp` (Couriersud), the netlist
  transcription of the Atari Pong schematic:
  https://github.com/mamedev/mame/tree/master/src/mame/atari (copies in
  `reference/`)
- Dr. H. Holden, *Atari Pong E Circuit Analysis & Lawn Tennis: Building a
  Digital Video Game with 74 Series TTL ICs* (2013):
  https://pong-story.com/LAWN_TENNIS.pdf (copy in `reference/`). Used for
  blanking counts, speeds, the serve, the sounds and the paddle-range gap.
- Paul Falstad's Pong circuit simulation notes:
  https://www.falstad.com/pong/ (hit sound, horizontal ball control)
- Wikipedia, *Pong*: https://en.wikipedia.org/wiki/Pong
- US patent 4,114,882, *Variable velocity control for playing images*:
  speed-up at 4 and 12 hits.

## Verification

- `node tools/test.js` runs the real game code headlessly and calls `render()`
  every frame. It has 206 checks and must end "all tests passed". It covers:
  - segment angles and paddle speed-up
  - the top and bottom gap, wall bounces, serve direction and delay
  - scoring to 5, 11, 15 and endless
  - simultaneous keys and auto-repeat immunity
  - mouse mapping through a scaled canvas, and two-finger touch
  - CPU strength by level
  - every knob, including per-player size, speed and bumper
  - presets and Custom, settings round-trip, storage failure, the win record
  - the menu
  - pixel checks of the net and digits
  - long bot matches in every preset
- `node tools/render-frame.js <scenario>` writes `tools/out/<scenario>.png`.
  Scenarios: attract, play, serve, wait, edge, gameover, kid, paused, digits,
  native.
- `node tools/serve.js` serves the game on localhost, with a rAF shim page,
  for browser automation.
