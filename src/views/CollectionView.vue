<template>
  <div class="px-4 py-8 relative">
    <!-- Decorative header with image -->
    <div class="flex items-center justify-between mb-6 animate-fade-in-up">
      <h1 class="text-4xl font-decorative text-matcha-600">
        <span class="inline-block animate-bounce-gentle">⭐</span> My Collection
      </h1>
      <img 
        src="/src/assets/pics/matchavertical.jpeg" 
        alt="Matcha branding" 
        class="w-20 h-20 object-cover rounded-full shadow-lg animate-float"
      />
    </div>

    <!-- Toggle between Saved Places and Logs -->
    <div class="flex border-b mb-6">
      <button
        @click="activeView = 'places'"
        :class="[
          'flex-1 py-3 text-center font-medium transition-colors',
          activeView === 'places' 
            ? 'border-b-2 border-matcha-600 text-matcha-600' 
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        Saved Places
      </button>
      <button
        @click="activeView = 'logs'"
        :class="[
          'flex-1 py-3 text-center font-medium transition-colors',
          activeView === 'logs' 
            ? 'border-b-2 border-matcha-600 text-matcha-600' 
            : 'text-gray-500 hover:text-gray-700'
        ]"
      >
        Logs
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
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
              v-model="filterQuery"
              type="text"
              :placeholder="activeView === 'places' ? 'Search saved places...' : 'Search logs...'"
              class="w-full h-full px-4 py-2 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-500"
            />
          </GlassSurface>
        </div>
        <select
          v-if="activeView === 'logs'"
          v-model="filterRating"
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>
      </div>
    </div>

    <!-- Saved Places View -->
    <div v-if="activeView === 'places'">
      <div v-if="loadingPlaces" class="text-center py-8 text-gray-600">Loading...</div>
      <div v-else-if="filteredSavedPlaces.length === 0" class="text-center py-8 animate-fade-in-up">
          <img 
            src="/src/assets/pics/matchavertical.jpeg" 
            alt="Matcha" 
            class="w-48 h-48 object-cover rounded-lg mx-auto mb-4 shadow-lg animate-float"
          />
        <p class="text-gray-600 font-decorative text-lg">No saved places yet</p>
        <p class="text-sm text-gray-500 mt-2">Start exploring and save your favorites!</p>
        <router-link to="/" class="text-matcha-600 hover:text-matcha-700 font-medium hover-grow inline-block">
          Discover places to save ✨
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="place in filteredSavedPlaces"
          :key="place._id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover-lift stagger-item"
        >
          <div v-if="place.photos && place.photos.length > 0" class="h-40 bg-gray-200">
            <img :src="place.photos[0]" :alt="place.name" class="w-full h-full object-cover" />
          </div>
          <div v-else class="h-40 bg-matcha-100 flex items-center justify-center">
            <span class="text-5xl animate-pulse-soft">🍵</span>
          </div>
          
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2 text-dark-green">{{ place.name }}</h3>
            <p class="text-sm text-gray-600 mb-3">{{ place.address }}</p>
            <div class="flex items-center justify-between text-sm mb-3">
              <span class="text-gray-500">{{ place.priceRange }}</span>
              <span class="text-matcha-600">{{ place.preparationStyles?.join(', ') }}</span>
            </div>
            
            <div class="flex gap-2">
              <button
                @click="removeSavedPlace(place._id)"
                class="flex-1 px-3 py-2 border-2 border-cherry-blossom text-brown rounded-lg hover:bg-cherry-blossom transition-all text-sm font-medium hover-grow"
              >
                🗑️ Delete
              </button>
              <button
                @click="addLogForPlace(place._id)"
                class="flex-1 px-3 py-2 bg-brighter-green text-white rounded-lg hover:bg-matcha-green transition-all text-sm font-medium btn-cute"
              >
                ✨ Add Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Logs View -->
    <div v-else>
      <div v-if="loadingLogs" class="text-center py-8 text-gray-600">Loading...</div>
      <div v-else-if="filteredLogs.length === 0" class="text-center py-8 animate-fade-in-up">
          <img 
            src="/src/assets/pics/matchavertical.jpeg" 
            alt="Matcha" 
            class="w-48 h-48 object-cover rounded-lg mx-auto mb-4 shadow-lg animate-bounce-gentle"
          />
        <p class="text-gray-600 font-decorative text-lg">No logs yet</p>
        <p class="text-sm text-gray-500 mt-2">Create your first matcha experience log!</p>
        <router-link to="/" class="text-matcha-600 hover:text-matcha-700 font-medium hover-grow inline-block">
          Visit a place and add your first log ✨
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="log in filteredLogs"
          :key="log._id"
          class="bg-white rounded-lg shadow-md p-6 hover-lift stagger-item"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="text-lg font-semibold text-dark-green">{{ log.placeName }}</h3>
              <p class="text-sm text-gray-500">{{ formatDate(log.timestamp) }}</p>
            </div>
            <div class="flex items-center">
              <span class="text-yellow-500 mr-1">★</span>
              <span class="font-medium">{{ log.rating }}/5</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p class="text-xs text-gray-500 mb-1">Sweetness</p>
              <div class="flex items-center">
                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-matcha-600"
                    :style="{ width: `${(log.sweetness / 5) * 100}%` }"
                  ></div>
                </div>
                <span class="ml-2 text-sm font-medium">{{ log.sweetness }}/5</span>
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Strength</p>
              <div class="flex items-center">
                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-matcha-600"
                    :style="{ width: `${(log.strength / 5) * 100}%` }"
                  ></div>
                </div>
                <span class="ml-2 text-sm font-medium">{{ log.strength }}/5</span>
              </div>
            </div>
          </div>

          <p v-if="log.notes" class="text-sm text-gray-700 mb-3">{{ log.notes }}</p>

          <div v-if="log.photos && log.photos.length > 0" class="flex gap-2">
            <img
              v-for="(photo, index) in log.photos"
              :key="index"
              :src="photo"
              :alt="`Log photo ${index + 1}`"
              class="w-20 h-20 object-cover rounded-md"
            />
          </div>

          <button
            @click="deleteLog(log._id)"
            class="mt-3 px-4 py-2 text-sm bg-cherry-blossom text-brown rounded-lg hover:bg-darker-light-pink font-medium transition-all hover-grow"
          >
            🗑️ Delete Log
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { userDirectoryAPI, experienceLogAPI, placeDirectoryAPI, recommendationEngineAPI } from '@/services/api'
import GlassSurface from '@/components/GlassSurface.vue'

