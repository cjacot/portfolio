# Guide du Système de Thème

## 📋 Vue d'ensemble

Le système de thème centralisé permet de modifier facilement l'apparence de tout le site web depuis quelques fichiers centraux.

## 🎨 Couleurs du Thème

### Couleurs disponibles :
- **Fond** : `#ffffff` (blanc)
- **Texte** : `#1E1E1E` (gris foncé)
- **Jaune** : `#FFC567` (boutons principaux)
- **Bleu** : `#91A8EC` (boutons secondaires)
- **Vert** : `#22A092` (accents)
- **Rouge** : `#FF6D52` (alertes/erreurs)

### Comment modifier une couleur :

1. **Dans Tailwind** : `tailwind.config.js`
```js
'theme': {
  'yellow': '#NOUVELLE_COULEUR', // Changez ici
}
```

2. **Dans CSS** : `src/style.css`
```css
:root {
  --theme-yellow: #NOUVELLE_COULEUR; /* Changez ici */
}
```

## 🔤 Typographie

### Tailles définies :
- **Intro** : 48px, Roboto Extralight (titre page d'accueil)
- **Texte** : 20px, Roboto Regular (texte courant)
- **Section** : 36px, Roboto Light (titres de sections)

### Classes disponibles :
- `.text-theme-intro` - Titre d'introduction
- `.text-theme-body` - Texte courant
- `.text-theme-section` - Titres de sections

### Comment modifier une taille :

**Dans Tailwind** : `tailwind.config.js`
```js
fontSize: {
  'theme-intro': ['48px', { lineHeight: '1.2', fontWeight: '200' }],
  // Changez la taille ici ↑
}
```

## 🔘 Boutons

### Classes de boutons disponibles :
- `.btn-theme-yellow` - Bouton jaune principal
- `.btn-theme-blue` - Bouton bleu secondaire  
- `.btn-theme-green` - Bouton vert
- `.btn-theme-red` - Bouton rouge

### Comment modifier le style des boutons :

**Dans CSS** : `src/style.css`
```css
.btn-theme-yellow {
  @apply bg-theme-yellow border border-theme-text hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-theme-text transition-all duration-300;
  /* Modifiez les propriétés ici */
}
```

## 📁 Fichiers à modifier

### Pour changer les couleurs/polices/tailles :
1. `tailwind.config.js` - Configuration Tailwind
2. `src/style.css` - Variables CSS et classes utilitaires
3. `src/config/theme.js` - Configuration centralisée (optionnel)

### Exemples de modifications courantes :

#### Changer la couleur de fond :
```js
// Dans tailwind.config.js
'theme': {
  'bg': '#f8f9fa', // Nouvelle couleur de fond
}
```

#### Changer la couleur des boutons principaux :
```js
// Dans tailwind.config.js  
'theme': {
  'yellow': '#ff9500', // Nouvelle couleur orange
}
```

#### Changer la taille du texte principal :
```js
// Dans tailwind.config.js
fontSize: {
  'theme-text': ['18px', { lineHeight: '1.4', fontWeight: '400' }],
  // Changé de 20px à 18px
}
```

## 🔧 Utilisation dans les composants

### Au lieu de :
```html
<button class="bg-orange-300 border border-black hover:bg-orange-400">
```

### Utilisez :
```html
<button class="btn-theme-yellow">
```

### Au lieu de :
```html
<p class="text-lg">
```

### Utilisez :
```html
<p class="text-theme-body">
```

## ✅ Avantages du système

- **Cohérence** : Tous les éléments utilisent les mêmes valeurs
- **Facilité** : Changez une couleur partout en une seule modification
- **Maintenance** : Plus facile de maintenir et faire évoluer le design
- **Performance** : Classes réutilisables, CSS plus léger

## 🚀 Prochaines étapes

Pour appliquer complètement le thème, il faudrait :
1. Remplacer tous les styles hardcodés restants
2. Ajouter plus de variantes de boutons si nécessaire
3. Créer des classes pour les espacements standardisés
4. Ajouter des variables pour les ombres et transitions 