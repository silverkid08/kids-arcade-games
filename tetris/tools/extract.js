/* Builds reference/data.gen.js (the DATA block spliced into index.html by
   tools/inject.js) straight from the disassembly:
     - the four 4 KB CHR banks, re-encoded from reference/disasm/gfx/*.png
       (tools/asm.js proves these PNGs rebuild the exact ROM, md5 ec58574d...)
     - the screens' nametables + attribute tables (PPU stripe format decoded)
     - palettes, colorTable, the default high-score table
     - the ROM's sound driver + music data ($E000-$F9FF) for the embedded 6502
   Also writes tools/out/screens.png, every decoded screen side by side.

     node tools/extract.js && node tools/inject.js
*/
const fs = require('fs');
const path = require('path');
const { assemble } = require('./asm.js');
const { encodePNG } = require('./png.js');

const ROOT = path.join(__dirname, '..');
const DIS = path.join(ROOT, 'reference', 'disasm');
const rom = assemble();
const S = rom.sym;
const prg = (addr, n) => rom.prg.slice(addr - 0x8000, addr - 0x8000 + n);

/* Decode a PPU stripe stream (hi, lo, len, bytes...; $FF ends) into a 2 KB
   PPU space window: nametable 0 ($2000-$23FF) and the palette ($3F00-$3F1F).
   Bit 7 of len = repeat one byte, bit 6 = vertical (as bulkCopyToPpu). */
function applyStripes(buf, pos, nt, pal) {
  for (;;) {
    const hi = buf[pos];
    if (hi === undefined || hi >= 0x80) return pos + 1;
    let addr = (hi << 8) | buf[pos + 1];
    const ctl = buf[pos + 2]; pos += 3;
    const vertical = ctl & 0x80, repeat = ctl & 0x40;
    const n = (ctl & 0x3F) || 64;
    for (let i = 0; i < n; i++) {
      const v = repeat ? buf[pos] : buf[pos + i];
      if (addr >= 0x2000 && addr < 0x2400) nt[addr - 0x2000] = v;
      else if (addr >= 0x3F00 && addr < 0x3F20) pal[addr - 0x3F00] = v;
      addr += vertical ? 32 : 1;
    }
    pos += repeat ? 1 : n;
  }
}
function screenFrom(buf) {
  const nt = new Uint8Array(1024), pal = new Uint8Array(32);
  applyStripes(buf, 0, nt, pal);
  return { nt, pal };
}
const bin = f => fs.readFileSync(path.join(DIS, 'gfx', 'nametables', f));

// palettes are stripe streams too ($3F,$00,$20,...)
function palette(label) { const p = new Uint8Array(32); applyStripes(rom.prg, S[label] - 0x8000, new Uint8Array(1024), p); return p; }
const gamePal = palette('game_palette'), menuPal = palette('menu_palette'), legalPal = palette('legal_screen_palette');

// title screen nametable lives in the ROM as .byte data
const titleNT = screenFrom(prg(S.title_screen_nametable, 1200)).nt;
const gameTypeNT = screenFrom(bin('game_type_menu_nametable.bin')).nt;
const levelNT_B = screenFrom(bin('level_menu_nametable.bin')).nt;
const levelNT_A = levelNT_B.slice();
const levelPal_A = menuPal.slice();
applyStripes(rom.prg, S.height_menu_nametablepalette_patch - 0x8000, levelNT_A, levelPal_A);
// showHighScores then redraws the score box over both (high_scores_nametable)
const hsBin = bin('high_scores_nametable.bin');
applyStripes(hsBin, 0, levelNT_A, new Uint8Array(32));
applyStripes(hsBin, 0, levelNT_B, new Uint8Array(32));
const gameNT = screenFrom(bin('game_nametable.bin')).nt;
const legalNT = screenFrom(bin('legal_screen_nametable.bin')).nt;
const entryNT = screenFrom(bin('enter_high_score_nametable.bin')).nt;

const chr = {};
const { chrFromPng } = require('./asm.js');
for (const n of ['game', 'title_menu', 'typeA_ending', 'typeB_ending']) chr[n] = chrFromPng(path.join(DIS, 'gfx', n + '_tileset.png'));
// sanity: the CHR we embed is byte-identical to the ROM's CHR banks
const chrOrder = ['title_menu', 'typeB_ending', 'typeA_ending', 'game'];
chrOrder.forEach((n, i) => { if (!chr[n].equals(rom.chr.slice(i * 4096, (i + 1) * 4096))) throw new Error('CHR mismatch ' + n); });

const AUDIO_BASE = 0xE000, AUDIO_END = 0xFA00;
const audio = prg(AUDIO_BASE, AUDIO_END - AUDIO_BASE);
const b64 = b => Buffer.from(b).toString('base64');

