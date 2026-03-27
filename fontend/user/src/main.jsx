import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 1. Import Store và Provider của Redux
import { store } from './redux/store'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Bọc Provider bên ngoài App */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)