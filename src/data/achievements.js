// Achievement definitions for Xbox-style achievement system
export const achievements = [
  {
    id: 'first-visit',
    title: 'First Contact',
    description: 'Welcome to the portfolio!',
    icon: '🌟',
    points: 10
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Visited all pages',
    icon: '🧭',
    points: 25,
    requirement: { type: 'pages', count: 4 }
  },
    {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Embraced the dark side',
    icon: '🌙',
    points: 10
  },
  {
    id: 'day-walker',
    title: 'Day Walker',
    description: 'Let there be light',
    icon: '☀️',
    points: 10
  },
  {
    id: 'project-viewer',
    title: 'Deep Diver',
    description: 'Viewed 3+ projects',
    icon: '🔍',
    points: 15,
    requirement: { type: 'projects', count: 3 }
  },
    {
    id: 'skill-master',
    title: 'Skill Seeker',
    description: 'Explored all skill categories',
    icon: '📚',
    points: 15
  },
    {
    id: 'completionist',
    title: 'Completionist',
    description: 'Unlocked all achievements',
    icon: '🏆',
    points: 100
  }
]

export const getAchievementById = (id) => achievements.find(a => a.id === id)

export const getTotalPoints = (unlockedIds) => {
  return achievements
    .filter(a => unlockedIds.includes(a.id))
    .reduce((sum, a) => sum + a.points, 0)
}
