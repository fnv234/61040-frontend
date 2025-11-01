<template>
  <div class="px-4 py-8 relative">
    <div v-if="!userStore.isLoggedIn" class="text-center mb-12 animate-fade-in-up">
      <!-- Cute matcha image -->
      <div class="mb-6 flex justify-center">
        <img 
          src="/src/assets/pics/matchavertical.jpeg" 
          alt="Matcha" 
          class="w-48 h-48 object-cover rounded-full shadow-lg hover-lift"
        />
      </div>
      <h1 class="text-5xl font-decorative text-matcha-600 mb-4">
        <span class="inline-block animate-float">🍵</span> Welcome to matchamatch
      </h1>
      <p class="text-xl text-light-red-brown-gray max-w-2xl mx-auto font-barlow">
        Discover matcha places, track your experiences, and find your perfect cup ✨
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
          class="w-full bg-brighter-green text-white py-2 px-4 rounded-lg hover:bg-matcha-green transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium btn-cute"
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

        <!-- Preference Sliders -->
        <div class="pt-4 border-t">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Your Matcha Preferences</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-700 mb-2">
                Sweetness Preference: <span class="font-medium">{{ signupForm.sweetness }}</span>
              </label>
              <input
                v-model.number="signupForm.sweetness"
                type="range"
                min="1"
                max="5"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-matcha-600"
              />
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>Not Sweet</span>
                <span>Very Sweet</span>
              </div>
            </div>

            <div>
              <label class="block text-sm text-gray-700 mb-2">
                Strength Preference: <span class="font-medium">{{ signupForm.strength }}</span>
              </label>
              <input
                v-model.number="signupForm.strength"
                type="range"
                min="1"
                max="5"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-matcha-600"
              />
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>Mild</span>
                <span>Strong</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
              <input
                v-model="signupForm.location"
                type="text"
                placeholder="e.g., Boston, MA"
                :disabled="isLoading"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-brighter-green text-white py-2 px-4 rounded-lg hover:bg-matcha-green transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium btn-cute"
        >
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>
    </div>

    <div v-else class="space-y-4">
      <!-- User Info and Location with Waves Background -->
      <div class="relative mb-6 rounded-xl overflow-hidden">
        <!-- Waves Background - Constrained to this section -->
        <Waves 
          :lineColor="'rgba(139, 195, 74, 0.2)'"
          :backgroundColor="'linear-gradient(135deg, rgba(245, 251, 238, 0.6), rgba(232, 245, 233, 0.6))'"
          :waveSpeedX="0.015"
          :waveSpeedY="0.008"
          :waveAmpX="25"
          :waveAmpY="15"
          :xGap="12"
          :yGap="36"
          :customStyle="{ position: 'absolute', height: '100%' }"
        />
        <div class="relative z-10 flex items-center justify-between p-6 animate-fade-in-up">
          <router-link 
            to="/profile" 
            class="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all hover-lift"
          >
            <div class="w-10 h-10 bg-matcha-100 rounded-full flex items-center justify-center">
              <span class="text-xl">👤</span>
            </div>
            <span class="font-medium">{{ userStore.displayName }}</span>
          </router-link>
          
          <button
            @click="getUserLocation"
            class="px-4 py-2 bg-brighter-green text-white rounded-lg hover:bg-matcha-green transition-all text-sm font-medium btn-cute hover-grow"
          >
            📍 Use My Location
          </button>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-4">
        <div class="flex gap-4">
          <div class="flex-1">
            <GlassSurface 
              :width="'100%'"
              :height="48"
              :borderRadius="8"
              :brightness="98"
              :opacity="0.9"
              class="glass-input"
            >
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search for matcha places..."
                class="w-full h-full px-4 py-2 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-500"
                @input="handleSearch"
              />
            </GlassSurface>
          </div>
          <button
            @click="showFilters = !showFilters"
            class="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <span>🔍 Filters</span>
            <span class="text-sm">{{ showFilters ? '▲' : '▼' }}</span>
          </button>
        </div>

        <!-- Expandable Filters -->
        <div v-if="showFilters" class="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <select
              v-model="filterRating"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500"
            >
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sweetness</label>
            <select
              v-model="filterSweetness"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500"
            >
              <option value="">All Sweetness</option>
              <option value="1">Not Sweet</option>
              <option value="2">Slightly Sweet</option>
              <option value="3">Medium</option>
              <option value="4">Sweet</option>
              <option value="5">Very Sweet</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Style</label>
            <select
              v-model="filterStyle"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500"
            >
              <option value="">All Styles</option>
              <option value="Ceremonial">Ceremonial</option>
              <option value="Latte">Latte</option>
              <option value="Iced">Iced</option>
              <option value="Dessert">Dessert</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Main Content: Map + Sidebar -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Map Section (2/3 width) -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <MapView 
            :places="filteredPlaces" 
            :userLocation="userLocation"
            @place-click="handlePlaceClick"
          />
        </div>

        <!-- Sidebar: For You + Collection Button (1/3 width) -->
        <div class="space-y-4">
          <!-- For You Section -->
          <div class="bg-white rounded-lg shadow-md p-4 animate-fade-in-up hover-lift">
            <h3 class="text-xl font-decorative text-matcha-600 mb-3">
              <span class="inline-block animate-pulse-soft">✨</span> For You
            </h3>
            
            <!-- Loading State -->
            <div v-if="loadingRecommendations" class="text-center py-8">
              <div class="inline-block animate-float text-4xl mb-2">🍵</div>
              <p class="text-sm text-gray-500 font-decorative">Brewing recommendations...</p>
            </div>
            
            <!-- Empty State -->
            <div v-else-if="recommendedPlaces.length === 0" class="text-center py-8 text-sm text-gray-500">
              <div class="text-3xl mb-2 animate-bounce-gentle">🌱</div>
              <p class="font-decorative">Loading recommendations!...</p>
            </div>
            
            <!-- Recommendations -->
            <div v-else class="space-y-2">
              <SpotlightCard
                v-for="place in recommendedPlaces"
                :key="place._id"
                @click="handlePlaceClick(place._id)"
                :spotlightColor="'rgba(139, 195, 74, 0.25)'"
                class="cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div class="font-medium text-dark-green">{{ place.name }}</div>
                <div class="text-sm text-gray-600">{{ place.address }}</div>
                <div class="flex items-center gap-2 mt-1 flex-wrap">
                  <span class="text-sm">⭐ {{ place.avgRating !== undefined && place.avgRating !== null ? place.avgRating.toFixed(1) : 'N/A' }}</span>
                  <span v-if="place.avgSweetness" class="text-sm text-matcha-600">🍯 {{ place.avgSweetness.toFixed(1) }}/5</span>
                  <span class="text-sm text-gray-500">{{ place.distance?.toFixed(1) }} km</span>
                </div>
              </SpotlightCard>
            </div>
          </div>

          <!-- Collection Button -->
          <router-link
            to="/collection"
            class="block bg-gradient-to-br from-brighter-green to-matcha-green text-white rounded-lg shadow-md p-4 hover:shadow-xl transition-all text-center btn-cute hover-lift overflow-hidden relative"
          >
            <div class="text-2xl mb-2 animate-bounce-gentle relative z-10">⭐</div>
            <h3 class="text-lg font-semibold relative z-10">Collection</h3>
            <p class="text-sm opacity-90 mt-1 relative z-10">View saved places & logs</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import MapView from '@/components/MapView.vue'
