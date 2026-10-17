<template>
  <v-card class="elevation-12 rounded-lg pa-6" max-width="450" width="100%">
    <div class="text-center mb-6">
      <v-avatar color="primary" size="56" class="mb-2">
        <v-icon icon="mdi-school" size="32" color="white" />
      </v-avatar>
      <h2 class="text-h5 font-weight-bold text-primary">Focuz Academy</h2>
      <p class="text-caption text-medium-emphasis">Ingresa tus credenciales para acceder</p>
    </div>

    <!-- Alerta de Error -->
    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      density="compact"
      class="mb-4"
      closable
      @click:close="errorMessage = ''"
    >
      {{ errorMessage }}
    </v-alert>

    <!-- Botón de Google OAuth -->
    <v-btn
      variant="outlined"
      color="secondary"
      size="large"
      block
      class="text-none font-weight-bold mb-3"
      @click="loginWithGoogle"
    >
      <v-icon icon="mdi-google" color="red" class="mr-2" />
      Continuar con Google
    </v-btn>

    <div class="d-flex align-center my-3">
      <v-divider />
      <span class="text-caption text-medium-emphasis px-3">o ingresa con tus credenciales</span>
      <v-divider />
    </div>

    <v-form @submit.prevent="handleLogin">
      <v-text-field
        v-model="email"
        label="Correo Electrónico"
        type="email"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        density="comfortable"
        class="mb-2"
        :rules="[rules.required, rules.email]"
        required
      />

      <v-text-field
        v-model="password"
        label="Contraseña"
        :type="showPassword ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock-outline"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        variant="outlined"
        density="comfortable"
        class="mb-4"
        :rules="[rules.required]"
        @click:append-inner="showPassword = !showPassword"
        required
      />

      <v-btn
        type="submit"
        color="primary"
        size="large"
        block
        :loading="loading"
        class="text-none font-weight-bold mb-3"
      >
        Iniciar Sesión
      </v-btn>

      <!-- Regla de Mandel 1: Botón de Cancelar / Volver -->
      <v-btn
        variant="text"
        color="secondary"
        size="small"
        block
        to="/"
        class="text-none mb-2"
      >
        Cancelar y volver al inicio
      </v-btn>
    </v-form>

    <v-divider class="my-4" />

    <div class="text-center text-body-2">
      ¿No tienes una cuenta?
      <NuxtLink to="/register" class="text-primary font-weight-bold text-decoration-none ml-1">
        Regístrate aquí
      </NuxtLink>
    </div>
  </v-card>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const { login, loginWithGoogle } = useAuth()

const rules = {
  required: (v: string) => !!v || 'Este campo es obligatorio',
  email: (v: string) => /.+@.+\..+/.test(v) || 'El correo debe ser válido',
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor completa todos los campos'
    return
  }

  loading.value = true
  errorMessage.value = ''

  const result = await login(email.value, password.value)
  loading.value = false

  if (result.success) {
    navigateTo('/')
  } else {
    errorMessage.value = Array.isArray(result.message)
      ? result.message.join(', ')
      : result.message
  }
}
</script>

