import type { ComponentType } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { getAccessTokenFromCookies } from '../utils/tokenCookies'

interface PrivateRouteProps {
  component: ComponentType<any>
  path: string
  exact?: boolean
}

/**
 * Защищённый маршрут: редирект на /login, если нет токена в cookies.
 */
export function PrivateRoute({ component: Component, ...rest }: PrivateRouteProps) {
  const isAuthenticated = !!getAccessTokenFromCookies()

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  )
}
