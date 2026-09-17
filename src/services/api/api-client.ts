import { config } from '@/config'
import type { ApiResponse } from './types'

const TOKEN_KEY = 'dtr_token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
}

async function request<T>(method: string, url: string, body?: unknown): Promise<{ data: T }> {
  const token = tokenStorage.get()
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), config.api.timeout)

  try {
    const response = await fetch(`${config.api.baseUrl}${url}`, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    if (response.status === 401) {
      tokenStorage.remove()
      window.location.href = '/auth'
      throw new Error('Unauthorized')
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const json = (await response.json()) as ApiResponse<T> | T
    const data =
      json && typeof json === 'object' && 'data' in json ? (json as ApiResponse<T>).data : (json as T)

    return { data }
  } finally {
    window.clearTimeout(timer)
  }
}

export const apiClient = {
  get: <T>(url: string) => request<T>('GET', url),
  post: <T>(url: string, body?: unknown) => request<T>('POST', url, body),
}
