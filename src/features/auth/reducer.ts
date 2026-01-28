import type { AuthState } from './types'
import type { AuthAction } from './actions'
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT } from './actions'

const initialState: AuthState = {
  status: 'idle',
  error: null,
}

export function authReducer(state: AuthState = initialState, action: AuthAction): AuthState {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        status: 'loading',
        error: null,
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        status: 'authenticated',
        error: null,
      }
    case LOGIN_FAILURE:
      return {
        ...state,
        status: 'error',
        error: action.payload.error,
      }
    case LOGOUT:
      return {
        ...state,
        status: 'idle',
        error: null,
      }
    default:
      return state
  }
}

