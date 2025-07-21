<template>
  <div class="flex flex-col max-h-full">
    <!-- Header -->
    <div class="px-6 py-4 border-b flex justify-between items-center flex-shrink-0">
      <h3 class="text-lg font-semibold">{{ isNew ? 'Create New Project' : 'Edit Project' }}</h3>
      <div class="flex gap-2">
        <button 
          @click="saveProject" 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          💾 Save
        </button>
        <button 
          @click="$emit('cancel')" 
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-6 min-h-0">
      <!-- Basic Project Info -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 class="font-medium text-gray-900 mb-4">Basic Information</h4>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              v-model="localProject.title" 
              type="text" 
              class="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input 
              v-model="localProject.role" 
              type="text" 
              class="w-full p-2 border rounded-md"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              v-model="localProject.description" 
              class="w-full p-2 border rounded-md h-20"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Preview Image</label>
            <div class="space-y-2">
              <div class="flex gap-2">
                <input 
                  v-model="localProject.preview_image" 
                  type="text" 
                  class="flex-1 p-2 border rounded-md"
                  placeholder="previews/preview_example.png"
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="handleImageUpload($event, 'preview_image')"
                  class="hidden"
                  ref="previewImageInput"
                />
                <button 
                  @click="$refs.previewImageInput?.click()"
                  class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  title="Upload preview image - will be saved to previews/ folder"
                >
                  📁 Browse Images
                </button>
              </div>
              <div v-if="localProject.preview_image" class="mt-2">
                <img 
                  :src="getImageUrl(localProject.preview_image)" 
                  :data-original-src="localProject.preview_image"
                  :alt="localProject.title"
                  class="w-24 h-24 object-cover border rounded"
                  @error="handleImageError"
                />
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
            <div class="space-y-2">
              <div class="flex gap-2">
                <input 
                  v-model="localProject.main_image" 
                  type="text" 
                  class="flex-1 p-2 border rounded-md"
                  placeholder="main_image.png"
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="handleImageUpload($event, 'main_image')"
                  class="hidden"
                  ref="mainImageInput"
                />
                <button 
                  @click="$refs.mainImageInput?.click()"
                  class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  title="Upload main project image - will be saved to images/ root folder"
                >
                  📁 Browse Images
                </button>
              </div>
              <div v-if="localProject.main_image" class="mt-2">
                <img 
                  :src="getImageUrl(localProject.main_image)" 
                  :data-original-src="localProject.main_image"
                  :alt="localProject.title"
                  class="w-32 h-24 object-cover border rounded"
                  @error="handleImageError"
                />
              </div>
            </div>
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Software Used</label>
            <input 
              v-model="localProject.software_used" 
              type="text" 
              class="w-full p-2 border rounded-md"
              placeholder="Figma, Adobe Photoshop"
            />
          </div>
        </div>
      </div>

      <!-- Scorecard (Optional) -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h4 class="font-medium text-gray-900">Scorecard (Optional)</h4>
          <button 
            v-if="!localProject.scorecards || localProject.scorecards.length === 0"
            @click="addScorecard" 
            class="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            ➕ Add Scorecard
          </button>
        </div>
        
        <div v-if="localProject.scorecards && localProject.scorecards.length > 0" class="space-y-4">
          <div 
            v-for="(scorecard, index) in localProject.scorecards.slice(0, 1)" 
            :key="scorecard.id || index"
            class="bg-white rounded-lg border p-4"
          >
            <div class="flex justify-between items-start mb-3">
              <h5 class="font-medium text-gray-800">Project Scorecard</h5>
              <button 
                @click="removeScorecard(index)" 
                class="px-2 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
              >
                🗑️ Remove
              </button>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  v-model="scorecard.title" 
                  type="text" 
                  class="w-full p-2 border rounded-md text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input 
                  v-model.number="scorecard.order" 
                  type="number" 
                  class="w-full p-2 border rounded-md text-sm"
                />
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  v-model="scorecard.description" 
                  class="w-full p-2 border rounded-md text-sm h-20"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Preview Image</label>
                <input 
                  v-model="scorecard.preview_image" 
                  type="text" 
                  class="w-full p-2 border rounded-md text-sm"
                  placeholder="previews/preview_example.png"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Image Alt Text</label>
                <input 
                  v-model="scorecard.imageAlt" 
                  type="text" 
                  class="w-full p-2 border rounded-md text-sm"
                  placeholder="Alt text for accessibility"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8 text-gray-500">
          <p>No scorecard added yet</p>
        </div>
      </div>

      <!-- Problem & Solution -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 class="font-medium text-gray-900 mb-4">Problem & Solution</h4>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Problem Statement</label>
            <textarea 
              v-model="localProject.problem" 
              class="w-full p-2 border rounded-md h-24"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Solution</label>
            <textarea 
              v-model="localProject.solution" 
              class="w-full p-2 border rounded-md h-24"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Design Steps Info -->
      <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-medium text-blue-900 mb-1">Design Steps</h4>
            <p class="text-sm text-blue-700">
              {{ localProject.design_steps?.length || 0 }} design steps configured
            </p>
          </div>
          <button 
            @click="goToDesignSteps"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            🎨 Edit Design Steps
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  project: any
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'cancel', 'goToSteps'])

