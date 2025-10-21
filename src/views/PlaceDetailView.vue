<template>
  <div class="px-4 py-8">
    <button
      @click="$router.back()"
      class="mb-4 text-matcha-600 hover:text-matcha-700 flex items-center"
    >
      ← Back to Exploration
    </button>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Loading place details...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <div v-else-if="place" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-6">
        <!-- Name and Rating -->
        <h1 class="text-3xl font-bold mb-2">{{ place.name }}</h1>
        
        <!-- Star Rating -->
        <div v-if="averageRating" class="flex items-center mb-4">
          <div class="flex text-yellow-500 text-xl mr-2">
            <span v-for="star in 5" :key="star">
              {{ star <= Math.round(averageRating) ? '★' : '☆' }}
            </span>
          </div>
          <span class="text-sm text-gray-600">{{ averageRating.toFixed(1) }}/5</span>
        </div>

        <!-- Save Button -->
        <div v-if="userStore.isLoggedIn" class="mb-4">
          <button
            @click="toggleSave"
            :class="[
              'px-6 py-2 rounded-md transition-colors',
              isSaved
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-matcha-600 text-white hover:bg-matcha-700'
            ]"
          >
            {{ isSaved ? '❤️ Saved' : '🤍 Save Place' }}
          </button>
        </div>
        
        <!-- Address and Info -->
        <div class="space-y-3 mb-6">
          <div class="flex items-start">
            <span class="text-gray-500 w-24">Address:</span>
            <span class="text-gray-900">{{ place.address }}</span>
          </div>
          
          <div v-if="place.priceRange" class="flex items-start">
            <span class="text-gray-500 w-24">Price:</span>
            <span class="text-gray-900">{{ place.priceRange }}</span>
          </div>
          
          <div v-if="place.hours" class="flex items-start">
            <span class="text-gray-500 w-24">Hours:</span>
            <span class="text-gray-900">{{ place.hours }}</span>
          </div>
          
          <div v-if="place.preparationStyles && place.preparationStyles.length > 0" class="flex items-start">
            <span class="text-gray-500 w-24">Styles:</span>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="style in place.preparationStyles"
                :key="style"
                class="px-3 py-1 bg-matcha-100 text-matcha-700 rounded-full text-sm"
              >
                {{ style }}
              </span>
            </div>
          </div>
        </div>

        <!-- Photos Section (under name and info) -->
        <div v-if="place.photos && place.photos.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold mb-3">Photos</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <img
              v-for="(photo, index) in place.photos"
              :key="index"
              :src="photo"
              :alt="`${place.name} photo ${index + 1}`"
              class="w-full h-40 object-cover rounded-lg"
            />
          </div>
        </div>

        <!-- Sweetness and Strength Sliders -->
        <div v-if="averageSweetness || averageStrength" class="border-t pt-6 mb-6">
          <h3 class="text-lg font-semibold mb-4">Average Levels</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="averageSweetness">
              <p class="text-sm text-gray-600 mb-2">Sweetness</p>
              <div class="flex items-center">
                <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-matcha-600"
                    :style="{ width: `${(averageSweetness / 5) * 100}%` }"
                  ></div>
                </div>
                <span class="ml-3 font-medium">{{ averageSweetness.toFixed(1) }}/5</span>
              </div>
            </div>
            
            <div v-if="averageStrength">
              <p class="text-sm text-gray-600 mb-2">Strength</p>
              <div class="flex items-center">
                <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-matcha-600"
                    :style="{ width: `${(averageStrength / 5) * 100}%` }"
                  ></div>
                </div>
                <span class="ml-3 font-medium">{{ averageStrength.toFixed(1) }}/5</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Entries Section -->
        <div class="mt-8 border-t pt-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Recent Experiences</h2>
            <router-link
              :to="`/places/${route.params.id}/log`"
              class="text-matcha-600 hover:text-matcha-700 font-medium text-sm"
            >
              + ADD
            </router-link>
          </div>

          <div v-if="placeLogs.length === 0" class="text-center py-8 text-gray-500">
            No experiences logged yet. Be the first!
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="log in placeLogs.slice(0, 5)"
              :key="log._id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="flex items-center text-yellow-500">
                  <span v-for="star in log.rating" :key="star">★</span>
                  <span class="ml-2 text-sm text-gray-600">{{ formatDate(log.timestamp) }}</span>
                </div>
              </div>
              
              <p v-if="log.notes" class="text-sm text-gray-700 mb-2">{{ log.notes }}</p>
              
              <div class="flex gap-4 text-xs text-gray-500">
                <span>Sweetness: {{ log.sweetness }}/5</span>
                <span>Strength: {{ log.strength }}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { placeDirectoryAPI, userDirectoryAPI, experienceLogAPI } from '@/services/api'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const place = ref(null)
const loading = ref(false)
const error = ref(null)
const isSaved = ref(false)
const placeLogs = ref([])
const averageRating = ref(0)
const averageSweetness = ref(0)
const averageStrength = ref(0)

const loadPlace = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await placeDirectoryAPI.getDetails(route.params.id)
    place.value = result.place
    
    // Check if place is saved
    if (userStore.isLoggedIn) {
      try {
        const savedPlaces = await userDirectoryAPI.getSavedPlaces(userStore.userId)
        isSaved.value = savedPlaces.places && savedPlaces.places.includes(route.params.id)
      } catch (err) {
        console.error('Error checking saved places:', err)
        isSaved.value = false
      }
    }

    // Load logs for this place
    await loadPlaceLogs()
  } catch (err) {
    error.value = err.message
    console.error('Error loading place:', err)
  } finally {
    loading.value = false
  }
}

const loadPlaceLogs = async () => {
  try {
    const response = await experienceLogAPI.getPlaceLogs(route.params.id)
    if (response.logs && response.logs.length > 0) {
      placeLogs.value = response.logs
      
      // Calculate averages
      const totalRating = response.logs.reduce((sum, log) => sum + log.rating, 0)
      const totalSweetness = response.logs.reduce((sum, log) => sum + log.sweetness, 0)
      const totalStrength = response.logs.reduce((sum, log) => sum + log.strength, 0)
      
      averageRating.value = totalRating / response.logs.length
      averageSweetness.value = totalSweetness / response.logs.length
      averageStrength.value = totalStrength / response.logs.length
    }
  } catch (err) {
    console.error('Error loading place logs:', err)
  }
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const toggleSave = async () => {
  try {
    if (isSaved.value) {
      await userDirectoryAPI.unsavePlace(userStore.userId, route.params.id)
      isSaved.value = false
    } else {
      await userDirectoryAPI.savePlace(userStore.userId, route.params.id)
      isSaved.value = true
    }
  } catch (err) {
    alert('Error: ' + err.message)
  }
}

onMounted(() => {
  loadPlace()
})
</script>
