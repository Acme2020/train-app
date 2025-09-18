<script setup lang="ts">
import { ref, watch, computed } from 'vue'

// Define props
const props = defineProps<{
  duration: number
}>()
// Emit event to parent when duration changes
const emit = defineEmits<{
  (e: 'update:duration', value: number): void
}>()

const localValue = ref(props.duration)

// Define validation rules
const rules = [
  (v: number) => v >= 1 || 'Der Wert muss mindestens 1 Minute betragen.',
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

// Check if all rules pass
const isValid = computed(() => {
  return rules.every((rule) => rule(localValue.value) === true)
})

// Emit changes only if valid, with debounce
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(localValue, (val) => {
  if (isValid.value) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      emit('update:duration', Number(val))
    }, 300)
  }
})
</script>

<template>
  <v-text-field
    v-model="localValue"
    label="Zeitraum (Minuten)"
    type="number"
    :min="1"
    :max="60"
    :step="1"
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
