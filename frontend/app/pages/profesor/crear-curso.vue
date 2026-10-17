<template>
  <div style="max-width: 800px; margin: 0 auto;">
    <CommonBackButton to="/profesor" label="Cancelar y volver a Gestión Docente" />

    <v-card class="elevation-2 rounded-lg pa-6">
      <div class="mb-6">
        <h1 class="text-h5 font-weight-bold text-primary">Crear Nuevo Curso Formativo</h1>
        <p class="text-caption text-medium-emphasis">
          Configura los detalles del curso. Posteriormente podrás agregar niveles y retos.
        </p>
      </div>

      <!--
        PAT-03: Validación reactiva campo a campo (Pressman Cap. 14.6 / Tidwell)
        v-form con ref para validación programática
      -->
      <v-form ref="formRef" v-model="formValid" @submit.prevent="handleSubmit">
        <!--
          PAT-03: Agrupación semántica — Datos principales del curso
        -->
        <v-card variant="outlined" class="pa-4 mb-4 rounded-lg">
          <div class="text-subtitle-2 font-weight-bold text-primary mb-3">
            <v-icon icon="mdi-information-outline" size="18" class="mr-1" />
            Información Principal
          </div>

          <!-- PAT-03: Validación reactiva inline — error descriptivo bajo el campo -->
          <v-text-field
            v-model="form.titulo"
            label="Título del Curso *"
            placeholder="Ej: Programación Orientada a Objetos en TypeScript"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            :rules="rules.titulo"
            validate-on="input"
            counter="120"
            maxlength="120"
          />

          <v-textarea
            v-model="form.descripcion"
            label="Descripción Pedagógica *"
            placeholder="Describe los objetivos formativos, competencias a desarrollar y marco teórico..."
            variant="outlined"
            rows="4"
            class="mb-3"
            :rules="rules.descripcion"
            validate-on="input"
            counter="500"
            maxlength="500"
          />
        </v-card>

        <!-- Agrupación semántica — Configuración adicional -->
        <v-card variant="outlined" class="pa-4 mb-4 rounded-lg">
          <div class="text-subtitle-2 font-weight-bold text-primary mb-3">
            <v-icon icon="mdi-cog-outline" size="18" class="mr-1" />
            Configuración del Curso
          </div>

          <v-text-field
            v-model="form.url_video_intro"
            label="URL Video de Introducción (Opcional)"
            placeholder="https://www.youtube.com/watch?v=..."
            prepend-inner-icon="mdi-youtube"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            :rules="rules.urlVideo"
            validate-on="input"
            hint="Ingresa un enlace válido de YouTube o Vimeo"
            persistent-hint
          />

          <v-select
            v-model="form.estado"
            label="Estado Inicial del Curso"
            :items="[
              { title: 'Publicado — Visible inmediatamente para estudiantes', value: 'publicado' },
              { title: 'Borrador — Solo visible para el docente', value: 'borrador' }
            ]"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-eye-outline"
          />
        </v-card>

        <!-- Acciones -->
        <div class="d-flex align-center gap-3 flex-wrap">
          <v-btn
            type="submit"
            color="primary"
            size="large"
            :loading="loading"
            :disabled="!formValid"
            class="text-none font-weight-bold mr-3"
            min-height="48"
          >
            <v-icon icon="mdi-content-save" class="mr-1" />
            Guardar y Crear Curso
          </v-btn>

          <!-- UX-03: Control y libertad — Cancelar siempre accesible (Mandel #1) -->
          <v-btn
            variant="outlined"
            color="secondary"
            size="large"
            to="/profesor"
            class="text-none"
            min-height="48"
          >
            Cancelar
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const { token } = useAuth()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string
const { show: showSnackbar } = useSnackbar()

const loading = ref(false)
const formValid = ref(false)
const formRef = ref<any>(null)

const form = reactive({
  titulo: '',
  descripcion: '',
  url_video_intro: '',
  estado: 'publicado',
})

// PAT-03: Reglas de validación reactiva con mensajes descriptivos bajo cada campo
const rules = {
  titulo: [
    (v: string) => !!v || 'El título del curso es obligatorio',
    (v: string) => (v && v.length >= 5) || 'El título debe tener al menos 5 caracteres',
    (v: string) => (v && v.length <= 120) || 'El título no debe superar 120 caracteres',
  ],
  descripcion: [
    (v: string) => !!v || 'La descripción pedagógica es obligatoria',
    (v: string) => (v && v.length >= 20) || 'La descripción debe tener al menos 20 caracteres',
    (v: string) => (v && v.length <= 500) || 'La descripción no debe superar 500 caracteres',
  ],
  urlVideo: [
    (v: string) => !v || /^https?:\/\/.+/.test(v) || 'Debe ser una URL válida que comience con http:// o https://',
  ],
}

const handleSubmit = async () => {
  const { valid } = await formRef.value?.validate()
  if (!valid) return

  loading.value = true

  try {
    const response: any = await $fetch(`${apiBase}/cursos`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value || ''}` },
      body: form,
    })

    showSnackbar('¡Curso creado exitosamente! Ahora puedes agregar niveles.', 'success')
    navigateTo(`/profesor/curso/${response.id}`)
  } catch (error: any) {
    showSnackbar(error?.data?.message || 'Error al crear el curso. Intenta de nuevo.', 'error')
  } finally {
    loading.value = false
  }
}
</script>
