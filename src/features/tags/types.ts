import type { Tag } from '../../api/tags'

export interface ValidationErrorItem {
  field: string
  message: string
}

export interface TagsState {
  items: Tag[]
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
  createStatus: 'idle' | 'loading' | 'success' | 'error'
  createError: string | null
  createValidationErrors: ValidationErrorItem[]
  editTag: Tag | null
  editStatus: 'idle' | 'loading' | 'success' | 'error'
  editError: string | null
  editValidationErrors: ValidationErrorItem[]
}
