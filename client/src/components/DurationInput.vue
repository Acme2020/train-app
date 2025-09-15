<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  duration: number
}>()

const emit = defineEmits<{
  (e: 'update:duration', value: number): void
}>()

const localValue = ref(props.duration)

watch(
  () => props.duration,
  (newVal) => {
    if (newVal !== localValue.value) {
      localValue.value = newVal
    }
  },
)

watch(localValue, (val) => {
  emit('update:duration', val)
})
</script>

<template>
  <v-number-input
    v-model="localValue"
    label="Zeitraum (Minuten)"
    :min="5"
    :max="60"
    :step="5"
    variant="outlined"
    density="compact"
    hide-details
    max-width="120"
  />
</template>
