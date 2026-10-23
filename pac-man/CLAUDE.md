# Pac-Man clone — working notes for Claude

A faithful clone of the 1980 arcade Pac-Man that runs in Chrome from a single
file. **The one deliberate deviation from the original: the number of ghosts is
configurable, 0 to 4.** Everything else is meant to match the arcade, and there
is tooling in `tools/` that proves it.

## Run it

```
node tools/launch.js                  # or just double-click index.html
```
No server, no build, no dependencies. Opening the file with `file://` is enough
because nothing is fetched at runtime (audio is synthesised, art is drawn).

## Verify after ANY change

```
node tools/test.js          # headless game logic suite - must end "all tests passed"
node tools/arcade-diff.js   # maze vs a real arcade frame - must end "maze matches the arcade"
```

Both are fast and dependency-free. `tools/test.js` runs the real game under a
stub DOM, including `render()` every frame, so it catches crashes in drawing
code too. Run both before telling the user something works.

There is no browser automation in this environment (the user declined the
Chrome extension), so **headless verification is the only verification.** Don't
claim the visuals are confirmed in-browser unless the user says so.

## Layout

```
index.html                 the entire game: markup, CSS, and one IIFE of JS
reference/
  pacman-arcade-frame.png  pixel-perfect arcade frame, the source of truth
tools/
  launch.js                opens the game in Chrome
  test.js                  headless logic suite (extracts the JS from index.html)
  harness.js               DOM/canvas/audio stubs so the game runs under node
  arcade-diff.js           tile + pixel diff of our maze against the reference
  arcade-ascii.js          side-by-side ASCII pixel dump of one region
  compare-image.js         side-by-side PNG (read it with the Read tool)
  render-maze.js           runs the game's own drawWalls() into a pixel buffer
  png.js                   dependency-free PNG decode/encode
docs/arcade-fidelity.md    the arcade rules this clone implements, and why
```

`tools/test.js` and `tools/render-maze.js` both read `index.html` and pull the
code out of it by string match — `test.js` takes everything between `<script>`
and `</script>`; `render-maze.js` slices `function drawWalls` up to
`function buildMazeCache`, and passes the module-level values it needs as
arguments. **If you rename `drawWalls` or `buildMazeCache`, or change what
drawWalls closes over, update `render-maze.js` too.**

## Code map

