# Tetris clone: working notes for Claude

A clone of NES Tetris (1989) in a single `index.html`. It follows `../GAME-SPEC.md`, where "invulnerable" becomes
**no game over**. The game logic is a port of `reference/disasm/main.asm`. Comments name the ROM routines
(`drop_tetrimino`, `shift_tetrimino`, `playState_checkForCompletedRows`, ...), so grep the asm for them.

## Run and verify

```
node tools/launch.js                  # open in Chrome (file://)
node tools/test.js                    # must end "all tests passed" (~180 checks, ~16 s)
node tools/render-frame.js play       # then Read tools/out/play.png
node tools/montage.js tools/out/m.png kid btype curtain pause   # several scenarios on one PNG
```

`render-frame.js` scenarios: title gametype levela levelb play level9 lineclear tetris curtain pause kid btype
success entry rescue.

`tools/build.js` cuts the IIFE out of index.html and appends an `EXPORT` as `globalThis.__TT`. Add new internals
there when a test needs them. `tools/bot.js` is a placement bot: it teleports the piece to its chosen spot, then
holds Down.

## The ROM is the reference

- `tools/asm.js` is a small ca65-subset assembler. It assembles `reference/disasm/tetris.asm`, re-encodes the CHR
  from the gfx PNGs, and must print `MATCHES Tetris (U) [!]` (md5 ec58574d...). It also gives the symbol table.
- `tools/extract.js` builds `reference/data.gen.js`. It holds the CHR banks, the decoded nametables (title, game
  type, level A/B with the height patch and the high-score box applied, game, name entry), the palettes,
  `DATA.rom.*` (gameplay tables byte for byte) and the sound driver bytes plus the RAM addresses it uses.
  `tools/inject.js` splices that file between `/*DATA-BEGIN*/` and `/*DATA-END*/`. Never hand-edit that block.
- `tools/romsim.js` runs the real ROM on the game's own `makeCPU`. It provides a minimal PPU (stripe writes into
  VRAM; PPUSTATUS toggles its vblank bit on every read), the controller shift register, and an NMI whenever the main
  loop waits for vblank. It drives the menus, copies the ROM state into the port once the game is initialised, and
  then steps both with the same buttons. A planner steers pieces to the bot's spots with real presses. If a test
  "identical to the ROM" fails, the first mismatch names the frame and the field.
  Inputs are one frame ahead for the ROM: NMI k polls the buttons that the port's update k+1 reads.
  - The comparison stops at B-type SUCCESS (the ROM blocks in its ending) and at game over.
  - It also stops at the end of the curtain when the score is 30,000 or more, because the ROM plays the rocket
    ending, which is not implemented.

## Model

- **Frames.** `update()` is one main-loop pass plus the NMI, in the ROM's order:
  1. read input (newly = held & ~prev; `input.force` is the test hook)
  2. menu frame or `playFrame()`: game states 2-7, i.e. fallTimer++, Select, the game-over check, the playState
     handler, Start/pause
  3. `Sound.frame()`, which is updateAudio on the 6502
  4. `playNmi()`, the VRAM side:
     - the 4-rows-per-frame playfield copy, or the line-clear animation in playState 4
     - the digits and the level palette
     - the TETRIS flash at $3F0E
  5. `nmiTick()`, which does frameCounter++ and an RNG step
- **VRAM lag matters.** `g.pf` is the playfield RAM, a 256-byte page. Cells above the field wrap into the page
  tail, as in the ROM. `g.nt` is the nametable on screen. Rows reach `g.nt` only through
  `copyPlayfieldRowToVRAM`. `g.vramRow` (0x20 = done) gates lock, the row check and the spawn, and that gate
  produces the 10-18 frame ARE. Don't "simplify" this away.
- **playStates**: 1 control, 2 lock, 3 row check, 4 clear animation, 5 lines and score, 6 B-type goal, 7 garbage
  (no-op), 8 spawn, 10 curtain, 0 game over. Added states: **12** is the no-game-over rescue and **13** is
  B-type success plus the bonus count.
- **BCD**: score (3 bytes, low first), lines (2 bytes) and stats (2 bytes per piece) keep the ROM's exact byte
  arithmetic, including its quirks (the soft-drop add and the binary-level-vs-BCD-tens transition).
- **Gravity** uses the ROM's signed 8-bit compare only with the NES table. A custom fall speed uses a plain compare.
- **Queue**: `g.queue[0]` is the NES nextPiece. With previews > 1, extra picks are made at start, so the RNG
  sequence then differs from the cart (Original uses 1).
- **Sound**: `Sound.sfx(slot, id)` writes soundEffectSlotNInit and `Sound.music(track)` writes musicTrack, exactly
  where the ROM does. The tracks (musicSelectionTable) are:
  - 3 / 4 / 5: MUSIC-1, MUSIC-2, MUSIC-3
  - 6 / 7 / 8: the fast versions of those
  - 2: B-type fanfare
  - 9: name entry
  - $FF: off

  `Sound.silence()` calls soundEffectSlot2_makesNoSound (updateAudio2). It clears currentlyPlayingMusicTrack, so the
  level menu and game over are silent, as on the cart. Writes are queued per frame to a ScriptProcessor APU, and the
  queue is capped at 12 frames. `Sound.log` records every request for the tests.
- **Rendering**: a generic NES renderer: nametable + attributes + palette (`g.pal`, 32 bytes), then sprites in OAM
  order. Attr bit 0x20 means behind the background, 0x40 means flip, and screen y = OAM y + 1. NES lines 8-231 are
  shown. The kid boxes (HOLD, extra previews) are written into `g.nt` with box tiles $38-$3F. The ghost is drawn as
  sprites at 35% alpha, and the extra previews at half size.

## Gotchas already paid for

- PPU stripe format: ctl bit 7 = vertical, bit 6 = repeat one byte, low 6 bits = count (0 = 64). Any first byte
  of $80 or more ends the stream.
- The A-type level screen is: the level nametable, then the height patch (which blanks the HEIGHT box and part of
  the score box), then `high_scores_nametable` drawn over it. Skip the last step and the table looks broken.
- The automation tab gets no requestAnimationFrame. Use `node tools/serve.js` and open
  http://localhost:8765/shim.html. `window.__tetris` exposes { g, settings, Sound } for checks. Synthetic key
  events don't unlock audio; a real extension click on PLAY does (`Sound.state()` returns 'running').
- The cart has no Korobeiniki. Its tunes are MUSIC-1/2/3.

## State

Done and verified headless:
- every ROM rule above, and the ROM comparison (levels 0, 9, 18 with A+Start, B-type height 3, top-out with pauses)
- each knob, no game over, the high-score tables, settings round-trip, the sound driver on every track, long runs
  with render() every frame
- PNGs of every scenario were viewed

Verified in Chrome (localhost + rAF shim):
- the menu overlay with the real logo
- GAME TYPE, LEVEL, gameplay at level 2
- the Kid layout: HOLD box, ghost, half-size previews, badge, hard drop
- the AudioContext running with the driver queue drained and MUSIC-1 playing
- no console errors

Not done: the A and B endings (rocket, concert), the legal screen and demo, 2-player.
