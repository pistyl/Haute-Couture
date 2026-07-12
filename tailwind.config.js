/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        charcoal: {
          light: '#262626',
          DEFAULT: '#1c1c1c',
          dark: '#111111',
        },
        cream: {
          light: '#fdfcf7',
          DEFAULT: '#fcfaf2', // sand cream
          dark: '#ebdcb9',
        },
        brass: {
          light: '#ffd700',
          DEFAULT: '#d4af37', // golden thread
          dark: '#b59023',
        },
        terracotta: {
          light: '#e07a5f',
          DEFAULT: '#c85a32', // latérite soil
          dark: '#a8441e',
        },
        thioup: {
          light: '#2b4f7c',
          DEFAULT: '#183152', // deep indigo thioup dye
          dark: '#0d1f38',
        },
        vertSenegal: {
          light: '#00b36b',
          DEFAULT: '#008751',
          dark: '#005e38',
        },
        rougeSenegal: {
          light: '#ff4d52',
          DEFAULT: '#e31b23',
          dark: '#ad0b11',
        }
      }
    },
  },
  plugins: [],
}
