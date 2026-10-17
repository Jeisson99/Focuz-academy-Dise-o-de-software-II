<template>
  <div>
    <CommonBackButton to="/" label="Volver al Inicio" />

    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold text-primary">Mi Progreso Académico</h1>
      <p class="text-subtitle-1 text-medium-emphasis">
        Monitoreo en tiempo real de tu avance formativo y competencias adquiridas
      </p>
    </div>

    <!-- Indicadores Generales (Miller 7±2: 3 tarjetas de impacto) -->
    <v-row class="mb-6">
      <v-col cols="12" sm="4">
        <v-card class="pa-4 elevation-1 rounded-lg text-center">
          <v-avatar color="primary" variant="tonal" size="48" class="mb-2">
            <v-icon icon="mdi-book-check" size="28" />
          </v-avatar>
          <div class="text-h4 font-weight-bold">2</div>
          <div class="text-caption text-medium-emphasis">Cursos en Curso</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="pa-4 elevation-1 rounded-lg text-center">
          <v-avatar color="success" variant="tonal" size="48" class="mb-2">
            <v-icon icon="mdi-flag-checkered" size="28" />
          </v-avatar>
          <div class="text-h4 font-weight-bold">5</div>
          <div class="text-caption text-medium-emphasis">Retos Superados</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="pa-4 elevation-1 rounded-lg text-center">
          <v-avatar color="accent" variant="tonal" size="48" class="mb-2">
            <v-icon icon="mdi-clock-check-outline" size="28" />
          </v-avatar>
          <div class="text-h4 font-weight-bold">3.5 hrs</div>
          <div class="text-caption text-medium-emphasis">Tiempo Dedicado</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Detalle por Curso -->
    <v-card class="elevation-2 rounded-lg pa-6 mb-6">
      <h2 class="text-h6 font-weight-bold mb-4 d-flex align-center">
        <v-icon icon="mdi-progress-check" color="primary" class="mr-2" />
        Avance por Curso
      </h2>

      <div v-for="(item, idx) in cursosProgreso" :key="idx" class="mb-5">
        <div class="d-flex align-center justify-space-between mb-1">
          <span class="font-weight-medium text-body-1">{{ item.curso }}</span>
          <span class="font-weight-bold text-primary">{{ item.porcentaje }}%</span>
        </div>
        <v-progress-linear
          :model-value="item.porcentaje"
          color="primary"
          height="12"
          rounded
        />
        <div class="d-flex justify-space-between text-caption text-medium-emphasis mt-1">
          <span>{{ item.nivelesCompletados }} de {{ item.totalNiveles }} niveles completados</span>
          <NuxtLink :to="item.link" class="text-primary text-decoration-none font-weight-medium">
            Continuar curso →
          </NuxtLink>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const cursosProgreso = [
  {
    curso: 'Introducción a la Algoritmia y Lógica',
    porcentaje: 65,
    nivelesCompletados: 2,
    totalNiveles: 3,
    link: '/cursos/demo-1',
  },
  {
    curso: 'Estructuras de Datos y Complejidad',
    porcentaje: 30,
    nivelesCompletados: 1,
    totalNiveles: 4,
    link: '/cursos/demo-2',
  },
]
</script>

