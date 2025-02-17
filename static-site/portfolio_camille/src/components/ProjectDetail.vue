<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '../store/project'
import PortfolioHeader from './portfolio/PortfolioHeader.vue'
import TextFormatter from './TextFormatter.vue'
import TableOfContents from './TableOfContents.vue'
import CustomCursor from '../utilities/CustomCursor.vue'
import Footer from './portfolio/Footer.vue'
import { useScrollAnimation } from '../composables/useScrollAnimation'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const store = useProjectStore()

// Dynamic image imports for different types
const projectImages = import.meta.glob('../assets/images/**/*.{png,jpg,jpeg}', {
  eager: true,
  import: 'default'
})

// Create mapping for all project images
const imageMap = Object.entries(projectImages).reduce((acc, [path, module]) => {
  // Extract the path after 'images/'
  const pathParts = path.split('images/')
  if (pathParts.length > 1) {
    const projectPath = pathParts[1]
    // Store both with and without /images/ prefix
    acc[projectPath] = module
    acc[`/images/${projectPath}`] = module
  }
  return acc
}, {} as Record<string, string>)

const loading = ref(true)
const error = ref<string | null>(null)
const observers = ref<IntersectionObserver[]>([])

const { observe, cleanup } = useScrollAnimation()

// Cleanup function for observers
onUnmounted(() => {
  cleanup()
  observers.value.forEach(observer => observer.disconnect())
  observers.value = []
})

const getStepTypeDisplay = (type) => {
    const types = {
        'empathy': 'Empathie',
        'definition': 'Définition',
        'ideation': 'Idéation',
        'prototype': 'Prototypage',
        'testing': 'Tests'
    };
    return types[type] || type;
};

const groupedBlocks = (blocks) => {
    return blocks?.reduce((groups, block) => {
        const group = block.group || 0;
        if (!groups[group]) groups[group] = [];
        groups[group].push(block);
        return groups;
    }, {}) || {};
};

const stepColors = {
  'empathy': 'bg-[#FFC567]',
  'definition': 'bg-[#91A8EC]',
  'ideation': 'bg-[#22A092]',
  'prototype': 'bg-[#FF6D52]',
  'testing': 'bg-[#FFFFFF]'
}

const imagesLoaded = ref(0)
const totalImages = ref(0)
const isFullyLoaded = ref(false)

const scrollToStep = async (stepType: string) => {
    // Wait for next tick to ensure DOM is updated
    await nextTick()
    
    // If page isn't fully loaded, wait for images
    if (!isFullyLoaded.value) {
        await new Promise((resolve) => {
            const checkLoading = setInterval(() => {
                if (isFullyLoaded.value) {
                    clearInterval(checkLoading)
                    resolve(true)
                }
            }, 100)
        })
    }

    const element = document.getElementById('step-' + stepType)
    if (element) {
        // Get the header height to offset the scroll
        const headerHeight = 84 // Height of your fixed header
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        })
    }
}

// Add image load tracking
const handleImageLoad = () => {
    imagesLoaded.value++
    if (imagesLoaded.value >= totalImages.value) {
        isFullyLoaded.value = true
    }
}

onMounted(async () => {
    console.log('ProjectDetail monté avec ID:', route.params.id)
    
    try {
        await store.fetchProject(route.params.id as string)
        await nextTick()
        
        // Count total images
        const images = document.querySelectorAll('img')
        totalImages.value = images.length
        
        // Add load listeners to all images
        images.forEach(img => {
            if (img.complete) {
                handleImageLoad()
            } else {
                img.addEventListener('load', handleImageLoad)
            }
        })
        
    } catch (err) {
        console.error('Erreur lors du chargement du projet:', err)
        error.value = 'Erreur lors du chargement du projet'
    } finally {
        loading.value = false
    }
})

// Clean up image listeners
onUnmounted(() => {
    const images = document.querySelectorAll('img')
    images.forEach(img => {
        img.removeEventListener('load', handleImageLoad)
    })
})

// Modified scroll animation directive with initial visibility option
const vScrollAnimate = {
  mounted: (el: HTMLElement, binding: any) => {
    // Check if this element should be initially visible
    const initiallyVisible = binding.value?.initiallyVisible || false
    
    const { isVisible, observer } = observe(el)
    if (observer) {
      observers.value.push(observer)
    }
    
    if (initiallyVisible) {
      // Make element visible immediately
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    } else {
      // Apply animation setup
      el.style.opacity = '0'
      el.style.transform = 'translateY(20px)'
      const duration = 0.5 + Math.random() * 0.3
      el.style.transition = `opacity ${duration}s ease-out, transform ${duration}s ease-out`
    }
    
    watch(isVisible, (value) => {
      if (value) {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }
    })
  }
}

