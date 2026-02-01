import { call, put, select, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { fetchPosts, createPost, fetchPost, updatePost, deletePost } from '../../api/posts'
import { ValidationError } from '../../api/auth'
import type { RootState } from '../../app/rootReducer'
import {
  POSTS_FETCH,
  POST_CREATE,
  POST_FETCH_ONE,
  POST_UPDATE,
  POST_DELETE,
  postsFetchSuccess,
  postsFetchFailure,
  postCreateSuccess,
  postCreateFailure,
  postFetchOneSuccess,
  postFetchOneFailure,
  postUpdateSuccess,
  postUpdateFailure,
  type PostsFetchAction,
  type PostCreateAction,
  type PostFetchOneAction,
  type PostUpdateAction,
  type PostDeleteAction,
  postsFetch,
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

function* handlePostCreate(action: PostCreateAction): Generator {
  try {
    yield call(createPost, action.payload)
    yield put(postCreateSuccess())
    yield put(push('/posts'))
  } catch (error) {
    if (error instanceof ValidationError) {
      const msg = error.items[0]?.message ?? 'Ошибка валидации'
      yield put(postCreateFailure(msg, error.items))
      return
    }
    const message =
      error instanceof Error ? error.message : 'Не удалось создать пост'
    yield put(postCreateFailure(message))
  }
}

function* handlePostFetchOne(action: PostFetchOneAction): Generator {
  try {
    const post = (yield call(fetchPost, action.payload.id)) as Awaited<
      ReturnType<typeof fetchPost>
    >
    yield put(postFetchOneSuccess(post))
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Не удалось загрузить пост'
    yield put(postFetchOneFailure(message))
  }
}

function* handlePostUpdate(action: PostUpdateAction): Generator {
  try {
    const { id, ...params } = action.payload
    yield call(updatePost, id, params)
    yield put(postUpdateSuccess())
    yield put(push('/posts'))
  } catch (error) {
    if (error instanceof ValidationError) {
      yield put(postUpdateFailure('Ошибка валидации', error.items))
      return
    }
    const message =
      error instanceof Error ? error.message : 'Не удалось обновить пост'
    yield put(postUpdateFailure(message))
  }
}

function* handlePostDelete(action: PostDeleteAction): Generator {
  try {
    yield call(deletePost, action.payload.id)
    const { page, limit } = action.payload
    const state = (yield select()) as RootState
    const fetchParams = {
      page: page ?? state.posts.pagination.page,
      limit: limit ?? state.posts.pagination.limit,
    }
    yield put(postsFetch(fetchParams))
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Не удалось удалить пост'
    yield put(postsFetchFailure(message))
  }
}

export function* postsSaga() {
  yield takeLatest(POSTS_FETCH, handlePostsFetch)
  yield takeLatest(POST_CREATE, handlePostCreate)
  yield takeLatest(POST_FETCH_ONE, handlePostFetchOne)
  yield takeLatest(POST_UPDATE, handlePostUpdate)
  yield takeLatest(POST_DELETE, handlePostDelete)
}
