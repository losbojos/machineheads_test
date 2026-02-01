import { lazy, Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout, Spin } from 'antd'

import { PrivateRoute } from './components/PrivateRoute'

// Lazy load страниц — код загружается только при переходе на маршрут
const LoginPage = lazy(() =>
  import('./pages/LoginPage.tsx').then((m) => ({ default: m.LoginPage })),
)
const PostsPage = lazy(() =>
  import('./pages/PostsPage.tsx').then((m) => ({ default: m.PostsPage })),
)
const AddPostPage = lazy(() =>
  import('./pages/AddPostPage.tsx').then((m) => ({ default: m.AddPostPage })),
)
const EditPostPage = lazy(() =>
  import('./pages/EditPostPage.tsx').then((m) => ({ default: m.EditPostPage })),
)

const { Content } = Layout

function PageLoader() {
  return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <Spin size="large" />
    </div>
  )
}

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: 24 }}>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/login" component={LoginPage} />
            <PrivateRoute path="/posts/add" component={AddPostPage} />
            <PrivateRoute path="/posts/edit/:id" component={EditPostPage} />
            <PrivateRoute path="/posts" component={PostsPage} exact />
            <Redirect to="/login" />
          </Switch>
        </Suspense>
      </Content>
    </Layout>
  )
}
