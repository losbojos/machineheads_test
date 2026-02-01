import type { AnyAction } from 'redux-saga'
import type { CreatePostParams } from '../../api/posts'

export const POSTS_FETCH = 'posts/FETCH' as const
export const POSTS_FETCH_SUCCESS = 'posts/FETCH_SUCCESS' as const
export const POSTS_FETCH_FAILURE = 'posts/FETCH_FAILURE' as const
export const POST_CREATE = 'posts/CREATE' as const
export const POST_CREATE_SUCCESS = 'posts/CREATE_SUCCESS' as const
export const POST_CREATE_FAILURE = 'posts/CREATE_FAILURE' as const
export const POST_CREATE_RESET = 'posts/CREATE_RESET' as const
export const POST_FETCH_ONE = 'posts/FETCH_ONE' as const
export const POST_FETCH_ONE_SUCCESS = 'posts/FETCH_ONE_SUCCESS' as const
export const POST_FETCH_ONE_FAILURE = 'posts/FETCH_ONE_FAILURE' as const
export const POST_UPDATE = 'posts/UPDATE' as const
export const POST_UPDATE_SUCCESS = 'posts/UPDATE_SUCCESS' as const
export const POST_UPDATE_FAILURE = 'posts/UPDATE_FAILURE' as const
export const POST_EDIT_RESET = 'posts/EDIT_RESET' as const
export const POST_DELETE = 'posts/DELETE' as const

export interface PostsFetchAction extends AnyAction {
  type: typeof POSTS_FETCH
  payload: { page?: number; limit?: number }
}

export interface PostsFetchSuccessAction extends AnyAction {
  type: typeof POSTS_FETCH_SUCCESS
  payload: { items: import('../../api/posts').Post[]; pagination: import('../../api/posts').PaginationInfo }
}

export interface PostsFetchFailureAction extends AnyAction {
  type: typeof POSTS_FETCH_FAILURE
  payload: { error: string }
}

export interface PostCreateAction extends AnyAction {
  type: typeof POST_CREATE
  payload: CreatePostParams
}

export interface PostCreateSuccessAction extends AnyAction {
  type: typeof POST_CREATE_SUCCESS
}

export interface PostCreateFailureAction extends AnyAction {
  type: typeof POST_CREATE_FAILURE
  payload: { error: string; validationErrors?: { field: string; message: string }[] }
}

export interface PostCreateResetAction extends AnyAction {
  type: typeof POST_CREATE_RESET
}

export interface PostFetchOneAction extends AnyAction {
  type: typeof POST_FETCH_ONE
  payload: { id: number }
}

export interface PostFetchOneSuccessAction extends AnyAction {
  type: typeof POST_FETCH_ONE_SUCCESS
  payload: { post: import('../../api/posts').PostDetail }
}

export interface PostFetchOneFailureAction extends AnyAction {
  type: typeof POST_FETCH_ONE_FAILURE
  payload: { error: string }
}

export interface PostUpdateAction extends AnyAction {
  type: typeof POST_UPDATE
  payload: { id: number } & CreatePostParams
}

export interface PostUpdateSuccessAction extends AnyAction {
  type: typeof POST_UPDATE_SUCCESS
}

export interface PostUpdateFailureAction extends AnyAction {
  type: typeof POST_UPDATE_FAILURE
  payload: { error: string; validationErrors?: { field: string; message: string }[] }
}

export interface PostEditResetAction extends AnyAction {
  type: typeof POST_EDIT_RESET
}

export interface PostDeleteAction extends AnyAction {
  type: typeof POST_DELETE
  payload: { id: number; page?: number; limit?: number }
}

export type PostsAction =
  | PostsFetchAction
  | PostsFetchSuccessAction
  | PostsFetchFailureAction
  | PostCreateAction
  | PostCreateSuccessAction
  | PostCreateFailureAction
  | PostCreateResetAction
  | PostFetchOneAction
  | PostFetchOneSuccessAction
  | PostFetchOneFailureAction
  | PostUpdateAction
  | PostUpdateSuccessAction
  | PostUpdateFailureAction
  | PostEditResetAction
  | PostDeleteAction

export const postsFetch = (params?: { page?: number; limit?: number }): PostsFetchAction => ({
  type: POSTS_FETCH,
  payload: params ?? {},
})

export const postsFetchSuccess = (
  items: import('../../api/posts').Post[],
  pagination: import('../../api/posts').PaginationInfo,
): PostsFetchSuccessAction => ({
  type: POSTS_FETCH_SUCCESS,
  payload: { items, pagination },
})

export const postsFetchFailure = (error: string): PostsFetchFailureAction => ({
  type: POSTS_FETCH_FAILURE,
  payload: { error },
})

export const postCreate = (params: CreatePostParams): PostCreateAction => ({
  type: POST_CREATE,
  payload: params,
})

export const postCreateSuccess = (): PostCreateSuccessAction => ({
  type: POST_CREATE_SUCCESS,
})

export const postCreateFailure = (
  error: string,
  validationErrors?: { field: string; message: string }[],
): PostCreateFailureAction => ({
  type: POST_CREATE_FAILURE,
  payload: { error, validationErrors },
})

export const postCreateReset = (): PostCreateResetAction => ({
  type: POST_CREATE_RESET,
})

export const postFetchOne = (id: number): PostFetchOneAction => ({
  type: POST_FETCH_ONE,
  payload: { id },
})

export const postFetchOneSuccess = (post: import('../../api/posts').PostDetail): PostFetchOneSuccessAction => ({
  type: POST_FETCH_ONE_SUCCESS,
  payload: { post },
})

export const postFetchOneFailure = (error: string): PostFetchOneFailureAction => ({
  type: POST_FETCH_ONE_FAILURE,
  payload: { error },
})

export const postUpdate = (id: number, params: CreatePostParams): PostUpdateAction => ({
  type: POST_UPDATE,
  payload: { id, ...params },
})

export const postUpdateSuccess = (): PostUpdateSuccessAction => ({
  type: POST_UPDATE_SUCCESS,
})

export const postUpdateFailure = (
  error: string,
  validationErrors?: { field: string; message: string }[],
): PostUpdateFailureAction => ({
  type: POST_UPDATE_FAILURE,
  payload: { error, validationErrors },
})

export const postEditReset = (): PostEditResetAction => ({
  type: POST_EDIT_RESET,
})

export const postDelete = (id: number, params?: { page?: number; limit?: number }): PostDeleteAction => ({
  type: POST_DELETE,
  payload: { id, ...params },
})
