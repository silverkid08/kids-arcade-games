/* DOM / canvas / audio stubs so index.html's script can run under node.
   Copied from pac-man/tools/harness.js and extended with a tiny SOFTWARE
   CANVAS: every 2D context keeps an RGB pixel buffer and implements the
   handful of calls the game uses (fillRect, drawImage between canvases,
   putImageData/createImageData, setTransform/scale), so a frame can be
   rendered headlessly and written to PNG (see tools/render-frame.js). */
const noop = () => {};

function hexToRgb(s) {
  if (typeof s !== 'string') return [0, 0, 0];
  if (s[0] === '#') {
    if (s.length === 4) return [parseInt(s[1] + s[1], 16), parseInt(s[2] + s[2], 16), parseInt(s[3] + s[3], 16)];
    return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
  }
  const m = /rgba?\(([^)]+)\)/.exec(s);
  if (m) { const p = m[1].split(',').map(Number); return [p[0] | 0, p[1] | 0, p[2] | 0]; }
  return [0, 0, 0];
}

function makeCtx(canvas) {
  const c = {
    canvas, fillStyle: '#000', strokeStyle: '#000', globalAlpha: 1, font: '', imageSmoothingEnabled: true,
    _sx: 1, _sy: 1, _tx: 0, _ty: 0, _stack: []
  };
  const methods = ['clearRect', 'beginPath', 'closePath', 'moveTo', 'lineTo', 'arc', 'ellipse',
    'quadraticCurveTo', 'bezierCurveTo', 'fill', 'stroke', 'rotate', 'fillText', 'strokeText', 'rect', 'clip',
    'arcTo', 'setLineDash', 'strokeRect'];
  for (const m of methods) c[m] = noop;
  c.measureText = () => ({ width: 4 });
  c.save = function () { this._stack.push([this._sx, this._sy, this._tx, this._ty, this.globalAlpha]); };
  c.restore = function () { const s = this._stack.pop(); if (s) { [this._sx, this._sy, this._tx, this._ty, this.globalAlpha] = s; } };
  c.setTransform = function (a, b, cc, d, e, f) { this._sx = a; this._sy = d; this._tx = e; this._ty = f; };
  c.resetTransform = function () { this._sx = this._sy = 1; this._tx = this._ty = 0; };
  c.scale = function (x, y) { this._sx *= x; this._sy *= y; };
  c.translate = function (x, y) { this._tx += x * this._sx; this._ty += y * this._sy; };
  c.fillRect = function (x, y, w, h) {
    const cv = this.canvas; if (!cv._buf) return;
    const rgb = hexToRgb(this.fillStyle);
    const x0 = Math.round(x * this._sx + this._tx), y0 = Math.round(y * this._sy + this._ty);
    const x1 = Math.round((x + w) * this._sx + this._tx), y1 = Math.round((y + h) * this._sy + this._ty);
    for (let yy = Math.max(0, y0); yy < Math.min(cv.height, y1); yy++)
      for (let xx = Math.max(0, x0); xx < Math.min(cv.width, x1); xx++) {
        const i = (yy * cv.width + xx) * 4;
        cv._buf[i] = rgb[0]; cv._buf[i + 1] = rgb[1]; cv._buf[i + 2] = rgb[2]; cv._buf[i + 3] = 255;
      }
  };
  c.createImageData = function (w, h) { return { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }; };
  c.putImageData = function (img, dx, dy) {
    const cv = this.canvas; if (!cv._buf) return;
    for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) {
      const xx = dx + x, yy = dy + y;
      if (xx < 0 || yy < 0 || xx >= cv.width || yy >= cv.height) continue;
      const s = (y * img.width + x) * 4, d = (yy * cv.width + xx) * 4;
      cv._buf[d] = img.data[s]; cv._buf[d + 1] = img.data[s + 1]; cv._buf[d + 2] = img.data[s + 2]; cv._buf[d + 3] = img.data[s + 3];
    }
  };
  c.getImageData = function (x, y, w, h) {
    const img = this.createImageData(w, h), cv = this.canvas;
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
      const s = ((y + yy) * cv.width + (x + xx)) * 4, d = (yy * w + xx) * 4;
      for (let k = 0; k < 4; k++) img.data[d + k] = cv._buf ? cv._buf[s + k] : 0;
    }
    return img;
  };
  /* drawImage(src, dx, dy) or drawImage(src, sx, sy, sw, sh, dx, dy, dw, dh); 1:1 only */
  c.drawImage = function (src, a, b, cc, d, e, f, g, hh) {
    const cv = this.canvas; if (!cv._buf || !src || !src._buf) return;
    let sx = 0, sy = 0, sw = src.width, sh = src.height, dx = a, dy = b;
    if (g !== undefined) { sx = a; sy = b; sw = cc; sh = d; dx = e; dy = f; }
    const x0 = Math.round(dx * this._sx + this._tx), y0 = Math.round(dy * this._sy + this._ty);
    const db = cv._buf, sb = src._buf, dw = cv.width, dh = cv.height, spw = src.width;
    const xs = Math.max(0, -x0), xe = Math.min(sw, dw - x0);
    const ys = Math.max(0, -y0), ye = Math.min(sh, dh - y0);
    for (let y = ys; y < ye; y++) {
      let s = ((sy + y) * spw + sx + xs) * 4, dd = ((y0 + y) * dw + x0 + xs) * 4;
      for (let x = xs; x < xe; x++, s += 4, dd += 4) {
        if (sb[s + 3] === 0) continue;
        db[dd] = sb[s]; db[dd + 1] = sb[s + 1]; db[dd + 2] = sb[s + 2]; db[dd + 3] = 255;
      }
    }
  };
  return c;
}

