import type { Plugin } from 'vite'

const API_BASE = 'https://rest-test.machineheads.ru'
const POST_PATHS_FOLLOW_REDIRECTS = [
  '/api/auth/token-generate/', '/api/auth/token-generate',
  '/api/auth/token-refresh/', '/api/auth/token-refresh',
  '/api/manage/posts/add/', '/api/manage/posts/add',
  '/api/manage/posts/edit/', '/api/manage/posts/edit',
  '/api/manage/authors/add/', '/api/manage/authors/add',
  '/api/manage/authors/edit/', '/api/manage/authors/edit',
  '/api/manage/tags/add/', '/api/manage/tags/add',
  '/api/manage/tags/edit/', '/api/manage/tags/edit',
]

/**
 * Прокси для auth-эндпоинтов, который следует редиректам с сохранением метода POST.
 * Стандартный Vite proxy передаёт 301/302 в браузер, браузер меняет POST→GET.
 */
export function authProxyPlugin(): Plugin {
  return {
    name: 'auth-proxy-follow-redirects',
    configureServer(server) {
      const authHandler = async (req: any, res: any, next: () => void) => {
        const path = req.url?.split('?')[0] ?? ''
        if (req.method !== 'POST' || !POST_PATHS_FOLLOW_REDIRECTS.includes(path)) {
          return next()
        }

        const targetPath = path.replace(/^\/api/, '')
        let targetUrl = `${API_BASE}${targetPath}`
        if (req.url?.includes('?')) {
          targetUrl += '?' + req.url.split('?')[1]
        }

        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) {
            chunks.push(Buffer.from(chunk))
          }
          const body = Buffer.concat(chunks)

          const headers: Record<string, string> = {}
          for (const [key, value] of Object.entries(req.headers)) {
            if (value != null && !['host', 'connection'].includes(key.toLowerCase())) {
              headers[key] = Array.isArray(value) ? value.join(', ') : String(value)
            }
          }

          let response = await fetch(targetUrl, {
            method: 'POST',
            body,
            headers,
            redirect: 'manual',
          })

          let redirectCount = 0
          const maxRedirects = 5
          while (response.status >= 300 && response.status < 400 && redirectCount < maxRedirects) {
            const location = response.headers.get('location')
            if (!location) break
            targetUrl = new URL(location, targetUrl).href
            response = await fetch(targetUrl, {
              method: 'POST',
              body,
              headers,
              redirect: 'manual',
            })
            redirectCount++
          }

          res.statusCode = response.status
          response.headers.forEach((value, key) => {
            res.setHeader(key, value)
          })
          const data = await response.arrayBuffer()
          res.end(Buffer.from(data))
        } catch (err) {
          console.error('[auth-proxy]', err)
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Proxy error' }))
        }
      }
      // Добавляем в начало стека, чтобы обработать до стандартного proxy
      ;(server.middlewares as any).stack.unshift({ route: '', handle: authHandler })
    },
  }
}
