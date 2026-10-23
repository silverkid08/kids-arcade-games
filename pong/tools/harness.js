/* Minimal DOM / canvas / audio stub so the game can run under node for testing.
   Copied from duck-hunt/tools/harness.js (itself from pac-man) and extended:
   - Pong draws everything with fillRect, so when global.__RASTER is true the
     2D context really rasterises fillRect / clearRect (with fillStyle,
     globalAlpha and the 'source-atop' mode the scanlines use) into an RGBA
     buffer on the canvas (canvas._buf).  render-frame.js turns that into a PNG.
   - elements keep a `value`, `placeholder`, `dataset`, and `activeElement` exists. */
const noop = () => {};

function makeImageData(w, h) {
  return { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) };
}

function parseColor(s) {
  s = String(s).trim();
  let m;
  if (s[0] === '#') {
    if (s.length === 4) return [parseInt(s[1] + s[1], 16), parseInt(s[2] + s[2], 16), parseInt(s[3] + s[3], 16), 1];
    return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16), 1];
  }
  if ((m = s.match(/^rgba?\(([^)]+)\)$/))) {
    const p = m[1].split(',').map(Number);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  }
  return [255, 0, 255, 1];
}

function makeCtx(canvas) {
  const c = {};
  const methods = ['beginPath', 'closePath', 'moveTo', 'lineTo', 'arc', 'ellipse',
    'quadraticCurveTo', 'bezierCurveTo', 'fill', 'stroke', 'save', 'restore', 'translate', 'scale', 'rotate',
    'setTransform', 'resetTransform', 'drawImage', 'fillText', 'strokeText', 'rect', 'clip', 'arcTo',
    'setLineDash', 'putImageData', 'strokeRect'];
  for (const m of methods) c[m] = noop;
  c.measureText = (s) => ({ width: 4 * String(s).length });
  c.createImageData = (w, h) => makeImageData(w, h);
  c.getImageData = (x, y, w, h) => makeImageData(w, h);
  c.canvas = canvas;
  c.imageSmoothingEnabled = true;
  c.fillStyle = '#000';
  c.globalAlpha = 1;
  c.globalCompositeOperation = 'source-over';
  c.fillRectCount = 0;
  function buf() {
    const n = canvas.width * canvas.height * 4;
    if (!canvas._buf || canvas._buf.length !== n) canvas._buf = new Uint8ClampedArray(n);
    return canvas._buf;
  }
  c.clearRect = (x, y, w, h) => {
    if (!global.__RASTER) return;
    const b = buf(), W = canvas.width, H = canvas.height;
    for (let yy = Math.max(0, y); yy < Math.min(H, y + h); yy++) b.fill(0, (yy * W + Math.max(0, x)) * 4, (yy * W + Math.min(W, x + w)) * 4);
  };
  c.fillRect = (x, y, w, h) => {
    c.fillRectCount++;
    if (!global.__RASTER) return;
    const b = buf(), W = canvas.width, H = canvas.height;
    const [r, g, bl, a0] = parseColor(c.fillStyle);
    const a = a0 * c.globalAlpha, atop = c.globalCompositeOperation === 'source-atop';
    const x0 = Math.max(0, Math.round(x)), x1 = Math.min(W, Math.round(x + w));
    const y0 = Math.max(0, Math.round(y)), y1 = Math.min(H, Math.round(y + h));
    for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) {
      const i = (yy * W + xx) * 4, da = b[i + 3] / 255;
      if (atop) {
        if (!da) continue;
        b[i] = r * a + b[i] * (1 - a); b[i + 1] = g * a + b[i + 1] * (1 - a); b[i + 2] = bl * a + b[i + 2] * (1 - a);
      } else {
        const oa = a + da * (1 - a);
        b[i] = (r * a + b[i] * da * (1 - a)) / oa; b[i + 1] = (g * a + b[i + 1] * da * (1 - a)) / oa;
        b[i + 2] = (bl * a + b[i + 2] * da * (1 - a)) / oa; b[i + 3] = oa * 255;
      }
    }
  };
  return c;
}

function makeEl(tag) {
  const el = {
    tagName: String(tag).toUpperCase(), style: {}, dataset: {}, children: [],
    textContent: '', innerHTML: '', width: 0, height: 0, disabled: false, title: '', value: '', placeholder: '',
    listeners: {},
    classList: {
      _s: new Set(),
      add(...cs) { cs.forEach(c => this._s.add(c)); },
      remove(...cs) { cs.forEach(c => this._s.delete(c)); },
      toggle(c, on) { if (on === undefined) on = !this._s.has(c); on ? this._s.add(c) : this._s.delete(c); return on; },
      contains(c) { return this._s.has(c); }
    },
    addEventListener(t, f) { (this.listeners[t] = this.listeners[t] || []).push(f); },
    removeEventListener() {},
    appendChild(c) { this.children.push(c); c.parentNode = el; return c; },
    removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); return c; },
    insertBefore(c, ref) { const i = this.children.indexOf(ref); if (i < 0) this.children.push(c); else this.children.splice(i, 0, c); c.parentNode = el; return c; },
    setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k]; },
    focus() { global.document.activeElement = el; }, blur() { if (global.document.activeElement === el) global.document.activeElement = global.document.body; },
    getBoundingClientRect() { return { left: 0, top: 0, width: this.width || 0, height: this.height || 0 }; },
    getContext() { return this._ctx || (this._ctx = makeCtx(el)); },
    click() { (this.listeners.click || []).forEach(f => f({ preventDefault: noop })); }
  };
  Object.defineProperty(el, 'firstChild', { get() { return el.children[0] || null; } });
  return el;
}

const elements = {};
global.document = {
  hidden: false,
  body: makeEl('body'),
  getElementById(id) {
    if (!elements[id]) {
      elements[id] = makeEl(/^name\d$/.test(id) ? 'input' : (id === 'screen' || id === 'logo') ? 'canvas' : 'div');
      if (id === 'screen') { elements[id].width = 984; elements[id].height = 738; }
    }
    return elements[id];
  },
  createElement(tag) { return makeEl(tag); },
  addEventListener: noop,
  removeEventListener: noop
};
global.document.activeElement = global.document.body;
global.__elements = elements;

const winListeners = {};
global.window = {
  innerWidth: 1200, innerHeight: 900, devicePixelRatio: 1,
  addEventListener(t, f) { (winListeners[t] = winListeners[t] || []).push(f); },
  removeEventListener: noop,
  AudioContext: undefined,
  webkitAudioContext: undefined
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
global.navigator = { userAgent: 'node-harness' };
