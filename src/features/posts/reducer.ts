import type { PostsState } from './types'
import type { PostsAction } from './actions'
import {
  POSTS_FETCH,
  POSTS_FETCH_SUCCESS,
  POSTS_FETCH_FAILURE,
} from './actions'

const initialState: PostsState = {
  items: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  status: 'idle',
  error: null,
}

export function postsReducer(
  state: PostsState = initialState,
  action: PostsAction,
): PostsState {
  switch (action.type) {
    case POSTS_FETCH:
      return {
        ...state,
        status: 'loading',
        error: null,
      }
    case POSTS_FETCH_SUCCESS:
      return {
        ...state,
        items: action.payload.items,
        pagination: action.payload.pagination,
        status: 'success',
        error: null,
      }
    case POSTS_FETCH_FAILURE:
      return {
        ...state,
        status: 'error',
        error: action.payload.error,
      }
    default:
      return state
  }
}
