# Wheelbarrow

A standalone 2.5D cargo physics experiment. Deliver at least four of six loose bricks through a delivery yard. Take the wide route or risk the bumpy shortcut. Spills are recoverable.

## Play

Public deployment: https://dumb-tony.github.io/wheelbarrow/ (deployment verification recorded in docs/PLAYTEST.md).

Open index.html directly for offline play. No installation, assets, build step, or network dependency. Desktop keyboard required.

- W / S: push / reverse; release to brake naturally.
- A / D: steer, including while stationary.
- Up / Down: raise / lower handles; height stays where you leave it.
- Space: hold to tip forward. Stop well inside the delivery bay first.
- E: recover one nearby spilled brick; wait for it to settle.
- P or button: pause / resume. Focus loss pauses automatically.
- R or button: restart immediately.

Delivered count, elapsed time, and spill events are separate. Four bricks earns acceptance; continue for all six. Time continues while collecting the rest. A spill counts each exit outside the bay, including repeated spills of the same brick.

## Validation

Run `node test-physics.cjs` for deterministic input replays of a full safe delivery, aggressive spill, recovery and subsequent delivery, pause, and reset. See docs/PLAYTEST.md for results and limits. These replays are not human feel testing.

## Model boundaries

Overhead driving plus a side-view cargo inset. Six independent bodies use spherical contacts, gravity, momentum, friction, raised tray edges, and storage collisions. Handle angle changes gravity along the tray; turns apply lateral acceleration; rumble strips bounce the load. No brick rotation, full chassis rigid-body simulation, audio, or touch controls. Small screens fit the interface but make yard labels small.

Design: docs/GDD.md. Milestone: docs/PROTOTYPE_PLAN.md. External testing: docs/PLAYTEST.md.
