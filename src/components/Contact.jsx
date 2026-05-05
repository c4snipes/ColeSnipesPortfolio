import { useEffect, useRef } from 'react'

export default function Contact() {
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
        .contact {
          padding: var(--space-2xl) var(--space-md);
        }
        .contact-links {
          margin-top: var(--space-md);
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          padding-left: 16.667%;
        }
        .contact-link {
          font-family: 'Space Mono', monospace;
          font-size: var(--step-0);
          color: var(--color-ink);
          text-decoration: none;
          display: inline-block;
          width: fit-content;
          position: relative;
        }
        .contact-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--color-accent);
          transition: width 150ms;
        }
        .contact-link:hover::after {
          width: 100%;
        }
        @media (max-width: 768px) {
          .contact { padding: var(--space-xl) var(--space-sm); }
          .contact-links { padding-left: 0; }
        }
      `}</style>
      <section className="contact" id="contact" aria-label="Contact">
        <div className="container">
          <div className="reveal" ref={ref}>
            <span className="section-number">04 —</span>
            <h2 className="section-title">Contact</h2>
            <p style={{ marginTop: 'var(--space-sm)', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'var(--step-2)', fontWeight: 300, color: 'var(--color-ink)' }}>
              Let's work together.
            </p>
            <div className="contact-links">
              <a href="mailto:cole.snipes@icloud.com" className="contact-link">cole.snipes@icloud.com</a>
              <a href="https://github.com/c4snipes" target="_blank" rel="noopener noreferrer" className="contact-link">github.com/c4snipes</a>
              <a href="https://linkedin.com/in/colesnipes" target="_blank" rel="noopener noreferrer" className="contact-link">linkedin.com/in/colesnipes</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
