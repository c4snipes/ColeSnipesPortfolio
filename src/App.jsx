/**
 * App.jsx
 *
 * Root component. Composes the full single-page layout in document order.
 * Section sequence mirrors the visual scroll order and nav link targets.
 *
 * Analytics: Vercel Analytics is injected here rather than in index.html
 * so it participates in React's render lifecycle and respects SPA routing.
 */

import { Analytics } from '@vercel/analytics/react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import TechStack from './components/TechStack'
import Work from './components/Work'
import Timeline from './components/Timeline'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <>
      {/* Nav sits outside <main> — it overlays the hero via position: absolute */}
      <Nav />
      <main>
        <Hero />
        <TechStack />
        <Work />
        <Timeline />
        <About />
        <Contact />
      </main>
      <Footer />
      <Analytics />
    </>
  )
}

export default App
