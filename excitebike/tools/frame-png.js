/* helpers: write the game framebuffer or an emulator frame to PNG, and diff two frames */
const { encodePNG } = require('./png.js');
function writeRGBA(file, data, w, h, scale) {
  scale = scale || 2;
  const rgb = Buffer.alloc(w * scale * h * scale * 3);
  for (let y = 0; y < h * scale; y++) for (let x = 0; x < w * scale; x++) {
    const si = ((y / scale | 0) * w + (x / scale | 0)) * 4, di = (y * w * scale + x) * 3;
    rgb[di] = data[si]; rgb[di + 1] = data[si + 1]; rgb[di + 2] = data[si + 2];
  }
  encodePNG(file, w * scale, h * scale, rgb);
}
function emuRGBA(n) {                         // emulator frame as RGBA
  const NES = require('./nes.js'); const out = new Uint8Array(256 * 240 * 4);
  for (let i = 0; i < 256 * 240; i++) { const c = NES.RGB[n.fb[i] & 0x3F]; out[i * 4] = c >> 16; out[i * 4 + 1] = (c >> 8) & 255; out[i * 4 + 2] = c & 255; out[i * 4 + 3] = 255; }
  return out;
}
function diff(a, b) { let n = 0; for (let i = 0; i < a.length; i += 4) if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) n++; return n; }
module.exports = { writeRGBA, emuRGBA, diff };
