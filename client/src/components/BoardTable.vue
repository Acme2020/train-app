<script setup lang="ts">
import { defineProps } from 'vue'

interface BoardEntry {
  tripId: string
  when: string
  plannedWhen: string
  delay: number | null
  platform: string | null
  direction: string | null
  stopName?: string
  lineName?: string
}

const props = defineProps<{
  entries: BoardEntry[]
  type: 'Abfahrt' | 'Ankunft'
}>()

// headers depend on type (Abfahrt = Nach, Ankunft = Von)
const headers = [
  { title: 'Zeit', key: 'when', width: 100 },
  { title: props.type === 'Abfahrt' ? 'Nach' : 'Von', key: 'stopName', width: 200 },
  { title: 'Zug/Linie', key: 'lineName', width: 150 },
  { title: 'Gleis', key: 'platform', width: 80 },
  { title: 'Richtung', key: 'direction', width: 200 },
  { title: 'Verspätung', key: 'delay', width: 120 },
]
</script>

<template>
  <v-data-table-virtual
    :headers="headers"
    :items="entries"
    item-value="tripId"
    height="300"
    fixed-header
    class="mt-4 pb-12"
  >
    <!-- Format Zeit -->
    <template #item.when="{ item }">
      {{ new Date(item.when).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
    </template>

    <!-- Delay formatting with colors -->
    <template #item.delay="{ item }">
      <span :class="item.delay && item.delay > 0 ? 'text-danger' : 'text-success'">
        {{ item.delay !== null ? (item.delay > 0 ? `+${item.delay} Min.` : 'pünktlich') : '' }}
      </span>
    </template>
  </v-data-table-virtual>
</template>

<style scoped>
.text-danger {
  color: red;
  font-weight: 500;
}
.text-success {
  color: green;
  font-weight: 500;
}
</style>
