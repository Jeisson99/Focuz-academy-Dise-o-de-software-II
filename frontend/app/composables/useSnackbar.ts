/**
 * useSnackbar — Composable global de feedback (UX-01 Pressman Cap. 12)
 * Permite mostrar snackbars de éxito, error, aviso e información
 * desde cualquier página o componente sin prop drilling.
 */
export const useSnackbar = () => {
  const snackbar = useState('snackbar', () => ({
    visible: false,
    message: '',
    color: 'success',
    icon: 'mdi-check-circle',
    timeout: 4000,
  }))

  const iconMap: Record<string, string> = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information',
  }

  const show = (message: string, color: 'success' | 'error' | 'warning' | 'info' = 'success', timeout = 4000) => {
    snackbar.value = {
      visible: true,
      message,
      color,
      icon: iconMap[color] || 'mdi-check-circle',
      timeout,
    }
  }

  return { snackbar, show }
}

