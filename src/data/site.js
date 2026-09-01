/**
 * site.js
 *
 * Single source of truth for identity and off-site links.
 *
 * These URLs previously lived inline in both Hero.jsx and Contact.jsx and drifted:
 * the contact block shipped `linkedin.com/in/colesnipes` while the hero shipped
 * `linkedin.com/in/cole-snipes`, so one of the two was always a dead link. The
 * hyphenated form is authoritative — it is what the resume PDF and README use.
 *
 * SITE_URL must stay absolute and in sync with the og:url / canonical tags in
 * index.html; social unfurlers fetch og:image with no page context to resolve
 * a relative path against.
 */

export const SITE_URL = 'https://colesnipes.dev'

export const EMAIL = 'cole.snipes@icloud.com'

export const GITHUB_URL = 'https://github.com/c4snipes'
export const GITHUB_LABEL = 'github.com/c4snipes'

export const LINKEDIN_URL = 'https://www.linkedin.com/in/cole-snipes/'
export const LINKEDIN_LABEL = 'linkedin.com/in/cole-snipes'

export const RESUME_URL = '/assets/Cole_Snipes_Resume.pdf'
