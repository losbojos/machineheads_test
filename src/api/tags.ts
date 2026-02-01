import { authorizedFetch } from './client'
import { SystemError } from './auth'

export interface Tag {
  id: number
  name: string
  code: string
  sort: number
  updatedAt: string
  createdAt: string
}

export async function fetchTags(): Promise<Tag[]> {
  const response = await authorizedFetch('/manage/tags')
  if (!response.ok) {
    throw new SystemError({
      name: 'FetchError',
      message: `Tags fetch failed: ${response.status}`,
      code: response.status,
      status: response.status,
      type: 'unknown',
    })
  }
  return response.json()
}
