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

// Cache keys for profile summary
const SUMMARY_CACHE_KEY = 'matcha_profile_summary'
const SUMMARY_METADATA_KEY = 'matcha_profile_summary_metadata'

const loadSavedPlaces = async () => {
  if (!userStore.isLoggedIn) {
    console.warn('ProfileView: User not logged in')
    return
  }
  
  loadingSaved.value = true
  try {
    console.log('ProfileView: Loading saved places for userId:', userStore.userId)
    const result = await userDirectoryAPI.getSavedPlaces(userStore.userId)
    console.log('ProfileView: getSavedPlaces result:', result)
    
    if (result.places && result.places.length > 0) {
      console.log(`ProfileView: Fetching details for ${result.places.length} saved places`)
      console.log('ProfileView: Place IDs:', result.places)
      
      const placeDetailsPromises = result.places.map(async (placeId) => {
        try {
          console.log('ProfileView: Fetching details for placeId:', placeId)
          const detail = await placeDirectoryAPI.getDetails(placeId)
          console.log('ProfileView: Got details for', detail.place.name)
          return detail
        } catch (err) {
          console.error('ProfileView: Failed to fetch details for placeId:', placeId, err)
          return null
        }
      })
      
      const placeDetails = await Promise.all(placeDetailsPromises)
      const validPlaces = placeDetails.filter(detail => detail !== null).map(detail => detail.place)
      savedPlaces.value = validPlaces
      console.log('ProfileView: Loaded', savedPlaces.value.length, 'saved places')
    } else {
      console.log('ProfileView: No saved places found')
      console.log('ProfileView: result.places:', result?.places)
      savedPlaces.value = []
    }
  } catch (err) {
    console.error('ProfileView: Error loading saved places:', err)
  } finally {
    loadingSaved.value = false
  }
}

const loadRecommendations = async () => {
  if (!userStore.isLoggedIn) {
    console.warn('ProfileView: User not logged in')
    return
  }
  
  loadingRecs.value = true
  try {
    console.log('ProfileView: Loading recommendations for userId:', userStore.userId)
    const result = await recommendationEngineAPI.getRecommendations(userStore.userId)
    console.log('ProfileView: getRecommendations result:', result)
    
    if (result.recommendations && result.recommendations.length > 0) {
      // Limit to top 8 recommendations
      const topRecommendations = result.recommendations.slice(0, 8)
      console.log(`ProfileView: Fetching details for ${topRecommendations.length} recommendations (limited from ${result.recommendations.length})`)
      const placeDetailsPromises = topRecommendations.map(async (placeId) => {
        try {
          const detail = await placeDirectoryAPI.getDetails(placeId)
          return detail
        } catch (err) {
          console.error('ProfileView: Failed to fetch recommendation details for placeId:', placeId, err)
          return null
        }
      })
      const placeDetails = await Promise.all(placeDetailsPromises)
      const validPlaces = placeDetails.filter(detail => detail !== null).map(detail => detail.place)
      recommendations.value = validPlaces
      console.log('ProfileView: Loaded', recommendations.value.length, 'recommendations')
    } else {
      // Fallback: Show some nearby places if no recommendations
      console.log('ProfileView: No recommendations from backend, showing nearby places as fallback')
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
  if (!userStore.isLoggedIn) {
    console.warn('ProfileView: Cannot refresh recommendations - user not logged in')
    return
  }
  
  const userId = userStore.userId
  if (!userId) {
    console.error('ProfileView: Cannot refresh recommendations - userId is null')
    return
  }
  
  loadingRecs.value = true
  try {
    console.log('ProfileView: Refreshing recommendations for userId:', userId)
    // Get user's saved places and tried places
    const savedResult = await userDirectoryAPI.getSavedPlaces(userId)
    const triedResult = await experienceLogAPI.getTriedPlaces(userId)
    
    await recommendationEngineAPI.refreshRecommendations({
      userId,
      savedPlaces: savedResult.places || [],
      preferences: {},
      triedPlaces: triedResult.places || []
    })
    
    await loadRecommendations()
  } catch (err) {
    console.error('ProfileView: Error refreshing recommendations:', err)
    alert('Error: ' + (err instanceof Error ? err.message : String(err)))
  } finally {
    loadingRecs.value = false
  }
}

const generateSummary = async () => {
  if (!userStore.isLoggedIn) {
    console.warn('ProfileView: Cannot generate summary - user not logged in')
    return
  }
  
  const userId = userStore.userId
  if (!userId) {
    console.error('ProfileView: Cannot generate summary - userId is null')
    return
  }
  
  loadingSummary.value = true
  try {
    console.log('ProfileView: Generating summary for userId:', userId)
    // Check if we have a cached summary
    const cachedSummary = localStorage.getItem(`${SUMMARY_CACHE_KEY}_${userId}`)
    const cachedMetadata = localStorage.getItem(`${SUMMARY_METADATA_KEY}_${userId}`)
    
    if (cachedSummary && cachedMetadata) {
      const metadata = JSON.parse(cachedMetadata)
      
      // Get current counts of saved places and logs
      const savedResult = await userDirectoryAPI.getSavedPlaces(userId)
      const triedResult = await experienceLogAPI.getTriedPlaces(userId)
      
      const currentSavedCount = savedResult.places?.length || 0
      const currentLogCount = triedResult.places?.length || 0
      
      // If counts match, use cached summary
      if (metadata.savedCount === currentSavedCount && metadata.logCount === currentLogCount) {
        console.log('Using cached profile summary')
        profileSummary.value = cachedSummary
        loadingSummary.value = false
        return
      }
    }
    
    // Generate new summary
    console.log('Generating new profile summary')
    const result = await experienceLogAPI.generateProfileSummary(userId)
    
    // Clean up the summary by replacing UUID place IDs with actual place names
    let cleanedSummary = result.summary
    
    // Find all UUID patterns in the summary
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi
    const uuids = cleanedSummary.match(uuidPattern)
    
    if (uuids && uuids.length > 0) {
      // Fetch place names for all UUIDs found
      const uniqueUuids = [...new Set(uuids)]
      const placeNameMap = {}
      
      try {
        await Promise.all(uniqueUuids.map(async (uuid) => {
          try {
            const placeDetail = await placeDirectoryAPI.getDetails(uuid)
            placeNameMap[uuid] = placeDetail.place.name
          } catch (err) {
            console.error(`Failed to fetch place name for ${uuid}:`, err)
            placeNameMap[uuid] = 'a matcha spot'
          }
        }))
        
        // Replace each UUID with its corresponding place name
        for (const [uuid, name] of Object.entries(placeNameMap)) {
          const regex = new RegExp(uuid, 'gi')
          cleanedSummary = cleanedSummary.replace(regex, name)
        }
      } catch (err) {
        console.error('Error fetching place names:', err)
        // Fallback to generic replacement if fetching fails
        cleanedSummary = cleanedSummary.replace(uuidPattern, 'various locations')
      }
    }
    
    profileSummary.value = cleanedSummary
    
    // Cache the summary with metadata
    const savedResult = await userDirectoryAPI.getSavedPlaces(userId)
    const triedResult = await experienceLogAPI.getTriedPlaces(userId)
    
    const metadata = {
      savedCount: savedResult.places?.length || 0,
      logCount: triedResult.places?.length || 0,
      timestamp: Date.now()
    }
    
    localStorage.setItem(`${SUMMARY_CACHE_KEY}_${userId}`, cleanedSummary)
    localStorage.setItem(`${SUMMARY_METADATA_KEY}_${userId}`, JSON.stringify(metadata))
    
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
