<script setup lang="ts">
import { defineProps } from 'vue'
import { useTheme } from 'vuetify'

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

// Access current Vuetify theme colors
const theme = useTheme()
const errorColor = theme.current.value.colors.error
const successColor = theme.current.value.colors.success
</script>

<template>
  <v-data-table-virtual
    :headers="headers"
    :items="entries"
    item-value="tripId"
    height="300"
    fixed-header
  >
    <!-- Format Zeit -->
    <template #item.when="{ item }">
      {{ new Date(item.when).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
    </template>

    <!-- Delay formatting using theme colors -->
    <template #item.delay="{ item }">
      <span v-if="item.delay && item.delay > 0" :style="{ color: errorColor }">
        +{{ item.delay }} min
      </span>
      <span v-else-if="item.delay === 0" :style="{ color: successColor }"> pünktlich </span>
      <span v-else :style="{ color: errorColor }"> &mdash; </span>
    </template>

    <!-- Custom "no data" message -->
    <template #no-data>
      <div style="padding: 16px; text-align: center; color: var(--text)">
        Keine Einträge gefunden
      </div>
    </template>
  </v-data-table-virtual>
</template>
