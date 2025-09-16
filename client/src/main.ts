import { createApp } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'darkTheme',
    themes: {
      darkTheme: {
        dark: true,
        colors: {
          background: '#0f172a',
          surface: '#1e293b',
          primary: '#6366f1',
          'primary-darken-1': '#4f46e5',
          secondary: '#22d3ee',
          'secondary-darken-1': '#0891b2',
          error: '#f87171',
          info: '#60a5fa',
          success: '#6ee7b7',
          warning: '#fcd34d',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
})

const app = createApp(App)
app.use(vuetify)

app.mount('#app')
