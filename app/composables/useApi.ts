const BASE_URL = 'http://localhost:8080'

export interface MarketPoint {
  time: string
  value: number
}

export interface MarketCompany {
  id: number
  name: string
  ticker: string
  logo: string
  startPrice: number
  minPrice: number
  maxPrice: number
  pointsCount: number
  updateInterval: number
}

const getToken = (): string => {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('fondso_token') ?? ''
}

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || err.error || `HTTP ${response.status}`)
  }

  return response.json()
}

export const useApi = () => ({
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
})
