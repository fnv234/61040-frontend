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
            class="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center gap-3 flex-1">
              <div
                v-if="place.photos && place.photos.length > 0"
                class="w-16 h-16 rounded-md overflow-hidden flex-shrink-0"
              >
                <img
                  :src="getPhotoUrl(place.photos[0])"
                  :alt="place.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-16 h-16 rounded-md bg-matcha-100 flex items-center justify-center flex-shrink-0"
              >
                <span class="text-2xl">🍵</span>
              </div>
              <div>
                <div class="font-medium">{{ place.name }}</div>
                <div class="text-sm text-gray-500">{{ place.address }}</div>
              </div>
            </div>
            <router-link
              :to="`/places/${place._id}`"
              class="px-3 py-1 bg-brighter-green text-white rounded-lg hover:bg-matcha-green transition-all text-sm font-medium btn-cute flex-shrink-0"
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
            class="flex justify-between items-center p-3 bg-matcha-50 rounded-md hover:bg-matcha-100 transition-colors"
          >
            <div class="flex items-center gap-3 flex-1">
              <div
                v-if="place.photos && place.photos.length > 0"
                class="w-16 h-16 rounded-md overflow-hidden flex-shrink-0"
              >
                <img
                  :src="getPhotoUrl(place.photos[0])"
                  :alt="place.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="w-16 h-16 rounded-md bg-matcha-100 flex items-center justify-center flex-shrink-0"
              >
                <span class="text-2xl">🍵</span>
              </div>
              <div>
                <div class="font-medium">{{ place.name }}</div>
                <div class="text-sm text-gray-500">{{ place.address }}</div>
                <div v-if="place.distance" class="text-xs text-matcha-600">
                  📍 {{ place.distance.toFixed(1) }} km away
                </div>
              </div>
            </div>
            <router-link
              :to="`/places/${place._id}`"
              class="px-3 py-1 bg-brighter-green text-white rounded-lg hover:bg-matcha-green transition-all text-sm font-medium btn-cute flex-shrink-0"
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

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import {
  userDirectoryAPI,
  placeDirectoryAPI,
  recommendationEngineAPI,
  experienceLogAPI
} from '@/services/api'

// Define Place interface
interface Place {
  _id: string
  name: string
  address: string
  coordinates: [number, number]
  distance?: number
  avgRating?: number
  avgSweetness?: number
  avgStrength?: number
  photos?: string[]
  preparationStyles?: string[]
}

const userStore = useUserStore()
const savedPlaces = ref<Place[]>([])
const recommendations = ref<Place[]>([])
const profileSummary = ref<string>('')
const loadingSaved = ref<boolean>(false)
const loadingRecs = ref<boolean>(false)
const loadingSummary = ref<boolean>(false)

// Location and distance helpers
const userLocation = ref<[number, number] | null>(null)
const getUserLocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = [position.coords.longitude, position.coords.latitude]
        // Optionally refresh recommendations when location becomes available
        if (userStore.isLoggedIn) {
          loadRecommendations()
        }
      },
      () => {
        // Default to Boston/Cambridge
        userLocation.value = [-71.0942, 42.3601]
        if (userStore.isLoggedIn) {
          loadRecommendations()
        }
      }
    )
  } else {
    userLocation.value = [-71.0942, 42.3601]
  }
}

