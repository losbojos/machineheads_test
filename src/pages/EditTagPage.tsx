import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Card, Form, Input, InputNumber, Button, Space, Typography, Spin, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import type { RootState } from '../app/rootReducer'
import {
  tagFetchOne,
  tagUpdate,
  tagEditReset,
} from '../features/tags/actions'

const { Text } = Typography

function getFieldError(
  field: string,
  validationErrors: { field: string; message: string }[],
): string | undefined {
  return validationErrors.find((e) => e.field === field)?.message
}

export function EditTagPage() {
  const { id } = useParams<{ id: string }>()
  const tagId = id ? parseInt(id, 10) : NaN

  const dispatch = useDispatch()
  const {
    editTag,
    editStatus,
    editError,
    createStatus,
    createError,
    createValidationErrors,
  } = useSelector((state: RootState) => state.tags)

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [sort, setSort] = useState<number>(0)
  const [formReady, setFormReady] = useState(false)

  useEffect(() => {
    return () => {
      dispatch(tagEditReset())
    }
  }, [dispatch])

  useEffect(() => {
    if (!Number.isNaN(tagId) && tagId > 0) {
      dispatch(tagFetchOne(tagId))
    }
  }, [dispatch, tagId])

  useEffect(() => {
    if (editTag && !formReady) {
      setName(editTag.name ?? '')
      setCode(editTag.code ?? '')
      setSort(editTag.sort ?? 0)
      setFormReady(true)
    }
  }, [editTag, formReady])

  useEffect(() => {
    if (createError || editError) {
      message.error(createError || editError)
    }
  }, [createError, editError])

  const handleSubmit = () => {
    if (Number.isNaN(tagId)) return
    const trimmedCode = code.trim()
    if (!trimmedCode) {
      message.warning('Поле «Код» обязательно для заполнения')
      return
    }
    dispatch(
      tagUpdate(tagId, {
        name,
        code: trimmedCode,
        sort,
      }),
    )
  }

  const nameError = getFieldError('name', createValidationErrors)
  const codeError = getFieldError('code', createValidationErrors)
  const sortError = getFieldError('sort', createValidationErrors)

  if (Number.isNaN(tagId) || tagId <= 0) {
    return (
      <div style={{ padding: 16 }}>
        <Text type="danger">Неверный ID тега</Text>
        <div style={{ marginTop: 8 }}>
          <Link to="/tags">
            <Button type="link" icon={<ArrowLeftOutlined />}>
              К списку тегов
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
          <Link to="/tags">
            <Button type="link" icon={<ArrowLeftOutlined />}>
              К списку тегов
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (editStatus === 'error' && !editTag) {
    return (
      <div style={{ padding: 16 }}>
        <Text type="danger">{editError}</Text>
        <div style={{ marginTop: 8 }}>
          <Link to="/tags">
            <Button type="link" icon={<ArrowLeftOutlined />}>
              К списку тегов
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <Space style={{ marginBottom: 16 }}>
        <Link to="/tags">
          <Button type="link" icon={<ArrowLeftOutlined />}>
            К списку тегов
          </Button>
        </Link>
      </Space>

      {editTag && (
        <Card title="Редактировать тег">
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
