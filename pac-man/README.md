# Pac-Man

A clone of the 1980 arcade Pac-Man that runs in Chrome from a single file, with
one addition: **you choose how many ghosts chase you, from 0 to 4.**

## Play

Double-click `index.html`, or:

```
node tools/launch.js
```

No install, no server, no dependencies.

| | |
|---|---|
| Move | Arrow keys or WASD (swipe on touch) |
| Pause | `P` |
| Sound | `M` |
| Menu | `Esc` |
| Ghosts | `0`-`4` on the menu, or click a number |
| Start / confirm | Space or Enter |

Sound starts on your first keypress or click — Chrome blocks audio until you
interact with the page.

## The ghosts

They join in arcade order, each with the personality from the original:

| Count | Who joins | Behaviour |
|---|---|---|
| 1 | Blinky (red) | Heads straight for you, and speeds up as the maze empties |
| 2 | + Pinky (pink) | Aims four tiles ahead to cut you off |
| 3 | + Inky (cyan) | Uses Blinky's position to pincer — the unpredictable one |
| 4 | + Clyde (orange) | Chases until he gets close, then loses his nerve |

Pick 0 and the maze is just a snack run — handy for younger players.

## What's faithful

The 244-pellet arcade maze, verified tile-by-tile against a real arcade frame.
Original ghost targeting (including Pinky's famous "looking up" bug), scatter
and chase waves, Cruise Elroy, frightened timings and flash counts, ghost-house
release counters, eyes returning home after a ghost is eaten, fruit at 70 and
170 pellets, 200/400/800/1600 ghost scoring, and an extra life at 10,000. High
score and your ghost count are remembered between sessions.

## Repository

```
index.html                 the whole game
reference/                 the arcade frame used as the source of truth
tools/                     headless tests and arcade comparison tooling
docs/arcade-fidelity.md    what was matched and how it was verified
CLAUDE.md                  orientation notes for future work
```

Checks:

```
node tools/test.js          # game logic, runs headlessly under node
node tools/arcade-diff.js   # maze compared against the arcade frame
```
