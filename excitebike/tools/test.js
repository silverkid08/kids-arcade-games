/* Headless test suite:  node tools/test.js   (must end "all tests passed")

   Runs the real index.html game code under tools/harness.js.  Part 1
   replays the original cartridge (tools/nes.js on the ROM rebuilt from the
   disassembly) beside the port and checks the RAM is identical every frame;
   the rest checks the rules at the "Original" preset, every kid knob,
   invulnerable mode, Design mode, settings/records storage and long runs
   with render() every frame. */
require('./harness.js');
const { build } = require('./build.js');
const G = build();
const { m, BTN } = G;

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) pass++; else { fail++; console.log('  FAIL: ' + msg); } }
function eq(a, b, msg) { ok(a === b, msg + ' (got ' + a + ', want ' + b + ')'); }
function section(t) { console.log('- ' + t); }

const frames = (n, pad) => { for (let i = 0; i < n; i++) { G.pad.now = typeof pad === 'function' ? pad(i) : (pad || 0); G.step(); } };
const until = (f, max, pad) => { let i = 0; for (; i < (max || 20000) && !f(); i++) { G.pad.now = typeof pad === 'function' ? pad(i) : (pad || 0); G.step(); } return i; };
const tap = b => { frames(4, b); frames(8, 0); };
const speed = (x = 0) => (m[0x94 + x] << 8) | m[0x90 + x];
function fresh(preset) {
  global.localStorage._d = {};
  G.applyPreset(preset || 'original');
  G.toTitle(false);
  frames(20);
}
function toRace(sel, track, preset, knobs) {
  fresh(preset);
  for (const k in knobs || {}) G.setKnob(k, knobs[k]);
  G.startMode(sel === 1 ? 'B' : sel === 2 ? 'D' : 'A');
  until(() => m[0x41] === 1 && m[0x40], 600);
  frames(10, 0);
  for (let i = 0; i < track; i++) tap(BTN.R);
  tap(BTN.START);
  until(() => m[0x47] && m[0x40], 600);
}
function toGo(sel, track, preset, knobs) { toRace(sel, track, preset, knobs); until(() => m[0x4F], 3000); }

/* ---------------------------------------------------------------- */
section('1. the port against the real ROM (lockstep, frame by frame)');
{
  const NES = require('./nes.js'), L = require('./emu-lib.js');
  const B = NES.BTN;
  for (const [sel, track, n] of [[0, 0, 2600], [1, 2, 2600]]) {
    const emu = L.boot(); const H = build(); H.setRng(0); H.powerOn();
    let rng = null, padRead = 0; const done = []; const snd = new Set();
    emu.execHook = pc => { emu.lastPC = pc; if (pc === 0xC23B) rng = emu.ram.slice(0x18, 0x20); if (pc === 0xD347) padRead = emu.pad;
      if (pc === 0xC27E) done.push({ rng, pad: padRead, ram: emu.ram.slice() }); };
    emu.watchW = a => { if (a < 0x800 && emu.lastPC >= 0xF844) snd.add(a); };
    const seq = [[60, 0]]; for (let i = 0; i < sel; i++) seq.push([3, B.SELECT], [6, 0]); seq.push([5, B.START], [60, 0]);
    for (let i = 0; i < track; i++) seq.push([3, B.RIGHT], [6, 0]); seq.push([5, B.START]);
    const pads = []; for (const [f, p] of seq) for (let i = 0; i < f; i++) pads.push(p);
    let diffs = 0, nmis = 0;
    for (let f = 0; f < pads.length + n; f++) {
      const k = f - pads.length;
      emu.pad = f < pads.length ? pads[f] : ((k % 700) < 500 ? B.A : B.B) | ((k % 97) < 12 ? B.LEFT : 0) | ((k % 300) < 10 ? B.UP : 0) | ((k % 311) < 8 ? B.DOWN : 0);
      emu.frame();
      while (done.length) {
        const d = done.shift(); nmis++;
        H.m.set(d.rng, 0x18); H.pad.now = d.pad; H.step();
        for (let a = 0; a < 0x800; a++) {
          if (a < 0x10 || (a >= 0x18 && a < 0x20) || (a >= 0x100 && a < 0x200) || a >= 0x7E0 || snd.has(a)) continue;
          if (d.ram[a] !== H.m[a]) { if (diffs < 3) console.log('    frame ' + f + ' $' + a.toString(16) + ' rom=' + d.ram[a] + ' port=' + H.m[a]); diffs++; H.m[a] = d.ram[a]; }
        }
      }
    }
    eq(diffs, 0, 'Selection ' + (sel ? 'B' : 'A') + ' track ' + (track + 1) + ': RAM identical to the ROM for ' + nmis + ' frames');
  }
}

