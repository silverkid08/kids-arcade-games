# Arcade fidelity: what was matched, and how it was verified

This clone aims to be indistinguishable from the 1980 arcade Pac-Man apart from
one thing: the ghost count is configurable from 0 to 4. This document records
the arcade behaviour and artwork rules the code implements, where each rule came
from, and how to re-check them.

The reference frame is `reference/pacman-arcade-frame.png` — the "Pac-Man
gameplay (1x pixel-perfect recreation)" image from Wikimedia Commons, a 224x288
frame at true arcade resolution. It is the source of truth for maze layout and
palette. Behavioural tables come from the Pac-Man Dossier.

---

## 1. The maze

28 x 31 tiles of 8px, drawn below three rows of score display (so the maze
starts at screen y=24) and above two rows of lives/fruit. Exactly **240 dots and
4 energizers**.

Legend used in the `MAZE` array: `#` wall, `.` dot, `o` energizer, ` ` open,
`=` ghost door, `_` void (outside the maze — not walkable, not drawn).

Fixed points:

| Thing | Location |
|---|---|
| Pac-Man start | tile (13.5, 23) — x=112, y=188, facing left |
| Ghost door | row 12, columns 13-14; ghosts pass through x=112 |
| Blinky start | x=112, y=92 (just above the door), outside the house |
| House slots | Pinky x=112, Inky x=96, Clyde x=128, all y=116 |
| Fruit | x=112, y=140 (row 17, the gap under the house) |
| Tunnel | row 14, wraps horizontally |
| No-up tiles | (12,11), (15,11), (12,23), (15,23) |

### The mistake worth remembering

