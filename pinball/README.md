# PINBALL (NES, 1984): a kids' clone

This is a clone of Nintendo and HAL Laboratory's **Pinball** (Famicom 1984, NES 1985). It is one `index.html`. Open it in Chrome from `file://` (or run `node tools/launch.js`). It needs no network: the graphics, music and sound effects are all embedded.

## Controls

| Action | Keys | Touch |
|---|---|---|
| Left flipper | Left arrow, `Z`, Left Shift | left half of the screen |
| Right flipper | Right arrow, `/`, Right Shift | right half |
| Plunger (striker) | hold Down or Space, release to launch. Holding longer gives more power, full after 19 frames | bottom of the right half while the ball is on the striker |
| Nudge | Up or `N` (only if the NUDGE knob is on) | |
| Pause / sound / menu | `P` / `M` / `Esc` | |

Menu keys: Up and Down pick a row, Left and Right change it, `1`-`4` pick a preset, Enter plays.

## The table

The table has two screens, as on the NES. **Scene A** is the upper screen and **scene B** the lower one. The screen shown flips as the ball crosses between them. The **Bonus Stage** is reached through the hole at the top right of scene B.

Scoring follows the ROM's score table (the disassembly's RAM sheet) and the Super Mario Wiki articles, which quote the 1985 manual.

| Feature | Rule |
|---|---|
| Top chutes (A) | 500 / 1000 / 500 |
| Walls beside the chutes | 10 |
| Lane lights, left lane (8) | 100 each. When all are out, the seals balance beach balls for 20 × 100 (+2000), then the lights come back |
| "100" box | 100 × the digit shown. The digit goes up by one each hit (1 to 9) |
| Orange diagonal | 10 |
| Pop bumper | 100 |
| Left flags (4) | 100 each. All four give +1000 and the flags come back |
| Right lane | 500. Starts the three slot windows spinning and drops the up-post |
| Pink slot target (slides 116-159) | 100. Stops the window under it |
| 3 penguins | 1000. Up-post until the right lane; all scoring is doubled meanwhile |
| 3 × 3 | 3330, up-post for 6 s |
| 3 × 7 | 7770, up-post for 14 s |
| Table colour during a jackpot | pink ($15) while the up-post is up |
| Hole kicker (A) | holds the ball 240 ball steps (80 frames in Game A), then kicks it up-left |
| Cards (B) | 500 per card lane. All five give +5000, the scene B up-post (until the ball is lost) and a yellow table ($27) |
| Targets 1-7 (B) | 100 each. All seven give +1000 and open the EXIT to the striker |
| Side lanes (white marks) | the targets come back and the EXIT opens |
| Bumpers (B) | 100. Slingshots: 10 |
| Eggs | crack, then hatch over 5 steps. Three chicks at once raise stoppers in both outlanes; a stopper bounces the ball up once, then goes |
| Extra ball | every 50,000 |
| Up-post (A) | also raised at 100,000 and at 150,000 |
| Bonus Stage lamps | 10 each, colour yellow → blue → pink. Four lamps of one number the same colour shrink that number's floor under Pauline |
| Bonus Stage rescue | Pauline falls through a gap two tiles wide. Catch her on Mario's paddle and carry her to an EXIT for 10,000 |
| Bonus Stage, missed | dropping Pauline costs a ball. If the ball falls off the bottom, it comes back out of scene A's hole kicker |

Every feature resets when a ball is lost, as the ROM does at `$C06C`. The game starts with three balls; the HUD shows the balls in reserve, like the NES. There is a separate high score per preset, per game (A/B), and for invulnerable runs.

The original has no **end-of-ball bonus count**: the disassembly has no tally routine, and the only "count" is the striker charging. So this clone has none either. The SCORE MULTIPLIER knob is the kid-mode bonus instead. The NES also has **no nudge or tilt**, so NUDGE is off at Original.

## Presets and knobs

| Knob | Kid | Easy | Normal | Original |
|---|---|---|---|---|
| Ball speed (time scale) | 60% | 75% | 90% | 100% |
| Flipper strength | 130% | 115% | 100% | 100% |
| Flipper size | 150% | 125% | 100% | 100% |
| Ball saver | always | 15 s | 5 s | off |
| Drain posts | outlanes | outlanes | off | off |
| Nudge | on, no tilt | on, can tilt | on, can tilt | off (as NES) |
| Balls | 5 | 5 | 3 | 3 |
| Score multiplier | ×2 | ×1 | ×1 | ×1 |
| Invulnerable | off | off | off | off |

GAME A/B is chosen separately and is not part of a preset. **Game B** runs 4 ball steps per frame instead of 3. Gravity per frame is therefore 16/9 as strong (the "steeper table"), and the flipper poses change every 2 frames instead of every 3.

With nudge on, a nudge gives the ball a small kick. "Can tilt" means 4 nudges within 4 seconds cause TILT: the flippers go dead and nothing scores until the ball drains.