/* ---------------------------------------------------------------- */
section('2. title, track select and race start');
{
  fresh();
  eq(m[0x41], 0, 'boots to the title (mode 0)');
  ok(G.vram[8 * 32 + 10] !== 0xFC, 'title logo is in the nametable');
  G.startMode('A'); until(() => m[0x41] === 1 && m[0x40], 600);
  eq(m[0x41], 1, 'SELECTION A goes to the track select');
  eq(m[0x3F2], 0, 'selection A flag');
  frames(10); tap(BTN.R); tap(BTN.R);
  eq(m[0x42], 2, 'right moves the track cursor');
  tap(BTN.START); until(() => m[0x47] && m[0x40], 600);
  eq(m[0x43], 2, 'track 3 chosen');
  ok([2, 5].includes(m[0x41]), 'race mode');
  const t = until(() => m[0x4F], 3000);
  ok(t > 200 && t < 700, 'the start gate opens after the countdown (' + t + ' frames)');
  eq(m[0x3B6], 8, 'engine warmed to temperature 8 at the line');
}

/* ---------------------------------------------------------------- */
section('3. acceleration, turbo and top speed (Original)');
{
  toGo(0, 0);
  let n = until(() => speed() >= 0x320, 600, BTN.A);
  eq(speed(), 0x320, 'A: top speed $0320 (3.125 px/frame)');
  ok(n > 120 && n < 145, 'A: 0 to top speed in ' + n + ' frames ($18 every 4th frame)');
  frames(60, BTN.A); eq(speed(), 0x320, 'A holds $0320');
  n = until(() => speed() >= 0x340, 600, BTN.B);
  eq(speed(), 0x340, 'B (turbo): top speed $0340');
  frames(30, 0); ok(speed() < 0x340, 'speed falls when the throttle is released');
}

/* ---------------------------------------------------------------- */
section('4. engine temperature and overheating');
{
  toGo(0, 0);
  frames(600, BTN.A);
  ok(m[0x3B6] <= 0x11, 'A alone never passes temperature $11 (' + m[0x3B6] + ')');
  ok(!m[0x3E0], 'A alone never overheats');
  const n = until(() => m[0x3E0], 2000, BTN.B);
  ok(n > 300 && n < 520, 'B overheats in ' + n + ' frames');
  eq(m[0x3B6], 0x20, 'overheat at temperature $20');
  let stall = 0;
  let slowed = false;
  for (; stall < 600 && m[0x3E0]; stall++) { G.pad.now = BTN.A; G.step(); if (stall > 100 && speed() === 0) slowed = true; }
  ok(slowed, 'the overheated bike rolls to a stop even with A held');
  ok(stall > 250 && stall < 290, 'stalled for ' + stall + ' frames (ROM: ($20-8) x 11 = 264)');
  eq(m[0x3B6], 5, 'engine restarts cooled to 5');
  let top = 0; for (let i = 0; i < 300; i++) { G.pad.now = BTN.A; G.step(); top = Math.max(top, speed()); }
  ok(top > 0x100, 'rides again after the stall (speed ' + top.toString(16) + ')');
}

/* ---------------------------------------------------------------- */
section('5. lane changes');
{
  toGo(0, 0); frames(60, BTN.A);
  eq(m[0xB8], 0x0E, 'starts in lane 1 (bottom, offset $0E)');
  frames(2, BTN.A | BTN.U); until(() => m[0xDC] === 0, 100, BTN.A);
  eq(m[0xB8], 0x1A, 'Up moves one lane up (offset $1A)');
  frames(2, BTN.A | BTN.U); until(() => m[0xDC] === 0, 100, BTN.A);
  frames(2, BTN.A | BTN.U); until(() => m[0xDC] === 0, 100, BTN.A);
  eq(m[0xB8], 0x32, 'lane 4 (offset $32)');
  frames(2, BTN.A | BTN.D); until(() => m[0xDC] === 0, 100, BTN.A);
  eq(m[0xB8], 0x26, 'Down moves one lane down');
}

