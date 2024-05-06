import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx,stories.tsx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx,stories.tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx,stories.tsx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx,stories.tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        slideDown: "slideDown 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
