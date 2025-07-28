<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const isDesktop = ref(false)
const isGrabbing = ref(false)

// Check if cursor is enabled from localStorage
const isCursorEnabled = () => {
  return localStorage.getItem('customCursorEnabled') === 'true'
}

const handleMouseOver = (e: MouseEvent) => {
  if (!isDesktop.value || !isCursorEnabled()) return
  
  const target = e.target as HTMLElement
  if (target.closest('.phone-mockup')) {
    document.body.style.cursor = 'var(--custom-grab-cursor)'
  } else if (
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
  if (target.closest('.phone-mockup')) {
    document.body.style.cursor = 'default'
  } else if (target.style.cursor === 'var(--custom-pointer)') {
    target.style.removeProperty('cursor')
  }
}

const handleMouseDown = (e: MouseEvent) => {
  if (!isDesktop.value || !isCursorEnabled()) return;
  const target = e.target as HTMLElement;
  if (target.closest('.phone-mockup')) {
    isGrabbing.value = true;
    document.body.style.cursor = 'var(--custom-grabbing-cursor)';
  }
};

const handleMouseUp = () => {
  if (!isDesktop.value || !isCursorEnabled()) return;
  if (isGrabbing.value) {
    isGrabbing.value = false;
    // Check if the mouse is still over a phone-mockup to revert to the grab cursor
    const isOverPhoneMockup = document.querySelector('.phone-mockup:hover');
    if (isOverPhoneMockup) {
      document.body.style.cursor = 'var(--custom-grab-cursor)';
    } else {
      document.body.style.cursor = 'default';
    }
  }
};


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
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkDevice)
  if (isDesktop.value) {
    document.removeEventListener('mouseover', handleMouseOver)
    document.removeEventListener('mouseout', handleMouseOut)
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'default'; // Reset cursor on component unmount
  }
})
</script>

<template>
  <div v-if="isDesktop"></div>
</template>

<style>
/* Define custom cursors */
:root {
  --custom-pointer: url('../assets/cursors/custom-pointer.cur'), pointer;
  --custom-grab-cursor: url('../assets/cursors/grab-cursor.svg'), grab;
  --custom-grabbing-cursor: url('../assets/cursors/grabbing-cursor.svg'), grabbing;
}

/* Apply grab/grabbing cursor to the body when interacting with the phone mockup */
body[style*="cursor: var(--custom-grab-cursor)"],
body[style*="cursor: var(--custom-grabbing-cursor)"] {
  /* This ensures the cursor applies globally, which is what we want for a drag-and-drop feel. */
}
</style>