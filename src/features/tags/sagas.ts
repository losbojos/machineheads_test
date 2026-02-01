import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import {
  fetchTags,
  fetchTag,
  createTag,
  updateTag,
  deleteTag,
} from '../../api/tags'
import { ValidationError } from '../../api/auth'
import {
  TAGS_FETCH,
  TAG_CREATE,
  TAG_FETCH_ONE,
  TAG_UPDATE,
  TAG_DELETE,
  tagsFetchSuccess,
  tagsFetchFailure,
  tagCreateSuccess,
  tagCreateFailure,
  tagFetchOneSuccess,
  tagFetchOneFailure,
  tagUpdateSuccess,
  tagUpdateFailure,
  tagsFetch,
  type TagsFetchAction,
  type TagCreateAction,
  type TagFetchOneAction,
  type TagUpdateAction,
  type TagDeleteAction,
} from './actions'

function* handleTagsFetch(_action: TagsFetchAction): Generator {
  try {
    const items = (yield call(fetchTags)) as Awaited<ReturnType<typeof fetchTags>>
    yield put(tagsFetchSuccess(items))
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Ошибка загрузки тегов'
    yield put(tagsFetchFailure(message))
  }
}

function* handleTagCreate(action: TagCreateAction): Generator {
  try {
    yield call(createTag, action.payload)
    yield put(tagCreateSuccess())
    yield put(push('/tags'))
  } catch (error) {
    if (error instanceof ValidationError) {
      const msg = error.items[0]?.message ?? 'Ошибка валидации'
      yield put(tagCreateFailure(msg, error.items))
      return
    }
    const message =
      error instanceof Error ? error.message : 'Не удалось создать тег'
    yield put(tagCreateFailure(message))
  }
}

function* handleTagFetchOne(action: TagFetchOneAction): Generator {
  try {
    const tag = (yield call(fetchTag, action.payload.id)) as Awaited<
      ReturnType<typeof fetchTag>
    >
    yield put(tagFetchOneSuccess(tag))
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Не удалось загрузить тег'
    yield put(tagFetchOneFailure(message))
  }
}

function* handleTagUpdate(action: TagUpdateAction): Generator {
  try {
    const { id, ...params } = action.payload
    yield call(updateTag, id, params)
    yield put(tagUpdateSuccess())
    yield put(push('/tags'))
  } catch (error) {
    if (error instanceof ValidationError) {
      const msg = error.items[0]?.message ?? 'Ошибка валидации'
      yield put(tagUpdateFailure(msg, error.items))
      return
    }
    const message =
      error instanceof Error ? error.message : 'Не удалось обновить тег'
    yield put(tagUpdateFailure(message))
  }
}

function* handleTagDelete(action: TagDeleteAction): Generator {
  try {
    yield call(deleteTag, action.payload.id)
    yield put(tagsFetch())
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Не удалось удалить тег'
    yield put(tagsFetchFailure(message))
  }
}

export function* tagsSaga() {
  yield takeLatest(TAGS_FETCH, handleTagsFetch)
  yield takeLatest(TAG_CREATE, handleTagCreate)
  yield takeLatest(TAG_FETCH_ONE, handleTagFetchOne)
  yield takeLatest(TAG_UPDATE, handleTagUpdate)
  yield takeLatest(TAG_DELETE, handleTagDelete)
}
