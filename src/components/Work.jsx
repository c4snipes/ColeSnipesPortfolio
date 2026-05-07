/**
 * Work.jsx
 *
 * Renders the projects section from src/data/projects.json.
 * Each project is an independent ProjectCard with its own IntersectionObserver
 * so cards reveal as they scroll into view rather than all at once.
 *
 * Layout alternates left/right image placement via the `project-entry--right`
 * modifier class, driven by the card's index (odd = right). This creates the
 * asymmetric editorial rhythm described in ANTI-VIBECODING-PORTFOLIO.md.
 *
 * Project data shape (see projects.json):
 * {
 *   title:      string   — display name
 *   descriptor: string   — one-line label (e.g. "Accreditation mapping tool")
 *   image:      string   — path relative to /public
 *   stack:      string[] — technology names, joined with " · "
 *   year:       string   — display year (single or range handled in data)
 *   link:       string | null — external URL; title rendered as plain text if null
 *   goal:       string   — what problem existed before this was built
 *   process:    string   — the non-obvious decision or approach
 *   result:     string   — measurable or concrete outcome
 * }
 */

import { useEffect, useRef } from 'react'
import projects from '../data/projects.json'

/**
 * ProjectCard
 *
 * Renders a single project entry. Manages its own scroll-reveal observer
 * so each card animates independently as it enters the viewport.
 *
 * @param {Object} props
 * @param {Object} props.project - Project data object from projects.json
 * @param {number} props.index   - Position in the list; determines image side (even = left, odd = right)
 */
function ProjectCard({ project, index }) {
  const cardRef = useRef(null)

  // Odd-indexed cards flip the grid layout to right-weighted via CSS modifier
  const isRight = index % 2 !== 0

  // Reveal the card once when it crosses the viewport threshold.
  // Observer disconnects after firing — no need to watch continuously.
  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          card.classList.add('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  return (
    <article className={`project-entry ${isRight ? 'project-entry--right' : ''} reveal`} ref={cardRef}>
      <div className="project-layout">
        {project.image && (
          <div className="project-image-wrap">
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              loading="lazy"
              className="project-image"
            />
          </div>
        )}
        <div className="project-body">
          <div className="project-meta">
            {/* Stack items joined inline — avoids chip/tag UI per design brief */}
            <span className="project-stack">{project.stack.join(' · ')}</span>
            <span className="project-year">{project.year}</span>
          </div>

          <h3 className="project-title">
            {/* Title is the link if an external URL exists; plain text otherwise */}
            {project.link ? (
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>

          <p className="project-descriptor">{project.descriptor}</p>

          {/* GOAL / PROCESS / RESULT sections — keys map directly to JSON fields */}
          <div className="project-sections">
            {['goal', 'process', 'result'].map((key) => (
              project[key] && (
                <div className="project-section" key={key}>
                  <span className="project-section-label">{key.toUpperCase()}</span>
                  <p className="project-section-text">{project[key]}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Work() {
  return (
    <section className="work" id="work" aria-label="Selected work">
      <div className="container">
        <header className="work-header">
          <span className="section-number">03 —</span>
          <h2 className="section-title">Work</h2>
        </header>
        <div className="project-list">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
