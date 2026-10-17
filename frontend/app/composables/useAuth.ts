export interface AuthUser {
  id: string
  email: string
  nombre: string
  rol: 'admin' | 'profesor' | 'alumno'
}

export const useAuth = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  })

  const user = useState<AuthUser | null>('auth_user', () => null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch<{ access_token: string; user: AuthUser }>(
        `${apiBase}/auth/login`,
        {
          method: 'POST',
          body: { email, password },
        }
      )

      token.value = response.access_token
      user.value = response.user
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        message: error?.data?.message || 'Error al iniciar sesión',
      }
    }
  }

  const register = async (nombre: string, email: string, password: string, rol = 'alumno') => {
    try {
      const response = await $fetch<{ access_token: string; user: AuthUser }>(
        `${apiBase}/auth/register`,
        {
          method: 'POST',
          body: { nombre, email, password, rol },
        }
      )

      token.value = response.access_token
      user.value = response.user
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        message: error?.data?.message || 'Error al registrar usuario',
      }
    }
  }

  const fetchProfile = async () => {
    if (!token.value) return null
    try {
      const response = await $fetch<{ user: AuthUser }>(`${apiBase}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
      user.value = response.user
      return user.value
    } catch {
      logout()
      return null
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  const setTokenAndFetchProfile = async (authToken: string) => {
    token.value = authToken
    return await fetchProfile()
  }

  const loginWithGoogle = () => {
    if (process.client) {
      window.location.href = `${apiBase}/auth/google`
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    fetchProfile,
    setTokenAndFetchProfile,
    loginWithGoogle,
    logout,
  }
}

