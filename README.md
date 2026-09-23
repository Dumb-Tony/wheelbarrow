# Wheelbarrow — The Garden Job

[Play Wheelbarrow](https://dumb-tony.github.io/wheelbarrow/)

A stylized first-person balancing game: carry six loose bricks through a sunlit garden, keep them in the tray with your mouse, and deliver at least four. Take the easy garden path or risk the rough shortcut. A spill is a problem to recover from, not a game over.

## Chapter one: the garden

The graphics revision adds a real 3D renderer, warm sunlight and shadows, textured materials, a glass greenhouse, a potting cottage, garden beds, trees, timber signs and a detailed wheelbarrow with gloved hands. Bricks are separate beveled meshes that follow the existing physics.

The longer-term direction is **garden → construction yard → rustic farm**. This release contains the garden chapter only. Later chapters should vary terrain, cargo and delivery decisions rather than add stat upgrades; see docs/GDD.md.

## Controls

- W / Up: push. S / Down: reverse. Release to slow down.
- A / Left and D / Right: turn the wheelbarrow and view.
- Mouse: tilt the tray. Center is level; left/right rolls it, up/down tips forward/back.
- To unload, stop inside the stone-bordered delivery apron and move the mouse to the top center.
- E: recover one nearby spilled brick. Let it settle before moving.
- P or button: pause/resume. Switching away pauses automatically.
- R or button: restart. Moving outside the game returns target tilt to neutral.

Desktop keyboard, mouse and a WebGL 2 browser required. No pointer lock. No sound or touch controls yet.

## Local development

The initial single-file experiment has become a static multi-file game. Serve it over HTTP; opening index.html directly is no longer supported because browser modules require a server.

Run `npm start` (or `node serve.cjs`), then open http://localhost:8769. No install or build is needed to run it: the Three.js renderer is included in vendor/. `npm install` is only needed to refresh the pinned source package. See docs/ATTRIBUTION.md and vendor/LICENSE.

## Verification

`npm test` runs the deterministic physics suite: cautious delivery, aggressive spills, recovery and delivery, mouse correction, arrow controls, pause/reset.

For real-time browser input replays, start the local server and open `/?replay=safe` or `/?replay=recovery`. These use the game's actual input handlers and frame loop and display pass/fail. They only activate on localhost. They are automated tests, not human feel testing.

See docs/PLAYTEST.md for actual results. Known physics limits: spherical brick contacts without rotation, simplified tray rims and chassis, and approximate spill conversion. Most scenery is decorative; building collision footprints and the original route layout are retained. No campaign progression is implemented yet.

## Controls and lighting revision — 22 September 2026

Mouse roll now agrees with the visible tray: right lowers the right rim, left lowers the left. Forward/back mapping remains mouse-top tips forward, mouse-bottom tips backward. The old renderer applied the opposite sign to roll even though the cargo forces were correct. A regression test transforms actual rim points with the shared renderer pose and checks their heights.

New materials use generated albedo, normal and roughness maps for painted metal, wood, brick, stone, stucco, roofing, gravel, grass and gloves. Sunlight uses a 4096-pixel shadow map; GTAO supplies contact shading during play.

**Ray-traced view** pauses the game and snapshots the scene for genuine four-bounce GPU path tracing, with instanced detail expanded in the snapshot and a small edge-preserving image filter. This is an optional photo view, not real-time ray tracing during movement or a promise of hardware RT-core acceleration. The first use compiles a substantial shader and can take several seconds. Noise reduces as samples accumulate. Back to play or Escape restores the previous pause state; R returns and restarts. The renderer is fetched from this same site only when needed.

Run `npm run build:effects` after changing the effect bundle entry files (requires npm install). Runtime files are checked in, so regular npm start and npm test still require no install. Browser and physics tests are in docs/PLAYTEST.md.
