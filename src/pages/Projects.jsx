import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import PageTransition from '../components/PageTransition'
import projects from '../data/projects.json'

export default function Projects() {
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')

  const allTags = useMemo(() => {
    const tags = new Set()
    projects.forEach(p => p.tags.forEach(t => tags.add(t)))
    return ['all', ...Array.from(tags).sort()]
  }, [])

  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        const matchesSearch = !search ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.desc.toLowerCase().includes(search.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))

        const matchesTag = selectedTag === 'all' || p.tags.includes(selectedTag)

        return matchesSearch && matchesTag
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [search, selectedTag])

  return (
    <PageTransition>
      <main className="container page-content">
        <motion.header
          className="projects-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="section-title">Projects</h1>
            <p className="text-muted">A collection of my work and experiments</p>
          </div>
        </motion.header>

        <motion.section
          className="filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <input
            type="text"
            className="input"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search projects"
          />
          <select
            className="select"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            aria-label="Filter by technology"
          >
            {allTags.map(tag => (
              <option key={tag} value={tag}>
                {tag === 'all' ? 'All Technologies' : tag}
              </option>
            ))}
          </select>
          {(search || selectedTag !== 'all') && (
            <motion.button
              className="btn btn-outline"
              onClick={() => { setSearch(''); setSelectedTag('all') }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Clear
            </motion.button>
          )}
        </motion.section>

        <section className="grid grid-3 page-bottom">
          {filteredProjects.length === 0 ? (
            <motion.div
              className="project-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted">No projects found matching your criteria.</p>
            </motion.div>
          ) : (
            filteredProjects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))
          )}
        </section>
      </main>
    </PageTransition>
  )
}
