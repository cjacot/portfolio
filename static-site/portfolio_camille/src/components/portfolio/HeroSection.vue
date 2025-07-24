<script setup lang="ts">
import { ref } from 'vue'

const buttonPos = ref({ x: 0, y: 0 })
const isHovering = ref(false)

const handleMouseMove = (e: MouseEvent) => {
  if (isHovering.value) {
    const button = document.querySelector('.contact-button')
    if (button) {
      const rect = button.getBoundingClientRect()
      const buttonCenterX = rect.left + rect.width / 2
      const buttonCenterY = rect.top + rect.height / 2
      
      buttonPos.value = {
        x: (e.clientX - buttonCenterX) * 0.2,
        y: (e.clientY - buttonCenterY) * 0.2
      }
    }
  }
}

const resetButton = () => {
  isHovering.value = false
  buttonPos.value = { x: 0, y: 0 }
}
</script>

<template>
  <section class="flex flex-col font-extralight text-black min-w-[240px] w-[778px] max-md:max-w-full mx-auto">
    <!-- Using margin for spacing -->
    <div class="max-lg:mt-24 max-sm:mt-16 px-4 sm:px-6 lg:px-0">
      <h2 class="text-theme-intro max-md:max-w-full max-md:text-4xl">
        Designer Graphique, Créatrice Web<br />& Designer d'Interface.
      </h2>
      
      <div class="mt-12 max-md:max-w-full">
        <p class="text-theme-body font-light leading-relaxed">
          De la conception de votre site web à la création de vos supports de communication, je mets un point d'honneur à traduire votre vision en une expérience numérique efficace et soignée. Je vise l'excellence dans chaque projet et je suis passionnée par la transformation des idées en résultats concrets et percutants, le tout avec un œil innovant, méticuleux et un sens aigu du détail.
        </p>
        
                 <div class="mt-8">
           <p class="text-theme-body font-medium">
             CAMILLE JACOT
           </p>
           <p class="text-theme-body font-light mt-1">
             Actuellement disponible pour de nouveaux projets
           </p>
         </div>
      </div>
      <!-- VERSION 3: Couleur saturée + Lift -->
      <div class="relative mt-8 max-w-full text-3xl font-light w-[207px]">
        <div 
          class="absolute w-full h-full bg-black transition-all duration-300 ease-out"
          :class="isHovering ? 'top-[8px] left-[8px]' : 'top-[5px] left-[5px]'"
        ></div>
        
        <router-link to="/contact">
          <button 
            class="contact-button relative w-full px-3.5 py-3.5 bg-theme-yellow border border-theme-text transition-all duration-300 ease-out hover:bg-white focus:outline-none focus:ring-2 focus:ring-theme-text"
            :class="{ '-translate-y-1': isHovering }"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
          >
            Me contacter
          </button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  border-top: 116px solid transparent;
}

@media (max-width: 1024px) {
  section {
    border-top-width: 96px;
  }
}

@media (max-width: 640px) {
  section {
    border-top-width: 64px;
    border-left-width: 16px;
    border-right-width: 16px;
    border-color: transparent;
  }
}
</style> 