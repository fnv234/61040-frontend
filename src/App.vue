<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-2xl font-bold text-matcha-700">🍵 matchamatch</h1>
            </div>
            <div v-if="userStore.isLoggedIn" class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/"
                class="border-transparent text-gray-500 hover:border-matcha-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </router-link>
              <router-link
                to="/collection"
                class="border-transparent text-gray-500 hover:border-matcha-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Collection
              </router-link>
              <router-link
                to="/profile"
                class="border-transparent text-gray-500 hover:border-matcha-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Profile
              </router-link>
            </div>
          </div>
          <div v-if="userStore.isLoggedIn" class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">{{ userStore.displayName }}</span>
            <button
              @click="handleLogout"
              class="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
  @apply border-matcha-500 text-gray-900;
}
</style>
