<script setup lang="ts">
// Define props
defineProps<{
  loading: boolean
  // Optional prop to make overlay cover full page
  fullPage?: boolean
}>()
</script>

<template>
  <div v-if="loading" class="loading-overlay" :class="{ 'full-page': fullPage }">
    <v-progress-circular size="64" color="secondary" indeterminate></v-progress-circular>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.full-page {
  position: fixed;
  z-index: 1000;
}
</style>
