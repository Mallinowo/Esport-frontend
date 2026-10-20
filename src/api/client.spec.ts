import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { api, getCsrfCookie } from './client'
import { ApiError } from './errors'

const defaultAdapter = api.defaults.adapter

function respond(config: InternalAxiosRequestConfig, status: number, data: unknown = {}) {
  const response: AxiosResponse = { data, status, statusText: '', headers: {}, config }
  if (status >= 400) {
    return Promise.reject(new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, null, response))
  }
  return Promise.resolve(response)
}

function mockAdapter(statuses: number[] = [204]) {
  const adapter = vi.fn((config: InternalAxiosRequestConfig) => {
    if (config.url === '/sanctum/csrf-cookie') return respond(config, 204)
    return respond(config, statuses.shift() ?? 200)
  })
  api.defaults.adapter = adapter
  return adapter
}

function calledUrls(adapter: ReturnType<typeof mockAdapter>) {
  return adapter.mock.calls.map(([config]) => config.url)
}

afterEach(() => {
  api.defaults.adapter = defaultAdapter
})

describe('api', () => {
  it('wysyła ciasteczka i token XSRF', () => {
    expect(api.defaults.withCredentials).toBe(true)
    expect(api.defaults.withXSRFToken).toBe(true)
    expect(api.defaults.xsrfCookieName).toBe('XSRF-TOKEN')
    expect(api.defaults.xsrfHeaderName).toBe('X-XSRF-TOKEN')
  })

  it('prosi o odpowiedzi w JSON', () => {
    expect(api.defaults.headers.Accept).toBe('application/json')
  })

  it('ma adres API z env', () => {
    expect(api.defaults.baseURL).toBe(import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api')
  })

  it('pobiera ciasteczko CSRF spoza prefiksu /api', async () => {
    const adapter = mockAdapter()
    await getCsrfCookie()
    const config = adapter.mock.calls[0]![0]
    expect(config.baseURL).toBe(new URL(api.defaults.baseURL!).origin)
    expect(config.url).toBe('/sanctum/csrf-cookie')
  })

  it('po 419 odświeża CSRF i powtarza żądanie', async () => {
    const adapter = mockAdapter([419, 200])
    const response = await api.post('/auth/logout')
    expect(response.status).toBe(200)
    expect(calledUrls(adapter)).toEqual(['/auth/logout', '/sanctum/csrf-cookie', '/auth/logout'])
  })

  it('powtarza żądanie po 419 tylko raz', async () => {
    const adapter = mockAdapter([419, 419])
    await expect(api.post('/auth/logout')).rejects.toMatchObject({ status: 419 })
    expect(calledUrls(adapter)).toEqual(['/auth/logout', '/sanctum/csrf-cookie', '/auth/logout'])
  })

  it('odrzuca błędy jako ApiError', async () => {
    mockAdapter([422])
    await expect(api.post('/auth/register')).rejects.toBeInstanceOf(ApiError)
  })
})
