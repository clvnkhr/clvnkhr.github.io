const { catppuccin } = require("@catppuccin/tailwindcss");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,ts,jsx,js}", "./dist/**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [
    catppuccin({
      name: "catppuccin",
      defaultFlavour: "latte",
      autoPrefix: "ctp",
    })
  ],
  darkMode: 'class',
};
