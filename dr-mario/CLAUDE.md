# Dr. Mario clone: working notes for Claude

This is NES Dr. Mario (1-player) in one `index.html`, following `../GAME-SPEC.md`. The spec's
"invulnerable" is **NO GAME OVER** here.

The logic is a line-by-line port of `reference/disasm/nostaljipi`. Function comments name the asm labels
(checkDrop, addVirus, pillRotateValidation...). Grep the .asm for them.

## Run and verify

```
node tools/test.js            # ~165 checks, ~15 s, ends "all tests passed"; includes a short rom-diff
node tools/rom-diff.js        # full lockstep comparison against the real ROM (~1 min)
node tools/render-frame.js play    # then Read tools/out/play.png
```

- **render-frame scenarios:** title options intro play busy hurt clear gameover pause kid rescue sheet.
- **build.js** cuts the IIFE out of index.html and exports internals as `globalThis.__DM`. Add new names to EXPORT.

## The ROM pipeline (offline only)

| Tool | What it does |
| --- | --- |
| `tools/build-rom.js` | Runs the bundled asm6f.exe on the disassembly with `completeCleanup = 0`. Writes `reference/build/drmario.nes` + `.lst` and checks md5 8181d696... (Rev A). |
| `tools/nes.js` | A minimal NES: CPU (`cpu6502.js`), MMC1 CHR banks, PPU register capture, APU write log, pads. `loadSymbols` reads label addresses from the listing. |
| `tools/extract.js` | Writes `reference/art.gen.js` (ART) and `reference/audio.gen.js` (AUDIO). Then run `tools/inject.js` to splice them between the `/*ART-BEGIN*/` and `/*AUDIO-BEGIN*/` markers. Do not hand-edit those blocks. |
| `tools/rom-diff.js` | Lockstep against the ROM, see below. |

What extract.js produces:

- **ART:**
  - CHR banks 0-5;
  - the title, options and level nametables, dumped from VRAM after the ROM drew them (bottle cleared);
  - palettes;
  - the 75 metasprites;
  - ROM tables copied by label (`ART.tab`).
- **AUDIO:**
  - The sound driver (`audioUpdate`) is run frame by frame.
  - The output is raw APU writes per frame, songs until their RAM state repeats (loop point) or they end, and the
    effects. The effect stream ends on the frame the effect stops.
  - $4017 is implied.
  - It is deflated once, and index.html has its own inflate.
  - Do not dedupe writes: the music relies on rewriting registers after effects and pause.

How rom-diff.js works:

- It syncs RNG, frame counter and cosmetic state (dance frame, circle position, beat counter, noise RNG) at the
  options-screen START.
- Then the same pad bits go to both sides each NMI.
- It compares state before each NMI.
- Frames with NMI off (screen copies) do not count.
- On ROM lag frames (the NMI arrives while the logic is still running, detected by the CPU PC not being in a
  `lda nmiFlag / beq` loop), the JS runs the logic, takes that NMI, and skips the next frame's logic.

## Model

- **Frame structure.** The main loop is generators. `yield` happens exactly where the ROM waits for an NMI:
  - `visualAudioUpdate` = visualAudioUpdate_NMI (level sprites, sound, wait, clear OAM);
  - `audioUpdateNMI` = audioUpdate_then_NMI.
- **step().** `gen.next()` then `nmi()`. nmi() does, in order:
  - OAM copy;
  - HUD digits;
  - one bottle row from `P.status`, which counts down to $FF;
  - frameCounter++;
  - the pad read.
- **Mode numbers** are the ROM's: 0 title, 1 options, 2 toLevel, 3 initData, 4 main loop, 5 any player loses,
  7 end screen, 8 level intro.
- **Field.** `G.field` is 256 bytes like the $0400 page. Indices 128+ stay $FF (the ROM reads past the bottle).
  Values are tile numbers (type nibble + colour).
- **Fail flags.** `P.levelFailFlag` is p1_levelFailFlag. `G.curFail` is currentP_levelFailFlag, which differs for
  one frame after game over.
- **Sound.**
  - `Sound.update()` mirrors audioUpdate: noise effects restart, square-1 priorities, and a refused request stalls
    the playing effect for a frame.
  - Music writes are dropped on channels an effect owns. When the effect ends, timer/length are restored, and a new
    song's mute writes pass through.
  - The game requests sound with `Sound.music/sq0/noise` (last request per frame wins, as in RAM).
- **APU.** It runs inside a ScriptProcessor and consumes one write batch per frame.
- **Kid knobs** are read from `G.cfg`, which `makeCfg()` builds at toLevel:
  - `dropPct` scales the gravity threshold;
  - 2 colours = `G.colorsAllowed` [Y, B] with 4 pill combos, and the unused big virus starts in state 4;
  - match-3 also blocks 3-runs in placement;
  - the ghost is sprite attr bit 0x100, drawn dithered;
  - NO GAME OVER calls `rescue()`, which turns capsule halves in rows 0-5 into "cleared" and jumps to updateField.

## Gotchas

- First falling capsule is reserve[1]. HI scores 300 per virus (not 600). `speedUps` always starts at 0 even past
  level 20 (lvlsOver20 is reset before use). All of these are faithful.
- Do not rotate, move or set state in tests without a no-input frame in between: a press is consumed on the next
  frame's logic.
- The overlay menu freezes the generator; `Sound.hush()` silences the APU.
- Chrome: the extension refuses file://, so serve on localhost. The automation tab gets no rAF; use a Worker
  setInterval rAF shim injected before the game script (as for duck-hunt).

## State

Done and verified:

- **Headless.**
  - the rules above, every knob, NO GAME OVER, settings round-trip, long bot runs with render() every frame;
  - rom-diff identical over 130k frames in 7 configs;
  - PNG renders viewed.
- **In Chrome** (localhost + shim):
  - menu, options to level, capsule falling and turning with real key presses, PAUSE screen;
  - no console errors.
  - Audio was not listened to.

Not done: 2P versus, demo, cutscenes and the ending.
