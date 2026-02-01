import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Card, Form, Input, Button, Space, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import type { RootState } from '../app/rootReducer'
import { authorCreate, authorCreateReset } from '../features/authors/actions'

function getFieldError(
  field: string,
  validationErrors: { field: string; message: string }[],
): string | undefined {
  return validationErrors.find((e) => e.field === field)?.message
}

export function AddAuthorPage() {
  const dispatch = useDispatch()
  const { createStatus, createError, createValidationErrors } = useSelector(
    (state: RootState) => state.authors,
  )

  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [secondName, setSecondName] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)

  useEffect(() => {
    dispatch(authorCreateReset())
  }, [dispatch])

  useEffect(() => {
    if (createError) {
      message.error(createError)
    }
  }, [createError])

  const handleSubmit = () => {
    dispatch(
      authorCreate({
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

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <Space style={{ marginBottom: 16 }}>
        <Link to="/authors">
          <Button type="link" icon={<ArrowLeftOutlined />}>
            К списку авторов
          </Button>
        </Link>
      </Space>

      <Card title="Добавить автора">
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
            >
              {createStatus === 'loading' ? 'Сохранение...' : 'Создать автора'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
