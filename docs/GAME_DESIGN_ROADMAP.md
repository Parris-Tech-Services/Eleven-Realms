# Eleven Realms: Game Design Roadmap

## Product Direction

Eleven Realms is a seeded, turn-based, top-down exploration game about entering strange realms, reading a dangerous grid, recovering ancient objects, and deciding when to push deeper or escape.

The target is a premium indie-scale experience: authored atmosphere and memorable systems built on a deterministic, replayable foundation. The game should feel readable in a few seconds, but reveal deeper interactions over repeated runs.

## Reference DNA

These are design influences, not implementation requirements or imitation targets.

### The Legend of Zelda

- Visible objectives that lead the player through spaces.
- Keys, gates, tools, secrets, shortcuts, and environmental puzzles.
- A compact overworld that rewards curiosity and backtracking.
- Distinct landmarks that make navigation memorable.

### Into the Breach

- Every tile should communicate a meaningful tactical choice.
- Enemy intent, hazards, range, push, positioning, and terrain should be legible.
- Turns should be short, consequential, and reversible through good planning rather than hidden information.
- Encounters should be solvable puzzles, not damage sponges.

### Shiren the Wanderer

- Seeded expeditions with meaningful risk and imperfect information.
- Items, status effects, traps, enemies, and emergent stories.
- Runs should be interesting even when they end early.
- The seed, route, decisions, and discoveries should make each run shareable.

### A Dark Room

- Sparse interface with strong feedback.
- Discovery before explanation.
- A world that expands from one quiet starting point.
- Small resources and logs that imply a larger story.

### Early Dragon Quest

- Clear overworld progression and simple readable movement.
- Towns, dungeons, quests, equipment, and escalating threats.
- A warm contrast between ordinary travel and strange places.
- Progression that is understandable without a wiki.

## Core Player Loop

1. Enter a seeded realm.
2. Read the immediate objective and visible terrain.
3. Explore rooms and connected regions.
4. Collect resources, keys, relics, and clues.
5. Read enemy intent and resolve tactical encounters.
6. Choose a route, optional objective, faction, or risk.
7. Unlock the next gate or defeat the realm guardian.
8. Leave with a run summary, discoveries, and persistent unlock progress.
9. Start another run with a new seed, challenge, or build.

## Feature Backlog

### World, Rooms, and Navigation

- Generate multiple rooms or regions from the seed.
- Use `walls` for deterministic layouts, corridors, doors, cover, and line of sight.
- Add several biomes with different rules, visuals, enemies, resources, and hazards.
- Add room types: entrance, shrine, shop, puzzle, ambush, treasure, rest, arena, boss, and exit.
- Add secret rooms, false walls, traps, shortcuts, locked routes, and one-way passages.
- Add landmarks, signs, statues, ruins, bridges, and environmental storytelling.
- Add fog of war, explored tiles, room discovery, and a minimap.
- Add procedural room themes with authored set pieces.
- Add a world map showing known and unknown regions.
- Add optional routes with clear risk/reward tradeoffs.
- Add weather, time-of-day, darkness, and realm conditions when they improve decisions.

### Keys, Objects, and Inventory

- Make keys unlock gates instead of allowing direct completion.
- Give keys names, colors, factions, or lore so they are memorable.
- Build a real inventory around the existing `inventory` contract.
- Add consumables, currency, quest items, map fragments, and crafting materials.
- Add equipment slots for weapon, ward, charm, and utility item.
- Add relic combinations that create builds and change how the player solves rooms.
- Add item identification, cursed items, durability, and tradeoffs only if they remain readable.
- Add shops, merchants, barter, and limited stock.
- Add safe storage between rooms or runs.
- Add item tooltips with concise rules and comparison states.

### Enemies and Combat

- Add enemies with deterministic movement patterns.
- Show enemy intent before the player commits to a turn.
- Add turn-based combat, dodge windows, push, stun, block, and line-of-sight rules.
- Add enemy families with distinct tactical identities instead of simple health variants.
- Add patrols, ambushes, fleeing enemies, guards, and territorial behavior.
- Add status effects: burn, slow, mark, poison, silence, shield, and fear.
- Add environmental combat: hazards, explosive objects, water, ice, doors, and pits.
- Add the player abilities dash, reveal, shield, teleport, and heal.
- Add cooldowns, charges, stamina, or resource costs to prevent ability spam.
- Add elite enemies with one visible mutation or rule change.
- Add boss encounters at the end of each realm with phases and readable tells.
- Add a peaceful solution path for selected encounters.
- Add combat recap so the player understands why damage occurred.

### Quests, Characters, and Story

- Add procedurally selected primary quests and optional objectives.
- Add NPCs with short, distinct dialogue and useful behavioral hints.
- Add lore fragments, journals, murals, relic memories, and environmental clues.
- Add faction choices with benefits, costs, and consequences.
- Add companion candidates with one ability and one tension.
- Add town hubs between dangerous regions.
- Add quest chains that alter later rooms rather than only changing text.
- Add ambiguous choices without forcing a single moral answer.
- Add a codex for discovered entities, realms, factions, and symbols.
- Add a light narrative thread connecting all eleven realms.
- Add callbacks to prior runs without requiring prior knowledge.

