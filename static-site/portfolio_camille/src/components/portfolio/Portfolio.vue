<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PortfolioHeader from './PortfolioHeader.vue'
import HeroSection from './HeroSection.vue'
import ProjectCard from './ProjectCard.vue'
import SkeletonLoader from './SkeletonLoader.vue'
import CustomCursor from '../../utilities/CustomCursor.vue'
import Footer from './Footer.vue'
import { useProjectStore } from '../../store/project'

const store = useProjectStore()

// Dynamically import all preview images
const previewImages = import.meta.glob('../../assets/images/previews/*.png', {
  eager: true,
  import: 'default'
})

// Create dynamic mapping based on file names
const imageMap = Object.entries(previewImages).reduce((acc, [path, module]) => {
  // Extract the relevant part of the path that matches projects.json
  const pathParts = path.split('previews/')
  if (pathParts.length > 1) {
    const projectPath = `previews/${pathParts[1]}`
    // Store both with and without /images/ prefix
    acc[projectPath] = module
    acc[`/images/${projectPath}`] = module
  }
  return acc
}, {} as Record<string, string>)

// Debug log to see our mappings
console.log('Image mappings:', imageMap)

function getImagePath(path: string): string {
  if (!path) return ''
  
  // Log the incoming path and the found URL
  console.log('Looking for path:', path)
  const imageUrl = imageMap[path]
  console.log('Found URL:', imageUrl)
  
  return imageUrl || ''
}

onMounted(() => {
  store.getAllProjects()
})
</script>

<template>
  <div class="flex flex-col overflow-hidden items-center bg-[#FFFCF6]">
    <CustomCursor />
    <PortfolioHeader />
    <HeroSection />
    
    <section id="projects" class="w-full my-32 max-w-[1440px] px-4 flex flex-col items-center bg-[#FFFCF6]">
      <!-- Loading State -->
      <div v-if="store.loading" class="flex flex-col gap-8 w-full items-center">
        <SkeletonLoader v-for="n in 2" :key="n" class="w-full max-w-[1064px] h-[408px]" />
      </div>

      <!-- Error State -->
      <div v-else-if="store.error" class="text-red-500 p-4">
        {{ store.error }}
      </div>

      <!-- Projects Display -->
      <div v-else class="flex flex-col gap-8 w-full items-center">
        <router-link 
          v-for="project in store.projects" 
          :key="project.id"
          :to="`/projects/${project.id}`"
          class="w-full max-w-[1064px]"
        >
          <ProjectCard
            :id="project.id"
            :title="project.title"
            :description="project.description || ''"
            :preview_image="getImagePath(project.preview_image)"
            :imageAlt="project.title"
          />
        </router-link>
      </div>
    </section>
    <Footer />
  </div>
</template>

<style scoped>
/* Add responsive styles if needed */
@media (max-width: 1064px) {
  .max-w-[1064px] {
    max-width: 100%;
  }
}
</style> 