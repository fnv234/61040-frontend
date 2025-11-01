<template>
  <div class="px-4 py-8">
    <button
      @click="$router.push('/')"
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
            <div
              v-for="(photo, index) in place.photos"
              :key="index"
              class="relative"
            >
              <img
                :src="getPhotoUrl(photo)"
                :alt="`${place.name} photo ${index + 1}`"
                class="w-full h-40 object-cover rounded-lg"
                @error="(e) => handleImageError(e, photo)"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div v-else-if="place" class="mb-6 text-gray-500 text-sm">
          No photos available for this place yet.
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
import { ref, onMounted, watch } from 'vue'
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
    
    // Debug: Log photos info
    console.log('Place loaded:', place.value.name)
    console.log('Photos:', place.value.photos)
    console.log('Photos length:', place.value.photos?.length || 0)
    
    // Check if place is saved
    if (userStore.isLoggedIn && userStore.userId) {
      try {
        console.log('PlaceDetailView: Checking if place is saved for userId:', userStore.userId)
        const savedPlaces = await userDirectoryAPI.getSavedPlaces(userStore.userId)
        console.log('PlaceDetailView: Saved places response:', savedPlaces)
        const placeId = String(route.params.id)
        isSaved.value = savedPlaces.places && savedPlaces.places.includes(placeId)
        console.log('PlaceDetailView: Is place saved?', isSaved.value)
      } catch (err) {
        console.error('PlaceDetailView: Error checking saved places:', err)
        isSaved.value = false
      }
    } else {
      console.log('PlaceDetailView: User not logged in, cannot check saved status')
      isSaved.value = false
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

const getPhotoUrl = (photo) => {
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

const handleImageError = (event, originalUrl) => {
  console.error('Image failed to load:', originalUrl)
  console.error('Processed URL was:', event.target.src)
  console.error('Error details:', event)
  
  // Try to show a placeholder or hide the broken image
  event.target.style.display = 'none'
}

const loadPlaceLogs = async () => {
  try {
    // Get logs for this place - pass userId to get all logs for this place
    const response = await experienceLogAPI.getPlaceLogs(userStore.userId, route.params.id)
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
    const userId = userStore.userId
    const placeId = String(route.params.id)
    
    if (!userId) {
      console.error('PlaceDetailView: Cannot save - no userId')
      alert('Please log in to save places')
      return
    }
    
    if (!placeId) {
      console.error('PlaceDetailView: Cannot save - no placeId')
      alert('Invalid place')
      return
    }
    
    console.log('PlaceDetailView: toggleSave called', { userId, placeId, isSaved: isSaved.value })
    
    if (isSaved.value) {
      console.log('PlaceDetailView: Unsaving place...')
      await userDirectoryAPI.unsavePlace(userId, placeId)
      isSaved.value = false
      console.log('PlaceDetailView: Place unsaved successfully')
    } else {
      console.log('PlaceDetailView: Saving place...')
      
      try {
        await userDirectoryAPI.savePlace(userId, placeId)
        console.log('PlaceDetailView: Save API call completed')
      } catch (saveError) {
        // If save fails because user doesn't exist, register them and try again
        if (saveError instanceof Error && saveError.message.includes('not found')) {
          console.log('PlaceDetailView: User not found, registering...')
          try {
            await userDirectoryAPI.registerUser({
              userId,
              displayName: userStore.displayName || 'User',
              email: userStore.email || `${userId}@temp.com`
            })
            console.log('PlaceDetailView: User registered, retrying save...')
            await userDirectoryAPI.savePlace(userId, placeId)
          } catch (registerError) {
            console.error('PlaceDetailView: Failed to register user:', registerError)
            throw saveError // Throw original error
          }
        } else {
          throw saveError
        }
      }
      
      // Immediately verify the save worked
      console.log('PlaceDetailView: Verifying save...')
      const verification = await userDirectoryAPI.getSavedPlaces(userId)
      console.log('PlaceDetailView: Verification result:', verification)
      
      if (verification.places && verification.places.includes(placeId)) {
        console.log('PlaceDetailView: ✅ Save verified - place is in saved list')
        isSaved.value = true
      } else {
        console.error('PlaceDetailView: ❌ Save FAILED - place not in saved list after save!')
        alert('Warning: Save may not have worked. Please try logging out and back in.')
        isSaved.value = true // Still show as saved in UI
      }
      
      console.log('PlaceDetailView: Place saved successfully')
    }
  } catch (err) {
    console.error('PlaceDetailView: Error in toggleSave:', err)
    alert('Error: ' + (err instanceof Error ? err.message : String(err)))
  }
}

onMounted(() => {
  loadPlace()
})

// Watch for route changes to reload logs when coming back from log entry
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadPlace()
  }
})

// Also watch for route meta or query changes that might indicate a refresh is needed
watch(() => route.fullPath, (newPath, oldPath) => {
  // Only reload if we're on the same place (not navigating away)
  if (newPath.includes('/places/') && !newPath.includes('/log') && oldPath.includes('/log')) {
    loadPlaceLogs()
  }
})
</script>
