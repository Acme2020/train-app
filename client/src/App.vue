<script setup lang="ts">
// App shell component - no specific page logic here
</script>

<template>
  <v-app class="app-root">
    <!-- App bar with logo -->
    <v-app-bar color="surface" flat>
      <v-spacer />
      <img src="/logo.svg" alt="Bahnhof Finder" style="height: 72px" />
      <v-spacer />
    </v-app-bar>

    <!-- Main content - router view -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
/* Global styles */
html,
body {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
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
.search-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 36px;
  margin-top: 100px;
  margin-bottom: 16px;
  padding: 0 16px;
  min-height: 90px;
}
</style>
