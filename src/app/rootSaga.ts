// src/app/rootSaga.ts
import { all, fork } from 'redux-saga/effects'

import { authSaga } from '../features/auth/sagas'

export function* rootSaga() {
  yield all([fork(authSaga)])
}