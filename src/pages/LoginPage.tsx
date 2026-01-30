import { useState } from 'react'
import type { FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { RootState } from '../app/rootReducer'
import { loginRequest } from '../features/auth/actions'

export function LoginPage() {
  const dispatch = useDispatch()
  const authState = useSelector((state: RootState) => state.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    dispatch(loginRequest({ email, password }))
  }

  return (
    <div style={{ padding: 16, maxWidth: 360 }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: 4 }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: 4 }}
              required
            />
          </label>
        </div>

        <button type="submit" disabled={authState.status === 'loading'}>
          {authState.status === 'loading' ? 'Вход...' : 'Войти'}
        </button>
      </form>

      {authState.status === 'error' && authState.error && (
        <p style={{ color: 'red', marginTop: 8 }}>{authState.error}</p>
      )}

      {authState.status === 'authenticated' && (
        <p style={{ color: 'green', marginTop: 8 }}>Успешная авторизация (пока фейк).</p>
      )}
    </div>
  )
}

