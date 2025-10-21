<template>
  <div class="px-4 py-8 max-w-2xl mx-auto">
    <button
      @click="$router.back()"
      class="mb-4 text-matcha-600 hover:text-matcha-700 flex items-center"
    >
      ← Back
    </button>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Add Experience Log</h1>
      <p v-if="placeName" class="text-gray-600 mb-6">{{ placeName }}</p>

      <form @submit.prevent="submitLog" class="space-y-6">
        <!-- Star Rating -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Rating <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-2">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="logForm.rating = star"
              class="text-3xl transition-colors"
              :class="star <= logForm.rating ? 'text-yellow-500' : 'text-gray-300'"
            >
              ★
            </button>
          </div>
          <p class="text-sm text-gray-500 mt-1">{{ logForm.rating }} out of 5 stars</p>
        </div>

        <!-- Sweetness Slider -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Sweetness: <span class="font-semibold">{{ logForm.sweetness }}/5</span>
          </label>
          <input
            v-model.number="logForm.sweetness"
            type="range"
            min="1"
            max="5"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-matcha-600"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>Not Sweet</span>
            <span>Very Sweet</span>
          </div>
        </div>

        <!-- Strength Slider -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Strength: <span class="font-semibold">{{ logForm.strength }}/5</span>
          </label>
          <input
            v-model.number="logForm.strength"
            type="range"
            min="1"
            max="5"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-matcha-600"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>Mild</span>
            <span>Strong</span>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            v-model="logForm.notes"
            rows="4"
            placeholder="Share your thoughts about this matcha experience..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500"
          ></textarea>
        </div>

        <!-- Photo Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Photos (Optional)
          </label>
          
          <!-- Photo Upload Button -->
          <div class="flex items-center gap-3 mb-3">
            <label class="cursor-pointer flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-matcha-500 transition-colors">
              <span class="text-2xl">📷</span>
              <span class="text-sm text-gray-600">Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                @change="handlePhotoUpload"
                class="hidden"
                multiple
              />
            </label>
            <p class="text-xs text-gray-500">or paste image URL below</p>
          </div>

          <!-- URL Input (Alternative) -->
          <input
            v-model="photoUrlInput"
            type="url"
            placeholder="https://example.com/photo.jpg"
            @keyup.enter="addPhotoUrl"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500 mb-2"
          />
          <button
            v-if="photoUrlInput"
            type="button"
            @click="addPhotoUrl"
            class="text-sm text-matcha-600 hover:text-matcha-700 font-medium"
          >
            + Add URL
          </button>

          <!-- Photo Previews -->
          <div v-if="logForm.photos.length > 0" class="mt-4 grid grid-cols-3 gap-3">
            <div
              v-for="(photo, index) in logForm.photos"
              :key="index"
              class="relative group"
            >
              <img
                :src="photo"
                :alt="`Preview ${index + 1}`"
                class="w-full h-24 object-cover rounded-md"
              />
              <button
                type="button"
                @click="removePhoto(index)"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ successMessage }}
        </div>

        <!-- Submit Button -->
        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="flex-1 bg-matcha-600 text-white py-3 px-6 rounded-md hover:bg-matcha-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {{ isLoading ? 'Saving...' : 'Save Log' }}
          </button>
          <button
            type="button"
            @click="$router.back()"
            class="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { experienceLogAPI, placeDirectoryAPI } from '@/services/api'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const placeName = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const logForm = ref({
  rating: 3,
  sweetness: 3,
  strength: 3,
  notes: '',
  photos: []
})

const photoUrlInput = ref('')

// Load place name
const loadPlaceName = async () => {
  try {
    const placeId = route.params.id as string
    const response = await placeDirectoryAPI.getDetails(placeId)
    placeName.value = response.place.name
  } catch (error) {
    console.error('Error loading place:', error)
    placeName.value = 'Unknown Place'
  }
}

// Handle photo file upload
const handlePhotoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    // Convert image to base64 data URL
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      logForm.value.photos.push(dataUrl)
    }
    reader.readAsDataURL(file)
  }
  
  // Reset input
  target.value = ''
}

// Add photo from URL
const addPhotoUrl = () => {
  if (photoUrlInput.value.trim()) {
    logForm.value.photos.push(photoUrlInput.value.trim())
    photoUrlInput.value = ''
  }
}

// Remove photo
const removePhoto = (index: number) => {
  logForm.value.photos.splice(index, 1)
}

// Submit log
const submitLog = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const placeId = route.params.id as string
    
    // Use photos array (already contains data URLs or regular URLs)
    const photos = logForm.value.photos.length > 0 ? logForm.value.photos : undefined

    await experienceLogAPI.createLog({
      userId: userStore.userId,
      placeId,
      rating: logForm.value.rating,
      sweetness: logForm.value.sweetness,
      strength: logForm.value.strength,
      notes: logForm.value.notes || undefined,
      photos
    })

    successMessage.value = 'Experience logged successfully!'
    
    // Redirect after short delay - use replace to avoid back button issues
    setTimeout(() => {
      router.replace(`/places/${placeId}`)
    }, 1500)

  } catch (error: any) {
    console.error('Error submitting log:', error)
    errorMessage.value = error.message || 'Failed to save log. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadPlaceName()
})
</script>
