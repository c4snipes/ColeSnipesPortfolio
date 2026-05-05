import { useEffect, useRef } from 'react'

export default function Hero() {
  const nameRef = useRef(null)
  const subtitleRef = useRef(null)

  useEffect(() => {
    const name = nameRef.current
    const subtitle = subtitleRef.current
    if (!name || !subtitle) return

    // Entrance animation: slide up from translateY(24px)
    requestAnimationFrame(() => {
      name.style.opacity = '1'
      name.style.transform = 'translateY(0)'
      setTimeout(() => {
        subtitle.style.opacity = '1'
        subtitle.style.transform = 'translateY(0)'
      }, 120)
    })
  }, [])

  return (
    <>
      <style>{`
        .hero {
          min-height: 100vh;
          display: grid;
          align-items: center;
          padding: var(--space-xl) var(--space-md) var(--space-lg);
        }
        .hero-inner {
          padding-left: 16.667%;
        }
        .hero-number {
          font-family: 'Space Mono', monospace;
          font-size: var(--step--1);
          color: var(--color-accent);
          letter-spacing: 0.04em;
          margin-bottom: var(--space-md);
          display: block;
        }
        .hero-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: var(--step-5);
          font-weight: 300;
          color: var(--color-ink);
          line-height: 1;
          letter-spacing: -0.01em;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 700ms var(--ease-out), transform 700ms var(--ease-out);
        }
        .hero-rule {
          border: none;
          border-top: 1px solid var(--color-border);
          margin: var(--space-md) 0 var(--space-sm);
          max-width: 66ch;
        }
        .hero-subtitle {
          font-family: 'Space Mono', monospace;
          font-size: var(--step-0);
          color: var(--color-muted);
          line-height: 1.6;
          max-width: 52ch;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 700ms var(--ease-out), transform 700ms var(--ease-out);
        }
        .hero-location {
          display: block;
          margin-top: var(--space-sm);
          font-family: 'Space Mono', monospace;
          font-size: var(--step--1);
          color: var(--color-ghost);
          letter-spacing: 0.02em;
        }
        @media (max-width: 768px) {
          .hero-inner {
            padding-left: 0;
          }
          .hero {
            padding: var(--space-xl) var(--space-sm) var(--space-lg);
          }
        }
      `}</style>
      <section className="hero" aria-label="Introduction">
        <div className="hero-inner">
          <span className="hero-number">01 —</span>
          <h1 className="hero-name" ref={nameRef}>
            COLE<br />SNIPES
          </h1>
          <hr className="hero-rule" />
          <p className="hero-subtitle" ref={subtitleRef}>
            Frontend engineer. Systems thinker.<br />
            Building interfaces that earn trust.
            <span className="hero-location">Indianapolis — Available for work</span>
          </p>
        </div>
      </section>
    </>
  )
}
