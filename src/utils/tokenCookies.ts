import type { TokenResponse } from '../api/auth'

const ACCESS_TOKEN_COOKIE = 'access_token'
const REFRESH_TOKEN_COOKIE = 'refresh_token'

function setCookie(name: string, value: string, maxAgeSeconds?: number) {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/`
  if (typeof maxAgeSeconds === 'number') {
    cookie += `; max-age=${Math.max(0, Math.floor(maxAgeSeconds))}`
  }
  document.cookie = cookie
}

export function saveTokensToCookies(tokens: TokenResponse) {
  // Для простоты считаем, что *_expired_at — это UNIX timestamp в секундах.
  const nowSeconds = Math.floor(Date.now() / 1000)

  const accessMaxAge = tokens.access_expired_at - nowSeconds
  const refreshMaxAge = tokens.refresh_expired_at - nowSeconds

  setCookie(ACCESS_TOKEN_COOKIE, tokens.access_token, accessMaxAge)
  setCookie(REFRESH_TOKEN_COOKIE, tokens.refresh_token, refreshMaxAge)
}

export function clearTokensFromCookies() {
  setCookie(ACCESS_TOKEN_COOKIE, '', 0)
  setCookie(REFRESH_TOKEN_COOKIE, '', 0)
}

