/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'open-menu': {
          '0%': { transform: 'scaleX(0)' },
          '80%': { transform: 'scaleX(1.2)' },
          '100%': { transform: 'scaleX(1)' }
        },
        'dropdown': {
          '0%': { transform: 'scaleY(0)' },
          '80%': { transform: 'scaleY(1.2)' },
          '100%': { transform: 'scaleY(1)' }
        }
      },
      animation: {
        'open-menu': 'open-menu 0.5s ease-in-out forwards',
        'dropdown': 'dropdown 0.5s ease-out forwards'
      }
    },
    fontFamily: {
      Concert: ["Concert One", "sans-serif"]
    }
  },
  plugins: [],
}
