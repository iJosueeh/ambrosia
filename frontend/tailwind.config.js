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
      keyframes: {
        enter: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        leave: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
      },
      animation: {
        enter: 'enter 0.3s ease-out forwards',
        leave: 'leave 0.3s ease-in forwards',
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