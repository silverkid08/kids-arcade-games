# Duck Hunt (NES, 1984) for kids

A clone of Nintendo's Duck Hunt that you play with the **mouse** instead of the Zapper.
It is meant for practising mouse skills: pointing, following a moving target, and
clicking accurately. Open `index.html` in Chrome (double-click it, or run
`node tools/launch.js`). It works from `file://` with no network and no install.

## Controls

| Input | Action |
|---|---|
| Mouse move | aim the crosshair (the normal cursor is hidden over the game) |
| Left click / tap | fire |
| P | pause (on the NES unpausing waits 48 frames, and so does this) |
| M | sound on/off |
| Esc | menu (pauses the game; RESUME continues, PLAY starts a new game) |
| Q while paused | quit to the menu |
| Menu | ↑↓ choose a row, ←→ change it, 1-4 pick a preset, Enter to play. Every option can also be clicked. |

Space does not fire. Hover-and-hold mode (below) does not need a click at all.

## Presets and options

The presets are **Kid**, **Easy**, **Normal** and **Original**. Changing any option
after picking a preset shows **CUSTOM**. The Original preset is the NES game.

| Option | Original | What it does |
|---|---|---|
| Ducks at once | 1 (Game A) | 1 = Game A, 2 = Game B. This doubles as the NES game select, so it is not part of the presets. |
| Duck speed | 100% | Scales the ROM's steps per frame. The per-round speed-up still applies. |
| Duck size | 1x | 1x, 1.5x or 2x. The duck's hit box grows with it. |
| Hit forgiveness | none | Extra pixels added around the duck's hit box. |
| Crosshair size / colour | medium / white | Small to huge; white, red, yellow, cyan, green or black. Every colour has an outline. |
| Aim magnet | off | 1-5. When the crosshair is near a flying duck it is pulled part of the way toward it. |
| Shots per duck | 3 | 3, 4, 5, 6, 8, 10 or unlimited. In Game B this is per pair, as on the NES. |
| Fly-away time | original | Original, x1.5, x2, x3 or never. |
| Ducks per round | 10 | 2, 4, 6, 8 or 10. With fewer ducks the Original quota is scaled down to match. |
| Hit quota | original table | The original table, a fixed number from 1 to 6, or off. |
| Starting round | 1 | 1-30. Speed, quota, score and hit box all follow that round. |
| Fire mode | click | Click, or **hover + hold**: keep the crosshair on a duck for the hold time and it fires by itself. This is for children who can follow a duck but cannot click yet. |
| Hover hold time | 1 s | 0.3-3 s. A green ring around the crosshair fills up while you hold. |
| Dog laughs at miss | on | Off skips the laughing dog. |
| Zapper flash | on | On the NES each shot blacks out the screen and shows white target boxes for a frame. Every preset except Original turns this off. |
| No-fail mode | off | Missing the quota never ends the game: a **TRY AGAIN** box appears and the round is replayed. A **NO-FAIL** badge stays on screen. |

**Kid**: big (2x), slow (40%) ducks, +12 px of hit forgiveness, a huge red crosshair,
aim magnet 3, unlimited shots, ducks never fly away, no quota, no laughing, and
no-fail mode on.

**Easy**: 60% speed, 1.5x ducks, +6 px, a large yellow crosshair, magnet 2, 5 shots,
fly-away time x2, and a quota of 4.

**Normal**: 85% speed, +2 px, fly-away time x1.5, otherwise the NES rules (no flash).

## Mouse-skill tracking for parents

- **On screen.** During the end-of-round tally and on the game-over screen a box shows
  HIT n/10, ACC (accuracy = hits ÷ shots), TIME (average seconds from a duck taking
  off to being hit) and BEST STREAK (ducks hit in a row; a missed shot or a duck that
  escapes ends the streak).
- **On the menu.** After a game the menu shows that game's summary. It also shows totals
  for the current preset: games played, overall and best accuracy, fastest average time
  and best streak.
- **History.** The **PROGRESS** button lists the last 10 games with date, preset, game,
  round, score, shots, accuracy, average time and streak. Below the list it compares the
  older half with the newer half so you can see improvement.

Everything is kept in `localStorage` under keys starting `duckhunt.`:

| Key | Holds |
|---|---|
| `settings` | the options |
| `high.<preset>.<A\|B>` | the high score per preset and per game |
| `high.<preset>.<A\|B>.nofail` | the separate high score for games with no-fail on, shown with `*` |
| `stats.<preset>` | the per-preset totals |
| `history` | the last 10 games |

