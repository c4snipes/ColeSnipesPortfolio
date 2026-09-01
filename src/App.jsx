/**
 * App.jsx
 *
 * Root component. Composes the full single-page layout in document order.
 * Section sequence mirrors the visual scroll order, the nav link targets, and
 * the "01 —" … "06 —" counters printed in each section.
 *
 * Analytics: Vercel Analytics is mounted here rather than in index.html so it
 * lives inside the React tree and unmounts cleanly with it.
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
      {/* First focusable element on the page — lets keyboard users jump the nav.
          Visually hidden until focused; see .skip-link in index.css. */}
      <a className="skip-link" href="#main">Skip to content</a>

      {/* Nav sits outside <main> — it overlays the hero via position: absolute */}
      <Nav />
      {/* tabIndex="-1" makes <main> a valid programmatic focus target without
          adding it to the tab order. Without it the skip link moves the scroll
          position but leaves focus at the top of the page, so the next Tab drops
          the user right back into the nav they just skipped. */}
      <main id="main" tabIndex="-1">
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
