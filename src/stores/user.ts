import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const userId = ref<string | null>(localStorage.getItem('userId') || null)
  const displayName = ref<string>(localStorage.getItem('displayName') || '')
  const email = ref<string>(localStorage.getItem('email') || '')
  const sweetness = ref<number>(parseInt(localStorage.getItem('sweetness') || '3'))
  const strength = ref<number>(parseInt(localStorage.getItem('strength') || '3'))

  console.log('UserStore initialized:', {
    userId: userId.value,
    displayName: displayName.value,
    email: email.value,
    sweetness: sweetness.value,
    strength: strength.value
  })

  // Getters
  const isLoggedIn = computed(() => !!userId.value)

  // Actions
  function setUser(id: string, name: string, userEmail: string, prefs?: { sweetness?: number; strength?: number }): void {
    console.log('UserStore: setUser called with:', { id, name, userEmail, prefs })
    userId.value = id
    displayName.value = name
    email.value = userEmail
    
    if (prefs?.sweetness !== undefined) {
      sweetness.value = prefs.sweetness
      localStorage.setItem('sweetness', String(prefs.sweetness))
    }
    if (prefs?.strength !== undefined) {
      strength.value = prefs.strength
      localStorage.setItem('strength', String(prefs.strength))
    }
    
    localStorage.setItem('userId', id)
    localStorage.setItem('displayName', name)
    localStorage.setItem('email', userEmail)
    console.log('UserStore: User set successfully, userId:', userId.value)
  }

  function logout(): void {
    userId.value = null
    displayName.value = ''
    email.value = ''
    sweetness.value = 3
    strength.value = 3
    
    localStorage.removeItem('userId')
    localStorage.removeItem('displayName')
    localStorage.removeItem('email')
    localStorage.removeItem('sweetness')
    localStorage.removeItem('strength')
  }

  function updatePreferences(newSweetness: number, newStrength: number): void {
    sweetness.value = newSweetness
    strength.value = newStrength
    localStorage.setItem('sweetness', String(newSweetness))
    localStorage.setItem('strength', String(newStrength))
  }

  return {
    userId,
    displayName,
    email,
    sweetness,
    strength,
    isLoggedIn,
    setUser,
    logout,
    updatePreferences
  }
})
