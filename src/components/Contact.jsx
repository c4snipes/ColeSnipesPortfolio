import { useEffect, useRef, useState } from 'react'

const EMAIL_ADDRESS = 'cole.snipes@icloud.com'
const RATE_LIMIT_KEY = 'contactAttempts'
const DEVICE_ID_KEY = 'contactDeviceId'
const MAX_ATTEMPTS = 10
const WINDOW_MS = 60 * 60 * 1000

export default function Contact() {
  const ref = useRef(null)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect() } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const recordAttempt = () => {
    if (typeof window === 'undefined') {
      return { allowed: false, error: 'Email sending is unavailable in this environment.' }
    }

    let attempts = []
    try {
      const raw = window.localStorage.getItem(RATE_LIMIT_KEY)
      attempts = raw ? JSON.parse(raw) : []
      if (!Array.isArray(attempts)) {
        attempts = []
      }
    } catch {
      return { allowed: false, error: 'Unable to access browser storage for rate limiting.' }
    }

    const now = Date.now()
    const windowStart = now - WINDOW_MS
    const recent = attempts.filter((timestamp) => typeof timestamp === 'number' && timestamp > windowStart)

    if (recent.length >= MAX_ATTEMPTS) {
      const oldest = Math.min(...recent)
      const retryMs = Math.max(0, oldest + WINDOW_MS - now)
      return {
        allowed: false,
        retryMinutes: Math.ceil(retryMs / 60000),
      }
    }

    const updated = [...recent, now]
    try {
      window.localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(updated))
    } catch {
      return { allowed: false, error: 'Unable to record rate limit in this browser.' }
    }

    return { allowed: true, remaining: MAX_ATTEMPTS - updated.length }
  }

  const getDeviceId = () => {
    if (typeof window === 'undefined') return null
    try {
      const existing = window.localStorage.getItem(DEVICE_ID_KEY)
      if (existing) return existing
      const generated = window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`
      window.localStorage.setItem(DEVICE_ID_KEY, generated)
      return generated
    } catch {
      return null
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus(null)

    const trimmedSubject = subject.trim()
    const trimmedMessage = message.trim()

    if (!trimmedSubject || !trimmedMessage) {
      setStatus({ type: 'error', message: 'Subject and message are required.' })
      return
    }

    const attempt = recordAttempt()
    if (!attempt.allowed) {
      if (attempt.error) {
        setStatus({ type: 'error', message: attempt.error })
        return
      }
      setStatus({
        type: 'error',
        message: `Rate limit reached. Try again in ${attempt.retryMinutes} minute${attempt.retryMinutes === 1 ? '' : 's'}.`,
      })
      return
    }

    const deviceId = getDeviceId()

    setIsSending(true)
    setStatus({ type: 'sending', message: 'Sending message…' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: trimmedSubject,
          message: trimmedMessage,
          deviceId,
          page: window.location.href,
          userAgent: navigator.userAgent,
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Unable to send your message right now.'
        try {
          const data = await response.json()
          if (data?.error) {
            errorMessage = data.error
          }
        } catch {
          // Keep the generic error message.
        }
        setStatus({ type: 'error', message: errorMessage })
        return
      }

      setStatus({
        type: 'success',
        message: `Message sent. ${attempt.remaining} send${attempt.remaining === 1 ? '' : 's'} left this hour.`,
      })
      setSubject('')
      setMessage('')
    } catch {
      setStatus({ type: 'error', message: 'Unable to send your message right now.' })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="contact" id="contact" aria-label="Contact">
      <div className="container">
        <div className="reveal" ref={ref}>
          <span className="section-number">04 —</span>
          <h2 className="section-title">Contact</h2>
          <p className="contact-lead">Let's work together.</p>
          <form className="contact-form" onSubmit={handleSubmit} aria-busy={isSending}>
            <label className="contact-label" htmlFor="contact-subject">
              Subject
            </label>
            <input
              id="contact-subject"
              className="contact-input"
              type="text"
              name="subject"
              autoComplete="off"
              maxLength={140}
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              disabled={isSending}
              required
            />
            <label className="contact-label" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              className="contact-textarea"
              name="message"
              rows={6}
              maxLength={4000}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={isSending}
              required
            />
            <div className="contact-actions">
              <button className="contact-button" type="submit" disabled={isSending}>
                {isSending ? 'Sending…' : 'Send message'}
              </button>
              <span className="contact-limit">10 sends per hour per browser.</span>
            </div>
            {status && (
              <p
                className={`contact-status contact-status--${status.type}`}
                role={status.type === 'error' ? 'alert' : 'status'}
              >
                {status.message}
              </p>
            )}
          </form>
          <div className="contact-links">
            <a href={`mailto:${EMAIL_ADDRESS}`} className="contact-link">{EMAIL_ADDRESS}</a>
            <a href="https://github.com/c4snipes" target="_blank" rel="noopener noreferrer" className="contact-link">github.com/c4snipes</a>
            <a href="https://linkedin.com/in/colesnipes" target="_blank" rel="noopener noreferrer" className="contact-link">linkedin.com/in/colesnipes</a>
          </div>
        </div>
      </div>
    </section>
  )
}
