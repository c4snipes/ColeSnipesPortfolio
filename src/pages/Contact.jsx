import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import PageTransition from '../components/PageTransition'

const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/Cole.Snipes@icloud.com'

export default function Contact() {
  const formRef = useRef(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: '', message: '' })
  const [sending, setSending] = useState(false)

  const onChange = (key) => (event) => {
    setForm(prev => ({ ...prev, [key]: event.target.value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address'
    }
    if (!form.message.trim()) next.message = 'Message is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    try {
      setSending(true)
      setStatus({ type: '', message: '' })

      const response = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `Portfolio contact from ${form.name || 'visitor'}`,
          _template: 'table'
        })
      })

      const result = await response.json()

      if (result.success) {
        setStatus({
          type: 'success',
          message: 'Message sent successfully. Thanks for reaching out!'
        })
        setForm({ name: '', email: '', message: '' })
        setErrors({})
      } else {
        throw new Error(result.message || 'Submission failed')
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <PageTransition>
      <main className="container page-content">
        <motion.header
          className="projects-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <div>
            <h1 className="section-title">Contact Me</h1>
            <p className="text-muted">Send a message and I will get back to you soon.</p>
          </div>
        </motion.header>

        <Card elevation={0} sx={{ border: '1px solid var(--ring)', borderRadius: '16px', background: 'var(--bg-elevated)', maxWidth: 600, margin: '0 auto' }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Box component="form" onSubmit={onSubmit} noValidate ref={formRef}>
              <Stack spacing={2.5}>
                {status.message && <Alert severity={status.type || 'info'}>{status.message}</Alert>}

                <TextField
                  name="name"
                  label="Your Name"
                  value={form.name}
                  onChange={onChange('name')}
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                />

                <TextField
                  type="email"
                  name="email"
                  label="Email"
                  value={form.email}
                  onChange={onChange('email')}
                  fullWidth
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                />

                <TextField
                  name="message"
                  label="Message"
                  value={form.message}
                  onChange={onChange('message')}
                  fullWidth
                  required
                  multiline
                  minRows={6}
                  placeholder="Write your message here..."
                  error={!!errors.message}
                  helperText={errors.message}
                />

                <Button type="submit" variant="contained" size="large" fullWidth disabled={sending}>
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </main>
    </PageTransition>
  )
}
