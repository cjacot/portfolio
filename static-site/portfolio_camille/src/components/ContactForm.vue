<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ContactFormDownArrow from '../assets/icons/contact_form_arrow.svg'
import PortfolioHeader from './portfolio/PortfolioHeader.vue'
import CustomCursor from '../utilities/CustomCursor.vue'
import Footer from './portfolio/Footer.vue'
import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread'
import { initDevTools } from '../utils/devTools'

const formData = ref({
  name: '',
  email: '',
  message: ''
})

const errors = ref({
  name: '',
  email: '',
  message: '',
  database: '',
  submit: ''
})

const isHovering = ref(false)
const buttonPos = ref({ x: 0, y: 0 })
const db = ref(null)
const isMounted = ref(true)
const worker = ref(null)
const isDbReady = ref(false)

// Only import in development
const devTools = process.env.NODE_ENV === 'development' 
  ? import('../utils/devTools.js') 
  : null;

const handleMouseMove = (event: MouseEvent) => {
  if (isHovering.value) {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    buttonPos.value = {
      x: x * 0.1,
      y: y * 0.1
    }
  }
}

const resetButton = () => {
  isHovering.value = false
  buttonPos.value = { x: 0, y: 0 }
}

// Update the worker message handler
const setupWorkerMessageHandler = () => {
  worker.value.onmessage = (e) => {
    if (e.data === 'ready') {
      isDbReady.value = true;
      // Initialize devTools in both dev and prod
      initDevTools(worker.value, isDbReady.value);
    } else if (e.data.type === 'submit-success') {
      formData.value = {
        name: '',
        email: '',
        message: ''
      };
    } else if (e.data.type === 'queryResult') {
      // Only log in development and localhost
      if (
        process.env.NODE_ENV === 'development' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ) {
        const contacts = e.data.result[0]?.values.map(row => ({
          id: row[0],
          name: row[1],
          email: row[2],
          message: row[3],
          created_at: row[4]
        })) || [];
        
        if (contacts.length === 0) {
          console.log('ℹ️ No contacts found in database');
        } else {
          console.log(`📊 Found ${contacts.length} contacts:`);
          console.table(contacts);
        }
      }
    } else if (e.data.type === 'error') {
      errors.value = {
        ...errors.value,
        database: e.data.error
      };
    }
  };
};

// Initialize the database
const initializeDatabase = async () => {
  try {
    console.log("🚀 Initializing database...");
    
    worker.value = new Worker(
      new URL('../workers/sql.worker.js', import.meta.url),
      { type: 'module' }
    );

    setupWorkerMessageHandler();
    await initBackend(worker.value);

  } catch (error) {
    console.error("❌ Error initializing database:", error);
    errors.value = {
      ...errors.value,
      database: 'Failed to initialize database. Please try again later.'
    };
  }
};

// Cleanup function
const cleanup = () => {
  isMounted.value = false;
  if (db.value) {
    try {
      db.value.close();
      db.value = null;
    } catch (error) {
      console.error("Error closing database:", error);
    }
  }
  if (worker.value) {
    worker.value.terminate();
    worker.value = null;
  }
};

// Mount and unmount handlers
onMounted(() => {
  initializeDatabase();
});

onUnmounted(() => {
  cleanup();
});

