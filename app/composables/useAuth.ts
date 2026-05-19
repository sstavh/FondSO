import { reactive, computed } from 'vue'
import { useApi } from './useApi'

export interface AuthUser {
  id: number
  email: string
  firstName: string
  lastName: string
  avatar: string
  country: string
  purpose: string
  birthDate: string
  phone: string
  registrationCompleted: boolean
}

interface AuthState {
  token: string
  user: AuthUser | null
}

const state = reactive<AuthState>({
  token: '',
  user: null,
})

const initialized = { value: false }

export const useAuth = () => {
  const api = useApi()

  const init = () => {
    if (initialized.value || typeof window === 'undefined') return
    initialized.value = true
    state.token = localStorage.getItem('fondso_token') ?? ''
    const raw = localStorage.getItem('fondso_user')
    if (raw) {
      try { state.user = JSON.parse(raw) } catch { state.user = null }
    }
  }

  const isLoggedIn = computed(() => !!state.token)

  const save = (token: string, user: AuthUser) => {
    state.token = token
    state.user = user
    localStorage.setItem('fondso_token', token)
    localStorage.setItem('fondso_user', JSON.stringify(user))
  }

  const login = async (email: string, password: string) => {
    const res = await api.post<{ token: string; user: AuthUser }>('/api/auth/login', { email, password })
    save(res.token, res.user)
    return res
  }

  const register = async (email: string, password: string, firstName: string, lastName?: string) => {
    const res = await api.post<{ token: string; user: AuthUser }>('/api/auth/register', {
      email, password, firstName, lastName: lastName ?? '',
    })
    save(res.token, res.user)
    return res
  }

  const resetPassword = async (email: string, newPassword: string) => {
    return api.post<{ success: boolean }>('/api/auth/reset-password', { email, newPassword })
  }

  const updateProfile = async (data: Partial<AuthUser>) => {
    const res = await api.patch<AuthUser>('/api/user/profile', data)
    state.user = res
    localStorage.setItem('fondso_user', JSON.stringify(res))
    return res
  }

  const logout = () => {
    state.token = ''
    state.user = null
    localStorage.removeItem('fondso_token')
    localStorage.removeItem('fondso_user')
  }

  return { state, isLoggedIn, init, login, register, resetPassword, updateProfile, logout }
}
