export function getSkillIconsUrl(icons, theme, includeTheme = true) {
  const params = new URLSearchParams()
  params.set('i', Array.isArray(icons) ? icons.join(',') : icons)

  if (includeTheme && (theme === 'dark' || theme === 'light')) {
    params.set('theme', theme)
  }

  return `https://skillicons.dev/icons?${params.toString()}`
}
