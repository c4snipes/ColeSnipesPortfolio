import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import ScrollProgress from './ScrollProgress'
import AchievementToast from './Achievements/AchievementToast'
import CustomCursor from './CustomCursor/CustomCursor'
import { useAchievements } from '../context/AchievementContext'

export default function Layout() {
  const location = useLocation()
  const { unlock, trackPageVisit, isUnlocked } = useAchievements()

  // Track page visits for Explorer achievement
  useEffect(() => {
    const pageName = location.pathname === '/' ? 'home' : location.pathname.slice(1)
    trackPageVisit(pageName)
  }, [location.pathname, trackPageVisit])

  // First visit achievement
  useEffect(() => {
    if (!isUnlocked('first-visit')) {
      const timer = setTimeout(() => {
        unlock('first-visit')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [unlock, isUnlocked])

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Nav />
      <Outlet />
      <Footer />
      <AchievementToast />
    </>
  )
}
