# Excitebike (NES, 1984), a kid-friendly faithful clone

Open `index.html` in Chrome. It runs straight from `file://` and needs no network: the art, data and sound are all inside the file. `node tools/launch.js` opens it for you.

## How to play

| Key | NES button | What it does |
|---|---|---|
| X or K | A | Throttle |
| Z or J | B | Turbo. Faster, but the engine heats up |
| Up / Down (or W / S) | | Change lane |
| Left (or A) | | Lean back. On the ground this is a wheelie; flipping too far backwards crashes |
| Right (or D) | | Lean forward |
| Enter or Space | START | Start a race, confirm |
| Shift or Tab | SELECT | Move the menu cursor |
| P | | Pause, the same as the NES START pause |
| M | | Sound on/off |
| Esc | | Settings menu (it can also resume or quit) |

- **Steering in the air.** Left/Right lean the bike. Leaning back (Left) lowers gravity, so the jump is higher and longer.
- **Landing.** Land with the bike's angle close to the slope you come down on. Too nose-down or too nose-up and you crash. A so-so landing on flat ground gives a little bounce.
- **Small bumps.** Hit them in a wheelie, or hit them slowly.
- **Turbo.** It overheats the engine in about 7 seconds. You then stall for about 4.4 seconds.
- **Cooling arrows.** Riding over one cools the engine at once.
- **Other riders.** Running your front wheel into another rider's back wheel crashes *you*. If a rider runs into your back wheel, *they* crash.
- **After a crash.** You fly off and run back to the bike. Tap A or B to run faster.

## Modes

- **SELECTION A**: race alone against the clock.
- **SELECTION B**: race with the CPU riders.
- **Progress.** First you race the challenge race on the track you chose. Finishing 3rd or better takes you to the main race. Finishing 3rd or better there takes you to the next track. After track 5, track 5 repeats and the 3rd-place margin halves every second time.
- **DESIGN**: the ROM's design menu.
  - PLAY MODE A and PLAY MODE B race your design.
  - DESIGN opens the editor.
  - SAVE and LOAD use 4 slots in the browser.
  - RESET goes back to the title.

## Design editor

Keyboard:

- Left/Right choose a letter from A–S, CL (clear) or END.
- A (or Up) drives the bike forward and Down drives it back.
- B builds the chosen piece at the bike.
- START (or END + B) asks for the lap count (1–9). Change it with Up/Down and confirm with B.

Mouse:

- Click a letter to choose it, then click the track to build it there.
- Right-click an obstacle to remove it.
- The mouse wheel, or clicking the far left/right edge of the track, scrolls.
- Clicking the LP digit changes the lap count.

The 19 pieces are the ROM's own:

| Letters | Pieces |
|---|---|
| A–C | Bumps of three heights |
| D | Long mound |
| E | Steep ramp |
| F, G | Long ramps |
| H | Short 45° ramp |
| I, J | Small bumps in half the lanes |
| K, L | Dirt piles |
| M, N | Cooling arrows |
| O, P | Grass in half the track |
| Q | Grass across the whole track |
| R | The big multi-slope hill |
| S | The overhang |

**Improvements over the NES.**
- The NES editor could only drive forward and could not save without the Famicom Data Recorder.
- Here you can go back, use the mouse, and save to 4 slots. The current design is also kept automatically.

## Kid settings (menu: Esc, or on the title)

The presets are **Kid**, **Easy**, **Normal** and **Original**. Original is exactly the cartridge. Changing any knob shows "Custom".

| Knob | What it does |
|---|---|
| Overheating | On/off |
| Turbo heat rate | 25–150 % |
| Landing forgiveness | Original, +1/+2/+3 angle steps, or **auto-level**, where every landing is safe |
| Crash recovery | Original, fast (shorter throw, faster run, quicker remount), or instant (a short tumble and carry on in the same lane) |
| CPU riders | 0–3, Selection B only |
| CPU aggression | Original, or gentle (slower target speeds) |
| Top speed | 50–100 % |
| Need 3rd to go on | On/off. Off means you always move on |
| Laps per race | Original (2), or 1–5 |
| Starting track | 1–5 |
| Sprite flicker | The NES 8-sprites-per-line limit and the ROM's own flicker, on/off |
| **Invulnerable** | No crashes at all. A bad landing, a bump, a collision or a flip-over becomes a wobble and a screen flash, and an **INVULNERABLE** badge shows. Its records are kept apart |

**Records.**
- The best time for each track (challenge and main race, Selection A and B) is saved in localStorage for each preset, and for each lap-count setting.
- Invulnerable records are kept separately and marked with `*`.
- New records also go into the in-game BEST display.

## What's faithful, and where it came from

