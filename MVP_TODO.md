# Tiny Shells — MVP Feature TODO

> A feature checklist for a minimum viable product inspired by **Wii Play Tanks**.
> Each section is self-contained and can be worked on independently unless noted.
> Tasks are ordered by dependency — work top-to-bottom within each section.

---

## Reference: Wii Play Tanks — Core Mechanics

The original game is a top-down arena shooter where:

- The player drives a tank around a walled arena and must destroy all enemy tanks to advance.
- One hit from any shell destroys any tank (player or enemy).
- Shells bounce off walls (1 bounce for standard shells).
- The player can have up to 5 active shells and 2 active mines on screen.
- Levels contain solid walls (indestructible) and cork walls (destructible via mines).
- Enemy tanks come in distinct types (color-coded), each with unique movement speed, firing behavior, and intelligence.
- The player earns an extra life every 5 levels completed.

---

## 1. Shell & Projectile System

The shell system is the backbone of gameplay. Currently shells fly in a straight line with no collision handling.

- [ ] **Shell lifetime / despawn** — Shells must despawn after a set duration or when leaving the arena bounds. Prevent infinite shell accumulation.
- [ ] **Shell-wall collision (bounce)** — Detect when a shell hits a wall and reflect its velocity. Standard shells bounce **once**, then despawn on the next wall hit.
- [ ] **Shell-tank collision** — Detect when a shell overlaps a tank body. On hit, destroy the target tank (trigger destruction sequence). This applies to both enemy and player tanks (friendly fire / self-hit included).
- [ ] **Shell-shell collision** — When two shells collide, both are destroyed.
- [ ] **Active shell limit** — The player can have at most **5 shells** alive at a time. Disable firing when the limit is reached.
- [ ] **Shell visual improvements** — Add a trail/particle effect behind moving shells for better readability.

---

## 2. Tank Destruction

Currently tanks cannot be destroyed.

- [ ] **Tank destruction trigger** — When a tank receives a shell hit, remove it from the game state.
- [ ] **Destruction animation** — Play a visual effect (explosion, particles, flash) when a tank is destroyed.
- [ ] **Player death handling** — When the player tank is destroyed, deduct a life and show a brief death screen / overlay before restarting or ending.

---

## 3. Lives & Game Over

There is no life or scoring system yet.

- [ ] **Life counter** — Track the player's remaining lives (start with 3). Display the life count in the HUD.
- [ ] **Extra life reward** — Grant +1 life every 5 levels completed.
- [ ] **Game over screen** — When lives reach 0, show a Game Over screen with the last level reached and a "Restart" / "Main Menu" button.

---

## 4. Level Progression

The game currently has a single static level with no win/lose condition.

- [ ] **Win condition** — A level is complete when all enemy tanks are destroyed. Detect this state and trigger a level transition.
- [ ] **Level transition** — After clearing a level, show a brief "Level Complete" overlay (e.g., 1–2 seconds), then load the next level.
- [ ] **Level counter** — Track and display the current level number in the HUD.
- [ ] **Level data format** — Define a JSON or TypeScript data structure for level definitions. Each level specifies:
  - Arena dimensions
  - Wall placements (position, size, type: solid or cork)
  - Enemy tank spawn positions and types
  - Player spawn position
- [ ] **Level loading** — Build a loader that reads a level definition and instantiates the arena, walls, and tanks accordingly.
- [ ] **Create 5–10 handcrafted levels** — Design a small set of progressively harder levels for the MVP campaign.

---

## 5. Wall Types & Obstacles

The current level has only boundary walls. Wii Tanks uses inner walls as cover and strategic elements.

- [ ] **Inner walls (indestructible)** — Place solid wall blocks inside the arena that shells bounce off of and tanks cannot pass through. Must have physics colliders.
- [ ] **Cork / destructible walls** — Add a second wall type that can be destroyed. These walls should:
  - Look visually distinct from solid walls (different color/material).
  - Be removed from the scene and physics world when destroyed.
  - Be destroyable by mine explosions (see Section 6) or a specific trigger.

