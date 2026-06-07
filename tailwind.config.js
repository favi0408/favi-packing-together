/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom dark-mode rose backgrounds
        drose: {
          950: '#120009',
          900: '#1e000f',
          800: '#2d0018',
          700: '#42001f',
          600: '#5c0028',
          500: '#7b0035',
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
