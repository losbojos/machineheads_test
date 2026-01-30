import type { LoginCredentials } from '../features/auth/types'

const API_BASE_URL = 'http://rest-test.machineheads.ru'

export interface TokenResponse {
  access_token: string
  refresh_token: string
  access_expired_at: number
  refresh_expired_at: number
}

export interface ValidationErrorItem {
  field: string
  message: string
}

export interface SystemErrorResponse {
  name: string
  message: string
  code: number
  status: number
  type: string
}

export class ValidationError extends Error {
  public readonly items: ValidationErrorItem[]

  constructor(items: ValidationErrorItem[]) {
    super('Validation error')
    this.items = items
  }
}

export class SystemError extends Error {
  public readonly response: SystemErrorResponse

  constructor(response: SystemErrorResponse) {
    super(response.message)
    this.response = response
  }
}

export async function login(credentials: LoginCredentials): Promise<TokenResponse> {
  const formData = new FormData()
  formData.append('email', credentials.email)
  formData.append('password', credentials.password)

  const response = await fetch(`${API_BASE_URL}/auth/token-generate`, {
    method: 'POST',
    body: formData,
  })

  const json = await response.json()

  if (response.ok) {
    return json as TokenResponse
  }

  if (response.status === 422) {
    throw new ValidationError(json as ValidationErrorItem[])
  }

  throw new SystemError(json as SystemErrorResponse)
}

