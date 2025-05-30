/** @type {import('tailwindcss').Config} */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        // ... existing colors ...
      },
    },
  },
  plugins: [],
};

export default config; 