### Progression and Replayability

- Add a run summary with score, time, damage, discoveries, route, seed, and cause of defeat.
- Add persistent unlocks between runs while keeping the first decision meaningful.
- Add realm-specific and account-wide progression separately.
- Add new abilities, starting loadouts, cosmetics, lore, and challenge modifiers.
- Add daily seeded challenges and weekly mutators.
- Add score grades, medals, achievements, and completion stamps.
- Add no-hit, speed, low-resource, and exploration challenges.
- Add shareable seed URLs and seed import/export.
- Add replay export and a watch-this-seed mode.
- Add ghost routes showing a previous best run without hiding the current route.
- Add multiple endings based on discoveries, factions, and optional objectives.
- Add New Game Plus only after the base run is balanced.

### Atmosphere and Presentation

- Add sound effects for movement, pickup, damage, doors, combat, and discovery.
- Add ambient audio and music layers that respond to realm danger and proximity.
- Add danger cues that work without relying on color alone.
- Add particles, screen shake, hit pause, animation, lighting, and transitions.
- Add weather or environmental motion sparingly to reinforce each biome.
- Add a consistent visual language for interactable, dangerous, locked, and completed tiles.
- Add title-card transitions when entering a realm or boss room.
- Add a restrained UI mode that preserves the sparse interface.
- Add a lore-forward presentation mode for players who want more context.
- Add screenshots and seeded share cards for completed runs.

### Controls and Accessibility

- Keep keyboard movement and add remappable controls.
- Add mobile swipe controls and gamepad support.
- Support mouse and touch interaction for every essential action.
- Add high contrast mode and color-safe symbols.
- Add reduced motion, reduced flash, and screen shake controls.
- Add scalable text and stable layouts at narrow widths.
- Add full keyboard focus order and visible focus states.
- Add optional turn confirmation for dangerous moves.
- Add an onboarding sequence that teaches movement through play instead of a text wall.
- Add pause, restart, quit-run, and confirm-before-loss flows.
- Add sound, music, and ambience volume controls independently.

### Reliability, Testing, and Operations

- Keep world generation deterministic for a given seed and ruleset version.
- Add tests for movement, collisions, keys, gates, enemy turns, status effects, rooms, and boss phases.
- Add property tests for bounds, reachability, inventory conservation, and score rules.
- Add balance tests for expected route length, damage, resource availability, and win rate.
- Add automated visual smoke tests for desktop and mobile layouts.
- Add seeded fixtures for tutorial, ordinary, unlucky, and boss runs.
- Add replay tests that compare event streams, not only final screenshots.
- Add save migration tests when the world contract changes.
- Add a versioned seed format so future releases do not silently invalidate runs.
- Add CI checks for test, typecheck, build, mission validation, and smoke validation.
- Keep every implemented feature tied to a small contract, test, or evidence artifact.

## Greptile code review, reconciliation and acceptance — ERG tasks (24 October 2026)