const localProject = ref(JSON.parse(JSON.stringify(props.project)))

// Dynamic image imports like in the main portfolio
const allImages = import.meta.glob('../../assets/images/**/*.{png,jpg,jpeg}', {
  eager: true,
  import: 'default'
})

// Create mapping for all images
const imageMap = Object.entries(allImages).reduce((acc, [path, module]) => {
  const pathParts = path.split('images/')
  if (pathParts.length > 1) {
    const projectPath = pathParts[1]
    acc[projectPath] = module
    acc[`/images/${projectPath}`] = module
  }
  return acc
}, {} as Record<string, string>)

const isNew = computed(() => {
  return !props.project.id || props.project.id === 0
})

// Ensure design_steps and scorecards are always arrays
if (!localProject.value.design_steps) {
  localProject.value.design_steps = []
}
if (!localProject.value.scorecards) {
  localProject.value.scorecards = []
}

const saveProject = () => {
  // Clean up the project data before saving
  // Note: Design steps are managed separately in DesignStepsManager
  const cleanProject = {
    ...localProject.value
  }
  
  emit('save', cleanProject)
}



const addScorecard = () => {
  const newScorecard = {
    id: Date.now(),
    project_id: localProject.value.id,
    title: 'New Scorecard',
    description: 'Scorecard description',
    preview_image: 'previews/preview_new.png',
    imageAlt: 'Scorecard image',
    order: localProject.value.scorecards.length
  }
  localProject.value.scorecards.push(newScorecard)
}

const removeScorecard = (index: number) => {
  if (confirm('Are you sure you want to delete this scorecard?')) {
    localProject.value.scorecards.splice(index, 1)
  }
}

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return ''
  
  // Check if we have this image in our dynamic imports
  const imageUrl = imageMap[imagePath]
  if (imageUrl) {
    return imageUrl
  }
  
  // Try without /images/ prefix
  const cleanPath = imagePath.startsWith('/images/') ? imagePath.slice(8) : imagePath
  const cleanImageUrl = imageMap[cleanPath]
  if (cleanImageUrl) {
    return cleanImageUrl
  }
  
  // Fallback to public path
  const publicPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`
  return `/images${publicPath}`
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  const imagePath = img.getAttribute('data-original-src') || img.src
  console.error('❌ Image failed to load in editor:', imagePath)
  
  img.style.opacity = '0.3'
  img.title = `Image not found: ${imagePath}`
  img.style.border = '2px dashed #ef4444'
}

const goToDesignSteps = () => {
  // Save current changes first
  saveProject()
  // Emit event to switch to design steps view
  emit('goToSteps', localProject.value)
}

const handleImageUpload = async (event: Event, fieldName: string) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('❌ Please select an image file (PNG, JPG, JPEG)')
    return
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('❌ File size must be less than 5MB')
    return
  }
  
  try {
    // Create a filename based on the original name
    const originalName = file.name.replace(/\s+/g, '_').toLowerCase()
    const timestamp = Date.now()
    const extension = originalName.split('.').pop()
    const baseName = originalName.replace(`.${extension}`, '')
    let filename = `${baseName}_${timestamp}.${extension}`
    
    // Determine the correct folder based on field name
    let folderPath = ''
    if (fieldName === 'preview_image') {
      filename = `previews/${filename}`
      folderPath = 'src/assets/images/previews/'
    } else {
      folderPath = 'src/assets/images/'
    }
    
    // Update the field with the new filename
    localProject.value[fieldName] = filename
    
    // Show success message with clear instructions
    const instructions = `✅ Image selected successfully!

📁 File: ${file.name}
💾 Will be saved as: ${filename}
📂 Place the file in: ${folderPath}

🔄 Steps to complete:
1. Copy your image file to: ${folderPath}
2. Rename it to: ${filename.split('/').pop()}
3. The image will then appear in your project

💡 Tip: You can also drag and drop images directly into the ${folderPath} folder in VS Code or your file explorer.`

    alert(instructions)
    
  } catch (error) {
    console.error('Upload error:', error)
    alert('❌ Failed to process image')
  }
}
</script> 