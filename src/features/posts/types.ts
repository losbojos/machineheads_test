import type { Post, PaginationInfo, PostDetail } from '../../api/posts'

export interface ValidationErrorItem {
  field: string
  message: string
}

export interface PostsState {
  items: Post[]
  pagination: PaginationInfo
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
  createStatus: 'idle' | 'loading' | 'success' | 'error'
  createError: string | null
  createValidationErrors: ValidationErrorItem[]
  editPost: PostDetail | null
  editStatus: 'idle' | 'loading' | 'success' | 'error'
  editError: string | null
  editValidationErrors: ValidationErrorItem[]
}
