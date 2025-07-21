<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">🛠️ Dev Admin Panel</h1>
            <p class="text-sm text-gray-600">Project Data Editor (Development Only)</p>
          </div>
          <div class="flex gap-4">
            <button 
              @click="exportData" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              📥 Export JSON
            </button>
            <router-link 
              to="/" 
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              ← Back to Portfolio
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Development Helper Card -->
      <div class="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
        <div class="flex items-start gap-3">
          <div class="text-blue-600 text-xl">💡</div>
          <div>
            <h3 class="font-medium text-blue-900 mb-2">Image Management Tips</h3>
            <div class="text-sm text-blue-700 space-y-1">
              <p><strong>Images not showing?</strong> Make sure they exist in <code>src/assets/images/</code></p>
              <p><strong>Preview images:</strong> Place in <code>src/assets/images/previews/</code></p>
              <p><strong>Content blocks:</strong> Place in <code>src/assets/images/content_blocks/</code></p>
              <p><strong>Debug:</strong> Open console and type <code>showAvailableImages()</code> to see all loaded images</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Project List -->
      <div class="bg-white rounded-lg shadow-sm border mb-8">
        <div class="px-6 py-4 border-b">
          <h2 class="text-xl font-semibold text-gray-900">Projects</h2>
        </div>
        <div class="p-6">
          <div class="grid gap-6">
            <div 
              v-for="project in store.projects" 
              :key="project.id"
              class="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <!-- Project Header with Image -->
              <div class="flex gap-4 p-4">
                <div class="flex-shrink-0">
                  <img 
                    v-if="project.preview_image" 
                    :src="getImageUrl(project.preview_image)" 
                    :data-original-src="project.preview_image"
                    :alt="project.title"
                    class="w-20 h-20 object-cover rounded-lg border"
                    @error="handleImageError"
                  />
                  <div v-else class="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span class="text-gray-400 text-xs">No Image</span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 text-lg mb-1">{{ project.title }}</h3>
                  <p class="text-sm text-gray-600 mb-2">{{ project.description }}</p>
                  <div class="flex flex-wrap gap-2 text-xs">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded">{{ project.role }}</span>
                    <span class="px-2 py-1 bg-green-100 text-green-800 rounded">{{ project.design_steps?.length || 0 }} steps</span>
                    <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded">{{ project.software_used }}</span>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <button 
                    @click="editProject(project)"
                    class="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    @click="viewDesignSteps(project)"
                    class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors text-sm"
                  >
                    🎨 Steps
                  </button>
                  <button 
                    @click="duplicateProject(project)"
                    class="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                  >
                    📄 Copy
                  </button>
                </div>
              </div>
              
              <!-- Quick Info -->
              <div class="px-4 pb-4">
                <div class="text-sm text-gray-600">
                  <p class="mb-1"><strong>Problem:</strong> {{ truncateText(project.problem, 100) }}</p>
                  <p><strong>Solution:</strong> {{ truncateText(project.solution, 100) }}</p>
                </div>
              </div>
            </div>
          </div>
          <button 
            @click="createNewProject"
            class="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            ➕ Add New Project
          </button>
        </div>
      </div>

      <!-- Project Editor Modal -->
      <div 
        v-if="editingProject" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeEditor"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[calc(100vh-2rem)] overflow-hidden">
          <ProjectEditor 
            :project="editingProject"
            @save="saveProject"
            @cancel="closeEditor"
            @goToSteps="switchToSteps"
          />
        </div>
      </div>

      <!-- Design Steps Modal -->
      <div 
        v-if="viewingSteps" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeStepsView"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[calc(100vh-2rem)] overflow-hidden">
          <DesignStepsManager 
            :project="viewingSteps"
            @save="saveProject"
            @cancel="closeStepsView"
          />
        </div>
      </div>

      <!-- Export Modal -->
      <div 
        v-if="showExport" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showExport = false"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">Export Project Data</h3>
          </div>
          <div class="p-6">
            <p class="text-sm text-gray-600 mb-4">
              Copy this JSON and replace the content in <code>src/data/projects.json</code>
            </p>
            <textarea 
              v-model="exportedData" 
              class="w-full h-96 p-3 border rounded-md font-mono text-xs"
              readonly
            ></textarea>
            <div class="flex gap-2 mt-4">
              <button 
                @click="copyToClipboard"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                📋 Copy to Clipboard
              </button>
              <button 
                @click="downloadJSON"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                💾 Download File
              </button>
              <button 
                @click="showExport = false"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProjectStore } from '../../store/project'
import ProjectEditor from './ProjectEditor.vue'
import DesignStepsManager from './DesignStepsManager.vue'

