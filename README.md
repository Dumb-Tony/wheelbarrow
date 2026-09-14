# Wheelbarrow

[Play the first-person prototype](https://dumb-tony.github.io/wheelbarrow/)

Push a wheelbarrow through a delivery yard while balancing six loose bricks with your mouse. Deliver four to succeed, or bring all six. Choose the wide route or risk the bumpy shortcut; recover spills and continue.

## Controls

- W / Up: push forward. S / Down: reverse. Release to slow down.
- A / Left and D / Right: turn the wheelbarrow and your view, even while stopped.
- Mouse inside the game: set tray tilt. Left/right rolls it; up/down tips it forward/back. Center is level. Correct a sliding load before it reaches the rim.
- To unload: stop inside the striped delivery bay and move the mouse to the top center of the game view.
- E: recover one nearby spilled brick. Let it settle before moving.
- P or button: pause/resume. Focus loss pauses automatically.
- R or button: restart. Moving the pointer outside the game returns the target tilt to neutral.

No pointer lock or mouse button is required. Mouse position sets the target angle with a damped response. Turning also leans the tray. The camera stays upright so the load movement remains readable. A small map marks the delivery bay and spilled cargo.

Desktop keyboard and mouse required. Open index.html directly for offline play: no installation, build, downloaded assets or network dependency.

## Tests and limits

Run `node test-physics.cjs`. Current checks cover full cautious delivery (6/6, no spills), aggressive spill and recovery delivery (6/6), corrected mouse tilt versus sustained tilt, arrow controls, pause and reset. Browser checks cover perspective rendering, pointer-driven roll and spills, keyboard pause, restart, resizing and errors. Full routes use deterministic simulation replays; human feel testing remains pending.

This is a first-person software-perspective prototype with simplified physics: independent spherical cargo contacts, no brick rotation, simplified tray rims, ground/storage collisions and simulated turn forces. The tray is not a complete rigid-body chassis. No audio, touch controls or saved scores. Small-screen yard details are small.

See docs/GDD.md and docs/PLAYTEST.md for design and test history. Repository: https://github.com/Dumb-Tony/wheelbarrow.
