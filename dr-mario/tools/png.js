/* Minimal PNG decode / encode, so the arcade reference frame can be read
   and comparison images written without any dependencies. */
const fs = require('fs');
const zlib = require('zlib');

function decodePNG(file) {
  const buf = fs.readFileSync(file);
  let pos = 8, w = 0, h = 0, depth = 8, color = 6, plte = null;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.slice(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4);
      depth = data[8]; color = data[9];
    } else if (type === 'PLTE') plte = data;
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[color];
  const bpp = Math.max(1, (channels * depth) / 8);
  const stride = Math.ceil((w * channels * depth) / 8);
  const out = Buffer.alloc(h * stride);
  let p = 0;
  for (let y = 0; y < h; y++) {
    const filter = raw[p++];
    const line = raw.slice(p, p + stride); p += stride;
    const cur = out.slice(y * stride, (y + 1) * stride);
    const prev = y ? out.slice((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      let v = line[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      }
      cur[i] = v & 0xff;
    }
  }
  function pixel(x, y) {
    if (depth === 8) {
      const i = y * stride + x * channels;
      if (color === 3) { const q = out[i] * 3; return [plte[q], plte[q + 1], plte[q + 2]]; }
      if (color === 2 || color === 6) return [out[i], out[i + 1], out[i + 2]];
      return [out[i], out[i], out[i]];
    }
    const perByte = 8 / depth;
    const i = y * stride + Math.floor(x / perByte);
    const shift = 8 - depth * ((x % perByte) + 1);
    const v = (out[i] >> shift) & ((1 << depth) - 1);
    if (color === 3) { const q = v * 3; return [plte[q], plte[q + 1], plte[q + 2]]; }
    const s = Math.round((v * 255) / ((1 << depth) - 1));
    return [s, s, s];
  }
  return { w, h, depth, color, pixel };
}

let crcTable = null;
function crc32(b) {
  if (!crcTable) {
    crcTable = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
  }
  let c = 0xFFFFFFFF;
  for (const byte of b) c = crcTable[(c ^ byte) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/* rgb: a width*height*3 buffer */
function encodePNG(file, width, height, rgb) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    rgb.copy(raw, y * (width * 3 + 1) + 1, y * width * 3, (y + 1) * width * 3);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 2;
  fs.writeFileSync(file, Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))
  ]));
}

module.exports = { decodePNG, encodePNG };
