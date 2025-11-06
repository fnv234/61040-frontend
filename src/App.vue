<template>
  <div id="app" class="min-h-screen bg-lighter-dull-green relative">
    <!-- Decorative background elements -->
    <div class="fixed inset-0 pointer-events-none opacity-5 z-0">
      <img 
        :src="matchaImage" 
        alt="Background" 
        class="absolute top-10 right-10 w-64 h-64 object-cover rounded-full blur-3xl"
      />
      <img 
        :src="matchaImage" 
        alt="Background" 
        class="absolute bottom-20 left-10 w-64 h-64 object-cover rounded-full blur-3xl"
      />
    </div>
    <nav class="bg-gradient-to-r from-white via-matcha-50 to-white shadow-lg border-b-2 border-matcha-300 animate-fade-in-up backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <div class="bg-gradient-to-br from-brighter-green to-matcha-green p-2 rounded-xl shadow-md hover:scale-110 transition-transform">
                <span class="text-2xl inline-block hover:animate-wiggle">🍵</span>
              </div>
              <h1 class="ml-3 text-2xl font-decorative font-bold bg-gradient-to-r from-matcha-600 to-brighter-green bg-clip-text text-transparent">
                matchamatch
              </h1>
            </div>
            <div v-if="userStore.isLoggedIn" class="hidden sm:ml-8 sm:flex sm:space-x-2">
              <router-link
                to="/"
                class="nav-link group px-4 py-2 rounded-lg text-sm font-medium font-barlow transition-all hover:bg-matcha-100 flex items-center gap-2"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">🏠</span>
                <span>Home</span>
              </router-link>
              <router-link
                to="/collection"
                class="nav-link group px-4 py-2 rounded-lg text-sm font-medium font-barlow transition-all hover:bg-matcha-100 flex items-center gap-2"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">⭐</span>
                <span>Collection</span>
              </router-link>
              <router-link
                to="/profile"
                class="nav-link group px-4 py-2 rounded-lg text-sm font-medium font-barlow transition-all hover:bg-matcha-100 flex items-center gap-2"
              >
                <span class="text-lg group-hover:scale-110 transition-transform">👤</span>
                <span>Profile</span>
              </router-link>
            </div>
          </div>
          <div v-if="userStore.isLoggedIn" class="flex items-center space-x-4">
            <div class="hidden md:flex items-center gap-2 px-3 py-1 bg-white/60 rounded-full shadow-sm">
              <span class="text-xs text-gray-500">👋</span>
              <span class="text-sm text-brown font-medium">{{ userStore.displayName }}</span>
            </div>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm bg-gradient-to-r from-cherry-blossom to-darker-light-pink text-white hover:shadow-lg font-medium rounded-full transition-all hover:scale-105 btn-cute"
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
.nav-link {
  @apply text-light-red-brown-gray;
}

.nav-link.router-link-active {
  @apply bg-matcha-200 text-dark-green font-semibold shadow-sm;
}
</style>
