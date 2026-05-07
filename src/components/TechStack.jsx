/**
 * TechStack.jsx
 *
 * Renders the full skills grid from src/data/stack.json using native
 * <details>/<summary> elements for accordion behaviour — no JS state needed,
 * no accessibility gaps, and it degrades gracefully without JavaScript.
 *
 * Stack data shape:
 * [
 *   {
 *     category: string    — top-level group heading (e.g. "Programming & Frameworks")
 *     items: [
 *       {
 *         title:    string   — accordion row label (e.g. "Frontend")
 *         subItems: string[] — individual skill entries
 *       }
 *     ]
 *   }
 * ]
 *
 * The +/– toggle indicator is CSS-only via ::after on the summary element.
 * See .tech-stack-item__title::after in index.css.
 */

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
                    // Native <details> handles open/close state without React
                    <details
                      className="tech-stack-item"
                      key={`${group.category}-${item.title}`}
                    >
                      <summary className="tech-stack-item__title">{item.title}</summary>
                      <ul className="tech-stack-subitems">
                        {item.subItems.map((subItem) => (
                          <li
                            className="tech-stack-subitem"
                            key={`${item.title}-${subItem}`}
                          >
                            {subItem}
                          </li>
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