const store = useProjectStore()
const editingProject = ref(null)
const viewingSteps = ref(null)
const showExport = ref(false)
const exportedData = ref('')

// Dynamic image imports like in the main portfolio
const allImages = import.meta.glob('../../assets/images/**/*.{png,jpg,jpeg}', {
  eager: true,
  import: 'default'
})

// Create mapping for all images
const imageMap = Object.entries(allImages).reduce((acc, [path, module]) => {
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

onMounted(() => {
  store.getAllProjects()
  
  // Debug: Log available images for development
  console.log('🖼️ Available images in admin:', Object.keys(imageMap))
  
  // Add a global helper function for debugging
  if (import.meta.env.DEV) {
    (window as any).showAvailableImages = () => {
      console.log('📁 Available images:', Object.keys(imageMap))
      console.log('🔍 Image mappings:', imageMap)
    }
    console.log('💡 Tip: Use showAvailableImages() in console to see all available images')
  }
})

const editProject = (project: any) => {
  // Create a deep copy for editing
  editingProject.value = JSON.parse(JSON.stringify(project))
}

const createNewProject = () => {
  const newProject = {
    id: Math.max(...store.projects.map(p => p.id), 0) + 1,
    title: 'New Project',
    description: 'Project description',
    preview_image: 'previews/preview_new.png',
    main_image: 'new_project.png',
    role: 'UX/UI Designer',
    problem: 'Problem statement',
    solution: 'Solution description',
    software_used: 'Figma, Adobe Photoshop',
    design_steps: []
  }
  editingProject.value = newProject
}

const duplicateProject = (project: any) => {
  const duplicated = JSON.parse(JSON.stringify(project))
  duplicated.id = Math.max(...store.projects.map(p => p.id), 0) + 1
  duplicated.title = `${project.title} (Copy)`
  editingProject.value = duplicated
}

const saveProject = (updatedProject: any) => {
  const index = store.projects.findIndex(p => p.id === updatedProject.id)
  if (index >= 0) {
    // Update existing project
    store.projects[index] = updatedProject
  } else {
    // Add new project
    store.projects.push(updatedProject)
  }
  closeEditor()
}

const closeEditor = () => {
  editingProject.value = null
}

const viewDesignSteps = (project: any) => {
  viewingSteps.value = JSON.parse(JSON.stringify(project))
}

const closeStepsView = () => {
  viewingSteps.value = null
}

const switchToSteps = (project: any) => {
  // Close the project editor and open the design steps manager
  editingProject.value = null
  viewingSteps.value = project
}

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return ''
  
  // Log for debugging
  console.log('Admin: Looking for image path:', imagePath)
  
  // Check if we have this image in our dynamic imports
  const imageUrl = imageMap[imagePath]
  if (imageUrl) {
    console.log('Admin: Found image in dynamic imports:', imageUrl)
    return imageUrl
  }
  
  // Try without /images/ prefix
  const cleanPath = imagePath.startsWith('/images/') ? imagePath.slice(8) : imagePath
  const cleanImageUrl = imageMap[cleanPath]
  if (cleanImageUrl) {
    console.log('Admin: Found image with clean path:', cleanImageUrl)
    return cleanImageUrl
  }
  
  console.log('Admin: Image not found in imports, using fallback')
  // Fallback to public path
  const publicPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`
  return `/images${publicPath}`
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  const imagePath = img.getAttribute('data-original-src') || img.src
  console.error('❌ Image failed to load:', imagePath)
  
  img.style.display = 'none'
  const parent = img.parentElement
  if (parent) {
    parent.innerHTML = `<div class="w-20 h-20 bg-red-100 rounded-lg flex items-center justify-center border border-red-200" title="Image not found: ${imagePath}"><span class="text-red-400 text-xs">❌ Missing</span></div>`
  }
}

const truncateText = (text: string, maxLength: number) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const exportData = () => {
  const dataToExport = {
    projects: store.projects.map(project => ({
      ...project,
      // Remove the /images/ prefix for export since it gets added by the store
      preview_image: project.preview_image.replace('/images/', ''),
      main_image: project.main_image.replace('/images/', ''),
      design_steps: project.design_steps.map(step => ({
        ...step,
        content_blocks: step.content_blocks.map(block => ({
          ...block,
          image: block.image.replace('/images/', '')
        }))
      }))
    }))
  }
  exportedData.value = JSON.stringify(dataToExport, null, 2)
  showExport.value = true
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(exportedData.value)
    alert('✅ Copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
    alert('❌ Failed to copy to clipboard')
  }
}

const downloadJSON = () => {
  const blob = new Blob([exportedData.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'projects.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script> 