Games with no shots fired are not recorded. If storage is blocked, the game still runs.

## What is faithful (Original preset)

Every rule comes from the annotated disassembly
[RussianManSMWC/Duck-ssembly-Hunt](https://github.com/RussianManSMWC/Duck-ssembly-Hunt)
(copy in `reference/disasm/`, with AaronBottegal/DuckHuntSourceCode alongside it). The
ROM addresses are in the code comments.

**Screen and timing**
- 256x240 at 60 Hz with a fixed timestep, scaled by whole numbers.
- The NES priority rules apply: ducks fly behind the tree, the bushes and the grass;
  the dog walks in front and drops behind the grass after its jump.

**How ducks fly**
- 16 directions, each with its own repeating step pattern (DATA_E661).
- Speed is a number of steps per frame from DATA_EA00, cycled in groups of 4.
- Game A speed rises with the round: 2, 2.5, 2.5, 3, 3, 3.5, 3.5, 4, 4, 5, 5, then
  6 steps per frame from round 12 (E75A). In Game A speed does not depend on colour.
- In Game B speed depends on both round and colour (E73C).
- **Game A**: each duck takes off on one of 16 scripted lift-offs. Once above y=$88 it
  flies freely. At an edge it bounces using the ROM's reflection rule: mirror the
  direction and add 0-2 at random, with special handling for the four straight
  directions (CAED). It stays within the play area.
- **Game B**: both ducks fly the ROM's 16 whole-flight scripts (E60B). The second duck
  takes off 1-64 frames after the first.

**Fly-away**
- The Game A fly-away timer counts down every other frame from 125, 93 or 62 (rounds
  1-10, 11-19, 20+), so 250, 186 or 124 frames once the duck has taken off.
- When it runs out, or when the third shot misses, the message **FLY AWAY** appears,
  the sky turns pink (palette $36) and the duck flies off. The sky goes blue again when
  the dog pops up.
- In Game B the ROM never shows FLY AWAY. The ducks simply leave at the end of their
  script, or fly straight up when the shots run out.

**Shooting**
- 3 shots per duck in Game A, 3 per pair in Game B.
- Only a flying duck can be hit, and one shot hits at most one duck (duck 1 is
  checked first).
- The hit box is the Zapper target shape: 32x32, shrinking at rounds 24 and 27. The
  part of it inside the grass does not count.

**Ducks**
- Colours: round 1 has only black and blue ducks; later rounds also have red (E766).
- Score per duck:

  | Duck | Rounds 1-5 | Rounds 6-10 | Round 11+ |
  |---|---|---|---|
  | Black | 500 | 800 | 1000 |
  | Blue | 1000 | 1600 | 2000 |
  | Red | 1500 | 2400 | 3000 |

- A hit duck holds the "shot" pose for 21 frames and quacks, then shows its score.
  It falls at 2 px per frame, wobbling and alternating two spin frames, and a thud
  plays when it lands.
- Wing flaps play every 8 frames and quacks every 65 frames (every 21 frames once out
  of shots).

**The dog**
- The intro is driven by the ROM's own animation scripts: walk, sniff, walk, alert,
  and the per-frame jump arc with barks. The ROUND n box shows for 128 frames.
- From round 2 on the dog starts closer to the centre.
- It pops up holding one or two ducks at the spot where the last duck fell (clamped
  to x 72-160), or laughs in the centre after a miss.

**End of round**
- The hit icons slide together, one step every 16 frames, with the shuffle sound.
- If the quota is met, the round-clear tune plays and the icons blink for 15 steps.
  GOOD!! appears every 10th round.
- 10 of 10 gives **PERFECT!!** with a bonus of 10000 (rounds ≤10), 15000 (≤15),
  20000 (≤20) or 30000.
- If the quota is missed, **GAME OVER** appears with its jingle. After 132 frames the
  game-over theme plays and the dog laughs for 231 frames, then you return to the menu.
- The quota table (EC02) is 6 for rounds 1-10, 7 for 11-12, 8 for 13-14, 9 for 15-19,
  and 10 from round 20. The quota bar under the hit icons shows it.

**HUD and screens**
- The HUD matches the real screen: R=n, SHOT with 3 bullets (SHOT blinks when empty),
  the HIT row of 10 icons (the current duck's icon blinks, hit ducks turn red), the
  quota bar and a 6-digit SCORE.
- Message boxes sit at the ROM's tile positions.
- The title screen layout, including TOP SCORE (12000 by default, as in the ROM),
  is drawn behind the menu.

**Sound**
The music and effects are **decoded from the ROM's sound data** (see
`tools/extract-music.js`) and played with WebAudio:

| Tunes | Effects |
|---|---|
| title tune | gunshot (noise sweep) |
| game-start jingle | wing flap |
| got-duck jingle | falling whistle |
| round clear | thud |
| perfect fanfare | dog laugh |
| game-over jingle and theme | **quack** and **bark**, played from the ROM's own 1-bit delta samples |
| pause | |
| hit-table shuffle | |

## What is approximate or left out

- **Game C (clay shooting) is not implemented.**
- No round-0 "kill screen": the round counter stops at 99.
- The Zapper becomes a mouse pointer, so a hit is exact to the pixel instead of being
  light-sensor based. The NES trick of steering the duck with controller 2 is not
  included.
- The ROM's random number generator is replaced by a small PRNG. All the random
  choices are still made in the same places, with the same ranges.
- Hand-made pieces, because they were in none of the rips:

  | Piece | Status |
  |---|---|
  | message-box border | drawn in the HUD-frame style |
  | font letters F, V, W, X and the "!!" tile | hand-encoded in the same 7x7 style |
  | `/ % : + -` | hand-encoded |
  | score pop-up digits | compact 3x5 digits (the ROM's two-tile pop-ups are not ripped anywhere I could reach) |

- The two dog walk frames that share a tail pose were ordered by their tile layout,
  so the leg order within the cycle may be swapped.
- The sound is synthesised from register data: square waves (PeriodicWave), a triangle
  and LFSR noise. It is not a cycle-exact APU, and envelopes are approximated per frame.
- Kid-mode additions that are not in the ROM:
  - the TRY AGAIN box
  - the NO-FAIL badge
  - the statistics box
  - the crosshair (the NES has none)

## Where the art came from

Spriters-resource blocks scripted downloads, so these GitHub-hosted copies were used.
They are in `reference/sheets/`; personal use only.

| Art | Source |
|---|---|
| Backdrop, HUD frames, bullet, duck icons, quota tile, score digits | `wikipedia-gameplay.png`: the genuine 256x224 NES screenshot of Game A from English Wikipedia (*Duck hunt pic.PNG*). The duck in it was painted out, and the missing 8 lines top and bottom were filled with sky and dirt. |
| Ducks (3 colours, every flight, shot and fall frame) and all dog frames | `kenwheeler-sprites.png`: a 1x copy of the classic spriters-resource rip, from github.com/kenwheeler/react-hunt. PakkuDon/duck-hunt has the same sheet at 2x. |
| Title logo and font | `etiene-sprites.png`: Tyler Alverson's rip, from github.com/Etiene/jsduckhunt |

Every frame is placed exactly where the NES draws it. `tools/asm-meta.js` parses the
metasprite tables in the disassembly, and `tools/extract-art.js` slides each ripped
frame over that tile mask until all of its pixels sit inside the image's tiles. Every
frame fits with no pixel outside and no empty tile. Colours are the FCEUX NES palette
values the rips and the screenshot use.

## Sources for the rules

- Disassembly: RussianManSMWC/Duck-ssembly-Hunt and AaronBottegal/DuckHuntSourceCode
  (GitHub). The tables quoted above come from here.
- StrategyWiki, *Duck Hunt*: the Game A and Game B descriptions, 10 ducks per round,
  3 bullets, the perfect bonus and the round-99 behaviour.
- Wikipedia, *Duck Hunt*: the screenshot and a general description.

## Files

| Path | What |
|---|---|
| `index.html` | the whole game (art and sound data embedded) |
| `tools/test.js` | headless test suite; `node tools/test.js` ends with "all tests passed" |
| `tools/render-frame.js` | renders a game state to `tools/out/<scenario>.png` |
| `tools/harness.js`, `tools/build.js` | the node stubs and the loader the tools use |
| `tools/extract-art.js`, `tools/asm-meta.js` | rebuild the art block; then run `tools/inject.js` |
| `tools/extract-music.js` | rebuilds the sound data; then run `tools/inject.js` |
| `tools/launch.js` | opens the game in Chrome |
| `tools/png.js` | dependency-free PNG reader and writer |
| `reference/` | the disassembly, the sprite sheets and the generated data blocks |
