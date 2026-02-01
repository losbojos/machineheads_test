import type { AnyAction } from 'redux'
import type { CreateTagParams } from '../../api/tags'

export const TAGS_FETCH = 'tags/FETCH' as const
export const TAGS_FETCH_SUCCESS = 'tags/FETCH_SUCCESS' as const
export const TAGS_FETCH_FAILURE = 'tags/FETCH_FAILURE' as const
export const TAG_CREATE = 'tags/CREATE' as const
export const TAG_CREATE_SUCCESS = 'tags/CREATE_SUCCESS' as const
export const TAG_CREATE_FAILURE = 'tags/CREATE_FAILURE' as const
export const TAG_CREATE_RESET = 'tags/CREATE_RESET' as const
export const TAG_FETCH_ONE = 'tags/FETCH_ONE' as const
export const TAG_FETCH_ONE_SUCCESS = 'tags/FETCH_ONE_SUCCESS' as const
export const TAG_FETCH_ONE_FAILURE = 'tags/FETCH_ONE_FAILURE' as const
export const TAG_UPDATE = 'tags/UPDATE' as const
export const TAG_UPDATE_SUCCESS = 'tags/UPDATE_SUCCESS' as const
export const TAG_UPDATE_FAILURE = 'tags/UPDATE_FAILURE' as const
export const TAG_EDIT_RESET = 'tags/EDIT_RESET' as const
export const TAG_DELETE = 'tags/DELETE' as const

export interface TagsFetchAction extends AnyAction {
  type: typeof TAGS_FETCH
}

export interface TagsFetchSuccessAction extends AnyAction {
  type: typeof TAGS_FETCH_SUCCESS
  payload: { items: import('../../api/tags').Tag[] }
}

export interface TagsFetchFailureAction extends AnyAction {
  type: typeof TAGS_FETCH_FAILURE
  payload: { error: string }
}

export interface TagCreateAction extends AnyAction {
  type: typeof TAG_CREATE
  payload: CreateTagParams
}

export interface TagCreateSuccessAction extends AnyAction {
  type: typeof TAG_CREATE_SUCCESS
}

export interface TagCreateFailureAction extends AnyAction {
  type: typeof TAG_CREATE_FAILURE
  payload: { error: string; validationErrors?: { field: string; message: string }[] }
}

export interface TagCreateResetAction extends AnyAction {
  type: typeof TAG_CREATE_RESET
}

export interface TagFetchOneAction extends AnyAction {
  type: typeof TAG_FETCH_ONE
  payload: { id: number }
}

export interface TagFetchOneSuccessAction extends AnyAction {
  type: typeof TAG_FETCH_ONE_SUCCESS
  payload: { tag: import('../../api/tags').Tag }
}

export interface TagFetchOneFailureAction extends AnyAction {
  type: typeof TAG_FETCH_ONE_FAILURE
  payload: { error: string }
}

export interface TagUpdateAction extends AnyAction {
  type: typeof TAG_UPDATE
  payload: { id: number } & CreateTagParams
}

export interface TagUpdateSuccessAction extends AnyAction {
  type: typeof TAG_UPDATE_SUCCESS
}

export interface TagUpdateFailureAction extends AnyAction {
  type: typeof TAG_UPDATE_FAILURE
  payload: { error: string; validationErrors?: { field: string; message: string }[] }
}

export interface TagEditResetAction extends AnyAction {
  type: typeof TAG_EDIT_RESET
}

export interface TagDeleteAction extends AnyAction {
  type: typeof TAG_DELETE
  payload: { id: number }
}

export type TagsAction =
  | TagsFetchAction
  | TagsFetchSuccessAction
  | TagsFetchFailureAction
  | TagCreateAction
  | TagCreateSuccessAction
  | TagCreateFailureAction
  | TagCreateResetAction
  | TagFetchOneAction
  | TagFetchOneSuccessAction
  | TagFetchOneFailureAction
  | TagUpdateAction
  | TagUpdateSuccessAction
  | TagUpdateFailureAction
  | TagEditResetAction
  | TagDeleteAction

export const tagsFetch = (): TagsFetchAction => ({
  type: TAGS_FETCH,
})

export const tagsFetchSuccess = (
  items: import('../../api/tags').Tag[],
): TagsFetchSuccessAction => ({
  type: TAGS_FETCH_SUCCESS,
  payload: { items },
})

export const tagsFetchFailure = (error: string): TagsFetchFailureAction => ({
  type: TAGS_FETCH_FAILURE,
  payload: { error },
})

export const tagCreate = (params: CreateTagParams): TagCreateAction => ({
  type: TAG_CREATE,
  payload: params,
})

export const tagCreateSuccess = (): TagCreateSuccessAction => ({
  type: TAG_CREATE_SUCCESS,
})

export const tagCreateFailure = (
  error: string,
  validationErrors?: { field: string; message: string }[],
): TagCreateFailureAction => ({
  type: TAG_CREATE_FAILURE,
  payload: { error, validationErrors },
})

export const tagCreateReset = (): TagCreateResetAction => ({
  type: TAG_CREATE_RESET,
})

export const tagFetchOne = (id: number): TagFetchOneAction => ({
  type: TAG_FETCH_ONE,
  payload: { id },
})

export const tagFetchOneSuccess = (
  tag: import('../../api/tags').Tag,
): TagFetchOneSuccessAction => ({
  type: TAG_FETCH_ONE_SUCCESS,
  payload: { tag },
})

export const tagFetchOneFailure = (error: string): TagFetchOneFailureAction => ({
  type: TAG_FETCH_ONE_FAILURE,
  payload: { error },
})

export const tagUpdate = (id: number, params: CreateTagParams): TagUpdateAction => ({
  type: TAG_UPDATE,
  payload: { id, ...params },
})

export const tagUpdateSuccess = (): TagUpdateSuccessAction => ({
  type: TAG_UPDATE_SUCCESS,
})

export const tagUpdateFailure = (
  error: string,
  validationErrors?: { field: string; message: string }[],
): TagUpdateFailureAction => ({
  type: TAG_UPDATE_FAILURE,
  payload: { error, validationErrors },
})

export const tagEditReset = (): TagEditResetAction => ({
  type: TAG_EDIT_RESET,
})

export const tagDelete = (id: number): TagDeleteAction => ({
  type: TAG_DELETE,
  payload: { id },
})
