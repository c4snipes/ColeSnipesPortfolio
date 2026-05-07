import { useEffect, useRef } from 'react'
import timeline from '../data/timeline.json'

export default function Timeline() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="timeline" id="timeline" aria-label="Education and roles">
      <div className="container">
        <div className="reveal" ref={ref}>
          <header className="timeline-header">
            <span className="section-number">05 —</span>
            <h2 className="section-title">Timeline</h2>
          </header>
          <ol className="timeline-list">
            {timeline.map((entry) => (
              <li className="timeline-item" key={`${entry.year}-${entry.title}`}>
                <span className="timeline-year">
                  {entry.endYear ? `${entry.year}–${entry.endYear}` : entry.year}
                </span>
                <div className="timeline-body">
                  <h3 className="timeline-title">{entry.title}</h3>
                  <p className="timeline-detail">{entry.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
