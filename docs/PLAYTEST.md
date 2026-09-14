# Wheelbarrow playtest log

## 14 September 2026 — first playable

Automated simulation input replays (`node test-physics.cjs`, Node 24):
- Full wide route: start → (270,550) → (900,550) → bay (1070,330), using cautious pulsed input around 38 speed, stopping at turns; tip and settle. **6 delivered, 0 spills**.
- Aggressive motion: W for 2.5 seconds, then W+D for 1.5 seconds. **6 spills**. Cargo stays in the yard.
- Recovery: drive to spilled load, recover all six one at a time with settling intervals, continue through shortcut at cautious speed to bay. **6 delivered, 6 recorded spills**, without restarting between spill and recovery.
- Pause freezes simulation time. Reset restores six cargo bodies, zero counters, unpaused state.
- Repeated after ground-storage collision change: all assertions pass.

Actual browser checks (Codex in-app browser):
- Game rendered with live overhead cargo and tray inset.
- Desktop 1280×720 screenshot inspected: whole yard, counters, controls fit after layout adjustment.
- 390×844 screenshot inspected: no horizontal overflow; controls remain visible; yard labels are small. Keyboard remains required.
- Pause button visibly changes to Resume and displays paused message.
- Browser error/warning logs empty at initial inspection.

These are automated simulation replays and browser UI checks, **not manual human feel testing**. Full delivery routes were simulated using the same embedded game logic outside the browser; no full real-time browser input replay was performed. External playtesting is still needed to assess turning feel, whether causes of spills are clear, and whether tipping takes too long.

## Known limitations

2.5D, spherical cargo collision shapes without orientation, simplified ramp-like tray rims and damped handle pitch. No chassis roll or player body. Cargo overlaps in the side inset because depth is collapsed. No sound or touch controls. Timer continues after minimum acceptance so remaining deliveries can be completed. Restart has no confirmation. No saved scores.

## External test script

1. Start without reading the design doc. Identify the destination and move within 30 seconds.
2. Deliver at least four using the wide route.
3. Attempt the shortcut faster; recover at least one spilled brick and deliver it.
4. Adjust handle height and explain what it did to the load.
5. Pause, switch away and return, then restart.
6. Report browser, screen size, delivered/time/spills and what felt unclear. Did the failure seem caused by your input? Could you correct it? Would you retry?

Additional final-build browser checks: Restart from pause visibly restored zero counters and running state; P on the focused canvas paused successfully. Final error/warning logs were empty.

## Public deployment

Verified https://dumb-tony.github.io/wheelbarrow/ in the browser on 14 September 2026: game title, canvas, controls and initial counters loaded successfully from GitHub Pages. First playable commit: 6fb487b. Public repository: https://github.com/Dumb-Tony/wheelbarrow.

## Revision 2 — first-person mouse balance, 14 September 2026

This section supersedes the presentation/control limitations in the original entry.

Automated same-logic simulation replays:
- Entire wide route with centered mouse, followed by mouse-forward unloading: **6 delivered, 0 spills**.
- Fast push and right turn: **6 spills**. Drive back to the accessible corridor near (540,330), recover each brick, then complete the shortcut cautiously and unload: **6 delivered, 6 spills**, no restart during recovery.
- Mouse full-right for 65 steps, counter-left for 40 steps, then center: **0 spills**. Full-right sustained for 600 steps: **6 spills**. Step rate 120 Hz. Explicit assertions verify correction can save the load.
- Up and W produce identical displacement. Right and D produce identical heading. Down reverses; Left turns left.
- Pause and reset assertions pass.

Browser UI checks on revised build:
- Desktop screenshot confirms first-person yard, near tray, independent cargo, handles, hands, map and balance indicator.
- Pointer drag from center toward right visibly rolled the tray (32 degrees in captured frame); sustained tilt produced six spills and a nearby-recovery prompt.
- Restart cleared spills, time and tilt. Arrow-Up accepted from focused canvas; P visibly paused. Error/warning logs empty.
- Narrow viewport checked for layout; keyboard and mouse still required. Desktop is the intended play size.

Full success and recovery routes are automated simulation input replays, not real-time human browser playtests. Human first-person feel testing remains pending. Known simplifications: software face-depth sorting can have minor overlap artifacts, spherical brick contacts without rotation, simplified tray rather than a complete chassis, no mouse-look (turn using A/D or arrows), no pointer lock, no sound/touch/save. Pointer outside the canvas neutralizes the target tilt. Physical spill conversion uses simplified yard coordinates.
