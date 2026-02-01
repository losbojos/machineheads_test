import { authorizedFetch } from './client'
import { SystemError } from './auth'

export interface AuthorAvatar {
  id: number
  name: string
  url: string
}

export interface Author {
  id: number
  name: string
  lastName: string
  secondName: string
  avatar: AuthorAvatar | null
  updatedAt: string
  createdAt: string
}

export async function fetchAuthors(): Promise<Author[]> {
  const response = await authorizedFetch('/manage/authors')
  if (!response.ok) {
    throw new SystemError({
      name: 'FetchError',
      message: `Authors fetch failed: ${response.status}`,
      code: response.status,
      status: response.status,
      type: 'unknown',
    })
  }
  return response.json()
}
