<template>
  <div>
    <!-- Control al usuario: Regresar al catálogo (Mandel #1) -->
    <CommonBackButton to="/cursos" label="Volver a Cursos" />

    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="50" />
      <p class="mt-4 text-body-2 text-medium-emphasis">Cargando información del curso...</p>
    </div>

    <div v-else>
      <!-- Cabecera del Curso -->
      <v-card class="mb-6 elevation-2 rounded-lg pa-6">
        <v-row align="center">
          <v-col cols="12" md="8">
            <div class="d-flex align-center gap-2 mb-2">
              <v-chip color="primary" size="small" class="font-weight-bold">
                {{ curso?.nivel_dificultad || 'Curso' }}
              </v-chip>
              <v-chip color="secondary" size="small" variant="outlined" class="ml-2">
                {{ niveles.length }} Niveles Formativos
              </v-chip>
            </div>

            <h1 class="text-h4 font-weight-bold text-primary mb-2">
              {{ curso?.titulo || 'Detalle del Curso' }}
            </h1>
            <p class="text-body-1 text-medium-emphasis mb-4">
              {{ curso?.descripcion || 'En este curso aprenderás conceptos fundamentales mediante retos estructurados.' }}
            </p>

            <div class="d-flex align-center flex-wrap gap-2">
              <v-btn
                v-if="!estaInscrito"
                color="primary"
                size="large"
                prepend-icon="mdi-account-plus"
                :loading="inscribiendo"
                class="text-none font-weight-bold mr-3"
                @click="handleInscribir"
              >
                Inscribirme en este Curso
              </v-btn>
              <v-chip
                v-else
                color="success"
                size="large"
                variant="flat"
                prepend-icon="mdi-check-circle"
                class="font-weight-bold mr-3"
              >
                Inscrito Actualmente
              </v-chip>
            </div>
          </v-col>

          <v-col cols="12" md="4" class="text-center d-none d-md-block">
            <v-icon icon="mdi-certificate-outline" size="120" color="primary" class="opacity-80" />
          </v-col>
        </v-row>
      </v-card>

      <!-- Feedback de éxito/error al inscribirse -->
      <v-alert
        v-if="feedbackMsg"
        :type="feedbackType"
        variant="tonal"
        class="mb-6"
        closable
        @click:close="feedbackMsg = ''"
      >
        {{ feedbackMsg }}
      </v-alert>

      <!-- Niveles y Retos (Regla de los 3 Clics: Acceso directo al reto formativo) -->
      <h2 class="text-h5 font-weight-bold mb-4 d-flex align-center">
        <v-icon icon="mdi-stairs" color="primary" class="mr-2" />
        Niveles y Retos del Curso
      </h2>

      <div v-if="niveles.length === 0" class="text-center py-8">
        <v-card class="elevation-1 pa-6 rounded-lg">
          <v-icon icon="mdi-timer-sand-empty" size="48" color="secondary" class="mb-2" />
          <p class="text-body-1 text-medium-emphasis">
            Este curso aún no tiene niveles publicados.
          </p>
        </v-card>
      </div>

      <v-expansion-panels v-else variant="accordion" class="mb-6">
        <v-expansion-panel
          v-for="(nivel, index) in niveles"
          :key="nivel.id"
          class="rounded-lg mb-3 elevation-1"
        >
          <v-expansion-panel-title>
            <div class="d-flex align-center w-100 justify-space-between pr-4">
              <div class="d-flex align-center">
                <v-avatar color="primary" size="32" class="mr-3 font-weight-bold text-white">
                  {{ nivel.numero || index + 1 }}
                </v-avatar>
                <div>
                  <span class="font-weight-bold text-subtitle-1">{{ nivel.titulo }}</span>
                  <div class="text-caption text-medium-emphasis">
                    {{ nivel.descripcion || 'Objetivos de aprendizaje del nivel' }}
                  </div>
                </div>
              </div>
              <v-chip size="x-small" color="secondary" variant="outlined">
                {{ nivel.retos?.length || 1 }} Reto(s)
              </v-chip>
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-divider class="mb-4" />
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{ nivel.descripcion }}
            </p>

            <!-- Clic 3: Iniciar reto formativo directamente -->
            <div class="d-flex align-center justify-space-between flex-wrap gap-2 pa-3 bg-grey-lighten-4 rounded-lg">
              <div>
                <div class="font-weight-bold text-body-2">
                  Reto Práctico del Nivel
                </div>
                <div class="text-caption text-medium-emphasis">
                  Demuestra tus competencias y suma puntos de gamificación.
                </div>
              </div>

              <!-- Clic 3 de la Regla de los 3 Clics -->
              <v-btn
                color="primary"
                size="small"
                :to="`/retos/${nivel.retos?.[0]?.id || nivel.id}`"
                prepend-icon="mdi-play-circle"
                class="text-none font-weight-bold"
              >
                Iniciar Reto (Clic 3)
              </v-btn>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const cursoId = route.params.id as string

const loading = ref(true)
const inscribiendo = ref(false)
const estaInscrito = ref(false)
const curso = ref<any>(null)
const niveles = ref<any[]>([])
const feedbackMsg = ref('')
const feedbackType = ref<'success' | 'error'>('success')

const { isAuthenticated, user } = useAuth()
const { fetchCursoById, fetchNivelesByCurso, inscribirCurso } = useCursos()

onMounted(async () => {
  try {
    if (cursoId.startsWith('demo-')) {
      curso.value = {
        id: cursoId,
        titulo: cursoId === 'demo-1' ? 'Introducción a la Algoritmia' : 'Estructuras de Datos',
        descripcion: 'Curso formativo diseñado bajo el marco pedagógico MODESEC y las reglas de interacción de Theo Mandel.',
        nivel_dificultad: 'básico',
      }
      niveles.value = [
        {
          id: 'nivel-demo-1',
          numero: 1,
          titulo: 'Nivel 1: Conceptos Básicos y Sintaxis',
          descripcion: 'Aprende a estructurar instrucciones y diagramas de flujo elementales.',
        },
        {
          id: 'nivel-demo-2',
          numero: 2,
          titulo: 'Nivel 2: Condicionales y Bifurcaciones',
          descripcion: 'Domina estructuras if-else y evaluación de expresiones lógicas complejas.',
        },
      ]
    } else {
      curso.value = await fetchCursoById(cursoId)
      niveles.value = await fetchNivelesByCurso(cursoId)
    }
  } catch (error: any) {
    console.error('Error fetching curso detail:', error)
  } finally {
    loading.value = false
  }
})

const handleInscribir = async () => {
  if (!isAuthenticated.value) {
    navigateTo('/login')
    return
  }

  inscribiendo.value = true
  feedbackMsg.value = ''

  try {
    if (!cursoId.startsWith('demo-')) {
      await inscribirCurso(cursoId)
    }
    estaInscrito.value = true
    feedbackType.value = 'success'
    feedbackMsg.value = '¡Te has inscrito correctamente en este curso! Ya puedes iniciar los retos formativos.'
  } catch (err: any) {
    feedbackType.value = 'error'
    feedbackMsg.value = err?.data?.message || 'Hubo un problema al realizar la inscripción.'
  } finally {
    inscribiendo.value = false
  }
}
</script>

