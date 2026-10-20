import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it } from 'vitest'
import { ApiError, toApiError } from './errors'

function httpError(status: number, data: unknown = {}) {
  const config = { headers: {} } as InternalAxiosRequestConfig
  const response: AxiosResponse = { data, status, statusText: '', headers: {}, config }
  return new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, null, response)
}

describe('toApiError', () => {
  it('przy 422 zwraca błędy pól', () => {
    const error = toApiError(
      httpError(422, {
        message: 'The home score field must be between 0 and 99.',
        errors: { home_score: ['Wynik musi być liczbą od 0 do 99.'] },
      }),
    )
    expect(error.isValidation).toBe(true)
    expect(error.fieldError('home_score')).toBe('Wynik musi być liczbą od 0 do 99.')
    expect(error.fieldError('away_score')).toBeUndefined()
    expect(error.message).toBe('Popraw zaznaczone pola.')
  })

  it('przy 401 oznacza brak sesji', () => {
    const error = toApiError(httpError(401, { message: 'Unauthenticated.' }))
    expect(error.isUnauthenticated).toBe(true)
    expect(error.message).toBe('Zaloguj się, aby kontynuować.')
  })

  it('przy 409 zachowuje kod i komunikat z API', () => {
    const error = toApiError(httpError(409, { message: 'Result already reported.', code: 'result_already_reported' }))
    expect(error.status).toBe(409)
    expect(error.code).toBe('result_already_reported')
    expect(error.message).toBe('Result already reported.')
  })

  it('przy błędzie serwera daje ogólny komunikat', () => {
    const error = toApiError(httpError(500, { message: 'Server Error.' }))
    expect(error.status).toBe(500)
    expect(error.message).toBe('Coś poszło nie tak po stronie serwera. Spróbuj ponownie.')
  })

  it('bez odpowiedzi traktuje błąd jako brak połączenia', () => {
    const error = toApiError(new AxiosError('Network Error', 'ERR_NETWORK'))
    expect(error.status).toBeNull()
    expect(error.message).toContain('Brak połączenia')
  })

  it('nie opakowuje drugi raz ApiError', () => {
    const original = new ApiError('Nie znaleziono.', 404)
    expect(toApiError(original)).toBe(original)
  })
})
