const MAX_ATTEMPTS = 10
const WINDOW_MS = 60 * 60 * 1000
const rateLimitStore = globalThis.__contactRateLimit ?? new Map()

if (!globalThis.__contactRateLimit) {
  globalThis.__contactRateLimit = rateLimitStore
}

const getClientKey = (req, deviceId) => {
  const forwarded = req.headers['x-forwarded-for']
  const forwardedIp = Array.isArray(forwarded)
    ? forwarded[0]
    : forwarded?.split(',')[0]
  const ip = (forwardedIp ?? req.socket?.remoteAddress ?? 'unknown').trim()
  return `${deviceId || 'unknown'}:${ip}`
}

const cleanAttempts = (timestamps, now) =>
  timestamps.filter((timestamp) => typeof timestamp === 'number' && now - timestamp < WINDOW_MS)

const parseBody = async (req) => {
  if (req.body && typeof req.body === 'object') {
    return req.body
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return null
    }
  }

  let raw = ''
  for await (const chunk of req) {
    raw += chunk
  }
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed.' })
    return
  }

  const body = await parseBody(req)
  if (!body) {
    res.status(400).json({ error: 'Invalid request body.' })
    return
  }

  const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const deviceId = typeof body.deviceId === 'string' ? body.deviceId.trim() : ''
  const page = typeof body.page === 'string' ? body.page.trim() : ''
  const userAgent = typeof body.userAgent === 'string' ? body.userAgent.trim() : ''

  if (!subject || !message) {
    res.status(400).json({ error: 'Subject and message are required.' })
    return
  }

  if (subject.length > 140) {
    res.status(400).json({ error: 'Subject must be 140 characters or fewer.' })
    return
  }

  if (message.length > 4000) {
    res.status(400).json({ error: 'Message must be 4000 characters or fewer.' })
    return
  }

  const clientKey = getClientKey(req, deviceId)
  const now = Date.now()
  const attempts = cleanAttempts(rateLimitStore.get(clientKey) ?? [], now)

  if (attempts.length >= MAX_ATTEMPTS) {
    res.status(429).json({ error: 'Rate limit reached. Try again later.' })
    return
  }

  attempts.push(now)
  rateLimitStore.set(clientKey, attempts)

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM
  const to = process.env.CONTACT_TO

  if (!apiKey || !from || !to) {
    res.status(500).json({ error: 'Email service is not configured.' })
    return
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text: [
        'New portfolio message',
        '',
        `Page: ${page || 'unknown'}`,
        `Device: ${deviceId || 'unknown'}`,
        `User-Agent: ${userAgent || 'unknown'}`,
        '',
        message,
      ].join('\n'),
    }),
  })

  if (!response.ok) {
    res.status(502).json({ error: 'Email service failed to send.' })
    return
  }

  res.status(200).json({ ok: true })
}
