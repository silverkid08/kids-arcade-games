/* Minimal DOM/canvas/audio stub so the game can run under node for testing.
   Extended from pac-man/tools/harness.js: canvases need createImageData /
   putImageData because every sprite is rasterised from pixel strings at boot. */
const noop = () => {};
function makeCtx(el) {
  const c = {};
  const methods = ['fillRect', 'clearRect', 'beginPath', 'closePath', 'moveTo', 'lineTo', 'arc', 'ellipse',
    'quadraticCurveTo', 'bezierCurveTo', 'fill', 'stroke', 'save', 'restore', 'translate', 'scale', 'rotate',
    'setTransform', 'resetTransform', 'fillText', 'strokeText', 'rect', 'clip', 'arcTo', 'setLineDash', 'putImageData'];
  for (const m of methods) c[m] = noop;
  c.measureText = () => ({ width: 4 });
  c.createImageData = (w, h) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) });
  c.drawImage = (img, x, y) => {
    if (!img || typeof img.width !== 'number') throw new Error('drawImage: not an image');
    if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) throw new Error('drawImage: bad coords ' + x + ',' + y);
    global.__drawCount++;
  };
  c.canvas = el;
  return c;
}
function makeEl(tag) {
  const el = {
    tagName: tag, style: {}, dataset: {}, children: [],
    textContent: '', innerHTML: '', width: 0, height: 0, className: '',
    listeners: {},
    classList: {
      _s: new Set(),
      add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); },
      toggle(c, on) { if (on === undefined) on = !this._s.has(c); on ? this._s.add(c) : this._s.delete(c); },
      contains(c) { return this._s.has(c); }
    },
    addEventListener(t, f) { (this.listeners[t] = this.listeners[t] || []).push(f); },
    removeEventListener() {},
    appendChild(c) { this.children.push(c); return c; },
    getContext() { return this._ctx || (this._ctx = makeCtx(this)); },
    click() { (this.listeners.click || []).forEach(f => f({})); },
    focus: noop
  };
  return el;
}

const elements = {};
global.document = {
  hidden: false,
  getElementById(id) { return elements[id] || (elements[id] = makeEl('div')); },
  createElement(tag) { return makeEl(tag); },
  addEventListener: noop,
  body: makeEl('body')
};
global.__elements = elements;
global.__drawCount = 0;

const winListeners = {};
global.window = {
  innerWidth: 1200, innerHeight: 900, devicePixelRatio: 1,
  addEventListener(t, f) { (winListeners[t] = winListeners[t] || []).push(f); },
  AudioContext: undefined
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
