import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'

import { PrivateRoute } from './components/PrivateRoute'
import { LoginPage } from './pages/LoginPage.tsx'
import { PostsPage } from './pages/PostsPage.tsx'
import { AddPostPage } from './pages/AddPostPage.tsx'
import { EditPostPage } from './pages/EditPostPage.tsx'

const { Content } = Layout

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: 24 }}>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <PrivateRoute path="/posts/add" component={AddPostPage} />
          <PrivateRoute path="/posts/edit/:id" component={EditPostPage} />
          <PrivateRoute path="/posts" component={PostsPage} exact />
          <Redirect to="/login" />
        </Switch>
      </Content>
    </Layout>
  )
}
