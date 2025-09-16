<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue'
import { fetchStationSuggestions } from '../api'
import type { Station } from '../../../shared/types'

const search = ref('')
const suggestions = ref<Station[]>([])
const loading = ref(false)

// Emit event to parent when a station is selected
const emit = defineEmits<{
  (e: 'update:selectedStation', station: Station | null): void
}>()

let debounceTimeout: ReturnType<typeof setTimeout> | null = null

// Debounce function
const debounce = (func: (...args: string[]) => void, delay: number) => {
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
  <v-autocomplete
    label="Bahnhof suchen..."
    placeholder="Geben Sie den Namen eines Bahnhofs ein"
    variant="outlined"
    density="compact"
    clearable
    :items="suggestions"
    item-title="name"
    return-object
    no-filter
    :loading="loading"
    v-model:search="search"
    hide-no-data
    menu-icon=""
    persistent-placeholder
    hide-details="auto"
    style="max-width: 500px"
    @update:model-value="(station) => emit('update:selectedStation', station)"
  >
    <template #prepend-inner>
      <v-icon icon="mdi-magnify" />
    </template>
  </v-autocomplete>
</template>
