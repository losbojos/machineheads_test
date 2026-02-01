import type { TagsState } from './types'
import type { TagsAction } from './actions'
import {
  TAGS_FETCH,
  TAGS_FETCH_SUCCESS,
  TAGS_FETCH_FAILURE,
  TAG_CREATE,
  TAG_CREATE_SUCCESS,
  TAG_CREATE_FAILURE,
  TAG_CREATE_RESET,
  TAG_FETCH_ONE,
  TAG_FETCH_ONE_SUCCESS,
  TAG_FETCH_ONE_FAILURE,
  TAG_UPDATE,
  TAG_UPDATE_SUCCESS,
  TAG_UPDATE_FAILURE,
  TAG_EDIT_RESET,
} from './actions'

const initialState: TagsState = {
  items: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  createError: null,
  createValidationErrors: [],
  editTag: null,
  editStatus: 'idle',
  editError: null,
  editValidationErrors: [],
}

export function tagsReducer(
  state: TagsState = initialState,
  action: TagsAction,
): TagsState {
  switch (action.type) {
    case TAGS_FETCH:
      return {
        ...state,
        status: 'loading',
        error: null,
      }
    case TAGS_FETCH_SUCCESS:
      return {
        ...state,
        items: action.payload.items,
        status: 'success',
        error: null,
      }
    case TAGS_FETCH_FAILURE:
      return {
        ...state,
        status: 'error',
        error: action.payload.error,
      }
    case TAG_CREATE:
      return {
        ...state,
        createStatus: 'loading',
        createError: null,
        createValidationErrors: [],
      }
    case TAG_CREATE_SUCCESS:
      return {
        ...state,
        createStatus: 'success',
        createError: null,
        createValidationErrors: [],
      }
    case TAG_CREATE_FAILURE:
      return {
        ...state,
        createStatus: 'error',
        createError: action.payload.error,
        createValidationErrors: action.payload.validationErrors ?? [],
      }
    case TAG_CREATE_RESET:
      return {
        ...state,
        createStatus: 'idle',
        createError: null,
        createValidationErrors: [],
      }
    case TAG_FETCH_ONE:
      return {
        ...state,
        editStatus: 'loading',
        editTag: null,
        editError: null,
      }
    case TAG_FETCH_ONE_SUCCESS:
      return {
        ...state,
        editStatus: 'success',
        editTag: action.payload.tag,
        editError: null,
      }
    case TAG_FETCH_ONE_FAILURE:
      return {
        ...state,
        editStatus: 'error',
        editError: action.payload.error,
      }
    case TAG_UPDATE:
      return {
        ...state,
        createStatus: 'loading',
        createError: null,
        createValidationErrors: [],
      }
    case TAG_UPDATE_SUCCESS:
      return {
        ...state,
        createStatus: 'success',
        createError: null,
        createValidationErrors: [],
      }
    case TAG_UPDATE_FAILURE:
      return {
        ...state,
        createStatus: 'error',
        createError: action.payload.error,
        createValidationErrors: action.payload.validationErrors ?? [],
      }
    case TAG_EDIT_RESET:
      return {
        ...state,
        editTag: null,
        editStatus: 'idle',
        editError: null,
        editValidationErrors: [],
      }
    default:
      return state
  }
}
