# Gnat Attack clone: working notes for Claude

This is a clone of Mario Paint's fly-swatting game (SNES, 1992), played with the mouse.

- It follows `../GAME-SPEC.md`.
- Its tooling and its mouse handling come from `../duck-hunt/`:
  - mouse-coordinate mapping (`toGame`)
  - hidden CSS cursor
  - hover-and-hold mode
  - stats and history
- README.md lists the sources, what is faithful, and what is estimated.

## Run and verify

```
node tools/launch.js                 # open in Chrome
node tools/test.js                   # must end "all tests passed" (238 checks, ~35 s)
node tools/render-frame.js play      # then Read tools/out/play.png
```

`render-frame.js` scenarios:

- menu, intro, play, swat
- level2, level3, hurt, lifeup
- boss, bosshit, clear, final
- gameover, pause, kid, hover
- loops, sheet

`tools/build.js` cuts the IIFE out of index.html and appends an `EXPORT` of the internals
as `globalThis.__GA`. If a test needs a new top-level function, add it there.

### Checking in Chrome

The claude-in-chrome extension refuses `file://`. Run `node tools/serve.js` and open
`http://localhost:8737/shim.html`.

- `shim.html` injects a Web-Worker `requestAnimationFrame`. Automation tabs act as
  background tabs and get no rAF.
- Use `element.click()` and dispatched `MouseEvent('mousedown'/'mousemove')` from
  javascript_tool.
- Open your own tab and close it when you are done.

## Generated data (do not hand-edit the blocks in index.html)

- `/*ART-BEGIN*/ const ART` comes from `node tools/extract-art.js`, which writes
  `reference/art.gen.js`.
  - Each sprite is `[w, h, x, y, rle]`. `x,y` is the top-left relative to the anchor.
    `rle` is digits followed by a palette char from `CH`; `.` is transparent.
  - Glove anchor = centre of the swatter mesh, cell (16,20).
  - Boss anchor = body centre (32,34).
  - Screenshot crops use `cropScreenshot`, which flood-fills the background tile from the
    crop edge.
    - In 224×192 captures (Watinga.png and the Nintendo Music images) the tile row is
      `(y-1)&15`.
    - In the 256×224 pause capture the tile is at `(x-16)&15, (y-16)&15`.
  - Nintendo Music images are resampled at `x*10.27-3.6`, `y*9.0-3.5`. This mapping was
    fitted to the grid lines.
- `/*MUSIC-BEGIN*/ const MUSIC` comes from `node tools/extract-music.js`
  (`reference/music.gen.js`). It holds:
  - `songs.<name> = { len, loop, notes: [[t, dur, dspPitch, vol, pan, inst, channel, slide?], ...] }`
  - `inst.iN = { s: sampleId, a1, a2, g }` (ADSR1, ADSR2, GAIN)
  - `samples.sN = { loop, data: base64 int8 at 32 kHz }`
  - `sfxSamples[srcn] -> sampleId`
- `/*SFX-BEGIN*/ const SFX` comes from `node tools/extract-sfx.js` (`reference/sfx.gen.js`).
  It is a list of notes per effect: `{t, s: srcn, r: playbackRate, env: [5 ms RMS steps]}`
  or `{t, noise: Hz, env}`.
  - Run extract-sfx **before** extract-music, so the music file includes the SFX samples.
- After running any extractor, run `node tools/inject.js`.

## Model

- **Screen.**
  - SNES pixels, 256×224. `PF` = visible play area x 16..239, y 15..206. Tiles start at
    (16,16).
  - Rendering is software into a Uint32 ImageData:
    1. `BG[level]` copy
    2. lifeup
    3. boss
    4. bugs
    5. orbs
    6. fx
    7. parade
    8. HUD
    9. texts
    10. glove
    11. pause panel
  - `draw(sprite, ax, ay, {s, fx, fy, white, solid, clip})` scales with nearest-neighbour.
- **Timing.** `update()` is one 60 Hz frame. `game.mode` is one of:
  - `menu`
  - `intro`: LEVEL n, 120 frames
  - `play`
  - `boss`
  - `clear`: lasts as long as the jingle; click to skip after 90 frames
  - `gameover`: 330 frames
- **Glove.** `game.glove.phase` is 0 idle, 1 raise (`SWAT_UP` frames), 2 down
  (`SWAT_DOWN` frames), then 3 raise.
  - While the phase is 2, `swatHits()` runs every frame.
  - `state` is `ok`, `hurt` (60 frames), `shrink` (30 frames, then a life is lost),
    or `gone` at game over.
- **Bugs.** `bugTick` holds every behaviour; `kind` is gnat, big, parent, bomb or child.
  - `COUNTED` kinds decrement `game.remaining`.
  - Children home in on `handPos()`.
- **Damage.** `damageTick` tests orbs, children and explosions against `handRect()`.
  `sting()` handles invulnerable mode.
- **Boss.** `bossTick` states are enter, fight and die. `B.hurt` is 24 i-frames per hit.
- **Stats.** There are two accumulators:
  - `game.stats` for the session
  - `game.stage` for the level
  - `endSession()` writes `high.<preset>[.inv]`, `stats.<preset>` and `history` (last 10).
- **Sound.**
  - `Sound.log` records `music:<name>` and every effect name, even without AudioContext.
    The tests rely on it.
  - `Sound.pump()` schedules notes 0.35 s ahead. It runs every rAF and from a 100 ms
    interval.

## Gotchas already paid for

- `presetName()` ignores `invuln`, and `applyPreset()` keeps the invuln value. Tests must
  reset `settings.invuln = 0` themselves; `fresh()` does this.
- N-SPC: tracks 1–7 must stop when track 0 ends the block. Their data runs on into the next
  block.
- N-SPC: `E0` values ≥ $CA are percussion instruments (`value - $CA + percBase`). `FA` sets
  percBase for all channels.
- BRR: the DSP stores `sample*2` wrapped to 16 bits. Wrap to 15 bits before using the value
  as filter history, or every sample saturates.
- SFX sample matches below a correlation of 0.55 fall back to filtered noise.
- The Koopa and laughing-boss crops are resampled and still a little rough. The clap-hands
  audience in the Stage Clear art could not be separated from the white tiles, so it was
  dropped.

## State

Done and verified headless:

- the rules listed in README
- every knob, hover mode, invulnerable mode, coordinate mapping, stats and history
- settings round-trip, pause and menu
- long bot runs with render() every frame, including a kid-preset bot that loops the game
- a missing bot that reaches game over
- PNG renders of every scenario, viewed with the Read tool

Verified in Chrome (localhost plus the rAF shim): the menu, gameplay (flies, glove, HUD),
real dispatched swats, game over with the stats summary, and a clean console. Audio could
not be listened to. Music scheduling runs without errors.

Not done:

- the extra parade walkers (Goomba, Spiny, Bob-omb)
- per-level boss palettes
- echo, vibrato and tremolo in the music
