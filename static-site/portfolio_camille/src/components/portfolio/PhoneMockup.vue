
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const phoneContentRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
let startY: number;
let scrollTop: number;

const handleMouseDown = (e: MouseEvent) => {
  if (!phoneContentRef.value) return;
  isDragging.value = true;
  phoneContentRef.value.classList.add('grabbing');
  startY = e.pageY - phoneContentRef.value.offsetTop;
  scrollTop = phoneContentRef.value.scrollTop;
};

const handleMouseUp = () => {
  isDragging.value = false;
  if (phoneContentRef.value) {
    phoneContentRef.value.classList.remove('grabbing');
  }
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !phoneContentRef.value) return;
  e.preventDefault();
  const y = e.pageY - phoneContentRef.value.offsetTop;
  const walk = (y - startY) * 2; // Scroll speed
  phoneContentRef.value.scrollTop = scrollTop - walk;
};

onMounted(() => {
  window.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener('mouseup', handleMouseUp);
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<template>
  <div class="phone-mockup">
    <div class="phone-frame">
      <div 
        ref="phoneContentRef" 
        class="phone-content"
        @mousedown="handleMouseDown"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phone-mockup {
  position: relative;
  width: 375px; /* iPhone X width */
  height: 812px; /* iPhone X height */
  margin: auto;
}

.phone-frame {
  width: 100%;
  height: 100%;
  background: #111;
  border-radius: 40px;
  padding: 15px;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  box-sizing: border-box;
}

.phone-content {
  width: 100%;
  height: 100%;
  background: white;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  cursor: grab;
  border-radius: 25px;
}

.phone-content::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Chrome, Safari and Opera */
}

.phone-content {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.phone-content.grabbing {
  cursor: grabbing;
}
</style> 