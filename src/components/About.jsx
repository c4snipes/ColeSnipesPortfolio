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
    <>
      <style>{`
        .about {
          padding: var(--space-2xl) var(--space-md);
          background: var(--color-surface);
        }
        .about-inner {
          padding-left: 16.667%;
          max-width: 72ch;
        }
        .about-copy {
          font-family: 'Space Mono', monospace;
          font-size: var(--step-0);
          color: var(--color-ink);
          line-height: 1.8;
          max-width: 60ch;
        }
        .about-copy::first-letter {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: var(--step-3);
          font-weight: 300;
          float: left;
          line-height: 0.8;
          padding-right: 0.08em;
          color: var(--color-accent);
        }
        .about-copy + .about-copy {
          margin-top: var(--space-md);
        }
        @media (max-width: 768px) {
          .about { padding: var(--space-xl) var(--space-sm); }
          .about-inner { padding-left: 0; }
        }
      `}</style>
      <section className="about" id="about" aria-label="About">
        <div className="container">
          <div className="reveal" ref={ref}>
            <span className="section-number">03 —</span>
            <h2 className="section-title" style={{ marginBottom: 'var(--space-md)' }}>About</h2>
            <div className="about-inner">
              <p className="about-copy">
                I write code that makes systems feel smaller than they are.
              </p>
              <p className="about-copy">
                Most of my work lives in the gap between raw computation and the people who need
                to use it — students, instructors, researchers. The interface is often the only
                part they see. I care about what happens after the demo.
              </p>
              <p className="about-copy">
                I'm a computer science student at the University of Indianapolis, building toward
                work at the intersection of frontend engineering and data systems.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
