import { authorizedFetch } from './client'
import { SystemError, ValidationError, type SystemErrorResponse } from './auth'

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

export interface CreateAuthorParams {
  name: string
  lastName: string
  secondName: string
  avatar?: File | null
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

export async function fetchAuthor(id: number): Promise<Author> {
  const response = await authorizedFetch(`/manage/authors/detail?id=${id}`)
  if (!response.ok) {
    const json = await response.json()
    throw new SystemError(json as SystemErrorResponse)
  }
  return response.json()
}

export async function createAuthor(params: CreateAuthorParams): Promise<number> {
  const formData = new FormData()
  formData.append('name', params.name)
  formData.append('lastName', params.lastName)
  formData.append('secondName', params.secondName)
  if (params.avatar) {
    formData.append('avatar', params.avatar)
  }

  const response = await authorizedFetch('/manage/authors/add/', {
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

export async function updateAuthor(
  id: number,
  params: CreateAuthorParams,
): Promise<boolean> {
  const formData = new FormData()
  formData.append('name', params.name)
  formData.append('lastName', params.lastName)
  formData.append('secondName', params.secondName)
  if (params.avatar) {
    formData.append('avatar', params.avatar)
  }

  const response = await authorizedFetch(`/manage/authors/edit?id=${id}`, {
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

export async function deleteAuthor(id: number): Promise<boolean> {
  const response = await authorizedFetch(`/manage/authors/remove?id=${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const json = await response.json()
    throw new SystemError(json as SystemErrorResponse)
  }

  const data = await response.json()
  return data === true
}