// Compute image dimensions for proper aspect ratio
const getImageDimensions = (image: string) => {
  const dimensions = image.match(/(\d+)x(\d+)/)
  return dimensions ? { width: dimensions[1], height: dimensions[2] } : { width: 952, height: 381 }
}

// Replace getImagePath function
function getImagePath(path: string): string {
  if (!path) return ''
  // Log the incoming path and the found URL for debugging
  console.log('Looking for path:', path)
  const imageUrl = imageMap[path]
  console.log('Found URL:', imageUrl)
  return imageUrl || ''
}

// Update lazy load directive to use new image mapping
const vLazyLoad = {
  mounted: (el: HTMLImageElement) => {
    const loadImage = () => {
      if (el.dataset.src) {
        el.src = getImagePath(el.dataset.src)
        el.removeAttribute('data-src')
      }
    }

    const { isVisible, observer } = useScrollAnimation({ 
      rootMargin: '50px 0px', 
      threshold: 0.01 
    }).observe(el)
    
    if (observer) {
      observers.value.push(observer)
    }
    
    watch(isVisible, (value) => {
      if (value) {
        loadImage()
      }
    })
  }
}
</script> 

<template>
    <div class="flex flex-col min-h-screen bg-[#FFFCF6] items-center">
        <PortfolioHeader />
        <CustomCursor />
        
        <!-- Add TableOfContents -->
        <TableOfContents 
            v-if="store.currentProject?.design_steps?.length"
            :steps="store.currentProject.design_steps"
            :getStepTypeDisplay="getStepTypeDisplay"
            :scrollToStep="scrollToStep"
        />

        <!-- Main content with proper spacing -->
        <main class="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 pt-8 items-center">
            <div v-if="loading" class="text-center py-8">
                Chargement...
            </div>
            <div v-else-if="error" class="text-center py-8 text-red-500">
                {{ error }}
            </div>

            <article v-else-if="store.currentProject" class="w-full max-w-4xl mx-auto">
                <!-- Title and main image with initial visibility -->
                <h1 v-scroll-animate="{ initiallyVisible: true }" 
                    class="text-center text-[40px] font-light text-[#1E1E1E] font-roboto mb-6">
                    {{ store.currentProject.title }}
                </h1>

                <div v-scroll-animate="{ initiallyVisible: true }" class="flex justify-center mb-12">
                    <img v-if="store.currentProject.main_image" 
                         v-lazy-load
                         :data-src="store.currentProject.main_image" 
                         :alt="store.currentProject.title"
                         class="w-full max-w-[952px] max-h-[381px] object-cover rounded-lg shadow-lg"
                         :style="{
                           aspectRatio: `${getImageDimensions(store.currentProject.main_image).width} / ${getImageDimensions(store.currentProject.main_image).height}`
                         }">
                </div>

                <!-- Project information sections with initial visibility -->
                <div class="grid md:grid-cols-2 gap-8 mb-12">
                    <section v-if="store.currentProject.role">
                        <h2 v-scroll-animate 
                            class="text-[32px] font-light text-[#7A7A7A] font-roboto leading-[35px] mb-4">
                            Rôle
                        </h2>
                        <p v-scroll-animate 
                           class="text-[20px] font-normal text-[#333] font-roboto leading-[35px]">
                            {{ store.currentProject.role }}
                        </p>
                    </section>

                    <section v-if="store.currentProject.software_used">
                        <h2 v-scroll-animate 
                            class="text-[32px] font-light text-[#7A7A7A] font-roboto leading-[35px] mb-4">
                            Logiciels utilisés
                        </h2>
                        <p v-scroll-animate 
                           class="text-[20px] font-normal text-[#333] font-roboto leading-[35px]">
                            {{ store.currentProject.software_used }}
                        </p>
                    </section>
                </div>

                <section v-if="store.currentProject.problem" class="mb-12">
                    <h2 v-scroll-animate 
                        class="text-[32px] font-light text-[#7A7A7A] font-roboto leading-[35px] mb-4">
                        Problème
                    </h2>
                    <p v-scroll-animate 
                       class="text-[20px] font-normal text-[#333] font-roboto leading-[35px]">
                        {{ store.currentProject.problem }}
                    </p>
                </section>

                <section v-if="store.currentProject.solution" class="mb-12">
                    <h2 v-scroll-animate 
                        class="text-[32px] font-light text-[#7A7A7A] font-roboto leading-[35px] mb-4">
                        Solution
                    </h2>
                    <p v-scroll-animate 
                       class="text-[20px] font-normal text-[#333] font-roboto leading-[35px]">
                        {{ store.currentProject.solution }}
                    </p>
                </section>

                <!-- Processus de design -->
                <section v-if="store.currentProject.design_steps?.length" class="mb-12">
                    <h2 v-scroll-animate 
                        class="text-[32px] font-light text-[#7A7A7A] font-roboto leading-[35px] mb-8">
                        Processus de design
                    </h2>
                    
                    <!-- Each button gets its own animation -->
                    <div class="flex flex-wrap gap-4 mb-12 justify-center">
                        <button
                            v-for="step in store.currentProject.design_steps"
                            :key="step.id"
                            v-scroll-animate
                            :class="[
                                stepColors[step.step_type] || 'bg-gray-200',
                                'min-h-[61px] rounded-[8px] border-2 border-solid border-black font-roboto text-[30px] font-normal text-black transition-transform hover:scale-105 flex items-center justify-center px-[9px] py-[11px] whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                            ]"
                            @click="scrollToStep(step.step_type)"
                        >
                            {{ getStepTypeDisplay(step.step_type) }}
                        </button>
                    </div>

                    <!-- Design Steps Content with individual animations -->
                    <div v-for="step in store.currentProject.design_steps" 
                         :key="step.id" 
                         :id="'step-' + step.step_type"
                         class="mb-12 scroll-mt-32 p-8 rounded-lg"
                         :class="[
                             {
                                 'bg-[#FFC567]/10': step.step_type === 'empathy',
                                 'bg-[#91A8EC]/10': step.step_type === 'definition',
                                 'bg-[#22A092]/10': step.step_type === 'ideation',
                                 'bg-[#FF6D52]/10': step.step_type === 'prototype',
                                 'bg-[#eaeaea]/10': step.step_type === 'testing'
                             }
                         ]">
                        <h3 v-scroll-animate class="text-[28px] font-light font-roboto leading-[35px] mb-12">
                          <div class="inline">
                            <span :class="[
                              'font-normal px-2 py-1 rounded inline-block align-baseline mr-2',
                              {
                                'bg-[#FFC567]': step.step_type === 'empathy',
                                'bg-[#91A8EC]': step.step_type === 'definition',
                                'bg-[#22A092]': step.step_type === 'ideation',
                                'bg-[#FF6D52]': step.step_type === 'prototype',
                                'bg-[#FFFFFF]': step.step_type === 'testing'
                              }
                            ]">
                              {{ step.step_type_display }}
                            </span>
                            <span v-if="step.custom_description" class="text-[#7A7A7A]">
                              - {{ step.custom_description }}
                            </span>
                          </div>
                        </h3>
                        
                        <template v-for="(blocks, group) in groupedBlocks(step.content_blocks)" 
                                  :key="group">
                            <div :class="{'grid md:grid-cols-2 gap-6': blocks.length > 1}" 
                                 class="mb-6">
                                <div v-for="block in blocks" 
                                     :key="block.id"
                                     :class="{'col-span-2': block.layout === 'full'}">
                                    <!-- Text Block with animation -->
                                    <div v-if="block.block_type === 'text'" 
                                         v-scroll-animate 
                                         class="text-block">
                                        <TextFormatter :content="block.text_content" />
                                    </div>
                                    
                                    <!-- Image Block with updated src -->
                                    <figure v-if="block.block_type === 'image'" v-scroll-animate>
                                        <img v-lazy-load
                                             :data-src="block.image" 
                                             :alt="block.image_caption || ''"
                                             class="w-full h-auto rounded-lg shadow mb-4">
                                        <figcaption v-if="block.image_caption" 
                                                  class="mt-2 text-[14px] text-black font-roboto font-extralight italic text-center">
                                            {{ block.image_caption }}
                                        </figcaption>
                                    </figure>
                                </div>
                            </div>
                        </template>
                    </div>
                </section>
            </article>
        </main>
        <Footer />
    </div>
</template>

<style>
/* Ensure Roboto font is available */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');

.font-roboto {
    font-family: 'Roboto', sans-serif;
}

/* Add prefers-reduced-motion media query */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    transform: none !important;
  }
}
</style>

