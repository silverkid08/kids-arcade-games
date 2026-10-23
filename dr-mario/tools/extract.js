/* Builds the generated data blocks of index.html from the REAL game:
     reference/art.gen.js    const ART   (CHR tiles, screens, palettes, metasprites, ROM tables)
     reference/audio.gen.js  const AUDIO (sound-engine register streams, deflated)
   Source of truth: reference/build/drmario.nes, assembled byte-exact (Rev A,
   md5 8181d696756578fc92e6c4c86da01904) from the Nostaljipi disassembly in
   reference/disasm/nostaljipi by tools/build-rom.js, plus its listing for the
   label addresses.  The ROM is run in tools/nes.js:
     - screens are dumped from VRAM after the game itself drew them,
     - music and effects are recorded from the game's own sound driver
       (audioUpdate), one frame at a time, as APU register writes.
       node tools/extract.js && node tools/inject.js                        */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { NES, loadSymbols } = require('./nes.js');

const ROOT = path.join(__dirname, '..');
const sym = loadSymbols();
const S = name => { if (!(name in sym)) throw new Error('no symbol ' + name); return sym[name]; };
const b64 = a => Buffer.from(a).toString('base64');

const nes0 = new NES();
const rd = a => nes0.read(a);
const bytes = (name, n) => { const a = S(name); const out = []; for (let i = 0; i < n; i++) out.push(rd(a + i)); return out; };
const bytesUntil = (name, stop) => { const a = S(name); const out = []; for (let i = 0; ; i++) { const v = rd(a + i); if (v === stop) break; out.push(v); } return out; };
const sgn = v => v >= 128 ? v - 256 : v;

/* ---------------- tables used by the port (copied from the ROM by label) ---------------- */
const T = {
  speedCounterTable: bytes('speedCounterTable', 81),
  baseSpeedSettingValue: bytes('baseSpeedSettingValue', 3),
  colorCombination_left: bytes('colorCombination_left', 9),
  colorCombination_right: bytes('colorCombination_right', 9),
  virusColor_random: bytes('virusColor_random', 16),
  addVirus_maxHeight_basedOnLvl: bytes('addVirus_maxHeight_basedOnLvl', 35),
  scoreMultiplier_table: bytes('scoreMultiplier_table', 64),   // 11 real entries + the bytes a bigger combo reads
  virusPlacement_colorBits: bytes('virusPlacement_colorBits', 4),
  pill_fieldPos_relativeToPillY: bytes('pill_fieldPos_relativeToPillY', 16),
  fallingPill_YPos: bytes('fallingPill_YPos', 16),
  pillSpriteData: bytes('pillSpriteData', 36),
  relativeFieldPos_halfPills: bytes('relativeFieldPos_halfPills_rotationAndSizeBased', 8),
  halfPill_posOffset: bytes('halfPill_posOffset_rotationAndSizeBased', 16),
  halfPill_shape: bytes('halfPill_shape_rotationAndSizeBased', 16),
  pillThrownAnim_XPos: bytes('pillThrownAnim_XPos', 26),
  pillThrownAnim_YPos: bytes('pillThrownAnim_YPos', 26),
  bigVirus_XPos: bytes('bigVirus_XPos', 128),
  bigVirus_YPos: bytes('bigVirus_YPos', 128),
  bigVirusState_haltTable: bytes('bigVirusState_haltTable', 5),
  bigVirusHurt_YOffset: bytes('bigVirusHurt_YOffset', 12),
  bigVirus_spriteIndex: bytes('bigVirus_spriteIndex', 12),
  bigVirusFail: [bytes('bigVirusYellow_failLvl_spriteIndex', 2), bytes('bigVirusRed_failLvl_spriteIndex', 2), bytes('bigVirusBlue_failLvl_spriteIndex', 2)],
  bkgColor_basedOnSpeed: bytes('bkgColor_basedOnSpeed', 3),
  textLevelSpeed: bytes('textLevelSpeed', 12),
  levelForDisplay: bytes('levelForDisplay', 25),
  txtBox_gameOver: bytesUntil('txtBox_gameOver', 0),
  txtBox_stageClear: bytesUntil('txtBox_stageClear', 0),
  startTxt_YPos: bytes('startTxt_YPos_basedOnNbPlayers', 3),
  musicTypeBox_sprIndex: bytes('musicTypeBox_sprIndex', 3),
  musicTypeBox_XPos: bytes('musicTypeBox_XPos', 3),
  titleCursorYPos: bytes('titleCursorYPos', 3),
  lvlCursor_XPos: bytes('lvlCursor_XPos', 21),
  lvlCursor_YPos: bytes('lvlCursor_YPos', 6),
  speedCursor_XPos: bytes('speedCursor_XPos', 3),
  speedCursor_YPos: bytes('speedCursor_YPos', 6),
  musicBeatDurationTable: bytes('musicBeatDurationTable', 13)
};
// options-screen attribute overlays (format: hi, lo, count, data..., $FF)
function bkgBlocks(name) {
  const a = S(name); const out = []; let p = a;
  while (rd(p) < 0x80) { const ad = (rd(p) << 8) | rd(p + 1); const n = rd(p + 2) & 0x3F; const d = []; for (let i = 0; i < n; i++) d.push(rd(p + 3 + i)); out.push([ad, d]); p += 3 + n; }
  return out;
}
T.optAttr = [bkgBlocks('bkgOptions_cursorOnLvl'), bkgBlocks('bkgOptions_cursorOnSpeed'), bkgBlocks('bkgOptions_cursorOnMusic')];

