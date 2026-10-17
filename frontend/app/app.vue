<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- UX-01: Snackbar Global de Feedback (Pressman Cap. 12 - Visibilidad del Estado) -->
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="bottom right"
      rounded="lg"
      elevation="4"
    >
      <div class="d-flex align-center gap-2">
        <v-icon :icon="snackbar.icon" size="20" />
        <span class="font-weight-medium">{{ snackbar.message }}</span>
      </div>
      <template #actions>
        <v-btn variant="text" color="white" size="small" @click="snackbar.visible = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>

    <!-- MOB-04: Banner de Red Offline (Pressman Cap. 13.1.2) -->
    <v-snackbar
      v-model="isOffline"
      color="warning"
      :timeout="-1"
      location="top"
      rounded="lg"
      elevation="4"
    >
      <div class="d-flex align-center gap-2">
        <v-icon icon="mdi-wifi-off" size="20" />
        <span class="font-weight-medium">Modo sin conexión — tus avances se sincronizarán al reconectar</span>
      </div>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
// MOB-04: Detección de estado de red offline
const isOffline = ref(false)

onMounted(() => {
  isOffline.value = !navigator.onLine

  window.addEventListener('offline', () => {
    isOffline.value = true
  })
  window.addEventListener('online', () => {
    isOffline.value = false
    // Notificar reconexión exitosa
    useSnackbar().show('Conexión restaurada — sincronizando avances', 'success')
  })
})

onUnmounted(() => {
  window.removeEventListener('offline', () => {})
  window.removeEventListener('online', () => {})
})

// UX-01: Snackbar global accesible desde cualquier componente vía composable
const snackbar = useState('snackbar', () => ({
  visible: false,
  message: '',
  color: 'success',
  icon: 'mdi-check-circle',
  timeout: 4000,
}))
</script>
