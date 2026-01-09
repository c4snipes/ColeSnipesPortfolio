import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Skills from './pages/Skills'
import Coursework from './pages/Coursework'
import { trackPageView } from './utils/tracing'

function App() {
  const location = useLocation()

  // Track page views on route changes
  useEffect(() => {
    const pageName = location.pathname === '/' ? 'home' : location.pathname.slice(1)
    trackPageView(pageName)
  }, [location.pathname])

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="skills" element={<Skills />} />
            <Route path="coursework" element={<Coursework />} />
          </Route>
        </Routes>
      </AnimatePresence>
      <Analytics />
    </>
  )
}

export default App
