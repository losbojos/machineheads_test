import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import type { History } from 'history'

import { authReducer } from '../features/auth/reducer'
import { postsReducer } from '../features/posts/reducer'
import { authorsReducer } from '../features/authors/reducer'

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    posts: postsReducer,
    authors: authorsReducer,
  })

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>