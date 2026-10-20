import axios from 'axios'

export type FieldErrors = Record<string, string[]>

const messages: Record<number, string> = {
  401: 'Zaloguj się, aby kontynuować.',
  403: 'Nie masz uprawnień do tej akcji.',
  404: 'Nie znaleziono.',
  419: 'Sesja wygasła. Odśwież stronę i spróbuj ponownie.',
  422: 'Popraw zaznaczone pola.',
  429: 'Za dużo prób. Spróbuj ponownie za chwilę.',
}

const networkMessage = 'Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.'
const serverMessage = 'Coś poszło nie tak po stronie serwera. Spróbuj ponownie.'

export class ApiError extends Error {
  status: number | null
  code: string | null
  fieldErrors: FieldErrors

  constructor(message: string, status: number | null, code: string | null = null, fieldErrors: FieldErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors
  }

  get isUnauthenticated() {
    return this.status === 401
  }

  get isValidation() {
    return this.status === 422
  }

  fieldError(field: string) {
    return this.fieldErrors[field]?.[0]
  }
}

export function toApiError(error: unknown) {
  if (error instanceof ApiError) return error
  if (!axios.isAxiosError(error) || !error.response) return new ApiError(networkMessage, null)

  const { status, data } = error.response
  if (status >= 500) return new ApiError(serverMessage, status)

  const code = typeof data?.code === 'string' ? data.code : null
  const fieldErrors: FieldErrors = status === 422 && data?.errors ? data.errors : {}
  const message = messages[status] ?? (typeof data?.message === 'string' ? data.message : serverMessage)
  return new ApiError(message, status, code, fieldErrors)
}
