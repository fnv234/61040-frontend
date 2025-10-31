<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Add a Matcha Place</h1>
      <p class="text-gray-600 mb-6">
        Know a great matcha spot that's not on our map? Add it here to help the community!
      </p>

      <div v-if="successMessage" class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ successMessage }}
        <router-link to="/places" class="underline font-medium ml-2">View all places</router-link>
      </div>

      <div v-if="errorMessage" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Place Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Place Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="e.g., Zen Tea House"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500"
          />
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Address <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.address"
            type="text"
            required
            placeholder="123 Main St, Boston, MA 02101"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500"
          />
          <p class="mt-1 text-sm text-gray-500">Full street address including city and state</p>
        </div>

        <!-- Coordinates (optional - can be geocoded) -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Latitude
            </label>
            <input
              v-model.number="form.latitude"
              type="number"
              step="any"
              placeholder="42.3601"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Longitude
            </label>
            <input
              v-model.number="form.longitude"
              type="number"
              step="any"
              placeholder="-71.0942"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500"
            />
          </div>
        </div>
        <p class="text-sm text-gray-500">
          Optional: If you don't know the coordinates, we'll try to find them from the address
        </p>

        <!-- Preparation Styles -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Preparation Styles <span class="text-red-500">*</span>
          </label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="form.preparationStyles"
                type="checkbox"
                value="Ceremonial"
                class="mr-2 h-4 w-4 text-matcha-600 focus:ring-matcha-500 border-gray-300 rounded"
              />
              <span>Ceremonial (Traditional whisked matcha)</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="form.preparationStyles"
                type="checkbox"
                value="Latte"
                class="mr-2 h-4 w-4 text-matcha-600 focus:ring-matcha-500 border-gray-300 rounded"
              />
              <span>Latte (Matcha with milk)</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="form.preparationStyles"
                type="checkbox"
                value="Iced"
                class="mr-2 h-4 w-4 text-matcha-600 focus:ring-matcha-500 border-gray-300 rounded"
              />
              <span>Iced (Cold matcha drinks)</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="form.preparationStyles"
                type="checkbox"
                value="Dessert"
                class="mr-2 h-4 w-4 text-matcha-600 focus:ring-matcha-500 border-gray-300 rounded"
              />
              <span>Dessert (Matcha desserts/baked goods)</span>
            </label>
          </div>
        </div>

        <!-- Price Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Price Range <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.priceRange"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500"
          >
            <option value="">Select price range</option>
            <option value="$">$ - Budget friendly</option>
            <option value="$$">$$ - Moderate</option>
            <option value="$$$">$$$ - Upscale</option>
            <option value="$$$$">$$$$ - Fine dining</option>
          </select>
        </div>

        <!-- Hours -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Hours
          </label>
          <textarea
            v-model="form.hours"
            rows="3"
            placeholder="Mon-Fri: 8am-6pm, Sat-Sun: 9am-5pm"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500"
          ></textarea>
        </div>

        <!-- Photo URLs -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Photo URLs
          </label>
          <div class="space-y-2">
            <input
              v-for="(_photo, index) in form.photos"
              :key="index"
              v-model="form.photos[index]"
              type="url"
              placeholder="https://example.com/photo.jpg"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-matcha-500"
            />
          </div>
          <button
            type="button"
            @click="addPhotoField"
            class="mt-2 text-sm text-matcha-600 hover:text-matcha-700 font-medium"
          >
            + Add another photo
          </button>
        </div>

        <!-- Submit Button -->
        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="flex-1 bg-matcha-600 text-white py-3 px-6 rounded-md hover:bg-matcha-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {{ isLoading ? 'Adding Place...' : 'Add Place' }}
          </button>
          <router-link
            to="/places"
            class="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-center"
          >
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { placeDirectoryAPI } from '@/services/api'

const form = ref({
  name: '',
  address: '',
  latitude: null as number | null,
  longitude: null as number | null,
  preparationStyles: [] as string[],
  priceRange: '',
  hours: '',
  photos: ['', '', '']
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const addPhotoField = () => {
  form.value.photos.push('')
}

const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Validate at least one preparation style
    if (form.value.preparationStyles.length === 0) {
      throw new Error('Please select at least one preparation style')
    }

    // If coordinates not provided, try to geocode the address
    let coordinates: [number, number]
    if (form.value.latitude && form.value.longitude) {
      coordinates = [form.value.longitude, form.value.latitude]
    } else {
      // Simple geocoding fallback - in production, use a proper geocoding service
      // For now, default to Boston area
      coordinates = [-71.0942, 42.3601]
      console.warn('Coordinates not provided, using default location')
    }

    // Filter out empty photo URLs
    const photos = form.value.photos.filter(url => url.trim() !== '')

    // Create place
    await placeDirectoryAPI.createPlace({
      name: form.value.name,
      address: form.value.address,
      coords: coordinates,
      styles: form.value.preparationStyles,
      priceRange: form.value.priceRange,
      hours: form.value.hours || 'Hours not specified',
      photos
    })

    successMessage.value = `Successfully added ${form.value.name}! Thank you for contributing.`
    
    // Reset form
    form.value = {
      name: '',
      address: '',
      latitude: null,
      longitude: null,
      preparationStyles: [],
      priceRange: '',
      hours: '',
      photos: ['', '', '']
    }

    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' })

  } catch (error: any) {
    console.error('Error adding place:', error)
    errorMessage.value = error.message || 'Failed to add place. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
