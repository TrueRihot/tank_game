/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      "picton-blue": {
        50: "#f1f8fe",
        100: "#e3effb",
        200: "#c0e0f7",
        300: "#88c7f1",
        400: "#3da5e6",
        500: "#2190d6",
        600: "#1372b6",
        700: "#115b93",
        800: "#124e7a",
        900: "#144266",
        950: "#0e2a43",
      },
    },
  },
  plugins: [],
};
