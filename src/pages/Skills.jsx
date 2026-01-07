import { useState, useMemo, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import SkillRadar from '../components/SkillRadar/SkillRadar'
import GitHubWidget from '../components/GitHubActivity/GitHubWidget'
import { useTheme } from '../hooks/useTheme'
import { useAchievements } from '../context/AchievementContext'
import { slugify } from '../utils/slugify'
import skills from '../data/skills.json'
import coursework from '../data/coursework.json'

const categoryIcons = {
  'Programming Languages': '💻',
  'Frameworks & Libraries': '📚',
  'Systems & Tools': '🛠️',
  'Core CS Topics': '🧠',
  'UI/UX & Frontend': '🎨',
  'Course Topics': '📖'
}

export default function Skills() {
  const [search, setSearch] = useState('')
  const [openCategories, setOpenCategories] = useState(new Set(skills.map(c => c.category)))
  const [highlightedSkill, setHighlightedSkill] = useState(null)
  const [visitedCategories, setVisitedCategories] = useState(new Set())
  const { theme } = useTheme()
  const { unlock } = useAchievements()
  const location = useLocation()
  const skillRefs = useRef({})

  // Add course topics from coursework
  const allSkills = useMemo(() => {
    const topics = new Set()
    coursework.forEach(c => (c.topics || []).forEach(t => topics.add(t)))
    const courseTopics = [...topics].sort().map(name => ({ name, keywords: [] }))

    if (courseTopics.length > 0) {
      return [...skills, { category: 'Course Topics', items: courseTopics }]
    }
    return skills
  }, [])

  // Handle hash navigation
  useEffect(() => {
    const hash = location.hash.slice(1) // Remove the #
    if (!hash) return

    // Find the skill matching the hash
    let foundCategory = null
    let foundSkillName = null

    for (const category of allSkills) {
      for (const skill of category.items) {
        if (`skill-${slugify(skill.name)}` === hash) {
          foundCategory = category.category
          foundSkillName = skill.name
          break
        }
      }
      if (foundCategory) break
    }

    if (foundCategory && foundSkillName) {
      // Expand the category containing the skill
      setOpenCategories(prev => new Set([...prev, foundCategory]))
      setHighlightedSkill(foundSkillName)

      // Scroll to the skill after a short delay to allow rendering
      setTimeout(() => {
        const element = skillRefs.current[foundSkillName]
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 300)

      // Remove highlight after animation
      setTimeout(() => {
        setHighlightedSkill(null)
      }, 3000)
    }
  }, [location.hash, allSkills])

  const filteredSkills = useMemo(() => {
    if (!search) return allSkills
    const q = search.toLowerCase()
    return allSkills.map(c => ({
      ...c,
      items: c.items.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.keywords || []).join(' ').toLowerCase().includes(q)
      )
    })).filter(c => c.items.length > 0)
  }, [search, allSkills])

  const toggleCategory = (category) => {
    // Track visited categories for skill-master achievement
    setVisitedCategories(prev => {
      const next = new Set(prev)
      next.add(category)
      // Unlock skill-master when all 6 categories have been visited
      if (next.size >= 6) {
        unlock('skill-master')
      }
      return next
    })

    setOpenCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const expandAll = () => setOpenCategories(new Set(allSkills.map(c => c.category)))
  const collapseAll = () => setOpenCategories(new Set())

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
            <h1 className="section-title">Skills & Technologies</h1>
            <p className="text-muted">Tools, languages, and frameworks I work with</p>
          </div>
        </motion.header>

        {/* Tech Icons Showcase */}
        <motion.div
          className="skills-showcase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.img
            src={`https://skillicons.dev/icons?i=python,java,js,c,cpp,rust,html,css,docker,git&theme=${theme}`}
            alt="Tech Stack"
            whileHover={{ scale: 1.02 }}
          />
        </motion.div>

        {/* Skill Radar and GitHub Activity */}
        <motion.div
          className="skills-widgets"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <SkillRadar
            onSkillSelect={(skillName) => {
              setSearch(skillName)
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
            }}
          />
          <GitHubWidget />
        </motion.div>

        <motion.section
          className="filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <input
            type="text"
            className="input"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search skills"
          />
          <motion.button
            className="btn btn-outline"
            onClick={expandAll}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Expand All
          </motion.button>
          <motion.button
            className="btn btn-outline"
            onClick={collapseAll}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Collapse All
          </motion.button>
        </motion.section>

        <section className="page-bottom">
          {filteredSkills.map((category, catIndex) => (
            <motion.details
              key={category.category}
              className="skill-category"
              open={openCategories.has(category.category)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: catIndex * 0.05 }}
            >
              <summary onClick={(e) => { e.preventDefault(); toggleCategory(category.category) }}>
                <span className="category-icon">{categoryIcons[category.category] || '📦'}</span>
                <span>{category.category}</span>
                <span className="category-count">({category.items.length})</span>
              </summary>
              <AnimatePresence>
                {openCategories.has(category.category) && (
                  <motion.div
                    className="grid grid-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {category.items.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        id={`skill-${slugify(skill.name)}`}
                        ref={(el) => { skillRefs.current[skill.name] = el }}
                        className={`skill-card ${highlightedSkill === skill.name ? 'skill-card-highlighted' : ''}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          boxShadow: highlightedSkill === skill.name
                            ? '0 0 0 2px var(--accent), 0 0 20px var(--glow)'
                            : 'none'
                        }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span className="skill-name">{skill.name}</span>
                          {Number.isFinite(skill.level) && (
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                              Level {skill.level}/5
                            </span>
                          )}
                        </div>
                        {Number.isFinite(skill.level) && (
                          <div className="skill-bar">
                            <motion.div
                              className="skill-bar-fill"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${Math.min(5, Math.max(0, skill.level)) * 20}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                        )}
                        {skill.keywords?.length > 0 && (
                          <div className="chips" style={{ marginTop: 8, gap: 4 }}>
                            {skill.keywords.map(k => (
                              <span key={k} className="chip" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                                {k}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.details>
          ))}
        </section>
      </main>
    </PageTransition>
  )
}
