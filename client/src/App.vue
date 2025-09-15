<script setup lang="ts">
import { ref } from 'vue'
import StationSearch from './components/StationSearch.vue'
import StationDetails from './components/StationDetails.vue'
import DurationInput from './components/DurationInput.vue'

const selectedStation = ref<string | null>(null)
const duration = ref(10) // Default duration in minutes
</script>

<template>
  <v-app>
    <v-main>
      <div style="display: flex; align-items: center">
        <StationSearch @update:selectedStation="selectedStation = $event" />
        <DurationInput :duration="duration" @update:duration="duration = $event" />
      </div>
      <StationDetails :stationId="selectedStation" :duration="duration" />
    </v-main>
  </v-app>
</template>
