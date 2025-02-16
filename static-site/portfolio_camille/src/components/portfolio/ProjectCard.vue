<script setup lang="ts">
import { ref } from 'vue'
import type { ProjectCard } from './types'

const props = defineProps<ProjectCard>()
const isHovered = ref(false)

// Add error handling for images
const handleImageError = (event: Event) => {
  console.error('Image failed to load:', (event.target as HTMLImageElement).src)
}
</script>

<template>
  <article 
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    class="relative w-full h-auto transition-all duration-500"
  >
    <!-- Black shadow -->
    <div 
      class="absolute top-0 left-0 w-full h-full bg-black translate-x-[5px] translate-y-[5px] transition-transform duration-500"
      :class="{ 'scale-105': isHovered }"
    />

    <!-- White card with black border -->
    <div 
      class="relative z-10 flex flex-col md:flex-row items-center px-9 py-12 bg-white border border-black border-solid w-full h-full transition-transform duration-500"
      :class="{ 'scale-105': isHovered }"
    >
      <!-- Left column: Text content -->
      <div class="flex flex-col items-start self-stretch mb-8 md:mb-0 md:pr-16 text-black w-full md:w-[389px]">
        <h3 class="text-4xl font-extralight">{{ title }}</h3>
        <p class="mt-7 text-2xl font-light">{{ description }}</p>
      </div>

      <!-- Right column: Image -->
      <div class="flex-1 w-full md:w-auto h-full flex items-center justify-center">
        <img
          :src="preview_image"
          :alt="imageAlt"
          @error="handleImageError"
          loading="lazy"
          class="w-full md:w-auto h-auto md:h-full object-contain"
        />
      </div>
    </div>
  </article>
</template> 