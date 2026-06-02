/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* ── Kinetic Strike palette ── */
        "ks-bg":             "#10141a",
        "ks-surface":        "#1c2026",
        "ks-surface-low":    "#181c22",
        "ks-surface-high":   "#262a31",
        "ks-surface-bright": "#353940",
        "ks-on-surface":     "#dfe2eb",
        "ks-on-variant":     "#b9caca",
        "ks-outline":        "#849494",
        "ks-outline-dim":    "#3a4a4a",

        "ks-primary":           "#efffff",
        "ks-primary-container": "#00f7ff",
        "ks-primary-dim":       "#00dce3",
        "ks-on-primary":        "#003739",

        "ks-secondary":           "#ecb1ff",
        "ks-secondary-container": "#d05bff",
        "ks-on-secondary":        "#520070",

        "ks-tertiary":           "#fffaff",
        "ks-tertiary-container": "#ffd5d8",
        "ks-on-tertiary":        "#67001f",

        "ks-error":     "#ffb4ab",
        "ks-error-bg":  "#93000a",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
      fontSize: {
        "display-lg":      ["64px", { lineHeight: "1.1",  letterSpacing: "-0.02em", fontWeight: "900" }],
        "display-lg-mob":  ["40px", { lineHeight: "1.1",  letterSpacing: "-0.02em", fontWeight: "900" }],
        "headline-md":     ["32px", { lineHeight: "1.2",  letterSpacing: "0.05em",  fontWeight: "700" }],
        "title-lg":        ["20px", { lineHeight: "1.4",  letterSpacing: "0.02em",  fontWeight: "600" }],
        "body-md":         ["16px", { lineHeight: "1.6",  letterSpacing: "0",       fontWeight: "400" }],
        "label-sm":        ["12px", { lineHeight: "1",    letterSpacing: "0.1em",   fontWeight: "700" }],
      },
      borderRadius: {
        sm:  "0.125rem",
        DEFAULT: "0.25rem",
        md:  "0.375rem",
        lg:  "0.5rem",
        xl:  "0.75rem",
      },
      spacing: {
        "hud-safe": "32px",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "scan": "scanline 8s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(0,247,255,0.4)" },
          "50%":      { boxShadow: "0 0 30px rgba(0,247,255,0.7)" },
        },
        scanline: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
    },
  },
  plugins: [],
};
