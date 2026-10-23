/* Minimal DOM stub so the game can run under node for testing.
   Copied from pac-man/tools/harness.js and extended with:
     - an optional software canvas (set global.__HARNESS_PIXELS = true before
       requiring this file) that really executes fillRect / drawImage /
       putImageData into an RGBA buffer, so tools/render-frame.js can write
       a real PNG of what the game draws;
     - ImageData support (the game decodes its sprites with putImageData);
     - a keyboard event dispatcher (global.__key). */
const noop = () => {};
const PIXELS = !!global.__HARNESS_PIXELS;

function parseColour(c) {
  if (typeof c !== 'string') return [0, 0, 0, 255];
  if (c[0] === '#') {
    if (c.length === 4) return [parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16), 255];
    return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16), 255];
  }
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(',').map(Number);
    return [p[0], p[1], p[2], p.length > 3 ? Math.round(p[3] * 255) : 255];
  }
  return [255, 255, 255, 255];
}

function makeImageData(w, h) {
  return { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) };
}

function makePixelCtx(canvas) {
  const ctx = {
    canvas, fillStyle: '#000', strokeStyle: '#000', globalAlpha: 1, font: '', textAlign: 'left',
    imageSmoothingEnabled: false, _tx: 0, _ty: 0, _stack: []
  };
  function buf() {
    if (!canvas._buf || canvas._bw !== canvas.width || canvas._bh !== canvas.height) {
      canvas._buf = new Uint8ClampedArray(canvas.width * canvas.height * 4);
      canvas._bw = canvas.width; canvas._bh = canvas.height;
    }
    return canvas._buf;
  }
  function blend(b, i, r, g, bl, a) {
    if (a <= 0) return;
    if (a >= 255) { b[i] = r; b[i + 1] = g; b[i + 2] = bl; b[i + 3] = 255; return; }
    const t = a / 255;
    b[i] = b[i] * (1 - t) + r * t; b[i + 1] = b[i + 1] * (1 - t) + g * t; b[i + 2] = b[i + 2] * (1 - t) + bl * t;
    b[i + 3] = Math.max(b[i + 3], a);
  }
  ctx.fillRect = function (x, y, w, h) {
    const b = buf(), W = canvas.width, H = canvas.height;
    const [r, g, bl, a0] = parseColour(ctx.fillStyle);
    const a = Math.round(a0 * ctx.globalAlpha);
    x = Math.round(x + ctx._tx); y = Math.round(y + ctx._ty); w = Math.round(w); h = Math.round(h);
    for (let yy = Math.max(0, y); yy < Math.min(H, y + h); yy++)
      for (let xx = Math.max(0, x); xx < Math.min(W, x + w); xx++) blend(b, (yy * W + xx) * 4, r, g, bl, a);
  };
  ctx.clearRect = function (x, y, w, h) {
    const b = buf(), W = canvas.width, H = canvas.height;
    x = Math.round(x + ctx._tx); y = Math.round(y + ctx._ty);
    for (let yy = Math.max(0, y); yy < Math.min(H, y + h); yy++)
      for (let xx = Math.max(0, x); xx < Math.min(W, x + w); xx++) { const i = (yy * W + xx) * 4; b[i] = b[i + 1] = b[i + 2] = b[i + 3] = 0; }
  };
  ctx.drawImage = function (img, a, b2, c, d, e, f, g, h) {
    let sx, sy, sw, sh, dx, dy, dw, dh;
    if (h !== undefined) { sx = a; sy = b2; sw = c; sh = d; dx = e; dy = f; dw = g; dh = h; }
    else if (d !== undefined) { sx = 0; sy = 0; sw = img.width; sh = img.height; dx = a; dy = b2; dw = c; dh = d; }
    else { sx = 0; sy = 0; sw = img.width; sh = img.height; dx = a; dy = b2; dw = sw; dh = sh; }
    if (!img._buf) return;
    const src = img._buf, SW = img._bw;
    const dst = buf(), W = canvas.width, H = canvas.height;
    dx = Math.round(dx + ctx._tx); dy = Math.round(dy + ctx._ty);
    for (let yy = 0; yy < dh; yy++) {
      const ty = dy + yy; if (ty < 0 || ty >= H) continue;
      const syy = sy + Math.floor(yy * sh / dh);
      for (let xx = 0; xx < dw; xx++) {
        const tx = dx + xx; if (tx < 0 || tx >= W) continue;
        const sxx = sx + Math.floor(xx * sw / dw);
        const si = (syy * SW + sxx) * 4;
        blend(dst, (ty * W + tx) * 4, src[si], src[si + 1], src[si + 2], Math.round(src[si + 3] * ctx.globalAlpha));
      }
    }
  };
  ctx.createImageData = (w, h) => makeImageData(w, h);
  ctx.getImageData = function (x, y, w, h) {
    const out = makeImageData(w, h), b = buf(), W = canvas.width;
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
      const si = ((y + yy) * W + x + xx) * 4, di = (yy * w + xx) * 4;
      out.data[di] = b[si]; out.data[di + 1] = b[si + 1]; out.data[di + 2] = b[si + 2]; out.data[di + 3] = b[si + 3];
    }
    return out;
  };
  ctx.putImageData = function (img, x, y) {
    const b = buf(), W = canvas.width, H = canvas.height;
    for (let yy = 0; yy < img.height; yy++) for (let xx = 0; xx < img.width; xx++) {
      const tx = x + xx, ty = y + yy; if (tx < 0 || ty < 0 || tx >= W || ty >= H) continue;
      const si = (yy * img.width + xx) * 4, di = (ty * W + tx) * 4;
      b[di] = img.data[si]; b[di + 1] = img.data[si + 1]; b[di + 2] = img.data[si + 2]; b[di + 3] = img.data[si + 3];
    }
  };
  ctx.save = function () { ctx._stack.push([ctx._tx, ctx._ty, ctx.globalAlpha, ctx.fillStyle]); };
  ctx.restore = function () { const s = ctx._stack.pop(); if (s) { ctx._tx = s[0]; ctx._ty = s[1]; ctx.globalAlpha = s[2]; ctx.fillStyle = s[3]; } };
  ctx.translate = function (x, y) { ctx._tx += x; ctx._ty += y; };
  for (const m of ['beginPath', 'closePath', 'moveTo', 'lineTo', 'arc', 'fill', 'stroke', 'scale', 'rotate',
    'setTransform', 'resetTransform', 'fillText', 'strokeText', 'rect', 'clip', 'setLineDash']) ctx[m] = noop;
  ctx.measureText = () => ({ width: 4 });
  return ctx;
}

