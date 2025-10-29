<template>
  <div id="app" class="min-h-screen bg-lighter-dull-green relative">
    <!-- Decorative background elements -->
    <div class="fixed inset-0 pointer-events-none opacity-5 z-0">
      <img 
        src="/src/assets/pics/matchavertical.jpeg" 
        alt="Background" 
        class="absolute top-10 right-10 w-64 h-64 object-cover rounded-full blur-3xl"
      />
      <img 
        src="/src/assets/pics/matchavertical.jpeg" 
        alt="Background" 
        class="absolute bottom-20 left-10 w-64 h-64 object-cover rounded-full blur-3xl"
      />
    </div>
    <nav class="bg-white shadow-md border-b-2 border-matcha-500 animate-fade-in-up">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-2xl font-decorative font-bold text-matcha-600">
                <span class="inline-block hover:animate-wiggle">🍵</span> matchamatch
              </h1>
            </div>
            <div v-if="userStore.isLoggedIn" class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/"
                class="border-transparent text-light-red-brown-gray hover:border-brighter-green hover:text-dark-green inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium font-barlow transition-colors"
              >
                Home
              </router-link>
              <router-link
                to="/collection"
                class="border-transparent text-light-red-brown-gray hover:border-brighter-green hover:text-dark-green inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium font-barlow transition-colors"
              >
                Collection
              </router-link>
              <router-link
                to="/profile"
                class="border-transparent text-light-red-brown-gray hover:border-brighter-green hover:text-dark-green inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium font-barlow transition-colors"
              >
                Profile
              </router-link>
            </div>
          </div>
          <div v-if="userStore.isLoggedIn" class="flex items-center space-x-4">
            <span class="text-sm text-brown font-medium">{{ userStore.displayName }}</span>
            <button
              @click="handleLogout"
              class="px-3 py-1 text-sm bg-cherry-blossom text-brown hover:bg-darker-light-pink font-medium rounded-lg transition-all hover-grow btn-cute"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative z-10">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout()
  router.push('/')
}
</script>

<style>
.router-link-active {
  @apply border-brighter-green text-dark-green font-semibold;
}
</style>
