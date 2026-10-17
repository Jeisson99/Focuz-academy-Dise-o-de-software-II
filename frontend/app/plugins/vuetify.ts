import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// MOB-03: Soporte de modo oscuro/claro (Pressman Cap. 13.4 - Context-Aware Apps)
export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false,
    components,
    directives,
    theme: {
      defaultTheme: 'focuzLight',
      themes: {
        // Tema Claro — Focuz Academy
        focuzLight: {
          dark: false,
          colors: {
            primary: '#1E88E5',
            secondary: '#546E7A',
            accent: '#FFB300',
            error: '#E53935',
            info: '#0288D1',
            success: '#43A047',
            warning: '#FB8C00',
            background: '#F4F6F9',
            surface: '#FFFFFF',
          },
        },
        // Tema Oscuro — baja luminosidad (prefers-color-scheme: dark)
        focuzDark: {
          dark: true,
          colors: {
            primary: '#42A5F5',
            secondary: '#90A4AE',
            accent: '#FFD54F',
            error: '#EF5350',
            info: '#29B6F6',
            success: '#66BB6A',
            warning: '#FFA726',
            background: '#121212',
            surface: '#1E1E1E',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
