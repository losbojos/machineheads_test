import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import type { History } from 'history'

import { authReducer } from '../features/auth/reducer'
import { postsReducer } from '../features/posts/reducer'

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    posts: postsReducer,
  })

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>