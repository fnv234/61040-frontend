<template>
  <div class="px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Matcha Places</h1>
      <router-link
        to="/places/add"
        class="px-4 py-2 bg-matcha-600 text-white rounded-md hover:bg-matcha-700 transition-colors font-medium inline-flex items-center"
      >
        <span class="mr-2">+</span> Add Place
      </router-link>
    </div>

    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search places by name..."
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500"
        @input="handleSearch"
      />
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Loading places...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <div v-else-if="places.length === 0" class="text-center py-8">
      <p class="text-gray-600">No places found. Try a different search.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="place in places"
        :key="place._id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        @click="goToPlace(place._id)"
      >
        <div v-if="place.photos && place.photos.length > 0" class="h-48 bg-gray-200">
          <img :src="place.photos[0]" :alt="place.name" class="w-full h-full object-cover" />
        </div>
        <div v-else class="h-48 bg-matcha-100 flex items-center justify-center">
          <span class="text-6xl">🍵</span>
        </div>
        
        <div class="p-4">
          <h3 class="text-xl font-semibold mb-2">{{ place.name }}</h3>
          <p class="text-gray-600 text-sm mb-2">{{ place.address }}</p>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">{{ place.priceRange }}</span>
            <span v-if="place.preparationStyles" class="text-sm text-matcha-600">
              {{ place.preparationStyles.join(', ') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { placeDirectoryAPI } from '@/services/api'

const router = useRouter()
const searchQuery = ref('')
const places = ref([])
const loading = ref(false)
const error = ref(null)

const loadPlaces = async () => {
  loading.value = true
  error.value = null
  
  try {
    // For now, search with empty query to get all places
    const result = await placeDirectoryAPI.searchByName('')
    
    // Get details for each place
    if (result.places && result.places.length > 0) {
      const placeDetails = await Promise.all(
        result.places.map(placeId => placeDirectoryAPI.getDetails(placeId))
      )
      places.value = placeDetails.map(detail => detail.place)
    } else {
      places.value = []
    }
  } catch (err) {
    error.value = err.message
    console.error('Error loading places:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    await loadPlaces()
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const result = await placeDirectoryAPI.searchByName(searchQuery.value)
    
    if (result.places && result.places.length > 0) {
      const placeDetails = await Promise.all(
        result.places.map(placeId => placeDirectoryAPI.getDetails(placeId))
      )
      places.value = placeDetails.map(detail => detail.place)
    } else {
      places.value = []
    }
  } catch (err) {
    error.value = err.message
    console.error('Error searching places:', err)
  } finally {
    loading.value = false
  }
}

const goToPlace = (placeId) => {
  router.push(`/places/${placeId}`)
}

onMounted(() => {
  loadPlaces()
})
</script>
