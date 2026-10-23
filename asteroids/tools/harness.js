/* Minimal DOM / canvas / audio stub so the game can run under node.
   Copied from pac-man/tools/harness.js and extended: the 2D context
   records what is drawn (so tests can assert that render() produced
   strokes) and can optionally rasterise lines for a PNG snapshot. */
const noop = () => {};

function makeCtx() {
  const c = {
    calls: 0, strokes: 0, fills: 0, lines: [], dots: [],
    _x: 0, _y: 0, _path: [], lineWidth: 1, strokeStyle: '#fff', fillStyle: '#000',
    globalCompositeOperation: 'source-over', lineCap: 'butt', lineJoin: 'miter',
    _t: [1, 0, 0, 1, 0, 0]
  };
  const methods = ['fillRect', 'clearRect', 'closePath', 'ellipse', 'quadraticCurveTo', 'bezierCurveTo',
    'save', 'restore', 'translate', 'scale', 'rotate', 'resetTransform', 'drawImage', 'fillText',
    'strokeText', 'rect', 'clip', 'arcTo', 'setLineDash'];
  for (const m of methods) c[m] = function () { c.calls++; };
  c.setTransform = function (a, b, cc, d, e, f) { c._t = [a, b, cc, d, e, f]; };
  c.beginPath = function () { c._path = []; };
  c.moveTo = function (x, y) { c._path.push(['m', x, y]); };
  c.lineTo = function (x, y) { c._path.push(['l', x, y]); };
  c.arc = function (x, y, r) { c._path.push(['a', x, y, r]); };
  c.stroke = function () {
    c.strokes++;
    let px = 0, py = 0;
    for (const p of c._path) {
      if (p[0] === 'm') { px = p[1]; py = p[2]; }
      else if (p[0] === 'l') { c.lines.push([px, py, p[1], p[2], c.strokeStyle, c.lineWidth]); px = p[1]; py = p[2]; }
    }
  };
  c.fill = function () {
    c.fills++;
    for (const p of c._path) if (p[0] === 'a') c.dots.push([p[1], p[2], p[3], c.fillStyle]);
  };
  c.measureText = () => ({ width: 4 });
  c.canvas = null;
  c.resetRecording = function () { c.lines = []; c.dots = []; c.strokes = 0; c.fills = 0; c.calls = 0; };
  return c;
}

function makeEl(tag) {
  const el = {
    tagName: tag, style: {}, dataset: {}, children: [], className: '',
    textContent: '', innerHTML: '', width: 0, height: 0,
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
    removeChild(c) { this.children = this.children.filter(x => x !== c); return c; },
    setAttribute(k, v) { this[k] = v; },
    focus: noop, blur: noop,
    getBoundingClientRect() { return { left: 0, top: 0, width: this.width, height: this.height }; },
    getContext() { return this._ctx || (this._ctx = makeCtx()); },
    click() { (this.listeners.click || []).forEach(f => f({ preventDefault: noop })); }
  };
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
  AudioContext: undefined
};
global.__winListeners = winListeners;
global.__key = function (key, down) {
  const ev = { key, preventDefault: noop };
  for (const f of (winListeners[down === false ? 'keyup' : 'keydown'] || [])) f(ev);
};
global.localStorage = {
  _d: {},
  getItem(k) { return k in this._d ? this._d[k] : null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
  clear() { this._d = {}; }
};
global.requestAnimationFrame = (cb) => { global.__raf = cb; return 1; };
global.cancelAnimationFrame = noop;
global.performance = { now: () => 0 };
