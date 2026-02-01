import { Redirect, Route, Switch } from 'react-router-dom'

import { PrivateRoute } from './components/PrivateRoute'
import { LoginPage } from './pages/LoginPage.tsx'
import { PostsPage } from './pages/PostsPage.tsx'
import { AddPostPage } from './pages/AddPostPage.tsx'
import { EditPostPage } from './pages/EditPostPage.tsx'

export default function App() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <PrivateRoute path="/posts/add" component={AddPostPage} />
      <PrivateRoute path="/posts/edit/:id" component={EditPostPage} />
      <PrivateRoute path="/posts" component={PostsPage} exact />
      <Redirect to="/login" />
    </Switch>
  )
}
