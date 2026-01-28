import { Redirect, Route, Switch } from 'react-router-dom'

import { LoginPage } from './pages/LoginPage.tsx'
import { PostsPage } from './pages/PostsPage.tsx'

export default function App() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/posts" component={PostsPage} />
      <Redirect to="/login" />
    </Switch>
  )
}
