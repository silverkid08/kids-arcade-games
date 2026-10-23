# Galaga clone - working notes for Claude

A single-file clone of the 1981 arcade Galaga, following `../GAME-SPEC.md`:
kid-friendly presets and knobs on top of arcade-faithful rules at the
"Original" preset. Sister project of `../pac-man` and shares its conventions
and tooling.

## Run it

```
node tools/launch.js        # or double-click index.html
```

`file://` is enough: no fetches, art and sound are embedded.

## Verify after ANY change

```
node tools/test.js            # headless suite, must end "all tests passed"
node tools/render-frame.js    # writes tools/out/{entry,formation,dive,beam,challenge,dual}.png
```

`test.js` runs the real game (the JS sliced out of `index.html` between
`<script>` and `</script>`) under `tools/harness.js`, calling `render()` every
frame, so it catches drawing crashes too. It seeds `Math.random` so runs are
reproducible. `render-frame.js` uses the harness's software canvas
(`global.__HARNESS_PIXELS = true` before requiring the harness) and the PNG
encoder to produce real frames. If the Read tool refuses a tall PNG, crop it
into landscape halves (the scratchpad scripts in the session history did
224x144 crops at 4x) - the images themselves are fine.

Browser verification in this environment is shaky: the Chrome extension's
window is shared by several agents, the tab is usually `document.hidden`, so
`requestAnimationFrame` is frozen and only screenshots force single frames.
What was confirmed in Chrome: the page loads with no console errors, the menu,
preset buttons and persistence work, PLAY starts the game, the intro screen
(HUD, starfield, lives, badge) renders through the real canvas path. Gameplay
visuals were verified through the headless renders.

## Layout

```
index.html              markup, CSS, one IIFE of JS
reference/galaga-arcade-sheet.png   ripped arcade sprite sheet (source of all art)
tools/sprites.js        sheet -> RLE sprite block spliced into index.html
tools/harness.js        DOM/canvas/audio/localStorage stubs (+ optional pixel canvas)
tools/test.js           headless suite
tools/render-frame.js   headless frame renders
tools/png.js            PNG decode/encode (no deps)
tools/launch.js         opens Chrome
```

## Code map (grep the banner names, do not trust line numbers)

In order inside the IIFE:

1. Constants: `SW/SH/FPS/STEP`, `FIGHTER_Y`, `HUD_BOTTOM`, `FORM_X/FORM_Y0`,
   `CFG` (speeds, shot limits, beam timing, extra-life thresholds),
   `rankParams(rank)` (per-stage difficulty table).
2. `/* @sprites-begin */ ... /* @sprites-end */` - generated. `PAL`, `SPR`
   (RLE frames), `FONT`. Regenerate with `node tools/sprites.js --splice`;
   never hand-edit.
3. Sprite decoding: `decodeRLE`, `frameCanvas`, `Sprites` (rot[7][4] frames per
   family, `anim` wing-flap pair, missiles, explosions, beam, badges), text
   drawing, `rotFrame(phi)` / `headingOf(dx,dy)`. Heading convention: phi 0 =
   facing down, 90 = left, 180 = up, 270 = right. Enemy sheet frame 6 = down,
   0 = left; the fighter family is drawn with phi+180.
4. `Sound` module (WebAudio synth; `seq` note sequencer; mute persisted under
   `galaga.muted`).
5. Settings: `KNOBS`, `PRESETS`, `PRESET_ORDER`, `presetMatching`,
   `loadSettings/saveSettings` (`galaga.settings`), `applyPreset`,
   `loadHigh/saveHigh` (`galaga.high`, keys kid/easy/normal/original/custom/
   invuln), `highKey()`.
6. Paths: `spline`, `arcPts`, `mirrorWay`, `shiftWay`, `ENTRY_PATHS`, `WAVES`
   (slot table: which type goes to which formation slot per wave), `PATTERNS`
   (three entrance patterns), challenge paths/sets, `SCORE` table,
   `challengeGroupBonus`, `PERFECT_BONUS`.
7. `game` state object, stars, formation (`slotPos`, `updateFormation`: sway
   while filling, breathe after).
8. Enemies: `makeEnemy`, `followPath`, `homeToSlot`, `startEntry`,
   `updateEntry`, `startChallenge`, `updateChallenge`, dive path builders,
   `launchDive`, `pickAttacker`, `scheduleAttacks` (escorts, beam decision),
   `enemyFire`, `updateEnemy` (state machine: queued, entering, homing,
   formation, diving, beamRun, beam, beamDrop, attached, freed, capturing,
   capturingHold, dead).
9. Player, shots, collisions, `killEnemy` (rescue / hostile captured fighter /
   challenge tallies), `playerHitBy` (invulnerable flash, dual-fighter loss),
   capture sequence, `loseLife`.
10. Stage flow: `newGame`, `beginStage`, `stageIntro`, `stageCleared`, and the
    `update()` state machine (intro, stage, play, dying, ready, captured,
    clear, challengeEnd, gameover, results, menu).
11. Rendering (`render`, `drawEnemy`, `drawBeam`, `drawHud`, `drawBadges`).
12. Menu overlay (`buildMenu`, `refreshMenu`, `adjustKnob`, `showOverlay`,
    `startPlaying`, `togglePause`, `toMenu`), input, resize, main loop, boot,
    and the `__GALAGA` test export (only when `globalThis.__GALAGA_TEST`).

## Gotchas

- Formation enemies are re-snapped to `slotPos()` every frame in
  `updateEnemy`; if you add a state that should stay in formation, do the same
  or it will drift when the formation sways/breathes.
- `killEnemy` decides rescue vs hostile from the boss's state *before* setting
  it to dead (`wasDiving`). Keep that ordering.
- Stage clear waits for `game.pshots` to empty and for a freed captured
  fighter to dock (`freeing` guard in `update()`), otherwise the dual fighter
  would be lost between stages.
- Challenging-stage hits do not score on impact (`enemyValue` returns 0 while
  `game.challenge` is set); they are paid at the end as hits x 100, or the
  10,000 special bonus on a perfect. Group-of-eight bonuses pop immediately.
- `canvas.width/height` are set in JS at boot (the harness's stub canvas has
  no attribute parsing).
- `tools/test.js` and `tools/render-frame.js` extract the script by string
  match on `<script>` / `</script>`; keep a single script tag.
- The invulnerable flash is a white box around the fighter for 20 frames (see
  `f.flash` in `render`), by design harmless and visible.

## Known shortfalls (see README "What's approximate")

Speeds/timings by eye, spline paths rather than ROM tables, stage 4+ loops the
three entrance patterns, no transform enemies in play, approximate challenge
line-ups and tunes.
