/**
 * About.jsx
 *
 * Position statement section. Copy intentionally avoids biography format.
 * See ANTI-VIBECODING-PORTFOLIO.md section 5.4 for the copy direction.
 *
 * The first-letter drop cap on .about-copy--lead is CSS-only (::first-letter).
 * It only appears on the lead paragraph; applying it to every paragraph
 * would break the typographic rhythm.
 */

import { useEffect, useRef } from 'react'

export default function About() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect() } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="about" id="about" aria-label="About">
      <div className="container">
        <div className="reveal" ref={ref}>
          <span className="section-number">06 —</span>
          <h2 className="section-title">About</h2>
          <div className="about-inner">
            {/* Lead paragraph — receives the drop cap via .about-copy--lead */}
            <p className="about-copy about-copy--lead">
              I build the part of the system that has to explain itself to people who should not have to think about what is underneath.
            </p>
            <p className="about-copy">
              Most of my projects have non-technical end users. A department chair mapping
              accreditation standards. Students running physics simulations in a browser.
              The interface is the whole product for them, not a layer on top of it.
            </p>
            <p className="about-copy">
              Graduated from the University of Indianapolis in May 2026 with a B.S. in Computer
              Science, concentration in Software Engineering. My projects have run from
              AI-powered accreditation tools to open source WebAssembly contributions. The
              common thread is output that someone outside the team actually uses. Currently
              available and looking for a role where that standard applies.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
