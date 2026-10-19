import axios from 'axios'

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
