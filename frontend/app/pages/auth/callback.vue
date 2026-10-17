<template>
  <div class="d-flex align-center justify-center" style="min-height: 80vh;">
    <v-card class="elevation-4 rounded-lg pa-8 text-center" max-width="400" width="100%">
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        size="64"
        class="mb-4"
      />
      <v-icon
        v-else-if="error"
        icon="mdi-alert-circle"
        color="error"
        size="64"
        class="mb-4"
      />
      <v-icon
        v-else
        icon="mdi-check-circle"
        color="success"
        size="64"
        class="mb-4"
      />

      <h2 class="text-h6 font-weight-bold mb-2">
        {{ loading ? 'Autenticando con Google...' : error ? 'Error de autenticación' : '¡Bienvenido!' }}
      </h2>
      <p class="text-body-2 text-medium-emphasis">
        {{ statusMessage }}
      </p>

      <v-btn
        v-if="error"
        color="primary"
        class="mt-4 text-none"
        to="/login"
      >
        Volver al inicio de sesión
      </v-btn>
    </v-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const { setTokenAndFetchProfile } = useAuth()
const { show: showSnackbar } = useSnackbar()

const loading = ref(true)
const error = ref(false)
const statusMessage = ref('Procesando credenciales de Google...')

onMounted(async () => {
  const token = route.query.token as string

  if (!token) {
    loading.value = false
    error.value = true
    statusMessage.value = 'No se recibió el token de autenticación de Google.'
    showSnackbar('Error al iniciar sesión con Google', 'error')
    return
  }

  try {
    const userProfile = await setTokenAndFetchProfile(token)
    if (userProfile) {
      statusMessage.value = 'Sesión iniciada con éxito. Redirigiendo...'
      showSnackbar(`¡Bienvenido de nuevo, ${userProfile.nombre}!`, 'success')
      setTimeout(() => {
        navigateTo('/')
      }, 800)
    } else {
      throw new Error('No se pudo obtener el perfil de usuario.')
    }
  } catch (err: any) {
    loading.value = false
    error.value = true
    statusMessage.value = 'Ocurrió un error al validar tu cuenta con Google.'
    showSnackbar('Error al sincronizar tu cuenta', 'error')
  } finally {
    loading.value = false
  }
})
</script>