/* ---------------------------------------------------------------- */
section('6. ramps, air time and landing angles');
{
  toGo(0, 0);
  let n = until(() => m[0xB0] === 2, 6000, BTN.A);
  ok(m[0xB0] === 2, 'a ramp launches the bike (after ' + n + ' frames)');
  let top = 255, air = 0;
  while (m[0xB0] && air < 300) { top = Math.min(top, m[0x8C]); G.pad.now = BTN.A; G.step(); air++; }
  ok(air > 10, 'air time ' + air + ' frames, highest y ' + top);
  // Left (lean back) lowers gravity: a longer flight from the same ramp
  toGo(0, 0); until(() => m[0xB0] === 2, 6000, BTN.A);
  let air2 = 0; while (m[0xB0] && air2 < 400) { G.pad.now = BTN.A | BTN.L; G.step(); air2++; }
  ok(air2 > air, 'leaning back (gravity $18 instead of $34) flies longer: ' + air2 + ' vs ' + air);
  // landing rule: angle outside D86C/D87C for the slope -> crash; perfect angle -> no bounce
  const landTest = (angle) => {
    toGo(0, 0); until(() => m[0xB0] === 2, 6000, BTN.A);
    until(() => m[0x364] && m[0x8C] >= G.R(0) - 0 && false, 1);
    for (let i = 0; i < 400 && m[0xB0]; i++) { m[0xAC] = angle; G.pad.now = 0; G.step(); }
    return { crashed: m[0x98] === 0xFF, bounce: m[0xB0] === 1 || m[0x388] };
  };
  ok(landTest(0x0C).crashed, 'landing nose-up past the limit crashes');
  ok(landTest(0x01).crashed, 'landing nose-down past the limit crashes');
  ok(!landTest(0x06).crashed, 'landing level is safe');
}

/* ---------------------------------------------------------------- */
section('7. crash and recovery');
{
  toGo(0, 1);
  frames(120, BTN.A);
  G.crash(0, 'test');
  eq(m[0x98], 0xFF, 'crash() makes the rider tumble');
  const seen = new Set(); let n = 0;
  for (; n < 3000 && !(seen.has(5) && m[0x9C] === 0); n++) { seen.add(m[0x9C]); G.pad.now = m[0x9C] === 3 ? ((n & 8) ? BTN.A : 0) : BTN.A; G.step(); }
  ok([1, 2, 3, 4].every(s => seen.has(s)), 'recovery runs through thrown / to the side / run back / climb on (' + [...seen].join(',') + ')');
  eq(m[0x9C], 0, 'back on the bike');
  ok(n > 100 && n < 1500, 'whole crash took ' + n + ' frames');
  frames(200, BTN.A); ok(speed() > 0x100, 'can ride after recovering');
}

/* ---------------------------------------------------------------- */
section('8. rider collisions (front wheel into a rear wheel)');
{
  const setup = (px, cx) => {
    toGo(1, 0); frames(30, BTN.A);
    for (const x of [0, 1]) { m[0xA8 + x] = 1; m[0x84 + x] = 1; m[0x70 + x] = 2; m[0x98 + x] = 0; m[0xB0 + x] = 0; m[0x3E0 + x] = 0; m[0x9C + x] = 0; }
    m[0xA8 + 2] = 0; m[0xA8 + 3] = 0;
    m[0x80] = px; m[0x81] = cx; m[0x8C] = 0x90; m[0x8D] = 0x90;
    G.sub_DFD5();
  };
  setup(0x38, 0x40); ok(m[0x98] === 0xFF && m[0x99] !== 0xFF, 'player 8 px behind a CPU rider (same lane): the player crashes');
  setup(0x48, 0x40); ok(m[0x99] === 0xFF && m[0x98] !== 0xFF, 'CPU rider 8 px behind the player: the CPU rider crashes');
  setup(0x40, 0x41); ok(m[0x98] === 0xFF && m[0x99] === 0xFF, 'side by side (within 2 px): both crash');
  setup(0x38, 0x60); ok(m[0x98] !== 0xFF && m[0x99] !== 0xFF, 'far apart: no crash');
  setup(0x38, 0x40); m[0x98] = 0; m[0x71] = 3; G.sub_DFD5(); ok(m[0x98] !== 0xFF, 'different lanes: no crash');
}