One IIFE in `index.html`, in this order (each has a banner comment — grep the
name, don't trust line numbers):

| Section | What lives there |
|---|---|
| Geometry | `T=8`, 28x31 maze, 224x288 screen, `BASE_SPEED = 60` px/s |
| The maze | `MAZE` string array, tile/pellet parsing, `openAir` flood fill |
| Directions | `UP/LEFT/DOWN/RIGHT`, `DIR_ORDER` (arcade tie-break order) |
| Per-level tables | speeds, fright times, Elroy thresholds, fruit, wave lengths |
| Ghost definitions | the four ghosts, scatter corners, house positions |
| Sound | small WebAudio synth, no assets |
| Movement along the tile grid | `advance()` — the core movement model |
| Game state | the `game` object |
| Set-up | `newGame`, `startLevel`, `placeActors` |
| Ghost behaviour | targeting, speed, `ghostDecide`, house state machine, release |
| Scoring, pellets, fruit | fright, waves, dot counters |
| Pac-Man | `pacDecide`, `updatePac`, `eatCheck` |
| Collisions and life cycle | `checkCollisions`, `eatGhost`, `killPac` |
| Main update | `updatePlay`, `update` (the game-state machine) |
| Rendering | `drawWalls` (the tricky one), sprites, HUD, `render` |
| Menu / overlay | ghost picker, pause/game-over overlay |
| Input | keyboard, swipe |
| Main loop | fixed `STEP = 1/120` accumulator |
| Boot | builds a level as the menu backdrop, then starts |

## The movement model (don't fight it)

Actors hold float pixel positions and always travel **centre to centre** along a
corridor. `advance(actor, distance, decide, allowDoor)` walks forward, stopping
exactly on every tile centre it reaches and calling `decide` there; that is the
only place a direction can change (except an instant reverse, which is applied
straight away on input or on a mode flip). This is what keeps actors out of
walls, and the test suite asserts it every few frames.

Consequences worth knowing:
- Positions land exactly on centres, so float drift can't accumulate.
- A turn is only possible at a centre — that is the arcade feel, not a bug.
- Ghost house movement (`house`, `leaving`, `entering`) is **scripted**, not
  tile-based, because the door sits between two tile columns at x=112.

## Maze invariants

- Exactly **240 dots + 4 energizers = 244**. Levels end on the pellet count, and
  the fruit appears at 70 and 170 dots eaten — do not change pellet counts
  casually.
- Legend: `#` wall, `.` dot, `o` energizer, ` ` open, `=` ghost door, `_` void
  (outside the maze; not walkable, not drawn).
- Row 14 is the tunnel and wraps horizontally. `TUNNEL_ROW` is the constant.
- Pac-Man starts at (13.5, 23) = x 112, y 188. Ghost door is at x=112, row 12.
- The four tiles where ghosts may not turn upward are (12,11), (15,11),
  (12,23), (15,23) — an original quirk, in `NO_UP`.
- `openAir` is a flood fill from Pac-Man's start. Open tiles it does **not**
  reach are the sealed ghost house interior; the renderer needs that
  distinction (see below).

## Wall rendering — the rule the arcade actually uses

This took real work to pin down; `docs/arcade-fidelity.md` has the measurements.

- A wall line sits **4px inside** the wall from any edge facing a corridor.
- A wall line sits **flush (0px)** on an edge facing the void outside the maze,
  a ghost-house door, or the sealed house interior. This is what produces the
  double outer border and the ghost house chamber.
- Bottom/right lines use `tile + T - 1 - inset` (last pixel), not `tile + T`.
- Convex corners are quarter arcs: radius 2 normally, radius 4 where both
  edges are flush (the outer border).
- Inner/reflex corners are quarter arcs of radius 2 — **except** where the
  governing inset is 0, where the arcade turns the corner sharply (radius 0).
- Everything is drawn after `translate(0.5, 0.5)` so 1px lines land on pixel
  centres and stay crisp instead of straddling two rows.

## Palette (sampled from the arcade frame, don't "improve" these)

| Thing | Colour |
|---|---|
| Walls | `#2121ff` |
| Pellets, ghost-house door | `#ffb8ae` |
| Ghost eye whites | `#dedeff` |
| Ghost pupils, frightened body | `#2121ff` |
| Blinky / Pinky / Inky / Clyde | `#ff0000` / `#ffb8ff` / `#00ffff` / `#ffb851` |
| Pac-Man | `#ffff00` |

## Gotchas already paid for

- **Ghost eye pupils are exactly the wall blue.** Any tool that classifies
  "is this tile a wall" from a screenshot will read sprite tiles as walls.
  `arcade-diff.js` excludes the five affected tiles by coordinate; if you swap
  in a different reference frame you must redo that list.
- **Large bash heredocs fail in this environment** (~250+ lines dies with
  "unexpected EOF"). Use the Write tool for anything big, then `cat`/`node` to
  splice.
- `updatePac` can consume a whole frame on its eat delay; `eatCheck()` must
  still run in that case or fruit pickup misses. There is a test for it.
- Ghosts in `house`/`leaving` state must not kill Pac-Man, and eaten ghosts are
  hidden during the score-popup freeze.
- The energizer is a circle of radius 4 filling its tile; the dot is a 2x2 rect
  at tile offset 3.

## State of the work

Done and verified: the 244-pellet arcade maze (tile-exact against a real
frame), all four ghost personalities with the original targeting including
Pinky's up-target overflow bug, scatter/chase waves, Cruise Elroy, fright
timings and flashes, ghost-house dot counters and the global counter after a
death, eaten ghosts returning as eyes, fruit at 70/170 dots, 200/400/800/1600
ghost scoring, extra life at 10,000, high score and ghost count persisted in
`localStorage` (`pacman.high`, `pacman.ghosts`), synthesised siren/waka/fright
audio, pause/menu/game-over overlays, keyboard and swipe input.

Deliberately not implemented: the between-level intermission cartoons, attract
mode, and the arcade's exact fruit/score sprite bitmaps (fruit is drawn with
canvas paths). Pac-Man's per-dot slowdown is approximated as a small delay
rather than the arcade's exact frame counts.

Controls: arrows/WASD, `P` pause, `M` sound, `Esc` menu, `0`-`4` set ghosts on
the menu, Space/Enter confirm.
