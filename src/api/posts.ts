import { authorizedFetch } from './client'
import { SystemError } from './auth'

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
