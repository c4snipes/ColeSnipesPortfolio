import { useState, useEffect, useCallback } from 'react'

export function useTypewriter(phrases, options = {}) {
  const { typeSpeed = 80, deleteSpeed = 40, pauseTime = 2000 } = options
  const [text, setText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const phrase = phrases[phraseIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < phrase.length) {
          setText(phrase.slice(0, text.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        if (text.length > 0) {
          setText(text.slice(0, -1))
        } else {
          setIsDeleting(false)
          setPhraseIndex((prev) => (prev + 1) % phrases.length)
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed)

    return () => clearTimeout(timeout)
  }, [text, phraseIndex, isDeleting, phrases, typeSpeed, deleteSpeed, pauseTime])

  return text
}
