import { authorizedFetch } from './client'
import { SystemError, ValidationError, type SystemErrorResponse } from './auth'

export interface Tag {
  id: number
  name: string
  code: string
  sort: number
  updatedAt: string
  createdAt: string
}

export interface CreateTagParams {
  name: string
  code: string
  sort?: number
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

export async function fetchTag(id: number): Promise<Tag> {
  const response = await authorizedFetch(`/manage/tags/detail?id=${id}`)
  if (!response.ok) {
    const json = await response.json()
    throw new SystemError(json as SystemErrorResponse)
  }
  return response.json()
}

export async function createTag(params: CreateTagParams): Promise<number> {
  const formData = new FormData()
  formData.append('name', params.name)
  formData.append('code', params.code)
  formData.append('sort', String(params.sort ?? 0))

  const response = await authorizedFetch('/manage/tags/add/', {
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

export async function updateTag(
  id: number,
  params: CreateTagParams,
): Promise<boolean> {
  const formData = new FormData()
  formData.append('name', params.name)
  formData.append('code', params.code)
  formData.append('sort', String(params.sort ?? 0))

  const response = await authorizedFetch(`/manage/tags/edit?id=${id}`, {
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

export async function deleteTag(id: number): Promise<boolean> {
  const response = await authorizedFetch(`/manage/tags/remove?id=${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const json = await response.json()
    throw new SystemError(json as SystemErrorResponse)
  }

  const data = await response.json()
  return data === true
}
