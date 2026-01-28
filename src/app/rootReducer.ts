// src/app/rootReducer.ts
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import type { History } from 'history'

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    // сюда позже добавим auth, posts, authors, tags
  })

export type RootState = ReturnType<ReturnType<typeof createRootReducer>>