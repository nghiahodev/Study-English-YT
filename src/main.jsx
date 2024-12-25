import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App'

import env from './config/env'
import { persistor, store } from './redux/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </PersistGate>
  </Provider>
)
