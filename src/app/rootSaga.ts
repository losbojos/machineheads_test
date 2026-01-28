// src/app/rootSaga.ts
import { all, fork } from 'redux-saga/effects'

export function* rootSaga() {
  yield all([
    // сюда позже добавим fork(authSaga), fork(postsSaga) и т.д.
  ])
}