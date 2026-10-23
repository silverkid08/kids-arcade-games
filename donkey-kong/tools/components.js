/* List bounding boxes of connected sprites on a sheet whose background is
   black (or transparent).  Boxes within `gap` px of each other are merged so a
   sprite with detached sparks still comes out as one box.
     node tools/components.js <sheet.png> [gap] [bgR,bgG,bgB]
*/
const { decodePNG } = require('./png.js');
const [,, file, gapArg, bgArg] = process.argv;
const img = decodePNG(file);
const gap = gapArg ? Number(gapArg) : 1;
const bgs = [[0, 0, 0]];
if (bgArg) bgs.push(bgArg.split(',').map(Number));
function isBg(x, y) {
  if (img.alpha(x, y) === 0) return true;
  const p = img.pixel(x, y);
  return bgs.some(b => Math.abs(b[0] - p[0]) < 8 && Math.abs(b[1] - p[1]) < 8 && Math.abs(b[2] - p[2]) < 8);
}
const seen = new Uint8Array(img.w * img.h);
let boxes = [];
for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) {
  if (seen[y * img.w + x] || isBg(x, y)) continue;
  let x0 = x, x1 = x, y0 = y, y1 = y;
  const st = [[x, y]]; seen[y * img.w + x] = 1;
  while (st.length) {
    const [cx, cy] = st.pop();
    x0 = Math.min(x0, cx); x1 = Math.max(x1, cx); y0 = Math.min(y0, cy); y1 = Math.max(y1, cy);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= img.w || ny >= img.h) continue;
      if (seen[ny * img.w + nx] || isBg(nx, ny)) continue;
      seen[ny * img.w + nx] = 1; st.push([nx, ny]);
    }
  }
  boxes.push({ x0, y0, x1, y1 });
}
let merged = true;
while (merged) {
  merged = false;
  for (let i = 0; i < boxes.length && !merged; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    if (a.x0 <= b.x1 + gap && b.x0 <= a.x1 + gap && a.y0 <= b.y1 + gap && b.y0 <= a.y1 + gap) {
      boxes[i] = { x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) };
      boxes.splice(j, 1); merged = true; break;
    }
  }
}
boxes.sort((a, b) => (a.y0 - b.y0) || (a.x0 - b.x0));
for (const b of boxes) console.log(`x=${b.x0} y=${b.y0} w=${b.x1 - b.x0 + 1} h=${b.y1 - b.y0 + 1}`);
