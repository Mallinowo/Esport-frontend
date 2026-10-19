import type { InternalAxiosRequestConfig } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { api, getCsrfCookie } from './client'

const defaultAdapter = api.defaults.adapter

function mockAdapter() {
  const adapter = vi.fn((config: InternalAxiosRequestConfig) =>
    Promise.resolve({ data: {}, status: 204, statusText: 'No Content', headers: {}, config }),
  )
  api.defaults.adapter = adapter
  return adapter
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
})
