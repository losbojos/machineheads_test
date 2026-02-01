import type { AuthorsState } from './types'
import type { AuthorsAction } from './actions'
import {
  AUTHORS_FETCH,
  AUTHORS_FETCH_SUCCESS,
  AUTHORS_FETCH_FAILURE,
  AUTHOR_CREATE,
  AUTHOR_CREATE_SUCCESS,
  AUTHOR_CREATE_FAILURE,
  AUTHOR_CREATE_RESET,
  AUTHOR_FETCH_ONE,
  AUTHOR_FETCH_ONE_SUCCESS,
  AUTHOR_FETCH_ONE_FAILURE,
  AUTHOR_UPDATE,
  AUTHOR_UPDATE_SUCCESS,
  AUTHOR_UPDATE_FAILURE,
  AUTHOR_EDIT_RESET,
} from './actions'

const initialState: AuthorsState = {
  items: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  createError: null,
  createValidationErrors: [],
  editAuthor: null,
  editStatus: 'idle',
  editError: null,
  editValidationErrors: [],
}

export function authorsReducer(
  state: AuthorsState = initialState,
  action: AuthorsAction,
): AuthorsState {
  switch (action.type) {
    case AUTHORS_FETCH:
      return {
        ...state,
        status: 'loading',
        error: null,
      }
    case AUTHORS_FETCH_SUCCESS:
      return {
        ...state,
        items: action.payload.items,
        status: 'success',
        error: null,
      }
    case AUTHORS_FETCH_FAILURE:
      return {
        ...state,
        status: 'error',
        error: action.payload.error,
      }
    case AUTHOR_CREATE:
      return {
        ...state,
        createStatus: 'loading',
        createError: null,
        createValidationErrors: [],
      }
    case AUTHOR_CREATE_SUCCESS:
      return {
        ...state,
        createStatus: 'success',
        createError: null,
        createValidationErrors: [],
      }
    case AUTHOR_CREATE_FAILURE:
      return {
        ...state,
        createStatus: 'error',
        createError: action.payload.error,
        createValidationErrors: action.payload.validationErrors ?? [],
      }
    case AUTHOR_CREATE_RESET:
      return {
        ...state,
        createStatus: 'idle',
        createError: null,
        createValidationErrors: [],
      }
    case AUTHOR_FETCH_ONE:
      return {
        ...state,
        editStatus: 'loading',
        editAuthor: null,
        editError: null,
      }
    case AUTHOR_FETCH_ONE_SUCCESS:
      return {
        ...state,
        editStatus: 'success',
        editAuthor: action.payload.author,
        editError: null,
      }
    case AUTHOR_FETCH_ONE_FAILURE:
      return {
        ...state,
        editStatus: 'error',
        editError: action.payload.error,
      }
    case AUTHOR_UPDATE:
      return {
        ...state,
        createStatus: 'loading',
        createError: null,
        createValidationErrors: [],
      }
    case AUTHOR_UPDATE_SUCCESS:
      return {
        ...state,
        createStatus: 'success',
        createError: null,
        createValidationErrors: [],
      }
    case AUTHOR_UPDATE_FAILURE:
      return {
        ...state,
        createStatus: 'error',
        createError: action.payload.error,
        createValidationErrors: action.payload.validationErrors ?? [],
      }
    case AUTHOR_EDIT_RESET:
      return {
        ...state,
        editAuthor: null,
        editStatus: 'idle',
        editError: null,
        editValidationErrors: [],
      }
    default:
      return state
  }
}
