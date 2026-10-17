<template>
  <div>
    <!-- Botón de regreso (Mandel #1) -->
    <CommonBackButton to="/" label="Volver al Inicio" />

    <div class="d-flex flex-wrap align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-primary">Catálogo de Cursos</h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Selecciona un curso para ver sus niveles y retos formativos
        </p>
      </div>

      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Buscar curso..."
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 320px;"
      />
    </div>

    <!-- Indicador de Carga -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="50" />
      <p class="mt-4 text-body-2 text-medium-emphasis">Cargando catálogo formativo...</p>
    </div>

    <!-- Alerta si no está autenticado -->
    <v-alert
      v-else-if="!isAuthenticated"
      type="info"
      variant="tonal"
      class="mb-6"
    >
      <div class="d-flex align-center justify-space-between flex-wrap">
        <span>Inicia sesión para poder inscribirte en los cursos y guardar tu progreso.</span>
        <v-btn color="primary" to="/login" size="small" class="text-none mt-2 mt-sm-0">
          Iniciar Sesión
        </v-btn>
      </div>
    </v-alert>

    <!-- Lista de Cursos Vacía -->
    <v-card v-else-if="filteredCursos.length === 0" class="text-center pa-8 elevation-1 rounded-lg">
      <v-icon icon="mdi-book-search-outline" size="64" color="secondary" class="mb-3" />
      <h3 class="text-h6 font-weight-bold">No se encontraron cursos disponibles</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        {{ search ? 'Intenta con otro término de búsqueda.' : 'Aún no hay cursos publicados en la plataforma.' }}
      </p>
    </v-card>

    <!-- Grilla de Cursos (Ley de Miller: 3 por fila en desktop, no sobrecargar) -->
    <v-row v-else>
      <v-col
        v-for="curso in filteredCursos"
        :key="curso.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <v-card class="h-100 elevation-2 rounded-lg d-flex flex-column" hover>
          <v-img
            :src="curso.portada_url || 'https://picsum.photos/seed/' + curso.id + '/500/260'"
            height="180"
            cover
            class="bg-grey-lighten-3"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon icon="mdi-school" size="48" color="grey-lighten-1" />
              </div>
            </template>
          </v-img>

          <v-card-item>
            <div class="d-flex align-center justify-space-between mb-2">
              <v-chip
                size="small"
                :color="getDifficultyColor(curso.nivel_dificultad)"
                class="font-weight-medium"
              >
                {{ curso.nivel_dificultad || 'General' }}
              </v-chip>
              <span class="text-caption text-medium-emphasis">
                {{ curso.profesor?.nombre || 'Docente Focuz' }}
              </span>
            </div>

            <v-card-title class="text-h6 font-weight-bold text-truncate">
              {{ curso.titulo }}
            </v-card-title>
          </v-card-item>

          <v-card-text class="flex-grow-1 text-body-2 text-medium-emphasis">
            {{ curso.descripcion || 'Sin descripción detallada.' }}
          </v-card-text>

          <v-divider />

          <!-- Clic 2 de la Regla de los 3 Clics: Ver contenido y niveles -->
          <v-card-actions class="pa-4">
            <v-btn
              color="primary"
              variant="elevated"
              block
              :to="`/cursos/${curso.id}`"
              prepend-icon="mdi-arrow-right-circle"
              class="text-none font-weight-bold"
            >
              Explorar Curso y Niveles
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const search = ref('')
const loading = ref(true)
const cursos = ref<any[]>([])

const { isAuthenticated } = useAuth()
const { fetchCursosPublicados } = useCursos()

onMounted(async () => {
  try {
    if (isAuthenticated.value) {
      cursos.value = await fetchCursosPublicados()
    } else {
      // Mock data inicial amigable si aún no se ha iniciado sesión
      cursos.value = [
        {
          id: 'demo-1',
          titulo: 'Introducción a la Algoritmia y Lógica',
          descripcion: 'Aprende los fundamentos del pensamiento computacional y resolución sistemática de problemas.',
          nivel_dificultad: 'básico',
          profesor: { nombre: 'Prof. Alexander' },
        },
        {
          id: 'demo-2',
          titulo: 'Estructuras de Datos y Complejidad',
          descripcion: 'Domina arreglos, listas, árboles y grafos optimizando recursos de memoria y tiempo.',
          nivel_dificultad: 'intermedio',
          profesor: { nombre: 'Prof. Alexander' },
        },
      ]
    }
  } catch (error) {
    console.error('Error fetching cursos:', error)
  } finally {
    loading.value = false
  }
})

const filteredCursos = computed(() => {
  if (!search.value) return cursos.value
  const q = search.value.toLowerCase()
  return cursos.value.filter(
    (c) =>
      c.titulo?.toLowerCase().includes(q) ||
      c.descripcion?.toLowerCase().includes(q)
  )
})

const getDifficultyColor = (diff?: string) => {
  switch (diff?.toLowerCase()) {
    case 'básico':
    case 'facil':
      return 'success'
    case 'intermedio':
      return 'warning'
    case 'avanzado':
    case 'dificil':
      return 'error'
    default:
      return 'info'
  }
}
</script>

