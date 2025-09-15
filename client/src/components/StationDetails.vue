<script setup lang="ts">
import { ref, defineProps, watch } from 'vue'
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
}>()

const arrivals = ref<BoardEntry[]>([])
const departures = ref<BoardEntry[]>([])
const loading = ref(false)

watch(
  () => props.stationId,
  async (newStationId) => {
    if (!newStationId) {
      arrivals.value = []
      departures.value = []
      return
    }
    loading.value = true
    try {
      const { data } = await fetchStationDetails(newStationId)
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
    }
  },
  { immediate: true },
)
</script>

<template>
  <v-container>
    <v-progress-circular v-if="loading" indeterminate color="primary" />
    <h2 v-if="!loading">Abfahrten</h2>
    <BoardTable v-if="!loading" :entries="departures" type="Abfahrt" />
    <h2 v-if="!loading">Ankünfte</h2>
    <BoardTable v-if="!loading" :entries="arrivals" type="Ankunft" />
  </v-container>
</template>
