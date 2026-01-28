// src/app/store.ts
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'connected-react-router'

import { history } from './history'
import { createRootReducer } from './rootReducer'
import { rootSaga } from './rootSaga'

const sagaMiddleware = createSagaMiddleware()

const middlewares = [routerMiddleware(history), sagaMiddleware]

const composeEnhancers =
  (typeof window !== 'undefined' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose

const store = createStore(
  createRootReducer(history),
  composeEnhancers(applyMiddleware(...middlewares)),
)

sagaMiddleware.run(rootSaga)

export { store }