function makeCtx(canvas) {
  if (PIXELS) return makePixelCtx(canvas);
  const c = { canvas };
  const methods = ['fillRect', 'clearRect', 'beginPath', 'closePath', 'moveTo', 'lineTo', 'arc', 'ellipse',
    'quadraticCurveTo', 'bezierCurveTo', 'fill', 'stroke', 'save', 'restore', 'translate', 'scale', 'rotate',
    'setTransform', 'resetTransform', 'drawImage', 'fillText', 'strokeText', 'rect', 'clip', 'arcTo', 'setLineDash',
    'putImageData'];
  for (const m of methods) c[m] = noop;
  c.measureText = () => ({ width: 4 });
  c.createImageData = (w, h) => makeImageData(w, h);
  c.getImageData = (x, y, w, h) => makeImageData(w, h);
  return c;
}

function makeEl(tag) {
  const el = {
    tagName: tag, style: {}, dataset: {}, children: [],
    textContent: '', innerHTML: '', width: 0, height: 0, value: '',
    listeners: {},
    classList: {
      _s: new Set(),
      add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); },
      toggle(c, on) { if (on === undefined) on = !this._s.has(c); on ? this._s.add(c) : this._s.delete(c); },
      contains(c) { return this._s.has(c); }
    },
    addEventListener(t, f) { (this.listeners[t] = this.listeners[t] || []).push(f); },
    removeEventListener() {},
    appendChild(c) { this.children.push(c); c.parentNode = el; return c; },
    removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); return c; },
    insertBefore(c, ref) { const i = this.children.indexOf(ref); if (i >= 0) this.children.splice(i, 0, c); else this.children.push(c); c.parentNode = el; return c; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k]; },
    focus() {}, blur() {},
    getContext() { if (!this._ctx) this._ctx = makeCtx(this); return this._ctx; },
    click() { (this.listeners.click || []).forEach(f => f({ preventDefault: noop, stopPropagation: noop })); }
  };
  Object.defineProperty(el, 'firstChild', { get() { return el.children[0] || null; } });
  return el;
}

const elements = {};
const docListeners = {};
global.document = {
  hidden: false,
  getElementById(id) { return elements[id] || (elements[id] = makeEl('div')); },
  createElement(tag) { return makeEl(tag); },
  addEventListener(t, f) { (docListeners[t] = docListeners[t] || []).push(f); },
  removeEventListener: noop,
  body: makeEl('body'),
  activeElement: null
};
global.__elements = elements;
global.__docListeners = docListeners;

const winListeners = {};
global.window = {
  innerWidth: 1200, innerHeight: 900, devicePixelRatio: 1,
  addEventListener(t, f) { (winListeners[t] = winListeners[t] || []).push(f); },
  removeEventListener: noop,
  AudioContext: undefined,
  location: { href: 'file:///index.html' }
};
global.__winListeners = winListeners;
global.localStorage = {
  _d: {},
  getItem(k) { return k in this._d ? this._d[k] : null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; }
};
global.requestAnimationFrame = (cb) => { global.__raf = cb; return 1; };
global.performance = { now: () => 0 };
global.navigator = { userAgent: 'node' };

/* fire a keyboard event the way the browser would */
global.__key = function (type, key, code) {
  const ev = { key, code: code || key, preventDefault: noop, stopPropagation: noop, repeat: false, target: {} };
  (docListeners[type] || []).forEach(f => f(ev));
  (winListeners[type] || []).forEach(f => f(ev));
};
