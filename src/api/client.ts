import { API_BASE_URL, SystemError, ValidationError, type SystemErrorResponse, type ValidationErrorItem, type TokenResponse, refreshToken } from './auth'

function parseValidationErrors(json: unknown): ValidationErrorItem[] {
  if (Array.isArray(json)) {
    return json
      .filter((x): x is { field?: string; message?: string } => x && typeof x === 'object')
      .map((x) => ({ field: String(x.field ?? 'unknown'), message: String(x.message ?? 'Ошибка') }))
  }
  if (json && typeof json === 'object') {
    const obj = json as Record<string, unknown>
    if (obj.detail && Array.isArray(obj.detail)) {
      return (obj.detail as Array<{ loc?: string[]; msg?: string }>).map((d) => ({
        field: Array.isArray(d.loc) ? String(d.loc[d.loc.length - 1] ?? 'unknown') : 'unknown',
        message: String(d.msg ?? 'Ошибка'),
      }))
    }
    if (obj.errors && typeof obj.errors === 'object') {
      const errs = obj.errors as Record<string, string[]>
      return Object.entries(errs).flatMap(([field, msgs]) =>
        (Array.isArray(msgs) ? msgs : [msgs]).map((msg) => ({
          field,
          message: String(msg),
        })),
      )
    }
    if ('field' in obj && 'message' in obj) {
      return [{ field: String(obj.field), message: String(obj.message) }]
    }
    if ('message' in obj) {
      return [{ field: 'form', message: String(obj.message) }]
    }
  }
  return [{ field: 'unknown', message: 'Ошибка валидации' }]
}
import {
  clearTokensFromCookies,
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  saveTokensToCookies,
} from '../utils/tokenCookies'

export interface AuthorizedFetchOptions extends RequestInit {
  // Можно передать относительный путь без BASE_URL
  useBaseUrl?: boolean
}

async function doFetch(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init)

  if (response.ok) {
    return response
  }

  let json: unknown
  try {
    json = await response.json()
  } catch {
    throw new SystemError({
      name: 'UnknownError',
      message: `Request failed with status ${response.status}`,
      code: response.status,
      status: response.status,
      type: 'unknown',
    })
  }

  if (response.status === 422) {
    throw new ValidationError(parseValidationErrors(json))
  }

  throw new SystemError(json as SystemErrorResponse)
}

/**
 * Обёртка над fetch, автоматически добавляющая Bearer токен
 * и выполняющая refresh по 401 (одна попытка).
 */
export async function authorizedFetch(
  input: string,
  options: AuthorizedFetchOptions = {},
): Promise<Response> {
  const { useBaseUrl = true, headers, ...restOptions } = options

  const url = useBaseUrl ? `${API_BASE_URL}${input}` : input

  const accessToken = getAccessTokenFromCookies()
  const authHeaders = new Headers(headers as HeadersInit | undefined)

  if (accessToken) {
    authHeaders.set('Authorization', `Bearer ${accessToken}`)
  }

  try {
    const response = await doFetch(url, {
      ...restOptions,
      headers: authHeaders,
    })

    return response
  } catch (error) {
    // Если не SystemError — пробрасываем как есть
    if (!(error instanceof SystemError)) {
      throw error
    }

    // Если не 401 — тоже просто пробрасываем
    if (error.response.status !== 401) {
      throw error
    }

    const refreshTokenValue = getRefreshTokenFromCookies()
    if (!refreshTokenValue) {
      clearTokensFromCookies()
      throw error
    }

    // Пытаемся обновить токены
    let newTokens: TokenResponse
    try {
      newTokens = await refreshToken(refreshTokenValue)
      saveTokensToCookies(newTokens)
    } catch (refreshError) {
      clearTokensFromCookies()
      // Если refresh не удался — пробрасываем исходную или новую ошибку
      if (refreshError instanceof Error) {
        throw refreshError
      }
      throw error
    }

    const retryHeaders = new Headers(headers as HeadersInit | undefined)
    retryHeaders.set('Authorization', `Bearer ${newTokens.access_token}`)

    // Повторяем исходный запрос с новым access токеном
    return doFetch(url, {
      ...restOptions,
      headers: retryHeaders,
    })
  }
}

