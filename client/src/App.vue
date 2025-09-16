<script setup lang="ts">
import { ref } from 'vue'
import StationSearch from './components/StationSearch.vue'
import StationDetails from './components/StationDetails.vue'
import DurationInput from './components/DurationInput.vue'
import type { Station } from '../../shared/types'

const selectedStation = ref<Station | null>(null)
const duration = ref(10) // Default duration in minutes
const isLoading = ref(false) // Track loading state
</script>

<template>
  <v-app class="app-root">
    <!-- Loading overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <v-progress-circular size="96" color="secondary" indeterminate></v-progress-circular>
    </div>
    <v-app-bar color="surface" flat>
      <v-spacer />
      <img src="/logo.svg" alt="Bahnhof Finder" style="height: 72px" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <div
        style="
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 36px;
          margin-top: 100px;
          margin-bottom: 16px;
          padding: 0 16px;
          min-height: 90px;
        "
      >
        <StationSearch @update:selectedStation="selectedStation = $event" />
        <DurationInput :duration="duration" @update:duration="duration = $event" />
      </div>
      <StationDetails
        :station="selectedStation"
        :duration="duration"
        @loading="isLoading = $event"
      />
    </v-main>
  </v-app>
</template>

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
