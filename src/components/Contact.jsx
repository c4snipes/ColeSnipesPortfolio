/**
 * Contact.jsx
 *
 * Contact form backed by Web3Forms (https://web3forms.com).
 * Submissions are sent directly from the browser — no serverless function needed.
 * The access key is intentionally public; see Web3Forms FAQ on key exposure.
 *
 * Spam protection:
 * - Web3Forms applies its own server-side filtering on every submission.
 * - Client-side rate limiting: tracks successful sends in localStorage and blocks
 *   after MAX_ATTEMPTS within a rolling WINDOW_MS period. This is a courtesy guard
 *   against accidental double-sends, NOT a security control — anything that skips
 *   this page's JavaScript skips the check too.
 *
 * There is deliberately no honeypot field. A honeypot only works when the browser
 * serializes the form itself; this component builds the JSON body by hand, so a
 * hidden input's value can never reach the request. The previous implementation
 * shipped a hidden `botcheck` checkbox alongside a hardcoded `botcheck: false` in
 * the payload, which meant the field was decorative and the documented protection
 * could never fire.
 *
 * Quota is consumed on SUCCESS only. Charging before the fetch meant a network
 * failure or a Web3Forms outage burned sends the user never got.
 *
 * State:
 * - email, subject, message — controlled inputs
 * - status: { type: 'sending' | 'success' | 'error', message: string } | null
 * - isSending — disables inputs and button during the fetch
 */

import { useEffect, useRef, useState } from 'react'
import { EMAIL, GITHUB_URL, GITHUB_LABEL, LINKEDIN_URL, LINKEDIN_LABEL } from '../data/site'

const RATE_LIMIT_KEY = 'contactAttempts'
const WEB3FORMS_KEY  = 'be6b21e6-b3a1-443f-9e1e-d53eb9da659f'
const MAX_ATTEMPTS   = 10
const WINDOW_MS      = 60 * 60 * 1000 // 1 hour rolling window

/**
 * Reads the send timestamps inside the current rolling window.
 * Returns null when storage is unreadable, which callers treat as "no limit
 * information available" rather than as a failure — a browser with localStorage
 * disabled should still be able to send a message.
 *
 * @returns {number[] | null}
 */
function readAttempts() {
  try {
    const raw = window.localStorage.getItem(RATE_LIMIT_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    const cutoff = Date.now() - WINDOW_MS
    return parsed.filter((t) => typeof t === 'number' && t > cutoff)
  } catch {
    return null
  }
}

/** Appends a successful send to the rolling window. Silently no-ops if storage is unavailable. */
function recordSend(recent) {
  try {
    window.localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify([...recent, Date.now()]))
  } catch {
    /* storage unavailable — the guard degrades to off, which is the intended failure mode */
  }
}

export default function Contact() {
  const ref = useRef(null)
  // Disabling the submit button mid-send drops focus to <body>, stranding
  // keyboard users; this restores it to the control they activated once the
  // request settles, right beside the status message that just updated.
  const buttonRef = useRef(null)
  const [email,     setEmail]     = useState('')
  const [subject,   setSubject]   = useState('')
  const [message,   setMessage]   = useState('')
  const [status,    setStatus]    = useState(null)
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus(null)

    const trimmedEmail   = email.trim()
    const trimmedSubject = subject.trim()
    const trimmedMessage = message.trim()

    if (!trimmedEmail || !trimmedSubject || !trimmedMessage) {
      setStatus({ type: 'error', message: 'All fields are required.' })
      return
    }

    // null means storage is unreadable; fall back to an empty window so the send proceeds.
    const recent = readAttempts() ?? []
    if (recent.length >= MAX_ATTEMPTS) {
      const retryMs = Math.max(0, Math.min(...recent) + WINDOW_MS - Date.now())
      const mins = Math.ceil(retryMs / 60000)
      setStatus({
        type: 'error',
        message: `Rate limit reached. Try again in ${mins} minute${mins === 1 ? '' : 's'}, or email me directly at ${EMAIL}.`,
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
          email:      trimmedEmail,   // sets reply-to in delivered email
          subject:    trimmedSubject,
          message:    trimmedMessage,
          from_name:  'ColeSnipes.dev',
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok || !payload?.success) {
        setStatus({
          type: 'error',
          message: payload?.message ?? `Unable to send right now. You can email me directly at ${EMAIL}.`,
        })
        return
      }

      recordSend(recent)
      const remaining = MAX_ATTEMPTS - recent.length - 1
      setStatus({
        type: 'success',
        message: `Message sent. ${remaining} send${remaining === 1 ? '' : 's'} left this hour.`,
      })
      setEmail('')
      setSubject('')
      setMessage('')
    } catch {
      setStatus({
        type: 'error',
        message: `Unable to send right now. You can email me directly at ${EMAIL}.`,
      })
    } finally {
      setIsSending(false)
      // Wait for React to re-enable the button before focusing it — a disabled
      // element cannot take focus.
      requestAnimationFrame(() => buttonRef.current?.focus())
    }
  }

  return (
    <section className="contact" id="contact" aria-label="Contact">
      <div className="container">
        <div className="reveal" ref={ref}>
          <span className="section-number">06 —</span>
          <h2 className="section-title">Contact</h2>
          <p className="contact-lead">Let's work together.</p>
          <form className="contact-form" onSubmit={handleSubmit} aria-busy={isSending}>

            <label className="contact-label" htmlFor="contact-email">Your email</label>
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

            <label className="contact-label" htmlFor="contact-subject">Subject</label>
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

            <label className="contact-label" htmlFor="contact-message">Message</label>
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
              <button ref={buttonRef} className="contact-button" type="submit" disabled={isSending}>
                {isSending ? 'Sending…' : 'Send message'}
              </button>
              <span className="contact-limit">10 sends per hour per browser.</span>
            </div>

            {/*
              The live region is rendered unconditionally and starts empty. Screen
              readers only announce changes to regions that were already in the
              accessibility tree — a node inserted at the same moment as its text is
              frequently missed entirely.
            */}
            <p
              className={`contact-status${status ? ` contact-status--${status.type}` : ''}`}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {status?.message ?? ''}
            </p>
          </form>

          {/* Direct links below the form — no icons per design brief §5.5 */}
          <div className="contact-links">
            <a href={`mailto:${EMAIL}`} className="contact-link">{EMAIL}</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="contact-link">{GITHUB_LABEL}</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="contact-link">{LINKEDIN_LABEL}</a>
          </div>
        </div>
      </div>
    </section>
  )
}
