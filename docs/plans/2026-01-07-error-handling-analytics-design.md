# Error Handling & Analytics Design

**Date:** 2026-01-07
**Status:** Approved
**Sentry Project ID:** 4159816

## Overview

Add error handling, performance monitoring, and analytics to the portfolio site using Vercel (hosting) and Sentry (error tracking).

## Goals

- Catch JavaScript errors with full stack traces
- Monitor Core Web Vitals (especially for 3D hero performance)
- Get visibility into traffic and user behavior
- Auto-deploy on git push
- Keep costs at $0 (free tiers)

## Architecture

```
React App (Vite)
├── ErrorBoundary (catches React crashes)
├── Sentry SDK (reports errors)
└── Web Vitals (tracks performance)
        │
        ▼ Deploy
Vercel
├── Edge Network (global CDN)
├── Vercel Analytics (page views, vitals)
└── GitHub Integration (auto-deploy)
        │
        ▼ Reports to
Sentry
├── Error tracking (stack traces)
├── Performance monitoring
└── Alerts (email/Slack)
```

## Implementation

### 1. Dependencies

```bash
npm install @sentry/react web-vitals
```

### 2. Error Boundary Component

Create `src/components/ErrorBoundary.jsx`:

```jsx
import { Component } from 'react'
import * as Sentry from '@sentry/react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { extra: errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
```

### 3. Main Entry Point

Update `src/main.jsx`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// Initialize Sentry (only in production)
Sentry.init({
  dsn: 'YOUR_FULL_SENTRY_DSN_HERE', // Get from Sentry → Project Settings → Client Keys
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD,
})

// Track Web Vitals
const sendToAnalytics = (metric) => {
  if (import.meta.env.PROD) {
    Sentry.captureMessage(`Web Vital: ${metric.name}`, {
      level: 'info',
      extra: { value: metric.value, rating: metric.rating },
    })
  }
}

onCLS(sendToAnalytics)
onFID(sendToAnalytics)
onLCP(sendToAnalytics)
onFCP(sendToAnalytics)
onTTFB(sendToAnalytics)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
```

### 4. Vercel Configuration

Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

## Web Vitals Reference

| Metric | What it measures | Target |
|--------|------------------|--------|
| LCP | Largest Contentful Paint | < 2.5s |
| FID | First Input Delay | < 100ms |
| CLS | Cumulative Layout Shift | < 0.1 |
| FCP | First Contentful Paint | < 1.8s |
| TTFB | Time to First Byte | < 800ms |

## Deployment Steps

1. Create Sentry account at sentry.io
2. Create new project (React) → copy full DSN
3. Install dependencies: `npm install @sentry/react web-vitals`
4. Create `ErrorBoundary.jsx`
5. Update `main.jsx` with Sentry + Web Vitals
6. Create `vercel.json`
7. Deploy: `vercel` or connect GitHub at vercel.com
8. Enable Vercel Analytics in dashboard

## Getting Your Sentry DSN

1. Go to sentry.io → Your Project (ID: 4159816)
2. Settings → Client Keys (DSN)
3. Copy the full DSN URL (looks like `https://abc123@o456.ingest.sentry.io/4159816`)

## Notes

- Sentry DSN is safe to expose client-side (can only send, not read)
- Web Vitals only report in production (`import.meta.env.PROD`)
- Vercel Analytics free tier: 2,500 data points/month
- Sentry free tier: 5,000 errors/month
