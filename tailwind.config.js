import catppuccin from "@catppuccin/tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{tsx,ts,jsx,js}", "./dist/**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [
    catppuccin({
      defaultFlavour: "mocha",
      prefix: "ctp",
    })
  ],
};