---

## 6. Mines

Mines are a key tactical tool in Wii Tanks.

- [ ] **Mine placement** — The player can drop a mine at their current position (new key binding needed, e.g., `E` or right-click).
- [ ] **Active mine limit** — Maximum **2** active mines per player.
- [ ] **Mine detonation** — A mine explodes when:
  - An enemy tank drives over it.
  - It is hit by any shell.
  - The player manually triggers it (optional for MVP — can skip).
- [ ] **Mine explosion radius** — The explosion destroys all tanks within a configurable radius. Explosion damage passes through walls.
- [ ] **Mine visuals** — Render mines as a distinct object on the ground (small disk/marker). Add an explosion effect on detonation.
- [ ] **Cork wall destruction** — Mine explosions destroy adjacent cork/destructible walls within blast radius.

---

## 7. Enemy AI (Basic)

Currently enemy tanks exist but have no behavior.

- [ ] **AI movement — Brown tank (stationary)** — Does not move. Fires infrequently in the player's general direction. This is the simplest enemy and should be implemented first.
- [ ] **AI movement — Grey tank (random patrol)** — Moves randomly around the arena, avoiding walls. Fires at the player when line-of-sight is clear.
- [ ] **AI aiming** — Enemy tanks rotate their turret to face the player (or predicted player position for harder types). Use a simple line-of-sight check.
- [ ] **AI firing** — Enemy tanks fire shells at configurable intervals. Different types have different fire rates and accuracy.
- [ ] **AI wall avoidance** — Moving AI tanks must not drive into walls. Use simple raycasting or physics collision responses to steer around obstacles.
- [ ] **AI shell avoidance (optional for MVP)** — Advanced enemies attempt to dodge incoming shells. Can be deferred beyond MVP.

---

## 8. HUD Improvements

The HUD shows basic info but needs gameplay-relevant data.

- [ ] **Lives display** — Show remaining lives (e.g., small tank icons or a number).
- [ ] **Level display** — Show current level number.
- [ ] **Active shell count** — Show how many of the player's 5 shells are currently in flight.
- [ ] **Active mine count** — Show how many of the player's 2 mines are placed.
- [ ] **Enemy count** — Show how many enemy tanks remain in the current level.

---

## 9. Camera & Visual Polish

- [ ] **Fixed top-down camera** — Lock the camera to a true top-down (or slight isometric) view. Remove any free camera controls for gameplay mode.
- [ ] **Camera fits arena** — Auto-calculate camera position/zoom so the entire level is visible regardless of arena size.
- [ ] **Aiming reticle** — Render a visible crosshair/reticle at the mouse pointer position on the game plane.
- [ ] **Tank treads / movement feedback** — Add visual feedback when a tank is moving (e.g., tread marks, dust particles, or subtle tilt).

---

## 10. Audio (Optional for MVP)

Sound is not required for a playable MVP but significantly improves the experience.

- [ ] **Shell fire sound** — Play a sound when a shell is fired.
- [ ] **Shell bounce sound** — Play a sound when a shell bounces off a wall.
- [ ] **Explosion sound** — Play a sound on tank destruction or mine detonation.
- [ ] **Engine / movement sound** — Subtle engine hum while the player tank moves.
- [ ] **Level complete jingle** — Short sound on level clear.
- [ ] **Background music** — Optional ambient track during gameplay.

---

## 11. Shell Types

Different shell types add tactical variety. Each shell type is defined by a set of configurable attributes. The MVP should support at least 2–3 types; more can be added later.

### Shell Type Attribute Schema

Every shell type should be described by the following attributes:

