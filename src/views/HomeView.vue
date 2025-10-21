<template>
  <div class="px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Matcha Tracker 🍵
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Track your matcha experiences, discover new places, and find your perfect cup
      </p>
    </div>

    <div v-if="!userStore.isLoggedIn" class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <!-- Tab Navigation -->
      <div class="flex border-b mb-6">
        <button
          @click="activeTab = 'login'"
          :class="[
            'flex-1 py-2 text-center font-medium transition-colors',
            activeTab === 'login' 
              ? 'border-b-2 border-matcha-600 text-matcha-600' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          Log In
        </button>
        <button
          @click="activeTab = 'signup'"
          :class="[
            'flex-1 py-2 text-center font-medium transition-colors',
            activeTab === 'signup' 
              ? 'border-b-2 border-matcha-600 text-matcha-600' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          Sign Up
        </button>
      </div>
      
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ successMessage }}
      </div>
      
      <!-- Login Form -->
      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="loginForm.email"
            type="email"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="loginForm.password"
            type="password"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500 disabled:bg-gray-100"
          />
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-matcha-600 text-white py-2 px-4 rounded-md hover:bg-matcha-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Logging In...' : 'Log In' }}
        </button>
      </form>
      
      <!-- Sign Up Form -->
      <form v-if="activeTab === 'signup'" @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
          <input
            v-model="signupForm.displayName"
            type="text"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="signupForm.email"
            type="email"
            required
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="signupForm.password"
            type="password"
            required
            minlength="6"
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            v-model="signupForm.confirmPassword"
            type="password"
            required
            minlength="6"
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500 disabled:bg-gray-100"
          />
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-matcha-600 text-white py-2 px-4 rounded-md hover:bg-matcha-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>
    </div>

    <div v-else class="space-y-6">
      <!-- Map Section -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold text-gray-900">Discover Matcha Places Near You</h2>
          <button
            @click="getUserLocation"
            class="px-4 py-2 bg-matcha-600 text-white rounded-md hover:bg-matcha-700 transition-colors text-sm"
          >
            📍 Use My Location
          </button>
        </div>
        
        <MapView 
          :places="nearbyPlaces" 
          :userLocation="userLocation"
          @place-click="handlePlaceClick"
        />
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <router-link
          to="/places"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div class="text-4xl mb-3">📍</div>
          <h3 class="text-xl font-semibold mb-2">Explore Places</h3>
          <p class="text-gray-600">Browse all matcha cafes and shops</p>
        </router-link>

        <router-link
          to="/logs"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div class="text-4xl mb-3">📝</div>
          <h3 class="text-xl font-semibold mb-2">My Logs</h3>
          <p class="text-gray-600">View and manage your experiences</p>
        </router-link>

        <router-link
          to="/profile"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div class="text-4xl mb-3">👤</div>
          <h3 class="text-xl font-semibold mb-2">Profile</h3>
          <p class="text-gray-600">See preferences and recommendations</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { userDirectoryAPI, placeDirectoryAPI } from '@/services/api'
import MapView from '@/components/MapView.vue'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('login')

const loginForm = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Map-related state
const nearbyPlaces = ref([])
const userLocation = ref(null)

// Get user's location
const getUserLocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = [position.coords.longitude, position.coords.latitude]
        loadNearbyPlaces()
      },
      (error) => {
        console.error('Error getting location:', error)
        // Default to Boston/Cambridge area
        userLocation.value = [-71.0942, 42.3601]
        loadNearbyPlaces()
      }
    )
  } else {
    // Default location if geolocation not available
    userLocation.value = [-71.0942, 42.3601]
    loadNearbyPlaces()
  }
}

// Load nearby places from API
const loadNearbyPlaces = async () => {
  if (!userLocation.value) return
  
  try {
    const response = await placeDirectoryAPI.findNearby(userLocation.value, 50000) // 50km radius to catch all sample places
    
    // Fetch full details for each place ID
    if (response.placeIds && response.placeIds.length > 0) {
      const placeDetailsPromises = response.placeIds.map(placeId => 
        placeDirectoryAPI.getDetails(placeId)
      )
      const placeDetails = await Promise.all(placeDetailsPromises)
      nearbyPlaces.value = placeDetails.map(detail => detail.place)
    } else {
      nearbyPlaces.value = []
    }
  } catch (error) {
    console.error('Error loading nearby places:', error)
    nearbyPlaces.value = []
  }
}

// Handle place click from map
const handlePlaceClick = (placeId) => {
  router.push(`/places/${placeId}`)
}

// Load places when user logs in
onMounted(() => {
  if (userStore.isLoggedIn) {
    getUserLocation()
  }
})

// Simple auth storage (for demo - in production use secure backend auth)
const getStoredAccounts = () => {
  const accounts = localStorage.getItem('matcha_accounts')
  return accounts ? JSON.parse(accounts) : {}
}

const saveAccount = (email, password, userId, displayName) => {
  const accounts = getStoredAccounts()
  accounts[email] = { password, userId, displayName }
  localStorage.setItem('matcha_accounts', JSON.stringify(accounts))
}

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const accounts = getStoredAccounts()
    const account = accounts[loginForm.value.email]
    
    if (!account) {
      throw new Error('No account found with this email. Please sign up first.')
    }
    
    if (account.password !== loginForm.value.password) {
      throw new Error('Incorrect password. Please try again.')
    }
    
    // Log in the user
    userStore.setUser(account.userId, account.displayName, loginForm.value.email)
    successMessage.value = 'Successfully logged in!'
  } catch (error) {
    console.error('Error logging in:', error)
    errorMessage.value = error.message || 'Failed to log in. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleSignup = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    // Validate passwords match
    if (signupForm.value.password !== signupForm.value.confirmPassword) {
      throw new Error('Passwords do not match.')
    }
    
    // Check if email already exists
    const accounts = getStoredAccounts()
    if (accounts[signupForm.value.email]) {
      throw new Error('An account with this email already exists. Please log in.')
    }
    
    // Generate userId
    const userId = `user_${Date.now()}`
    
    // Register user in backend
    await userDirectoryAPI.registerUser({
      userId,
      displayName: signupForm.value.displayName,
      email: signupForm.value.email
    })
    
    // Save credentials locally
    saveAccount(
      signupForm.value.email,
      signupForm.value.password,
      userId,
      signupForm.value.displayName
    )
    
    // Log in the user
    userStore.setUser(userId, signupForm.value.displayName, signupForm.value.email)
    successMessage.value = 'Account created successfully!'
  } catch (error) {
    console.error('Error creating account:', error)
    errorMessage.value = error.message || 'Failed to create account. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
