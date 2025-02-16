<template>
    <div class="fixed right-0 top-1/2 -translate-y-1/2 z-50">
        <!-- Minimized View -->
        <div @mouseenter="isExpanded = true"
             class="w-14 flex flex-col items-center cursor-pointer">
            <div v-for="(step, index) in steps" 
                 :key="index"
                 class="mb-3 last:mb-0">
                <div :class="[
                    'rounded transition-all duration-200',
                    activeStep === step.step_type ? 'h-1 w-6' : 'h-0.5 w-4',
                    {
                        'bg-[#FFC567]': step.step_type === 'empathy',
                        'bg-[#91A8EC]': step.step_type === 'definition',
                        'bg-[#22A092]': step.step_type === 'ideation',
                        'bg-[#FF6D52]': step.step_type === 'prototype',
                        'bg-[#eaeaea]': step.step_type === 'testing',
                    }
                ]"></div>
            </div>
        </div>

        <!-- Expanded View -->
        <div v-if="isExpanded"
             @mouseleave="isExpanded = false"
             class="absolute right-10 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-[14px] shadow-lg p-3 w-64 transform transition-transform duration-200">
            <div class="space-y-2">
                <button v-for="step in steps" 
                        :key="step.id"
                        @click="scrollToStep(step.step_type)"
                        :class="[
                            'block w-full text-left px-2 py-1 text-sm rounded transition-colors duration-200',
                            {
                                'bg-[#FFC567]/10 hover:bg-[#FFC567]/20': step.step_type === 'empathy',
                                'bg-[#91A8EC]/10 hover:bg-[#91A8EC]/20': step.step_type === 'definition',
                                'bg-[#22A092]/10 hover:bg-[#22A092]/20': step.step_type === 'ideation',
                                'bg-[#FF6D52]/10 hover:bg-[#FF6D52]/20': step.step_type === 'prototype',
                                'bg-[#eaeaea] hover:bg-gray-100': step.step_type === 'testing'
                            },
                            activeStep === step.step_type ? 'font-medium' : 'font-normal'
                        ]">
                    {{ getStepTypeDisplay(step.step_type) }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
    steps: any[],
    getStepTypeDisplay: Function,
    scrollToStep: Function
}>()

const isExpanded = ref(false)
const activeStep = ref('')

const updateActiveStep = () => {
    const sections = props.steps.map(step => ({
        id: step.step_type,
        element: document.getElementById('step-' + step.step_type)
    }))

    // Get all visible sections
    const visibleSections = sections.filter(section => {
        if (!section.element) return false
        const rect = section.element.getBoundingClientRect()
        // Consider a section visible if it's within the viewport
        return rect.top < window.innerHeight && rect.bottom > 0
    })

    // Find the most visible section
    const current = visibleSections.reduce((most, section) => {
        const rect = section.element.getBoundingClientRect()
        const visibility = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
        if (!most || visibility > most.visibility) {
            return { section, visibility }
        }
        return most
    }, null)

    activeStep.value = current ? current.section.id : sections[0]?.id
}

onMounted(() => {
    window.addEventListener('scroll', updateActiveStep)
    updateActiveStep()
})

onUnmounted(() => {
    window.removeEventListener('scroll', updateActiveStep)
})
</script> 