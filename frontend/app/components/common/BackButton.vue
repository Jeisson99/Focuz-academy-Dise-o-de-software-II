<template>
  <v-btn
    variant="text"
    color="primary"
    prepend-icon="mdi-arrow-left"
    class="mb-3 text-none"
    @click="handleBack"
  >
    {{ label || 'Regresar' }}
  </v-btn>
</template>

<script setup lang="ts">
const props = defineProps<{
  to?: string
  label?: string
}>()

const router = useRouter()

const handleBack = () => {
  if (props.to) {
    router.push(props.to)
  } else {
    router.back()
  }
}
</script>

