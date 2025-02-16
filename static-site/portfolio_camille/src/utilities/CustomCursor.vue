<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

const isDesktop = ref(false)

// Check if cursor is enabled from localStorage
const isCursorEnabled = () => {
  return localStorage.getItem('customCursorEnabled') === 'true'
}

const handleMouseOver = (e: MouseEvent) => {
  if (!isDesktop.value || !isCursorEnabled()) return
  
  const target = e.target as HTMLElement
  if (
    target.tagName === 'A' ||
    target.tagName === 'BUTTON' ||
    target.closest('a') ||
    target.closest('button') ||
    target.style.cursor === 'pointer' ||
    getComputedStyle(target).cursor === 'pointer'
  ) {
    target.style.cursor = 'var(--custom-pointer)'
  }
}

const handleMouseOut = (e: MouseEvent) => {
  if (!isDesktop.value) return
  
  const target = e.target as HTMLElement
  if (target.style.cursor === 'var(--custom-pointer)') {
    target.style.removeProperty('cursor')
  }
}

// Check device and cursor enabled state
const checkDevice = () => {
  isDesktop.value = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches
}

onMounted(() => {
  checkDevice()
  window.addEventListener('resize', checkDevice)
  
  if (isDesktop.value) {
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkDevice)
  if (isDesktop.value) {
    document.removeEventListener('mouseover', handleMouseOver)
    document.removeEventListener('mouseout', handleMouseOut)
  }
})
</script>

<template>
  <div v-if="isDesktop"></div>
</template>

<style scoped>
/* Smooth transitions for cursor changes */
* {
  transition: cursor 0.1s ease;
}
</style>