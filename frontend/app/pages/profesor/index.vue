<template>
  <div>
    <CommonBackButton to="/" label="Volver al Inicio" />

    <div class="d-flex flex-wrap align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-primary">Panel de Gestión Docente</h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Crea y administra tus cursos formativos, niveles y retos interactivos
        </p>
      </div>

      <v-btn
        color="primary"
        size="large"
        prepend-icon="mdi-plus-circle"
        to="/profesor/crear-curso"
        class="text-none font-weight-bold mt-2 mt-sm-0"
      >
        Crear Nuevo Curso
      </v-btn>
    </div>

    <!-- Alerta de control de acceso si no es docente/admin -->
    <v-alert
      v-if="user && user.rol === 'alumno'"
      type="warning"
      variant="tonal"
      class="mb-6"
    >
      Esta sección es exclusiva para profesores y administradores. Tu rol actual es <strong>Estudiante</strong>.
    </v-alert>

    <!-- Indicador de carga -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="mt-3 text-caption text-medium-emphasis">Cargando tus cursos...</p>
    </div>

    <!-- Lista de cursos vacía -->
    <v-card v-else-if="cursos.length === 0" class="text-center pa-8 elevation-1 rounded-lg">
      <v-icon icon="mdi-folder-plus-outline" size="64" color="secondary" class="mb-3" />
      <h3 class="text-h6 font-weight-bold">Aún no has creado cursos</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        Comienza creando tu primer curso con niveles secuenciales y retos prácticos.
      </p>
      <v-btn color="primary" to="/profesor/crear-curso" class="text-none">
        Crear Curso Ahora
      </v-btn>
    </v-card>

    <!-- Grilla de Cursos del Docente -->
    <v-row v-else>
      <v-col
        v-for="curso in cursos"
        :key="curso.id"
        cols="12"
        md="6"
      >
        <v-card class="elevation-2 rounded-lg pa-4 h-100 d-flex flex-column">
          <div class="d-flex align-center justify-space-between mb-2">
            <v-chip
              size="small"
              :color="curso.estado === 'publicado' ? 'success' : 'warning'"
              variant="flat"
              class="font-weight-bold text-uppercase"
            >
              {{ curso.estado }}
            </v-chip>
            <span class="text-caption text-medium-emphasis">
              ID: {{ curso.id.substring(0, 8) }}...
            </span>
          </div>

          <v-card-title class="text-h6 font-weight-bold px-0 pt-1 pb-2">
            {{ curso.titulo }}
          </v-card-title>

          <v-card-text class="px-0 flex-grow-1 text-body-2 text-medium-emphasis">
            {{ curso.descripcion }}
          </v-card-text>

          <v-divider class="my-3" />

          <div class="d-flex align-center justify-space-between flex-wrap gap-2">
            <v-btn
              color="primary"
              variant="tonal"
              size="small"
              prepend-icon="mdi-format-list-numbered"
              :to="`/profesor/curso/${curso.id}`"
              class="text-none font-weight-bold"
            >
              Gestionar Niveles y Retos
            </v-btn>

            <v-btn
              variant="text"
              color="secondary"
              size="small"
              :to="`/cursos/${curso.id}`"
              prepend-icon="mdi-eye-outline"
              class="text-none"
            >
              Vista Previa
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const { user, token } = useAuth()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

const loading = ref(true)
const cursos = ref<any[]>([])

onMounted(async () => {
  try {
    const response = await $fetch<any[]>(`${apiBase}/cursos/publicados`, {
      headers: {
        Authorization: `Bearer ${token.value || ''}`,
      },
    })
    cursos.value = response || []
  } catch (error) {
    console.error('Error al cargar cursos para docente:', error)
  } finally {
    loading.value = false
  }
})
</script>

