<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MobileMenu from './MobileMenu.vue'

const isCustomCursorEnabled = ref(false)
const isDesktop = computed(() => {
  // Check if window is defined (client-side)
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches
})

// Load initial state
onMounted(() => {
  // Explicitly set default state in localStorage if it doesn't exist
  if (localStorage.getItem('customCursorEnabled') === null) {
    localStorage.setItem('customCursorEnabled', 'false')
  }
  
  // Only enable if explicitly set to true
  const savedState = localStorage.getItem('customCursorEnabled')
  if (savedState === 'true' && isDesktop.value) {
    isCustomCursorEnabled.value = true
    enableCustomCursor()
  } else {
    // Ensure default pointer state
    isCustomCursorEnabled.value = false
    disableCustomCursor()
  }
})

const enableCustomCursor = () => {
  const cursorPath = new URL('@/assets/cursors/custom-cursor.cur', import.meta.url).href
  const pointerPath = new URL('@/assets/cursors/custom-pointer.cur', import.meta.url).href
  
  document.body.style.cursor = `url('${cursorPath}'), auto`
  document.documentElement.style.setProperty('--custom-pointer', `url('${pointerPath}'), pointer`)
}


const disableCustomCursor = () => {
  // Reset body cursor
  document.body.style.removeProperty('cursor')
  
  // Reset custom pointer variable to pointer instead of auto
  document.documentElement.style.setProperty('--custom-pointer', 'pointer')
  
  // Reset any elements that might have inline cursor styles
  document.querySelectorAll('a, button, [role="button"], input[type="submit"], input[type="button"], select, [onclick]')
    .forEach(element => {
      (element as HTMLElement).style.removeProperty('cursor')
    })
}

const toggleCursor = () => {
  if (!isDesktop.value) return
  
  isCustomCursorEnabled.value = !isCustomCursorEnabled.value
  
  if (isCustomCursorEnabled.value) {
    enableCustomCursor()
  } else {
    disableCustomCursor()
  }
  
  // Save state
  localStorage.setItem('customCursorEnabled', isCustomCursorEnabled.value.toString())
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-[#FFFCF6] shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
    <div class="flex justify-between items-center h-[84px] px-4 lg:px-[45px]">
      <!-- Logo -->
      <router-link to="/" class="hover:underline">
        <h1 class="text-2xl">Camille Jacot</h1>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="hidden sm:flex items-center space-x-10">
        <div class="flex gap-10 text-xl">
          <router-link to="/#projects" class="hover:underline">Projets</router-link>
          <router-link :to="{ name: 'about' }" class="hover:underline">À propos</router-link>
          <router-link to="/#cv" class="hover:underline">CV</router-link>
        </div>
        
        <!-- Cursor Toggle Button - Only show on desktop -->
        <div v-show="isDesktop" class="cursor-toggle ml-4">
          <button
            @click="toggleCursor"
            class="px-3 py-1 bg-[#FFFCF6] border border-black rounded-full hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300"
          >
            <span class="text-sm">
              {{ isCustomCursorEnabled ? '🐱' : '👆' }}
            </span>
          </button>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <MobileMenu />
    </div>
  </header>
  <!-- Spacer to prevent content from hiding behind fixed header -->
  <div class="h-[84px]"></div>
</template>

<style scoped>
/* Hide cursor toggle on mobile devices */
@media (hover: none), (pointer: coarse), (max-width: 767px) {
  .cursor-toggle {
    display: none !important;
  }
}
</style> 