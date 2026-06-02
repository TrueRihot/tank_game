# Tiny Shells — AI Agent Memory

> **Purpose**: This document is a self-contained knowledge base for any AI agent working on this codebase. It captures the project's identity, architecture, every file's role, all type interfaces, physics conventions, UI design system, current state, known issues, and planned work. Read this before touching any code.

---

## 1. Project Identity

- **Name**: Tiny Shells
- **Repository**: `github:TrueRihot/tank_game`
- **Author**: TrueRihot
- **Inspiration**: Wii Play Tanks — a top-down arena shooter where the player destroys all enemy tanks per level, shells bounce off walls, and enemy types are color-coded with distinct AI behaviors.
- **Current Status**: Early development. Core rendering, physics, player movement, turret aiming, and shell spawning work. No collision detection, no AI behavior, no level progression, no win/lose conditions.
- **License**: None (previously MIT, removed intentionally).

---

## 2. Tech Stack & Versions

| Dependency              | Version   | Role                                       |
| ----------------------- | --------- | ------------------------------------------ |
| React                   | 19.2.6    | UI framework                               |
| React DOM               | 19.2.6    | DOM rendering                              |
| Three.js                | 0.184.0   | 3D engine                                  |
| @react-three/fiber      | 9.6.1     | React renderer for Three.js                |
| @react-three/drei       | 10.7.7    | R3F helpers (RoundedBox, Grid, OrbitControls, KeyboardControls, Stats, Box) |
| @react-three/p2         | 0.0.6     | 2D physics via p2.js in a web worker       |
| Leva                    | 0.10.1    | Runtime debug GUI panels                   |
| Vite                    | 8.0.13    | Bundler & dev server                       |
| @vitejs/plugin-react    | 6.0.2     | Vite React plugin                          |
| Tailwind CSS            | 4.3.0     | Utility-first CSS framework                |
| TypeScript types        | @types/react 19.2.15 | Type definitions                |

### Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Start Vite dev server with `--host`|
| `npm run build`    | Production build                   |
| `npm run preview`  | Preview production build           |
| `npm run sandbox`  | CodeSandbox mode (custom HMR port) |

### Path Alias

- `@src` → `./src` (configured in `vite.config.js`)

---

## 3. File Map & Responsibilities

```
tank_game/
├── index.html                         # HTML entry. Loads Outfit + Material Symbols fonts.
├── package.json                       # Project metadata & dependencies.
├── vite.config.js                     # Vite config. @src alias. CodeSandbox HMR support.
├── tailwind.config.js                 # Tailwind v4 config with "Kinetic Strike" design tokens.
├── .cursorrules                       # AI agent rules for physics hook patterns.
├── MVP_TODO.md                        # Feature roadmap for MVP (11 sections).
├── README.md                          # Project description, controls, architecture.
├── AI_MEMORY.md                       # THIS FILE.
├── public/
│   └── preview.gif                    # GIF preview for README.
├── types/
│   ├── game.ts                        # GameContextType interface.
│   ├── tank.ts                        # TankEntity interface.
│   ├── shell.ts                       # ShellEntity interface.
│   └── pointer.ts                     # PointerContextType interface.
├── src/
│   ├── index.jsx                      # ReactDOM.createRoot, renders <App>.
│   ├── App.jsx                        # Root component. Wraps ControlsProvider > GameProvider > Environment + GameUI.
│   ├── styles.css                     # Global CSS. Tailwind directives. HUD grid, neon glows, glassmorphism, scanline, skew utilities.
│   └── 3d/
│       ├── Environment.tsx            # <Canvas> setup. Camera fov=70 position=[0,9,5]. OrbitControls. Leva panel. Stats overlay. ClampedClock.
│       ├── ClampedClock.tsx           # Clamps Three.js clock delta to max 1/30s. Prevents physics explosions on tab refocus. Runs at priority -100.
│       ├── Scene.tsx                  # Lighting (directional + ambient). Infinite grid. Physics provider (normalIndex=1, gravity=[0,0]). KeyboardControls with dynamic rebindable map. Debug overlay.
│       ├── Game.tsx                   # Gameplay coordinator. Renders DefaultLevel, maps tanks[] and shells[] from context to <Tank> and <Shell> components. Tracks pointer position on game plane.
│       ├── context/
│       │   ├── GameContext.tsx        # Central game state. Tanks array, shells array, paused flag, active screen (menu|game|controls|settings). Exposes: spawnShell, removeShell, addTank, removeTank, startGame, pauseGame, resumeGame, returnToMenu. Extended interface wraps base GameContextType.
│       │   ├── PointerContext.tsx     # Tracks mouse pointer as Vector3 on the 3D game plane. Updated via onPointerMove in Game.tsx.
│       │   └── ControlsContext.tsx    # Rebindable keyboard controls. Persists to localStorage under key "tank_game_controls". Defaults: W/A/S/D + Space. Exposes: bindings, setBinding, resetDefaults. Hook: useControls_().
│       ├── entities/
│       │   ├── tank.tsx              # Tank component. Physics: useBox, mass=10, angularDamping=0.98, linearDamping=0.98. Player input via useKeyboardControls. Force-based movement with configurable force/damping/angularRatio via Leva. Turret aims at pointer via lookAt(). Fires shells from barrel tip with reload cooldown (default 1000ms). Base scale: [0.47, 0.22, 0.52]. Visual: RoundedBox body + RoundedBox turret (blue) + Box barrel (red).
│       │   └── shell.tsx             # Shell component. Physics: useBox, type="Kinematic", isTrigger=true, args=[0.1,0.1]. Velocity set once in useEffect: direction * baseSpeed * 15. Visual: RoundedBox [0.1, 0.1, 0.2] colored red. No collision handling. No lifetime/despawn. No bounce.
│       ├── level/
│       │   ├── DefaultLevel.tsx      # Arena floor: Box [20, 0.25, 10] grey. 4 boundary walls (top, bottom, left, right) using LevelWall. No inner obstacles.
│       │   └── components/
│       │       └── LevelWall.tsx     # Static physics wall. useBox with mass=0, type="Static". Renders grey Box at given position/scale.
│       └── components/
│           └── GameUI.jsx            # Full 2D HUD overlay system (324 lines). Contains:
│                                     #   - GlowButton: Reusable button with 4 variants (primary/secondary/ghost/danger). Skewed Fortnite-style.
│                                     #   - SectionTitle: Cyan glowing h2.
│                                     #   - HudChip: Small info pill with accent border.
│                                     #   - MainMenu: Title "Tiny Shells", subtitle "Inspired by Wii Play Tanks", Play/Controls/Settings buttons, decorative rings, footer "v1.0 · Tiny Shells Engine".
│                                     #   - ControlsScreen: Rebindable key display. Press-to-assign. Reset to defaults.
│                                     #   - SettingsScreen: Placeholder (Volume, Graphics, Sensitivity — all "Coming Soon").
│                                     #   - GameplayHUD: Top bar with tank count, pause status, pause/home buttons. Pause overlay with Resume/Main Menu. Bottom-left player info chip.
│                                     #   - GameUI (root): Switches screens based on activeScreen state.
```

