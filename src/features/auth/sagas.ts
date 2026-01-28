import { call, put, takeLatest } from 'redux-saga/effects'

import { LOGIN_REQUEST, loginFailure, loginSuccess, type LoginRequestAction } from './actions'

// временный заглушечный API-вызыватель; позже заменим на реальный запрос к бекенду
function fakeLoginApi(_email: string, _password: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500)
  })
}

function* handleLogin(action: LoginRequestAction) {
  try {
    const { email, password } = action.payload
    // TODO: заменить fakeLoginApi на реальный запрос к REST API с cookies
    yield call(fakeLoginApi, email, password)
    yield put(loginSuccess())
    // сюда позже добавим редирект на /posts
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    yield put(loginFailure(message))
  }
}

export function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, handleLogin)
}

