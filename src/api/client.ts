import axios, { type InternalAxiosRequestConfig } from 'axios'

export const apiUrl: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
})

export function getCsrfCookie() {
  return api.get('/sanctum/csrf-cookie', { baseURL: new URL(apiUrl).origin })
}

type RetryConfig = InternalAxiosRequestConfig & { csrfRetried?: boolean }

api.interceptors.response.use(undefined, async (error) => {
  const config: RetryConfig | undefined = error.config
  if (axios.isAxiosError(error) && error.response?.status === 419 && config && !config.csrfRetried) {
    config.csrfRetried = true
    await getCsrfCookie()
    return api.request(config)
  }
  return Promise.reject(error)
})
