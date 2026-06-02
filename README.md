# 🐚 Tiny Shells

A real-time 3D top-down tank combat game inspired by **Wii Play Tanks**, built with **React Three Fiber**, **p2.js physics**, and **Vite**. Drive tanks, aim with your mouse, and fire shells across a walled arena.

![Preview](/public/preview.gif)

---

## 🎮 Gameplay

- **Top-down 3D perspective** — an overhead camera looks down at a flat arena rendered in full 3D.
- **Wii Play Tanks-inspired** — navigate an enclosed arena, dodge enemy fire, and take out opponents with careful aim and positioning.
- **Player-controlled tank** — move and rotate using keyboard input; aim the turret with the mouse cursor.
- **Projectile combat** — fire kinematic shells that travel in a straight line from the barrel tip.
- **Physics-driven movement** — tank movement is force-based via `p2.js`, with configurable damping and angular ratios for a weighty, realistic feel.
- **Walled arena** — the default level is a rectangular arena bounded by static physics walls.
- **AI tanks** — enemy tanks spawn alongside the player (AI behavior is a work-in-progress).

---

## 🕹️ Controls

Controls are fully rebindable from the in-game **Controls** screen.

| Action         | Default Key |
| -------------- | ----------- |
| Move Forward   | `W`         |
| Move Backward  | `S`         |
| Turn Left      | `A`         |
| Turn Right     | `D`         |
| Fire Weapon    | `Space`     |
| Aim Turret     | Mouse       |

---

## 🖥️ UI & Menus

The game features a full HUD overlay system with multiple screens:

- **Main Menu** — title screen with Play, Controls, and Settings options.
- **Controls Screen** — rebind keys with a press-to-assign interface.
- **Settings Screen** — placeholder for volume, graphics quality, and sensitivity options.
- **Gameplay HUD** — top bar with tank count, game status, pause/resume, and return-to-menu buttons. The game can be paused at any time.

---

## 🧱 Tech Stack

| Layer        | Technology                                                                 |
| ------------ | -------------------------------------------------------------------------- |
| Rendering    | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) + [Three.js](https://threejs.org/) |
| Helpers      | [Drei](https://github.com/pmndrs/drei) (RoundedBox, Grid, KeyboardControls) |
| Physics      | [@react-three/p2](https://github.com/pmndrs/react-three-p2) (2D rigid body on XZ plane) |
| Debug UI     | [Leva](https://github.com/pmndrs/leva) (runtime parameter tuning)         |
| Styling      | [Tailwind CSS](https://tailwindcss.com/)                                   |
| Bundler      | [Vite](https://vitejs.dev/)                                                |
| Language     | TypeScript + JSX                                                           |

---

## 📂 Project Structure

```
tank_game/
├── public/
│   └── preview.gif            # Preview animation
├── src/
│   ├── index.jsx              # ReactDOM entry
│   ├── App.jsx                # Root component (providers + layout)
│   ├── styles.css             # Global styles & Tailwind
│   └── 3d/
│       ├── Environment.tsx    # R3F Canvas setup & camera
│       ├── Scene.tsx          # Lighting, physics world, keyboard bindings
│       ├── Game.tsx           # Gameplay coordinator (tanks + shells)
│       ├── ClampedClock.tsx   # Custom clock utility
│       ├── context/
│       │   ├── GameContext.tsx     # Game state (tanks, shells, pause, screens)
│       │   ├── PointerContext.tsx  # Mouse pointer tracking on game plane
│       │   └── ControlsContext.tsx # Rebindable keyboard controls
│       ├── entities/
│       │   ├── tank.tsx       # Tank: physics body, movement, turret aiming, shooting
│       │   └── shell.tsx      # Shell: kinematic projectile with velocity
│       ├── level/
│       │   ├── DefaultLevel.tsx    # Arena floor + boundary walls
│       │   └── components/
│       │       └── LevelWall.tsx   # Static wall with physics collider
│       └── components/
│           └── GameUI.jsx     # Full 2D overlay (menus, HUD, pause screen)
├── types/
│   ├── game.ts                # Game-level type definitions
│   ├── tank.ts                # TankEntity interface
│   ├── shell.ts               # ShellEntity interface
│   └── pointer.ts             # Pointer type definitions
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🏗️ Architecture

```
App.jsx
 └─ ControlsProvider          ← rebindable key config
    └─ GameProvider            ← tanks, shells, game state
       ├─ Environment.tsx      ← R3F <Canvas>
       │   └─ Scene.tsx        ← lights, physics, keyboard
       │       └─ Game.tsx     ← renders tanks, shells, level
       └─ GameUI.jsx           ← 2D menu/HUD overlay
```

### Physics Coordinate Mapping

The physics engine operates in 2D. The physics plane normal is set to the **Y-axis** (`normalIndex={1}`), which maps physics coordinates to the 3D scene as:

```
Physics [x, y]  →  3D Scene [x, z]
```

Gravity is set to `[0, 0]` (top-down, no gravity pull).

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)

### Installation

```bash
git clone https://github.com/TrueRihot/tank_game.git
cd tank_game
npm install
```

### Development

```bash
npm run dev
```

Opens a local dev server with hot-reload (accessible on your local network via `--host`).

### Production Build

```bash
npm run build
npm run preview    # preview the production build locally
```

---

## 🎛️ Runtime Debug Controls

With [Leva](https://github.com/pmndrs/leva) panels, you can tune the following at runtime:

- **Tank scale** — adjust the X, Y, Z dimensions of the tank body.
- **Movement force** — how much force is applied per frame when driving.
- **Linear / Angular damping** — controls how quickly tanks slow down.
- **Angular ratio** — multiplier for turning force.
- **Light position** — adjust the directional light in real time.

---

## 🗺️ Roadmap

- [ ] AI tank behavior (pathfinding, target selection)
- [ ] Health system & tank destruction
- [ ] Shell-to-tank collision detection & damage
- [ ] Shell bouncing off walls (like Wii Play!)
- [ ] Multiple levels / procedural arenas
- [ ] Sound effects & music
- [ ] Settings screen functionality (volume, graphics, sensitivity)
- [ ] Score tracking & game-over screen
- [ ] Power-ups & different shell types
