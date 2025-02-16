<script setup lang="ts">
const beforeLeave = (el: Element) => {
  // Save scroll position if needed
}

const enter = (el: Element, done: () => void) => {
  done()
}

const afterEnter = (el: Element) => {
  // Restore scroll position if needed
}
</script>

<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition
        name="page"
        mode="out-in"
        @before-leave="beforeLeave"
        @enter="enter"
        @after-enter="afterEnter"
      >
        <div :key="$route.fullPath">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.app-container {
  min-height: 100vh;
  background-color: #FFFCF6;
}

/* Add global styles */
body {
  font-family: 'Roboto', sans-serif;
  color: #1E1E1E;
}
</style>
