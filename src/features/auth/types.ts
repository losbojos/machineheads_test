export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error'

export interface AuthState {
  status: AuthStatus
  error: string | null
  // при необходимости сюда можно добавить данные пользователя
}

export interface LoginCredentials {
  email: string
  password: string
}