const DATA = {
  chrGame: b64(chr.game),
  chrMenu: b64(chr.title_menu),
  nt: {
    legal: b64(legalNT), title: b64(titleNT), gameType: b64(gameTypeNT),
    levelA: b64(levelNT_A), levelB: b64(levelNT_B), game: b64(gameNT), entry: b64(entryNT)
  },
  pal: { game: [...gamePal], menu: [...menuPal], levelA: [...levelPal_A], legal: [...legalPal] },
  colorTable: [...prg(S.colorTable, 40)],
  defaultHigh: [...prg(S.defaultHighScoresTable, 48 + 24 + 8)],
  // gameplay tables, copied byte for byte from the ROM (labels as in main.asm)
  rom: {
    framesPerDrop: [...prg(S.framesPerDropTable, 30)],
    orientation: [...prg(S.orientationTable, 20 * 12)].map(b => (b << 24) >> 24),
    rotation: [...prg(S.rotationTable, 38)],
    spawnTable: [...prg(S.spawnTable, 7)],
    typeFromOrientation: [...prg(S.tetriminoTypeFromOrientation, 19)],
    spawnFromOrientation: [...prg(S.spawnOrientationFromOrientation, 19)],
    points: [...prg(S.pointsTable, 10)],
    typeBBlank: [...prg(S.typeBBlankInitCountByHeightTable, 6)],
    rngTable: [...prg(S.rngTable, 8)],
    successGfx: [...prg(S.typebSuccessGraphic, 30)],
    typeBPatch: [...prg(S.game_typeb_nametable_patch, 44)],
    levelDisplay: [...prg(S.levelDisplayTable, 256)],
    musicSelection: [...prg(S.musicSelectionTable, 8)],
    garbageLines: [...prg(S.garbageLines, 5)],
    pieceSprites: [S.sprite06TPiece, S.sprite07SPiece, S.sprite08ZPiece, S.sprite09JPiece, S.sprite0ALPiece, S.sprite0BOPiece, S.sprite0CIPiece].map(a => [...prg(a, 16)]),
    orientationToSprite: [...prg(S.orientationToSpriteTable, 19)],
    levelToSpriteY: [...prg(S.levelToSpriteYOffset, 10)], levelToSpriteX: [...prg(S.levelToSpriteXOffset, 10)],
    heightToSpriteY: [...prg(S.heightToPpuHighAddr, 6)], heightToSpriteX: [...prg(S.heightToPpuLowAddr, 6)],
    highScoreCharToTile: [...prg(S.highScoreCharToTile, 44)],
    highScorePosToY: [...prg(S.highScorePosToY, 3)], highScoreNamePosToX: [...prg(S.highScoreNamePosToX, 6)],
    byteToBcd: [...prg(S.byteToBcdTable, 9 * 8)]
  },
  audio: {
    base: AUDIO_BASE, rom: b64(audio),
    updateAudio: S.updateAudio, silence: S.soundEffectSlot2_makesNoSound,
    musicTrack: S.musicTrack, sfxInit: S.soundEffectSlot0Init, noiseHi: S.musicStagingNoiseHi,
    playing: S.currentlyPlayingMusicTrack
  }
};
const out = '/* generated by tools/extract.js from reference/disasm - do not edit */\nconst DATA = ' + JSON.stringify(DATA) + ';';
fs.writeFileSync(path.join(ROOT, 'reference', 'data.gen.js'), out);
console.log('wrote reference/data.gen.js', out.length, 'bytes');

/* ---------- preview of every screen ---------- */
const NESPAL = require('./nespal.js');
function renderScreen(nt, pal, chrBank) {
  const W = 256, H = 240, px = Buffer.alloc(W * H * 3);
  for (let ty = 0; ty < 30; ty++) for (let tx = 0; tx < 32; tx++) {
    const t = nt[ty * 32 + tx];
    const at = nt[960 + (ty >> 2) * 8 + (tx >> 2)];
    const sh = ((ty & 2) << 1) | (tx & 2);
    const p = (at >> sh) & 3;
    for (let y = 0; y < 8; y++) {
      const lo = chrBank[t * 16 + y], hi = chrBank[t * 16 + 8 + y];
      for (let x = 0; x < 8; x++) {
        const c = ((lo >> (7 - x)) & 1) | (((hi >> (7 - x)) & 1) << 1);
        const col = NESPAL[c ? pal[p * 4 + c] & 0x3F : pal[0] & 0x3F];
        const o = ((ty * 8 + y) * W + tx * 8 + x) * 3;
        px[o] = col >> 16; px[o + 1] = (col >> 8) & 255; px[o + 2] = col & 255;
      }
    }
  }
  return px;
}
const shots = [
  [legalNT, legalPal, chr.title_menu], [titleNT, menuPal, chr.title_menu], [gameTypeNT, menuPal, chr.title_menu],
  [levelNT_A, levelPal_A, chr.title_menu], [levelNT_B, menuPal, chr.title_menu], [gameNT, gamePal, chr.game], [entryNT, menuPal, chr.title_menu]
];
const cols = 4, W = 256 * cols, H = 240 * Math.ceil(shots.length / cols);
const big = Buffer.alloc(W * H * 3);
shots.forEach(([nt, pal, bank], i) => {
  const px = renderScreen(nt, pal, bank), ox = (i % cols) * 256, oy = Math.floor(i / cols) * 240;
  for (let y = 0; y < 240; y++) px.copy(big, ((oy + y) * W + ox) * 3, y * 256 * 3, (y + 1) * 256 * 3);
});
if (!fs.existsSync(path.join(__dirname, 'out'))) fs.mkdirSync(path.join(__dirname, 'out'));
encodePNG(path.join(__dirname, 'out', 'screens.png'), W, H, big);
console.log('wrote tools/out/screens.png');