---

## 4. Type Interfaces

### TankEntity (`types/tank.ts`)
```typescript
interface TankEntity {
  id: string;              // Unique identifier (e.g., "player-1", "ai-1")
  position: Duplet;        // [x, z] spawn position on physics plane
  color: string;           // Hex color string for tank body
  isPlayer: boolean;       // true = keyboard-controlled, false = AI (not yet implemented)
  pointerPosition?: Vector3; // Passed to player tank for turret aiming
  reloadCooldown?: number;  // Milliseconds between shots (default: 1000)
}
```

### ShellEntity (`types/shell.ts`)
```typescript
interface ShellEntity {
  id: string;              // nanoid-generated unique ID
  position: Duplet;        // [x, z] spawn position (barrel tip world position)
  direction: Duplet;       // [dx, dz] normalized direction vector
  baseSpeed?: number;      // Speed multiplier (default: 1, actual velocity = baseSpeed * 15)
}
```

### GameContextType (`types/game.ts`)
```typescript
interface GameContextType {
  tanks: TankEntity[];
  shells: ShellEntity[];
  spawnShell: (origin: Duplet, direction: Duplet) => void;
  removeShell: (id: string) => void;
  addTank: (tank: TankEntity) => void;
  removeTank: (id: string) => void;
  paused?: boolean;
  level: Levels;           // Currently only "Default"
}
```

### ExtendedGameContextType (`src/3d/context/GameContext.tsx`)
Extends `GameContextType` with:
```typescript
activeScreen: Screen;      // "menu" | "game" | "controls" | "settings"
setActiveScreen: (screen: Screen) => void;
startGame: () => void;     // Sets paused=false, screen="game"
pauseGame: () => void;     // Sets paused=true
resumeGame: () => void;    // Sets paused=false, screen="game"
returnToMenu: () => void;  // Sets paused=true, screen="menu"
```

### PointerContextType (`types/pointer.ts`)
```typescript
interface PointerContextType {
  pointer: Vector3;
  setPointer: (v: Vector3) => void;
}
```

### ControlBindings (`src/3d/context/ControlsContext.tsx`)
```typescript
interface ControlBindings {
  forward: string;   // default: "w"
  backward: string;  // default: "s"
  left: string;      // default: "a"
  right: string;     // default: "d"
  shoot: string;     // default: "Space"
}
```

---

