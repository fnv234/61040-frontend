<template>
  <div class="px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">My Experience Logs</h1>

    <div v-if="!userStore.isLoggedIn" class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
      <p class="text-yellow-800">Please log in to view your experience logs.</p>
    </div>

    <div v-else-if="loading" class="text-center py-8">
      <p class="text-gray-600">Loading your logs...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <div v-else-if="logs.length === 0" class="text-center py-8">
      <p class="text-gray-600">You haven't logged any experiences yet.</p>
      <router-link
        to="/places"
        class="inline-block mt-4 px-6 py-2 bg-matcha-600 text-white rounded-md hover:bg-matcha-700"
      >
        Explore Places
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="log in logs"
        :key="log._id"
        class="bg-white rounded-lg shadow-md p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-semibold">{{ getPlaceName(log.placeId) }}</h3>
            <p class="text-sm text-gray-500">{{ formatDate(log.timestamp) }}</p>
          </div>
          <button
            @click="deleteLog(log._id)"
            class="text-red-600 hover:text-red-700"
          >
            🗑️ Delete
          </button>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-4">
          <div>
            <span class="text-sm text-gray-500">Rating</span>
            <div class="text-2xl font-semibold text-matcha-600">
              {{ log.rating }}/5
            </div>
          </div>
          <div>
            <span class="text-sm text-gray-500">Sweetness</span>
            <div class="text-2xl font-semibold text-matcha-600">
              {{ log.sweetness }}/5
            </div>
          </div>
          <div>
            <span class="text-sm text-gray-500">Strength</span>
            <div class="text-2xl font-semibold text-matcha-600">
              {{ log.strength }}/5
            </div>
          </div>
        </div>

        <div v-if="log.notes" class="mt-4">
          <span class="text-sm font-medium text-gray-700">Notes:</span>
          <p class="text-gray-600 mt-1">{{ log.notes }}</p>
        </div>

        <div v-if="log.photo" class="mt-4">
          <img :src="log.photo" :alt="'Photo from ' + getPlaceName(log.placeId)" class="rounded-md max-h-64" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { experienceLogAPI, placeDirectoryAPI } from '@/services/api'

const userStore = useUserStore()
const logs = ref([])
const places = ref({})
const loading = ref(false)
const error = ref(null)

const loadLogs = async () => {
  if (!userStore.isLoggedIn) return
  
  loading.value = true
  error.value = null
  
  try {
    const result = await experienceLogAPI.getUserLogs(userStore.userId)
    logs.value = result.logs || []
    
    // Load place details for each log
    const uniquePlaceIds = [...new Set(logs.value.map(log => log.placeId))]
    for (const placeId of uniquePlaceIds) {
      try {
        const placeResult = await placeDirectoryAPI.getDetails(placeId)
        places.value[placeId] = placeResult.place
      } catch (err) {
        console.error(`Error loading place ${placeId}:`, err)
      }
    }
  } catch (err) {
    error.value = err.message
    console.error('Error loading logs:', err)
  } finally {
    loading.value = false
  }
}

const getPlaceName = (placeId) => {
  return places.value[placeId]?.name || 'Unknown Place'
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const deleteLog = async (logId) => {
  if (!confirm('Are you sure you want to delete this log?')) return
  
  try {
    await experienceLogAPI.deleteLog(logId)
    logs.value = logs.value.filter(log => log._id !== logId)
  } catch (err) {
    alert('Error: ' + err.message)
  }
}

onMounted(() => {
  loadLogs()
})
</script>
