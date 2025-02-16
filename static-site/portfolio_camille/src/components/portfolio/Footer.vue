<script setup lang="ts">
const socialLinks = [
  {
    name: 'Upwork',
    url: '#',
    icon: `<svg xmlns="http://www.w3.org/dialog" viewBox="0 0 24 24" class="w-[22px] h-[22px]">
            <path fill="currentColor" d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.543-2.546V3.492H0v7.112c0 2.917 2.37 5.297 5.281 5.297 2.913 0 5.283-2.38 5.283-5.297V9.06c.53 1.107 1.182 2.226 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
          </svg>`,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/camillejacot/',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-[22px] h-[22px]">
            <path fill="currentColor" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>`,
  },
  {
    name: 'Dribbble',
    url: '#',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-[22px] h-[22px]">
            <path fill="currentColor" d="M12 0c-6.628 0-12 5.373-12 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.358 5.548-4.082 1.35 1.594 2.197 3.619 2.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68-1.016-1.861-2.178-3.676-3.488-5.438.779-.197 1.591-.314 2.431-.314 2.275 0 4.368.779 6.043 2.072zm-10.516-.993c1.331 1.742 2.511 3.538 3.537 5.381-2.43.715-5.331 1.082-8.684 1.105.692-2.835 2.601-5.193 5.147-6.486zm-5.44 8.834l.013-.256c3.849-.005 7.169-.448 9.95-1.322.233.475.456.952.67 1.432-3.38 1.057-6.165 3.222-8.337 6.48-1.432-1.719-2.296-3.927-2.296-6.334zm3.829 7.81c1.969-3.088 4.482-5.098 7.598-6.027.928 2.42 1.609 4.91 2.043 7.46-3.349 1.291-6.953.666-9.641-1.433zm11.586.43c-.438-2.353-1.08-4.653-1.92-6.897 1.876-.265 3.94-.196 6.199.196-.437 2.786-2.028 5.192-4.279 6.701z"/>
          </svg>`,
  },
];
</script>

<template>
  <div class="mb-8">
    <footer class="w-[526px] h-[22px] mx-auto">
      <div class="flex items-center justify-center h-full">
        <!-- Left arrow -->
        <div class="w-[48px] h-px bg-black"></div>
        
        <!-- Social icons with spacing -->
        <div class="flex items-center">
          <template v-for="(link, index) in socialLinks" :key="link.name">
            <!-- Add spacing before first icon -->
            <div v-if="index === 0" class="w-[48px]"></div>
            
            <!-- Social icon -->
            <a 
              :href="link.url" 
              :aria-label="link.name"
              class="hover:opacity-75 transition-opacity"
              v-html="link.icon"
            ></a>
            
            <!-- Add spacing between icons -->
            <div v-if="index !== socialLinks.length - 1" class="w-[38px]"></div>
            
            <!-- Add spacing after last icon -->
            <div v-if="index === socialLinks.length - 1" class="w-[48px]"></div>
          </template>
        </div>
        
        <!-- Right arrow -->
        <div class="w-[48px] h-px bg-black"></div>
      </div>
    </footer>
  </div>
</template>