## 5. Physics Rules (Critical)

### Coordinate Mapping
- Physics engine is 2D (`p2.js`), rendered in a 3D scene.
- `normalIndex={1}` in the Physics provider means the Y-axis is the plane normal.
- **Mapping**: Physics `[x, y]` → 3D Scene `[x, z]`. Y in 3D is always 0 (or a small offset for visual height).
- Gravity: `[0, 0]` — top-down, no gravitational pull.

### Hook Pattern (MUST follow)
```typescript
const [ref, api] = useBox(() => ({
  mass: 10,
  position: [x, z],  // 2D physics coords
  args: [width, depth],
}), null, []);  // null fwdRef, empty deps array
```
- **Always pass `null`** as the second argument (fwdRef).
- **Always pass `[]`** (or appropriate deps) as the third argument.
- **If deps are omitted**: The physics body is destroyed and re-created every frame → catastrophic performance loss.

### Current Physics Bodies
| Entity       | Type       | Mass | Args            | Material ID |
| ------------ | ---------- | ---- | --------------- | ----------- |
| Tank         | Dynamic    | 10   | [0.47, 0.52]    | 5000        |
| Shell        | Kinematic  | —    | [0.1, 0.1]      | 4000        |
| LevelWall    | Static     | 0    | [scale.x, scale.z] | —       |

### Physics Debug
- `<Debug color='red' scale={1.1} linewidth={1} normalIndex={1} />` renders physics body outlines in the scene.

---

## 6. Component Hierarchy

```
<ControlsProvider>                    ← Rebindable keys, persisted to localStorage
  <GameProvider>                      ← Tanks[], shells[], game state, screen routing
    <div>
      <Environment>                   ← R3F <Canvas>
        <ClampedClock />              ← Delta clamping (priority -100)
        <OrbitControls />             ← Camera orbit (dev mode, should be locked for gameplay)
        <Scene>
          <PointerProvider>           ← Mouse position on game plane
            <Grid />                  ← Infinite reference grid
            <directionalLight />
            <ambientLight />
            <Physics>                 ← p2.js physics world
              <KeyboardControls>      ← Maps key bindings → named actions
                <Debug />             ← Physics wireframe overlay
                <Game>                ← Gameplay coordinator
                  <DefaultLevel>      ← Floor + 4 boundary walls
                    <LevelWall /> ×4
                  </DefaultLevel>
                  <Tank /> ×N         ← One per tanks[] entry
                  <Shell /> ×N        ← One per shells[] entry
                </Game>
              </KeyboardControls>
            </Physics>
          </PointerProvider>
        </Scene>
      </Environment>
      <GameUI />                      ← 2D overlay (menus, HUD, pause)
    </div>
  </GameProvider>
</ControlsProvider>
```

---

## 7. Default Game State

On app load, `GameContext` initializes with:

```typescript
tanks: [
  { id: "player-1", position: [0, 0], color: "#00f7ff", isPlayer: true },
  { id: "ai-1",     position: [5, 3], color: "#d05bff", isPlayer: false },
]
shells: []
paused: false
activeScreen: "menu"
level: "Default"
```

The arena (DefaultLevel) is 20×10 units with 4 boundary walls.

---

## 8. Design System ("Kinetic Strike" Theme)

### Color Palette
| Token                    | Hex       | Usage                        |
| ------------------------ | --------- | ---------------------------- |
| `ks-bg`                  | `#10141a` | Background                   |
| `ks-surface`             | `#1c2026` | Card/panel backgrounds       |
| `ks-on-surface`          | `#dfe2eb` | Primary text                 |
| `ks-on-variant`          | `#b9caca` | Secondary text               |
| `ks-outline`             | `#849494` | Muted labels                 |
| `ks-outline-dim`         | `#3a4a4a` | Borders                      |
| `ks-primary-container`   | `#00f7ff` | Cyan accent (primary buttons, glows) |
| `ks-secondary-container` | `#d05bff` | Purple accent (secondary buttons)    |
| `ks-error`               | `#ffb4ab` | Error text                   |
| Error accent             | `#ff2e63` | Danger buttons, alerts       |

### Typography
- **Font**: Outfit (Google Fonts), weights 400–900.
- **Icon font**: Material Symbols Outlined.
- Sizes: `display-lg` (64px), `display-lg-mob` (40px), `headline-md` (32px), `title-lg` (20px), `body-md` (16px), `label-sm` (12px).

### UI Utilities (CSS)
- `.hud-grid` — subtle cyan grid background.
- `.glass-panel` — glassmorphism: `rgba(16,20,26,0.65)` + `blur(20px)` + cyan border.
- `.neon-glow-primary/secondary/error` — box-shadow glows.
- `.text-glow-primary/secondary` — text-shadow glows.
- `.skew-slant` / `.skew-slant-inner` — Fortnite-style skewed buttons (±8deg).
- `.scanline-overlay` — animated scanline pseudo-element.
- `animate-pulse-glow` — pulsing cyan glow keyframe.

