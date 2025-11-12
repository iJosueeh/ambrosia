import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'ambrosia-green': '#00B37E',
      },
      fontFamily: {
        caligrafia: ['"Dancing Script"', 'cursive'], 
      },
    },
  },
  plugins: [
    typography,
    function ({ addUtilities }) {
      const newUtilities = {
        '.overflow-x-hidden': {
          'overflow-x': 'hidden',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};