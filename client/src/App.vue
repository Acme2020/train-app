<template>
  <v-app>
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