**The program.**
- The game logic is a routine-by-routine JavaScript port of the real cartridge.
- The source is the BZK disassembly in [32JP/NES-Games-Disassembly](https://github.com/32JP/NES-Games-Disassembly/tree/main/Excitebike), copied to `reference/disasm/`.
- The PRG ROM rebuilt from that listing matches CRC32 `3A94FA0B`.
- The port keeps the ROM's variables at the ROM's RAM addresses.

**How it was checked.**
- `tools/nes.js` is a small NES emulator written for this project. It runs the real ROM beside the port with the same button presses.
- The work RAM is **identical every frame** for 9,000+ frames each of:
  - Selection A on tracks 1–5
  - Selection B on tracks 1, 3 and 5
  - a crash/overheat torture run
  - the attract demo
- Those runs include finishes, results screens and moving on to the main race.
- Rendered frames match the emulator **pixel for pixel**.
- `tools/lockstep.js` and `tools/pixelcheck.js` run these checks.

**Key numbers, all straight from the ROM.**
- **Speeds.** Speeds are 8.8 fixed point. Each rider is updated on one frame in four.
  - A accelerates by $18 per update up to **$0320** (3.125 px/frame).
  - B accelerates by $3F up to **$0340**.
  - Coasting slows by $38. In the air it slows by $1C ($00 while leaning forward).
  - Grass and the track edge cut the throttle above 1 px/frame. Mud slows by $C0 or $7F every frame.
- **Temperature** is 8.8 fixed point ($03B5/$03B6), with targets and rates from tables D8FB and D8F7.
  - Idle: target 8, rate $3F/256.
  - B: target $20, rate $0F/256, so it overheats.
  - A: target $11, rate 7/256, so it never overheats.
  - Cooling is $0B/256 per frame.
  - Overheating at $20 stalls the bike for (32−8)×11 = **264 frames**, then it restarts at 5.
- **Jumps.**
  - Upward speed is ground speed + $AF.
  - Gravity is $34/256 per frame², or **$18** while leaning back.
  - Leaning forward skips one vertical step in four.
  - Ramp profiles and ground angles come from the ROM's obstacle scripts (E55A).
  - Landing limits per slope come from D86C/D87C. Target angles come from D88B.
- **Race clock.** It adds 1.6 hundredths per frame, so the NES clock runs at 96 % of real time. That is faithful.
- **Start.** The race starts after the countdown ($34 ×11 frames, then the gate).
- **Laps.** All five tracks have 2 laps. The layouts are the ROM's track data at ED46/EE59/EDC8/EED2/EFA7.
- **Qualifying.** The wall shows the BEST time. The HUD "3RD" time is the base + 2×$03F8 seconds.

  | Track | Challenge base | Main base |
  |---|---|---|
  | 1 | 1:16 | 1:24 |
  | 2 | 1:16 | 1:22 |
  | 3 | 1:16 | 1:10 |
  | 4 | 1:12 | 1:20 |
  | 5 | 1:06 | 1:06 |

  - Faster than BEST is 1st, and a record.
  - Within 3 s of the base time is 2nd. Within 7 s is 3rd.
  - After that the place is 4th plus 1 per 2 s.
- **Crash recovery.** It goes: thrown, bike slides to the edge, run back (tap A/B), climb on, rejoin.
- **Collision rules.** A rider 2–12 px behind in the same lane crashes. Within 2 px, both crash.
- **CPU riders.** Their spawning, lane choice, wheelies and speed targets are ported. So are the fallen rider that lies on some stretches, the camera man and the flagman on the last lap.

**Art.**
- Everything is drawn from the cartridge's own 8 KB CHR ROM: riders and bikes in all angle, crash and running frames, all obstacles, the stands, crowd, camera man, flagman, HUD, font, title, track-select, results podium and design screens.
- The screen layouts, palettes and metasprite tables come from the ROM's data bytes.
- Only the data bytes are embedded. The CHR sheet is in `reference/sheets/chr-rom.png`.

**Sound.**
- The music and effects come from running the ROM's own sound driver (sub_F844) and recording the APU writes. They play back with WebAudio: pulse, triangle and noise.
  - Music: title, qualify, design tune, countdown beeps, overheat, pause.
  - Effects: landing, jumps, crash, lane change, crowd, pass, rev.
- The engine tone follows the ROM's formula exactly.
- Nothing was done by ear.

## What's approximate or different

- **Random numbers.** The ROM advances its random register in the idle loop a variable number of times per frame. The port does it a fixed 7 times, so CPU riders and fallen riders appear at statistically similar but different moments. The lockstep tests copy the ROM's value in.
- **Design editor.** It is a new editor around the ROM's screen and pieces, not a port of the cassette-era one. Designs are turned into the ROM's track format and raced by the ported code. Composite pieces O–S use the ROM's own sequences.
- **SAVE/LOAD.** These use localStorage instead of the Famicom Data Recorder.
- **Long screen changes.** On the NES, a screen change can make the game skip a frame. The port never drops frames.
- **Sound details.** The sound player averages volume per frame, and leaves out the tiny $4011 DC drift.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole game |
| `tools/test.js` | The headless test suite (`node tools/test.js`, ends "all tests passed") |
| `tools/lockstep.js`, `tools/pixelcheck.js` | Port vs real ROM, RAM and pixels |
| `tools/render-frame.js` | Writes PNGs of game scenes to `tools/out/` |
| `tools/nes.js`, `rom.js`, `emu-*.js` | Research emulator and helpers |
| `tools/extract-data.js`, `tools/extract-music.js`, `tools/inject.js` | Regenerate the embedded data |
| `tools/harness.js`, `tools/build.js`, `tools/png.js`, `tools/launch.js`, `tools/serve.js` | Test harness, build, PNG, launch and localhost server |
| `reference/` | The disassembly, generated data and reference images |
