<template>
  <div>
    <!--
      Control al usuario: Botón de Regresar (Mandel #1 / UX-03 Pressman Cap. 12)
      Siempre visible en la parte superior
    -->
    <div class="d-flex align-center justify-space-between mb-4">
      <CommonBackButton to="/cursos" label="Abandonar y Regresar" />

      <!-- Cronómetro / Temporizador visible (UX-01: Visibilidad del Estado) -->
      <v-chip color="primary" variant="outlined" prepend-icon="mdi-clock-outline">
        Tiempo transcurrido: {{ formattedTime }}
      </v-chip>
    </div>

    <!-- PAT-02: Tabs para alternar entre Guía Teórica y el Reto (Pressman Cap. 14.6 / Tidwell) -->
    <v-tabs v-model="activeTab" color="primary" class="mb-4" grow>
      <v-tab value="teoria" prepend-icon="mdi-book-open-variant">Guía Teórica</v-tab>
      <v-tab value="reto" prepend-icon="mdi-code-braces">Reto Práctico</v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <!-- PESTAÑA: Guía Teórica -->
      <v-window-item value="teoria">
        <v-card class="elevation-2 rounded-lg pa-6">
          <h2 class="text-h6 font-weight-bold text-primary mb-3 d-flex align-center">
            <v-icon icon="mdi-book-open-variant" class="mr-2" />
            Guía del Nivel
          </h2>
          <v-alert type="info" variant="tonal" density="compact" class="mb-4">
            <strong>Contexto:</strong> Lee la guía antes de intentar el reto para mejorar tu desempeño.
          </v-alert>
          <p class="text-body-1 text-medium-emphasis">
            {{ reto?.descripcion || 'La búsqueda binaria es un algoritmo eficiente para encontrar un elemento en una lista ordenada. Divide el espacio de búsqueda por la mitad en cada paso, logrando una complejidad de O(log n).' }}
          </p>
        </v-card>
      </v-window-item>

      <!-- PESTAÑA: Reto Práctico -->
      <v-window-item value="reto">
        <v-row>
          <!-- Panel de Enunciado (Mandel #2: instrucciones claras) -->
          <v-col cols="12" md="5">
            <v-card class="elevation-2 rounded-lg pa-6 h-100">
              <div class="d-flex align-center justify-space-between mb-3">
                <v-chip color="accent" size="small" class="font-weight-bold">Reto Formativo</v-chip>
                <v-chip color="success" size="small" prepend-icon="mdi-trophy">
                  +{{ reto?.puntos_recompensa || 50 }} pts
                </v-chip>
              </div>

              <h1 class="text-h5 font-weight-bold text-primary mb-3">
                {{ reto?.titulo || 'Reto: Complejidad Algorítmica' }}
              </h1>

              <p class="text-body-1 text-medium-emphasis mb-4">
                {{ reto?.descripcion || 'Analiza el siguiente escenario y selecciona la respuesta correcta.' }}
              </p>

              <v-divider class="my-4" />

              <h3 class="text-subtitle-2 font-weight-bold mb-2">Instrucciones:</h3>
              <ul class="text-caption text-medium-emphasis pl-4 mb-4">
                <li>Lee detenidamente el problema planteado.</li>
                <li>Selecciona la respuesta que consideres correcta.</li>
                <li>Haz clic en "Validar Respuesta" en la barra inferior para obtener retroalimentación.</li>
              </ul>

              <v-alert type="info" variant="tonal" density="compact">
                <strong>Ayuda:</strong> Recuerda verificar casos extremos como entradas vacías o valores negativos.
              </v-alert>
            </v-card>
          </v-col>

          <!-- Espacio de Trabajo -->
          <v-col cols="12" md="7">
            <v-card class="elevation-2 rounded-lg pa-6">
              <h2 class="text-h6 font-weight-bold mb-4 d-flex align-center">
                <v-icon icon="mdi-code-braces" color="primary" class="mr-2" />
                Espacio de Resolución
              </h2>

              <p class="text-body-1 font-weight-medium mb-3">
                ¿Cuál es la complejidad temporal de una búsqueda binaria en un arreglo ordenado de tamaño <code>n</code>?
              </p>

              <v-radio-group v-model="selectedAnswer" class="mb-4">
                <v-radio
                  v-for="(option, idx) in options"
                  :key="idx"
                  :label="option.text"
                  :value="option.value"
                  color="primary"
                />
              </v-radio-group>

              <!-- UX-01: Feedback inmediato -->
              <v-alert
                v-if="feedback"
                :type="feedback.type"
                variant="tonal"
                class="mb-4"
              >
                <div class="font-weight-bold mb-1">{{ feedback.title }}</div>
                <div>{{ feedback.message }}</div>
              </v-alert>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>

    <!--
      MOB-02: Bottom Bar fija — Thumb Zone (Pressman Cap. 13.2.1)
      Controles de navegación principales en el tercio inferior para acceso con pulgar
      Todos los botones ≥ 48px de alto
    -->
    <v-bottom-navigation
      v-if="activeTab === 'reto'"
      grow
      color="primary"
      class="elevation-8"
      style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;"
    >
      <!-- UX-03: Botón de cancelar/salir con control claro -->
      <v-btn
        color="error"
        variant="text"
        min-height="48"
        to="/cursos"
      >
        <v-icon icon="mdi-exit-to-app" />
        <span class="text-caption">Salir</span>
      </v-btn>

      <v-btn
        variant="text"
        min-height="48"
        :disabled="validating"
        @click="resetAnswer"
      >
        <v-icon icon="mdi-refresh" />
        <span class="text-caption">Reiniciar</span>
      </v-btn>

      <v-btn
        color="primary"
        min-height="48"
        :loading="validating"
        :disabled="!selectedAnswer"
        @click="submitSolution"
      >
        <v-icon icon="mdi-check-all" />
        <span class="text-caption font-weight-bold">Validar</span>
      </v-btn>
    </v-bottom-navigation>

    <!-- Espaciador para que el bottom-nav no tape el contenido -->
    <div v-if="activeTab === 'reto'" style="height: 56px;" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const retoId = route.params.id as string
const { show: showSnackbar } = useSnackbar()

const reto = ref<any>(null)
const selectedAnswer = ref('')
const validating = ref(false)
const timerSeconds = ref(0)
const activeTab = ref('teoria') // PAT-02: inicio en pestaña de Guía
let timerInterval: any = null

const feedback = ref<{ type: 'success' | 'error'; title: string; message: string } | null>(null)

const options = [
  { text: 'O(1) - Tiempo constante', value: 'o1' },
  { text: 'O(log n) - Tiempo logarítmico', value: 'ologn' },
  { text: 'O(n) - Tiempo lineal', value: 'on' },
  { text: 'O(n²) - Tiempo cuadrático', value: 'on2' },
]

const formattedTime = computed(() => {
  const min = Math.floor(timerSeconds.value / 60)
  const sec = timerSeconds.value % 60
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
})

onMounted(() => {
  timerInterval = setInterval(() => {
    timerSeconds.value++
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

const submitSolution = () => {
  if (!selectedAnswer.value) {
    feedback.value = {
      type: 'error',
      title: 'Selecciona una respuesta',
      message: 'Debes elegir una de las opciones para enviar tu evaluación.',
    }
    return
  }

  validating.value = true
  setTimeout(() => {
    validating.value = false
    if (selectedAnswer.value === 'ologn') {
      feedback.value = {
        type: 'success',
        title: '¡Excelente! Respuesta Correcta 🎉',
        message: 'La búsqueda binaria divide el espacio de búsqueda a la mitad en cada paso, resultando en O(log n). Has ganado 50 puntos.',
      }
      showSnackbar('¡Reto completado! +50 puntos de gamificación', 'success')
    } else {
      feedback.value = {
        type: 'error',
        title: 'Respuesta Incorrecta',
        message: 'Revisa la propiedad de división y conquista de la búsqueda binaria e inténtalo de nuevo.',
      }
      showSnackbar('Respuesta incorrecta. ¡Inténtalo de nuevo!', 'error')
    }
  }, 600)
}

const resetAnswer = () => {
  selectedAnswer.value = ''
  feedback.value = null
}
</script>
