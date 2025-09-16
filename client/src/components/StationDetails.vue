<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { fetchStationDetails } from '../api'
import BoardTable from './BoardTable.vue'

interface BoardEntry {
  tripId: string
  when: string
  plannedWhen: string
  delay: number | null
  platform: string | null
  direction: string | null
  line?: { name: string; productName: string }
  stop?: { id: string; name: string; latitude?: number; longitude?: number }
  stopName?: string
  lineName?: string
}

const props = defineProps<{
  stationId: string | null
  duration?: number
}>()

const emit = defineEmits<{
  (e: 'loading', value: boolean): void
}>()

const arrivals = ref<BoardEntry[]>([])
const departures = ref<BoardEntry[]>([])
const loading = ref(false)

watch(
  () => [props.stationId, props.duration],
  async ([newStationId, newDuration]) => {
    if (!newStationId) {
      arrivals.value = []
      departures.value = []
      return
    }

    loading.value = true
    emit('loading', true) // Emit loading state to parent

    try {
      const { data } = await fetchStationDetails(newStationId, newDuration)
      arrivals.value = Array.isArray(data.arrivals)
        ? data.arrivals.map((a: BoardEntry) => ({
            ...a,
            stopName: a.stop?.name || '',
            lineName: a.line?.name || '',
          }))
        : []
      departures.value = Array.isArray(data.departures)
        ? data.departures.map((d: BoardEntry) => ({
            ...d,
            stopName: d.stop?.name || '',
            lineName: d.line?.name || '',
          }))
        : []
    } catch (err) {
      console.error('Error fetching station details:', err)
      arrivals.value = []
      departures.value = []
    } finally {
      loading.value = false
      emit('loading', false)
    }
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
