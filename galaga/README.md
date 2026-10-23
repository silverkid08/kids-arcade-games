# Galaga

A clone of Namco's 1981 arcade Galaga that runs in Chrome from a single file,
with a kid-friendly settings menu: four difficulty presets, nine knobs, and an
invulnerable mode so younger players can enjoy the dives and the tractor beam
without losing.

## Play

Double-click `index.html`, or:

```
node tools/launch.js
```

No install, no server, no dependencies. The art, the sound and the code are all
inside `index.html`.

| | |
|---|---|
| Move | Left / Right arrows or `A` / `D` (left and right thirds of the screen on touch) |
| Fire | Space (or Enter, Z, X, Ctrl; the middle of the screen on touch) |
| Pause | `P` (or `Esc`) |
| Sound | `M` |
| Menu | `Esc` while paused |
| Menu keys | Up/Down pick a setting, Left/Right change it, `1`-`4` pick a preset, `I` toggles invulnerable, Enter plays |

Sound starts on your first keypress or click: Chrome blocks audio until you
interact with the page.

## Presets and knobs

| Preset | Dives | Enemy shots | Enemy speed | Fighter speed | Tractor beam | Auto fire | Lives | Extra life |
|---|---|---|---|---|---|---|---|---|
| Kid | 30% | 20% | 50% | 130% | off | on | 5 | 5,000 |
| Easy | 60% | 50% | 75% | 115% | on | on | 5 | 10,000 |
| Normal | 80% | 80% | 90% | 100% | on | off | 3 | 20,000 |
| Original | 100% | 100% | 100% | 100% | on | off | 3 | 20,000 |

Original is the arcade's factory DIP-switch setting (3 fighters, bonus at
20,000 / 70,000 / every 70,000, rank B). Touch any knob and the preset becomes
**Custom**. There is also a starting-stage knob (1-30) and **Invulnerable**:
when it is on, anything that would have killed you just flashes a white box
around the fighter, an `INV` badge shows in the HUD, and your score goes to its
own high-score slot instead of the preset's.

High scores are kept per preset (Kid, Easy, Normal, Original, Custom, and a
separate Invulnerable slot) in `localStorage` under `galaga.*`, along with your
last settings and the mute state.

## What's faithful

- 224x288 screen at 60 Hz, with the arcade's two-layer twinkling starfield,
  the 1UP / HIGH SCORE header, the spare fighters bottom-left and the stage
  badges bottom-right (1, 5, 10, 20, 30, 50 emblems).
- The fighter moves horizontally only and can have two shots on screen (four
  as a dual fighter).
- The 40-enemy formation: 4 Boss Galaga (two hits, turning blue after the
  first), 16 butterflies (Goei) and 20 bees (Zako), entering in five waves of
  eight. The formation sways side to side while filling and "breathes"
  (expands and contracts) once everyone is in. Three different entrance
  patterns cycle through the stages the way the arcade's do (stages 1, 2, then
  4-5-6, 8-9-10 ...).
- Bees dive with a loop and sometimes swoop back up; butterflies weave; bosses
  dive with up to two butterfly escorts. Enemies shoot while diving, and
  nothing shoots while sitting in formation.
- Tractor beam: a boss hovers over the fighter and opens the beam. Only a
  single fighter can be captured; a captured fighter costs a life and then
  rides above the boss in formation. Shoot that boss while it dives and the
  fighter spins free and docks on your side (dual fighter, wider shot, bigger
  target). Shoot it in formation and the captured fighter turns on you; it is
  worth 1,000 when destroyed. A captured fighter that survives the stage comes
  back in with the bosses in the next one.
- Scoring: bee 50 / 100 (formation / diving), butterfly 80 / 160, boss 150 /
  400, boss with one escort 800, with two escorts 1,600. Extra fighters at
  20,000, 70,000 and every 70,000 after that.
- Challenging stage every fourth stage (3, 7, 11 ...): forty enemies in five
  groups of eight fly through set patterns and never shoot. Hits are tallied,
  100 each, a full group of eight is 1,000 (1,500 / 2,000 / 3,000 on later
  challenging stages), and 40 of 40 is PERFECT with the 10,000 special bonus.
- Difficulty "rank" rises with every stage (dives more frequent and faster,
  more shots, more divers at once), with the arcade's pause of rank through
  the challenging stage.
- Game over shows the arcade's results card: shots fired, number of hits,
  hit-miss ratio.
- Sound is synthesised with WebAudio: the start tune, the stage flag, shots,
  the dive whine, explosions, the beam, the capture / rescue jingles and the
  challenging-stage tune.

## What's approximate

Honesty section. These were done by eye and ear rather than from the ROM, and
are the places to improve if you want closer fidelity.

- **Speeds and timings.** Fighter 2 px/frame, player shot 7 px/frame, enemy
  shots 3-5.5 px/frame, dives 2.4-4.2 px/frame, 150 frames between entry
  waves, 210-frame beam. They feel right against MAME but were not measured
  from the ROM.
- **Flight paths.** Entry loops, dive curves and challenging-stage figures are
  Catmull-Rom splines drawn to look like the arcade's. The shapes are close;
  they are not the arcade's byte-for-byte path tables.
- **Stages.** Stages 1, 2 and 3 (first challenging stage) are the ones built
  explicitly, with their own entrance patterns and the arcade's enemy
  composition. From stage 4 on the game loops those patterns with the rising
  rank; the later challenging stages use the dragonfly / satellite /
  Enterprise sprites, but the group line-ups are my approximation. The
  stage-4+ "transform" enemies (scorpion, Galaxian flagship, Bosconian spy
  ship) have their sprites in the file but do not yet appear in play.
- **Attack selection.** Which enemy dives next is weighted random (bosses /
  butterflies / bees, favouring the edges of the formation) rather than the
  arcade's exact pick order.
- **Tunes.** Approximations of the real jingles, not transcriptions.
- **Challenging-stage line-up.** Stage 3 uses bees, butterflies and bosses;
  the arcade's exact group order for each challenging stage is not reproduced.

## Where the art came from

`reference/galaga-arcade-sheet.png` is a genuine rip of the arcade sprite
graphics (the 256x256 sheet from the open-source `ihalseide/Galaga` repository,
which is a straight dump of the arcade sprite ROM with its palette applied).
`tools/sprites.js` cuts the frames the game needs out of it (fighter, captured
fighter, boss green/blue, butterfly, bee, the challenging-stage ships, missiles,
explosions, the three beam frames, the stage badges, the 8x8 font and the 4x8
score-popup digits) and writes them into `index.html` as run-length strings, so
the game needs no image files and no network.

## Repository

```
index.html                 the whole game
reference/                 the ripped arcade sprite sheet
tools/launch.js            opens the game in Chrome
tools/test.js              headless logic suite (node tools/test.js)
tools/harness.js           DOM / canvas / audio stubs so the game runs under node
tools/render-frame.js      renders real game frames to PNG without a browser
tools/sprites.js           regenerates the sprite block in index.html from the sheet
tools/png.js               dependency-free PNG decode / encode
CLAUDE.md                  orientation notes for future work
```

Checks:

```
node tools/test.js           # must end "all tests passed"
node tools/render-frame.js   # writes tools/out/*.png to eyeball the art
```

Sources used for the rules: StrategyWiki's Galaga Gameplay and Walkthrough
pages (formation, scoring, challenging stages, capture rules), Computer
Archeology's Galaga notes, and MAME's DIP-switch defaults for the Original
preset.
