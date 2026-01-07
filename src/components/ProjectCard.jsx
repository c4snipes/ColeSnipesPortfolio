import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { useAchievements } from '../context/AchievementContext'
import { slugify } from '../utils/slugify'

const iconMap = {
  'Python': 'python',
  'JavaScript': 'js',
  'Java': 'java',
  'Rust': 'rust',
  'HTML': 'html',
  'CSS': 'css',
  'Docker': 'docker',
  'Spring Boot': 'spring',
  'Django': 'django',
  'R': 'r',
  'ML': 'tensorflow',
  'Pandas': 'python',
  'WASM': 'wasm',
  'Selenium': 'selenium',
  'Agile': 'git',
  'Excel': 'excel'
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export default function ProjectCard({ project, index = 0 }) {
  const { theme } = useTheme()
  const { trackProjectView } = useAchievements()
  const firstTag = project.tags[0]
  const icon = iconMap[firstTag] || 'github'

  const date = new Date(project.date)
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

  return (
    <motion.article
      className="project-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="project-header">
        <div className="project-icon">
          <img
            src={`https://skillicons.dev/icons?i=${icon}&theme=${theme}`}
            alt={firstTag}
          />
        </div>
        <div className="project-meta">
          <span className="project-date">{dateStr}</span>
        </div>
      </div>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-desc">{truncateText(project.desc, 120)}</p>
      <div className="project-tags">
        {project.tags.map(tag => (
          <Link
            key={tag}
            to={`/skills#skill-${slugify(tag)}`}
            className="tag tag-link"
          >
            {tag}
          </Link>
        ))}
      </div>
      <div className="project-footer">
        <motion.a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => trackProjectView(project.title)}
        >
          View Project
        </motion.a>
      </div>
    </motion.article>
  )
}
