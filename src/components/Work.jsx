import { useEffect, useRef } from 'react'
import projects from '../data/projects.json'

function ProjectCard({ project, index }) {
  const cardRef = useRef(null)
  const isRight = index % 2 !== 0

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
            <span className="project-stack">{project.stack.join(' · ')}</span>
            <span className="project-year">{project.year}</span>
          </div>
          <h3 className="project-title">
            {project.link ? (
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>
          <p className="project-descriptor">{project.descriptor}</p>
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
    <>
      <style>{`
        .work {
          padding: var(--space-2xl) var(--space-md);
        }
        .work-header {
          margin-bottom: var(--space-xl);
        }
        .section-number {
          font-family: 'Space Mono', monospace;
          font-size: var(--step--1);
          color: var(--color-accent);
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: var(--space-xs);
        }
        .section-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: var(--step-3);
          font-weight: 300;
          color: var(--color-ink);
        }
        .project-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }
        .project-entry {
          padding-bottom: var(--space-xl);
          border-bottom: 1px solid var(--color-border);
        }
        .project-entry:last-child {
          border-bottom: none;
        }
        .project-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-lg);
          align-items: start;
        }
        .project-entry--right .project-layout {
          direction: rtl;
        }
        .project-entry--right .project-body {
          direction: ltr;
        }
        .project-image-wrap {
          overflow: hidden;
          background: var(--color-surface);
        }
        .project-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          mix-blend-mode: multiply;
          display: block;
          transition: transform 400ms ease-out;
        }
        .project-image-wrap:hover .project-image {
          transform: scale(1.02);
        }
        .project-body {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .project-meta {
          display: flex;
          gap: var(--space-sm);
          align-items: center;
          flex-wrap: wrap;
        }
        .project-stack {
          font-family: 'Space Mono', monospace;
          font-size: var(--step--2);
          color: var(--color-accent-2);
          border: 1px solid var(--color-accent-2);
          padding: 2px 8px;
          letter-spacing: 0.02em;
        }
        .project-year {
          font-family: 'Space Mono', monospace;
          font-size: var(--step--2);
          color: var(--color-ghost);
        }
        .project-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: var(--step-2);
          font-weight: 300;
          font-style: italic;
          line-height: 1.2;
          color: var(--color-ink);
        }
        .project-title a {
          text-decoration: none;
          color: inherit;
          transition: color 200ms;
        }
        .project-title a:hover {
          color: var(--color-accent);
        }
        .project-descriptor {
          font-family: 'Space Mono', monospace;
          font-size: var(--step--1);
          color: var(--color-ghost);
          max-width: none;
        }
        .project-sections {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          margin-top: var(--space-xs);
        }
        .project-section-label {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-family: 'Space Mono', monospace;
          font-size: var(--step--2);
          letter-spacing: 0.08em;
          color: var(--color-muted);
          margin-bottom: 4px;
        }
        .project-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--color-border);
        }
        .project-section-text {
          font-family: 'Space Mono', monospace;
          font-size: var(--step--1);
          color: var(--color-ink);
          line-height: 1.7;
          max-width: 58ch;
        }
        @media (max-width: 768px) {
          .work { padding: var(--space-xl) var(--space-sm); }
          .project-layout {
            grid-template-columns: 1fr;
          }
          .project-entry--right .project-layout {
            direction: ltr;
          }
          .project-image-wrap {
            max-height: 240px;
          }
        }
      `}</style>
      <section className="work" id="work" aria-label="Selected work">
        <div className="container">
          <header className="work-header">
            <span className="section-number">02 —</span>
            <h2 className="section-title">Work</h2>
          </header>
          <div className="project-list">
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
