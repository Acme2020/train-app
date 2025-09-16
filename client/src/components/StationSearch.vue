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
    console.log('Suggestions received:', data)
    suggestions.value = data
  } catch (err) {
    console.error('Error fetching suggestions:', err)
    suggestions.value = []
  } finally {
    loading.value = false
  }
}, 300)

// Watch search input and call the debounced function
watch(search, (val) => {
  fetchSuggestions(val)
})
</script>

<template>
  <v-autocomplete
    label="Bahnhof suchen..."
    placeholder="Geben Sie den Namen eines Bahnhofs ein"
    variant="outlined"
    density="compact"
    clearable
    :items="suggestions"
    item-title="name"
    item-value="id"
    :loading="loading"
    :return-object="false"
    @update:search="fetchSuggestions"
    hide-no-data
    menu-icon=""
    persistent-placeholder
    hide-details="auto"
    style="max-width: 500px"
    @update:model-value="
      (value) => {
        emit('update:selectedStation', value)
      }
    "
  >
    <template #prepend-inner>
      <v-icon icon="mdi-magnify" />
    </template>
  </v-autocomplete>
</template>
