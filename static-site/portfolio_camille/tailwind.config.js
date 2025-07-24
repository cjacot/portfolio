/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs du thème
        'theme': {
          'bg': '#ffffff',
          'text': '#1E1E1E',
          'yellow': '#FFC567',
          'yellow-hover': '#FF9E00',
          'blue': '#91A8EC',
          'green': '#22A092',
          'red': '#FF6D52',
        },
        // Anciennes couleurs pour compatibilité
        'orange-300': '#FFA500',
        'orange-400': '#FF8C00',
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      fontSize: {
        // Tailles de texte du thème
        'theme-intro': ['48px', { lineHeight: '1.2', fontWeight: '200' }], // extralight
        'theme-text': ['20px', { lineHeight: '1.4', fontWeight: '400' }], // regular
        'theme-section': ['36px', { lineHeight: '1.3', fontWeight: '300' }], // light
      },
      maxWidth: {
        'custom': '1064px',
      }
    },
  },
  plugins: [],
} 