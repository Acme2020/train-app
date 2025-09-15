<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue'
import { fetchStationSuggestions } from '../api'

interface StationSuggestion {
  id: string
  name: string
}

const search = ref('')
const suggestions = ref<StationSuggestion[]>([])
const loading = ref(false)

// Emit event to parent when a station is selected
const emit = defineEmits<{
  (e: 'update:selectedStation', stationId: string | null): void
}>()

let debounceTimeout: ReturnType<typeof setTimeout> | null = null

// Custom debounce function
function debounce(func: (...args: string[]) => void, delay: number) {
  return (...args: unknown[]) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
    debounceTimeout = setTimeout(() => {
      func(...(args as string[]))
    }, delay)
  }
}

// Debounced function for fetching station suggestions
const fetchSuggestions = debounce(async (val: string) => {
  if (!val) {
    suggestions.value = []
    return
  }

  loading.value = true
  try {
    const { data } = await fetchStationSuggestions(val)
    suggestions.value = data
  } catch (err) {
    console.error('Error fetching suggestions:', err)
    suggestions.value = []
  } finally {
    loading.value = false
  }
}, 200)

// Watch search input and call the debounced function
watch(search, (val) => {
  fetchSuggestions(val)
})
</script>

<template>
  <v-container style="max-width: 600px; margin: 0 auto; padding-top: 32px">
    <v-autocomplete
      v-model:search="search"
      label="Bahnhof suchen..."
      variant="outlined"
      density="compact"
      clearable
      :items="suggestions"
      item-title="name"
      item-value="id"
      :loading="loading"
      hide-no-data
      hide-selected
      @update:model-value="
        (value) => {
          console.log('Emitted value:', value) // Log the emitted value
          emit('update:selectedStation', value)
        }
      "
    />
  </v-container>
</template>
