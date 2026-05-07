import { useEffect, useRef } from 'react'
import stack from '../data/stack.json'

export default function TechStack() {
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
    <section className="tech-stack" id="stack" aria-label="Tech stack">
      <div className="container">
        <div className="reveal" ref={ref}>
          <header className="tech-stack-header">
            <span className="section-number">02 —</span>
            <h2 className="section-title">Tech Stack</h2>
          </header>
          <div className="tech-stack-grid">
            {stack.map((group) => (
              <div className="tech-stack-group" key={group.category}>
                <h3 className="tech-stack-title">{group.category}</h3>
                <div className="tech-stack-accordion">
                  {group.items.map((item) => (
                    <details className="tech-stack-item" key={`${group.category}-${item.title}`}>
                      <summary className="tech-stack-item__title">{item.title}</summary>
                      <ul className="tech-stack-subitems">
                        {item.subItems.map((subItem) => (
                          <li className="tech-stack-subitem" key={`${item.title}-${subItem}`}>{subItem}</li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
