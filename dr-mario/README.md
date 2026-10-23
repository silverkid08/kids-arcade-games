# Dr. Mario (NES, 1990) for kids

This is a faithful clone of Nintendo's NES **Dr. Mario**, 1-player game. It is a single `index.html` that runs
from `file://` in Chrome with no network access. The menu adds a NO GAME OVER mode and kid-friendly settings.

```
node tools/launch.js      # open in Chrome
node tools/test.js        # headless suite, ends "all tests passed"
```

## How to play

Drop the two-colour capsules into the bottle. Line up **4 of one colour** (capsule halves and viruses) in a row
or a column and they disappear. Clear every virus to finish the stage.
If the bottle neck gets blocked, the game is over (unless NO GAME OVER is on).

| Key | Action |
| --- | --- |
| ← → or A D | move (hold to slide) |
| ↓ or S | drop faster |
| Z or J | turn counter-clockwise (NES B) |
| X or K | turn clockwise (NES A) |
| Space | hard drop (only when the HARD DROP knob is on); START on the title and options screens |
| Enter / P | START: pause, continue, start the game |
| M | mute |
| Esc | menu (presets, knobs, high scores) |

PLAY in the menu opens the real NES options screen (VIRUS LEVEL, SPEED, MUSIC TYPE). Press START (Enter) there to begin.

## Presets and knobs

| Knob | Kid | Easy | Normal | Original (= NES) |
| --- | --- | --- | --- | --- |
| Drop speed (10% very slow ... 150%) | 25% | 50% | 85% | 100% |
| Faster every 10 capsules | off | off | on | on |
| Virus colours | 2 (yellow+blue) | 3 | 3 | 3 |
| Virus count (or "by level") | 4 | by level | by level | by level |
| Match | 3 in a row | 4 | 4 | 4 |
| Landing preview (ghost capsule) | on | on | off | off |
| Hard drop (Space) | on | on | off | off |
| Hold-to-slide delay / repeat (frames) | 24 / 10 | 20 / 8 | 16 / 6 | 16 / 6 |
| Next capsule shown in Mario's hand | show | show | show | show |
| NO GAME OVER | on | off | off | off |

The green rows are the NES options and are not part of the presets: virus level 0-20, speed LOW/MED/HI, and
music FEVER/CHILL/OFF.

- **NO GAME OVER.** When the neck is blocked, the capsule halves in the top 6 rows pop with a flash and play continues.
  A "NO GAME OVER" badge shows on screen.
- **High scores.** These are kept per preset in `localStorage` (`drmario.high.<preset>`). Scores made with NO GAME
  OVER are kept separately (`.nogo`) and marked with `*`. Settings are stored in `drmario.settings`.

## What is faithful

