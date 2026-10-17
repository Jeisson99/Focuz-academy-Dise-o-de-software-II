export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login', '/register', '/']
  const isPublic = publicRoutes.includes(to.path) || to.path.startsWith('/cursos')

  // Si no está autenticado y la ruta requiere sesión
  if (!isAuthenticated.value && !isPublic) {
    return navigateTo('/login')
  }

  // Si ya está autenticado y quiere ir a login o registro
  if (isAuthenticated.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})