/* metasprites: jumpTable_sprites -> lists of [dy, tile, attr, dx] */
const META = [];
for (let i = 0; i < 0x4B; i++) {
  const p = rd(S('jumpTable_sprites') + i * 2) | (rd(S('jumpTable_sprites') + i * 2 + 1) << 8);
  const m = []; let q = p;
  while (rd(q) !== 0x80) { m.push([sgn(rd(q)), rd(q + 1), rd(q + 2), sgn(rd(q + 3))]); q += 4; }
  META.push(m);
}

/* palettes (PPUADDR hi, lo, count, 32 bytes) */
const pal = name => bytes(name, 35).slice(3);
const PAL = { level: pal('palLevel_1P'), title: pal('palTitle'), options: pal('palOptions') };

/* ---------------- screens: run the ROM and dump VRAM ---------------- */
const RAM = n => S(n) & 0x7FF;
const nes = new NES();
const run = k => { for (let i = 0; i < k; i++) nes.runFrame(); };
const press = (b, k) => { nes.pad[0] = b; run(2); nes.pad[0] = 0; run(k || 30); };
run(120);
if (nes.ram[RAM('mode')] !== 0) throw new Error('title not reached');
const titleNT = nes.vram.slice(0, 0x400);
press(NES.BTN.start, 60);
if (nes.ram[RAM('mode')] !== 1) throw new Error('options not reached');
const optionsNT = nes.vram.slice(0, 0x400);
// wait for the level screen to be drawn, then take it before the first virus row lands
nes.pad[0] = NES.BTN.start; run(2); nes.pad[0] = 0;
for (let i = 0; i < 20 && nes.ram[RAM('mode')] !== 7 + 1 && nes.ram[RAM('mode')] !== 4; i++) run(1);
const levelNT = nes.vram.slice(0, 0x400);
for (let r = 0; r < 16; r++) for (let c = 0; c < 8; c++) levelNT[0x14C + r * 32 + c] = 0xFF;   // empty bottle
console.log('screens dumped (mode now ' + nes.ram[RAM('mode')] + ')');

/* CHR: banks 0..5 (level tiles frame 0/1, sprites, title tiles frame 0/1, options) */
const CHR = nes.chr.slice(0, 6 * 4096);

const ART = {
  chr: b64(CHR),
  nt: { title: b64(titleNT), options: b64(optionsNT), level: b64(levelNT) },
  pal: PAL, meta: META, tab: T
};
fs.writeFileSync(path.join(ROOT, 'reference', 'art.gen.js'),
  '/* generated by tools/extract.js from the ROM assembled from reference/disasm - do not edit */\nconst ART = ' + JSON.stringify(ART) + ';\n');
console.log('art.gen.js: chr ' + CHR.length + ' bytes, ' + META.length + ' metasprites');

/* ---------------- audio: record the sound driver ---------------- */
/* every write is kept (the music driver relies on rewriting registers each frame after an effect or
   the pause jingle has used the channel); only $4017 = $C0, written first every frame, is implied */
function encode(frames) {
  const out = [];
  for (const fr of frames) {
    for (const [a, v] of fr) { if (a !== 0x17) out.push(a, v); }
    out.push(0xFE);
  }
  return out;
}
function fresh() { const n = new NES(); n.call(S('initAPU_status')); n.apuLog = []; return n; }
function step(n, f) { n.frame = f; const k = n.apuLog.length; n.call(S('audioUpdate')); return n.apuLog.slice(k).map(e => [e[1], e[2]]); }

