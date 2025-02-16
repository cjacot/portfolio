<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import PortfolioHeader from './PortfolioHeader.vue'
import CustomCursor from '../../utilities/CustomCursor.vue'
import Footer from './Footer.vue'
import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread'

const form = ref({
  name: '',
  email: '',
  message: ''
})

const errors = ref({})
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const worker = ref(null)
const isDbReady = ref(false)

onMounted(async () => {
  try {
    console.log("🚀 Initializing database...");
    
    worker.value = new Worker(
      new URL('../../workers/sql.worker.js', import.meta.url),
      { type: 'module' }
    );

    worker.value.onmessage = (e) => {
      if (e.data === 'ready') {
        isDbReady.value = true;
      } else if (e.data.type === 'submit-success') {
        submitSuccess.value = true;
        form.value = { name: '', email: '', message: '' };
      } else if (e.data.type === 'error') {
        errors.value = e.data.error;
      }
    };

    await initBackend(worker.value);
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    errors.value = 'Failed to initialize database';
  }
});

onUnmounted(() => {
  if (worker.value) {
    worker.value.terminate();
  }
});

const handleSubmit = async () => {
  if (!isDbReady.value) {
    errors.value = 'Database not ready';
    return;
  }

  if (!form.value.name || !form.value.email) {
    errors.value = {
      name: !form.value.name ? 'Name is required' : '',
      email: !form.value.email ? 'Email is required' : ''
    };
    return;
  }

  isSubmitting.value = true;
  
  try {
    worker.value.postMessage({
      action: 'submit-form',
      data: form.value
    });
  } catch (error) {
    console.error('Failed to submit form:', error);
    errors.value = 'Failed to submit form';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 p-6 bg-white rounded-lg shadow">
    <div v-if="submitSuccess" class="bg-green-100 text-green-700 p-4 rounded animate-fadeIn mb-4">
      Message sent successfully! ✨
    </div>

    <div class="space-y-2">
      <input
        v-model="form.name"
        type="text"
        placeholder="Your name"
        class="w-full p-2 border rounded focus:border-orange-300 outline-none"
        :class="{ 'border-red-500': errors.name }"
      />
      <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
    </div>

    <div class="space-y-2">
      <input
        v-model="form.email"
        type="email"
        placeholder="Your email"
        class="w-full p-2 border rounded focus:border-orange-300 outline-none"
        :class="{ 'border-red-500': errors.email }"
      />
      <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
    </div>

    <div class="space-y-2">
      <textarea
        v-model="form.message"
        placeholder="Your message"
        class="w-full p-2 border rounded focus:border-orange-300 outline-none"
        rows="4"
      ></textarea>
    </div>

    <button 
      type="submit"
      :disabled="isSubmitting"
      class="w-full bg-orange-300 text-black py-2 px-4 rounded hover:bg-orange-400 transition-colors"
    >
      {{ isSubmitting ? 'Sending...' : 'Send Message' }}
    </button>
  </form>
</template> 