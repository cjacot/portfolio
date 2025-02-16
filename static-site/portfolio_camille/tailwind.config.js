/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'orange-300': '#FFA500',
        'orange-400': '#FF8C00',
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      maxWidth: {
        'custom': '1064px',
      }
    },
  },
  plugins: [],
} 