**Invulnerable:** a drained ball goes back to the striker and no ball is lost. Losing Pauline costs nothing either. An INVULN badge shows in the HUD, and the high score is kept separately.

## What is faithful

- **Art.** The graphics are the real NES graphics. The cartridge was rebuilt byte-exact from the public disassembly [rbmichael/pinball_nes_disassembly](https://github.com/rbmichael/pinball_nes_disassembly) (by "ninespaces"; PRG CRC32 91d33e3c, CHR f2a53b3d). It was then **run** in a small offline NES emulator (`tools/nes.js`, CPU core adapted from `../dr-mario`) to record:
  - the title, scene A, scene B and Bonus Stage nametables, attributes and palettes;
  - the background patches the ROM writes (cards face up, up-post, EXIT, flags, spring);
  - the sprite layouts of the ball (and its shrinking frames), the flippers in all three poses, the penguin, 3 and 7 slot symbols, the seals and beach balls, eggs, cracking eggs, chicks, stoppers, Mario's walk with the paddle, Pauline's walk, the floors and the plunger spring.

  The whole 8 KB CHR ROM is embedded and drawn tile by tile. Nothing is a placeholder. The vgmaps.com map of both tables (`reference/vgmaps-Pinball-Tables.png`) was used to cross-check. Six glyphs for on-screen messages (V X K H F W, and `!`) are not in either ROM font. They are hand-drawn in the same style.
- **Sound.** The music and effects are the ROM's own. `tools/extract-audio.js` ran the ROM's sound engine for every request bit and sampled each APU channel per frame. WebAudio then plays square (4 duties), the 4-bit triangle and LFSR noise.
- **Rules and timings.** These come from the disassembly or were measured from the running ROM (`node tools/rom-measure.js`):
  - gravity of 4/256 px per 5 ball steps;
  - 3 or 4 steps per frame;
  - striker speed (200+16n)/256 px per step, full after 19 frames, with the spring springing back first;
  - flipper pose timing;
  - kicker hold and eject velocity;
  - slot spin (one symbol per 4 frames) and slot-target motion (1 px per 4 frames, 8-frame pause);
  - Mario at 1 px/frame with the paddle's left edge from 112 to 160;
  - all the per-ball resets.
- **What is solid.** The ROM was probed by dropping the ball on things. The seals, penguin windows, cards and eggs are pictures that the ball rolls through; flags and targets are hit zones. The bumpers, slingshots, pink slot target, stoppers, up-posts and lane-post walls are solid. The flaps at the top of the shooter lane and the left lane are one-way, as is the flap at the foot of the right lane.

## What is approximate

- **Ball physics are a re-implementation, not the ROM's routine.** The ROM uses tile-based collision with "squares" and polar velocity tables; that code was not decoded. This clone uses:
  - a fixed-timestep model with continuous collision (swept circle against capsule segments and circles);
  - walls traced automatically from the real background pixels (`tools/trace.js`);
  - flippers that sweep and push the ball with ω × (r + 14 px).

  Its constants were fitted to the ROM's behaviour:

  | Quantity | Clone | ROM |
  |---|---|---|
  | Free fall in 40 frames, Game A | 22.7 px | 23.4 px |
  | Free fall in 40 frames, Game B | 40.3 px | 42.8 px |
  | Flipper exit, pivot → tip (px/frame) | 3.3 / 3.7 / 4.4 / 5.1 / 6.0 | 2.8 / 4.2 / 4.6 / 5.1 / 5.5 |

  Tuned by eye: wall restitution (0.4, close to a measured 0.38), the slingshot kick, stopper bounce, nudge strength, the Bonus Stage paddle angles, Pauline's fall speed and the rule for when she falls (a gap of 2 tiles).
- **Lamp colour rule.** The wiki says only "the same colour". Here a number's four lamps must all match and not be the starting yellow.
- **Exit.** It stays open until the ball reaches the striker, as `$012B` is cleared there.
- **Not implemented.** 2-player games, VS. Pinball differences, and the title demo.

## Verification

- `node tools/test.js` gives **218 checks, "all tests passed"**, in about 25 s. It covers:
  - ROM rebuild and art presence, and the measured constants;
  - gravity in A and B, striker speeds, flipper timing and exit speeds against the ROM;
  - a no-tunnelling fuzz: 1,500 random launches with random flipping in Game A (630k frames, every sub-step checked against every wall), 600 in Game B, and 2,000 top-speed shots in all directions;
  - every scoring feature, the jackpots and colour changes, screen flips, drain and ball count, game over and high score;
  - the Bonus Stage (entry, lamps, floors, catch, rescue, miss, exit to the kicker), tilt, every knob, invulnerable mode, settings round-trip, keyboard and touch;
  - thousands of frames in every state with `render()` every frame.
- `node tools/render-frame.js <scenario>` writes PNGs; all scenarios were viewed. `colliders` draws every collider over the art.
- **Chrome.** Checked through `node tools/serve.js` at `http://localhost:8737/shim.html`: the menu, a launch round the top arc, cards flipping, a chick hatching, flippers up, and no console errors.