function makeEl(tag) {
  const el = {
    tagName: tag, style: {}, dataset: {}, children: [], parentNode: null,
    textContent: '', innerHTML: '', _w: 0, _h: 0, value: '', checked: false, disabled: false,
    listeners: {},
    classList: {
      _s: new Set(),
      add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); },
      toggle(c, on) { if (on === undefined) on = !this._s.has(c); on ? this._s.add(c) : this._s.delete(c); return on; },
      contains(c) { return this._s.has(c); }
    },
    addEventListener(t, f) { (this.listeners[t] = this.listeners[t] || []).push(f); },
    removeEventListener() {},
    appendChild(c) { this.children.push(c); c.parentNode = this; return c; },
    removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); return c; },
    insertBefore(c) { this.children.unshift(c); c.parentNode = this; return c; },
    setAttribute(k, v) { this[k] = v; }, getAttribute(k) { return this[k]; },
    querySelector() { return null; }, querySelectorAll() { return []; },
    focus: noop, blur: noop,
    getContext() { if (!this._ctx) this._ctx = makeCtx(this); return this._ctx; },
    getBoundingClientRect() { return { left: 0, top: 0, width: 224, height: 256 }; },
    click() { (this.listeners.click || []).forEach(f => f({ preventDefault: noop })); },
    dispatch(t, ev) { (this.listeners[t] || []).forEach(f => f(Object.assign({ preventDefault: noop, target: this }, ev))); }
  };
  /* canvas pixel buffer follows width/height */
  Object.defineProperty(el, 'width', {
    get() { return this._w; },
    set(v) { this._w = v | 0; if (tag === 'canvas') this._buf = new Uint8ClampedArray(this._w * this._h * 4); }
  });
  Object.defineProperty(el, 'height', {
    get() { return this._h; },
    set(v) { this._h = v | 0; if (tag === 'canvas') this._buf = new Uint8ClampedArray(this._w * this._h * 4); }
  });
  return el;
}

const elements = {};
global.document = {
  hidden: false,
  body: makeEl('body'),
  getElementById(id) { return elements[id] || (elements[id] = makeEl(id === 'screen' ? 'canvas' : 'div')); },
  createElement(tag) { return makeEl(tag); },
  querySelector() { return null; }, querySelectorAll() { return []; },
  addEventListener: noop,
  activeElement: null
};
global.__elements = elements;

const winListeners = {};
global.window = {
  innerWidth: 236, innerHeight: 268, devicePixelRatio: 1,   // 1:1 scale so pixel tests see the 224x256 screen
  addEventListener(t, f) { (winListeners[t] = winListeners[t] || []).push(f); },
  removeEventListener: noop,
  AudioContext: undefined,
  location: { href: 'file:///index.html' }
};
global.__winListeners = winListeners;
global.navigator = { userAgent: 'node' };
global.localStorage = {
  _d: {},
  getItem(k) { return k in this._d ? this._d[k] : null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; }
};
global.requestAnimationFrame = (cb) => { global.__raf = cb; return 1; };
global.cancelAnimationFrame = noop;
global.performance = { now: () => 0 };

/* press a key the way the game's keydown handler expects */
global.__key = function (key, type) {
  (winListeners[type || 'keydown'] || []).forEach(f => f({ key, preventDefault: noop, repeat: false }));
};
