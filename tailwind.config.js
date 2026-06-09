/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#070A12',
        surface: '#111625',
        surfaceBorder: '#1F293D',
        stitchPurple: {
          DEFAULT: '#4F46E5',
          light: '#6366F1',
        },
        electricBlue: {
          DEFAULT: '#06B6D4',
          glow: '#3B82F6',
        }
      },
      letterSpacing: {
        superWide: '0.2em',
      }
    },
  },
  plugins: [],
}
