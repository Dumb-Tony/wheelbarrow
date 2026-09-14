# Wheelbarrow: first build milestone

## M0 — repository and design
Own Git repository, focused GDD, standalone browser entry point plan, playtest log, and sharing guide.

## M1 — playable core slice
1. Create index.html with embedded styles, code, controls, pause, and restart.
2. Implement the smallest readable scene: A short delivery yard with a safe wide route and a narrow, bumpy shortcut. Deliver six independent bricks into a marked zone. Begin carrying the load so the first meaningful decision happens immediately.
3. Implement consistent physical response: Separate cargo bodies with gravity, collisions, friction, and momentum. Handle height affects tray pitch; acceleration and turns shift cargo. Spilled bricks remain in the yard and can be recovered through a simple nearby interaction. A clearly labeled 2D or 2.5D simplification is acceptable for the first experiment.
4. Add objective detection: Deliver at least four of six bricks. Track delivered cargo, elapsed time, and spills separately. Verify cautious motion retains cargo, aggressive movement can spill it, and at least one spill can be recovered without restarting.
5. Complete a success route and a recovery route, and inspect browser errors and resizing.
6. Commit a playable baseline and document controls, known simplifications, and checks actually performed.

## Scope gate
No campaign, progression economy, networking, asset pipeline, or dependency-heavy framework. Do not substitute a generic movement demo for the central mechanic. If a feature is too risky, document the reduction and preserve the core hypothesis.

## Later sharing milestone
Use this repository's own remote and static hosting; follow the parent project's standing instructions when shipping. Keep published contents limited to this game. Record the verified public URL and commit in README. First request prepares for later external testing; never report a public link before deployment succeeds.

M1 implementation complete locally on 14 September 2026. Six-of-six safe and recovery replays pass. Browser layout, pause, and console checks recorded in PLAYTEST.md. Human feel testing remains the next gate.
