import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AchievementProvider } from './context/AchievementContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AchievementProvider>
        <App />
      </AchievementProvider>
    </BrowserRouter>
  </React.StrictMode>
)