// Handle form submission
const handleSubmit = async () => {
  if (!isDbReady.value) {
    errors.value = {
      ...errors.value,
      submit: 'Database is not ready. Please try again in a moment.'
    };
    return;
  }

  if (validateForm()) {
    try {
      // Create a plain object with the form data
      const plainFormData = {
        name: formData.value.name,
        email: formData.value.email,
        message: formData.value.message
      };

      worker.value.postMessage({
        action: 'submit-form',
        data: plainFormData
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      errors.value = {
        ...errors.value,
        submit: 'Failed to submit form. Please try again later.'
      };
    }
  }
};

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateForm = (): boolean => {
  let isValid = true
  errors.value = {
    name: '',
    email: '',
    message: '',
    database: '',
    submit: ''
  }

  // Name validation
  if (!formData.value.name.trim()) {
    errors.value.name = 'Veuillez entrer votre nom et prénom'
    isValid = false
  } else if (formData.value.name.length < 2) {
    errors.value.name = 'Votre nom et prénom doivent contenir au moins 2 caractères'
    isValid = false
  }

  // Email validation
  if (!formData.value.email.trim()) {
    errors.value.email = "L'adresse email est requise"
    isValid = false
  } else if (!validateEmail(formData.value.email)) {
    errors.value.email = "L'adresse email n'est pas valide"
    isValid = false
  }

  // Message validation
  if (!formData.value.message.trim()) {
    errors.value.message = 'Veuillez écrire un message pour m\'expliquer la raison de votre contact'
    isValid = false
  } else if (formData.value.message.length < 10) {
    errors.value.message = 'Le message doit contenir au moins 10 caractères'
    isValid = false
  }

  return isValid
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-[#FFFCF6]">
    <CustomCursor />
    <PortfolioHeader />
    <div class="w-[615px] h-[790px] my-32 bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-8 flex flex-col items-center">
      <h1 class="text-black text-2xl mb-8 flex items-center gap-2">
        Me contacter ici 
        <img 
          :src="ContactFormDownArrow" 
          alt="Flèche vers le bas" 
          class="w-6 h-6 animate-float"
        >
      </h1>

      <form @submit.prevent="handleSubmit" class="w-full flex flex-col items-center gap-6">
        <div class="w-full flex flex-col items-center">
          <input 
            v-model="formData.name"
            type="text"
            id="name"
            name="name"
            placeholder="Nom et Prénom"
            autocomplete="name"
            class="w-[478.652px] h-[48.031px] rounded-[5px] border border-black bg-white text-black/50 font-roboto text-[20px] font-extralight px-4"
            :class="{ 'border-red-500': errors.name }"
          >
          <span v-if="errors.name" class="text-red-500 text-sm mt-1 self-start ml-12">{{ errors.name }}</span>
        </div>

        <div class="w-full flex flex-col items-center">
          <input 
            v-model="formData.email"
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            autocomplete="email"
            class="w-[478.652px] h-[48.031px] rounded-[5px] border border-black bg-white text-black/50 font-roboto text-[20px] font-extralight px-4"
            :class="{ 'border-red-500': errors.email }"
          >
          <span v-if="errors.email" class="text-red-500 text-sm mt-1 self-start ml-12">{{ errors.email }}</span>
        </div>

        <div class="w-full flex flex-col items-center">
          <textarea 
            v-model="formData.message"
            id="message"
            name="message"
            placeholder="Votre message"
            class="w-[478.652px] h-[329.047px] rounded-[5px] border border-black bg-white text-black/50 font-roboto text-[20px] font-extralight p-4 resize-none"
            :class="{ 'border-red-500': errors.message }"
          ></textarea>
          <span v-if="errors.message" class="text-red-500 text-sm mt-1 self-start ml-12">{{ errors.message }}</span>
        </div>

        <div class="relative ml-8 self-start max-w-full text-3xl font-light w-[96px]">
          <div 
            class="absolute top-[5px] left-[5px] w-full h-full bg-black"
            :style="{
              transform: isHovering ? `translate(${buttonPos.x}px, ${buttonPos.y}px)` : 'none',
              transition: isHovering ? 'none' : 'transform 0.3s ease-out'
            }"
            ></div>
            
            <button 
            type="submit"
            class="contact-button relative w-full h-[49px] bg-[#91A8EC] border border-black hover:bg-[#7A8FD9] focus:outline-none focus:ring-2 focus:ring-black text-lg"
            @mouseenter="isHovering = true"
            @mouseleave="resetButton"
            @mousemove="handleMouseMove"
            :style="{
              transform: `translate(${buttonPos.x}px, ${buttonPos.y}px)`,
              transition: isHovering ? 'none' : 'transform 0.3s ease-out'
            }"
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
    
  </div>
  <Footer />
</template>

<style scoped>
input:focus, textarea:focus {
  outline: none;
  border-color: #91A8EC;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(10px);
  }
}

.animate-float {
  animation: float 2s ease-in-out infinite;
}
</style> 