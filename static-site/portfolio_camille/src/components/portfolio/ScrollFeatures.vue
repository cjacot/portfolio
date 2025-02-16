<script setup lang="ts">
import { ref } from 'vue'

const currentSection = ref('home')
const sections = ['home', 'projects', 'about', 'contact']

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-[#FFFCF6]">
    <nav class="container mx-auto px-4 py-4">
      <ul class="flex space-x-8">
        <li v-for="section in sections" :key="section">
          <a 
            href="#"
            @click.prevent="scrollToSection(section)"
            class="font-['Roboto'] text-[20px] font-light transition-colors duration-200"
            :class="{ 'text-orange-300': currentSection === section }"
          >
            {{ section.charAt(0).toUpperCase() + section.slice(1) }}
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template> 