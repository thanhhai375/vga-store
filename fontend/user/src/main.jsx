import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 1. Import Store v Provider ca Redux
import { store } from './redux/store'
import { Provider } from 'react-redux'

// 2. Import th vin Google
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
{/* Bc Provider ca Redux */}
    <Provider store={store}>
{/* 3. Bc GoogleOAuthProvider v cm m Client ID ca bn vo */}
      <GoogleOAuthProvider clientId="820517470618-3fscnq649d1edm023fo31em406en7jjr.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
)