import GlassSurface from '@/components/GlassSurface.vue'
import SpotlightCard from '@/components/SpotlightCard.vue'
import Waves from '@/components/Waves.vue'
import { userDirectoryAPI, placeDirectoryAPI, recommendationEngineAPI, experienceLogAPI } from '@/services/api'

const router = useRouter()
const route = useRoute()
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
  confirmPassword: '',
  sweetness: 3,
  strength: 3,
  location: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Map-related state
const nearbyPlaces = ref([])
const userLocation = ref(null)
const recommendedPlaces = ref([])
const loadingRecommendations = ref(false)

// Search and filter state
const searchQuery = ref('')
const filterRating = ref('')
const filterSweetness = ref('')
const filterStyle = ref('')
const filteredPlaces = ref([])
const showFilters = ref(false)

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

// Calculate distance between two coordinates in km
const calculateDistance = (coords1, coords2) => {
  const [lon1, lat1] = coords1
  const [lon2, lat2] = coords2
  
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Load nearby places from API
const loadNearbyPlaces = async () => {
  if (!userLocation.value) {
    console.warn('No user location available')
    return
  }
  
  console.log('Loading nearby places with location:', userLocation.value)
  
  try {
    const response = await placeDirectoryAPI.findNearby(userLocation.value, 100000) // Large radius to get all places
    console.log('findNearby response:', response)
    
    // Fetch full details for each place ID
    if (response.placeIds && response.placeIds.length > 0) {
      console.log(`Found ${response.placeIds.length} place IDs, fetching details...`)
      const placeDetailsPromises = response.placeIds.map(placeId => 
        placeDirectoryAPI.getDetails(placeId)
      )
      const placeDetails = await Promise.all(placeDetailsPromises)
      const allPlaces = placeDetails.map(detail => detail.place)
      console.log(`Fetched ${allPlaces.length} place details`)
      
      // Filter to only show places within 50km (reasonable driving distance)
      const nearbyFiltered = allPlaces.filter(place => {
        const distance = calculateDistance(userLocation.value, place.coordinates)
        return distance <= 50 // 50km max distance
      })
      
      console.log(`Filtered to ${nearbyFiltered.length} places within 50km`)
      nearbyPlaces.value = nearbyFiltered
      filteredPlaces.value = nearbyPlaces.value
      loadRecommendations()
    } else {
      console.warn('No place IDs returned from findNearby')
      nearbyPlaces.value = []
      filteredPlaces.value = []
    }
  } catch (error) {
    console.error('Error loading nearby places:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    nearbyPlaces.value = []
    filteredPlaces.value = []
  }
}

// Handle search
const handleSearch = () => {
  applyFilters()
}

// Apply filters to places
const applyFilters = async () => {
  let places = [...nearbyPlaces.value]
  
  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    places = places.filter(place => 
      place.name.toLowerCase().includes(query) ||
      place.address.toLowerCase().includes(query)
    )
  }
  
  // Style filter
  if (filterStyle.value) {
    places = places.filter(place => 
      place.preparationStyles && place.preparationStyles.includes(filterStyle.value)
    )
  }
  
  // Rating and sweetness filters - fetch log data and calculate averages
  if (filterRating.value || filterSweetness.value) {
    const placesWithStats = await Promise.all(places.map(async (place) => {
      try {
        const logsResponse = await experienceLogAPI.getPlaceLogs(userStore.userId, place._id)
        if (logsResponse.logs && logsResponse.logs.length > 0) {
          const totalRating = logsResponse.logs.reduce((sum, log) => sum + log.rating, 0)
          const totalSweetness = logsResponse.logs.reduce((sum, log) => sum + log.sweetness, 0)
          place.avgRating = totalRating / logsResponse.logs.length
          place.avgSweetness = totalSweetness / logsResponse.logs.length
        }
      } catch (err) {
        console.error('Error fetching logs for filter:', err)
      }
      return place
    }))
    
    places = placesWithStats
    
    // Apply rating filter
    if (filterRating.value) {
      const minRating = parseFloat(filterRating.value)
      places = places.filter(place => place.avgRating && place.avgRating >= minRating)
    }
    
    // Apply sweetness filter
    if (filterSweetness.value) {
      const targetSweetness = parseFloat(filterSweetness.value)
      places = places.filter(place => {
        if (!place.avgSweetness) return false
        // Match sweetness within ±1 range
        return Math.abs(place.avgSweetness - targetSweetness) <= 1
      })
    }
  }
  
  filteredPlaces.value = places
}

// Load recommendations
const loadRecommendations = async () => {
  loadingRecommendations.value = true
  try {
    // Get recommendations from backend
    const response = await recommendationEngineAPI.getRecommendations(userStore.userId)
    if (response.recommendations && response.recommendations.length > 0) {
      const recDetailsPromises = response.recommendations.slice(0, 3).map(async placeId => {
        const placeDetail = await placeDirectoryAPI.getDetails(placeId)
        
        // Fetch logs to calculate average rating and sweetness
        try {
          const logsResponse = await experienceLogAPI.getPlaceLogs(userStore.userId, placeId)
          if (logsResponse.logs && logsResponse.logs.length > 0) {
            const totalRating = logsResponse.logs.reduce((sum, log) => sum + log.rating, 0)
            const totalSweetness = logsResponse.logs.reduce((sum, log) => sum + log.sweetness, 0)
            const totalStrength = logsResponse.logs.reduce((sum, log) => sum + log.strength, 0)
            
            placeDetail.place.avgRating = totalRating / logsResponse.logs.length
            placeDetail.place.avgSweetness = totalSweetness / logsResponse.logs.length
            placeDetail.place.avgStrength = totalStrength / logsResponse.logs.length
            
            console.log(`Place ${placeDetail.place.name} - Rating: ${placeDetail.place.avgRating.toFixed(1)}, Sweetness: ${placeDetail.place.avgSweetness.toFixed(1)}`)
          } else {
            // No logs yet, set to undefined
            placeDetail.place.avgRating = undefined
            placeDetail.place.avgSweetness = undefined
            placeDetail.place.avgStrength = undefined
          }
        } catch (logError) {
          console.error('Error fetching logs for place:', logError)
          placeDetail.place.avgRating = undefined
          placeDetail.place.avgSweetness = undefined
          placeDetail.place.avgStrength = undefined
        }
        
        return placeDetail
      })
      const recDetails = await Promise.all(recDetailsPromises)
      recommendedPlaces.value = recDetails.map(detail => detail.place)
    } else {
      // Fallback: show random places with calculated ratings and sweetness
      const placesWithStats = await Promise.all(nearbyPlaces.value.slice(0, 3).map(async place => {
        try {
          const logsResponse = await experienceLogAPI.getPlaceLogs(userStore.userId, place._id)
          if (logsResponse.logs && logsResponse.logs.length > 0) {
            const totalRating = logsResponse.logs.reduce((sum, log) => sum + log.rating, 0)
            const totalSweetness = logsResponse.logs.reduce((sum, log) => sum + log.sweetness, 0)
            place.avgRating = totalRating / logsResponse.logs.length
            place.avgSweetness = totalSweetness / logsResponse.logs.length
          }
        } catch (logError) {
          console.error('Error fetching logs for fallback place:', logError)
        }
        return place
      }))
      recommendedPlaces.value = placesWithStats
    }
  } catch (error) {
    console.error('Error loading recommendations:', error)
    recommendedPlaces.value = nearbyPlaces.value.slice(0, 3)
  } finally {
    loadingRecommendations.value = false
  }
}

// Handle place click from map
const handlePlaceClick = (placeId) => {
  router.push(`/places/${placeId}`)
}

// Watch filters for changes
watch([filterRating, filterSweetness, filterStyle], () => {
  applyFilters()
})

// Load places when user logs in
onMounted(() => {
  if (userStore.isLoggedIn) {
    getUserLocation()
  }
})

// Watch for route changes to refresh recommendations when returning from place detail
watch(() => route.path, (newPath, oldPath) => {
  // Reload recommendations when returning to home from a place detail page
  if (newPath === '/' && oldPath && oldPath.includes('/places/') && userStore.isLoggedIn) {
    loadRecommendations()
  }
})

// Simple auth storage (for demo - in production use secure backend auth)
const getStoredAccounts = () => {
  const accounts = localStorage.getItem('matcha_accounts')
  return accounts ? JSON.parse(accounts) : {}
}

const saveAccount = (email, password, userId, displayName, preferences = {}) => {
  const accounts = getStoredAccounts()
  accounts[email] = { password, userId, displayName, preferences }
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
    
    // Ensure user is registered in backend (in case they were created before backend integration)
    try {
      await userDirectoryAPI.registerUser({
        userId: account.userId,
        displayName: account.displayName,
        email: loginForm.value.email
      })
      console.log('User registered/verified in backend')
    } catch (error) {
      // If user already exists, that's fine - continue with login
      console.log('User may already exist in backend:', error)
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
    
    console.log('HomeView: Creating account with userId:', userId)
    
    // Save credentials and preferences locally FIRST (so account exists even if backend fails)
    saveAccount(
      signupForm.value.email,
      signupForm.value.password,
      userId,
      signupForm.value.displayName,
      {
        sweetness: signupForm.value.sweetness,
        strength: signupForm.value.strength,
        location: signupForm.value.location
      }
    )
    console.log('HomeView: Account saved locally')
    
    // Log in the user immediately
    userStore.setUser(userId, signupForm.value.displayName, signupForm.value.email)
    console.log('HomeView: User logged in')
    
    // Try to register in backend (don't fail signup if this times out)
    try {
      console.log('HomeView: Registering user in backend...')
      await userDirectoryAPI.registerUser({
        userId,
        displayName: signupForm.value.displayName,
        email: signupForm.value.email
      })
      console.log('HomeView: User registered in backend')
      
      // Try to update preferences (also non-critical)
      try {
        console.log('HomeView: Updating preferences in backend...')
        await userDirectoryAPI.updatePreferences({
          userId,
          sweetness: signupForm.value.sweetness,
          strength: signupForm.value.strength
        })
        console.log('HomeView: Preferences updated in backend')
      } catch (prefError) {
        console.warn('HomeView: Failed to update preferences in backend (non-critical):', prefError)
      }
    } catch (backendError) {
      console.warn('HomeView: Failed to register in backend (non-critical):', backendError)
      // User can still use the app, backend registration will happen on next login
    }
    
    successMessage.value = 'Account created successfully!'
  } catch (error) {
    console.error('HomeView: Error creating account:', error)
    errorMessage.value = error.message || 'Failed to create account. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
