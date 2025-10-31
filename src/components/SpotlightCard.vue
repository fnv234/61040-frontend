<template>
  <div 
    ref="divRef" 
    @mousemove="handleMouseMove" 
    :class="['card-spotlight', className]"
    :style="{ '--spotlight-color': spotlightColor }"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  className: { type: String, default: '' },
  spotlightColor: { type: String, default: 'rgba(139, 195, 74, 0.2)' }
})

const divRef = ref(null)

const handleMouseMove = (e) => {
  if (!divRef.value) return
  
  const rect = divRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  divRef.value.style.setProperty('--mouse-x', `${x}px`)
  divRef.value.style.setProperty('--mouse-y', `${y}px`)
}
</script>

<style scoped>
.card-spotlight {
  position: relative;
  border-radius: 1rem;
  border: 1px solid rgba(139, 195, 74, 0.2);
  background-color: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  overflow: hidden;
  --mouse-x: 50%;
  --mouse-y: 50%;
  --spotlight-color: rgba(139, 195, 74, 0.15);
  transition: all 0.3s ease;
}

.card-spotlight::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle 400px at var(--mouse-x) var(--mouse-y),
    var(--spotlight-color),
    transparent 80%
  );
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.card-spotlight:hover::before,
.card-spotlight:focus-within::before {
  opacity: 0.8;
}

.card-spotlight:hover {
  border-color: rgba(139, 195, 74, 0.4);
  box-shadow: 0 8px 24px rgba(139, 195, 74, 0.15);
}

@media (prefers-color-scheme: dark) {
  .card-spotlight {
    background-color: rgba(30, 30, 30, 0.95);
    border-color: rgba(139, 195, 74, 0.3);
  }
}
</style>
