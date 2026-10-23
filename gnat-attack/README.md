# Gnat Attack (Mario Paint fly swatter) for kids

A clone of **Gnat Attack**, the fly-swatting minigame from Nintendo's **Mario Paint**
(SNES, 1992). It is meant as mouse-skills practice. The SNES Mouse moved a gloved hand
holding a fly swatter; here the PC mouse does. Everything is in one `index.html`. It runs
from `file://` in Chrome with no network access.

```
node tools/launch.js      # open it in Chrome (or just double-click index.html)
node tools/test.js        # headless test suite, ends "all tests passed"
```

## How to play

- **Move the mouse** to move the swatter. **Left-click** (or tap, Space or Enter) to swat.
  - Anything under the swatter's mesh while it is down gets swatted.
  - You can sweep the lowered swatter across several bugs in one swat. This is the same
    trick the TAS uses.
- The number at the top is how many bugs are left in the level. The gloves at the top
  right are your lives.
- Plain flies are harmless. The others fight back:
  - **Big Fly** (blue): buzzes around, then fires a four-way blast of orbs.
  - **Fly Parent** (orange wasp): flashes, then releases a line of **Fly Children** that
    chase the glove.
  - **Fly Bomb** (winged bomb): drifts toward the glove, loses its wings next to it and
    explodes. It also explodes by itself after a while.
- If an orb, a Fly Child or an explosion touches the **hand**, the glove is stung. The hand
  pulls a shocked face and shrinks, and you lose a life.
- Every 25 bugs, an extra-life glove floats down. Swat it to get a life.
- When the counter reaches 0, **King Watinga** arrives. He fires rings of orbs and fans of
  Fly Children, and he takes **20 swats**.
- After each boss, Mario walks across the screen. From level 2 a Koopa joins him. After
  level 3 you get CONGRATULATIONS!
- After level 3 the game loops back to level 1. A new award icon is added at the top left
  each time, up to 15.
- `P` pauses and shows the original pause panel. `M` toggles sound. `Esc` opens the menu,
  where `RESUME` returns to the game. When paused, `Q` quits.

## Presets and knobs (menu)

