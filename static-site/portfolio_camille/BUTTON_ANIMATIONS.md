# Options d'Animation pour le Bouton "Me contacter"

## Version 1 : Couleur saturée + Scale (ACTUELLE)
- **Couleur hover** : Orange saturé (#FF9E00)
- **Animation** : Agrandissement léger (scale 1.05) du bouton et de l'ombre
- **Effet** : Moderne et subtil

```vue
<div class="relative mt-8 max-w-full text-3xl font-light w-[207px]">
  <div 
    class="absolute top-[5px] left-[5px] w-full h-full bg-black transition-all duration-300 ease-out"
    :class="{ 'scale-105': isHovering }"
  ></div>
  
  <router-link to="/contact">
    <button 
      class="contact-button relative w-full px-3.5 py-3.5 bg-theme-yellow border border-theme-text transition-all duration-300 ease-out hover:bg-theme-yellow-hover hover:scale-105 focus:outline-none focus:ring-2 focus:ring-theme-text"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      Me contacter
    </button>
  </router-link>
</div>
```

## Version 2 : Blanc + Slide
- **Couleur hover** : Blanc pur
- **Animation** : L'ombre glisse vers la droite et le bouton devient blanc
- **Effet** : Élégant et minimaliste

```vue
<div class="relative mt-8 max-w-full text-3xl font-light w-[207px]">
  <div 
    class="absolute top-[5px] left-[5px] w-full h-full bg-black transition-all duration-300 ease-out"
    :class="{ 'translate-x-2 translate-y-2': isHovering }"
  ></div>
  
  <router-link to="/contact">
    <button 
      class="contact-button relative w-full px-3.5 py-3.5 bg-theme-yellow border border-theme-text transition-all duration-300 ease-out hover:bg-white focus:outline-none focus:ring-2 focus:ring-theme-text"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      Me contacter
    </button>
  </router-link>
</div>
```

## Version 3 : Couleur saturée + Lift
- **Couleur hover** : Orange saturé (#FF9E00)
- **Animation** : Le bouton "se soulève" (ombre s'éloigne)
- **Effet** : Impression de profondeur

```vue
<div class="relative mt-8 max-w-full text-3xl font-light w-[207px]">
  <div 
    class="absolute w-full h-full bg-black transition-all duration-300 ease-out"
    :class="isHovering ? 'top-[8px] left-[8px]' : 'top-[5px] left-[5px]'"
  ></div>
  
  <router-link to="/contact">
    <button 
      class="contact-button relative w-full px-3.5 py-3.5 bg-theme-yellow border border-theme-text transition-all duration-300 ease-out hover:bg-theme-yellow-hover focus:outline-none focus:ring-2 focus:ring-theme-text"
      :class="{ '-translate-y-1': isHovering }"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      Me contacter
    </button>
  </router-link>
</div>
```

## Quelle version préférez-vous ?

1. **Version 1** : Scale + couleur saturée (plus moderne)
2. **Version 2** : Slide + blanc (plus minimaliste)  
3. **Version 3** : Lift + couleur saturée (plus dynamique)

Dites-moi laquelle vous préférez et je l'appliquerai ! 