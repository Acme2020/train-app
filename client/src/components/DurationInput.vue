<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  duration: number
}>()

const emit = defineEmits<{
  (e: 'update:duration', value: number): void
}>()

const localValue = ref(props.duration)

// Define validation rules
const rules = [
  (v: number) => v >= 5 || 'Der Wert muss mindestens 5 Minuten betragen.',
  (v: number) => v <= 60 || 'Der Wert darf maximal 60 Minuten betragen.',
]

// Watch props and sync localValue
watch(
  () => props.duration,
  (newVal) => {
    if (newVal !== localValue.value) {
      localValue.value = newVal
    }
  },
)

// Emit changes
watch(localValue, (val) => {
  emit('update:duration', val)
})
</script>

<template>
  <v-text-field
    v-model="localValue"
    label="Zeitraum (Minuten)"
    type="number"
    :min="5"
    :max="60"
    :step="5"
    variant="outlined"
    density="compact"
    :rules="rules"
    hide-details="auto"
    style="max-width: 200px"
  >
    <template #prepend-inner>
      <v-icon icon="mdi-clock-outline" />
    </template>
    <template #append>
      <v-icon icon="mdi-minutes" />
    </template>
  </v-text-field>
</template>
