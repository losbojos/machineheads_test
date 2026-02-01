import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { Layout, Card, List, Button, Pagination, Space, Typography, Image, Modal } from 'antd'
import { PlusOutlined, LogoutOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import type { RootState } from '../app/rootReducer'
import { postsFetch, postDelete } from '../features/posts/actions'
import { logout } from '../features/auth/actions'
import type { Post } from '../api/posts'

const { Header, Content } = Layout
const { Text } = Typography

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}

export function PostsPage() {
  const dispatch = useDispatch()
  const history = useHistory()
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

  const handleDelete = (post: Post) => {
    Modal.confirm({
      title: 'Удалить пост?',
      content: `Пост «${post.title}» будет удалён.`,
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: () => dispatch(postDelete(post.id)),
    })
  }

  const handlePageChange = (pageNum: number) => {
    history.push(`/posts?page=${pageNum}`)
  }

  const totalPages = Math.max(1, pagination.totalPages)
  const postWord = pagination.total === 1 ? 'пост' : pagination.total < 5 ? 'поста' : 'постов'

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#001529',
          padding: '0 24px',
        }}
      >
        <Space>
          <Text style={{ color: '#fff', fontSize: 18 }}>Посты</Text>
          <Link to="/authors">
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>Авторы</Text>
          </Link>
        </Space>
        <Space>
          <Link to="/posts/add">
            <Button type="primary" icon={<PlusOutlined />}>
              Добавить пост
            </Button>
          </Link>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Выйти
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: 24, maxWidth: 900, margin: '0 auto', width: '100%' }}>
        {status === 'loading' && (
          <Card loading style={{ minHeight: 200 }} />
        )}

        {status === 'error' && error && (
          <Card>
            <Text type="danger">{error}</Text>
          </Card>
        )}

        {status === 'success' && items.length === 0 && (
          <Card>
            <Text>Нет постов</Text>
          </Card>
        )}

        {status === 'success' && items.length > 0 && (
          <>
            <List
              itemLayout="vertical"
              dataSource={items}
              renderItem={(post) => (
                <List.Item
                  key={post.id}
                  actions={[
                    <Link key="edit" to={`/posts/edit/${post.id}`}>
                      <Button type="link" icon={<EditOutlined />} size="small">
                        Редактировать
                      </Button>
                    </Link>,
                    <Button
                      key="delete"
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => handleDelete(post)}
                    >
                      Удалить
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Link to={`/posts/edit/${post.id}`}>
                        {post.title}
                      </Link>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">
                          {post.authorName} · {formatDate(post.updatedAt)}
                        </Text>
                        {post.tagNames.length > 0 && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {post.tagNames.join(', ')}
                          </Text>
                        )}
                      </Space>
                    }
                  />
                  {post.previewPicture?.url && (
                    <Image
                      src={post.previewPicture.url}
                      alt={post.previewPicture.name}
                      width={200}
                      style={{ borderRadius: 8, marginTop: 8 }}
                    />
                  )}
                </List.Item>
              )}
            />

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Pagination
                current={currentPage}
                total={pagination.total}
                pageSize={pagination.limit}
                showSizeChanger={false}
                showTotal={(total) => `Страница ${currentPage} из ${totalPages} · всего ${total} ${postWord}`}
                onChange={handlePageChange}
              />
            </div>
          </>
        )}
      </Content>
    </Layout>
  )
}
