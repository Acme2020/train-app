<script setup lang="ts">
import { ref } from 'vue'
import StationSearch from '../components/StationSearch.vue'
import StationDetails from '../components/StationDetails.vue'
import DurationInput from '../components/DurationInput.vue'
import ErrorMessage from '../components/ui/ErrorMessage.vue'
import LoadingOverlay from '../components/ui/LoadingOverlay.vue'
import type { Station } from '@shared/types'

const selectedStation = ref<Station | null>(null)
const duration = ref(10) // Default duration in minutes
const isLoading = ref(false) // Track loading state
const error = ref<string | null>(null)

// Handle API errors
const handleError = (message: string) => {
  error.value = message
}

// Clear error message
const clearError = () => {
  error.value = null
}
</script>

<template>
  <!-- Loading overlay -->
  <LoadingOverlay :loading="isLoading" full-page />

  <!-- Error message area (always reserved in layout) -->
  <div class="error-area">
    <ErrorMessage :message="error" dismissable @dismiss="clearError" />
  </div>

  <div class="search-container">
    <StationSearch @update:selectedStation="selectedStation = $event" @error="handleError" />
    <DurationInput :duration="duration" @update:duration="duration = $event" />
  </div>

  <StationDetails
    :station="selectedStation"
    :duration="duration"
    @loading="isLoading = $event"
    @error="handleError"
  />
</template>

<style scoped>
.error-area {
  padding-top: 15px;
  margin: 0 10px;
  height: 80px;
  position: relative;
}

.search-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 15px;
  background-color: var(--v-surface-base);
}
</style>
