<template>
  <div class="px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

    <div v-if="!userStore.isLoggedIn" class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
      <p class="text-yellow-800">Please log in to view your profile.</p>
    </div>

    <div v-else class="space-y-6">
      <!-- User Info -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Account Information</h2>
        <div class="space-y-2">
          <div>
            <span class="text-gray-500">Display Name:</span>
            <span class="ml-2 font-medium">{{ userStore.displayName }}</span>
          </div>
          <div>
            <span class="text-gray-500">Email:</span>
            <span class="ml-2 font-medium">{{ userStore.email }}</span>
          </div>
        </div>
        <button
          @click="userStore.logout()"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <!-- Saved Places -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Saved Places</h2>
        <div v-if="loadingSaved" class="text-gray-600">Loading...</div>
        <div v-else-if="savedPlaces.length === 0" class="text-gray-600">
          No saved places yet.
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="place in savedPlaces"
            :key="place._id"
            class="flex justify-between items-center p-3 bg-gray-50 rounded-md"
          >
            <div>
              <div class="font-medium">{{ place.name }}</div>
              <div class="text-sm text-gray-500">{{ place.address }}</div>
            </div>
            <router-link
              :to="`/places/${place._id}`"
              class="text-matcha-600 hover:text-matcha-700"
            >
              View →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Recommendations</h2>
          <button
            @click="refreshRecommendations"
            class="px-4 py-2 bg-matcha-600 text-white rounded-md hover:bg-matcha-700 text-sm"
          >
            Refresh
          </button>
        </div>
        <div v-if="loadingRecs" class="text-gray-600">Loading...</div>
        <div v-else-if="recommendations.length === 0" class="text-gray-600">
          No recommendations available. Try logging some experiences!
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="place in recommendations"
            :key="place._id"
            class="flex justify-between items-center p-3 bg-matcha-50 rounded-md"
          >
            <div>
              <div class="font-medium">{{ place.name }}</div>
              <div class="text-sm text-gray-500">{{ place.address }}</div>
            </div>
            <router-link
              :to="`/places/${place._id}`"
              class="text-matcha-600 hover:text-matcha-700"
            >
              View →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Profile Summary -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">My Matcha Profile</h2>
          <button
            @click="generateSummary"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Generate Summary
          </button>
        </div>
        <div v-if="loadingSummary" class="text-gray-600">Generating...</div>
        <div v-else-if="profileSummary" class="text-gray-700">
          {{ profileSummary }}
        </div>
        <div v-else class="text-gray-500 italic">
          Generate an AI-powered summary of your matcha preferences based on your experience logs.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import {
  userDirectoryAPI,
  placeDirectoryAPI,
  recommendationEngineAPI,
  experienceLogAPI
} from '@/services/api'

const userStore = useUserStore()
const savedPlaces = ref([])
const recommendations = ref([])
const profileSummary = ref('')
const loadingSaved = ref(false)
const loadingRecs = ref(false)
const loadingSummary = ref(false)

const loadSavedPlaces = async () => {
  if (!userStore.isLoggedIn) return
  
  loadingSaved.value = true
  try {
    const result = await userDirectoryAPI.getSavedPlaces(userStore.userId)
    
    if (result.places && result.places.length > 0) {
      const placeDetails = await Promise.all(
        result.places.map(placeId => placeDirectoryAPI.getDetails(placeId))
      )
      savedPlaces.value = placeDetails.map(detail => detail.place)
    }
  } catch (err) {
    console.error('Error loading saved places:', err)
  } finally {
    loadingSaved.value = false
  }
}

const loadRecommendations = async () => {
  if (!userStore.isLoggedIn) return
  
  loadingRecs.value = true
  try {
    const result = await recommendationEngineAPI.getRecommendations(userStore.userId)
    
    if (result.recommendations && result.recommendations.length > 0) {
      const placeDetails = await Promise.all(
        result.recommendations.map(placeId => placeDirectoryAPI.getDetails(placeId))
      )
      recommendations.value = placeDetails.map(detail => detail.place)
    }
  } catch (err) {
    console.error('Error loading recommendations:', err)
  } finally {
    loadingRecs.value = false
  }
}

const refreshRecommendations = async () => {
  if (!userStore.isLoggedIn) return
  
  loadingRecs.value = true
  try {
    // Get user's saved places and tried places
    const savedResult = await userDirectoryAPI.getSavedPlaces(userStore.userId)
    const triedResult = await experienceLogAPI.getTriedPlaces(userStore.userId)
    
    await recommendationEngineAPI.refreshRecommendations({
      userId: userStore.userId,
      savedPlaces: savedResult.places || [],
      preferences: {},
      triedPlaces: triedResult.places || []
    })
    
    await loadRecommendations()
  } catch (err) {
    alert('Error: ' + err.message)
  } finally {
    loadingRecs.value = false
  }
}

const generateSummary = async () => {
  if (!userStore.isLoggedIn) return
  
  loadingSummary.value = true
  try {
    const result = await experienceLogAPI.generateProfileSummary(userStore.userId, {})
    profileSummary.value = result.summary
  } catch (err) {
    alert('Error: ' + err.message)
  } finally {
    loadingSummary.value = false
  }
}

onMounted(() => {
  loadSavedPlaces()
  loadRecommendations()
})
</script>
