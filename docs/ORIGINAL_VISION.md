# Original vision and expansion roadmap

Recovered from **Game Ideas Planning**, conversation `6aa70669-0724-83ea-8d1a-5398e0350b84`, particularly the expanded Wheelbarrow concept. This records the original direction, not a claim that every feature is implemented.

## Keep the core
Take an awkward load from A to B. Tiny controls; physical mastery; recoverable mishaps; safe routes and tempting shortcuts. The challenge is the load, not a growing list of buttons. Current controls: WASD/arrows, mouse balance, E interaction, P pause, R restart.

## Cargo roster
- Implemented: sliding bricks; longer timber with stronger turn-induced imbalance and lower friction; a giant pumpkin with lower rolling resistance; Gary, an adult tipsy passenger whose periodic leaning moves the balance and load.
- Original future ideas: dirt that settles; sloshing water; rolling bowling balls; impact-sensitive glass; spilling paint; self-moving chickens; mixed cargo (balls under boxes behaving like bearings).
- Earlier brainstorm also included explosives, a wedding cake and a person who refuses to get out. Gary is the first passenger implementation; he currently gets out with E at home.

## Contracts and places
Original contracts show quantity, distance and loss allowance, with separate goals for time, losses and perfect delivery. Current game saves quantity/spills/time; scored contract stars remain future work.

Current destinations: garden estate, active construction yard, pub/village homeward route, and farm/creek market route. Longer-term route ideas include narrow plank shortcuts, hills and mountain expeditions carrying heavy supplies. The current creek is impassable outside the bridge, not a swimming/falling simulation.

## Equipment as tradeoffs
Bigger tray (capacity versus balance), wide tire (mud versus rolling resistance), pneumatic tire (comfort versus punctures), dual wheels (stability versus turning), motorized wheel (climbing versus downhill risk), long handles (leverage versus clearance). Earlier ideas also included suspension and brakes. None of these upgrades is implemented yet. Preserve skill-based play when adding a garage, contract earnings or equipment choice.

## Next sensible milestones
1. More contracts on the new maps and mixed cargo; improve extended-body collision for lumber.
2. Bowling balls and moving chickens, then fragile cargo and damage goals.
3. Actual elevation, plank shortcuts and recovery from terrain mishaps.
4. Sloshing liquids, equipment tradeoffs and expedition jobs after their core physics are tested.

## Current simulation limits
Cargo remains an arcade body/contact model. Lumber is visually long and changes handling but does not have full oriented-box end collisions. Gary is a modeled animated passenger with physical load displacement, not an articulated ragdoll. Pumpkin rotation is driven by displacement. These are deliberate first implementations, not a full general-purpose rigid-body simulation.
