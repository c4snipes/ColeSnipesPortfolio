import { motion } from 'framer-motion'
import useGitHubActivity from '../../hooks/useGitHubActivity'
import './GitHubWidget.css'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
}

export default function GitHubWidget() {
  const { data, loading, error } = useGitHubActivity()

  if (loading) {
    return <GitHubWidgetSkeleton />
  }

  if (error && !data) {
    return (
      <div className="github-widget github-widget-error">
        <p>Unable to load GitHub activity</p>
        <a href="https://github.com/c4snipes" target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </div>
    )
  }

  if (!data) return null

  return (
    <motion.div
      className="github-widget"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {/* Header */}
      <motion.div className="github-header" variants={itemVariants}>
        <div className="github-user">
          <img
            src={data.user.avatar}
            alt={data.user.name}
            className="github-avatar"
          />
          <div className="github-user-info">
            <h3>{data.user.name}</h3>
            <a
              href="https://github.com/c4snipes"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              @c4snipes
            </a>
          </div>
        </div>
        <div className="github-stats">
          <div className="github-stat">
            <span className="github-stat-value">{data.user.publicRepos}</span>
            <span className="github-stat-label">Repos</span>
          </div>
          <div className="github-stat">
            <span className="github-stat-value">{data.user.followers}</span>
            <span className="github-stat-label">Followers</span>
          </div>
        </div>
      </motion.div>

      {/* Contribution Graph */}
      <motion.div className="github-contributions" variants={itemVariants}>
        <h4>Activity (Last 90 Days)</h4>
        <div className="contribution-graph">
          {data.contributionDays.map((day, index) => (
            <div
              key={index}
              className={`contribution-cell level-${day.level}`}
              title={`${day.date.toLocaleDateString()}: ${day.count} contributions`}
            />
          ))}
        </div>
        <div className="contribution-legend">
          <span>Less</span>
          <div className="contribution-cell level-0" />
          <div className="contribution-cell level-1" />
          <div className="contribution-cell level-2" />
          <div className="contribution-cell level-3" />
          <div className="contribution-cell level-4" />
          <span>More</span>
        </div>
      </motion.div>

      {/* Current Project */}
      {data.currentProject && (
        <motion.div className="github-current" variants={itemVariants}>
          <h4>Currently Working On</h4>
          <a
            href={data.currentProject.url}
            target="_blank"
            rel="noopener noreferrer"
            className="current-project"
          >
            <div className="project-name">
              <span className="repo-icon">📁</span>
              {data.currentProject.name}
            </div>
            {data.currentProject.description && (
              <p className="project-desc">{data.currentProject.description}</p>
            )}
            <div className="project-meta">
              {data.currentProject.language && (
                <span className="project-language">
                  <span className={`lang-dot ${data.currentProject.language.toLowerCase()}`} />
                  {data.currentProject.language}
                </span>
              )}
              {data.currentProject.stars > 0 && (
                <span className="project-stars">⭐ {data.currentProject.stars}</span>
              )}
            </div>
          </a>
        </motion.div>
      )}

      {/* Recent Commits */}
      <motion.div className="github-commits" variants={itemVariants}>
        <h4>Recent Commits</h4>
        <ul className="commits-list">
          {data.recentCommits.map((commit, index) => (
            <li key={index} className="commit-item">
              <span className="commit-sha">{commit.sha}</span>
              <span className="commit-message">{commit.message}</span>
              <span className="commit-repo">{commit.repo}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* View More Link */}
      <motion.a
        href="https://github.com/c4snipes"
        target="_blank"
        rel="noopener noreferrer"
        className="github-view-more"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View Full GitHub Profile →
      </motion.a>
    </motion.div>
  )
}

// Loading skeleton
function GitHubWidgetSkeleton() {
  return (
    <div className="github-widget github-widget-skeleton">
      <div className="github-header">
        <div className="skeleton-avatar" />
        <div className="skeleton-user-info">
          <div className="skeleton-line" style={{ width: '120px', height: '20px' }} />
          <div className="skeleton-line" style={{ width: '80px', height: '14px' }} />
        </div>
      </div>
      <div className="skeleton-contributions">
        {Array.from({ length: 90 }).map((_, i) => (
          <div key={i} className="skeleton-cell" />
        ))}
      </div>
      <div className="skeleton-commits">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-line" style={{ width: '100%', height: '24px', marginBottom: '8px' }} />
        ))}
      </div>
    </div>
  )
}
