import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAchievements } from '../../context/AchievementContext'
import './Achievements.css'

export default function AchievementToast() {
  const { pendingToast, clearToast } = useAchievements()

  useEffect(() => {
    if (pendingToast) {
      const timer = setTimeout(() => {
        clearToast()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [pendingToast, clearToast])

  return (
    <AnimatePresence>
      {pendingToast && (
        <motion.div
          className="achievement-toast"
          role="alert"
          aria-live="polite"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div className="achievement-toast-icon">
            {pendingToast.icon}
          </div>
          <div className="achievement-toast-content">
            <span className="achievement-toast-label">Achievement Unlocked!</span>
            <span className="achievement-toast-title">{pendingToast.title}</span>
            <span className="achievement-toast-desc">{pendingToast.description}</span>
          </div>
          <div className="achievement-toast-points">
            +{pendingToast.points}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
