import { Link } from 'react-router-dom'

export function PostsPage() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Posts</h2>
      <p>Здесь будет список постов + пагинация из заголовков ответа.</p>
      <p>
        Вернуться на <Link to="/login">/login</Link>
      </p>
    </div>
  )
}