| Attribute         | Type      | Description                                                                 |
| ----------------- | --------- | --------------------------------------------------------------------------- |
| `id`              | `string`  | Unique identifier (e.g., `"standard"`, `"rocket"`, `"ricochet"`)            |
| `speed`           | `number`  | Travel speed of the shell (units/sec)                                       |
| `bounceCount`     | `number`  | How many times the shell bounces off walls before despawning (0 = no bounce)|
| `damage`          | `number`  | Damage dealt on hit (1 = one-hit kill for standard tanks)                   |
| `lifetime`        | `number`  | Maximum time (seconds) before auto-despawn                                  |
| `size`            | `number`  | Collision radius / visual scale multiplier                                  |
| `color`           | `string`  | Primary color for the shell mesh and trail                                  |
| `trailEffect`     | `string`  | Type of trail visual (`"none"`, `"smoke"`, `"glow"`, `"fire"`)              |
| `explosionRadius` | `number`  | Splash damage radius on impact (0 = direct hit only)                        |
| `piercing`        | `boolean` | If true, shell passes through targets instead of being destroyed on hit     |

### Shell Types to Implement

- [ ] **Standard Shell** — The default shell. Moderate speed, bounces once off walls, no splash damage. This is what the player starts with.
  - `speed: 15, bounceCount: 1, damage: 1, lifetime: 3, explosionRadius: 0, piercing: false`
- [ ] **Rocket** — Fast, direct-fire projectile that does not bounce. Used by Teal-type enemy tanks.
  - `speed: 25, bounceCount: 0, damage: 1, lifetime: 2, explosionRadius: 0, piercing: false`
- [ ] **Ricochet Shell** — Slower shell that bounces multiple times. Used by Green-type enemy tanks. Great for hitting targets behind cover.
  - `speed: 12, bounceCount: 3, damage: 1, lifetime: 5, explosionRadius: 0, piercing: false`
- [ ] **Explosive Shell** — Deals splash damage on impact. Does not bounce. Useful against clustered enemies.
  - `speed: 10, bounceCount: 0, damage: 1, lifetime: 3, explosionRadius: 1.5, piercing: false`
- [ ] **Piercing Round** — Passes through the first target and can hit multiple tanks in a line. Does not bounce.
  - `speed: 20, bounceCount: 0, damage: 1, lifetime: 2, explosionRadius: 0, piercing: true`

### Implementation Tasks

- [ ] **Shell type data structure** — Define a `ShellType` interface/type with all attributes listed above. Store shell type definitions in a central registry (e.g., a `shellTypes.ts` config file).
- [ ] **Assign shell type on spawn** — When `spawnShell` is called, accept a shell type ID. The shell entity should carry its type and read attributes from the registry.
- [ ] **Bounce count logic** — Replace the current fixed bounce behavior with a counter that decrements per bounce, driven by `shellType.bounceCount`.
- [ ] **Speed from type** — Use `shellType.speed` instead of a hardcoded `baseSpeed` value.
- [ ] **Splash damage** — If `explosionRadius > 0`, on impact check for all tanks within radius and destroy them. Show an explosion visual.
- [ ] **Piercing behavior** — If `piercing: true`, do not destroy the shell on first tank hit. Continue travel and check for additional hits.
- [ ] **Visual per type** — Each shell type renders with its own `color` and `trailEffect`. Different trail effects should be visually distinguishable.
- [ ] **Enemy tank → shell type mapping** — Each enemy AI type should fire a specific shell type (e.g., Brown/Grey fire Standard, Teal fires Rocket, Green fires Ricochet).
- [ ] **Player shell type selection (post-MVP)** — Allow the player to switch between unlocked shell types. Not required for MVP but the architecture should support it.

---

## MVP Definition of Done

The game is considered MVP-complete when a player can:

1. Start from the main menu and enter gameplay.
2. Control their tank (move, aim, shoot) in a walled arena with inner obstacles.
3. Destroy enemy tanks that shoot back with basic AI behavior.
4. Be destroyed by enemy shells (one-hit kill).
5. Clear a level by destroying all enemies and automatically advance to the next.
6. Progress through at least 5 levels of increasing difficulty.
7. Lose lives and see a Game Over screen when all lives are spent.
8. See relevant HUD info (lives, level, enemies remaining).

Mines, cork walls, and audio are valuable but can be deferred to a post-MVP milestone if needed.
