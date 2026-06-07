/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom dark-mode rose backgrounds
        // Dark-mode rose palette — clearly pink/rose, not near-black
        drose: {
          950: '#3b0019',   // body bg — deep rose
          900: '#4d0022',   // cards / sidebar
          800: '#62002c',   // inputs / secondary bg
          700: '#800038',   // borders
          600: '#9d1048',   // hover states
          500: '#be185d',   // accents (= rose-700)
        },
        primary: {
          50:'#fff0f5',100:'#fce7f3',200:'#fbcfe8',300:'#f9a8d4',
          400:'#f472b6',500:'#ec4899',600:'#db2777',700:'#be185d',
          800:'#9d174d',900:'#831843',950:'#500724',
        },
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'] },
    },
  },
  plugins: [],
}
