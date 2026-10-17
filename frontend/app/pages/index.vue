<template>
  <div>
    <!-- Hero / Bienvenida -->
    <v-card class="mb-6 elevation-2 rounded-lg" color="primary" theme="dark">
      <v-card-text class="pa-6 pa-md-8">
        <v-row align="center">
          <v-col cols="12" md="8">
            <h1 class="text-h4 font-weight-bold mb-2">
              ¡Bienvenido a Focuz Academy!
            </h1>
            <p class="text-body-1 opacity-90 mb-4">
              Plataforma interactiva de aprendizaje estructurado con retos prácticos y gamificación.
            </p>
            <div class="d-flex flex-wrap gap-2">
              <!-- Clic 1 hacia el contenido formativo (Regla de los 3 clics) -->
              <v-btn
                color="accent"
                size="large"
                to="/cursos"
                prepend-icon="mdi-compass-outline"
                class="text-none font-weight-bold mr-3"
              >
                Explorar Cursos
              </v-btn>
              <v-btn
                v-if="!isAuthenticated"
                variant="outlined"
                color="white"
                size="large"
                to="/register"
                prepend-icon="mdi-account-plus"
                class="text-none"
              >
                Crear Cuenta
              </v-btn>
              <v-btn
                v-else
                variant="outlined"
                color="white"
                size="large"
                to="/progreso"
                prepend-icon="mdi-chart-bar"
                class="text-none"
              >
                Ver Mi Progreso
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="4" class="text-center d-none d-md-block">
            <v-icon icon="mdi-lightbulb-on-outline" size="140" class="opacity-80" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Regla de Mandel #2: Información relevante y no sobrecargada (máx 3-4 tarjetas) -->
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-card class="h-100 elevation-1 rounded-lg" hover to="/cursos">
          <v-card-item prepend-icon="mdi-book-multiple" title="Cursos Disponibles">
            <template #subtitle>Descubre materias y habilidades clave</template>
          </v-card-item>
          <v-card-text>
            Accede al catálogo de cursos modulares con niveles secuenciales y guías de estudio.
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card class="h-100 elevation-1 rounded-lg" hover to="/progreso">
          <v-card-item prepend-icon="mdi-flag-checkered" title="Retos y Aprendizaje">
            <template #subtitle>Aprende haciendo con retroalimentación inmediata</template>
          </v-card-item>
          <v-card-text>
            Resuelve retos interactivos y pon a prueba tus conocimientos en cada nivel formativo.
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card class="h-100 elevation-1 rounded-lg" hover to="/gamificacion">
          <v-card-item prepend-icon="mdi-medal-outline" title="Gamificación y Logros">
            <template #subtitle>Gana puntos y desbloquea insignias</template>
          </v-card-item>
          <v-card-text>
            Atrevete a probar nuestro sistema de puntuación, rachas y reconocimiento.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuth()
</script>

