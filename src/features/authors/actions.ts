import type { AnyAction } from 'redux'
import type { CreateAuthorParams } from '../../api/authors'

export const AUTHORS_FETCH = 'authors/FETCH' as const
export const AUTHORS_FETCH_SUCCESS = 'authors/FETCH_SUCCESS' as const
export const AUTHORS_FETCH_FAILURE = 'authors/FETCH_FAILURE' as const
export const AUTHOR_CREATE = 'authors/CREATE' as const
export const AUTHOR_CREATE_SUCCESS = 'authors/CREATE_SUCCESS' as const
export const AUTHOR_CREATE_FAILURE = 'authors/CREATE_FAILURE' as const
export const AUTHOR_CREATE_RESET = 'authors/CREATE_RESET' as const
export const AUTHOR_FETCH_ONE = 'authors/FETCH_ONE' as const
export const AUTHOR_FETCH_ONE_SUCCESS = 'authors/FETCH_ONE_SUCCESS' as const
export const AUTHOR_FETCH_ONE_FAILURE = 'authors/FETCH_ONE_FAILURE' as const
export const AUTHOR_UPDATE = 'authors/UPDATE' as const
export const AUTHOR_UPDATE_SUCCESS = 'authors/UPDATE_SUCCESS' as const
export const AUTHOR_UPDATE_FAILURE = 'authors/UPDATE_FAILURE' as const
export const AUTHOR_EDIT_RESET = 'authors/EDIT_RESET' as const
export const AUTHOR_DELETE = 'authors/DELETE' as const

export interface AuthorsFetchAction extends AnyAction {
  type: typeof AUTHORS_FETCH
}

export interface AuthorsFetchSuccessAction extends AnyAction {
  type: typeof AUTHORS_FETCH_SUCCESS
  payload: { items: import('../../api/authors').Author[] }
}

export interface AuthorsFetchFailureAction extends AnyAction {
  type: typeof AUTHORS_FETCH_FAILURE
  payload: { error: string }
}

export interface AuthorCreateAction extends AnyAction {
  type: typeof AUTHOR_CREATE
  payload: CreateAuthorParams
}

export interface AuthorCreateSuccessAction extends AnyAction {
  type: typeof AUTHOR_CREATE_SUCCESS
}

export interface AuthorCreateFailureAction extends AnyAction {
  type: typeof AUTHOR_CREATE_FAILURE
  payload: { error: string; validationErrors?: { field: string; message: string }[] }
}

export interface AuthorCreateResetAction extends AnyAction {
  type: typeof AUTHOR_CREATE_RESET
}

export interface AuthorFetchOneAction extends AnyAction {
  type: typeof AUTHOR_FETCH_ONE
  payload: { id: number }
}

export interface AuthorFetchOneSuccessAction extends AnyAction {
  type: typeof AUTHOR_FETCH_ONE_SUCCESS
  payload: { author: import('../../api/authors').Author }
}

export interface AuthorFetchOneFailureAction extends AnyAction {
  type: typeof AUTHOR_FETCH_ONE_FAILURE
  payload: { error: string }
}

export interface AuthorUpdateAction extends AnyAction {
  type: typeof AUTHOR_UPDATE
  payload: { id: number } & CreateAuthorParams
}

export interface AuthorUpdateSuccessAction extends AnyAction {
  type: typeof AUTHOR_UPDATE_SUCCESS
}

export interface AuthorUpdateFailureAction extends AnyAction {
  type: typeof AUTHOR_UPDATE_FAILURE
  payload: { error: string; validationErrors?: { field: string; message: string }[] }
}

export interface AuthorEditResetAction extends AnyAction {
  type: typeof AUTHOR_EDIT_RESET
}

export interface AuthorDeleteAction extends AnyAction {
  type: typeof AUTHOR_DELETE
  payload: { id: number }
}

export type AuthorsAction =
  | AuthorsFetchAction
  | AuthorsFetchSuccessAction
  | AuthorsFetchFailureAction
  | AuthorCreateAction
  | AuthorCreateSuccessAction
  | AuthorCreateFailureAction
  | AuthorCreateResetAction
  | AuthorFetchOneAction
  | AuthorFetchOneSuccessAction
  | AuthorFetchOneFailureAction
  | AuthorUpdateAction
  | AuthorUpdateSuccessAction
  | AuthorUpdateFailureAction
  | AuthorEditResetAction
  | AuthorDeleteAction

export const authorsFetch = (): AuthorsFetchAction => ({
  type: AUTHORS_FETCH,
})

export const authorsFetchSuccess = (
  items: import('../../api/authors').Author[],
): AuthorsFetchSuccessAction => ({
  type: AUTHORS_FETCH_SUCCESS,
  payload: { items },
})

export const authorsFetchFailure = (error: string): AuthorsFetchFailureAction => ({
  type: AUTHORS_FETCH_FAILURE,
  payload: { error },
})

export const authorCreate = (params: CreateAuthorParams): AuthorCreateAction => ({
  type: AUTHOR_CREATE,
  payload: params,
})

export const authorCreateSuccess = (): AuthorCreateSuccessAction => ({
  type: AUTHOR_CREATE_SUCCESS,
})

export const authorCreateFailure = (
  error: string,
  validationErrors?: { field: string; message: string }[],
): AuthorCreateFailureAction => ({
  type: AUTHOR_CREATE_FAILURE,
  payload: { error, validationErrors },
})

export const authorCreateReset = (): AuthorCreateResetAction => ({
  type: AUTHOR_CREATE_RESET,
})

export const authorFetchOne = (id: number): AuthorFetchOneAction => ({
  type: AUTHOR_FETCH_ONE,
  payload: { id },
})

export const authorFetchOneSuccess = (
  author: import('../../api/authors').Author,
): AuthorFetchOneSuccessAction => ({
  type: AUTHOR_FETCH_ONE_SUCCESS,
  payload: { author },
})

export const authorFetchOneFailure = (error: string): AuthorFetchOneFailureAction => ({
  type: AUTHOR_FETCH_ONE_FAILURE,
  payload: { error },
})

export const authorUpdate = (id: number, params: CreateAuthorParams): AuthorUpdateAction => ({
  type: AUTHOR_UPDATE,
  payload: { id, ...params },
})

export const authorUpdateSuccess = (): AuthorUpdateSuccessAction => ({
  type: AUTHOR_UPDATE_SUCCESS,
})

export const authorUpdateFailure = (
  error: string,
  validationErrors?: { field: string; message: string }[],
): AuthorUpdateFailureAction => ({
  type: AUTHOR_UPDATE_FAILURE,
  payload: { error, validationErrors },
})

export const authorEditReset = (): AuthorEditResetAction => ({
  type: AUTHOR_EDIT_RESET,
})

export const authorDelete = (id: number): AuthorDeleteAction => ({
  type: AUTHOR_DELETE,
  payload: { id },
})
