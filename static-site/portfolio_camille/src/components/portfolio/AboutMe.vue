<script setup lang="ts">
import Footer from './Footer.vue'
import CustomCursor from '../../utilities/CustomCursor.vue'
import PortfolioHeader from './PortfolioHeader.vue'
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

// Update the import path to match the actual file location
import aboutImageUrl from '../../assets/images/about-image.jpg'
</script>

<template>
  <PortfolioHeader />
  <div class="flex flex-col overflow-hidden items-center bg-[#FFFCF6]">
    <CustomCursor />
    <main class="container px-4 pt-8 flex flex-col items-center">
      <div class="flex flex-col md:flex-row gap-8 items-center max-w-[800px]">
        <!-- Text section - adjusted width -->
        <div class="flex-1 space-y-6 md:w-[400px]">
          <p class="text-lg">
            👋 Bonjour ! Je m'appelle Camille. Passionnée par le design UX/UI, j'ai découvert cet univers grâce à la certification Google UX Design. Depuis, je me consacre à créer des expériences utilisateur simples, intuitives et agréables.
          </p>
          <p class="text-lg">
            🎨 Ce que j'aime dans l'UX/UI, c'est l'équilibre entre la créativité et la réflexion stratégique. Chaque projet est une opportunité de résoudre des problèmes tout en exprimant mon sens du design.
          </p>
          <p class="text-lg">
            🌱 En dehors du design, je trouve mon inspiration dans mes passions. Très touchée par la cause animale, je travaille avec le plus grand refuge canadien en tant que famille d'accueil pour chats, j'entretiens avec soin mes plantes d'intérieur, et j'adore cuisiner. À mes heures perdues, je prends aussi plaisir à peindre et à dessiner, des activités qui nourrissent ma créativité.
          </p>
          <p class="text-lg">
            🔎 Si vous souhaitez en savoir plus sur mon parcours ou découvrir mes projets, parcourez mon portfolio ou contactez-moi. J'adorerais échanger avec vous !
          </p>
        </div>
        
        <!-- Image section - added mobile width -->
        <div class="w-full md:w-[360px]">
          <div class="aspect-[4/5] relative">
            <img 
              :src="aboutImageUrl"
              alt="Portrait de Camille" 
              class="absolute inset-0 w-full h-full rounded-lg object-cover"
            >
          </div>
        </div>
      </div>

      <!-- Contact button - added ml-5 (20px) to move it right -->
      <div class="w-full max-w-[800px]">
        <div class="relative mt-8 mb-20 text-3xl font-light w-[207px] ">
          <div 
            class="absolute top-[5px] left-[5px] w-full h-full bg-black"
            :style="{
              transform: isHovering ? `translate(${buttonPos.x}px, ${buttonPos.y}px)` : 'none',
              transition: isHovering ? 'none' : 'transform 0.3s ease-out'
            }"
          ></div>
          
          <router-link to="/contact">
          <button 
            class="contact-button relative w-full px-3.5 py-3.5 bg-orange-300 border border-black hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-black"
            @mouseenter="isHovering = true"
            @mouseleave="resetButton"
            @mousemove="handleMouseMove"
            :style="{
              transform: `translate(${buttonPos.x}px, ${buttonPos.y}px)`,
              transition: isHovering ? 'none' : 'transform 0.3s ease-out'
            }"
          >
            Me contacter
          </button>
        </router-link>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .md\:sticky {
    position: relative;
    top: 0;
  }
}
</style>