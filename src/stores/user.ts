import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const userId = ref<string | null>(localStorage.getItem('userId') || null)
  const displayName = ref<string>(localStorage.getItem('displayName') || '')
  const email = ref<string>(localStorage.getItem('email') || '')

  // Getters
  const isLoggedIn = computed(() => !!userId.value)

  // Actions
  function setUser(id: string, name: string, userEmail: string): void {
    userId.value = id
    displayName.value = name
    email.value = userEmail
    
    localStorage.setItem('userId', id)
    localStorage.setItem('displayName', name)
    localStorage.setItem('email', userEmail)
  }

  function logout(): void {
    userId.value = null
    displayName.value = ''
    email.value = ''
    
    localStorage.removeItem('userId')
    localStorage.removeItem('displayName')
    localStorage.removeItem('email')
  }

  return {
    userId,
    displayName,
    email,
    isLoggedIn,
    setUser,
    logout
  }
})
