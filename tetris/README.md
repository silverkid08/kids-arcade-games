# Tetris (NES, 1989) for kids

A faithful clone of Nintendo's NES Tetris in one `index.html`. Open it in Chrome straight from disk
(`node tools/launch.js`). It needs no network: the graphics, screens, music and sound are all embedded.

## How to play

1. Pick a preset (KID, EASY, NORMAL, ORIGINAL) or change the knobs, then press PLAY.
2. On the NES **GAME TYPE** screen, Left/Right picks A-TYPE or B-TYPE and Up/Down picks MUSIC-1, MUSIC-2, MUSIC-3 or OFF.
   Press ENTER.
3. On the **LEVEL** screen, choose a level from 0 to 9. Hold X (the A button) while pressing ENTER to add 10.
   For B-TYPE, X switches between choosing the level and choosing the HEIGHT (0-5). Z goes back.
4. A-TYPE is an endless game. B-TYPE starts with garbage rows and ends when 25 lines have been cleared.

| Key | Action |
|---|---|
| Left / Right, A / D | move |
| Up, W, X, K | rotate clockwise (the NES A button) |
| Z, J | rotate counter-clockwise (the NES B button) |
| Down, S | soft drop |
| Space | hard drop (only when the knob is on) |
| C, Shift | hold (only when the knob is on) |
| Enter | Start: menus and pause |
| P | pause (as on the NES, the board is hidden while paused) |
| N, Tab | Select: hide or show the next piece |
| M | sound on/off |
| Esc | settings menu (pauses the game) |

## Presets and knobs

| Knob | KID | EASY | NORMAL | ORIGINAL |
|---|---|---|---|---|
| Fall speed | 90 frames/row | NES table | NES table | NES table |
| Speeds up with levels | no | yes | yes | yes |
| Auto-repeat delay / every | 24 / 8 | 20 / 6 | 16 / 6 | 16 / 6 |
| Next pieces shown | 3 | 3 | 1 | 1 |
| Ghost piece | on | on | on | off |
| Hard drop | on | on | off | off |
| Hold | on | on | off | off |
| Wall kicks | on | on | on | off |
| Piece picker | friendly | friendly | NES | NES |
| Starting level / B height | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| No game over | on | off | off | off |

- **Fall speed** can be a number of frames per row (24 to 150), or FROZEN. With FROZEN, the piece only moves down
  when you press Down.
- **Piece picker** has three settings. NES is the cart's own picker, which re-rolls once on a repeat. FRIENDLY is
  the NES picker, but it forces an I piece if none has come in the last 11 pieces. 7-BAG deals all seven pieces in
  each set of seven.
- **No game over**: when the stack reaches the top, the bottom 10 rows flash and disappear, and play carries on.
  A **NO GAME OVER** badge shows in the top right while it is on. Scores from these games go into a separate table,
  marked with `*` in the menu.
- **Extra pieces**: extra next pieces appear at half size in a box below LEVEL. The hold piece is shown in a HOLD box
  that replaces the A-TYPE box. Both boxes use the game's own tiles.
- Changing a knob switches the preset display to CUSTOM. The ORIGINAL preset's values never change.
- Settings are saved in `localStorage` under `tetris.settings`. Top-3 tables (name, score, level) are saved per
  preset and game type under `tetris.high.<preset>.<A|B>`. No-game-over games add `.nogo` to that key.
  The ORIGINAL tables start with the cart's defaults: HOWARD, OTASAN and LANCE for A; ALEX, TONY and NINTEN for B.

## What is faithful (ORIGINAL preset)

The gameplay is a routine-by-routine port of the annotated disassembly (CelestialAmber/TetrisNESDisasm, copied
in `reference/disasm/`). The repo's own assembler (`tools/asm.js`) rebuilds that disassembly into the exact retail
ROM, **Tetris (U) [!]**, md5 `ec58574d96bee8c8927884ae6e7a2508`. Every gameplay table is copied byte for byte from
that ROM. `tools/romsim.js` then runs the real ROM on an emulated 6502 next to the port, with the same button
presses, and compares the two after every frame. It checks the playfield RAM, the on-screen playfield tiles, the
piece position and orientation, the next piece, the RNG, the gravity timer, both DAS counters, the play state,
lines, level, score, the statistics, the score and level digits, and the TETRIS flash colour. Runs from levels 0, 9,
12, 18 and B-type, 30,000 frames at most, matched on every frame.

- The screen is 256x224: the visible part of the NES frame. Timing is 60.0988 frames per second.
- The 10x20 playfield. The seven pieces use the ROM's orientation table and spawn at column 5, row 0.
  T, J and L spawn pointing down; I, S and Z spawn flat.
- Nintendo Rotation System: A turns clockwise and B counter-clockwise. There are no wall kicks. A rotation that
  doesn't fit is cancelled.
