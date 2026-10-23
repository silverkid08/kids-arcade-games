# Kids Arcade Games — shared spec for every game in this repo

Every game in this folder is a faithful clone of a classic arcade game that
runs in Chrome straight from `file://`, with two additions for kids:
an **invulnerable mode** and **difficulty configuration**. This file is the
contract each game follows. `pac-man/` is the finished reference
implementation — read `pac-man/CLAUDE.md` and skim `pac-man/index.html`
before starting a new game, and copy its conventions.

## Hard requirements

1. **One folder per game**, slug-named (`space-invaders/`, `frogger/`,
   `galaga/`, `donkey-kong/`, `asteroids/`). Inside:
   ```
   index.html        the ENTIRE game: markup, CSS, one IIFE of JS, embedded art
   README.md         how to play, controls, what's faithful, what's not
   CLAUDE.md         orientation notes for future work (code map, gotchas, state)
   tools/test.js     headless logic suite under node, ends "all tests passed"
   tools/harness.js  DOM/canvas/audio/Image stubs (copy pac-man/tools/harness.js and extend)
   tools/launch.js   opens index.html in Chrome
   reference/        any sprite sheets / frames used as the source of truth (optional)
   ```
2. **Runs from `file://` in Chrome with zero network.** That means:
   - No ES modules, no `fetch`, no `XMLHttpRequest`, no external `<script>`/`<link>`.
   - All art is embedded in `index.html`: either as `data:image/png;base64,...`
     URIs or as pixel arrays / palette-indexed strings drawn to an offscreen
     canvas at boot. Audio is synthesised with WebAudio (no files).
   - Must not throw if `localStorage` is unavailable (wrap in try/catch).
3. **Plays exactly like the original arcade game** at the "Original" preset:
   same screen resolution and aspect (scaled up with `image-rendering: pixelated`
   and integer scaling where possible), same movement speeds, timings, enemy
   behaviour, scoring, extra-life thresholds, lives, and level progression
   rules. Research the real arcade mechanics (Wikipedia, StrategyWiki, the
   game's dedicated fan wikis, disassembly notes) and write the key numbers
   down in `README.md`/`CLAUDE.md` with where they came from.
   **Not every level has to exist**: implementing the first few distinct
   stages and then looping / scaling them is fine, as long as the stages that
   exist are correct. Say in the README which stages are implemented.
4. **Real art from the original game.** Use the actual sprite bitmaps and
   colours of the arcade version, not approximations in a different style.
   Preferred route: download genuine ripped sprite sheets (e.g. from
   spriters-resource.com, or other sprite-rip archives) with `curl` into
   `reference/`, decode them with a dependency-free PNG reader
   (`pac-man/tools/png.js` can be copied), crop the frames you need, and embed
   them as base64 data URIs or pixel arrays. **Look at the sheet with the Read
   tool** (it renders images) to find frame coordinates and to confirm the
   crops are right. If no rip can be obtained, hand-encode the sprites
   pixel-for-pixel from the well-documented original bitmaps (Space Invaders'
   aliens, Galaga's bugs, Donkey Kong's Jumpman/Kong/barrels, Frogger's frog,
   cars, logs and turtles are all extensively documented). Asteroids is a
   vector game: reproduce the actual vector shapes (ship, four asteroid
   outlines, saucers) and the glowing-line vector-monitor look. Never use
   placeholder rectangles in the final product. This is for personal use only.
5. **Invulnerable mode** (toggle, default OFF): the player cannot die or lose a
   life from any cause. The thing that would have killed them still visibly
   happens (the shot passes through / the car drives over the frog / Kong's
   barrel bonks and bounces off) with a small harmless flash so the kid
   understands, but play continues uninterrupted. Timers that would end a
   stage on timeout (Frogger's clock, Donkey Kong's bonus timer) do not kill
   either; they just reset. A small on-screen badge shows when it is on.
6. **Difficulty configuration** with presets and individual knobs, all on the
   start menu (and reachable from pause via `Esc`):
   - Presets: **Kid** (slow, few enemies/shots, many lives, gentle),
     **Easy**, **Normal**, **Original** (arcade-exact; this preset must make
     the game identical to the real machine's default DIP settings).
   - Knobs (adapt names to the game, keep at least 5): enemy speed %, player
     speed %, enemy fire/spawn rate %, starting lives (1-9), starting stage,
     extra-life threshold, and the invulnerable toggle. Choosing a preset
     sets the knobs; touching a knob switches the preset display to
     "Custom". Changing a knob never affects the "Original" preset's values.
   - Persist the settings and the high score in `localStorage` under a
     per-game prefix (e.g. `galaga.settings`, `galaga.high`). High scores are
     recorded separately per preset, and a high score set with invulnerable
     on is tracked under its own key and shown with a marker, so an
     invulnerable run never overwrites the real table.
7. **Controls**: arrow keys and WASD; Space / Enter / the game's natural fire
   key for action; `P` pause; `M` mute; `Esc` menu; on-screen touch buttons are
   a nice-to-have, not required. Audio must start only after a user gesture
   (Chrome autoplay rule).
8. **Menu / overlay style**: follow the look of `pac-man/index.html`'s overlay
   (dark backdrop, monospace, the game's own title colour, keyboard-navigable
   buttons). Show title, preset picker, knobs, invulnerable toggle, high
   scores, controls hint, PLAY button.
9. **Fixed-timestep main loop** (`requestAnimationFrame` + accumulator at the
   arcade's frame rate, 60 Hz unless the machine ran at something else) so
   speed is independent of monitor refresh.
10. **Verification before claiming done**:
    - `node tools/test.js` runs the real game under the harness, including
      `render()` every frame, and asserts the core rules (speeds/timings at
      "Original", scoring, invulnerable mode actually prevents death, each
      knob has its effect, settings round-trip through localStorage, no
      exceptions across a few thousand simulated frames of each game state).
    - If browser automation (claude-in-chrome tools) is available, also open
      the file in Chrome, take a screenshot of the title screen and of
      gameplay, check the console is clean, and look at the screenshot to
      confirm the art is the real art. If it isn't available, say so in your
      report and rely on the headless suite plus rendering a frame to PNG
      with the harness (see `pac-man/tools/png.js` encode) and viewing it
      with the Read tool.

## Things to avoid

- Large bash heredocs (~250+ lines) fail in this environment; use the Write
  tool for big files.
- Don't guess sprite coordinates on a sheet; look at the image.
- Don't scale art with smoothing; keep `image-rendering: pixelated` and
  integer scale factors.
- Don't silently drop a requirement. If something is impossible (e.g. a rip
  could not be fetched), do the fallback and state it plainly in the README
  and in your final report.
