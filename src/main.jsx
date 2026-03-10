import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'
import ErrorBoundary from './components/ErrorBoundary'
import App from './App'
import './index.css'

// Initialize Sentry (only in production)
Sentry.init({
  dsn: 'https://bd851632e00a8c48fef43f7ac22f155b@o4510671552512000.ingest.us.sentry.io/4510671603040256',
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD,
  tracesSampleRate: 0.1,
})

// Track Web Vitals and send to Sentry
const sendToAnalytics = (metric) => {
  if (import.meta.env.PROD) {
    Sentry.captureMessage(`Web Vital: ${metric.name}`, {
      level: 'info',
      extra: {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      },
    })
  }
}

onCLS(sendToAnalytics)
onINP(sendToAnalytics)
onLCP(sendToAnalytics)
onFCP(sendToAnalytics)
onTTFB(sendToAnalytics)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <SpeedInsights />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
