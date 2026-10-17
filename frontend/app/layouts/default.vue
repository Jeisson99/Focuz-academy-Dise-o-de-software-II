<template>
  <v-layout>
    <!-- Barra de Navegación Superior -->
    <v-app-bar color="primary" elevation="2" density="comfortable">
      <!-- MOB-01: Botón de menú siempre visible para abrir el Drawer (Pressman Cap. 13) -->
      <v-app-bar-nav-icon @click="drawer = !drawer" aria-label="Abrir menú de navegación" />

      <v-toolbar-title class="font-weight-bold d-flex align-center">
        <v-icon icon="mdi-school" class="mr-2" />
        Focuz Academy
      </v-toolbar-title>

      <v-spacer />

      <!-- MOB-03: Toggle Modo Oscuro/Claro — siempre visible (Pressman Cap. 13.4) -->
      <v-tooltip :text="isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'" location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            variant="text"
            color="white"
            class="mr-1"
            :aria-label="isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
            @click="toggleTheme"
          />
        </template>
      </v-tooltip>

      <!-- Regla de Mandel 1: Control al usuario y estado visible -->
      <template v-if="isAuthenticated">
        <v-chip color="white" variant="tonal" class="mr-2 d-none d-sm-flex" prepend-icon="mdi-account">
          {{ user?.nombre || user?.email }} ({{ user?.rol }})
        </v-chip>

        <v-btn
          variant="text"
          color="white"
          prepend-icon="mdi-logout"
          class="text-none"
          @click="logout"
        >
          <span class="d-none d-sm-inline">Cerrar Sesión</span>
        </v-btn>
      </template>
      <template v-else>
        <v-btn variant="text" color="white" to="/login" class="text-none mr-2">Iniciar Sesión</v-btn>
        <v-btn variant="elevated" color="accent" to="/register" class="text-none">Registrarse</v-btn>
      </template>
    </v-app-bar>

    <!--
      MOB-01: Drawer Responsivo Mobile-First (Pressman Cap. 13.2)
      - En móvil: drawer temporal (se cierra al tocar fuera)
      - En desktop: drawer permanente a la izquierda
    -->
    <v-navigation-drawer
      v-model="drawer"
      :temporary="mobile"
      :permanent="!mobile"
      :rail="rail && !mobile"
      expand-on-hover
      color="surface"
    >
      <!-- UX-06: Estado activo resaltado — active-color marca el ítem de la ruta actual -->
      <v-list density="compact" nav class="mt-2">
        <v-list-subheader class="text-uppercase text-caption font-weight-bold">
          Navegación Principal
        </v-list-subheader>

        <!-- PAT-04: Tooltips en íconos (Mystery Meat Navigation) — Pressman Cap. 14.5 -->
        <v-tooltip
          v-for="item in navItems"
          :key="item.to"
          :text="item.title"
          location="end"
          :disabled="!rail || mobile"
        >
          <template #activator="{ props: tooltipProps }">
            <v-list-item
              v-bind="tooltipProps"
              :to="item.to"
              :prepend-icon="item.icon"
              :title="item.title"
              :subtitle="item.subtitle"
              active-color="primary"
              rounded="lg"
              class="mb-1"
              link
            />
          </template>
        </v-tooltip>
      </v-list>

      <template #append>
        <div class="pa-4 text-caption text-medium-emphasis text-center">
          Focuz Academy v1.0 • MODESEC
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Contenedor Principal -->
    <v-main>
      <v-container fluid class="pa-4 pa-md-6" style="max-width: 1400px;">
        <!--
          PAT-02: Breadcrumbs dinámicos (Pressman Cap. 14.6 - Tidwell)
          El usuario siempre sabe dónde se encuentra en la jerarquía
        -->
        <v-breadcrumbs
          v-if="breadcrumbs.length > 1"
          :items="breadcrumbs"
          class="pa-0 mb-4 text-caption"
        >
          <template #divider>
            <v-icon icon="mdi-chevron-right" size="16" />
          </template>
          <template #title="{ item }">
            <span :class="item.disabled ? 'font-weight-bold text-primary' : 'text-medium-emphasis'">
              {{ item.title }}
            </span>
          </template>
        </v-breadcrumbs>

        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { useTheme, useDisplay } from 'vuetify'

const drawer = ref(true)
const rail = ref(false)
const route = useRoute()
const { user, isAuthenticated, logout, fetchProfile } = useAuth()

// MOB-01: Detección de dispositivo móvil para drawer responsivo
const { mobile } = useDisplay()

// Cerrar drawer automáticamente en móvil al navegar
watch(route, () => {
  if (mobile.value) drawer.value = false
})

// MOB-03: Toggle Modo Oscuro/Claro (Pressman Cap. 13.4)
const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'focuzDark')

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'focuzLight' : 'focuzDark'
  // Persistir preferencia en localStorage
  if (process.client) {
    localStorage.setItem('focuz-theme', theme.global.name.value)
  }
}

// Restaurar tema guardado al cargar
onMounted(async () => {
  if (process.client) {
    const savedTheme = localStorage.getItem('focuz-theme')
    if (savedTheme) theme.global.name.value = savedTheme
  }

  if (isAuthenticated.value && !user.value) {
    await fetchProfile()
  }
})

// Máximo 5-6 ítems de navegación para no sobrecargar la memoria de trabajo (Mandel #2)
const navItems = computed(() => {
  const items = [
    { title: 'Inicio', subtitle: 'Panel general', icon: 'mdi-view-dashboard', to: '/' },
    { title: 'Cursos', subtitle: 'Catálogo formativo', icon: 'mdi-book-open-page-variant', to: '/cursos' },
    { title: 'Mi Progreso', subtitle: 'Estadísticas y avance', icon: 'mdi-chart-line', to: '/progreso' },
    { title: 'Gamificación', subtitle: 'Logros y puntos', icon: 'mdi-trophy-variant', to: '/gamificacion' },
  ]

  if (user.value?.rol === 'profesor' || user.value?.rol === 'admin') {
    items.push({
      title: 'Gestión Docente',
      subtitle: 'Cursos y retos',
      icon: 'mdi-teach',
      to: '/profesor',
    })
  }

  return items
})

// PAT-02: Breadcrumbs dinámicos según la ruta (Pressman Cap. 14.6)
const routeLabels: Record<string, string> = {
  cursos: 'Cursos',
  progreso: 'Mi Progreso',
  gamificacion: 'Gamificación',
  profesor: 'Gestión Docente',
  login: 'Iniciar Sesión',
  register: 'Registro',
  retos: 'Retos',
  curso: 'Curso',
}

const breadcrumbs = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const items: any[] = [{ title: 'Inicio', to: '/', disabled: route.path === '/' }]

  let accumulatedPath = ''
  for (const segment of pathSegments) {
    accumulatedPath += `/${segment}`
    const label = routeLabels[segment] ?? (segment.length > 20 ? '...' : segment.charAt(0).toUpperCase() + segment.slice(1))
    items.push({
      title: label,
      to: accumulatedPath,
      disabled: accumulatedPath === route.path,
    })
  }

  return items
})
</script>
