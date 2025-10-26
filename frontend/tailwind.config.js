import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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