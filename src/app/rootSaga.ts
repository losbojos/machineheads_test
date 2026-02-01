// src/app/rootSaga.ts
import { all, fork } from 'redux-saga/effects'

import { authSaga } from '../features/auth/sagas'
import { postsSaga } from '../features/posts/sagas'
import { authorsSaga } from '../features/authors/sagas'
import { tagsSaga } from '../features/tags/sagas'

export function* rootSaga() {
  yield all([fork(authSaga), fork(postsSaga), fork(authorsSaga), fork(tagsSaga)])
}