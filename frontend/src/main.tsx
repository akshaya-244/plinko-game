import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')!).render(
<GoogleOAuthProvider clientId='166621952307-94aq0n7cspq6v17gbca3btm52jua3jhq.apps.googleusercontent.com' >
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </GoogleOAuthProvider>
,
)
