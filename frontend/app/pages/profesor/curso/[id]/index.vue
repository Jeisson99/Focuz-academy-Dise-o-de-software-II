<template>
  <div>
    <CommonBackButton to="/profesor" label="Volver a Gestión Docente" />

    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="mt-3 text-caption text-medium-emphasis">Cargando detalles del curso...</p>
    </div>

    <div v-else>
      <!-- Cabecera del Curso -->
      <v-card class="elevation-2 rounded-lg pa-6 mb-6">
        <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-2">
          <v-chip color="primary" size="small" class="font-weight-bold">
            Gestor de Contenidos
          </v-chip>
          <v-chip
            :color="curso?.estado === 'publicado' ? 'success' : 'warning'"
            size="small"
            class="text-uppercase font-weight-bold"
          >
            {{ curso?.estado }}
          </v-chip>
        </div>

        <h1 class="text-h4 font-weight-bold text-primary mb-2">
          {{ curso?.titulo }}
        </h1>
        <p class="text-body-1 text-medium-emphasis mb-4">
          {{ curso?.descripcion }}
        </p>

        <div class="d-flex align-center flex-wrap gap-2">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            class="text-none font-weight-bold mr-2"
            @click="abrirDialogoNivel"
          >
            Agregar Nivel Formativo
          </v-btn>

          <v-btn
            variant="outlined"
            color="secondary"
            :to="`/cursos/${cursoId}`"
            prepend-icon="mdi-eye"
            class="text-none"
          >
            Ver como Estudiante
          </v-btn>
        </div>
      </v-card>

      <!-- Alertas de Feedback -->
      <v-alert
        v-if="feedback"
        :type="feedback.type"
        variant="tonal"
        class="mb-6"
        closable
        @click:close="feedback = null"
      >
        {{ feedback.message }}
      </v-alert>

      <!-- Niveles y Retos Existentes -->
      <h2 class="text-h5 font-weight-bold mb-4 d-flex align-center">
        <v-icon icon="mdi-stairs" color="primary" class="mr-2" />
        Estructura de Niveles y Retos
      </h2>

      <div v-if="niveles.length === 0" class="text-center pa-8 bg-white rounded-lg elevation-1 mb-6">
        <v-icon icon="mdi-layers-plus" size="56" color="secondary" class="mb-2" />
        <h3 class="text-h6 font-weight-bold">Aún no hay niveles en este curso</h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Agrega el primer nivel para comenzar a incorporar retos pedagógicos.
        </p>
        <v-btn color="primary" @click="abrirDialogoNivel" class="text-none">
          Agregar Nivel 1
        </v-btn>
      </div>

      <v-expansion-panels v-else variant="accordion" class="mb-6">
        <v-expansion-panel
          v-for="nivel in niveles"
          :key="nivel.id"
          class="rounded-lg mb-3 elevation-1"
        >
          <v-expansion-panel-title>
            <div class="d-flex align-center justify-space-between w-100 pr-4">
              <div class="d-flex align-center">
                <v-avatar color="primary" size="32" class="mr-3 text-white font-weight-bold">
                  {{ nivel.orden }}
                </v-avatar>
                <div>
                  <span class="font-weight-bold text-subtitle-1">{{ nivel.titulo }}</span>
                  <div class="text-caption text-medium-emphasis">{{ nivel.descripcion }}</div>
                </div>
              </div>
              <v-btn
                color="primary"
                variant="tonal"
                size="small"
                prepend-icon="mdi-plus"
                class="text-none"
                @click.stop="abrirDialogoReto(nivel.id)"
              >
                Agregar Reto
              </v-btn>
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-divider class="mb-4" />
            <p class="text-body-2 text-medium-emphasis mb-4">{{ nivel.descripcion }}</p>

            <div class="text-subtitle-2 font-weight-bold mb-2">Retos en este Nivel:</div>
            <div class="d-flex flex-column gap-2">
              <div
                v-for="reto in nivel.retos"
                :key="reto.id"
                class="pa-3 bg-grey-lighten-4 rounded-lg d-flex align-center justify-space-between mb-2"
              >
                <div>
                  <div class="font-weight-bold text-body-2">{{ reto.titulo }}</div>
                  <div class="text-caption text-medium-emphasis">{{ reto.descripcion }}</div>
                </div>
                <div class="d-flex align-center gap-2">
                  <v-chip size="small" color="info" variant="outlined">{{ reto.tipo }}</v-chip>
                  <v-chip size="small" color="success">+{{ reto.puntaje_base }} pts</v-chip>
                </div>
              </div>
              <div v-if="!nivel.retos || nivel.retos.length === 0" class="text-caption text-medium-emphasis py-2">
                No hay retos registrados para este nivel.
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <!-- Diálogo Modal: Crear Nivel — PAT-03 Validación reactiva (Pressman Cap. 14.6) -->
    <v-dialog v-model="dialogNivel" max-width="550">
      <v-card class="pa-6 rounded-lg">
        <div class="d-flex align-center justify-space-between mb-4">
          <v-card-title class="text-h6 font-weight-bold px-0 pt-0">
            Nuevo Nivel Formativo
          </v-card-title>
          <!-- UX-03: Botón de cierre visible en el modal -->
          <v-btn icon="mdi-close" variant="text" size="small" @click="dialogNivel = false" aria-label="Cerrar" />
        </div>
        <v-form ref="formNivelRef" v-model="formNivelValid">
          <v-card-text class="px-0 py-2">
            <v-text-field
              v-model.number="formNivel.orden"
              label="Orden Secuencial *"
              type="number"
              inputmode="numeric"
              variant="outlined"
              density="compact"
              class="mb-2"
              :rules="[(v: any) => !!v || 'El orden es obligatorio', (v: any) => v > 0 || 'Debe ser mayor a 0']"
              validate-on="input"
            />
            <v-text-field
              v-model="formNivel.titulo"
              label="Título del Nivel *"
              placeholder="Ej: Nivel 2: Estructuras Condicionales"
              variant="outlined"
              density="compact"
              class="mb-2"
              :rules="[(v: string) => !!v || 'El título es obligatorio', (v: string) => v?.length >= 4 || 'Mínimo 4 caracteres']"
              validate-on="input"
              counter="80"
            />
            <v-textarea
              v-model="formNivel.descripcion"
              label="Descripción / Contenido del Nivel *"
              variant="outlined"
              rows="3"
              class="mb-2"
              :rules="[(v: string) => !!v || 'La descripción es obligatoria']"
              validate-on="input"
            />
          </v-card-text>
          <v-card-actions class="px-0 pb-0">
            <v-spacer />
            <v-btn variant="text" color="secondary" @click="dialogNivel = false" class="text-none" min-height="44">
              Cancelar
            </v-btn>
            <v-btn
              color="primary"
              variant="elevated"
              :loading="guardandoNivel"
              :disabled="!formNivelValid"
              class="text-none font-weight-bold"
              min-height="44"
              @click="guardarNivel"
            >
              Guardar Nivel
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Diálogo Modal: Crear Reto — PAT-03 Validación reactiva (Pressman Cap. 14.6) -->
    <v-dialog v-model="dialogReto" max-width="550">
      <v-card class="pa-6 rounded-lg">
        <div class="d-flex align-center justify-space-between mb-4">
          <v-card-title class="text-h6 font-weight-bold px-0 pt-0">
            Nuevo Reto Formativo
          </v-card-title>
          <!-- UX-03: Botón de cierre visible -->
          <v-btn icon="mdi-close" variant="text" size="small" @click="dialogReto = false" aria-label="Cerrar" />
        </div>
        <v-form ref="formRetoRef" v-model="formRetoValid">
          <v-card-text class="px-0 py-2">
            <v-text-field
              v-model="formReto.titulo"
              label="Título del Reto *"
              placeholder="Ej: Reto: Evaluación de Expresiones Booleanas"
              variant="outlined"
              density="compact"
              class="mb-2"
              :rules="[(v: string) => !!v || 'El título es obligatorio', (v: string) => v?.length >= 4 || 'Mínimo 4 caracteres']"
              validate-on="input"
              counter="100"
            />
            <v-textarea
              v-model="formReto.descripcion"
              label="Enunciado e Instrucciones *"
              placeholder="Describe el problema práctico a resolver..."
              variant="outlined"
              rows="3"
              class="mb-2"
              :rules="[(v: string) => !!v || 'El enunciado es obligatorio', (v: string) => v?.length >= 10 || 'Mínimo 10 caracteres']"
              validate-on="input"
            />
            <v-select
              v-model="formReto.tipo"
              label="Tipo de Reto *"
              :items="[
                { title: 'Cuestionario / Quiz Conceptual', value: 'quiz' },
                { title: 'Práctica de Código', value: 'codigo' },
                { title: 'Proyecto Guiado', value: 'proyecto' }
              ]"
              variant="outlined"
              density="compact"
              class="mb-2"
              :rules="[(v: string) => !!v || 'Selecciona el tipo de reto']"
            />
            <v-text-field
              v-model.number="formReto.puntaje_base"
              label="Puntos de Recompensa *"
              type="number"
              inputmode="numeric"
              variant="outlined"
              density="compact"
              class="mb-2"
              :rules="[(v: any) => !!v || 'Los puntos son obligatorios', (v: any) => v >= 1 || 'Mínimo 1 punto', (v: any) => v <= 1000 || 'Máximo 1000 puntos']"
              validate-on="input"
              hint="Entre 1 y 1000 puntos"
            />
          </v-card-text>
          <v-card-actions class="px-0 pb-0">
            <v-spacer />
            <v-btn variant="text" color="secondary" @click="dialogReto = false" class="text-none" min-height="44">
              Cancelar
            </v-btn>
            <v-btn
              color="primary"
              variant="elevated"
              :loading="guardandoReto"
              :disabled="!formRetoValid"
              class="text-none font-weight-bold"
              min-height="44"
              @click="guardarReto"
            >
              Guardar Reto
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const cursoId = route.params.id as string

