<template>
  <div class="flex flex-col max-h-full">
    <!-- Header -->
    <div class="px-6 py-4 border-b flex justify-between items-center flex-shrink-0">
      <div>
        <h3 class="text-lg font-semibold">Design Steps - {{ localProject.title }}</h3>
        <p class="text-sm text-gray-600">{{ localProject.design_steps?.length || 0 }} steps</p>
      </div>
      <div class="flex gap-2">
        <button 
          @click="addDesignStep" 
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          ➕ Add Step
        </button>
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
    <div class="flex-1 overflow-y-auto min-h-0">
      <!-- Steps List -->
      <div class="p-6">
        <div class="space-y-6">
          <div 
            v-for="(step, stepIndex) in localProject.design_steps" 
            :key="step.id || stepIndex"
            class="bg-white border rounded-lg overflow-hidden"
          >
            <!-- Step Header -->
            <div class="bg-gray-50 px-4 py-3 border-b">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 flex-1">
                  <div class="flex items-center gap-2">
                    <button 
                      @click="moveStep(stepIndex, -1)"
                      :disabled="stepIndex === 0"
                      class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      ⬆️
                    </button>
                    <button 
                      @click="moveStep(stepIndex, 1)"
                      :disabled="stepIndex === localProject.design_steps.length - 1"
                      class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      ⬇️
                    </button>
                  </div>
                  
                  <div class="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Step Type</label>
                      <select 
                        v-model="step.step_type" 
                        class="w-full p-2 border rounded-md text-sm"
                      >
                        <option value="empathy">Empathy</option>
                        <option value="definition">Definition</option>
                        <option value="ideation">Ideation</option>
                        <option value="prototype">Prototype</option>
                        <option value="testing">Testing</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input 
                        v-model="step.custom_description" 
                        type="text" 
                        class="w-full p-2 border rounded-md text-sm"
                      />
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <button 
                      @click="toggleStepExpanded(stepIndex)"
                      class="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                    >
                      {{ expandedSteps.has(stepIndex) ? '🔽' : '▶️' }} 
                      {{ step.content_blocks?.length || 0 }} blocks
                    </button>
                    <button 
                      @click="removeDesignStep(stepIndex)" 
                      class="px-2 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step Content (Expandable) -->
            <div v-if="expandedSteps.has(stepIndex)" class="p-4">
              <!-- Content Blocks -->
              <div class="mb-4">
                <div class="flex justify-between items-center mb-3">
                  <h5 class="font-medium text-gray-800">Content Blocks</h5>
                  <div class="flex gap-2">
                    <button 
                      @click="addContentBlock(stepIndex, 'text')" 
                      class="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                    >
                      ➕ Text
                    </button>
                    <button 
                      @click="addContentBlock(stepIndex, 'image')" 
                      class="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                    >
                      ➕ Image
                    </button>
                  </div>
                </div>
                
                <div class="space-y-4">
                  <div 
                    v-for="(block, blockIndex) in step.content_blocks" 
                    :key="block.id || blockIndex"
                    class="bg-gray-50 rounded-lg p-4 border"
                  >
                    <!-- Block Header -->
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <button 
                          @click="moveContentBlock(stepIndex, blockIndex, -1)"
                          :disabled="blockIndex === 0"
                          class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ⬆️
                        </button>
                        <button 
                          @click="moveContentBlock(stepIndex, blockIndex, 1)"
                          :disabled="blockIndex === step.content_blocks.length - 1"
                          class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          ⬇️
                        </button>
                        <span class="text-sm font-medium text-gray-700">
                          {{ block.block_type === 'text' ? '📝' : '🖼️' }} 
                          {{ block.block_type.charAt(0).toUpperCase() + block.block_type.slice(1) }} Block
                        </span>
                      </div>
                      
                      <div class="flex items-center gap-2">
                        <select 
                          v-model="block.layout" 
                          class="p-1 border rounded text-sm"
                        >
                          <option value="full">Full Width</option>
                          <option value="half">Half Width</option>
                        </select>
                        <input 
                          v-model.number="block.order" 
                          type="number" 
                          class="w-16 p-1 border rounded text-sm"
                          placeholder="Order"
                        />
                        <button 
                          @click="removeContentBlock(stepIndex, blockIndex)" 
                          class="px-2 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    
                    <!-- Text Block Content -->
                    <div v-if="block.block_type === 'text'">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Content (Markdown supported)</label>
                      <textarea 
                        v-model="block.text_content" 
                        class="w-full p-3 border rounded-md text-sm font-mono h-32"
                        placeholder="Enter text content (supports markdown)"
                      ></textarea>
                    </div>
                    
                    <!-- Image Block Content -->
                    <div v-if="block.block_type === 'image'" class="space-y-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Image</label>
                        <div class="flex gap-3">
                          <input 
                            v-model="block.image" 
                            type="text" 
                            class="flex-1 p-2 border rounded-md text-sm"
                            placeholder="image/path.png"
                          />
                          <input 
                            type="file" 
                            accept="image/*" 
                            @change="handleImageUpload($event, block)"
                            class="hidden"
                            :ref="`fileInput-${stepIndex}-${blockIndex}`"
                          />
                          <button 
                            @click="triggerFileInput(stepIndex, blockIndex)"
                            class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                            title="Upload content block image - will be saved to content_blocks/ folder"
                          >
                            📁 Browse Images
                          </button>
                        </div>
                      </div>
                      
                      <!-- Image Preview -->
                      <div v-if="block.image" class="mt-3">
                        <img 
                          :src="getImageUrl(block.image)" 
                          :data-original-src="block.image"
                          :alt="block.image_caption || 'Content image'"
                          class="max-w-xs max-h-40 object-contain border rounded"
                          @error="handleImageError"
                        />
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Caption (optional)</label>
                        <input 
                          v-model="block.image_caption" 
                          type="text" 
                          class="w-full p-2 border rounded-md text-sm"
                          placeholder="Image caption"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  project: any
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'cancel'])

