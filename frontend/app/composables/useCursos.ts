export interface Curso {
  id: string
  titulo: string
  descripcion: string
  nivel_dificultad: string
  estado: string
  portada_url?: string
  profesor?: {
    id: string
    nombre: string
    email: string
  }
}

export interface Nivel {
  id: string
  numero: number
  titulo: string
  descripcion: string
  duracion_estimada_min?: number
  retos?: Reto[]
  guias?: any[]
}

export interface Reto {
  id: string
  titulo: string
  descripcion: string
  tipo: string
  contenido_interactivo?: any
  puntos_recompensa: number
  tiempo_limite_seg?: number
}

export const useCursos = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string
  const { token } = useAuth()

  const authHeaders = computed(() => ({
    Authorization: `Bearer ${token.value || ''}`,
  }))

  const fetchCursosPublicados = async () => {
    return await $fetch<Curso[]>(`${apiBase}/cursos/publicados`, {
      headers: authHeaders.value,
    })
  }

  const fetchCursoById = async (id: string) => {
    return await $fetch<Curso>(`${apiBase}/cursos/${id}`, {
      headers: authHeaders.value,
    })
  }

  const fetchNivelesByCurso = async (cursoId: string) => {
    return await $fetch<Nivel[]>(`${apiBase}/niveles/curso/${cursoId}`, {
      headers: authHeaders.value,
    })
  }

  const inscribirCurso = async (cursoId: string) => {
    return await $fetch(`${apiBase}/cursos/${cursoId}/inscribir`, {
      method: 'POST',
      headers: authHeaders.value,
    })
  }

  const fetchRetoById = async (retoId: string) => {
    return await $fetch<Reto>(`${apiBase}/retos/${retoId}`, {
      headers: authHeaders.value,
    })
  }

  const registrarIntentoReto = async (data: {
    progreso_nivel_id: string
    reto_id: string
    numero_intento?: number
    puntaje_obtenido?: number
    aprobado?: boolean
    duracion_seg?: number
  }) => {
    return await $fetch(`${apiBase}/retos/intento`, {
      method: 'POST',
      headers: authHeaders.value,
      body: data,
    })
  }

  return {
    fetchCursosPublicados,
    fetchCursoById,
    fetchNivelesByCurso,
    inscribirCurso,
    fetchRetoById,
    registrarIntentoReto,
  }
}

