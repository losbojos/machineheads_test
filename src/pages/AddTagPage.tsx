import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Card, Form, Input, InputNumber, Button, Space, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import type { RootState } from '../app/rootReducer'
import { tagCreate, tagCreateReset } from '../features/tags/actions'

function getFieldError(
  field: string,
  validationErrors: { field: string; message: string }[],
): string | undefined {
  return validationErrors.find((e) => e.field === field)?.message
}

export function AddTagPage() {
  const dispatch = useDispatch()
  const { createStatus, createError, createValidationErrors } = useSelector(
    (state: RootState) => state.tags,
  )

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [sort, setSort] = useState<number>(0)

  useEffect(() => {
    dispatch(tagCreateReset())
  }, [dispatch])

  useEffect(() => {
    if (createError) {
      message.error(createError)
    }
  }, [createError])

  const handleSubmit = () => {
    dispatch(
      tagCreate({
        name,
        code,
        sort,
      }),
    )
  }

  const nameError = getFieldError('name', createValidationErrors)
  const codeError = getFieldError('code', createValidationErrors)
  const sortError = getFieldError('sort', createValidationErrors)

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <Space style={{ marginBottom: 16 }}>
        <Link to="/tags">
          <Button type="link" icon={<ArrowLeftOutlined />}>
            К списку тегов
          </Button>
        </Link>
      </Space>

      <Card title="Добавить тег">
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Название"
            required
            validateStatus={nameError ? 'error' : undefined}
            help={nameError}
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Название тега"
            />
          </Form.Item>

          <Form.Item
            label="Код (code)"
            required
            validateStatus={codeError ? 'error' : undefined}
            help={codeError}
          >
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Уникальный код"
            />
          </Form.Item>

          <Form.Item
            label="Сортировка"
            validateStatus={sortError ? 'error' : undefined}
            help={sortError}
          >
            <InputNumber
              value={sort}
              onChange={(v) => setSort(v ?? 0)}
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createStatus === 'loading'}
            >
              {createStatus === 'loading' ? 'Сохранение...' : 'Создать тег'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
