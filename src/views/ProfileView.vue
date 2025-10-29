<template>
  <div class="px-4 py-8">
    <h1 class="text-4xl font-decorative text-matcha-600 mb-6 animate-fade-in-up">
      <span class="inline-block animate-bounce-gentle">👤</span> My Profile
    </h1>

    <div v-if="!userStore.isLoggedIn" class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
      <p class="text-yellow-800">Please log in to view your profile.</p>
    </div>

    <div v-else class="space-y-6">
      <!-- User Info -->
      <div class="bg-white rounded-lg shadow-md p-6 hover-lift animate-fade-in-up">
        <h2 class="text-xl font-semibold mb-4 text-dark-green">Account Information</h2>
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
          class="mt-4 px-4 py-2 bg-cherry-blossom text-brown rounded-lg hover:bg-darker-light-pink transition-all font-medium btn-cute hover-grow"
        >
          🚪 Logout
        </button>
      </div>

      <!-- Saved Places -->
      <div class="bg-white rounded-lg shadow-md p-6 hover-lift animate-fade-in-up">
        <h2 class="text-xl font-semibold mb-4 text-dark-green">
          <span class="inline-block animate-pulse-soft">⭐</span> Saved Places
        </h2>
        <div v-if="loadingSaved" class="text-center py-4">
          <div class="inline-block animate-float text-4xl mb-2">🍵</div>
          <p class="text-sm text-gray-500 font-decorative">Loading...</p>
        </div>
        <div v-else-if="savedPlaces.length === 0" class="text-center py-8">
          <img 
            src="/src/assets/pics/matchavertical.jpeg" 
            alt="Matcha" 
            class="w-32 h-32 object-cover rounded-full mx-auto mb-4 shadow-md animate-float"
          />
          <p class="text-gray-600 font-decorative text-lg">No saved places yet</p>
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
              class="px-3 py-1 bg-brighter-green text-white rounded-lg hover:bg-matcha-green transition-all text-sm font-medium btn-cute"
            >
              View →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="bg-white rounded-lg shadow-md p-6 hover-lift animate-fade-in-up">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-dark-green">
            <span class="inline-block animate-pulse-soft">✨</span> Recommendations
          </h2>
          <button
            @click="refreshRecommendations"
            class="px-4 py-2 bg-brighter-green text-white rounded-lg hover:bg-matcha-green text-sm font-medium btn-cute hover-grow"
          >
            🔄 Refresh
          </button>
        </div>
        <div v-if="loadingRecs" class="text-center py-4">
          <div class="inline-block animate-float text-4xl mb-2">🍵</div>
          <p class="text-sm text-gray-500 font-decorative">Brewing recommendations...</p>
        </div>
        <div v-else-if="recommendations.length === 0" class="text-center py-8">
          <img 
            src="/src/assets/pics/matchavertical.jpeg" 
            alt="Matcha" 
            class="w-32 h-32 object-cover rounded-full mx-auto mb-4 shadow-md animate-bounce-gentle"
          />
          <p class="text-gray-600 font-decorative text-lg">No recommendations available</p>
          <p class="text-sm text-gray-500 mt-2">Try logging some experiences!</p>
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
              class="px-3 py-1 bg-brighter-green text-white rounded-lg hover:bg-matcha-green transition-all text-sm font-medium btn-cute"
            >
              View →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Profile Summary -->
      <div class="bg-white rounded-lg shadow-md p-6 hover-lift animate-fade-in-up">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-dark-green">
            <span class="inline-block animate-pulse-soft">🍵</span> My Matcha Profile
          </h2>
          <button
            @click="generateSummary"
            class="px-4 py-2 bg-jade text-white rounded-lg hover:bg-darker-blue-green text-sm font-medium btn-cute hover-grow"
          >
            ✨ Generate Summary
          </button>
        </div>
        <div v-if="loadingSummary" class="text-center py-4">
          <div class="inline-block animate-float text-4xl mb-2">🍵</div>
          <p class="text-sm text-gray-500 font-decorative">Generating your matcha profile...</p>
        </div>
        <div v-else-if="profileSummary" class="bg-lighter-dull-green p-4 rounded-lg border-2 border-green-gray">
          <p class="text-dark-green leading-relaxed">{{ profileSummary }}</p>
        </div>
        <div v-else class="text-center py-8">
          <img 
            src="/src/assets/pics/matchavertical.jpeg" 
            alt="Matcha" 
            class="w-32 h-32 object-cover rounded-full mx-auto mb-4 shadow-md animate-pulse-soft"
          />
          <p class="text-gray-500 italic font-decorative">Generate an AI-powered summary of your matcha preferences!</p>
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
    } else {
      // Fallback: Show some nearby places if no recommendations
      console.log('No recommendations from backend, showing nearby places as fallback')
      const nearbyResult = await placeDirectoryAPI.findNearby([-71.0942, 42.3601], 50000)
      if (nearbyResult.placeIds && nearbyResult.placeIds.length > 0) {
        const placeDetails = await Promise.all(
          nearbyResult.placeIds.slice(0, 5).map(placeId => placeDirectoryAPI.getDetails(placeId))
        )
        recommendations.value = placeDetails.map(detail => detail.place)
      }
    }
  } catch (err) {
    console.error('Error loading recommendations:', err)
    // Even on error, try to show some places
    try {
      const nearbyResult = await placeDirectoryAPI.findNearby([-71.0942, 42.3601], 50000)
      if (nearbyResult.placeIds && nearbyResult.placeIds.length > 0) {
        const placeDetails = await Promise.all(
          nearbyResult.placeIds.slice(0, 5).map(placeId => placeDirectoryAPI.getDetails(placeId))
        )
        recommendations.value = placeDetails.map(detail => detail.place)
      }
    } catch (fallbackErr) {
      console.error('Error loading fallback places:', fallbackErr)
    }
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
    const result = await experienceLogAPI.generateProfileSummary(userStore.userId)
    
    // Clean up the summary by removing UUID place IDs
    let cleanedSummary = result.summary
    
    // Remove UUID patterns (e.g., 493d469f-4402-4024-956c-d5b0d649b06c)
    cleanedSummary = cleanedSummary.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, 'various locations')
    
    // Clean up awkward phrasing that results from ID removal
    cleanedSummary = cleanedSummary.replace(/at various locations/gi, 'at different matcha spots')
    cleanedSummary = cleanedSummary.replace(/experience at various locations/gi, 'experiences')
    cleanedSummary = cleanedSummary.replace(/tasting experience at various locations/gi, 'tastings')
    
    profileSummary.value = cleanedSummary
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
