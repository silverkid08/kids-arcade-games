# Donkey Kong

A kid-friendly but arcade-faithful clone of Nintendo's 1981 **Donkey Kong** that
runs in Chrome from a single file. The barrel stage (25m) and the rivet stage
(100m) are built from real arcade frames and real arcade sprites; the two
additions for kids are an **invulnerable mode** and **difficulty presets/knobs**.

## Play

Double-click `index.html`, or:

```
node tools/launch.js
```

No install, no server, no network. (The art is embedded as pixel data and the
sound is synthesised, so `file://` is enough.)

| | |
|---|---|
| Move / climb | Arrow keys or WASD |
| Jump | Space or Enter |
| Pause | `P` |
| Sound | `M` |
| Menu | `Esc` |
| Menu navigation | Up/Down pick a row, Left/Right change it, Enter plays |

Sound starts on your first key press or click (Chrome's autoplay rule).

## Difficulty

Presets on the start menu: **Kid**, **Easy**, **Normal**, **Original**. Original
is the arcade with its default DIP switches (3 lives, bonus life at 7000). Each
preset sets the knobs below; touching a knob shows "Custom". High scores are
kept separately for each preset, and a run with the invulnerable toggle on is
scored on its own line marked with `*` so it never overwrites a real score.

| Knob | What it does |
|---|---|
| Barrel throw rate | How often Kong throws (25%-200% of the arcade rhythm) |
| Barrel / fire speed | Rolling barrels and fireballs (40%-200%) |
| Jumpman speed | Walking, climbing and jump length (60%-200%) |
| Bonus timer | Off, or 50%-300% of the arcade's countdown length |
| Fall damage | Off = any fall just lands |
| Lives | 1-9 |
| Starting level | 1-9 |
| Extra life at | Off / 5000 / 7000 / 10000 / 15000 / 20000 |
| Invulnerable | Barrels and fireballs bonk off Jumpman with a flash, falls just land, a bonus timer at 0 resets instead of killing. A badge shows on screen. |

Settings and scores live in `localStorage` under `dk.settings` and `dk.high`.

## What's faithful (at the Original preset)

Numbers below are what the game uses, with where they come from.

- **Screen** 224x256 portrait, 60 Hz fixed-step loop (the board runs at ~60.6 Hz).
- **25m layout** measured pixel-by-pixel from a real arcade frame
  (`reference/mariowiki/Donkey_Kong_Arcade_25m_Screenshot.png`, cross-checked
  against Wikipedia's frame `reference/wikipedia_gameplay.png`): girder top
  surfaces (bottom girder flat at y=248 then rising 1 px every 16 px from
  x=112; the others sloping 1 px per 16 px, alternating direction; Kong's
  girder flat at y=84 then sloping from x=144; Pauline's platform at y=56,
  x 88-135), all 15 ladders including the five **broken ladders** with their
  exact stub lengths, the two long ladders Kong climbs away on, the oil drum at
  (16,232), the barrel stack at (0,51), Kong at (24,52), Pauline at (89,34),
  the top hammer at (17,98). The lower hammer is not visible in either frame
  (it had been taken); it is placed on the second girder at (64,194), which is
  an estimate.
- **100m layout** from `reference/mariowiki/DK_Arcade_100m_Screenshot.png`:
  six blue girders (y 48/88/128/168/208/248), the 14 yellow ladders, the eight
  rivets at x=56 and x=160 on the four middle girders, Kong's platform supports,
  the two hammers at (105,98) and (8,138), and Pauline's parasol, hat and purse
  at their measured spots. Pulling all 8 rivets drops Kong.
- **Jumpman**: walks 1 px/frame (about 60 px/s); a jump is 32 frames with a
  13 px apex, so it clears exactly one 10 px barrel; climbs ladders at
  0.5 px/frame; cannot jump from a ladder; dies from any fall taller than
  himself (16 px), from touching a barrel, fireball or Kong, and when the
  bonus timer reaches 0.
- **Hammer**: about 9 seconds of smashing (sources vary between 8 and 11 s),
  during which he cannot climb or jump. Smashes score 300 / 500 / 800 with the
  arcade's 25% / 50% / 25% odds (classicarcadegaming.com DK probabilities thread).
- **Barrels**: Kong grabs, holds and throws on a cycle of about 2.5 s at level 1
  that quickens with the internal difficulty, with the arcade's 1-in-32 chance
  of an extra pause. The first barrel of every 25m round is a blue "crazy"
  barrel dropped straight down that bounces to the oil drum and lights it; later
  blue barrels that reach the lit drum release a fireball. Barrels roll
  downhill, drop off girder ends and reverse, and roll down broken ladders
  (falling through the gap). Whether a barrel takes a ladder is **Don Hodges'
  decompiled arcade routine** (donhodges.com, "Controlling the barrels in
  Donkey Kong"): always before the oil is lit; never once the barrel is level
  with or below Jumpman; otherwise a random 0-3 is compared with
  `floor(difficulty/2)+1`, then the barrel comes down if Jumpman is directly
  under it or is pushing the joystick toward it, else with a 25% chance.
  Wild barrels bounce down the screen and ignore ladders.
- **Internal difficulty** starts at the level number (max 5) and rises by one
  every ~33 s, as in the arcade; it drives ladder control, Kong's rhythm and
  fireball speed/aggression.
- **Fireballs** wander, reverse at girder ends, climb ladders, prefer Jumpman's
  direction and level more as difficulty rises, and speed up from 0.5 px/frame.
- **Scoring**: 100 for jumping one object, 300 for two, and for three or more
  the screen shows 800 but 500 is paid (the arcade's bug, StrategyWiki);
  hammer 300/500/800; rivets 100 each; Pauline's items 300 on level 1, 500 on
  level 2, 800 after; the remaining bonus is added when a stage is cleared.
- **Bonus timer** starts at `(level*10+40)*100` = 5000, 6000, 7000, then 8000,
  and drops 100 every 2 seconds (c64-wiki / manual: "every two seconds";
  Don Hodges' 33 s difficulty table lands on the same ~100 s round length).
- **Lives** 3, **extra life** at 7000 (DIP default). Level counter `L=01`.
- **Level order** (US): L1 25m,100m; L2 25m,75m,100m; L3 25m,50m,75m,100m;
  L4 25,50,75,25,50,75,100; L5+ adds one more 25/50/75 cycle. **50m (pie
  factory) and 75m (elevators) are not implemented** and are skipped, so you
  get 25m,100m / 25m,100m / 25m,100m / 25m,25m,100m / 25m,25m,25m,100m.
- **Sequences**: the "How high can you get?" screen, Kong carrying Pauline up
  the ladders before the first 25m (intro, skippable with jump), Pauline's
  flashing HELP!, hearts when Jumpman reaches her, Kong climbing off with her
  (25m) or falling on his head (100m), the spinning death animation and halo.
- **Sound** is synthesised with WebAudio: intro climb, "how high" jingle,
  start jingle, walking boops, jump, hammer swings, smash, barrel thump, oil
  drum flare, bonus-timer ticks, item/rivet pickups, the 25m bass loop, death
  tune, stage-clear tune, Kong's fall and the extra-life jingle. They follow
  the arcade's rhythm and shape rather than being sample-exact.

### Known approximations / shortfalls

- 50m and 75m are omitted (see level order above).
- Jumpman's walk/climb speeds and the 32-frame jump are the commonly quoted
  values, not taken from a disassembly table; they feel right against MAME but
  may be off by a frame or two.
- Blue barrel cadence (every 4th barrel after the first), fireball counts
  (level+1, max 5) and the wild-barrel chance are approximations.
- The lower 25m hammer position is estimated; the intro uses the 25m girders
  rather than the arcade's straight-girder intro screen that bends.
- Hammer-time fireballs do not turn blue and flee.
- The level-22 kill screen is not reproduced.

## Art

All sprites, tiles and the font are the genuine arcade bitmaps, embedded in
`index.html` as palette-indexed strings by `tools/build-sprites.js` from:

- `reference/mariowiki/` - individual arcade sprites from the Super Mario Wiki
  (`DK_Arcade_*.png/.gif`: Jumpman idle/run/jump/climb/dead/hammering, Kong
  holding barrels, barrels, oil drum, fireball, hammer, parasol/hat/purse,
  rivet, Pauline, the in-game logo, the "How high" Kong head) plus the real
  224x256 frames of the 25m, 100m, title and game-over screens used for layout
  and for the girder/ladder/BONUS-box tiles.
- `reference/jsaro/` - the Spriters-Resource arcade sheets as mirrored in the
  open-source `j-saro/Donkey-Kong-1981-Clone` repo (Kong's idle/beat/grab/
  throw/fall/climb frames, Pauline's two poses, rolling and side barrel frames,
  oil flames, hearts, score popups, the font).
- `reference/wikipedia_gameplay.png` - Wikipedia's 25m frame, used to confirm
  the layout and hammer.

The Spriters-Resource site itself is behind a bot wall and could not be
fetched with curl. Colours are mapped onto one palette sampled from the real
frames (`PAL` in `index.html`). `reference/montage.png` shows every embedded
sprite; `reference/out/` holds frames rendered by the game itself under node.

## Repository

```
index.html             the whole game (markup, CSS, one IIFE, embedded art)
README.md              this file
CLAUDE.md              orientation notes for future work
reference/             the arcade frames and sprite rips the art was built from
tools/
  test.js              headless logic suite (node tools/test.js -> "all tests passed")
  harness.js           DOM/canvas/audio stubs
  launch.js            opens index.html in Chrome
  png.js, gif.js       dependency-free PNG/GIF decoders
  build-sprites.js     regenerates the sprite block in index.html from reference/
  render-frame.js      renders real game frames to reference/out/*.png
  sheet-view.js        enlarges a region of an image with a pixel grid
  components.js        lists sprite bounding boxes on a sheet
```

Personal use only; Donkey Kong is Nintendo's.