const router = useRouter()
const userStore = useUserStore()

const activeView = ref('places')
const loadingPlaces = ref(false)
const loadingLogs = ref(false)
const filterQuery = ref('')
const filterRating = ref('')

const savedPlaces = ref<any[]>([])
const logs = ref<any[]>([])

// Filtered saved places
const filteredSavedPlaces = computed(() => {
  if (!filterQuery.value.trim()) return savedPlaces.value
  
  const query = filterQuery.value.toLowerCase()
  return savedPlaces.value.filter(place =>
    place.name.toLowerCase().includes(query) ||
    place.address.toLowerCase().includes(query)
  )
})

// Filtered logs
const filteredLogs = computed(() => {
  let filtered = [...logs.value]
  
  // Search filter
  if (filterQuery.value.trim()) {
    const query = filterQuery.value.toLowerCase()
    filtered = filtered.filter(log =>
      log.placeName.toLowerCase().includes(query) ||
      (log.notes && log.notes.toLowerCase().includes(query))
    )
  }
  
  // Rating filter
  if (filterRating.value) {
    const minRating = parseInt(filterRating.value)
    filtered = filtered.filter(log => log.rating >= minRating)
  }
  
  return filtered
})

// Load saved places
const loadSavedPlaces = async () => {
  loadingPlaces.value = true
  
  // Safety timeout to ensure loading state clears
  const timeoutId = setTimeout(() => {
    console.error('CollectionView: loadSavedPlaces timeout - forcing loading to false')
    loadingPlaces.value = false
  }, 10000) // 10 second timeout
  
  try {
    const userId = userStore.userId
    if (!userId) {
      console.warn('CollectionView: No userId, cannot load saved places')
      savedPlaces.value = []
      return
    }
    
    console.log('CollectionView: Loading saved places for userId:', userId)
    const response = await userDirectoryAPI.getSavedPlaces(userId)
    console.log('CollectionView: getSavedPlaces response:', response)
    
    if (response && response.places && response.places.length > 0) {
      console.log(`CollectionView: Fetching details for ${response.places.length} saved places`)
      console.log('CollectionView: Place IDs:', response.places)
      
      const placeDetailsPromises = response.places.map(async (placeId) => {
        try {
          console.log('CollectionView: Fetching details for placeId:', placeId)
          const detail = await placeDirectoryAPI.getDetails(placeId)
          console.log('CollectionView: Got details for', detail.place.name)
          return detail
        } catch (err) {
          console.error('CollectionView: Failed to fetch details for placeId:', placeId, err)
          return null
        }
      })
      
      const placeDetails = await Promise.all(placeDetailsPromises)
      const validPlaces = placeDetails.filter(detail => detail !== null).map(detail => detail.place)
      savedPlaces.value = validPlaces
      console.log('CollectionView: Loaded', savedPlaces.value.length, 'saved places')
    } else {
      console.log('CollectionView: No saved places found or empty response')
      console.log('CollectionView: response.places:', response?.places)
      savedPlaces.value = []
    }
  } catch (error) {
    console.error('CollectionView: Error loading saved places:', error)
    console.error('CollectionView: Error details:', error instanceof Error ? error.message : String(error))
    savedPlaces.value = []
  } finally {
    clearTimeout(timeoutId)
    loadingPlaces.value = false
    console.log('CollectionView: loadSavedPlaces complete, loadingPlaces:', loadingPlaces.value)
  }
}