- The piece picker (`pickRandomTetrimino`): (rng high byte + spawn count) & 7. If that gives 7 or the same piece
  as last time, it re-rolls once with (new rng & 7 + the last orientation ID) mod 7. The 16-bit RNG starts at
  $8988 and advances every frame, and also in the menus.
- Gravity (frames per row): 48 43 38 33 28 23 18 13 8 6, 5 5 5, 4 4 4, 3 3 3, 2 for levels 19-28, and 1 from
  level 29. The first piece hangs for 96 frames unless you press Down.
- DAS: a move on the press, then a 16-frame delay, then a move every 6 frames. If the piece is blocked by a wall,
  the DAS stays charged. Down blocks sideways movement.
- Soft drop moves one row every 2 frames and gives 1 point per row. The ROM's binary-into-BCD addition is kept, so
  long pushes (16 rows or more) score oddly, as on the cart. There is no hard drop and no hold.
- The entry delay comes from the ROM's 4-rows-per-frame playfield copy: **10, 12, 14, 16, 18 frames** depending on
  how high the piece locks (measured by the tests).
- The line clear animation clears from the centre outwards, a column pair every 4 frames, and takes 17-20 frames.
  During a TETRIS the background flashes white with the jingle.
- Scoring is 40 / 100 / 300 / 1200 x (level + 1), done with the ROM's BCD arithmetic and capped at 999999.
- Levels go up by the ROM rule: the binary level is compared with the BCD tens of lines. A game started at level 9
  first goes up at 100 lines, 12 and 15 at 100, 16 at 110, 18 at 130 and 19 at 140. After that, every 10 lines.
- The ten block palettes per level (`colorTable`) are used for the playfield, the piece and the statistics icons.
  The statistics column counts every piece.
- Game over lowers the curtain row by row with its noise. A top-3 score then goes to the
  "CONGRATULATIONS ... ENTER YOUR NAME" screen, which works like the cart: Up/Down change a letter, Left/Right move.
- B-TYPE: 25 lines count down. Garbage heights 0-5 give 0/3/5/8/10/12 rows, made by the ROM's garbage routine, with
  every row guaranteed a hole. When the count reaches 0, SUCCESS!! appears with its fanfare, followed by the
  (level digit + height) x 1000 bonus.
- Music and sound: the ROM's own sound driver ($E000-$F9FF) runs every frame on the embedded 6502. A software APU
  plays its register writes: two pulse channels with sweep and envelope, triangle, noise, and the 5-step frame
  sequencer. Music, the faster versions when the stack passes row 5, and the pause jingle come from the cart's own
  code and note data. So do the effects: move, rotate, lock, line, tetris, level up, curtain and the menu blips.
- Pause hides the board (only PAUSE shows) and plays the pause jingle.
- Art: the real CHR tiles, nametables and palettes, decoded from the disassembly's graphics (tests check they are
  identical to the ROM's CHR). This covers the playfield border and brick background, the per-level blocks, the
  font, the statistics icons, and the title, game-type, level, name-entry and game screens.

## What is approximate or missing

- **There is no Korobeiniki.** The NES cart's three tunes are MUSIC-1, MUSIC-2 and MUSIC-3, Hirokazu Tanaka's own
  compositions, and this clone plays exactly those. Korobeiniki is the Game Boy and Tengen tune.
- The endings are not drawn: no rocket after an A-TYPE game over 30,000, and no B-TYPE concert. The B-TYPE bonus is
  counted on the game screen instead. The legal screen and the attract demo are skipped. There is no 2-player mode.
- The APU is a sample-rate model, with no DMC (Tetris doesn't use it in play) and simple phase accumulators, so some
  aliasing is possible. The colours use the FCEUX default NES palette.
- Levels above 29 show the ROM's out-of-table digits, as on the cart, but the level 255 rollover and the crash
  ("kill screen") behaviour are not modelled.
- The kid additions (ghost, hold, hard drop, previews, kicks, friendly picker, rescue) are not part of the NES game.
  With ORIGINAL they are all off.

## Sources

- Disassembly: https://github.com/CelestialAmber/TetrisNESDisasm (from ejona86/taus). Code, data, graphics PNGs and
  nametables are copied to `reference/disasm/`.
- Rules cross-checked with the Tetris wiki (tetris.wiki/Tetris_(NES,_Nintendo)) and meatfighter.com's NES Tetris
  write-up. The ROM comparison in `tools/romsim.js` is the final authority.

## Development

```
node tools/test.js            # ~180 checks incl. frame-by-frame ROM comparison; ends "all tests passed"
node tools/render-frame.js play && open tools/out/play.png
node tools/asm.js             # re-assemble the disassembly, check the md5
node tools/extract.js && node tools/inject.js   # rebuild the embedded DATA block
```
