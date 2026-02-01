import { authorizedFetch } from './client'
import { SystemError, ValidationError, type SystemErrorResponse } from './auth'

export interface PreviewPicture {
  id: number
  name: string
  url: string
}

export interface Post {
  id: number
  title: string
  code: string
  authorName: string
  previewPicture: PreviewPicture | null
  tagNames: string[]
  updatedAt: string
  createdAt: string
}

export interface PostsListParams {
  page?: number
  limit?: number
}

export interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PostsListResponse {
  items: Post[]
  pagination: PaginationInfo
}

/**
 * Парсит пагинацию из заголовков ответа API.
 * Заголовки: X-Pagination-Current-Page, X-Pagination-Page-Count,
 * X-Pagination-Per-Page, X-Pagination-Total-Count
 */
function parsePaginationFromHeaders(
  response: Response,
  defaultPage = 1,
  defaultLimit = 10,
): PaginationInfo {
  const total = parseInt(response.headers.get('X-Pagination-Total-Count') ?? '0', 10)
  const page = parseInt(response.headers.get('X-Pagination-Current-Page') ?? String(defaultPage), 10)
  const limit = parseInt(response.headers.get('X-Pagination-Per-Page') ?? String(defaultLimit), 10)
  const totalPages = parseInt(response.headers.get('X-Pagination-Page-Count') ?? '1', 10)

  return {
    total,
    page: page > 0 ? page : defaultPage,
    limit: limit > 0 ? limit : defaultLimit,
    totalPages: totalPages > 0 ? totalPages : Math.ceil(total / limit) || 1,
  }
}

export async function fetchPosts(
  params: PostsListParams = {},
): Promise<PostsListResponse> {
  const page = params.page ?? 1
  const limit = params.limit ?? 10

  const searchParams = new URLSearchParams()
  searchParams.set('page', String(page))
  searchParams.set('limit', String(limit))

  const response = await authorizedFetch(
    `/manage/posts?${searchParams.toString()}`,
  )

  if (!response.ok) {
    throw new SystemError({
      name: 'FetchError',
      message: `Posts fetch failed: ${response.status}`,
      code: response.status,
      status: response.status,
      type: 'unknown',
    })
  }

  const items = (await response.json()) as Post[]
  let pagination = parsePaginationFromHeaders(response, page, limit)

  // Если заголовки не переданы — используем данные из запроса
  if (pagination.total === 0 && items.length > 0) {
    pagination = {
      ...pagination,
      total: items.length,
      totalPages: 1,
    }
  }

  return { items, pagination }
}

export interface CreatePostParams {
  code: string
  title: string
  authorId: number
  tagIds: number[]
  text: string
  previewPicture?: File | null
}

export interface PostEditData extends CreatePostParams {
  id: number
}

export interface PostDetailAuthor {
  id: number
  fullName: string
  avatar?: PreviewPicture
}

export interface PostDetailTag {
  id: number
  name: string
  code: string
}

export interface PostDetail {
  id: number
  title: string
  code: string
  text: string
  previewPicture: PreviewPicture | null
  author: PostDetailAuthor
  tags: PostDetailTag[]
  updatedAt: string
  createdAt: string
}

export async function createPost(params: CreatePostParams): Promise<number> {
  const formData = new FormData()
  formData.append('code', params.code)
  formData.append('title', params.title)
  formData.append('authorId', String(params.authorId))
  params.tagIds.forEach((id) => formData.append('tagIds[]', String(id)))
  formData.append('text', params.text)
  if (params.previewPicture) {
    formData.append('previewPicture', params.previewPicture)
  }

  const response = await authorizedFetch('/manage/posts/add/', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const json = await response.json()
    if (response.status === 422) {
      throw new ValidationError(json as { field: string; message: string }[])
    }
    throw new SystemError(json as SystemErrorResponse)
  }

  const data = await response.json()
  if (typeof data === 'number') return data
  if (data?.id != null) return Number(data.id)
  return Number(data)
}

export async function fetchPost(id: number): Promise<PostDetail> {
  const response = await authorizedFetch(`/manage/posts/detail?id=${id}`)
  if (!response.ok) {
    const json = await response.json()
    throw new SystemError(json as SystemErrorResponse)
  }
  return response.json()
}

export async function updatePost(
  id: number,
  params: CreatePostParams,
): Promise<boolean> {
  const formData = new FormData()
  formData.append('code', params.code)
  formData.append('title', params.title)
  formData.append('authorId', String(params.authorId))
  params.tagIds.forEach((tid) => formData.append('tagIds[]', String(tid)))
  formData.append('text', params.text)
  if (params.previewPicture) {
    formData.append('previewPicture', params.previewPicture)
  }

  const response = await authorizedFetch(`/manage/posts/edit?id=${id}`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const json = await response.json()
    if (response.status === 422) {
      throw new ValidationError(json as { field: string; message: string }[])
    }
    throw new SystemError(json as SystemErrorResponse)
  }

  const data = await response.json()
  return data === true
}

export async function deletePost(id: number): Promise<boolean> {
  const response = await authorizedFetch(`/manage/posts/remove?id=${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const json = await response.json()
    throw new SystemError(json as SystemErrorResponse)
  }

  const data = await response.json()
  return data === true
}
