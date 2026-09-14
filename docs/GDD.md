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
