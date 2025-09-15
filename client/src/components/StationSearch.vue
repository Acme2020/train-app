<script setup lang="ts">
import { ref } from 'vue'
import { fetchStationSuggestions } from '../api'

interface StationSuggestion {
  id: string
  name: string
  latitude?: number
  longitude?: number
}

const search = ref('')
const suggestions = ref<StationSuggestion[]>([])

const onSearch = async () => {
  console.log('Search triggered with:', search.value)
  if (search.value.length > 1) {
    const { data } = await fetchStationSuggestions(search.value)
    suggestions.value = data
    console.log('Suggestions:', data)
  } else {
    suggestions.value = []
    console.log('Suggestions cleared')
  }
}
</script>

<template>
  <v-container>
    <v-row class="w-100 align-center pa-0">
      <v-col cols="9" class="d-flex align-center pr-2">
        <v-text-field
          v-model="search"
          label="Bahnhof suchen..."
          @keyup.enter="onSearch"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>

      <v-col cols="3">
        <v-btn color="primary" class="w-100" @click="onSearch"> Suchen </v-btn>
      </v-col>
    </v-row>

    <v-card v-if="suggestions.length" class="mt-4 w-100" variant="outlined">
      <v-list>
        <v-list-item v-for="s in suggestions" :key="s.id">
          <v-list-item-title>{{ s.name }}</v-list-item-title>
          <v-list-item-subtitle v-if="s.latitude && s.longitude">
            {{ s.latitude }}, {{ s.longitude }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>
