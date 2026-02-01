import type { Post, PaginationInfo } from '../../api/posts'

export interface PostsState {
  items: Post[]
  pagination: PaginationInfo
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
}
