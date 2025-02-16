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
      <h2 class="text-5xl max-md:max-w-full max-md:text-4xl">
        Bonjour !<br />Je m'appelle Camille Jacot et<br />je suis UX/UI Designer
      </h2>
      <p class="mt-8 text-2xl max-md:max-w-full">
        Alliée des utilisateurs, je suis passionnée par la création d'expériences claires et engageantes
      </p>
      <div class="relative mt-8 max-w-full text-3xl font-light w-[207px]">
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
  }
}
</style> 