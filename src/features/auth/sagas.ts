import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-react-router'

import { login, SystemError, ValidationError, type TokenResponse } from '../../api/auth'
import { clearTokensFromCookies, saveTokensToCookies } from '../../utils/tokenCookies'
import { LOGIN_REQUEST, LOGOUT, loginFailure, loginSuccess, type LoginRequestAction } from './actions'

function* handleLogin(action: LoginRequestAction): Generator {
  try {
    const tokens = (yield call(login, action.payload)) as TokenResponse

    yield call(saveTokensToCookies, tokens)
    yield put(loginSuccess())
    yield put(push('/posts'))
  } catch (error) {
    if (error instanceof ValidationError) {
      const message = error.items.map((item) => `${item.field}: ${item.message}`).join(', ')
      yield put(loginFailure(message))
      return
    }

    if (error instanceof SystemError) {
      yield put(loginFailure(error.message || 'System error'))
      return
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    yield put(loginFailure(message))
  }
}

function* handleLogout(): Generator<unknown> {
  yield call(clearTokensFromCookies)
  yield put(push('/login'))
}

export function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, handleLogin)
  yield takeLatest(LOGOUT, handleLogout)
}

