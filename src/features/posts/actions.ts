import type { UnknownAction } from 'redux-saga'

export const POSTS_FETCH = 'posts/FETCH' as const
export const POSTS_FETCH_SUCCESS = 'posts/FETCH_SUCCESS' as const
export const POSTS_FETCH_FAILURE = 'posts/FETCH_FAILURE' as const

export interface PostsFetchAction extends UnknownAction {
  type: typeof POSTS_FETCH
  payload: { page?: number; limit?: number }
}

export interface PostsFetchSuccessAction extends UnknownAction {
  type: typeof POSTS_FETCH_SUCCESS
  payload: { items: import('../../api/posts').Post[]; pagination: import('../../api/posts').PaginationInfo }
}

export interface PostsFetchFailureAction extends UnknownAction {
  type: typeof POSTS_FETCH_FAILURE
  payload: { error: string }
}

export type PostsAction =
  | PostsFetchAction
  | PostsFetchSuccessAction
  | PostsFetchFailureAction

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