The first version of this maze had rows 24-25 (just below Pac-Man's start) as
two 5-tile blocks flanking a 2-tile centre divider. The arcade actually has a
single **8-tile-wide block spanning columns 10-17**, with open corridors running
down columns 9 and 18:

```
###.##.##.########.##.##.###      <- rows 24 and 25, correct
###.##.#####.##.#####.##.###      <- what it was, wrong
```

Both variants happen to contain 6 dots per row, so the pellet total stayed at
244 and every automated test still passed. Only a pixel comparison against a
real frame caught it. That is why `tools/arcade-diff.js` exists.

---

## 2. Wall artwork

The arcade maze is hand-drawn tile art, but its geometry follows one consistent
rule, recovered by measuring the reference frame:

> A wall line sits **4px inside** the wall from an edge that faces a corridor,
> and **flush on the boundary (0px)** from an edge that faces the void outside
> the maze, the ghost-house door, or the sealed house interior.

Everything else falls out of that:

- A 2-tile-thick interior wall gets two lines 8px apart, centred in the block.
- The outer border (1 tile thick) gets a line at the screen edge and another
  3px in — the classic double border — because its outer edge is flush and its
  inner edge is inset 4 (`0` and `7-4=3` within the 8px tile).
- The ghost house reads as a chamber because the walls facing its sealed
  interior are flush rather than inset.

Details that matter for pixel accuracy:

- Bottom and right lines are at `tile + T - 1 - inset` (the last pixel of the
  run), not `tile + T - inset`. Top/left are at `tile + inset`.
- Convex corners: quarter arcs, radius **2** normally, radius **4** where both
  meeting edges are flush (the outer border corners).
- Inner (reflex) corners: quarter arcs of radius 2, **except** where the
  governing inset is 0 — there the arcade turns sharply (radius 0). The ghost
  house corners and the steps where the maze narrows are sharp for this reason.
- All wall drawing happens after `translate(0.5, 0.5)` so 1px strokes land on
  pixel centres. Without it every line straddles two rows and looks soft.
- The ghost-house door is a 2px bar at tile offset 5-6, in the pellet colour
  `#ffb8ae` — not pink.

Measured examples from the reference frame, useful as spot checks:

| Feature | Arcade pixels |
|---|---|
| Top border | horizontal lines at y=0 and y=3 |
| Left border | vertical lines at x=0 and x=3 |
| Block at cols 2-5, rows 21-22 | lines at x=20, x=43, y=172, y=179 |
| House left wall (col 10) | lines at x=84 (inset) and x=87 (flush) |
| House top wall (row 12) | lines at y=100 (inset) and y=103 (flush) |
| House bottom wall (row 16) | lines at y=128 (flush) and y=131 (inset) |
| Door | y=101-102, x=104-119 |

---

## 3. Palette

Sampled directly from the reference frame:

| Element | Colour |
|---|---|
| Walls, ghost pupils, frightened ghost body | `#2121ff` |
| Pellets, energizers, ghost-house door | `#ffb8ae` |
| Ghost eye whites | `#dedeff` |
| Pac-Man | `#ffff00` |
| Blinky | `#ff0000` |
| Pinky | `#ffb8ff` |
| Inky | `#00ffff` |
| Clyde | `#ffb851` |

Dots are a 2x2 rect at tile offset 3; energizers are a circle of radius 4
filling the tile.

---

## 4. Behaviour (Pac-Man Dossier)

**Speeds.** 100% = 60 px/s = 7.5 tiles/s (the arcade's 1 pixel per frame at
60fps). Per level: Pac 80/90/100/90%, ghosts 75/85/95%, frightened ghosts
50/55/60%, ghosts in the tunnel 40/45/50%.

**Targeting** (each ghost picks the neighbouring tile closest to its target,
never reversing, tie-break order up, left, down, right):

- Blinky: Pac-Man's tile.
- Pinky: 4 tiles ahead of Pac-Man — **including the original's overflow bug**,
  where facing up also shifts the target 4 tiles left.
- Inky: take the tile 2 ahead of Pac-Man (same up bug), then double the vector
  from Blinky to that tile.
- Clyde: Pac-Man's tile when 8+ tiles away, otherwise his scatter corner.

Scatter corners are outside the maze: Blinky (25,-3), Pinky (2,-3), Inky
(27,32), Clyde (0,32) in playfield coordinates.

**Waves.** Level 1: scatter 7s, chase 20s, scatter 7s, chase 20s, scatter 5s,
chase 20s, scatter 5s, then chase forever. Levels 2-4 and 5+ use the longer
arcade variants. Every wave change reverses all ghosts that are out. The wave
timer is paused while ghosts are frightened.

**Cruise Elroy.** Blinky speeds up and ignores scatter once the pellets left
drop below a per-level threshold (20 on level 1), then again at half that.

**Fright.** 6s on level 1 down to none by level 19, with the flash count from
the dossier. Eating ghosts scores 200/400/800/1600 within one energizer.

**Ghost house.** Per-ghost dot counters release Pinky (0), Inky (30 on level 1)
and Clyde (60 on level 1, 50 on level 2); after a death a global counter takes
over with thresholds 7/17/32. A 4-second (3s from level 5) timer since the last
dot releases the next ghost regardless.

**Fruit.** Appears at 70 and 170 dots eaten for about 9-10 seconds. Cherry 100,
strawberry 300, orange 500, apple 700, melon 1000, Galaxian 2000, bell 3000,
key 5000.

**Misc.** Extra life at 10,000. Eating a dot costs Pac-Man about 1 frame, an
energizer about 3.

---

## 5. How to re-verify

```
node tools/arcade-diff.js        # tile + pixel diff against the reference frame
node tools/test.js               # behaviour suite, runs the game headlessly
```

`arcade-diff.js` must print `tile mismatches: 0` and `maze matches the arcade`.
Pixel agreement sits around 92%; the shortfall is corner pixels from the crude
rasteriser in `render-maze.js` (it paints every sample point, so curves come out
up to 1px fatter than Chrome's anti-aliased arcs). Judge **line positions**, not
curve weight. `arcade-only` pixels are the number that matters — it should stay
near zero, meaning we cover everything the arcade draws.

Five tiles in the reference frame sit under ghost and Pac-Man sprites. Ghost eye
pupils are `#2121ff`, the exact wall blue, so those tiles always classify as
wall; `arcade-diff.js` excludes them by coordinate and reports them as
`(sprite)`. Swapping in a different reference frame means redoing that list.

To look at a disagreement:

```
node tools/arcade-ascii.js 76 96 48 44    # ASCII pixels, ours beside the arcade
node tools/compare-image.js 3             # side-by-side PNG in tools/out/
```