// Load logs
const loadLogs = async () => {
  loadingLogs.value = true
  try {
    const userId = userStore.userId
    if (!userId) {
      console.warn('CollectionView: No userId, cannot load logs')
      logs.value = []
      return
    }
    
    const response = await experienceLogAPI.getUserLogs(userId)
    if (response.logs) {
      // Enrich logs with place names
      const enrichedLogs = await Promise.all(
        response.logs.map(async (log: any) => {
          try {
            const placeDetail = await placeDirectoryAPI.getDetails(log.placeId)
            return {
              ...log,
              placeName: placeDetail.place.name
            }
          } catch {
            return {
              ...log,
              placeName: 'Unknown Place'
            }
          }
        })
      )
      logs.value = enrichedLogs
      console.log('CollectionView: Loaded', logs.value.length, 'logs')
    } else {
      console.log('CollectionView: No logs found')
      logs.value = []
    }
  } catch (error) {
    console.error('CollectionView: Error loading logs:', error)
    console.error('CollectionView: Error details:', error instanceof Error ? error.message : String(error))
    logs.value = []
  } finally {
    loadingLogs.value = false
    console.log('CollectionView: loadLogs complete, loadingLogs:', loadingLogs.value)
  }
}

// Remove saved place
const removeSavedPlace = async (placeId: string) => {
  if (!confirm('Remove this place from your saved collection?')) return
  
  try {
    await userDirectoryAPI.unsavePlace(userStore.userId || '', placeId)
    savedPlaces.value = savedPlaces.value.filter(p => p._id !== placeId)
  } catch (error) {
    console.error('Error removing saved place:', error)
    alert('Failed to remove place')
  }
}

// Add log for place
const addLogForPlace = (placeId: string) => {
  router.push(`/places/${placeId}/log`)
}

// Delete log
const deleteLog = async (logId: string) => {
  if (!confirm('Delete this log?')) return
  
  try {
    await experienceLogAPI.deleteLog(logId)
    logs.value = logs.value.filter(l => l._id !== logId)
    
    // Refresh recommendations after deleting a log
    if (userStore.userId) {
      try {
        const savedResult = await userDirectoryAPI.getSavedPlaces(userStore.userId)
        const triedResult = await experienceLogAPI.getTriedPlaces(userStore.userId)
        
        await recommendationEngineAPI.refreshRecommendations({
          userId: userStore.userId,
          savedPlaces: savedResult.places || [],
          preferences: {},
          triedPlaces: triedResult.places || []
        })
      } catch (recError) {
        console.error('Error refreshing recommendations:', recError)
        // Don't fail the whole operation if recommendation refresh fails
      }
    }
  } catch (error) {
    console.error('Error deleting log:', error)
    alert('Failed to delete log')
  }
}

// Format date
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

onMounted(() => {
  loadSavedPlaces()
  loadLogs()
})
</script>
