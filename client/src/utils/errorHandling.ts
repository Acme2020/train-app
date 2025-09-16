// Format API error messages for display
export const formatApiError = (error: unknown): string => {
  // Check for network errors (connection issues)
  if (isNetworkError(error)) {
    return 'Netzwerkfehler: Bitte überprüfen Sie Ihre Internetverbindung'
  }

  // Check for 404 errors (resource not found)
  if (isNotFoundError(error)) {
    return 'Die angeforderte Ressource wurde nicht gefunden'
  }

  // Standard error handling
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'Ein unerwarteter Fehler ist aufgetreten'
}

// Check if error is a network error
const isNetworkError = (error: unknown): boolean => {
  return (
    error instanceof Error &&
    (error.message.includes('Network Error') ||
      error.message.includes('timeout') ||
      error.message.includes('connection refused'))
  )
}
//Check if error is a not found error
const isNotFoundError = (error: unknown): boolean => {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response &&
      error.response.status === 404,
  )
}
