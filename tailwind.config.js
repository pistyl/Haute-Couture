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
          light: '#4E3424',
          DEFAULT: '#2E1A0F',
          dark: '#1C0F08',
        },
        cream: {
          light: '#FFFBF7',
          DEFAULT: '#FFF6ED',
          dark: '#EADCC8',
        },
        brass: {
          light: '#E5C5A4',
          DEFAULT: '#D2A679',
          dark: '#8B5E3C',
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
