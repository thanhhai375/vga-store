import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 1. Import Store và Provider của Redux
import { store } from './redux/store'
import { Provider } from 'react-redux'

// 2. Import thư viện Google
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Bọc Provider của Redux */}
    <Provider store={store}>
      {/* 3. Bọc GoogleOAuthProvider và cắm mã Client ID của bạn vào */}
      <GoogleOAuthProvider clientId="820517470618-3fscnq649d1edm023fo31em406en7jjr.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
)