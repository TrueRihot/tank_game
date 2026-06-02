import React, { useState, useEffect, useCallback } from "react";
import { useGame } from "../context/GameContext";
import { useControls_ } from "../context/ControlsContext";

/* ═══════════════════════════════════════════
   Shared sub-components
   ═══════════════════════════════════════════ */

const GlowButton = ({ children, onClick, variant = "primary", className = "" }) => {
  const base =
    "relative font-outfit font-bold uppercase tracking-[0.12em] px-8 py-3 transition-all duration-200 cursor-pointer select-none text-sm";

  const variants = {
    primary:
      "bg-[#00f7ff] text-[#003739] hover:shadow-[0_0_30px_rgba(0,247,255,0.6)] active:scale-95 skew-slant",
    secondary:
      "bg-transparent border-2 border-[#d05bff] text-[#ecb1ff] hover:shadow-[0_0_25px_rgba(208,91,255,0.5)] hover:bg-[#d05bff]/10 active:scale-95 skew-slant",
    ghost:
      "bg-[#1c2026]/60 border border-[#3a4a4a] text-[#b9caca] hover:border-[#00f7ff]/40 hover:text-[#dfe2eb] active:scale-95 skew-slant",
    danger:
      "bg-transparent border-2 border-[#ff2e63] text-[#ffb2ba] hover:shadow-[0_0_25px_rgba(255,46,99,0.5)] hover:bg-[#ff2e63]/10 active:scale-95 skew-slant",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} onClick={onClick}>
      <span className="skew-slant-inner inline-block">{children}</span>
    </button>
  );
};

const SectionTitle = ({ children }) => (
  <h2 className="font-outfit text-headline-md uppercase tracking-[0.08em] text-[#00f7ff] text-glow-primary mb-6">
    {children}
  </h2>
);

