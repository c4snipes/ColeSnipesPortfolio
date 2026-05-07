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
