/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Support explicit du dark mode via class
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        background: {
          light: 'var(--bg-primary)',
          dark: 'var(--bg-primary)', // Sera géré par index.css
        }
      }
    },
  },
  plugins: [],
}