const HudChip = ({ label, value, accent = "cyan" }) => {
  const accentColors = {
    cyan: "border-l-[#00f7ff]",
    purple: "border-l-[#d05bff]",
    red: "border-l-[#ff2e63]",
  };
  return (
    <div
      className={`glass-panel px-4 py-2 border-l-4 ${accentColors[accent]} flex items-center gap-3 min-w-[140px]`}
    >
      <span className="text-label-sm uppercase tracking-widest text-[#849494] font-outfit">
        {label}
      </span>
      <span className="text-body-md font-outfit font-semibold text-[#dfe2eb]">{value}</span>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN MENU SCREEN
   ═══════════════════════════════════════════ */

const MainMenu = () => {
  const { startGame, setActiveScreen } = useGame();

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center hud-grid scanline-overlay overflow-hidden">
      {/* Decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#00f7ff]/10 rounded-full animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-t-2 border-b-2 border-[#d05bff]/15 rounded-full rotate-45 pointer-events-none" style={{ animation: "spin 20s linear infinite" }} />

      {/* Logo area */}
      <div className="relative z-10 flex flex-col items-center gap-2 mb-12">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#00f7ff] text-5xl text-glow-primary">
            shield
          </span>
          <h1 className="font-outfit text-display-lg-mob md:text-display-lg uppercase text-[#efffff] text-glow-primary">
            Tiny Shells
          </h1>
        </div>
        <p className="font-outfit text-label-sm uppercase tracking-[0.3em] text-[#849494]">
          Inspired by Wii Play Tanks
        </p>
      </div>

      {/* Menu buttons */}
      <div className="relative z-10 flex flex-col gap-4 w-72">
        <GlowButton onClick={startGame} variant="primary" className="animate-pulse-glow">
          Play Game
        </GlowButton>
        <GlowButton onClick={() => setActiveScreen("controls")} variant="secondary">
          Controls
        </GlowButton>
        <GlowButton onClick={() => setActiveScreen("settings")} variant="ghost">
          Settings
        </GlowButton>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 font-outfit text-label-sm text-[#3a4a4a] uppercase tracking-widest">
        v1.0 · Tiny Shells Engine
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   CONTROLS SCREEN
   ═══════════════════════════════════════════ */

const ControlsScreen = () => {
  const { setActiveScreen } = useGame();
  const { bindings, setBinding, resetDefaults } = useControls_();
  const [listeningFor, setListeningFor] = useState(null);

  const handleKeyCapture = useCallback(
    (e) => {
      if (!listeningFor) return;
      e.preventDefault();
      const key = e.key === " " ? "Space" : e.key.length === 1 ? e.key.toLowerCase() : e.key;
      setBinding(listeningFor, key);
      setListeningFor(null);
    },
    [listeningFor, setBinding]
  );

  useEffect(() => {
    if (listeningFor) {
      window.addEventListener("keydown", handleKeyCapture);
      return () => window.removeEventListener("keydown", handleKeyCapture);
    }
  }, [listeningFor, handleKeyCapture]);

  const actions = [
    { key: "forward", label: "Move Forward", icon: "arrow_upward" },
    { key: "backward", label: "Move Backward", icon: "arrow_downward" },
    { key: "left", label: "Turn Left", icon: "arrow_back" },
    { key: "right", label: "Turn Right", icon: "arrow_forward" },
    { key: "shoot", label: "Fire Weapon", icon: "rocket_launch" },
  ];

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center hud-grid overflow-hidden">
      <div className="glass-panel rounded-lg p-8 w-full max-w-lg">
        <SectionTitle>Controls</SectionTitle>

        <div className="flex flex-col gap-3 mb-8">
          {actions.map((action) => (
            <div
              key={action.key}
              className="flex items-center justify-between bg-[#0a0e14]/60 border border-[#3a4a4a] rounded px-4 py-3 hover:border-[#00f7ff]/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#00f7ff] text-xl">
                  {action.icon}
                </span>
                <span className="font-outfit text-body-md text-[#dfe2eb]">{action.label}</span>
              </div>
              <button
                onClick={() => setListeningFor(action.key)}
                className={`font-outfit font-bold text-sm uppercase px-4 py-1.5 rounded border transition-all cursor-pointer ${
                  listeningFor === action.key
                    ? "border-[#00f7ff] text-[#00f7ff] bg-[#00f7ff]/10 animate-pulse neon-glow-primary"
                    : "border-[#3a4a4a] text-[#b9caca] hover:border-[#849494] hover:text-[#dfe2eb]"
                }`}
              >
                {listeningFor === action.key
                  ? "Press key..."
                  : bindings[action.key] === " "
                  ? "Space"
                  : bindings[action.key].toUpperCase()}
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end">
          <GlowButton onClick={resetDefaults} variant="danger">
            Reset
          </GlowButton>
          <GlowButton onClick={() => setActiveScreen("menu")} variant="ghost">
            Back
          </GlowButton>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   SETTINGS SCREEN
   ═══════════════════════════════════════════ */

const SettingsScreen = () => {
  const { setActiveScreen } = useGame();

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center hud-grid overflow-hidden">
      <div className="glass-panel rounded-lg p-8 w-full max-w-lg">
        <SectionTitle>Settings</SectionTitle>

        <div className="flex flex-col gap-4 mb-8">
          {/* Volume placeholder */}
          <div className="flex items-center justify-between bg-[#0a0e14]/60 border border-[#3a4a4a] rounded px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#d05bff] text-xl">volume_up</span>
              <span className="font-outfit text-body-md text-[#dfe2eb]">Master Volume</span>
            </div>
            <span className="font-outfit text-label-sm text-[#849494]">Coming Soon</span>
          </div>

          {/* Graphics placeholder */}
          <div className="flex items-center justify-between bg-[#0a0e14]/60 border border-[#3a4a4a] rounded px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#d05bff] text-xl">
                display_settings
              </span>
              <span className="font-outfit text-body-md text-[#dfe2eb]">Graphics Quality</span>
            </div>
            <span className="font-outfit text-label-sm text-[#849494]">Coming Soon</span>
          </div>

          {/* Sensitivity placeholder */}
          <div className="flex items-center justify-between bg-[#0a0e14]/60 border border-[#3a4a4a] rounded px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#d05bff] text-xl">mouse</span>
              <span className="font-outfit text-body-md text-[#dfe2eb]">Mouse Sensitivity</span>
            </div>
            <span className="font-outfit text-label-sm text-[#849494]">Coming Soon</span>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <GlowButton onClick={() => setActiveScreen("menu")} variant="ghost">
            Back
          </GlowButton>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   GAMEPLAY HUD
   ═══════════════════════════════════════════ */

const GameplayHUD = () => {
  const { tanks, paused, pauseGame, resumeGame, returnToMenu } = useGame();

  const playerTank = tanks.find((t) => t.isPlayer);

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3 bg-[#10141a]/50 backdrop-blur-md border-b border-[#00f7ff]/10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#00f7ff] text-2xl">shield</span>
          <span className="font-outfit text-title-lg uppercase tracking-[0.15em] text-[#efffff]">
            Tiny Shells
          </span>
        </div>

        <div className="flex items-center gap-4">
          <HudChip label="Tanks" value={tanks.length} accent="cyan" />
          <HudChip label="Status" value={paused ? "Paused" : "Active"} accent={paused ? "red" : "cyan"} />

          <button
            onClick={paused ? resumeGame : pauseGame}
            className="material-symbols-outlined text-[#b9caca] hover:text-[#00f7ff] text-2xl transition-colors cursor-pointer"
          >
            {paused ? "play_arrow" : "pause"}
          </button>
          <button
            onClick={returnToMenu}
            className="material-symbols-outlined text-[#b9caca] hover:text-[#ff2e63] text-2xl transition-colors cursor-pointer"
          >
            home
          </button>
        </div>
      </div>

      {/* Pause overlay */}
      {paused && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#10141a]/70 backdrop-blur-sm">
          <h2 className="font-outfit text-display-lg-mob uppercase text-[#00f7ff] text-glow-primary mb-8">
            Paused
          </h2>
          <div className="flex flex-col gap-3 w-60">
            <GlowButton onClick={resumeGame} variant="primary">
              Resume
            </GlowButton>
            <GlowButton onClick={returnToMenu} variant="ghost">
              Main Menu
            </GlowButton>
          </div>
        </div>
      )}

      {/* Bottom-left player info */}
      {playerTank && !paused && (
        <div className="absolute bottom-6 left-6 z-40 flex items-center gap-3">
          <HudChip label="Player" value={playerTank.id} accent="cyan" />
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════
   ROOT GAME UI
   ═══════════════════════════════════════════ */

const GameUI = () => {
  const { activeScreen } = useGame();

  return (
    <>
      {activeScreen === "menu" && <MainMenu />}
      {activeScreen === "controls" && <ControlsScreen />}
      {activeScreen === "settings" && <SettingsScreen />}
      {activeScreen === "game" && <GameplayHUD />}
    </>
  );
};

export default GameUI;
