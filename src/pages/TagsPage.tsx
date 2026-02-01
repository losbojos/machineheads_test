import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Layout, Card, List, Button, Space, Typography, Modal } from 'antd'
import { PlusOutlined, LogoutOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import type { RootState } from '../app/rootReducer'
import { tagsFetch, tagDelete } from '../features/tags/actions'
import { logout } from '../features/auth/actions'
import type { Tag } from '../api/tags'

const { Header, Content } = Layout
const { Text } = Typography

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}

export function TagsPage() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state: RootState) => state.tags)

  useEffect(() => {
    dispatch(tagsFetch())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleDelete = (tag: Tag) => {
    Modal.confirm({
      title: 'Удалить тег?',
      content: `Тег «${tag.name}» будет удалён.`,
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: () => dispatch(tagDelete(tag.id)),
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
          <Link to="/authors">
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16 }}>Авторы</Text>
          </Link>
          <Text style={{ color: '#69c0ff', fontSize: 18, fontWeight: 600 }}>Теги</Text>
        </Space>
        <Space size="small" wrap>
          <Link to="/tags/add">
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
            <Text>Нет тегов</Text>
          </Card>
        )}

        {status === 'success' && items.length > 0 && (
          <List
            itemLayout="horizontal"
            dataSource={items}
            renderItem={(tag: Tag) => (
              <List.Item
                key={tag.id}
                actions={[
                  <Link key="edit" to={`/tags/edit/${tag.id}`}>
                    <Button type="link" icon={<EditOutlined />} size="small" title="Редактировать" />
                  </Link>,
                  <Button
                    key="delete"
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    title="Удалить"
                    onClick={() => handleDelete(tag)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Link to={`/tags/edit/${tag.id}`}>
                      {tag.name}
                    </Link>
                  }
                  description={
                    <Space wrap size={[12, 4]}>
                      <Text type="secondary">код: {tag.code}</Text>
                      <Text type="secondary">сорт: {tag.sort}</Text>
                      <Text type="secondary">обновлён: {formatDate(tag.updatedAt)}</Text>
                    </Space>
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