function song(id) {
  const n = fresh(); n.ram[RAM('music_toPlay')] = id;
  const seen = new Map(); const frames = [];
  for (let f = 0; f < 30000; f++) {
    frames.push(step(n, f));
    if (!n.ram[RAM('music_playing')]) return { frames, loop: -1 };
    const s = Buffer.from(n.ram.slice(0x690, 0x6F0)).toString('hex');
    if (seen.has(s)) return { frames, loop: seen.get(s) + 1 };
    seen.set(s, f);
  }
  throw new Error('song ' + id + ' neither ended nor looped');
}
function sfx(chanVar, playingVar, id) {
  const n = fresh(); n.ram[RAM(chanVar)] = id; const frames = [];
  for (let f = 0; f < 600; f++) {
    frames.push(step(n, f));
    if (!n.ram[RAM(playingVar)]) return frames;               // the frame it ends in is the last one
  }
  throw new Error('sfx ' + chanVar + ' ' + id + ' did not end');
}
function pauseJingle() {
  const n = fresh(); n.ram[RAM('music_toPlay')] = 4; for (let f = 0; f < 30; f++) step(n, f);
  n.ram[RAM('flag_pause_forAudio')] = 5; const frames = [];
  for (let f = 0; f < 22; f++) frames.push(step(n, 30 + f));
  return frames;
}

const SONGS = { chill: 2, silence: 3, fever: 4, fail: 5, title: 6, options: 7, winFever: 9, winChill: 10 };
const SFX = {
  cursorV: ['sfx_toPlay_sq0', 'sfx_playing_sq0', 1], cleared: ['sfx_toPlay_sq0', 'sfx_playing_sq0', 2],
  move: ['sfx_toPlay_sq0', 'sfx_playing_sq0', 3], virus: ['sfx_toPlay_sq0', 'sfx_playing_sq0', 4],
  rotate: ['sfx_toPlay_sq0', 'sfx_playing_sq0', 5], speedUp: ['sfx_toPlay_sq0', 'sfx_playing_sq0', 6],
  land: ['sfx_toPlay_sq0', 'sfx_playing_sq0', 7], eradicated: ['sfx_toPlay_sq0', 'sfx_playing_sq0', 9],
  explosion: ['sfx_toPlay_noise', 'sfx_playing_noise', 2], hurt: ['sfx_toPlay_noise', 'sfx_playing_noise', 3]
};
const tracks = {}; let raw = 0;
for (const [k, id] of Object.entries(SONGS)) {
  const r = song(id); const enc = encode(r.frames); raw += enc.length;
  const loopFrame = r.loop;
  tracks[k] = { id, frames: r.frames.length, loop: loopFrame, beat: T.musicBeatDurationTable[id], data: enc };
  console.log('song ' + k + ': ' + r.frames.length + ' frames, loop ' + loopFrame + ', ' + enc.length + ' bytes');
}
for (const [k, [cv, pv, id]] of Object.entries(SFX)) {
  const fr = sfx(cv, pv, id); const enc = encode(fr); raw += enc.length;
  tracks[k] = { id, frames: fr.length, loop: -1, chan: cv === 'sfx_toPlay_noise' ? 'noise' : 'sq0', data: enc };
  console.log('sfx ' + k + ': ' + fr.length + ' frames');
}
{ const fr = pauseJingle(); const enc = encode(fr); tracks.pause = { frames: fr.length, loop: -1, chan: 'all', data: enc }; }

// all streams concatenated, deflated once; each track keeps its offset/length
const blob = []; const index = {};
for (const [k, t] of Object.entries(tracks)) { index[k] = { o: blob.length, n: t.data.length, frames: t.frames, loop: t.loop, beat: t.beat, chan: t.chan }; blob.push(...t.data); }
const z = zlib.deflateSync(Buffer.from(blob), { level: 9 });
// DMC samples live at $FD00 (written as $F4 / $F6 to $4012)
const dmc = []; for (let a = 0xFD00; a < 0xFF00; a++) dmc.push(rd(a));
const AUDIO = { z: b64(z), size: blob.length, index, dmc: b64(dmc) };
fs.writeFileSync(path.join(ROOT, 'reference', 'audio.gen.js'),
  '/* generated by tools/extract.js by running the ROM sound driver - do not edit */\nconst AUDIO = ' + JSON.stringify(AUDIO) + ';\n');
console.log('audio.gen.js: ' + raw + ' bytes of register writes -> ' + z.length + ' deflated');