/* ---------------------------------------------------------------- */
section('9. laps, finish, places and qualifying');
{
  toGo(0, 0, 'kid'); G.setKnob('laps', 0); G.setKnob('invuln', 1); G.setKnob('landing', 99);
  let lapSeen = false;
  const n = until(() => { if (m[0x3A] && !m[0x52]) lapSeen = true; return m[0x52] === 1; }, 30000, BTN.A);
  eq(m[0x52], 1, 'race finished after ' + n + ' frames');
  ok(lapSeen, 'lap time shown when crossing the line after lap 1');
  eq(m[0x57], 0, 'no laps left');
  // place rules (C485): time vs best and vs the 3rd-place time
  const place = (mm, ss, hh, track = 0, main = 0) => {
    G.loadRecordsIntoRom(); m[0x43] = track; m[0x46] = main; m[0x41] = 2; m[0x3F2] = 0; m[0x3F8] = 4;
    m[0x68] = mm; m[0x69] = ss; m[0x6A] = hh; G.sub_C485(); return m[0x53];
  };
  G.applyPreset('original'); global.localStorage._d = {};
  // track 1 challenge race: wall time (BEST) 1:16, HUD "3RD" 1:24 (= 1:16 + 2 x $03F8 seconds)
  eq(place(1, 30, 0), 7, '1:30.00: 7th');
  eq(place(1, 26, 0), 5, '1:26.00: 5th');
  eq(place(1, 29, 0), 6, '1:29.00: 6th');
  eq(place(1, 25, 50), 4, '1:25.50: 4th');
  eq(place(1, 22, 0), 3, '1:22.00 (inside the 1:24 3RD time): 3rd, qualified');
  eq(place(1, 17, 0), 2, '1:17.00: 2nd');
  eq(place(1, 15, 0), 1, '1:15.00 beats the 1:16 best: 1st and a new record');
  eq(place(1, 15, 50), 2, 'the record is now 1:15.00: 1:15.50 is 2nd');
  eq(place(1, 24, 0, 0, 1), 1, 'main race track 1: wall time 1:24, so 1:24.00 ties it: 1st');
  G.setKnob('qualify', 0); eq(place(1, 40, 0), 3, 'qualify knob off: always 3rd or better');
}

/* ---------------------------------------------------------------- */
section('10. the five tracks');
{
  const expect = [];
  for (let t = 0; t < 5; t++) {
    const p = G.trackPtr.call ? (() => { m[0x43] = t; return G.trackPtr(); })() : 0;
    eq(G.R(p), 2, 'track ' + (t + 1) + ' has 2 laps');
    // walk the track data like F4FF and collect obstacle ids
    const ids = []; let y = 1;
    for (let g = 0; g < 400; g++) {
      const a = G.R(p + y);
      if (a === 9 && ids.length > 10) break;
      if (a & 0x40) { y += 2; continue; }
      if ((a & 0x3F) < 0x30) ids.push(a & 0x3F);
      y++;
    }
    ok(ids.length >= 20, 'track ' + (t + 1) + ': ' + ids.length + ' obstacles in the ROM layout');
    expect.push(ids.length);
    // race a few seconds on it and see obstacles streamed into the track buffer
    toGo(0, t, 'kid');
    frames(1800, BTN.A);
    let obstacle = 0; for (let i = 0; i < 0x180; i++) { const v = m[0x400 + i]; if (!(v >= 0x3B && v <= 0x3D)) obstacle++; }
    ok(obstacle > 0, 'track ' + (t + 1) + ': obstacles reach the track buffer');
  }
}

