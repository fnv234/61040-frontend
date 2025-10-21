<template>
  <div class="px-4 py-8">
    <button
      @click="$router.back()"
      class="mb-4 text-matcha-600 hover:text-matcha-700 flex items-center"
    >
      ← Back to Places
    </button>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Loading place details...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <div v-else-if="place" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div v-if="place.photos && place.photos.length > 0" class="h-64 bg-gray-200">
        <img :src="place.photos[0]" :alt="place.name" class="w-full h-full object-cover" />
      </div>
      <div v-else class="h-64 bg-matcha-100 flex items-center justify-center">
        <span class="text-8xl">🍵</span>
      </div>

      <div class="p-6">
        <h1 class="text-3xl font-bold mb-4">{{ place.name }}</h1>
        
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

        <div v-if="userStore.isLoggedIn" class="flex gap-4">
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
          
          <button
            @click="showLogForm = true"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Experience Log
          </button>
        </div>

        <!-- Log Form Modal -->
        <div v-if="showLogForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-xl font-semibold mb-4">Log Your Experience</h3>
            <form @submit.prevent="submitLog" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Rating (1-5)
                </label>
                <input
                  v-model.number="logForm.rating"
                  type="number"
                  min="1"
                  max="5"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Sweetness (1-5)
                </label>
                <input
                  v-model.number="logForm.sweetness"
                  type="number"
                  min="1"
                  max="5"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Strength (1-5)
                </label>
                <input
                  v-model.number="logForm.strength"
                  type="number"
                  min="1"
                  max="5"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  v-model="logForm.notes"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              
              <div class="flex gap-3">
                <button
                  type="submit"
                  class="flex-1 bg-matcha-600 text-white py-2 rounded-md hover:bg-matcha-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  @click="showLogForm = false"
                  class="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
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
const showLogForm = ref(false)

const logForm = ref({
  rating: 3,
  sweetness: 3,
  strength: 3,
  notes: ''
})

const loadPlace = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await placeDirectoryAPI.getDetails(route.params.id)
    place.value = result.place
    
    // Check if place is saved
    if (userStore.isLoggedIn) {
      const savedPlaces = await userDirectoryAPI.getSavedPlaces(userStore.userId)
      isSaved.value = savedPlaces.places.includes(route.params.id)
    }
  } catch (err) {
    error.value = err.message
    console.error('Error loading place:', err)
  } finally {
    loading.value = false
  }
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

const submitLog = async () => {
  try {
    await experienceLogAPI.createLog({
      userId: userStore.userId,
      placeId: route.params.id,
      ...logForm.value
    })
    
    showLogForm.value = false
    alert('Experience logged successfully!')
    
    // Reset form
    logForm.value = {
      rating: 3,
      sweetness: 3,
      strength: 3,
      notes: ''
    }
  } catch (err) {
    alert('Error: ' + err.message)
  }
}

onMounted(() => {
  loadPlace()
})
</script>
