// src/app/rootReducer.ts
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import type { History } from 'history'

import { authReducer } from '../features/auth/reducer'

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    // сюда позже добавим posts, authors, tags
  })

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>