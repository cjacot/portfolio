<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const scrollToSection = async (sectionId: string) => {
  // Close the menu first
  isOpen.value = false
  
  // If we're not on the home page, navigate there first
  if (router.currentRoute.value.path !== '/') {
    await router.push('/')
    // Wait for the navigation and DOM update
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  // Find the element and scroll to it
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// Menu items with their corresponding section IDs
const menuItems = [
  { label: 'Projets', id: 'projects', url: '/portfolio_camille/#projects' },
  { label: 'À propos', id: 'about', url: '/portfolio_camille/about' },
  { label: 'CV', id: 'cv', url: '/portfolio_camille/' }
]
</script>

<template>
  <div class="sm:hidden">
    <button 
      @click="toggleMenu"
      class="text-black p-2 transition-transform duration-200 ease-in-out"
      :class="{ 'rotate-180': isOpen }"
      aria-label="Toggle menu"
    >
      <svg 
        class="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          v-if="!isOpen" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M4 6h16M4 12h16M4 18h16"
        />
        <path 
          v-else 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <!-- Animated Dropdown Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div 
        v-show="isOpen"
        class="absolute left-0 right-0 mt-2 py-2 bg-[#FFFCF6] shadow-lg z-50"
      >
        <div class="flex flex-col items-center gap-4">
          <a 
            v-for="item in menuItems" 
            :key="item.id"
            :href="item.url"
            @click.prevent="scrollToSection(item.id)"
            class="font-['Roboto'] text-[20px] font-light text-black hover:underline py-2"
          >
            {{ item.label }}
          </a>
        </div>
      </div>
    </transition>
  </div>
</template> 