const { token } = useAuth()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string
const { show: showSnackbar } = useSnackbar()

const loading = ref(true)
const curso = ref<any>(null)
const niveles = ref<any[]>([])
const feedback = ref<{ type: 'success' | 'error'; message: string } | null>(null)

// Estados de modales — Nivel
const dialogNivel = ref(false)
const guardandoNivel = ref(false)
const formNivelRef = ref<any>(null)
const formNivelValid = ref(false)
const formNivel = reactive({
  orden: 1,
  titulo: '',
  descripcion: '',
})

// Estados de modales — Reto
const dialogReto = ref(false)
const guardandoReto = ref(false)
const formRetoRef = ref<any>(null)
const formRetoValid = ref(false)
const selectedNivelId = ref('')
const formReto = reactive({
  titulo: '',
  descripcion: '',
  tipo: 'quiz',
  puntaje_base: 50,
})

const cargarDatos = async () => {
  try {
    const cursoRes = await $fetch<any>(`${apiBase}/cursos/${cursoId}`, {
      headers: { Authorization: `Bearer ${token.value || ''}` },
    })
    curso.value = cursoRes

    const nivelesRes = await $fetch<any[]>(`${apiBase}/niveles/curso/${cursoId}`, {
      headers: { Authorization: `Bearer ${token.value || ''}` },
    })
    niveles.value = nivelesRes || []
  } catch (error) {
    console.error('Error cargando curso y niveles:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarDatos()
})

const abrirDialogoNivel = () => {
  formNivel.orden = (niveles.value.length || 0) + 1
  formNivel.titulo = ''
  formNivel.descripcion = ''
  dialogNivel.value = true
}

const guardarNivel = async () => {
  const { valid } = await formNivelRef.value?.validate()
  if (!valid) return
  guardandoNivel.value = true
  try {
    await $fetch(`${apiBase}/niveles`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value || ''}` },
      body: {
        curso_id: cursoId,
        orden: formNivel.orden,
        titulo: formNivel.titulo,
        descripcion: formNivel.descripcion,
      },
    })
    dialogNivel.value = false
    showSnackbar('Nivel formativo agregado exitosamente.', 'success')
    await cargarDatos()
  } catch (error: any) {
    showSnackbar(error?.data?.message || 'Error al guardar el nivel', 'error')
  } finally {
    guardandoNivel.value = false
  }
}

const abrirDialogoReto = (nivelId: string) => {
  selectedNivelId.value = nivelId
  formReto.titulo = ''
  formReto.descripcion = ''
  formReto.tipo = 'quiz'
  formReto.puntaje_base = 50
  dialogReto.value = true
}

const guardarReto = async () => {
  const { valid } = await formRetoRef.value?.validate()
  if (!valid) return
  guardandoReto.value = true
  try {
    await $fetch(`${apiBase}/retos`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value || ''}` },
      body: {
        nivel_id: selectedNivelId.value,
        titulo: formReto.titulo,
        descripcion: formReto.descripcion,
        tipo: formReto.tipo,
        puntaje_base: formReto.puntaje_base,
      },
    })
    dialogReto.value = false
    showSnackbar('Reto formativo creado exitosamente.', 'success')
    await cargarDatos()
  } catch (error: any) {
    showSnackbar(error?.data?.message || 'Error al guardar el reto', 'error')
  } finally {
    guardandoReto.value = false
  }
}
</script>

