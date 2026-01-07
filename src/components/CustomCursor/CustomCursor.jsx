import { useEffect, useState, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'
import './CustomCursor.css'

const cursorVariants = {
  default: {
    scale: 1,
  },
  hover: {
    scale: 1.5,
  },
  click: {
    scale: 0.8,
  }
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [cursorType, setCursorType] = useState('default')
  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const cursorRef = useRef(null)

  // Smooth spring animation for cursor position
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)

  useEffect(() => {
    // Check for touch device
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      )
    }
    checkTouch()

    if (isTouchDevice) return

    const updateCursorPosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    // Detect section for cursor style
    const detectSection = (e) => {
      const target = e.target
      const section = target.closest('section')
      const isInteractive = target.closest('a, button, [role="button"], .clickable, .card, .project-card')
      const isTerminal = target.closest('.terminal') || target.closest('[data-cursor="terminal"]')
      const isCode = target.closest('pre, code, .code-block')

      if (isInteractive) {
        setCursorType('hover')
      } else if (isTerminal) {
        setCursorType('terminal')
      } else if (isCode) {
        setCursorType('code')
      } else if (section?.classList.contains('hero')) {
        setCursorType('hero')
      } else if (section?.classList.contains('projects-section')) {
        setCursorType('projects')
      } else {
        setCursorType('default')
      }
    }

    document.addEventListener('mousemove', updateCursorPosition)
    document.addEventListener('mousemove', detectSection)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition)
      document.removeEventListener('mousemove', detectSection)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isTouchDevice, cursorX, cursorY])

  // Don't render on touch devices
  if (isTouchDevice) return null

  const getCursorContent = () => {
    switch (cursorType) {
      case 'hero':
        return '<  />'
      case 'projects':
        return '{  }'
      case 'terminal':
        return '_'
      case 'code':
        return '{ }'
      case 'hover':
        return ''
      default:
        return ''
    }
  }

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className={`custom-cursor ${cursorType} ${isClicking ? 'clicking' : ''}`}
        style={{
          x: cursorX,
          y: cursorY,
          opacity: isVisible ? 1 : 0,
        }}
        variants={cursorVariants}
        animate={isClicking ? 'click' : cursorType === 'hover' ? 'hover' : 'default'}
      >
        <span className="cursor-content">{getCursorContent()}</span>
      </motion.div>

      {/* Cursor trail/glow */}
      <motion.div
        className={`cursor-glow ${cursorType}`}
        style={{
          x: cursorX,
          y: cursorY,
          opacity: isVisible ? 0.5 : 0,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />
    </>
  )
}