const localProject = ref(JSON.parse(JSON.stringify(props.project)))
const expandedSteps = ref(new Set([0])) // Start with first step expanded

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

// Ensure design_steps is always an array
if (!localProject.value.design_steps) {
  localProject.value.design_steps = []
}

const toggleStepExpanded = (stepIndex: number) => {
  if (expandedSteps.value.has(stepIndex)) {
    expandedSteps.value.delete(stepIndex)
  } else {
    expandedSteps.value.add(stepIndex)
  }
}

const addDesignStep = () => {
  const newStep = {
    id: Date.now(),
    project_id: localProject.value.id,
    step_type: 'empathy',
    custom_description: 'New design step',
    content_blocks: []
  }
  localProject.value.design_steps.push(newStep)
  expandedSteps.value.add(localProject.value.design_steps.length - 1)
}

const removeDesignStep = (index: number) => {
  if (confirm('Are you sure you want to delete this design step?')) {
    localProject.value.design_steps.splice(index, 1)
    expandedSteps.value.delete(index)
  }
}

const moveStep = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < localProject.value.design_steps.length) {
    const steps = localProject.value.design_steps
    const temp = steps[index]
    steps[index] = steps[newIndex]
    steps[newIndex] = temp
    
    // Update expanded state
    const wasExpanded = expandedSteps.value.has(index)
    const wasNewExpanded = expandedSteps.value.has(newIndex)
    
    expandedSteps.value.delete(index)
    expandedSteps.value.delete(newIndex)
    
    if (wasExpanded) expandedSteps.value.add(newIndex)
    if (wasNewExpanded) expandedSteps.value.add(index)
  }
}

const addContentBlock = (stepIndex: number, blockType: 'text' | 'image') => {
  const newBlock = {
    id: Date.now(),
    design_step_id: localProject.value.design_steps[stepIndex].id,
    block_type: blockType,
    layout: 'full',
    group: 0,
    order: localProject.value.design_steps[stepIndex].content_blocks.length,
    text_content: blockType === 'text' ? '' : '',
    image: blockType === 'image' ? '' : '',
    image_caption: blockType === 'image' ? null : null
  }
  localProject.value.design_steps[stepIndex].content_blocks.push(newBlock)
}

const removeContentBlock = (stepIndex: number, blockIndex: number) => {
  if (confirm('Are you sure you want to delete this content block?')) {
    localProject.value.design_steps[stepIndex].content_blocks.splice(blockIndex, 1)
  }
}

const moveContentBlock = (stepIndex: number, blockIndex: number, direction: number) => {
  const blocks = localProject.value.design_steps[stepIndex].content_blocks
  const newIndex = blockIndex + direction
  
  if (newIndex >= 0 && newIndex < blocks.length) {
    const temp = blocks[blockIndex]
    blocks[blockIndex] = blocks[newIndex]
    blocks[newIndex] = temp
    
    // Update order numbers
    blocks[blockIndex].order = blockIndex
    blocks[newIndex].order = newIndex
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
  console.error('❌ Content block image failed to load:', imagePath)
  
  img.style.opacity = '0.3'
  img.title = `Content block image not found: ${imagePath}`
  img.style.border = '2px dashed #ef4444'
}

const triggerFileInput = (stepIndex: number, blockIndex: number) => {
  const fileInput = document.querySelector(`input[type="file"]`) as HTMLInputElement
  if (fileInput) {
    fileInput.dataset.stepIndex = stepIndex.toString()
    fileInput.dataset.blockIndex = blockIndex.toString()
    fileInput.click()
  }
}

const handleImageUpload = async (event: Event, block: any) => {
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
    const filename = `${baseName}_${timestamp}.${extension}`
    
    // Update the block with the new filename
    block.image = `content_blocks/${filename}`
    
    // Show success message with clear instructions
    const instructions = `✅ Content block image selected successfully!

📁 File: ${file.name}
💾 Will be saved as: content_blocks/${filename}
📂 Place the file in: src/assets/images/content_blocks/

🔄 Steps to complete:
1. Copy your image file to: src/assets/images/content_blocks/
2. Rename it to: ${filename}
3. The image will then appear in your design step

💡 Tip: You can also drag and drop images directly into the content_blocks folder in VS Code or your file explorer.`

    alert(instructions)
    
  } catch (error) {
    console.error('Upload error:', error)
    alert('❌ Failed to process image')
  }
}

const saveProject = () => {
  // Clean up the project data before saving
  const cleanProject = {
    ...localProject.value,
    design_steps: localProject.value.design_steps.map((step, index) => ({
      ...step,
      id: step.id || Date.now() + index,
      project_id: localProject.value.id,
      content_blocks: step.content_blocks.map((block, blockIndex) => ({
        ...block,
        id: block.id || Date.now() + index * 1000 + blockIndex,
        design_step_id: step.id || Date.now() + index,
        group: block.group || 0,
        text_content: block.text_content || '',
        image: block.image || '',
        image_caption: block.image_caption || null
      }))
    }))
  }
  
  emit('save', cleanProject)
}
</script> 