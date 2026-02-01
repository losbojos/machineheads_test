import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'

import './index.css'
import App from './App.tsx'
import { store } from './app/store'
import { history } from './app/history'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ConfigProvider locale={ruRU}>
          <App />
        </ConfigProvider>
      </ConnectedRouter>
    </Provider>
  </StrictMode>,
)
