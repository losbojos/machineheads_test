import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Card, Form, Input, Button, Space, Typography, Image, Spin, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import type { RootState } from '../app/rootReducer'
import {
  authorFetchOne,
  authorUpdate,
  authorEditReset,
} from '../features/authors/actions'

const { Text } = Typography

function getFieldError(
  field: string,
  validationErrors: { field: string; message: string }[],
): string | undefined {
  return validationErrors.find((e) => e.field === field)?.message
}

export function EditAuthorPage() {
  const { id } = useParams<{ id: string }>()
  const authorId = id ? parseInt(id, 10) : NaN

  const dispatch = useDispatch()
  const {
    editAuthor,
    editStatus,
    editError,
    createStatus,
    createError,
    createValidationErrors,
  } = useSelector((state: RootState) => state.authors)

  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [secondName, setSecondName] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [formReady, setFormReady] = useState(false)

  useEffect(() => {
    return () => {
      dispatch(authorEditReset())
    }
  }, [dispatch])

  useEffect(() => {
    if (!Number.isNaN(authorId) && authorId > 0) {
      dispatch(authorFetchOne(authorId))
    }
  }, [dispatch, authorId])

  useEffect(() => {
    if (editAuthor && !formReady) {
      setName(editAuthor.name ?? '')
      setLastName(editAuthor.lastName ?? '')
      setSecondName(editAuthor.secondName ?? '')
      setFormReady(true)
    }
  }, [editAuthor, formReady])

  useEffect(() => {
    if (createError || editError) {
      message.error(createError || editError)
    }
  }, [createError, editError])

  const handleSubmit = () => {
    if (Number.isNaN(authorId)) return
    dispatch(
      authorUpdate(authorId, {
        name,
        lastName,
        secondName,
        avatar: avatar ?? undefined,
      }),
    )
  }

  const nameError = getFieldError('name', createValidationErrors)
  const lastNameError = getFieldError('lastName', createValidationErrors)
  const secondNameError = getFieldError('secondName', createValidationErrors)
  const avatarError = getFieldError('avatar', createValidationErrors)

  if (Number.isNaN(authorId) || authorId <= 0) {
    return (
      <div style={{ padding: 16 }}>
        <Text type="danger">Неверный ID автора</Text>
        <div style={{ marginTop: 8 }}>
          <Link to="/authors">
            <Button type="link" icon={<ArrowLeftOutlined />}>
              К списку авторов
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (editStatus === 'loading') {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Link to="/authors">
            <Button type="link" icon={<ArrowLeftOutlined />}>
              К списку авторов
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (editStatus === 'error' && !editAuthor) {
    return (
      <div style={{ padding: 16 }}>
        <Text type="danger">{editError}</Text>
        <div style={{ marginTop: 8 }}>
          <Link to="/authors">
            <Button type="link" icon={<ArrowLeftOutlined />}>
              К списку авторов
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <Space style={{ marginBottom: 16 }}>
        <Link to="/authors">
          <Button type="link" icon={<ArrowLeftOutlined />}>
            К списку авторов
          </Button>
        </Link>
      </Space>

      {editAuthor && (
        <Card title="Редактировать автора">
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Имя"
              required
              validateStatus={nameError ? 'error' : undefined}
              help={nameError}
            >
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя"
              />
            </Form.Item>

            <Form.Item
              label="Фамилия"
              validateStatus={lastNameError ? 'error' : undefined}
              help={lastNameError}
            >
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Фамилия"
              />
            </Form.Item>

            <Form.Item
              label="Отчество"
              validateStatus={secondNameError ? 'error' : undefined}
              help={secondNameError}
            >
              <Input
                value={secondName}
                onChange={(e) => setSecondName(e.target.value)}
                placeholder="Отчество"
              />
            </Form.Item>

            <Form.Item
              label="Аватар"
              validateStatus={avatarError ? 'error' : undefined}
              help={avatarError}
            >
              {editAuthor.avatar?.url && (
                <div style={{ marginBottom: 8 }}>
                  <Image
                    src={editAuthor.avatar.url}
                    alt={editAuthor.avatar.name}
                    width={100}
                    height={100}
                    style={{ borderRadius: 8, objectFit: 'cover' }}
                  />
                  <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                    Текущий аватар
                  </Text>
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={createStatus === 'loading'}
                disabled={!formReady}
              >
                {createStatus === 'loading' ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  )
}
