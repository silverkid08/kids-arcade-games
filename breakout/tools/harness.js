/* Minimal DOM / canvas / audio stub so the game can run under node for testing.
   (Breakout copy, via duck-hunt: the game renders into an ImageData-backed Uint32 framebuffer,
   so createImageData must hand back a real Uint8ClampedArray.)
   Copied from pac-man/tools/harness.js and extended with ImageData support
   (the Space Invaders renderer paints a 1-bit framebuffer through
   createImageData / putImageData) and a few more element behaviours the
   settings menu relies on. */
const noop = () => {};

function makeImageData(w, h) {
  return { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) };
}

function makeCtx(canvas) {
  const c = {};
  const methods = ['fillRect', 'clearRect', 'beginPath', 'closePath', 'moveTo', 'lineTo', 'arc', 'ellipse',
    'quadraticCurveTo', 'bezierCurveTo', 'fill', 'stroke', 'save', 'restore', 'translate', 'scale', 'rotate',
    'setTransform', 'resetTransform', 'drawImage', 'fillText', 'strokeText', 'rect', 'clip', 'arcTo',
    'setLineDash', 'putImageData', 'strokeRect'];
  for (const m of methods) c[m] = noop;
  c.measureText = (s) => ({ width: 4 * String(s).length });
  c.createImageData = (w, h) => makeImageData(w, h);
  c.getImageData = (x, y, w, h) => makeImageData(w, h);
  c.canvas = canvas;
  c.imageSmoothingEnabled = true;
  return c;
}

function makeEl(tag) {
  const el = {
    tagName: String(tag).toUpperCase(), style: {}, dataset: {}, children: [],
    textContent: '', innerHTML: '', width: 0, height: 0, disabled: false, title: '',
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
    focus: noop, blur: noop,
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
  getElementById(id) { return elements[id] || (elements[id] = makeEl('div')); },
  createElement(tag) { return makeEl(tag); },
  addEventListener: noop,
  removeEventListener: noop
};
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
