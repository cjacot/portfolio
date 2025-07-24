/**
 * Configuration du thème centralisée
 * 
 * Ce fichier contient toutes les valeurs du thème utilisées dans l'application.
 * Pour modifier l'apparence globale, il suffit de changer les valeurs ici.
 */

export const theme = {
  // Couleurs principales
  colors: {
    background: '#ffffff',
    text: '#1E1E1E',
    yellow: '#FFC567',
    blue: '#91A8EC', 
    green: '#22A092',
    red: '#FF6D52'
  },

  // Typographie
  fonts: {
    primary: 'Roboto, sans-serif'
  },

  // Tailles de texte
  fontSizes: {
    intro: {
      size: '48px',
      weight: '200', // extralight
      lineHeight: '1.2'
    },
    text: {
      size: '20px', 
      weight: '400', // regular
      lineHeight: '1.4'
    },
    section: {
      size: '36px',
      weight: '300', // light  
      lineHeight: '1.3'
    }
  },

  // Classes Tailwind correspondantes
  classes: {
    // Couleurs
    bg: 'bg-theme-bg',
    text: 'text-theme-text',
    yellow: 'bg-theme-yellow',
    blue: 'bg-theme-blue', 
    green: 'bg-theme-green',
    red: 'bg-theme-red',

    // Boutons
    btnYellow: 'btn-theme-yellow',
    btnBlue: 'btn-theme-blue',
    btnGreen: 'btn-theme-green', 
    btnRed: 'btn-theme-red',

    // Typographies
    textIntro: 'text-theme-intro',
    textBody: 'text-theme-body',
    textSection: 'text-theme-section'
  }
}

// Fonction utilitaire pour obtenir une couleur
export const getColor = (colorName) => theme.colors[colorName]

// Fonction utilitaire pour obtenir une classe
export const getClass = (className) => theme.classes[className]

export default theme 