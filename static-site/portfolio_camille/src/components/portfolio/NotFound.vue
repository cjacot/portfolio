<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-[#FFFCF6] p-4">
    <h1 class="text-4xl font-light mb-4">404 - Page non trouvée</h1>
    <p class="text-xl mb-8">La page que vous recherchez n'existe pas.</p>
    <router-link 
      to="/" 
      class="px-6 py-3 bg-orange-300 border border-black hover:bg-orange-400 transition-colors"
    >
      Retour à l'accueil
    </router-link>
  </div>
</template> 