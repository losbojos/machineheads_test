import { Link } from 'react-router-dom'

export function LoginPage() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Login</h2>
      <p>Здесь будет форма авторизации (email/password) и обработка ошибок.</p>
      <p>
        Пока просто ссылка на <Link to="/posts">/posts</Link> (позже закроем роут
        авторизацией).
      </p>
    </div>
  )
}

