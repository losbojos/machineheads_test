import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Layout, Card, List, Button, Space, Typography, Image, Modal } from 'antd'
import { PlusOutlined, LogoutOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import type { RootState } from '../app/rootReducer'
import { authorsFetch, authorDelete } from '../features/authors/actions'
import { logout } from '../features/auth/actions'
import type { Author } from '../api/authors'

const { Header, Content } = Layout
const { Text } = Typography

function getAuthorDisplayName(a: Author): string {
  return [a.lastName, a.name, a.secondName].filter(Boolean).join(' ').trim() || String(a.id)
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}

export function AuthorsPage() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state: RootState) => state.authors)

  useEffect(() => {
    dispatch(authorsFetch())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleDelete = (author: Author) => {
    const name = getAuthorDisplayName(author)
    Modal.confirm({
      title: 'Удалить автора?',
      content: `Автор «${name}» будет удалён.`,
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: () => dispatch(authorDelete(author.id)),
    })
  }

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          background: '#001529',
          padding: '12px 16px',
          minHeight: 64,
          height: 'auto',
        }}
      >
        <Space size="middle" wrap>
          <Link to="/posts">
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16 }}>Посты</Text>
          </Link>
          <Text style={{ color: '#69c0ff', fontSize: 18, fontWeight: 600 }}>Авторы</Text>
          <Link to="/tags">
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16 }}>Теги</Text>
          </Link>
        </Space>
        <Space size="small" wrap>
          <Link to="/authors/add">
            <Button type="primary" icon={<PlusOutlined />} size="small">
              Добавить
            </Button>
          </Link>
          <Button icon={<LogoutOutlined />} onClick={handleLogout} size="small">
            Выйти
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '16px 24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
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
            <Text>Нет авторов</Text>
          </Card>
        )}

        {status === 'success' && items.length > 0 && (
          <List
            itemLayout="horizontal"
            dataSource={items}
            renderItem={(author: Author) => (
              <List.Item
                key={author.id}
                actions={[
                  <Link key="edit" to={`/authors/edit/${author.id}`}>
                    <Button type="link" icon={<EditOutlined />} size="small" title="Редактировать" />
                  </Link>,
                  <Button
                    key="delete"
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    title="Удалить"
                    onClick={() => handleDelete(author)}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    author.avatar?.url ? (
                      <Image
                        src={author.avatar.url}
                        alt={author.avatar.name}
                        width={48}
                        height={48}
                        style={{ borderRadius: 8, objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          background: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text type="secondary">—</Text>
                      </div>
                    )
                  }
                  title={
                    <Link to={`/authors/edit/${author.id}`}>
                      {getAuthorDisplayName(author)}
                    </Link>
                  }
                  description={
                    <Text type="secondary">
                      Обновлён: {formatDate(author.updatedAt)}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Content>
    </Layout>
  )
}
