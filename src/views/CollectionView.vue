<template>
  <div class="px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">⭐ My Collection</h1>

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
        <input
          v-model="filterQuery"
          type="text"
          :placeholder="activeView === 'places' ? 'Search saved places...' : 'Search logs...'"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500"
        />
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
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-600">Loading saved places...</p>
      </div>
      
      <div v-else-if="filteredSavedPlaces.length === 0" class="text-center py-12">
        <p class="text-gray-600 mb-4">No saved places yet</p>
        <router-link to="/" class="text-matcha-600 hover:text-matcha-700 font-medium">
          Discover places to save
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="place in filteredSavedPlaces"
          :key="place._id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div v-if="place.photos && place.photos.length > 0" class="h-40 bg-gray-200">
            <img :src="place.photos[0]" :alt="place.name" class="w-full h-full object-cover" />
          </div>
          <div v-else class="h-40 bg-matcha-100 flex items-center justify-center">
            <span class="text-5xl">🍵</span>
          </div>
          
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">{{ place.name }}</h3>
            <p class="text-sm text-gray-600 mb-3">{{ place.address }}</p>
            <div class="flex items-center justify-between text-sm mb-3">
              <span class="text-gray-500">{{ place.priceRange }}</span>
              <span class="text-matcha-600">{{ place.preparationStyles?.join(', ') }}</span>
            </div>
            
            <div class="flex gap-2">
              <button
                @click="removeSavedPlace(place._id)"
                class="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm font-medium"
              >
                Delete
              </button>
              <button
                @click="addLogForPlace(place._id)"
                class="flex-1 px-3 py-2 bg-matcha-600 text-white rounded-md hover:bg-matcha-700 transition-colors text-sm font-medium"
              >
                + Add Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Logs View -->
    <div v-else>
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-600">Loading logs...</p>
      </div>
      
      <div v-else-if="filteredLogs.length === 0" class="text-center py-12">
        <p class="text-gray-600 mb-4">No logs yet</p>
        <router-link to="/" class="text-matcha-600 hover:text-matcha-700 font-medium">
          Visit a place and add your first log
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="log in filteredLogs"
          :key="log._id"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ log.placeName }}</h3>
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
            class="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Delete Log
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
import { userDirectoryAPI, experienceLogAPI, placeDirectoryAPI } from '@/services/api'

const router = useRouter()
const userStore = useUserStore()

const activeView = ref('places')
const loading = ref(false)
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
  loading.value = true
  try {
    const response = await userDirectoryAPI.getSavedPlaces(userStore.userId)
    if (response.places && response.places.length > 0) {
      const placeDetailsPromises = response.places.map(placeId =>
        placeDirectoryAPI.getDetails(placeId)
      )
      const placeDetails = await Promise.all(placeDetailsPromises)
      savedPlaces.value = placeDetails.map(detail => detail.place)
    }
  } catch (error) {
    console.error('Error loading saved places:', error)
  } finally {
    loading.value = false
  }
}

// Load logs
const loadLogs = async () => {
  loading.value = true
  try {
    const response = await experienceLogAPI.getUserLogs(userStore.userId)
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
    }
  } catch (error) {
    console.error('Error loading logs:', error)
  } finally {
    loading.value = false
  }
}

// Remove saved place
const removeSavedPlace = async (placeId: string) => {
  if (!confirm('Remove this place from your saved collection?')) return
  
  try {
    await userDirectoryAPI.unsavePlace(userStore.userId, placeId)
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
    await experienceLogAPI.deleteLog(userStore.userId, logId)
    logs.value = logs.value.filter(l => l._id !== logId)
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
