import type { LoginCredentials } from './types'

export const LOGIN_REQUEST = 'auth/LOGIN_REQUEST' as const
export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS' as const
export const LOGIN_FAILURE = 'auth/LOGIN_FAILURE' as const
export const LOGOUT = 'auth/LOGOUT' as const

export interface LoginRequestAction {
  type: typeof LOGIN_REQUEST
  payload: LoginCredentials
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS
}

export interface LoginFailureAction {
  type: typeof LOGIN_FAILURE
  payload: { error: string }
}

export interface LogoutAction {
  type: typeof LOGOUT
}

export type AuthAction =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction

export const loginRequest = (credentials: LoginCredentials): LoginRequestAction => ({
  type: LOGIN_REQUEST,
  payload: credentials,
})

export const loginSuccess = (): LoginSuccessAction => ({
  type: LOGIN_SUCCESS,
})

export const loginFailure = (error: string): LoginFailureAction => ({
  type: LOGIN_FAILURE,
  payload: { error },
})

export const logout = (): LogoutAction => ({
  type: LOGOUT,
})

