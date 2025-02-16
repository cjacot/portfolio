<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: 'card',
    validator: (value: string) => ['card', 'text', 'profile', 'table'].includes(value)
  }
})
</script>

<template>
  <div class="animate-pulse">
    <!-- Project Card Skeleton -->
    <div v-if="type === 'card'" class="space-y-4 border p-4 rounded-lg">
      <div class="h-48 bg-gray-200 rounded-lg"></div>
      <div class="space-y-3">
        <div class="h-6 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Text Content Skeleton -->
    <div v-else-if="type === 'text'" class="space-y-3">
      <div class="h-4 bg-gray-200 rounded w-full"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      <div class="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>

    <!-- Profile Skeleton -->
    <div v-else-if="type === 'profile'" class="flex items-center space-x-4">
      <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div class="space-y-2">
        <div class="h-4 bg-gray-200 rounded w-32"></div>
        <div class="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    </div>

    <!-- Table Skeleton -->
    <div v-else-if="type === 'table'" class="space-y-4">
      <div class="grid grid-cols-3 gap-4">
        <div class="h-4 bg-gray-200 rounded col-span-1"></div>
        <div class="h-4 bg-gray-200 rounded col-span-1"></div>
        <div class="h-4 bg-gray-200 rounded col-span-1"></div>
      </div>
      <div v-for="i in 3" :key="i" class="grid grid-cols-3 gap-4">
        <div class="h-3 bg-gray-200 rounded col-span-1"></div>
        <div class="h-3 bg-gray-200 rounded col-span-1"></div>
        <div class="h-3 bg-gray-200 rounded col-span-1"></div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes shimmer {
  0% { background-position: -1000px 0 }
  100% { background-position: 1000px 0 }
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
  background-size: 1000px 100%;
}
</style> 