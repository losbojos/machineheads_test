import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Card, Form, Input, Select, Checkbox, Button, Space, Typography, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import type { RootState } from '../app/rootReducer'
import { postCreate, postCreateReset } from '../features/posts/actions'
import { fetchAuthors } from '../api/authors'
import { fetchTags } from '../api/tags'
import type { Author } from '../api/authors'
import type { Tag } from '../api/tags'

const { TextArea } = Input
const { Text } = Typography

function getFieldError(
  field: string,
  validationErrors: { field: string; message: string }[],
): string | undefined {
  return validationErrors.find((e) => e.field === field)?.message
}

function getAuthorDisplayName(a: Author): string {
  return [a.name, a.lastName, a.secondName].filter(Boolean).join(' ').trim() || String(a.id)
}

export function AddPostPage() {
  const dispatch = useDispatch()
  const { createStatus, createError, createValidationErrors } = useSelector(
    (state: RootState) => state.posts,
  )

  const [authors, setAuthors] = useState<Author[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [authorsError, setAuthorsError] = useState<string | null>(null)
  const [tagsError, setTagsError] = useState<string | null>(null)

  const [code, setCode] = useState('')
  const [title, setTitle] = useState('')
  const [authorId, setAuthorId] = useState<number | ''>('')
  const [tagIds, setTagIds] = useState<number[]>([])
  const [text, setText] = useState('')
  const [previewPicture, setPreviewPicture] = useState<File | null>(null)

  useEffect(() => {
    dispatch(postCreateReset())
  }, [dispatch])

  useEffect(() => {
    fetchAuthors()
      .then(setAuthors)
      .catch((e) => setAuthorsError(e instanceof Error ? e.message : 'Ошибка загрузки авторов'))
    fetchTags()
      .then(setTags)
      .catch((e) => setTagsError(e instanceof Error ? e.message : 'Ошибка загрузки тегов'))
  }, [])

  useEffect(() => {
    if (createError) {
      message.error(createError)
    }
  }, [createError])

  const handleTagChange = (checkedIds: number[]) => {
    setTagIds(checkedIds)
  }

  const handleSubmit = () => {
    if (authorId === '') return
    dispatch(
      postCreate({
        code,
        title,
        authorId,
        tagIds,
        text,
        previewPicture: previewPicture ?? undefined,
      }),
    )
  }

  const codeError = getFieldError('code', createValidationErrors)
  const titleError = getFieldError('title', createValidationErrors)
  const authorIdError = getFieldError('authorId', createValidationErrors)
  const tagIdsError = getFieldError('tagIds', createValidationErrors)
  const textError = getFieldError('text', createValidationErrors)
  const previewPictureError = getFieldError('previewPicture', createValidationErrors)

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <Space style={{ marginBottom: 16 }}>
        <Link to="/posts">
          <Button type="link" icon={<ArrowLeftOutlined />}>
            К списку постов
          </Button>
        </Link>
      </Space>

      <Card title="Добавить пост">
        {(authorsError || tagsError) && (
          <div style={{ marginBottom: 16 }}>
            {authorsError && <Text type="warning">{authorsError}</Text>}
            {tagsError && <Text type="warning">{tagsError}</Text>}
          </div>
        )}
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Код (code)"
            required
            validateStatus={codeError ? 'error' : undefined}
            help={codeError}
          >
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Уникальный код поста"
            />
          </Form.Item>

          <Form.Item
            label="Заголовок"
            required
            validateStatus={titleError ? 'error' : undefined}
            help={titleError}
          >
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Заголовок поста"
            />
          </Form.Item>

          <Form.Item
            label="Автор"
            required
            validateStatus={authorIdError ? 'error' : undefined}
            help={authorIdError}
          >
            <Select
              placeholder="Выберите автора"
              value={authorId || undefined}
              onChange={(v) => setAuthorId(v ?? '')}
              options={authors.map((a) => ({
                label: getAuthorDisplayName(a),
                value: a.id,
              }))}
              allowClear
            />
          </Form.Item>

          <Form.Item
            label="Теги"
            validateStatus={tagIdsError ? 'error' : undefined}
            help={tagIdsError}
          >
            <Checkbox.Group
              value={tagIds}
              onChange={handleTagChange as (v: unknown) => void}
              options={[...tags]
                .sort((a, b) => a.sort - b.sort)
                .map((t) => ({ label: t.name, value: t.id }))}
            />
          </Form.Item>

          <Form.Item
            label="Текст"
            required
            validateStatus={textError ? 'error' : undefined}
            help={textError}
          >
            <TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder="Текст поста"
            />
          </Form.Item>

          <Form.Item
            label="Превью-картинка"
            validateStatus={previewPictureError ? 'error' : undefined}
            help={previewPictureError}
          >
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setPreviewPicture(e.target.files?.[0] ?? null)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createStatus === 'loading'}
            >
              {createStatus === 'loading' ? 'Сохранение...' : 'Создать пост'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
