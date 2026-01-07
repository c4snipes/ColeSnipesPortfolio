import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { slugify } from '../utils/slugify'
import coursework from '../data/coursework.json'

function normalizeType(t) {
  if (!t) return 'Other'
  const s = String(t).toLowerCase()
  if (s.includes('math')) return 'Math'
  if (s.includes('cs') || s.includes('core') || s.includes('software') || s.includes('systems') || s.includes('elective')) return 'CS'
  return 'Other'
}

export default function Coursework() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [typeFilter, setTypeFilter] = useState('all')

  // Sync search with URL params
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setSearch(q)
  }, [searchParams])

  const courses = useMemo(() => {
    return coursework.map(c => ({ ...c, typeNorm: normalizeType(c.type) }))
  }, [])

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesType = typeFilter === 'all' || c.typeNorm.toLowerCase() === typeFilter.toLowerCase()
      const q = search.toLowerCase()
      const hay = [c.code, c.title, c.course, c.term, c.type, c.desc, ...(c.topics || [])].filter(Boolean).join(' ').toLowerCase()
      const matchesSearch = !q || hay.includes(q)
      return matchesType && matchesSearch
    })
  }, [courses, search, typeFilter])

  const clearFilters = () => {
    setSearch('')
    setTypeFilter('all')
    setSearchParams({})
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearch(value)
    if (value) {
      setSearchParams({ q: value })
    } else {
      setSearchParams({})
    }
  }

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
            <h1 className="section-title">Coursework</h1>
            <p className="text-muted">Academic journey at University of Indianapolis</p>
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
            placeholder="Search courses..."
            value={search}
            onChange={handleSearchChange}
            aria-label="Search courses"
          />
          <select
            className="select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by type"
          >
            <option value="all">All types</option>
            <option value="CS">Computer Science</option>
            <option value="Math">Mathematics</option>
            <option value="Other">Other</option>
          </select>
          {(search || typeFilter !== 'all') && (
            <motion.button
              className="btn btn-outline"
              onClick={clearFilters}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Clear
            </motion.button>
          )}
        </motion.section>

        <section className="grid grid-3 page-bottom" aria-live="polite">
          {filteredCourses.length === 0 ? (
            <motion.article
              className="course-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted">No courses found.</p>
            </motion.article>
          ) : (
            filteredCourses.map((course, index) => (
              <motion.article
                key={course.code || course.title || index}
                className="course-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                whileHover={{ scale: 1.01, borderColor: 'var(--accent-secondary)' }}
              >
                <div className="course-type">{course.typeNorm || course.type || 'Course'}</div>
                <div className="course-name">
                  {course.code ? `${course.code}: ` : ''}{course.title || course.course || 'Untitled'}
                </div>
                <p className="text-muted" style={{ fontSize: '0.9rem', margin: '8px 0' }}>
                  {course.term || course.year || ''}
                </p>
                {course.topics?.length > 0 && (
                  <div className="course-topics">
                    {course.topics.map(topic => (
                      <Link
                        key={topic}
                        to={`/skills#skill-${slugify(topic)}`}
                        className="course-topic course-topic-link"
                      >
                        {topic}
                      </Link>
                    ))}
                  </div>
                )}
              </motion.article>
            ))
          )}
        </section>
      </main>
    </PageTransition>
  )
}