### GlowButton Variants
| Variant     | Style                                     |
| ----------- | ----------------------------------------- |
| `primary`   | Cyan bg, dark text, cyan glow on hover    |
| `secondary` | Transparent, purple border, purple glow   |
| `ghost`     | Dark bg, dim border, cyan border on hover |
| `danger`    | Transparent, red border, red glow         |

---

## 9. Tank Movement & Shooting Details

### Movement (Player Only)
- Force-based: `api.applyLocalForce([force, 0], contactPoint)` applied to left/right propellant positions.
- Forward/backward: equal force on both sides.
- Left/right turning: opposing forces on each side (differential steering).
- Damping values (Leva-tunable): `linearDamping=0.98`, `angularDamping=0.98`.
- Force magnitude (Leva-tunable): default `11`.
- Angular ratio (Leva-tunable): default `1`.

### Turret Aiming (Player Only)
- `turretRef.current.lookAt(pointerPosition)` every frame.
- Pointer position updated via `onPointerMove` on the level group in `Game.tsx`.

### Shooting
- Fires from `barrelTipRef` world position.
- Direction: normalized vector from barrel tip to pointer.
- Shell spawned via `spawnShell([x, z], [dx, dz])` which creates a new `ShellEntity` with `nanoid()` ID.
- Reload cooldown: `reloadCooldown` prop (default 1000ms), tracked via `lastShotTime` state.

### AI Tanks
- Currently rendered but have **zero behavior**. No movement, no aiming, no firing. They exist as static physics bodies at their spawn position.

---

## 10. Known Issues & Debug Artifacts

- **Console logging everywhere**: `tank.tsx` logs physics position and velocity every frame via subscriptions. `Game.tsx` logs shells on change. `tank.tsx` logs "Tank component mounted/rendered" on every render. These should be removed or gated behind a debug flag.
- **OrbitControls in gameplay**: The camera can be freely orbited during gameplay. For the final game, camera should be locked to a top-down view.
- **Leva panel always visible**: `<Leva hidden={false}>` — debug panels show in production.
- **Stats overlay always visible**: `<Stats />` FPS counter always renders.
- **Shells never despawn**: No lifetime, no collision, no bounds checking. Shells accumulate infinitely.
- **No collision detection at all**: Shells pass through tanks and walls. Shell physics body is `isTrigger: true` but no collision event handlers are registered.
- **Physics debug overlay always on**: Red wireframes render over all physics bodies.

---

## 11. Planned Work

The full MVP feature roadmap is documented in `MVP_TODO.md` with 11 sections:

1. Shell & Projectile System (bounce, collisions, limits, despawn)
2. Tank Destruction (one-hit kill, explosion effects)
3. Lives & Game Over (life counter, extra lives, game over screen)
4. Level Progression (win condition, transitions, level data format, handcrafted levels)
5. Wall Types & Obstacles (inner walls, cork/destructible walls)
6. Mines (placement, detonation, blast radius)
7. Enemy AI (Brown stationary, Grey patrol, aiming, firing, wall avoidance)
8. HUD Improvements (lives, level, shell/mine counts, enemy count)
9. Camera & Visual Polish (fixed top-down, auto-fit, reticle, tread marks)
10. Audio (fire, bounce, explosion, engine, music)
11. Shell Types (Standard, Rocket, Ricochet, Explosive, Piercing — each with configurable speed, bounceCount, damage, lifetime, size, color, trailEffect, explosionRadius, piercing)

---

## 12. Conventions for AI Agents

1. **Physics hooks**: Always use the `(fn, null, [])` pattern. Never omit the deps array.
2. **Coordinates**: All physics positions are `[x, z]` (2D). 3D positions are `[x, 0, z]` or `[x, height, z]`.
3. **State management**: All game state flows through `GameContext`. Do not introduce separate global stores.
4. **Entity pattern**: Entities are data objects in context arrays, mapped to React components in `Game.tsx`.
5. **ID generation**: Use `nanoid()` for runtime entity IDs.
6. **Styling**: Use Tailwind classes with the `ks-*` design tokens. Custom utilities go in `styles.css` `@layer utilities`.
7. **UI components**: Reuse `GlowButton`, `SectionTitle`, `HudChip` from `GameUI.jsx`.
8. **Types**: Define entity interfaces in `types/` directory. Import `Duplet` from `@react-three/p2` for 2D coordinate tuples.
9. **Debug controls**: Use Leva `useControls()` for runtime-tunable parameters during development.
10. **File naming**: Components use PascalCase filenames. Entity files use lowercase.
