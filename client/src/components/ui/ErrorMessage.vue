<script setup lang="ts">
// Component props
defineProps<{
  message: string | null
  dismissable?: boolean
}>()

// Emit event when error is dismissed
const emit = defineEmits<{
  (e: 'dismiss'): void
}>()
</script>

<template>
  <div class="error-container" v-if="message">
    <v-alert
      type="error"
      variant="tonal"
      class="centered-alert"
      closable
      icon="mdi-alert-circle"
      @click:close="emit('dismiss')"
    >
      {{ message }}
    </v-alert>
  </div>
</template>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 16px;
}

.centered-alert {
  max-width: 800px;
  width: 100%;
  text-align: center;
}
</style>