const calculateDistance = (coords1: [number, number], coords2: [number, number]) => {
  const [lon1, lat1] = coords1
  const [lon2, lat2] = coords2
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

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
    const result = await userDirectoryAPI.getSavedPlaces(userStore.userId!)
    console.log('ProfileView: getSavedPlaces result:', result)
    
    if (result.places && result.places.length > 0) {
      console.log(`ProfileView: Fetching details for ${result.places.length} saved places`)
      console.log('ProfileView: Place IDs:', result.places)
      
      const placeDetailsPromises = result.places.map(async (placeId) => {
        try {
          console.log('ProfileView: Fetching details for placeId:', placeId)
          const detail = await placeDirectoryAPI.getDetails(placeId)
          console.log('ProfileView: Got details for', detail.place.name)
          
          // Merge log photos into place photos
          try {
            const logsResponse = await experienceLogAPI.getPlaceLogs(userStore.userId!, placeId)
            if (logsResponse.logs && logsResponse.logs.length > 0) {
              const logPhotos = logsResponse.logs
                .filter(log => log.photo)
                .map(log => log.photo!)
              
              if (!detail.place.photos) {
                detail.place.photos = []
              }
              
              logPhotos.forEach(photo => {
                if (!detail.place.photos!.includes(photo)) {
                  detail.place.photos!.push(photo)
                }
              })
              
              console.log(`ProfileView: Merged ${logPhotos.length} log photos for ${detail.place.name}`)
            }
          } catch (logErr) {
            console.error('ProfileView: Failed to fetch logs for place:', placeId, logErr)
          }
          
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
    const result = await recommendationEngineAPI.getRecommendations(userStore.userId!)
    console.log('ProfileView: getRecommendations result:', result)
    
    if (result.recommendations && result.recommendations.length > 0) {
      // Limit to top 8 recommendations
      const topRecommendations = result.recommendations.slice(0, 8)
      console.log(`ProfileView: Fetching details for ${topRecommendations.length} recommendations (limited from ${result.recommendations.length})`)
      const placeDetailsPromises = topRecommendations.map(async (placeId) => {
        try {
          const detail = await placeDirectoryAPI.getDetails(placeId)
          
          // Annotate with distance if we have location
          if (userLocation.value) {
            const distance = calculateDistance(userLocation.value, detail.place.coordinates)
            detail.place.distance = distance
          }
          
          // Merge log photos into place photos (if user has visited this place)
          try {
            const logsResponse = await experienceLogAPI.getPlaceLogs(userStore.userId!, placeId)
            if (logsResponse.logs && logsResponse.logs.length > 0) {
              const logPhotos = logsResponse.logs
                .filter(log => log.photo)
                .map(log => log.photo!)
              
              if (!detail.place.photos) {
                detail.place.photos = []
              }
              
              logPhotos.forEach(photo => {
                if (!detail.place.photos!.includes(photo)) {
                  detail.place.photos!.push(photo)
                }
              })
            }
          } catch (logErr) {
            // It's okay if this fails - user may not have visited this place yet
          }
          
          return detail
        } catch (err) {
          console.error('ProfileView: Failed to fetch recommendation details for placeId:', placeId, err)
          return null
        }
      })
      const placeDetails = await Promise.all(placeDetailsPromises)
      let validPlaces = placeDetails.filter(detail => detail !== null).map(detail => detail.place)
      // Filter to within 50km if we know location
      if (userLocation.value) {
        validPlaces = validPlaces.filter(place => {
          const d = place.distance ?? calculateDistance(userLocation.value as [number, number], place.coordinates)
          return d <= 50
        })
      }
      recommendations.value = validPlaces
      console.log('ProfileView: Loaded', recommendations.value.length, 'recommendations')
    } else {
      // Fallback: Show some nearby places if no recommendations
      console.log('ProfileView: No recommendations from backend, showing nearby places as fallback')
      const coords = userLocation.value ?? [-71.0942, 42.3601]
      const nearbyResult = await placeDirectoryAPI.findNearby(coords, 50000)
      if (nearbyResult.placeIds && nearbyResult.placeIds.length > 0) {
        const placeDetails = await Promise.all(
          nearbyResult.placeIds.slice(0, 5).map(placeId => placeDirectoryAPI.getDetails(placeId))
        )
        let places = placeDetails.map(detail => detail.place)
        if (userLocation.value) {
          places = places.filter(p => calculateDistance(userLocation.value as [number, number], p.coordinates) <= 50)
        }
        recommendations.value = places
      }
    }
  } catch (err) {
    console.error('Error loading recommendations:', err)
    // Even on error, try to show some places
    try {
      const coords = userLocation.value ?? [-71.0942, 42.3601]
      const nearbyResult = await placeDirectoryAPI.findNearby(coords, 50000)
      if (nearbyResult.placeIds && nearbyResult.placeIds.length > 0) {
        const placeDetails = await Promise.all(
          nearbyResult.placeIds.slice(0, 5).map(placeId => placeDirectoryAPI.getDetails(placeId))
        )
        let places = placeDetails.map(detail => detail.place)
        if (userLocation.value) {
          places = places.filter(p => calculateDistance(userLocation.value as [number, number], p.coordinates) <= 50)
        }
        recommendations.value = places
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
    // Constrain the backend computation to nearby places based on location
    const coords = userLocation.value ?? [-71.0942, 42.3601]
    const nearby = await placeDirectoryAPI.findNearby(coords, 50000)

    await recommendationEngineAPI.refreshRecommendations({
      userId,
      savedPlaces: savedResult.places || [],
      preferences: {},
      triedPlaces: triedResult.places || [],
      allAvailablePlaces: nearby.placeIds || []
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
      const placeNameMap: Record<string, string> = {}
      
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
    alert('Error: ' + (err instanceof Error ? err.message : String(err)))
  } finally {
    loadingSummary.value = false
  }
}

// Load cached summary on mount
const loadCachedSummary = () => {
  if (!userStore.userId) return
  
  const cachedSummary = localStorage.getItem(`${SUMMARY_CACHE_KEY}_${userStore.userId}`)
  if (cachedSummary) {
    console.log('ProfileView: Loading cached summary from localStorage')
    profileSummary.value = cachedSummary
  }
}

onMounted(() => {
  getUserLocation()
  loadSavedPlaces()
  loadRecommendations()
  loadCachedSummary()
})

// React to login/sign-up: when userId becomes available, load data
watch(() => userStore.userId, (newUserId, oldUserId) => {
  if (newUserId && !oldUserId) {
    loadSavedPlaces()
    loadRecommendations()
    loadCachedSummary()
  }
})

// Helper function to get photo URL
const getPhotoUrl = (photo: string) => {
  // If it's already a full URL (http/https), return as is
  if (photo && (photo.startsWith('http://') || photo.startsWith('https://'))) {
    return photo
  }
  
  // If it's a data URL (base64), return as is
  if (photo && photo.startsWith('data:')) {
    return photo
  }
  
  // If it's a relative path starting with /, assume it's from the backend
  if (photo && photo.startsWith('/')) {
    return `http://localhost:8000${photo}`
  }
  
  // Otherwise, try to construct a full URL
  return photo || ''
}
</script>
