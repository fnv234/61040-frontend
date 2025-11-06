<template>
  <div class="map-container">
    <div ref="mapContainer" class="map"></div>
    <div v-if="isLoading" class="map-loading">
      <div class="spinner"></div>
      <p>Loading map...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const props = defineProps<{
  places?: Array<{
    _id: string
    name: string
    address: string
    coordinates: [number, number]
    preparationStyles: string[]
    priceRange: string
  }>
  userLocation?: [number, number]
}>()

const emit = defineEmits<{
  placeClick: [placeId: string]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<any>(null)
const markers = ref<any[]>([])
const isLoading = ref(true)

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZm52MjM0IiwiYSI6ImNtOTI5amN0dDA5cGcybHBuYzZuczh4YTIifQ.rcAYW3Br3OmP3Jy_rZaCeQ'

onMounted(() => {
  if (!mapContainer.value) return

  mapboxgl.accessToken = MAPBOX_TOKEN

  // Default to Boston/Cambridge area if no user location
  const defaultCenter: [number, number] = props.userLocation || [-71.0942, 42.3601]

  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: defaultCenter,
    zoom: 13
  })

  ;(map.value as any).on('load', () => {
    isLoading.value = false
    
    // Add user location marker if available
    if (props.userLocation) {
      new mapboxgl.Marker({ color: '#4CAF50' })
        .setLngLat(props.userLocation)
        .setPopup(new mapboxgl.Popup().setHTML('<strong>Your Location</strong>'))
        .addTo(map.value as any)
    }

    // Add place markers
    updateMarkers()
  })

  // Add navigation controls
  ;(map.value as any).addControl(new mapboxgl.NavigationControl(), 'top-right')
})

const updateMarkers = () => {
  if (!map.value || !props.places) return

  // Clear existing markers
  markers.value.forEach(marker => marker.remove())
  markers.value = []

  // Add new markers for each place
  props.places.forEach(place => {
    const el = document.createElement('div')
    el.className = 'custom-marker'
    el.innerHTML = '🍵'
    el.style.cursor = 'pointer'
    el.style.fontSize = '24px'

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div style="padding: 8px;">
        <h3 style="margin: 0 0 8px 0; font-weight: 600;">${place.name}</h3>
        <p style="margin: 4px 0; font-size: 14px; color: #666;">${place.address || 'Address not available'}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Price:</strong> ${place.priceRange || 'N/A'}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Styles:</strong> ${place.preparationStyles && place.preparationStyles.length > 0 ? place.preparationStyles.join(', ') : 'Not specified'}</p>
        <button 
          onclick="window.dispatchEvent(new CustomEvent('place-click', { detail: '${place._id}' }))"
          style="margin-top: 8px; padding: 6px 12px; background: #6B8E23; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;"
        >
          View Details
        </button>
      </div>
    `)

    const marker = new mapboxgl.Marker(el)
      .setLngLat(place.coordinates)
      .setPopup(popup)
      .addTo(map.value as any)

    markers.value.push(marker)
  })

  // Fit map to show all markers
  if (props.places.length > 0) {
    const bounds = new mapboxgl.LngLatBounds()
    props.places.forEach(place => bounds.extend(place.coordinates))
    if (props.userLocation) bounds.extend(props.userLocation)
    ;(map.value as any).fitBounds(bounds, { padding: 50, maxZoom: 15 })
  }
}

// Listen for place clicks from popup
onMounted(() => {
  window.addEventListener('place-click', (e: any) => {
    emit('placeClick', e.detail)
  })
})

// Update markers when places change
watch(() => props.places, updateMarkers, { deep: true })

onUnmounted(() => {
  map.value?.remove()
})
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map {
  width: 100%;
  height: 100%;
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #6B8E23;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.map-loading p {
  margin-top: 16px;
  color: #666;
  font-weight: 500;
}
</style>