| Knob | Values | Original |
|---|---|---|
| Insect speed | 25 – 150 % | 100 % |
| Insect size (hit box scales too) | 1×, 1.5×, 2× | 1× |
| Swatter size (sprite and mesh) | 1×, 1.5×, 2× | 1× |
| Swat hit radius (extra pixels around the mesh) | 0 – 24 | 0 |
| Bugs per level | 10, 25, 50, 75, 100 | 100 |
| Attacking bugs (off, or frequency 25 – 150 %; covers the boss's attacks too) | off / % | on (100 %) |
| Boss swats needed | 3, 5, 10, 15, 20 | 20 |
| Boss speed | 50 – 125 % | 100 % |
| Lives | 1 – 9 | 3 |
| Starting level | 1 – 3 | 1 |
| Extra life every | off, 10, 25, 50 bugs | 25 |
| Swat mode | click / hover + hold | click |
| Hover hold time | 0.3 – 2 s | (1 s) |
| Score on screen | off / on | off (the original has no score) |
| Invulnerable | off / on | off |

The presets are **Kid**, **Easy**, **Normal** and **Original**.

- **Kid**: 40 % speed, 2× bugs, 2× swatter, +16 px hit radius, no attacking bugs, 25 bugs
  a level, a 5-swat boss, 9 lives, and an extra life every 10 bugs.
- **Original**: the real game.
- Changing any knob shows "CUSTOM" in the preset row.

**Invulnerable** is a separate switch that keeps its value when you change preset.

- With it on, stings flash the glove white and nothing else happens.
- A yellow INVULNERABLE badge sits in the bottom-left corner.
- High scores set with it on go in their own table and are marked `*`.

**Hover + hold** is for kids who find clicking hard. Keep the mesh over a bug for the hold
time and it swats by itself. A ring of yellow dots shows the progress.

## Mouse-skill statistics

After each level clear and at game over, a box shows:

- **accuracy**: swats that hit something, out of all swats
- **average time to swat**: from when a bug appeared to when it was swatted
- **best streak** of hits in a row
- bugs swatted, and stings taken

The menu shows lifetime totals for the selected preset. **PROGRESS** shows the last 10
games, with an "older half vs newer half" trend line.

Settings, high scores (one table per preset, plus a separate invulnerable table), per-preset
statistics and history are saved in `localStorage` under the `gnatattack.` prefix.

## What is faithful

These are faithful, with sources:

- **Screen**: the SNES's 256×224 is drawn with integer scaling.
  - The 224×192 play area sits in a black frame, measured from a native 256×224 pause-screen
    capture.
  - The paper tiles start at (16,16), and the counter and life icons are at the measured
    pixel positions.
- **Three levels, each with its own paper**:
  - level 1 white tiles, level 2 blue glass, level 3 pink.
  - Nintendo's official screenshots on Nintendo Music show this.
- **100 bugs per level**, counted down at the top. Then **King Watinga** takes **20
  swats**. Sources: Super Mario Wiki and the TASVideos submission.
- **3 lives**, shown as glove icons. An **extra-life glove every 25 bugs**. Sources:
  Nintendo screenshots and Retro XP.
- **Endless loop** after level 3, with a top-left award icon per loop, up to 15. Sources:
  Super Mario Wiki and TASVideos.
- **Enemy roles**. Sources: Super Mario Wiki, Retro XP and the Nintendo screenshots.
  - Harmless Fly.
  - Big Fly with a four-way orb blast.
  - Fly Parent that births homing Fly Children.
  - Fly Bomb that homes in, arms near the glove and explodes.
  - The boss fires orbs and large waves of Fly Children. The fan-of-children pattern copies
    the Nintendo "King Watinga" screenshot.
- **Which bugs appear in which level**. Nintendo's official level screenshots show:
  - flies in level 1
  - Fly Parents and Children in level 2
  - bombs, parents and flies in level 3
- **Glove animation**: idle, swing, flat swat, a yellow/red SMACK splat on a hit, then the
  shocked hand and two shrink frames when stung.
- **Swat hits are checked on every frame while the swatter is down**. So one sweeping swat
  can hit bugs on opposite sides of the screen, as the TAS describes.
- **Stage-clear walk**: Mario walks across, a fly buzzes around his head, a Koopa joins
  from level 2, and CONGRATULATIONS! appears after level 3. Super Mario Wiki and Nintendo's
  "Stage Clear" artwork show this.
- **Game over** shows King Watinga laughing next to GAME OVER (from Nintendo's artwork).
- **Music is the real game data**. All eight Gnat Attack tunes are decoded from the game's
  own N-SPC sequence data and played on the game's own BRR instrument samples:
  - Flyswatter Level 1/2/3, Big Robo Bug (boss)
  - Beat the Big Bug!, Beat the Big Bug! (Final), Master Exterminator
  - Beaten by Bugs (game over)
- **Music tempo is checked**:
  - Level 2's quarter note comes out at 0.455 s; the VGMusic transcription says 0.4615 s.
  - Level 3's comes out at 0.307 s; the transcription says 0.3077 s.
  - The melodic intervals match the transcription. The one note where they differ (an A♭
    instead of an A) is taken from the game data.

## What is approximate (please read)

There is **no disassembly of Mario Paint's 65816 game logic**. The only public disassembly,
Yoshifanatic1/Mario-Paint-Disassembly, has the ROM layout and sound banks but no annotated
Gnat Attack code. So these numbers are estimates chosen to feel right, not measured from
the ROM:

- **Bug speeds**: 0.9 / 1.15 / 1.4 px per frame by level, plus 8 % per loop.
- **Spawn rates and caps**: 3 / 4 / 6 bugs on screen. "More enemies and faster each level"
  is all the sources say.
- **Enemy mixes by level**: level 1 85 % flies, 15 % Big Flies. Level 1 having Big Flies
  is a guess.
- **Attack timers, orb speed and child homing rate.**
- **Boss movement and attack rhythm.**
- **Hit and hurt boxes**: the swatter mesh is 16×14, and the hurt box is the glove's hand.
- **After a sting**, the screen's orbs and children are cleared and the new glove blinks
  for 2 seconds.
- **The point values behind the high-score table.** The original has **no score**. Points
  are added only for the kids' high-score table: fly 10, Big Fly 20, Parent / Bomb 30,
  boss hit 50, boss 500, extra life 100.
  - At Original the score is not drawn.
  - "Score on screen" draws it bottom-left in the game's digits.
- **Sound effects.** The effect sequences live in an undocumented part of the sound driver.
  Each effect was instead matched against a recording of the real game (`reference/sfx-rips/`,
  from the open-source flicewater project):
  - The matcher searched every BRR sample in the fly-swatting bank at every pitch for the
    best correlation, and measured the volume envelope.
  - The game plays that sample at that pitch with that envelope.
  - Good matches (correlation 0.82–0.92): fly splat, big-bug death, minibug swarm, the
    bug-leaving sound.
  - Swing, hit and one leaving sound match no sample. They are the DSP noise generator,
    filtered to the recording's brightness.
  - Sting and extra life are rough matches (about 0.6).
  - No recorded audio is embedded, only the recipes.
- **Which effect plays when** is our mapping of the recordings' names (swing, hit, bugdie,
  die, extralife, minibugs, bugoffscreen) onto game events.
- **The stage-clear parade** has only Mario and a Koopa. The Goomba, Spiny and Bob-omb that
  join later are missing because no sprite for them could be found.
- **The boss uses grey colours in every level.** The brown laughing King Watinga appears
  only on the game-over screen, as in the artwork it comes from.
- **The clear screen and game over can be skipped by clicking** after 1.5 s. The original
  makes you wait.
- **Pause**:
  - The original's pause panel has CONTINUE / EXIT buttons.
  - Here `P` (or a click) continues, and `Esc` opens our menu.

All three levels and the boss are implemented, plus the endless loop.

## Art: where it came from

All the art is genuine Mario Paint graphics. It is embedded as palette-indexed RLE strings
generated by `tools/extract-art.js`.

- **Glove frames, flies, Fly Parent (5 frames), Fly Children (3 frames)** come from
  `reference/flicewater/`. These are sprite rips shipped with Knucklesfan's open-source
  recreation (github.com/Knucklesfan/flicewater). Those files also supply:
  - the HUD digits and life glove
  - the extra-life gloves
  - the LEVEL and GAME OVER lettering
  - Mario's walk frames
  - the three paper tiles
- **Super Mario Wiki sprite rips** (`reference/mariowiki/`):
  - Big Fly
  - Fly Bomb
  - King Watinga
  - the 15 award icons
- **Native emulator screenshots** from Super Mario Wiki:
  - **King Watinga's hurt frame**, cropped from a 224×192 capture with the background
    removed. The right half is mirrored from the left because the sprite is symmetric and
    the hit star covers the right eye.
  - The **hit star** and the **orb**, from the same capture.
  - The **pause panel** and the **menu pointer glove**, from a 256×224 capture.
- **Resampled from Nintendo's official Nintendo Music artwork**. These are 2296×1722
  filtered upscales, sampled at fitted pixel centres and snapped to a few colours, so they
  are close but not pixel-perfect:
  - CONGRATULATIONS!
  - the Koopa
  - the laughing King Watinga
  - the wingless armed bomb

`tools/out/art-check.png` is a contact sheet of every sprite. `node tools/render-frame.js sheet`
draws the same thing from the embedded data.

## Music: how it was made

`reference/spc/emu/` is Zophar's "Mario Paint (EMU)" set: SPC700 RAM snapshots dumped from
the cartridge. Each one holds Nintendo's N-SPC driver, the sequence data and the BRR
samples. `tools/extract-music.js`:

1. Reads the song table at $26C1, the instrument table at $6E00, the gate and velocity
   tables at $6F00 / $6F08, the pitch table at $0E7A, and the sample directory (DSP DIR).
2. Interprets the N-SPC byte code offline:
   - song list, 8-track blocks, durations with gate/velocity bytes
   - notes, ties, rests, percussion
   - subroutine calls, transpose, tempo, volume, pan, pitch slides
3. Converts the timing with timer 0 = 2 ms, tempo added to an 8-bit accumulator per tick.
4. Decodes the BRR samples, with all four filters and the DSP's 15-bit wrap.

The game plays the notes through WebAudio:

- each note uses its real sample at the DSP pitch (playbackRate = pitch / $1000)
- the S-DSP ADSR envelope and the pan are applied
- loops are honoured

Echo, vibrato and tremolo are not reproduced.

## Files

```
index.html               the whole game (data blocks between ART/MUSIC/SFX-BEGIN/END markers)
tools/test.js            238 headless checks; ends "all tests passed"
tools/harness.js         DOM / canvas / audio stubs (from duck-hunt)
tools/build.js           loads index.html's script under the harness with internals exported
tools/render-frame.js    renders a scenario to tools/out/<name>.png
tools/png.js             PNG decode (with alpha) / encode
tools/extract-art.js     sprite crops -> reference/art.gen.js (+ tools/out/art-check.png)
tools/extract-music.js   SPC -> reference/music.gen.js
tools/extract-sfx.js     recordings -> sample/pitch/envelope recipes -> reference/sfx.gen.js
tools/inject.js          splices the three .gen.js files into index.html
tools/launch.js          opens index.html in Chrome
tools/serve.js           localhost server + rAF-shim page for Chrome automation
reference/               sources: sprite rips, screenshots, SPC snapshots, MIDI, SFX rips, disassembly files
```

## Sources

- Super Mario Wiki, "Gnat Attack" (enemy table, levels, boss, loop and icons, stage-clear
  walkers): https://www.mariowiki.com/Gnat_Attack
- TASVideos submission #7995, DrD2k9's "Gnat Attack" (100 bugs a level, 20 swats, loop
  icons, multi-hit sweep): https://tasvideos.org/7995S
- Retro XP, "Games inside games: Gnat Attack" (Big Fly four-way blast, Fly Children as homing
  rounds, bombs, extra life every 25):
  https://retroxp.substack.com/p/games-inside-games-gnat-attack-mario
- Nintendo Music track artwork (official screenshots), hosted on Super Mario Wiki.
- Zophar's Domain, Mario Paint SPC set: https://www.zophar.net/music/nintendo-snes-spc/mario-paint
- VGMusic MIDIs for Gnat Attack Round 2 / Round 3 (used to check tempo and pitch).
- Yoshifanatic1/Mario-Paint-Disassembly on GitHub (ROM and sound-bank layout).
- Knucklesfan/flicewater on GitHub (sprite and SFX rips).
