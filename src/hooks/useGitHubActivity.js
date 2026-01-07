import { useState, useEffect, useCallback } from 'react'

const GITHUB_USERNAME = 'c4snipes'
const CACHE_KEY = 'github_activity_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useGitHubActivity() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchGitHubData = useCallback(async () => {
    try {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { data: cachedData, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION) {
          setData(cachedData)
          setLoading(false)
          return
        }
      }

      setLoading(true)

      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      if (!userResponse.ok) throw new Error('Failed to fetch user data')
      const userData = await userResponse.json()

      // Fetch recent repos
      const reposResponse = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=5`
      )
      if (!reposResponse.ok) throw new Error('Failed to fetch repos')
      const reposData = await reposResponse.json()

      // Fetch recent events (commits, etc.)
      const eventsResponse = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=30`
      )
      if (!eventsResponse.ok) throw new Error('Failed to fetch events')
      const eventsData = await eventsResponse.json()

      // Process commits from push events
      const recentCommits = eventsData
        .filter(event => event.type === 'PushEvent')
        .slice(0, 10)
        .flatMap(event =>
          event.payload.commits.map(commit => ({
            message: commit.message.split('\n')[0].substring(0, 60),
            repo: event.repo.name.split('/')[1],
            date: new Date(event.created_at),
            sha: commit.sha.substring(0, 7)
          }))
        )
        .slice(0, 5)

      // Generate contribution data (simplified - GitHub API doesn't provide this directly)
      // We'll use events to approximate
      const contributionDays = generateContributionData(eventsData)

      // Get current project
      const currentProject = reposData[0] ? {
        name: reposData[0].name,
        description: reposData[0].description,
        url: reposData[0].html_url,
        language: reposData[0].language,
        stars: reposData[0].stargazers_count,
        forks: reposData[0].forks_count
      } : null

      const result = {
        user: {
          name: userData.name || userData.login,
          avatar: userData.avatar_url,
          bio: userData.bio,
          publicRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following
        },
        recentRepos: reposData.slice(0, 5).map(repo => ({
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          language: repo.language,
          stars: repo.stargazers_count,
          updatedAt: new Date(repo.updated_at)
        })),
        recentCommits,
        currentProject,
        contributionDays,
        totalContributions: eventsData.length
      }

      // Cache the result
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: result,
        timestamp: Date.now()
      }))

      setData(result)
      setError(null)
    } catch (err) {
      console.error('GitHub API error:', err)
      setError(err.message)

      // Try to use cached data even if expired
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { data: cachedData } = JSON.parse(cached)
        setData(cachedData)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGitHubData()
  }, [fetchGitHubData])

  return { data, loading, error, refetch: fetchGitHubData }
}

// Generate simplified contribution data from events
function generateContributionData(events) {
  const days = []
  const today = new Date()
  const eventDates = events.map(e => new Date(e.created_at).toDateString())

  // Generate last 90 days
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toDateString()

    // Count events on this day
    const count = eventDates.filter(d => d === dateStr).length

    days.push({
      date: date,
      count: count,
      level: count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4
    })
  }

  return days
}

export default useGitHubActivity
