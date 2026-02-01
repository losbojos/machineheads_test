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
const AuthorsPage = lazy(() =>
  import('./pages/AuthorsPage.tsx').then((m) => ({ default: m.AuthorsPage })),
)
const AddAuthorPage = lazy(() =>
  import('./pages/AddAuthorPage.tsx').then((m) => ({ default: m.AddAuthorPage })),
)
const EditAuthorPage = lazy(() =>
  import('./pages/EditAuthorPage.tsx').then((m) => ({ default: m.EditAuthorPage })),
)
const TagsPage = lazy(() =>
  import('./pages/TagsPage.tsx').then((m) => ({ default: m.TagsPage })),
)
const AddTagPage = lazy(() =>
  import('./pages/AddTagPage.tsx').then((m) => ({ default: m.AddTagPage })),
)
const EditTagPage = lazy(() =>
  import('./pages/EditTagPage.tsx').then((m) => ({ default: m.EditTagPage })),
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
            <PrivateRoute path="/authors/add" component={AddAuthorPage} />
            <PrivateRoute path="/authors/edit/:id" component={EditAuthorPage} />
            <PrivateRoute path="/authors" component={AuthorsPage} exact />
            <PrivateRoute path="/tags/add" component={AddTagPage} />
            <PrivateRoute path="/tags/edit/:id" component={EditTagPage} />
            <PrivateRoute path="/tags" component={TagsPage} exact />
            <Redirect to="/login" />
          </Switch>
        </Suspense>
      </Content>
    </Layout>
  )
}
