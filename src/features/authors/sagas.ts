import { call, put, takeLatest } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import {
  fetchAuthors,
  fetchAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from '../../api/authors'
import { ValidationError } from '../../api/auth'
import {
  AUTHORS_FETCH,
  AUTHOR_CREATE,
  AUTHOR_FETCH_ONE,
  AUTHOR_UPDATE,
  AUTHOR_DELETE,
  authorsFetchSuccess,
  authorsFetchFailure,
  authorCreateSuccess,
  authorCreateFailure,
  authorFetchOneSuccess,
  authorFetchOneFailure,
  authorUpdateSuccess,
  authorUpdateFailure,
  authorsFetch,
  type AuthorsFetchAction,
  type AuthorCreateAction,
  type AuthorFetchOneAction,
  type AuthorUpdateAction,
  type AuthorDeleteAction,
} from './actions'

function* handleAuthorsFetch(_action: AuthorsFetchAction): Generator {
  try {
    const items = (yield call(fetchAuthors)) as Awaited<ReturnType<typeof fetchAuthors>>
    yield put(authorsFetchSuccess(items))
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Ошибка загрузки авторов'
    yield put(authorsFetchFailure(message))
  }
}

function* handleAuthorCreate(action: AuthorCreateAction): Generator {
  try {
    yield call(createAuthor, action.payload)
    yield put(authorCreateSuccess())
    yield put(push('/authors'))
  } catch (error) {
    if (error instanceof ValidationError) {
      yield put(authorCreateFailure('Ошибка валидации', error.items))
      return
    }
    const message =
      error instanceof Error ? error.message : 'Не удалось создать автора'
    yield put(authorCreateFailure(message))
  }
}

function* handleAuthorFetchOne(action: AuthorFetchOneAction): Generator {
  try {
    const author = (yield call(fetchAuthor, action.payload.id)) as Awaited<
      ReturnType<typeof fetchAuthor>
    >
    yield put(authorFetchOneSuccess(author))
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Не удалось загрузить автора'
    yield put(authorFetchOneFailure(message))
  }
}

function* handleAuthorUpdate(action: AuthorUpdateAction): Generator {
  try {
    const { id, ...params } = action.payload
    yield call(updateAuthor, id, params)
    yield put(authorUpdateSuccess())
    yield put(push('/authors'))
  } catch (error) {
    if (error instanceof ValidationError) {
      yield put(authorUpdateFailure('Ошибка валидации', error.items))
      return
    }
    const message =
      error instanceof Error ? error.message : 'Не удалось обновить автора'
    yield put(authorUpdateFailure(message))
  }
}

function* handleAuthorDelete(action: AuthorDeleteAction): Generator {
  try {
    yield call(deleteAuthor, action.payload.id)
    yield put(authorsFetch())
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Не удалось удалить автора'
    yield put(authorsFetchFailure(message))
  }
}

export function* authorsSaga() {
  yield takeLatest(AUTHORS_FETCH, handleAuthorsFetch)
  yield takeLatest(AUTHOR_CREATE, handleAuthorCreate)
  yield takeLatest(AUTHOR_FETCH_ONE, handleAuthorFetchOne)
  yield takeLatest(AUTHOR_UPDATE, handleAuthorUpdate)
  yield takeLatest(AUTHOR_DELETE, handleAuthorDelete)
}
