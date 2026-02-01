import type { Author } from '../../api/authors'

export interface ValidationErrorItem {
  field: string
  message: string
}

export interface AuthorsState {
  items: Author[]
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
  createStatus: 'idle' | 'loading' | 'success' | 'error'
  createError: string | null
  createValidationErrors: ValidationErrorItem[]
  editAuthor: Author | null
  editStatus: 'idle' | 'loading' | 'success' | 'error'
  editError: string | null
  editValidationErrors: ValidationErrorItem[]
}