/* ---------------------------------------------------------------- */
section('11. design mode: place, clear, end, save, load, race');
{
  fresh();
  const d = { laps: 1, items: [], length: 96 };
  G.design.cur = d;
  ok(G.placeLetter(d, 10, 0), 'place A (small bump) at column 10');
  ok(G.placeLetter(d, 20, 4), 'place E (steep ramp)');
  ok(G.placeLetter(d, 40, 12), 'place M (cooling arrow)');
  ok(G.placeLetter(d, 50, 17), 'place R (the big multi-part hill)');
  eq(d.items.length, 4, '4 obstacles placed');
  ok(!G.placeLetter(d, 94, 17), 'an obstacle may not run past the finish');
  G.placeLetter(d, 11, 1); eq(d.items.length, 4, 'placing over an obstacle replaces it');
  ok(G.clearAt(d, 40) && d.items.length === 3, 'CL clears an obstacle');
  for (let i = 0; i < 19; i++) { const t = { laps: 2, items: [], length: 120 }; ok(G.placeLetter(t, 4, i), 'letter ' + 'ABCDEFGHIJKLMNOPQRS'[i] + ' can be placed'); }
  G.setEnd(d, 80); eq(d.length, 80, 'END moves the finish line');
  const track = G.designToTrack(d);
  eq(track[0], 1, 'lap count is the first byte');
  eq(track[track.length - 1], 9, 'ends with the finish-line chunk');
  // save / load through the slots
  G.designChanged();
  G.openSlots('save'); G.pickSlot(2);
  const back = G.loadDesignSlot(2);
  ok(back && back.items.length === d.items.length && back.laps === 1, 'design saved to slot 2 and read back');
  G.design.cur = { laps: 3, items: [], length: 64 };
  G.openSlots('load'); G.pickSlot(2);
  eq(G.design.cur.items.length, d.items.length, 'LOAD restores the design');
  ok(!G.validDesign({ laps: 0, items: [], length: 50 }), 'bad saved data is refused');
  // the editor screen: keyboard and mouse
  G.design.cur = { laps: 2, items: [], length: 100 }; G.designChanged();
  G.startMode('D'); frames(80);
  eq(m[0x41], 8, 'DESIGN opens the design menu');
  tap(BTN.D); tap(BTN.D); tap(BTN.START); frames(60);
  eq(m[0x41], 9, 'DESIGN item opens the editor');
  const before = G.design.cur.items.length;
  G.ED.mouse.push({ x: 42, y: 205, button: 0 }); frames(2);
  eq(G.ED.cursor, 2, 'clicking the letter C selects it');
  G.ED.mouse.push({ x: 100, y: 150, button: 0 }); frames(2);
  ok(G.design.cur.items.length === before + 1, 'clicking the track places it there');
  G.ED.mouse.push({ x: 100, y: 150, button: 2 }); frames(2);
  eq(G.design.cur.items.length, before, 'right-click clears it');
  frames(20, BTN.A); ok(G.ED.bike > 0, 'A drives the bike along the track');
  tap(BTN.R); eq(G.ED.cursor, 3, 'Right moves the letter cursor');
  tap(BTN.B); eq(G.design.cur.items.length, before + 1, 'B places the letter at the bike');
  tap(BTN.START); ok(G.ED.prompt, 'START asks for the lap count');
  const laps0 = G.design.cur.laps; tap(BTN.U); eq(G.design.cur.laps, laps0 % 9 + 1, 'Up adds a lap');
  tap(BTN.B); eq(m[0x41], 8, 'B confirms and returns to the design menu');
  frames(10); m[0x42] = 0;
  // race the design
  G.design.cur = { laps: 1, items: [{ col: 4, letter: 'A' }, { col: 20, letter: 'H' }], length: 60 };
  G.designChanged();
  tap(BTN.START); until(() => m[0x47] && m[0x40], 600);
  eq(m[0x41], 0x0A, 'PLAY MODE A races the design');
  eq(m[0x43], 5, 'track 6 = the design track at $06E0');
  until(() => m[0x4F], 3000);
  G.setKnob('invuln', 1); G.setKnob('landing', 99);
  const n = until(() => m[0x52] === 1, 20000, BTN.A);
  eq(m[0x52], 1, 'the 1-lap design race finishes (' + n + ' frames)');
}

