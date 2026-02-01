import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import type { RootState } from '../app/rootReducer'
import { postCreate, postCreateReset } from '../features/posts/actions'
import { fetchAuthors } from '../api/authors'
import { fetchTags } from '../api/tags'
import type { Author } from '../api/authors'
import type { Tag } from '../api/tags'

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

  const handleTagToggle = (tagId: number) => {
    setTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
    <div style={{ padding: 16, maxWidth: 500 }}>
      <h2>Добавить пост</h2>
      <p>
        <Link to="/posts">← К списку постов</Link>
      </p>

      {createError && (
        <p style={{ color: 'red', marginBottom: 16 }}>{createError}</p>
      )}

      {authorsError && (
        <p style={{ color: 'orange', marginBottom: 16 }}>{authorsError}</p>
      )}
      {tagsError && (
        <p style={{ color: 'orange', marginBottom: 16 }}>{tagsError}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            Код (code) *
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ width: '100%', padding: 6, marginTop: 4 }}
            />
          </label>
          {codeError && <span style={{ color: 'red', fontSize: 12 }}>{codeError}</span>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            Заголовок *
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: 6, marginTop: 4 }}
            />
          </label>
          {titleError && <span style={{ color: 'red', fontSize: 12 }}>{titleError}</span>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            Автор *
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value ? Number(e.target.value) : '')}
              style={{ width: '100%', padding: 6, marginTop: 4 }}
            >
              <option value="">— Выберите —</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {getAuthorDisplayName(a)}
                </option>
              ))}
            </select>
          </label>
          {authorIdError && <span style={{ color: 'red', fontSize: 12 }}>{authorIdError}</span>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            Теги
            <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tags.map((t) => (
                <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="checkbox"
                    checked={tagIds.includes(t.id)}
                    onChange={() => handleTagToggle(t.id)}
                  />
                  {t.name}
                </label>
              ))}
            </div>
          </label>
          {tagIdsError && <span style={{ color: 'red', fontSize: 12 }}>{tagIdsError}</span>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            Текст *
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              style={{ width: '100%', padding: 6, marginTop: 4, resize: 'vertical' }}
            />
          </label>
          {textError && <span style={{ color: 'red', fontSize: 12 }}>{textError}</span>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            Превью-картинка
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPreviewPicture(e.target.files?.[0] ?? null)}
              style={{ marginTop: 4 }}
            />
          </label>
          {previewPictureError && (
            <span style={{ color: 'red', fontSize: 12 }}>{previewPictureError}</span>
          )}
        </div>

        <button type="submit" disabled={createStatus === 'loading'}>
          {createStatus === 'loading' ? 'Сохранение...' : 'Создать пост'}
        </button>
      </form>
    </div>
  )
}
