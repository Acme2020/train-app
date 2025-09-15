<script setup lang="ts">
import { ref } from 'vue'
import StationSearch from './components/StationSearch.vue'
import StationDetails from './components/StationDetails.vue'

const selectedStation = ref<string | null>(null)
</script>

<template>
  <v-app>
    <v-main>
      <StationSearch @update:selectedStation="selectedStation = $event" />
      <StationDetails :stationId="selectedStation" />
    </v-main>
  </v-app>
</template>