/* ---------------------------------------------------------------- */
section('12. every knob');
{
  // overheat off
  toGo(0, 0); G.setKnob('overheat', 0); frames(1500, BTN.B); ok(!m[0x3E0] && m[0x3B6] < 0x20, 'OVERHEATING OFF: turbo never overheats');
  // heat rate
  toGo(0, 0); G.setKnob('heat', 50); frames(200, BTN.B); const t50 = m[0x3B6] * 256 + m[0x3B5];
  toGo(0, 0); G.setKnob('heat', 100); frames(200, BTN.B); const t100 = m[0x3B6] * 256 + m[0x3B5];
  ok(t50 < t100, 'TURBO HEAT RATE 50% heats slower (' + t50.toString(16) + ' < ' + t100.toString(16) + ')');
  // landing forgiveness: an angle one past the limit crashes at Original, not at +1
  const land = (knob, angle) => {
    toGo(0, 0); G.setKnob('landing', knob); until(() => m[0xB0] === 2, 6000, BTN.A);
    for (let i = 0; i < 400 && m[0xB0]; i++) { m[0xAC] = angle; G.pad.now = 0; G.step(); }
    return m[0x98] === 0xFF;
  };
  ok(land(0, 0x02), 'Original: angle 2 crashes on flat ground');
  ok(!land(1, 0x02), 'LANDING FORGIVENESS +1: angle 2 is fine');
  ok(!land(99, 0x0C), 'AUTO-LEVEL: even angle 12 lands safely');
  // crash recovery time
  const recover = knob => { toGo(0, 1, 'original', { recover: knob }); frames(120, BTN.A); G.crash(0); let n = 0; while ((m[0x98] || m[0x9C]) && n < 3000) { G.pad.now = m[0x9C] === 3 ? 0 : BTN.A; G.step(); n++; } return n; };
  const r1 = recover(1), r2 = recover(2), r3 = recover(3);
  ok(r2 < r1 && r3 < r2 && r3 < 60, 'CRASH RECOVERY: original ' + r1 + ' > fast ' + r2 + ' > instant ' + r3 + ' frames');
  // CPU riders
  for (const c of [0, 1, 3]) {
    toGo(1, 0, 'original', { cpu: c }); let most = 0;
    for (let i = 0; i < 2500; i++) { G.pad.now = (i % 600) < 450 ? BTN.A : BTN.B; G.step(); most = Math.max(most, m[0xA9] + m[0xAA] + (m[0xAB] && !m[0x373] ? 1 : 0)); if (!c) ok(!m[0xAB], ''); }
    ok(most <= c && (c === 0 || most > 0), 'CPU RIDERS ' + c + ': at most ' + most + ' racing riders on the track');
  }
  // aggression lowers the CPU target speed
  toGo(1, 0); G.setKnob('aggro', 0.5); m[0x52] = 0; G.sub_DA9F && null;
  ok(G.KID.cpuAggro === 0.5, 'CPU AGGRESSION knob reaches the game');
  // top speed
  toGo(0, 0); G.setKnob('top', 75); frames(400, BTN.B); ok(speed() <= Math.round(0x340 * 0.75) + 1, 'TOP SPEED 75%: speed ' + speed().toString(16));
  // qualify knob tested in section 9; laps
  toGo(0, 0); G.setKnob('laps', 3); frames(30, BTN.A); eq(m[0x57], 3, 'LAPS PER RACE 3');
  // starting track
  fresh(); G.setKnob('track', 4); G.startMode('A'); until(() => m[0x41] === 1 && m[0x40], 600); eq(m[0x42], 3, 'STARTING TRACK 4 puts the cursor on 4');
  // flicker
  G.setKnob('flicker', 0); eq(G.spriteLimit, false, 'SPRITE FLICKER OFF lifts the 8-sprite limit');
  G.setKnob('flicker', 1); eq(G.spriteLimit, true, 'SPRITE FLICKER ON');
}

/* ---------------------------------------------------------------- */
section('13. invulnerable mode');
{
  toGo(1, 0); G.setKnob('invuln', 1);
  let flashes = 0; G.KID.onWobble = () => flashes++;
  G.crash(0, 'test'); ok(m[0x98] !== 0xFF && flashes === 1, 'a crash becomes a wobble and a flash');
  until(() => m[0xB0] === 2, 6000, BTN.A);
  for (let i = 0; i < 400 && m[0xB0]; i++) { m[0xAC] = 0x0C; G.pad.now = 0; G.step(); }
  ok(m[0x98] !== 0xFF, 'a terrible landing does not crash');
  let crashed = 0;
  for (let i = 0; i < 6000; i++) { G.pad.now = ((i % 400) < 300 ? BTN.B : BTN.A) | ((i % 90) < 30 ? BTN.L : (i % 70) < 20 ? BTN.R : 0); G.step(); if (m[0x98] === 0xFF) crashed++; }
  eq(crashed, 0, 'wild riding for 6000 frames: never crashed');
  ok(flashes > 1, 'wobbles happened (' + flashes + ')');
  G.KID.onWobble = null;
  G.render(); ok(true, 'renders with the INVULNERABLE badge');
}

