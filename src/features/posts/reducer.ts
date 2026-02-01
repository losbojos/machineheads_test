import type { PostsState } from './types'
import type { PostsAction } from './actions'
import {
  POSTS_FETCH,
  POSTS_FETCH_SUCCESS,
  POSTS_FETCH_FAILURE,
  POST_CREATE,
  POST_CREATE_SUCCESS,
  POST_CREATE_FAILURE,
  POST_CREATE_RESET,
  POST_FETCH_ONE,
  POST_FETCH_ONE_SUCCESS,
  POST_FETCH_ONE_FAILURE,
  POST_UPDATE,
  POST_UPDATE_SUCCESS,
  POST_UPDATE_FAILURE,
  POST_EDIT_RESET,
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
  createStatus: 'idle',
  createError: null,
  createValidationErrors: [],
  editPost: null,
  editStatus: 'idle',
  editError: null,
  editValidationErrors: [],
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
    case POST_CREATE:
      return {
        ...state,
        createStatus: 'loading',
        createError: null,
        createValidationErrors: [],
      }
    case POST_CREATE_SUCCESS:
      return {
        ...state,
        createStatus: 'success',
        createError: null,
        createValidationErrors: [],
      }
    case POST_CREATE_FAILURE:
      return {
        ...state,
        createStatus: 'error',
        createError: action.payload.error,
        createValidationErrors: action.payload.validationErrors ?? [],
      }
    case POST_CREATE_RESET:
      return {
        ...state,
        createStatus: 'idle',
        createError: null,
        createValidationErrors: [],
      }
    case POST_FETCH_ONE:
      return {
        ...state,
        editStatus: 'loading',
        editPost: null,
        editError: null,
      }
    case POST_FETCH_ONE_SUCCESS:
      return {
        ...state,
        editStatus: 'success',
        editPost: action.payload.post,
        editError: null,
      }
    case POST_FETCH_ONE_FAILURE:
      return {
        ...state,
        editStatus: 'error',
        editError: action.payload.error,
      }
    case POST_UPDATE:
      return {
        ...state,
        createStatus: 'loading',
        createError: null,
        createValidationErrors: [],
      }
    case POST_UPDATE_SUCCESS:
      return {
        ...state,
        createStatus: 'success',
        createError: null,
        createValidationErrors: [],
      }
    case POST_UPDATE_FAILURE:
      return {
        ...state,
        createStatus: 'error',
        createError: action.payload.error,
        createValidationErrors: action.payload.validationErrors ?? [],
      }
    case POST_EDIT_RESET:
      return {
        ...state,
        editPost: null,
        editStatus: 'idle',
        editError: null,
        editValidationErrors: [],
      }
    default:
      return state
  }
}
