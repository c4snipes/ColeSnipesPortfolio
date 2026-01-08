import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Skills from './pages/Skills'
import Coursework from './pages/Coursework'
import Terminal from './pages/Terminal'

function App() {
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="skills" element={<Skills />} />
            <Route path="coursework" element={<Coursework />} />
            <Route path="terminal" element={<Terminal />} />
          </Route>
        </Routes>
      </AnimatePresence>
      <Analytics />
    </>
  )
}

export default App
