<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { fetchStationDetails } from '../api'
import BoardTable from './BoardTable.vue'
import type { BoardEntry, Station } from '../../../shared/types'

const props = defineProps<{
  station: Station | null
  duration?: number
}>()

const emit = defineEmits<{
  (e: 'loading', value: boolean): void
}>()

const arrivals = ref<BoardEntry[]>([])
const departures = ref<BoardEntry[]>([])
const loading = ref(false)

const fetchBoard = async (id: string, minutes = 5) => {
  loading.value = true
  emit('loading', true)
  try {
    const { data } = await fetchStationDetails(id, minutes)
    arrivals.value = data.arrivals
    departures.value = data.departures
  } catch {
    arrivals.value = []
    departures.value = []
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

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