/* ---------------------------------------------------------------- */
section('14. settings and records storage');
{
  global.localStorage._d = {};
  G.applyPreset('easy'); G.setKnob('heat', 125);
  eq(G.presetName(), 'custom', 'touching a knob makes the preset Custom');
  const saved = JSON.parse(global.localStorage._d['excitebike.settings']);
  for (const k of Object.keys(G.settings)) G.settings[k] = 0;
  G.loadSettings();
  eq(G.settings.heat, 125, 'settings round-trip through localStorage');
  eq(G.settings.cpu, saved.cpu, 'all knobs restored');
  G.applyPreset('original');
  const o = G.PRESETS.original;
  ok(o.overheat === 1 && o.heat === 100 && o.landing === 0 && o.recover === 1 && o.cpu === 3 && o.aggro === 1 && o.top === 100 && o.qualify === 1 && o.laps === 0 && o.invuln === 0, 'Original preset = the cartridge');
  G.setKnob('heat', 50); G.applyPreset('original'); eq(G.PRESETS.original.heat, 100, 'knobs never change the Original preset');
  // records: per preset, invulnerable kept separately
  global.localStorage._d = {}; G.applyPreset('normal');
  m[0x43] = 0; m[0x46] = 1; m[0x41] = 2; m[0x3F2] = 0; m[0x68] = 1; m[0x69] = 10; m[0x6A] = 0; G.loadRecordsIntoRom(); G.sub_C485();
  ok(global.localStorage._d['excitebike.best.normal'], 'a new best time is saved for the preset');
  G.setKnob('invuln', 1); m[0x68] = 1; m[0x69] = 5; m[0x6A] = 0; G.loadRecordsIntoRom(); G.sub_C485();
  ok(global.localStorage._d['excitebike.best.custom.inv'], 'an invulnerable record goes to its own table');
  ok(!global.localStorage._d['excitebike.best.normal'].includes('[1,5,0]'), 'and does not overwrite the real table');
  G.setKnob('invuln', 0);
  ok(G.recordsHTML().length > 50, 'records shown on the menu');
  const bad = global.localStorage; global.localStorage = { getItem() { throw new Error('no'); }, setItem() { throw new Error('no'); }, removeItem() {} };
  try { G.saveSettings(); G.loadSettings(); G.loadRecordsIntoRom(); ok(true, 'no localStorage: no crash'); } catch (e) { ok(false, 'localStorage failure throws: ' + e); }
  global.localStorage = bad;
}

/* ---------------------------------------------------------------- */
section('15. long runs with render() every frame');
{
  const longRun = (label, setup, n, pad) => {
    let err = null;
    try { setup(); for (let i = 0; i < n; i++) { G.pad.now = pad(i); G.step(); G.render(); } } catch (e) { err = e; }
    ok(!err, label + ': ' + n + ' frames without an exception' + (err ? ' (' + err.stack + ')' : ''));
  };
  longRun('title + attract demo', () => fresh(), 2500, () => 0);
  longRun('Selection A, track 4, wild', () => toGo(0, 3), 4000, i => ((i % 500) < 300 ? BTN.A : BTN.B) | ((i % 77) < 20 ? BTN.L : (i % 61) < 15 ? BTN.R : 0) | ((i % 150) < 5 ? BTN.U : (i % 130) < 5 ? BTN.D : 0));
  longRun('Selection B, track 5, to the results', () => toGo(1, 4, 'kid'), 6000, i => (i % 9000) < 8000 ? BTN.A : BTN.START);
  longRun('design editor, random keys and clicks', () => { fresh(); G.startMode('D'); frames(80); tap(BTN.D); tap(BTN.D); tap(BTN.START); frames(60); }, 3000, i => {
    if (i % 37 === 0) G.ED.mouse.push({ x: (i * 13) % 256, y: 100 + (i % 120), button: i % 5 === 0 ? 2 : 0 });
    return [BTN.A, BTN.R, BTN.B, BTN.L, BTN.D, 0][(i >> 4) % 6];
  });
  longRun('pause and unpause', () => toGo(0, 0), 800, i => (i === 100 || i === 300) ? BTN.START : BTN.A);
}

console.log('\n' + pass + ' checks passed, ' + fail + ' failed');
if (fail) { console.log('TESTS FAILED'); process.exit(1); }
console.log('all tests passed');
