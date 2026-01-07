import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { achievements, getAchievementById } from '../data/achievements'

const AchievementContext = createContext(null)

const STORAGE_KEY = 'cole-portfolio-achievements'
const PAGES_KEY = 'cole-portfolio-visited-pages'
const PROJECTS_KEY = 'cole-portfolio-viewed-projects'

export function AchievementProvider({ children }) {
  const [unlockedIds, setUnlockedIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [visitedPages, setVisitedPages] = useState(() => {
    try {
      const stored = localStorage.getItem(PAGES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [viewedProjects, setViewedProjects] = useState(() => {
    try {
      const stored = localStorage.getItem(PROJECTS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [pendingToast, setPendingToast] = useState(null)

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedIds))
  }, [unlockedIds])

  useEffect(() => {
    localStorage.setItem(PAGES_KEY, JSON.stringify(visitedPages))
  }, [visitedPages])

  useEffect(() => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(viewedProjects))
  }, [viewedProjects])

  // Unlock an achievement
  const unlock = useCallback((id) => {
    if (unlockedIds.includes(id)) return false

    const achievement = getAchievementById(id)
    if (!achievement) return false

    setUnlockedIds(prev => [...prev, id])
    setPendingToast(achievement)

    // Check for completionist
    const newUnlocked = [...unlockedIds, id]
    const nonCompletionist = achievements.filter(a => a.id !== 'completionist')
    if (nonCompletionist.every(a => newUnlocked.includes(a.id))) {
      setTimeout(() => unlock('completionist'), 2000)
    }

    return true
  }, [unlockedIds])

  // Track page visits
  const trackPageVisit = useCallback((pageName) => {
    if (!visitedPages.includes(pageName)) {
      const newPages = [...visitedPages, pageName]
      setVisitedPages(newPages)

      // Check for explorer achievement (4 pages)
      if (newPages.length >= 4 && !unlockedIds.includes('explorer')) {
        setTimeout(() => unlock('explorer'), 500)
      }
    }
  }, [visitedPages, unlockedIds, unlock])

  // Track project views
  const trackProjectView = useCallback((projectId) => {
    if (!viewedProjects.includes(projectId)) {
      const newProjects = [...viewedProjects, projectId]
      setViewedProjects(newProjects)

      // Check for deep-diver achievement (3 projects)
      if (newProjects.length >= 3 && !unlockedIds.includes('project-viewer')) {
        setTimeout(() => unlock('project-viewer'), 500)
      }
    }
  }, [viewedProjects, unlockedIds, unlock])

  // Clear the pending toast
  const clearToast = useCallback(() => {
    setPendingToast(null)
  }, [])

  // Check if achievement is unlocked
  const isUnlocked = useCallback((id) => {
    return unlockedIds.includes(id)
  }, [unlockedIds])

  // Reset all achievements (for testing)
  const resetAll = useCallback(() => {
    setUnlockedIds([])
    setVisitedPages([])
    setViewedProjects([])
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(PAGES_KEY)
    localStorage.removeItem(PROJECTS_KEY)
  }, [])

  const value = {
    unlockedIds,
    unlock,
    isUnlocked,
    pendingToast,
    clearToast,
    trackPageVisit,
    trackProjectView,
    visitedPages,
    viewedProjects,
    resetAll,
    allAchievements: achievements
  }

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  )
}

export function useAchievements() {
  const context = useContext(AchievementContext)
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider')
  }
  return context
}
