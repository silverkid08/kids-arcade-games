/* Parses the metasprite tables of the Duck Hunt disassembly
   (reference/disasm/Duck-ssembly.asm) and returns, for every sprite image
   index used by SpriteDrawRoutine_D01B, the 8x8 tile cells it occupies
   relative to the entity position (x, y).  Used by extract-art.js to place
   the ripped frames exactly where the NES draws them. */
const fs = require('fs');
const path = require('path');

const CONST = { OAMProp_YFlip: 0x80, OAMProp_XFlip: 0x40, OAMProp_BGPriority: 0x20,
  OAMProp_Palette0: 0, OAMProp_Palette1: 1, OAMProp_Palette2: 2, OAMProp_Palette3: 3 };

function parse() {
  const src = fs.readFileSync(path.join(__dirname, '..', 'reference', 'disasm', 'Duck-ssembly.asm'), 'utf8').split(/\r?\n/);
  const blocks = {}; let cur = null;
  for (let raw of src) {
    const line = raw.replace(/;.*$/, '').trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*):?$/);
    if (m && !/^(db|dw|dwb)$/i.test(m[1])) { cur = blocks[m[1]] = []; continue; }
    if (!cur) continue;
    const d = line.match(/^(db|dw|dwb)\s+(.*)$/i);
    if (!d) { cur = null; continue; }
    for (let tok of d[2].split(',')) {
      tok = tok.trim();
      let v;
      if (/^\$[0-9A-Fa-f]+$/.test(tok)) v = parseInt(tok.slice(1), 16);
      else if (/^[0-9]+$/.test(tok)) v = parseInt(tok, 10);
      else if (tok.includes('|')) v = tok.split('|').reduce((a, t) => a | (CONST[t.trim()] || 0), 0);
      else if (tok in CONST) v = CONST[tok];
      else v = tok;                                   // a label reference
      cur.push(d[1].toLowerCase() === 'db' ? v : { ref: v });
    }
  }
  return blocks;
}

const s8 = v => (v & 0x80 ? v - 256 : v);

function imageCells() {
  const B = parse();
  const offs = B.GeneralSpriteTileOffsets_DCC0;          // y, x pairs
  const pairs = []; for (let i = 0; i < offs.length; i += 2) pairs.push([offs[i], offs[i + 1]]);
  const shapeStart = [0x00, 0x10, 0x38, 0x44].map(o => o / 2);
  const ptrs = B.POINTERS_DAC5.map(p => p.ref);
  const out = [];
  for (const name of ptrs) {
    const img = B[name]; const cells = [];
    if (!img) { out.push(null); continue; }
    for (let i = 0; i < img.length;) {
      if (img[i] === 0) break;
      const part = B[img[i].ref]; const yo = s8(img[i + 1]), xo = s8(img[i + 2]); i += 3;
      let k = shapeStart[part[0]];
      for (let j = 1; j < part.length; j++) {
        const t = part[j];
        if (t === 0xFF) break;
        if (t === 0xFE) { k++; continue; }
        if (t === 0xFD) { j++; continue; }
        const [ty, tx] = pairs[k++];
        cells.push({ x: xo + tx, y: yo + ty, tile: t });
      }
    }
    out.push({ name, cells });
  }
  return out;
}

module.exports = { parse, imageCells };

if (require.main === module) {
  imageCells().forEach((im, i) => {
    if (!im) return;
    const xs = im.cells.map(c => c.x), ys = im.cells.map(c => c.y);
    console.log(i, im.name, 'x', Math.min(...xs), Math.max(...xs) + 8, 'y', Math.min(...ys), Math.max(...ys) + 8, 'tiles', im.cells.length);
  });
}
