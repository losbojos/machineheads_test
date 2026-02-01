import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'

import type { RootState } from '../app/rootReducer'
import { postsFetch } from '../features/posts/actions'
import { logout } from '../features/auth/actions'
import type { Post } from '../api/posts'

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}

export function PostsPage() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { items, pagination, status, error } = useSelector(
    (state: RootState) => state.posts,
  )

  const page = new URLSearchParams(location.search).get('page')
  const currentPage = Math.max(1, parseInt(page ?? '1', 10))

  useEffect(() => {
    dispatch(postsFetch({ page: currentPage, limit: pagination.limit }))
  }, [dispatch, currentPage, pagination.limit])

  const handleLogout = () => {
    dispatch(logout())
  }

  const totalPages = Math.max(1, pagination.totalPages)
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <div style={{ padding: 16, maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Посты</h2>
        <button type="button" onClick={handleLogout}>
          Выйти
        </button>
      </div>

      {status === 'loading' && <p>Загрузка...</p>}
      {status === 'error' && error && (
        <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>
      )}

      {status === 'success' && items.length === 0 && (
        <p>Нет постов</p>
      )}

      {status === 'success' && items.length > 0 && (
        <>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((post: Post) => (
              <li
                key={post.id}
                style={{
                  border: '1px solid #444',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <h3 style={{ margin: '0 0 8px' }}>{post.title}</h3>
                <p style={{ margin: '0 0 4px', fontSize: 14, color: '#888' }}>
                  {post.authorName} · {formatDate(post.updatedAt)}
                </p>
                {post.tagNames.length > 0 && (
                  <p style={{ margin: '0 0 4px', fontSize: 12 }}>
                    {post.tagNames.join(', ')}
                  </p>
                )}
                {post.previewPicture?.url && (
                  <img
                    src={post.previewPicture.url}
                    alt={post.previewPicture.name}
                    style={{ maxWidth: 200, marginTop: 8, borderRadius: 4 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <nav style={{ marginTop: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
            {hasPrev && (
              <Link
                to={`/posts?page=${currentPage - 1}`}
                style={{ padding: '4px 12px', border: '1px solid #646cff', borderRadius: 4 }}
              >
                ← Назад
              </Link>
            )}
            <span>
              Страница {currentPage} из {totalPages} · всего {pagination.total} {pagination.total === 1 ? 'пост' : pagination.total < 5 ? 'поста' : 'постов'}
            </span>
            {hasNext && (
              <Link
                to={`/posts?page=${currentPage + 1}`}
                style={{ padding: '4px 12px', border: '1px solid #646cff', borderRadius: 4 }}
              >
                Вперёд →
              </Link>
            )}
          </nav>
        </>
      )}
    </div>
  )
}
