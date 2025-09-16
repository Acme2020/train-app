<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { fetchStationDetails } from '../api'
import { formatApiError } from '../utils/errorHandling'
import BoardTable from './BoardTable.vue'
import type { BoardEntry, Station } from '@shared/types'

const props = defineProps<{
  station: Station | null
  duration?: number
}>()
// Emit loading state to parent
const emit = defineEmits<{
  (e: 'loading', value: boolean): void
  (e: 'error', message: string): void
}>()

const arrivals = ref<BoardEntry[]>([])
const departures = ref<BoardEntry[]>([])
const loading = ref(false)
// Function to fetch board data
const fetchBoard = async (id: string, minutes = 5) => {
  loading.value = true
  emit('loading', true)
  try {
    const { data } = await fetchStationDetails(id, minutes)
    arrivals.value = data.arrivals
    departures.value = data.departures
  } catch (err) {
    arrivals.value = []
    departures.value = []
    // Emit error to parent component with formatted message
    const errorMessage = formatApiError(err)
    emit('error', errorMessage)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}
// Watch for changes in station or duration and fetch data accordingly
watch(
  [() => props.station, () => props.duration],
  async ([newStation, newDuration]) => {
    if (!newStation) {
      arrivals.value = []
      departures.value = []
      return
    }
    await fetchBoard(newStation.id, newDuration ?? 5)
  },
  { immediate: true },
)
</script>

<template>
  <v-container style="padding: 50px">
    <div v-if="!loading">
      <h2 class="mb-2">Abfahrten</h2>
      <BoardTable :entries="departures" type="Abfahrt" />
      <h2 class="pt-6 mb-2">Ankünfte</h2>
      <BoardTable :entries="arrivals" type="Ankunft" />
    </div>
  </v-container>
</template>
