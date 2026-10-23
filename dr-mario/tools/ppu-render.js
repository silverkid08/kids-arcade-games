/* Offline NES picture: draws what tools/nes.js captured (VRAM, palette, OAM,
   CHR banks) into an RGB buffer, so screens of the REAL ROM can be compared
   with the clone's render (tools/rom-diff.js, tools/extract.js `shots`). */
'use strict';
const { encodePNG } = require('./png.js');

/* 2C02 palette (the widely used "2C02G" measurement, as in Mesen's default) */
const NES_PAL = [
  0x666666, 0x002A88, 0x1412A7, 0x3B00A4, 0x5C007E, 0x6E0040, 0x6C0600, 0x561D00,
  0x333500, 0x0B4800, 0x005200, 0x004F08, 0x00404D, 0x000000, 0x000000, 0x000000,
  0xADADAD, 0x155FD9, 0x4240FF, 0x7527FE, 0xA01ACC, 0xB71E7B, 0xB53120, 0x994E00,
  0x6B6D00, 0x388700, 0x0C9300, 0x008F32, 0x007C8D, 0x000000, 0x000000, 0x000000,
  0xFFFEFF, 0x64B0FF, 0x9290FF, 0xC676FF, 0xF36AFF, 0xFE6ECC, 0xFE8170, 0xEA9E22,
  0xBCBE00, 0x88D800, 0x5CE430, 0x45E082, 0x48CDDE, 0x4F4F4F, 0x000000, 0x000000,
  0xFFFEFF, 0xC0DFFF, 0xD3D2FF, 0xE8C8FF, 0xFBC2FF, 0xFEC4EA, 0xFECCC5, 0xF7D8A5,
  0xE4E594, 0xCFEF96, 0xBDF4AB, 0xB3F3CC, 0xB5EBF2, 0xB8B8B8, 0x000000, 0x000000];

function tilePixel(chr, bank, tile, x, y) {
  const o = bank * 4096 + tile * 16 + y;
  return ((chr[o] >> (7 - x)) & 1) | (((chr[o + 8] >> (7 - x)) & 1) << 1);
}

/* returns {w:256,h:240,rgb:Uint32Array of 0xRRGGBB} */
function renderNES(nes) {
  const W = 256, H = 240, out = new Uint32Array(W * H);
  const bgBank = nes.chr1, spBank = nes.chr0;   // PPUCTRL: BG at $1000, sprites at $0000 (8x8)
  const showBg = nes.ppumask & 8, showSp = nes.ppumask & 16;
  const idx = new Uint8Array(W * H);
  for (let ty = 0; ty < 30; ty++) for (let tx = 0; tx < 32; tx++) {
    const t = nes.vram[ty * 32 + tx];
    const at = nes.vram[0x3C0 + (ty >> 2) * 8 + (tx >> 2)];
    const pal = (at >> (((ty & 2) << 1) | (tx & 2))) & 3;
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const p = showBg ? tilePixel(nes.chr, bgBank, t, x, y) : 0;
      const i = (ty * 8 + y) * W + tx * 8 + x;
      idx[i] = p;
      out[i] = NES_PAL[nes.pal[p ? pal * 4 + p : 0] & 0x3F];
    }
  }
  if (showSp) {
    for (let s = 63; s >= 0; s--) {
      const sy = nes.oam[s * 4] + 1, t = nes.oam[s * 4 + 1], at = nes.oam[s * 4 + 2], sx = nes.oam[s * 4 + 3];
      if (nes.oam[s * 4] >= 0xEF) continue;
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
        const px = (at & 0x40) ? 7 - x : x, py = (at & 0x80) ? 7 - y : y;
        const p = tilePixel(nes.chr, spBank, t, px, py);
        if (!p) continue;
        const X = sx + x, Y = sy + y;
        if (X > 255 || Y > 239) continue;
        const i = Y * W + X;
        if ((at & 0x20) && idx[i]) continue;
        out[i] = NES_PAL[nes.pal[16 + (at & 3) * 4 + p] & 0x3F];
      }
    }
  }
  return { w: W, h: H, rgb: out };
}

function savePNG(file, pic, scale, crop) {
  scale = scale || 2;
  const y0 = crop ? 8 : 0, H = crop ? 224 : pic.h, W = pic.w;
  const buf = Buffer.alloc(W * scale * H * scale * 3);
  for (let y = 0; y < H * scale; y++) for (let x = 0; x < W * scale; x++) {
    const c = pic.rgb[(y0 + Math.floor(y / scale)) * W + Math.floor(x / scale)];
    const d = (y * W * scale + x) * 3;
    buf[d] = c >> 16; buf[d + 1] = (c >> 8) & 255; buf[d + 2] = c & 255;
  }
  encodePNG(file, W * scale, H * scale, buf);
}

module.exports = { NES_PAL, renderNES, savePNG, tilePixel };
