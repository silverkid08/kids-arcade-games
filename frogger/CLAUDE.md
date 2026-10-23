# Frogger clone — working notes for Claude

A faithful clone of the 1981 arcade Frogger in one file, plus an invulnerable
mode and difficulty presets/knobs for kids (see `../GAME-SPEC.md` for the
contract every game in this repo follows). The "Original" preset is meant to
be the arcade at its default DIP settings, and the lane tables are the ROM's.

## Run it

```
node tools/launch.js          # or double-click index.html
```

## Verify after ANY change

```
node tools/test.js            # must end "all tests passed" (~60 s, it renders every frame)
node tools/render-frame.js    # writes tools/out/{menu,play,level3}-3x.png; look at them
```

`tools/test.js` runs the real game under `tools/harness.js` (DOM stubs plus a
small software canvas) with `render()` every frame, so drawing crashes are
caught too. The harness window is 236x268 so the canvas renders at 1:1 and
pixel checks can read the 224x256 screen.

Browser verification: the claude-in-chrome extension was available when this
was built. The extension refuses file:// URLs, so the page was served from
localhost (identical bytes, no network use) and the title screen, the preset
buttons, PLAY and the READY frame were screenshotted with a clean console and
settings saved to localStorage. Hopping was only verified headlessly, because
the tab stayed in the background (rAF paused). If the extension is not
available in a session, say so rather than claiming in-browser checks.

## Layout

```
index.html                 markup, CSS, one IIFE of JS, embedded art (between // ART-BEGIN and // ART-END)
reference/
  frogger1-img1.png        GaryCXJk's full arcade rip (768x704)
  frogger1-img3.png        the 10x10 grid of 16x16 sprite cells cut from it
  frogger1-img2.png        the 224x256 arcade background screen
  frogger{1,2,3}.html/.txt the excamera.com Gameduino tutorial pages the rip came from
  ca/                      computerarcheology.com Frogger pages as text (Code.txt is the main-board disassembly) and the song data
  sheet-grid-5x.png        the sprite grid at 5x with cell lines (for looking)
tools/
  test.js                  headless suite
  harness.js               DOM/canvas/audio stubs; __elements, __winListeners, __key
  load-game.js             extracts the script from index.html, appends the export at // EXPORT-POINT
  render-frame.js          renders frames to PNG via the harness
  art.js                   regenerates the art block from reference/ (node tools/art.js [show cells...])
  romdata.js               hex dump of ROM ranges from reference/ca/Code.txt
  sheet.js                 ASCII dump of a PNG region, one letter per palette colour
  png.js, launch.js        copied from pac-man
```

`load-game.js` replaces the `// EXPORT-POINT` comment at the end of the IIFE
with a `globalThis.__FROGGER = {...}` export. **Keep that marker**, and add
new internals to the export list there when tests need them.

## Code map (grep the banner comments, don't trust line numbers)

| Section | What lives there |
|---|---|
| Geometry | `SW/SH`, row y constants, `BAY_X`, `LANE_DEF` (10 lanes, `arm` = ROM lane index) |
| ROM tables | `LANE_TIERS` (5 tiers x 11 arms of [gap, width, count]), `SPEED_RING` (10 x 11 control bytes), `RING_SLOTS`/`RING_PERIOD` |
| Arcade constants | hop 8x2px, timer 60x32 frames, death dwell 16, scoring |
| ART block | `PAL`, `PALCH`, `SPRITE_ROWS`, `BG_RLE`, `FONT`, icons (generated) |
| Settings | `PRESETS`, `KNOBS`, `S`, `applyPreset`, `setKnob`, `loadSettings`, `highKey` |
| Art | `paint()` (string -> canvas, with rotation/flip), `sprite(n, rot, flip)`, `buildBackground`, `glyph`/`drawText` |
| Sound | WebAudio synth; `defineSong` note strings; look-ahead sequencer (`Sound.pump()` is called every tick) |
| Game state | the `game` object, `buildLanes`, `resetFrog`, `newGame`, `startLevel`, `addScore` |
| Lanes | `stepLane` (the ROM speed-ring logic), `objX/objXs` (ring -> screen x, wrap), `rideableAt`, `vehicleHit`, turtle dive, croc mouth |
| Frog | `canHop`, `press`, `landFrog`, `arriveHome`, `killFrog` (invulnerable branch lives here), `updateFrog`, `frogLost` |
| Timer, bay, creatures, lady | `updateTimer`, `updateBay`/`bayVisible`, `updateCreatures`, `updateLady` |
| Main update | `tick()` — one 60 Hz frame; the state machine (menu/ready/play/home/levelend/gameover) |
| Rendering | `drawLane`, `render`, `drawHUD`, `resize` |
| Menu / overlay | preset buttons, knob rows, invulnerable toggle, `showOverlay`, `toMenu` |
| Input | keyboard (`e.repeat` filtered: one hop per press), swipe |
| Main loop | `STEP = 1/60` accumulator |

## The lane model (don't fight it)

Each lane is a **256px ring** (the arcade's 32-cell scrolling tilemap column).
Objects sit at `k * pitch` on the ring, `pitch = (gap + width) * 8` from the
tier table; `lane.scroll` moves the whole ring. Screen x is ring x minus 16
(the visible window is ring 16..240), and `objXs()` returns both copies of an
object when it straddles the wrap. Lane movement is whole pixels decided per
frame by `stepLane` from the control byte; the speed knobs scale it through a
fractional accumulator, so Original is exact.

The frog is resolved against a lane only when `y & 15 <= 8` (ROM rule). In a
river lane it rides whatever `rideableAt` finds (and is moved by `lane.dx`),
otherwise it drowns; on the road `vehicleHit` kills. The frog's x drifts
off the 16px grid while riding; home-bay detection uses `|x - BAY_X| < 6`.

## Gotchas already paid for

- `game.lives` is the number of frogs including the one in play (3 = arcade
  default); game over when it reaches 0 after a death. The HUD draws
  `lives - 1` reserve icons.
- The spawn input lock (`frog.lock`, 20 frames) only counts down in the
  `play` state, so tests must tick past READY (60) + lock before hopping.
- The median row pays no hop points (ROM); tests assert it.
- Object count per lane is capped so the last object fits on the ring:
  `floor((256 - width) / pitch) + 1` (3 medium logs at pitch 88 do fit; a
  naive `256 / pitch` cap drops one).
- The art block is generated; edit `tools/art.js`, not the strings. Palette
  chars are `0-9a-e` and the RLE counts use letters `g`+ so digits never clash.
- The software canvas only does 1:1 `drawImage`, `fillRect`, `putImageData`;
  the game must not rely on canvas rotation (sprites are pre-rotated by
  `paint()`), gradients or text.
- Large bash heredocs fail in this environment; use the Write tool and a
  small node script for multi-line edits.
- `Sound.play(name, onEnd)` stops the current tune; the main theme loops,
  the others call back when done. Keep audio calls out of pure logic paths
  the tests drive thousands of times (they are no-ops under the harness
  because `window.AudioContext` is undefined).

## State of the work

Done and verified headlessly: ROM lane layouts for all 5 tiers and the ROM
speed ring, hop/timer/death timing, scoring incl. the median exception, time
bonus, extra life once at 20,000, home bays with fly/gator, crocodile from
level 2, snakes/otters/lady frog from level 3, diving turtles, all knobs,
presets, invulnerable mode, localStorage round trip, long soaks on levels
1-6 with rendering, arcade music data.

Not done / approximated: attract demo, high-score initials, the 20 arcade
home jingles (one stand-in), the exact creature choreography (see README
"Known shortfalls").
