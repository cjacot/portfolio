<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const meta = computed(() => route.meta)
</script>

<template>
  <vue-meta>
    <template v-slot:title>{{ meta.title }}</template>
    <template v-slot:meta>
      <meta name="description" :content="meta.description">
      <meta property="og:title" :content="meta.title">
      <meta property="og:description" :content="meta.description">
      <meta property="og:image" :content="meta.image">
      <meta name="twitter:card" content="summary_large_image">
    </template>
  </vue-meta>
</template> 