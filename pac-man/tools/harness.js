/* Minimal DOM stub so the game can run under node for testing. */
const noop = () => {};
function makeCtx() {
  const c = {};
  const methods = ['fillRect','clearRect','beginPath','closePath','moveTo','lineTo','arc','ellipse',
    'quadraticCurveTo','bezierCurveTo','fill','stroke','save','restore','translate','scale','rotate',
    'setTransform','resetTransform','drawImage','fillText','strokeText','rect','clip','arcTo','setLineDash'];
  for (const m of methods) c[m] = noop;
  c.measureText = () => ({ width: 4 });
  c.canvas = null;
  return c;
}
function makeEl(tag) {
  const el = {
    tagName: tag, style: {}, dataset: {}, children: [],
    textContent: '', innerHTML: '', width: 0, height: 0,
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
    getContext() { return makeCtx(); },
    click() { (this.listeners.click || []).forEach(f => f({})); }
  };
  return el;
}

const elements = {};
global.document = {
  hidden: false,
  getElementById(id) { return elements[id] || (elements[id] = makeEl('div')); },
  createElement(tag) { return makeEl(tag); },
  addEventListener: noop
};
global.__elements = elements;

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
  setItem(k, v) { this._d[k] = String(v); }
};
global.requestAnimationFrame = (cb) => { global.__raf = cb; return 1; };
global.performance = { now: () => 0 };
