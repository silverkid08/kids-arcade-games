# Excitebike clone: working notes for Claude

A clone of NES Excitebike in a single `index.html`, following `../GAME-SPEC.md`. Unlike the sibling games, the game logic is a **routine-by-routine port of the real ROM**.

- It uses the BZK disassembly in `reference/disasm/`. `clean.asm` is the same listing with the byte columns stripped, so it is easier to read and grep.
- Functions are named after the ROM routines (`sub_CD59`, `mode_C99A`, ...). They keep the ROM's variables at the ROM's RAM addresses in `m` (a Uint8Array of $800 bytes). The RAM map is at the top of PART 1.
- The PPU is emulated only as far as needed:
  - `vram` holds the two nametables (vertical mirroring), and `palram` the palettes.
  - OAM is `m[$200..$2FF]`.
  - `ppuList()` is the ROM's VRAM list interpreter.
  - `render()` draws scanlines with the ROM's scroll splits: lines 0-57 use the crowd scroll $50/$4E, lines 58-192 the track $12/$4D, and the HUD is fixed.

## Run and verify

```
node tools/test.js                 # ~20 s, must end "all tests passed" (2,600+ checks, includes a ROM lockstep)
node tools/lockstep.js all 9000    # the port vs the real ROM, RAM compared every frame (~3 min)
node tools/pixelcheck.js b1 300 900 1500   # rendered frames vs the emulator (0 pixels should differ in races)
node tools/render-frame.js all     # PNGs in tools/out/ (title select start race jump crash run overheat selb
                                   # finish results message designmenu design designrace kid)
node tools/serve.js                # http://localhost:8737/ with a Web-Worker rAF shim, for claude-in-chrome
```

**Run the lockstep after any change to ported code.** Kid hooks must be no-ops at the Original preset.

`tools/build.js` cuts out the IIFE and appends an `EXPORT` as `globalThis.__EB`. Add internals there when tests need them.

## Structure of the script (search for "PART")

| Part | Contents |
|---|---|
| 0 | ROMDATA/CHR (generated), `R(addr)` reads ROM data, the PPU, `render()` |
| 1 | RNG D326, timers D310, joypad D347, the mode machine C2A9 (init lists C01C/C02A run one step per frame), title C346, track select C395, design menu C3BD, race set-up C875 |
| 2 | `nmi()` (the order matters: OAM snapshot, then C27F, D0AB/D14E, timers, joypad, sound, mode handler) and the race loop `mode_C99A` with every sub it calls: speed CD59, lean CE83, landing DC1A, jump DD38/DD6F, obstacle scripts E73B plus `obstacleHandler` (the E6B7 table), lanes E96C, recovery D918, overheat DD8D, temperature E359, rider sprites E17F/D1C7, track streamer F4FF (one 8-px column per new column; track format: lap byte, `$4x nn` repeats, ids < $30 chunks, $30/$31 fallen-rider markers, bit 7 = main race only, `09` finish), CPU AI CED0 and spawning DA9F |
| 3 | Results CB2C (podium hop uses DD6F), place calculation C485, "next race" C465 |
| 4 | `powerOn`, the sound-request glue ($FB/$FF/$FE/$FD names, $FC engine), design to track format, `step()` |
| 5-6 | The kid shell: knobs/presets/records, overlay menu, keyboard, the badge, the 60.0988 Hz loop |
| 7 | The design editor (replaces ROM mode 9), save slots |

## Gotchas already paid for

- **The carry flag.** Several ROM routines depend on the carry left over by earlier code (DD6F, DC9A, the podium CC15 to DD6F path). `cpuCarry` models this, so keep it threaded through.
- **CA85 (back to title)** returns with X = $20, and the D918 loop carries on writing $6C+X. This is replicated, and the demo lockstep depends on it.
- **Joypad and the latch.** A is only "pressed" on its first frame (D35B). Menus also use the $49 latch, so a zero-button frame is needed before START registers. The run-back latch at D990 restores the old $49 while a button is held.
- **E52C** treats a difference of exactly $EC as "no overlap" (the Z flag), which affects flicker.
- **The ECE4 row builder** writes its last byte to $0403+$FF = $502, not $402.
- **Long NMIs.** The ROM's NMI runs long on screen changes. The lockstep compares at each NMI exit (RTI at C27E) and takes the pad from the read at D347.
- **The research emulator** clips sprites in the left 8 px, as the PPU does with $2001 bit 2 = 0.
- **BEST and 3RD.** The default BEST equals the qualifying base time (C091), and the HUD "3RD" is base + 2×$03F8 seconds.
- **The RNG.** It runs `mainLoopRng` (7) times per frame. Lockstep tools set it to 0 and copy the ROM's value in.

## Generated blocks (do not hand-edit)

- `/*DATA-BEGIN*/`: `node tools/extract-data.js`, which copies only the bytes the listing marks as data, plus the CHR.
- `/*MUSIC-BEGIN*/`: `reference/music.gen.js` plus `reference/sound.gen.js`, from `node tools/extract-music.js`. The player in sound.gen.js is hand-written there; edit that file, not index.html.
- After running either extractor, run `node tools/inject.js`.

## Kid hooks ("KID:" comments)

| Hook | Where it acts |
|---|---|
| Heat rate / no overheat | E359 |
| Landing range, auto-level | DC1A `kidLanding` |
| Invulnerable | `crash()`, DC1A, CE83 flip, E09F |
| Recovery | `recoveryStep`, DDD1 |
| CPU count | C875, DA9F, DBC4 |
| Aggression | `dbTable` |
| Top speed | CE29 `kidCap` |
| Laps | F4FF |
| Always qualify | C485 |
| Starting track | init C3F3 |
| Flicker | renderer limit plus E42B |

## State

- **Done.** The full ROM flow (title, attract demo, track select, challenge/main races, results, next race, track 5 repeat), Selection A and B, design menu, editor, save slots, design races, all knobs, records.
- **Verified in Chrome** (localhost plus shim):
  - title menu, track select, racing with jumps, the Esc menu
  - the design editor with mouse placement
  - no console errors
- **Not emulated.** The Famicom Data Recorder (its routines C6C8/C739 are skipped). Two-player is absent, but the ROM has none.
