<template>
  <div>
    <CommonBackButton to="/" label="Volver al Inicio" />

    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold text-primary">Sistema de Gamificación</h1>
      <p class="text-subtitle-1 text-medium-emphasis">
        Tus puntos de experiencia, nivel de maestría e insignias obtenidas
      </p>
    </div>

    <!-- Nivel y Puntos Actuales -->
    <v-card class="elevation-2 rounded-lg pa-6 mb-6" color="primary" theme="dark">
      <v-row align="center">
        <v-col cols="12" sm="3" class="text-center">
          <v-avatar color="accent" size="90" class="elevation-3">
            <v-icon icon="mdi-shield-star" size="48" color="primary" />
          </v-avatar>
        </v-col>
        <v-col cols="12" sm="9">
          <div class="d-flex align-center justify-space-between flex-wrap">
            <div>
              <div class="text-caption text-uppercase font-weight-bold opacity-80">Rango Actual</div>
              <h2 class="text-h4 font-weight-bold">Explorador del Código (Nivel 2)</h2>
            </div>
            <v-chip color="accent" size="large" variant="flat" class="font-weight-bold mt-2 mt-sm-0">
              350 Puntos Totales
            </v-chip>
          </div>

          <div class="mt-4">
            <div class="d-flex justify-space-between text-caption mb-1">
              <span>Progreso hacia Nivel 3 (Desarrollador Junior)</span>
              <span>350 / 500 pts</span>
            </div>
            <v-progress-linear model-value="70" color="accent" height="10" rounded />
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- Galería de Insignias / Logros -->
    <h2 class="text-h5 font-weight-bold mb-4 d-flex align-center">
      <v-icon icon="mdi-medal" color="primary" class="mr-2" />
      Insignias y Reconocimientos
    </h2>

    <v-row>
      <v-col
        v-for="(logro, idx) in logros"
        :key="idx"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          class="h-100 elevation-1 rounded-lg pa-4 text-center"
          :class="{ 'opacity-50': !logro.desbloqueado }"
        >
          <v-avatar
            :color="logro.desbloqueado ? 'accent' : 'grey-lighten-2'"
            size="64"
            class="mb-3"
          >
            <v-icon
              :icon="logro.icono"
              size="32"
              :color="logro.desbloqueado ? 'primary' : 'grey'"
            />
          </v-avatar>

          <h3 class="text-subtitle-1 font-weight-bold mb-1">{{ logro.titulo }}</h3>
          <p class="text-caption text-medium-emphasis mb-3">{{ logro.descripcion }}</p>

          <v-chip
            size="small"
            :color="logro.desbloqueado ? 'success' : 'grey'"
            variant="tonal"
            class="font-weight-medium"
          >
            {{ logro.desbloqueado ? 'Desbloqueado ✓' : 'Bloqueado' }}
          </v-chip>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const logros = [
  {
    titulo: 'Primer Paso',
    descripcion: 'Inscribirse en el primer curso formativo.',
    icono: 'mdi-foot-print',
    desbloqueado: true,
  },
  {
    titulo: 'Pensador Algorítmico',
    descripcion: 'Completar el primer reto de lógica con éxito.',
    icono: 'mdi-head-snowflake-outline',
    desbloqueado: true,
  },
  {
    titulo: 'Constancia Diaria',
    descripcion: 'Entrar a la plataforma 3 días consecutivos.',
    icono: 'mdi-fire',
    desbloqueado: true,
  },
  {
    titulo: 'Maestro del Tiempo',
    descripcion: 'Resolver un reto en menos del tiempo estimado.',
    icono: 'mdi-timer-star-outline',
    desbloqueado: false,
  },
  {
    titulo: 'Graduado Focuz',
    descripcion: 'Completar todos los niveles de un curso formativo.',
    icono: 'mdi-school',
    desbloqueado: false,
  },
  {
    titulo: 'Perfeccionista',
    descripcion: 'Alcanzar el 100% de aciertos en 5 retos seguidos.',
    icono: 'mdi-star-circle-outline',
    desbloqueado: false,
  },
]
</script>

