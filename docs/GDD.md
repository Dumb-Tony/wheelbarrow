# Wheelbarrow — first-pass GDD

Status: design hypothesis, prototype first. Source: Game Ideas Planning (conversation 6aa70669-0724-83ea-8d1a-5398e0350b84), continued 14 September 2026. Controls below are proposed prototype mappings, not locked design decisions.

## Fantasy and identity
Take an awkward load from A to B without losing it.

Comedy, balance, and cargo physics. The player supports the handles; the tray and cargo respond to movement rather than behaving like a rigid vehicle.

## Design pillars
Tiny control set. Physical mastery rather than stat upgrades. Readable cause and effect. A disaster should usually create another problem instead of stopping play. Skill progression is new situation → struggle → understand → master → harder situation. No skill trees, rarity tiers, or arbitrary balance bonuses.

## Core loop
Observe the situation, act with the core tool/body, read the physical response, correct or recover, complete the objective, and retry for a cleaner approach. Restart is always a deliberate option, never the default consequence of a small mistake.

## Proposed controls
W/S move, A/D steer, Up/Down lift/lower handles, Space dump; R explicitly restarts.

## First standalone HTML vertical slice
A short delivery yard with a safe wide route and a narrow, bumpy shortcut. Deliver six independent bricks into a marked zone. Begin carrying the load so the first meaningful decision happens immediately.

Separate cargo bodies with gravity, collisions, friction, and momentum. Handle height affects tray pitch; acceleration and turns shift cargo. Spilled bricks remain in the yard and can be recovered through a simple nearby interaction. A clearly labeled 2D or 2.5D simplification is acceptable for the first experiment.

Desktop keyboard and pointer first. Make a self-contained index.html with embedded CSS and JavaScript, procedural visuals, no CDN, no installation, and no required network requests. Render with Canvas or native browser graphics. Use a fixed simulation step, bounded frame catch-up, and clear input state on focus loss. Physics may be simplified but must remain consistent and disclosed.

## Success and recovery
Deliver at least four of six bricks. Track delivered cargo, elapsed time, and spills separately. Verify cautious motion retains cargo, aggressive movement can spill it, and at least one spill can be recovered without restarting.

## Mastery and replay hypothesis
First 30 seconds: save a wobbling load. Ten hours: anticipate cargo movement and choose routes. Long-term hypothesis: cargo arrangements, terrain, and equipment tradeoffs create new delivery problems.

## Beyond the prototype
Different cargo is the challenge roster: lumber, balls, fragile glass, later water or moving animals. Equipment changes tradeoffs: larger tray increases capacity and instability; wider wheels alter handling. Defer fluids, animals, shops, and a campaign.

## Main risk
Cargo that feels glued in place or randomly ejects defeats the premise. Test cargo readability and controllable balance before adding jobs.

## Presentation and accessibility
Readable shapes and silhouettes before decorative assets. Persistent short controls and objective text. Show interaction eligibility before input. Do not rely on color alone. Provide restart and pause, reduced camera shake, and a useful window-size response. Sound is optional; do not block play on autoplay permission.

## Validation gate
A new player should start interacting within 30 seconds. Run an entire successful objective, intentionally cause a recoverable mistake, and complete after recovery. Record automated browser checks separately from manual feel testing. Ask playtesters what caused their failure, whether correction felt possible, and whether they wanted another attempt. Choose the next milestone from this evidence rather than adding content automatically.

## Implemented experiment — 14 September 2026

M1 implemented as a labeled 2.5D simulation: overhead steering and a side cargo view. Six bodies with spherical contacts use gravity, friction, inertia, raised rim slopes and yard obstacle contacts. Pitch follows persistent handle height with damping; Space temporarily tips forward. A 120 Hz fixed step caps catch-up to 0.1 seconds. No camera shake. Stationary steering is permitted. Releasing movement brakes. Recovery is one brick per E within 90 yard units, including around storage edges. Delivered bricks settle and lock into their delivered state; time continues after four for optional completion of six. See PLAYTEST.md for evidence and simplifying assumptions.

## Revision 2 — first-person balance, 14 September 2026

User clarification supersedes the overhead presentation and original key mapping. The intended experience is first-person pushing with WASD/arrows while actively balancing with the mouse.

Implemented: a perspective yard viewed from behind the handles, visible tray and independent bricks, procedural 3D faces drawn to Canvas with near-plane clipping. Camera remains upright. Mouse position relative to the game center sets damped pitch and roll; forward mouse tips forward, horizontal mouse rolls toward that side. Turning induces additional roll and lateral cargo acceleration. WASD and arrow keys are equivalent push/reverse/turn inputs. Space no longer dumps: stop in the bay and tip forward with the mouse. Mouse leaving the view returns the target to level. No pointer capture/lock is required.

The safe and shortcut routes, four-of-six acceptance, recoverable bricks, separate counters and fixed simulation step remain. A compact map helps locate cargo behind the player. Physics remains an approximation with spherical contacts and ramp-like rims; rendering is now first-person perspective rather than overhead plus inset. Next gate: human testing of mouse sensitivity and whether counterbalancing while steering feels intuitive.

## Revision 3 — stylized 3D garden and progression direction

User selected warm, rich-material, playful stylized 3D and wants progression through the proposed settings eventually. Current chapter: Garden Job. Planned sequence: garden renovation → busy construction yard → rustic farm. Each future chapter should add a different physical delivery problem (tighter site access, rougher ground, new cargo shapes), without replacing skill with stat upgrades. Future chapters are not implemented or selectable in this release.

The graphics upgrade supersedes the initial single-HTML constraint: static index.html plus garden.js, style.css and a checked-in MIT-licensed Three.js 0.186.0 renderer. No CDN or external asset service is required. Local use requires HTTP rather than file opening. The tested cargo simulation remains embedded in index.html, separate from the 3D presentation.

Art: sage painted steel and warm wood; rounded bricks and work gloves; sunlit greenhouse and stucco cottage; layered trees, beds, stone and gravel, timber signage, light atmospheric haze. Full-screen interface uses a quiet delivery card, map, small balance reticle and short controls. Rendering uses PBR materials, generated texture maps, sunlight shadow maps, environment light, batched static meshes and instanced small detail. Stable camera; no added head bob or shake.

## Revision 4 — 22 September 2026

Bug fix: renderer roll sign was inverted against physical cargo response. Positive mouse X must lower the right (+Z) rim. Rendering now uses shared applyTrayPose in controls.mjs with positive X-axis rotation; physics input mappings and success criteria stay intact.

Lighting/material pass: generated albedo + normal + roughness surfaces, 4096-pixel sun shadow map, less ambient fill, lower warm sun, and GTAO contact shading. Genuine progressive path tracing is available as an optional frozen photo view with four bounces and a simple edge-preserving filter. Gameplay remains rasterized with contact shading; no claim of real-time RT or hardware RT support. Photo view preserves pause state, unload/recovery controls, and simulation time.