The game logic is a port of the annotated disassembly
[Nostaljipi/dr-mario-disassembly](https://github.com/Nostaljipi/dr-mario-disassembly) (copy in `reference/disasm`).
That disassembly assembles byte-exact to the Rev A ROM. `tools/rom-diff.js` runs that assembled ROM in a 6502
emulator side by side with this game. With the same input every frame, the two are **identical frame for frame**
over 130,000 frames in 7 configurations, including stage clears, game overs and pauses. Compared each frame:

- mode, frame counter and RNG
- the whole bottle, the falling and next capsule, and the action state machine
- speed-ups, score and virus count
- the magnifier viruses, Mario's throw and every sprite
- the bottle rows as drawn
- the sound chip registers

The numbers below come from the disassembly:

- **Screen and timing.** The screen is 256x224 at 60 Hz. The bottle is 8x16.
- **Viruses.**
  - The count is 4 x (level+1), capped at 84. Levels go past 20 up to 24 after stage clears.
  - Placement follows `addVirus`:
    - a random height is limited per level (bottom 10 rows, 11 from level 15, 12 from level 17, 13 from level 19);
    - every 4th virus gets a random colour;
    - a virus is never the same colour as one two cells away, so there are never 3 of a colour in a row.
- **Capsules.**
  - At level start a 128-capsule reserve is generated with `(rng & 15 + previous) mod 9` over the 9 colour pairs.
    Capsule 0 is never used.
  - Capsules enter at column 3 of the top row.
- **Rotation (`pillRotateValidation`).**
  - A turns clockwise, B turns counter-clockwise.
  - The only kick is one column left when turning flat.
  - Holding left while turning flat moves one extra column left (a ROM quirk).
  - The top half of an upright capsule may stick out of the bottle and is lost when it lands.
- **Gravity.**
  - Drop speed uses `speedCounterTable`: LOW 40, MED 20, HI 14 frames per row.
  - It gets one step faster every 10 capsules, up to 49 times.
  - Fast drop moves 1 row per 2 frames, and only when DOWN is the only direction held.
- **Sideways movement.** A capsule moves at once, then after 16 frames, then every 6.
- **Matches and falling.**
  - Matches are checked across the whole bottle, rows then columns, and crossings count.
  - Halves that lose their partner become single halves.
  - Unsupported pieces fall 1 row per pass, and a pass runs only after the 16-row redraw finishes.
  - Chains run until nothing moves.
- **Scoring (`scoreIncrease`).**
  - Each virus scores (speed+1) x 100 x 1, 2, 4, 8, 16, 32 within one capsule, chains included.
  - That gives LOW 100-3200, MED 200-6400 and **HI 300-9600**. HI is triple, not double; StrategyWiki agrees.
  - Past 9,999,900 the score rolls back to 9,0xx,xxx.
  - The famous multiplier overflow on huge combos reads the ROM's next bytes, as on the NES.
- **Stage clear.** STAGE CLEAR / TRY NEXT shows with the win jingle. START gives the next level at the same speed,
  and the score carries over.
- **Game over.** It happens when the new capsule does not fit at the neck. The fail music plays with the explosion,
  Mario shows his fail pose and the viruses laugh. Then the GAME OVER box appears, and START returns to the options
  screen.
- **Mario and the magnifier.**
  - Mario throws each capsule along `pillThrownAnim` (every other frame on LOW).
  - The three big viruses circle and dance on the music's beat, jump and writhe when their colour is hit, and vanish
    when their last virus is gone.
- **Pause.** The screen goes black with "PAUSE" and the pause jingle plays.
- **Art.** The art is genuine and taken from the ROM built from the disassembly:
  - CHR tiles, with the 2-frame virus animation done by bank switching as on the NES;
  - the title, options and level nametables, dumped from VRAM after the game drew them;
  - palettes, including the background colour per speed;
  - all 75 metasprites;
  - the game's own font.
- **Sound.** The ROM's own sound driver was run in the emulator and every APU register write recorded: Fever,
  Chill, OFF, title, options, fail, both win jingles, all effects and the pause jingle. A small 2A03 APU emulation
  plays them back:
  - pulse channels with sweep and envelope, triangle, noise and DMC samples;
  - the driver's channel-stealing and effect priority rules;
  - the noise RNG.

  In rom-diff, the register output matches the ROM on all but the first frame.

## What is not included or is approximate

- **Not included.**
  - The 2-player versus mode.
  - The title demo.
  - The cutscenes after levels 5/10/15/20 (MED/HI) and the level-20 ending.
  - The heart on the title screen stays on 1 PLAYER GAME.
- **Lag frames.** The real NES occasionally drops a frame during screen changes. The clone does not, which shifts
  those moments by 1/60 s.
- **Audio.** It is synthesised in real time with a ScriptProcessor. The mixer and filters follow the standard NESdev
  formulas. Timing is per frame (60 Hz), not cycle-exact.
- **Colours.** These use a standard 2C02 palette.

## Sources

- Nostaljipi, Dr. Mario (NES) disassembly: https://github.com/Nostaljipi/dr-mario-disassembly (code, data, CHR)
- brianhuffman/drmario disassembly (Rev A checksum): https://github.com/brianhuffman/drmario
- Data Crystal: https://datacrystal.romhacking.net/wiki/Dr._Mario
- The Cutting Room Floor: https://tcrf.net/Dr._Mario_(NES)
- StrategyWiki, Dr. Mario gameplay/scoring: https://www.strategywiki.org/wiki/Dr._Mario/Gameplay
- Super Mario Wiki: https://www.mariowiki.com/Dr._Mario_(game)
- NESdev wiki (APU behaviour, mixer formulas): https://www.nesdev.org/wiki/APU

This is for personal use only.
