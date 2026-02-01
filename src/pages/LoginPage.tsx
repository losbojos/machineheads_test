import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import type { RootState } from '../app/rootReducer'
import { loginRequest } from '../features/auth/actions'

export function LoginPage() {
  const dispatch = useDispatch()
  const authState = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (authState.status === 'error' && authState.error) {
      message.error(authState.error)
    }
  }, [authState.status, authState.error])

  const handleFinish = (values: { email: string; password: string }) => {
    dispatch(loginRequest({ email: values.email, password: values.password }))
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto 0' }}>
      <Card title="Вход" style={{ width: '100%' }}>
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Введите email' }]}
          >
            <Input
              prefix={<UserOutlined />}
              type="email"
              placeholder="email@example.com"
            />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Пароль"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={authState.status === 'loading'}
              block
            >
              {authState.status === 'loading' ? 'Вход...' : 'Войти'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