These are uniquely designated **ERG-001–ERG-017** and do not renumber or change the earlier 1–9 Core Player Loop or existing roadmap items. Canonical review: [Eleven Realms draft PR #3](https://github.com/Parris-Tech-Services/Eleven-Realms/pull/3); [tracking issue #4](https://github.com/Parris-Tech-Services/Eleven-Realms/issues/4); [cross-repository Greptile tracker](https://github.com/Parris-Tech-Services/RepoClean/issues/1). Greptile run `34998453` **COMPLETED** 24 October 2026 with confidence **4/5**, posting [one P2 finding: missing seeded movement tests](https://github.com/Parris-Tech-Services/Eleven-Realms/pull/3#discussion_r4366695038). That finding is initially **unaddressed**. Main and the draft branch also conflict on `WorldState`, fog-of-war and relic progression; Greptile acknowledged those prior design conflicts rather than reporting them as new PR findings.

- [ ] **ERG-001** [P1] Audit the current `main` WorldState and draft PR #3 before merging; reconcile its code with the canonical authoritative changes without overwriting new gameplay, fog-of-war or quest logic.
- [ ] **ERG-002** [P1] Restore required `WorldState.discovered: boolean[][]` construction and `updateVisibility` handling in PR #3; validate fog-of-war initialization and movement after integration.
- [ ] **ERG-003** [P1] Reconcile `createWorld` signature, persisted `relicsFound`, `questCompleted` conditions and inter-realm state carry-over; guard against progress resetting or winning a realm incorrectly.
- [ ] **ERG-004** [P2] Add seeded movement tests for stepping onto hazards, health reduction, death/game-over and actions after death, as requested in Greptile's [review comment](https://github.com/Parris-Tech-Services/Eleven-Realms/pull/3#discussion_r4366695038).
- [ ] **ERG-005** [P2] Test collecting both relics, score rewards, non-duplication and quest completion using actual seeded moves, not just static entity placement.
- [ ] **ERG-006** [P2] Test enemy pursuit radius, alternate-tick movement, collisions and damage (including no out-of-bounds access) over representative deterministic seeds.
- [ ] **ERG-007** [P2] Test the locked gate consumes no turn, while an unlocked gate transitions correctly and preserves required health, score, inventory rules, fog and relic progress.
- [ ] **ERG-008** Add multi-seed/property-style checks that generated worlds have valid non-overlapping entity positions, reachable key and gate, a survivable route with hazards/enemies, and deterministic layouts.
- [ ] **ERG-009** Run `npm test`, `npm run typecheck`, `npm run build`, applicable mission validation and CI on the reconciled PR; record run URLs, failures, fixes and commit SHA.
- [ ] **ERG-010** Independently playtest a full seeded realm on desktop and mobile-sized browser: pickups, combat, damage/death, gate and next-level progression, UX/accessibility and save/restore if supported; attach reproducible evidence.
- [ ] **ERG-011** Trigger Greptile re-review **after** changes; inspect and address the P2 movement-test finding and any new comments, and mark threads addressed only with evidence.
- [ ] **ERG-012** Verify the persistent **Eleven Realms engineering standards** in Greptile are ACTIVE and appropriately scoped (rule `faba097b-1f19-4482-9578-a721eb8ce6d0`, together with universal correctness/security rules); observe their use in a follow-up PR review.
- [ ] **ERG-013** Search and verify the saved **procedural WorldState architecture pattern** `5ef310b8-4f2a-4cc6-8aa8-bd8ef1dcca71`, update stale assumptions after reconciliation and document how `createWorld`, `stepWorld`, RNG, save state and rendering connect.
- [ ] **ERG-014** Enable/publish a **native Greptile searchable knowledge base** for Eleven Realms and successfully query its indexed codebase; its public documentation index currently has no published documents.
- [ ] **ERG-015** Verify Greptile reviews are **automatically triggered** for a newly opened/updated Eleven Realms PR, with traceable inline suggestions and acceptable credits; do not equate manual review triggers with auto-coverage.
- [ ] **ERG-016** Capture Greptile repository-scoped analytics before/after repairs: reviews, severity, security issues, addressed/unaddressed findings and review comment history. Confirm the original P2 is resolved only after a verified fix.
- [ ] **ERG-017** Update [tracking issue #4](https://github.com/Parris-Tech-Services/Eleven-Realms/issues/4), [portfolio tracker](https://github.com/Parris-Tech-Services/RepoClean/issues/1) and any work checkpoint; record tested SHA, published build or deployment URL, interactive playtest evidence and unresolved blockers before closing.

**Evidence distinction:** The initial Greptile run, inline comment, saved instruction and architecture pattern and initial portfolio analytics were verified. None of these checklist items claims a fixed gameplay defect, passing build or production deployment.


## Recommended Delivery Phases

### Phase 1: Tactical Foundation

- Deterministic room generation.
- Real walls and collision.
- Keys and locked gates.
- Enemy intent and one enemy family.
- One player ability: dash or shield.
- Minimap and explored tiles.
- Tutorial onboarding.

### Phase 2: The First Complete Realm

- Three connected room types.
- One biome identity.
- Inventory and equipment.
- Two enemy families.
- One optional quest.
- One NPC or shrine.
- One boss with two readable phases.
- Run summary and restart flow.

### Phase 3: Replayable Expedition

- Multiple biomes and region rules.
- Procedural quests and secrets.
- Relic build combinations.
- Persistent unlocks.
- Save/load and shareable seeds.
- Daily challenge and achievements.
- Accessibility settings.

### Phase 4: Premium Indie Polish

- Audio direction and reactive music.
- Particles, lighting, transitions, and animation.
- Multiple endings and faction consequences.
- Replay export and ghost routes.
- Strong visual identity for all eleven realms.
- Public demo, telemetry-free balance review, and release-quality onboarding.

## Design Guardrails

- A new system must create a decision, discovery, or story consequence.
- Prefer visible rules over hidden math.
- Prefer a small number of expressive items over a large loot table.
- Avoid procedural noise that does not create meaningful route choices.
- Every hazard must have a readable warning or learnable tell.
- Every boss attack must be explainable from the board state.
- The player should understand defeat and know what to try next.
- New content must preserve deterministic replay for the same seed and ruleset.
- Do not add live-service pressure, energy timers, or monetization loops to the core game.

## Success Criteria

A strong first public demo should let a new player:

- understand movement within thirty seconds,
- reach a meaningful choice within two minutes,
- discover at least one secret or optional reward,
- understand why a mistake happened,
- complete or lose one compact realm in ten to fifteen minutes,
- replay the same seed and make a better decision,
- finish with a memorable image, rule, character, or unresolved mystery.
