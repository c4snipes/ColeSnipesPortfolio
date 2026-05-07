import { useEffect, useRef, useState } from 'react'

const EMAIL_ADDRESS = 'cole.snipes@icloud.com'
const RATE_LIMIT_KEY = 'contactAttempts'
const WEB3FORMS_KEY = 'be6b21e6-b3a1-443f-9e1e-d53eb9da659f'
const MAX_ATTEMPTS = 10
const WINDOW_MS = 60 * 60 * 1000

export default function Contact() {
  const ref = useRef(null)
  const [email, setEmail] = useState('')
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
      if (!Array.isArray(attempts)) attempts = []
    } catch {
      return { allowed: false, error: 'Unable to access browser storage for rate limiting.' }
    }

    const now = Date.now()
    const recent = attempts.filter((t) => typeof t === 'number' && t > now - WINDOW_MS)

    if (recent.length >= MAX_ATTEMPTS) {
      const retryMs = Math.max(0, Math.min(...recent) + WINDOW_MS - now)
      return { allowed: false, retryMinutes: Math.ceil(retryMs / 60000) }
    }

    try {
      window.localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify([...recent, now]))
    } catch {
      return { allowed: false, error: 'Unable to record rate limit in this browser.' }
    }

    return { allowed: true, remaining: MAX_ATTEMPTS - recent.length - 1 }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus(null)

    const trimmedEmail = email.trim()
    const trimmedSubject = subject.trim()
    const trimmedMessage = message.trim()

    if (!trimmedEmail || !trimmedSubject || !trimmedMessage) {
      setStatus({ type: 'error', message: 'All fields are required.' })
      return
    }

    const attempt = recordAttempt()
    if (!attempt.allowed) {
      setStatus({
        type: 'error',
        message: attempt.error
          ? attempt.error
          : `Rate limit reached. Try again in ${attempt.retryMinutes} minute${attempt.retryMinutes === 1 ? '' : 's'}.`,
      })
      return
    }

    setIsSending(true)
    setStatus({ type: 'sending', message: 'Sending message…' })

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          email: trimmedEmail,
          subject: trimmedSubject,
          message: trimmedMessage,
          from_name: 'ColeSnipes.dev',
          botcheck: false,
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok || !payload?.success) {
        setStatus({ type: 'error', message: payload?.message ?? 'Unable to send your message right now.' })
        return
      }

      setStatus({
        type: 'success',
        message: `Message sent. ${attempt.remaining} send${attempt.remaining === 1 ? '' : 's'} left this hour.`,
      })
      setEmail('')
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
          <span className="section-number">07 —</span>
          <h2 className="section-title">Contact</h2>
          <p className="contact-lead">Let's work together.</p>
          <form className="contact-form" onSubmit={handleSubmit} aria-busy={isSending}>
            {/* Web3Forms honeypot — must be a hidden checkbox named botcheck */}
            <input
              type="checkbox"
              name="botcheck"
              style={{ display: 'none' }}
              tabIndex="-1"
              aria-hidden="true"
              readOnly
            />
            <label className="contact-label" htmlFor="contact-email">
              Your email
            </label>
            <input
              id="contact-email"
              className="contact-input"
              type="email"
              name="email"
              autoComplete="email"
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSending}
              required
            />
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
