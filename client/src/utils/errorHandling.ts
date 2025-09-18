import { AxiosError } from 'axios'

// Format API error messages for display
export const formatApiError = (error: unknown): string => {
  // Check for network error
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Error).message === 'string' &&
    ((error as Error).message.includes('Network Error') ||
      (error as Error).message.includes('timeout') ||
      (error as Error).message.includes('connection refused'))
  ) {
    return 'Netzwerkfehler: Bitte überprüfen Sie Ihre Internetverbindung'
  }

  // Check for AxiosError
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return 'Die angeforderte Ressource wurde nicht gefunden'
    }
    const code = error.response?.data?.code
    const serverError = error.response?.data?.error
    if (code === 'API_CONNECTION_ERROR') {
      return 'Verbindung zur Bahn-API fehlgeschlagen. Bitte versuchen Sie es später erneut.'
    }
    if (code === 'INVALID_QUERY') {
      return 'Ungültige Suchanfrage. Bitte überprüfen Sie Ihre Eingabe.'
    }
    if (code === 'NOT_FOUND') {
      return 'Die angeforderte Station wurde nicht gefunden.'
    }
    if (serverError) {
      return `Fehler: ${serverError}`
    }
    if (error.message) return error.message
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Error).message === 'string'
  ) {
    return (error as Error).message
  }
  if (typeof error === 'string') return error
  return 'Ein unerwarteter Fehler ist aufgetreten'
}
