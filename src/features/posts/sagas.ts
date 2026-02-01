import { call, put, takeLatest } from 'redux-saga/effects'
import { fetchPosts } from '../../api/posts'
import {
  POSTS_FETCH,
  postsFetchSuccess,
  postsFetchFailure,
  type PostsFetchAction,
} from './actions'

function* handlePostsFetch(action: PostsFetchAction): Generator {
  try {
    const result = (yield call(fetchPosts, action.payload)) as Awaited<
      ReturnType<typeof fetchPosts>
    >
    yield put(postsFetchSuccess(result.items, result.pagination))
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch posts'
    yield put(postsFetchFailure(message))
  }
}

export function* postsSaga() {
  yield takeLatest(POSTS_FETCH, handlePostsFetch)
}
