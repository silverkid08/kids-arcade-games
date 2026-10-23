/* Minimal GIF decoder (enough for small sprite GIFs): returns every frame as
   an RGBA-ish object with pixel(x,y) -> [r,g,b] and alpha(x,y). Frames are
   composited onto the previous frame as GIF players do (disposal 1/0). */
const fs = require('fs');

function decodeGIF(file) {
  const b = fs.readFileSync(file);
  let p = 6;
  const w = b.readUInt16LE(p), h = b.readUInt16LE(p + 2); p += 4;
  const flags = b[p++]; p += 2; // bg index, aspect
  let gct = null;
  if (flags & 0x80) { const n = 1 << ((flags & 7) + 1); gct = b.slice(p, p + n * 3); p += n * 3; }
  const frames = [];
  let canvas = new Int16Array(w * h).fill(-1); // -1 transparent, else index into a palette list
  let palettes = [];
  let transparent = -1, disposal = 0;
  while (p < b.length) {
    const t = b[p++];
    if (t === 0x3B) break;
    if (t === 0x21) {
      const label = b[p++];
      if (label === 0xF9) {
        const sz = b[p++]; const f = b[p]; disposal = (f >> 2) & 7;
        transparent = (f & 1) ? b[p + 3] : -1; p += sz; while (b[p] !== 0) p += b[p] + 1; p++;
      } else { while (b[p] !== 0) p += b[p] + 1; p++; }
      continue;
    }
    if (t !== 0x2C) throw new Error('unexpected block 0x' + t.toString(16) + ' at ' + p);
    const fx = b.readUInt16LE(p), fy = b.readUInt16LE(p + 2), fw = b.readUInt16LE(p + 4), fh = b.readUInt16LE(p + 6); p += 8;
    const lf = b[p++];
    let pal = gct;
    if (lf & 0x80) { const n = 1 << ((lf & 7) + 1); pal = b.slice(p, p + n * 3); p += n * 3; }
    const interlaced = !!(lf & 0x40);
    const minCode = b[p++];
    const chunks = [];
    while (b[p] !== 0) { chunks.push(b.slice(p + 1, p + 1 + b[p])); p += b[p] + 1; }
    p++;
    const data = Buffer.concat(chunks);
    const idx = lzw(data, minCode, fw * fh);
    const palId = palettes.length; palettes.push(pal);
    const prev = disposal === 3 ? canvas.slice() : null;
    const before = canvas.slice();
    let rows = [];
    if (interlaced) { for (const [s, st] of [[0, 8], [4, 8], [2, 4], [1, 2]]) for (let r = s; r < fh; r += st) rows.push(r); }
    else for (let r = 0; r < fh; r++) rows.push(r);
    let k = 0;
    for (const r of rows) for (let c = 0; c < fw; c++) {
      const v = idx[k++];
      if (v === transparent) continue;
      const x = fx + c, y = fy + r;
      if (x < w && y < h) canvas[y * w + x] = palId * 256 + v;
    }
    const snap = canvas.slice();
    frames.push({
      w, h,
      pixel(x, y) { const v = snap[y * w + x]; if (v < 0) return [0, 0, 0]; const pl = palettes[v >> 8], i = (v & 255) * 3; return [pl[i], pl[i + 1], pl[i + 2]]; },
      alpha(x, y) { return snap[y * w + x] < 0 ? 0 : 255; }
    });
    if (disposal === 2) { for (let r = 0; r < fh; r++) for (let c = 0; c < fw; c++) canvas[(fy + r) * w + fx + c] = -1; }
    else if (disposal === 3 && prev) canvas = prev;
  }
  return { w, h, frames };
}

function lzw(data, minCode, npix) {
  const out = new Uint8Array(npix);
  const clear = 1 << minCode, eoi = clear + 1;
  let codeSize = minCode + 1, next = eoi + 1;
  const prefix = new Int32Array(4096), suffix = new Uint8Array(4096), lens = new Int32Array(4096);
  for (let i = 0; i < clear; i++) { prefix[i] = -1; suffix[i] = i; lens[i] = 1; }
  let bitBuf = 0, bitCnt = 0, pos = 0, o = 0, prevCode = -1;
  const stack = new Uint8Array(4097);
  while (o < npix) {
    while (bitCnt < codeSize && pos < data.length) { bitBuf |= data[pos++] << bitCnt; bitCnt += 8; }
    if (bitCnt < codeSize) break;
    const code = bitBuf & ((1 << codeSize) - 1); bitBuf >>>= codeSize; bitCnt -= codeSize;
    if (code === clear) { codeSize = minCode + 1; next = eoi + 1; prevCode = -1; continue; }
    if (code === eoi) break;
    let cur = code, first;
    if (code >= next) { // KwKwK case
      if (prevCode < 0) break;
      let c = prevCode; while (prefix[c] >= 0) c = prefix[c]; first = suffix[c];
      prefix[next] = prevCode; suffix[next] = first; lens[next] = lens[prevCode] + 1;
      cur = next;
    }
    // emit string for cur
    let n = lens[cur], c = cur;
    for (let i = n - 1; i >= 0; i--) { stack[i] = suffix[c]; c = prefix[c]; }
    for (let i = 0; i < n && o < npix; i++) out[o++] = stack[i];
    first = stack[0];
    if (prevCode >= 0 && code < next && next < 4096) { prefix[next] = prevCode; suffix[next] = first; lens[next] = lens[prevCode] + 1; next++; }
    else if (code >= next && next < 4096) next++;
    if (next === (1 << codeSize) && codeSize < 12) codeSize++;
    prevCode = cur;
  }
  return out;
}

module.exports = { decodeGIF };

if (require.main === module) {
  const { encodePNG } = require('./png.js');
  const [,, inFile, outPrefix] = process.argv;
  const g = decodeGIF(inFile);
  console.log(inFile + ': ' + g.w + 'x' + g.h + ', ' + g.frames.length + ' frames');
  g.frames.forEach((f, i) => {
    const rgb = Buffer.alloc(g.w * g.h * 3);
    for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) {
      const p = f.alpha(x, y) ? f.pixel(x, y) : [40, 40, 40];
      rgb[(y * g.w + x) * 3] = p[0]; rgb[(y * g.w + x) * 3 + 1] = p[1]; rgb[(y * g.w + x) * 3 + 2] = p[2];
    }
    encodePNG(outPrefix + i + '.png', g.w, g.h, rgb);
  });
}
