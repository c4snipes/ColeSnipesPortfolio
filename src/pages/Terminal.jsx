import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { commands, handleUnknown } from '../data/terminalCommands'
import { useAchievements } from '../context/AchievementContext'
import './Terminal.css'

const WELCOME_MESSAGE = `
Welcome to Cole's Interactive Terminal! 🖥️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Type 'help' to see available commands.
Type 'exit' to return to the portfolio.

`

export default function Terminal() {
  const [history, setHistory] = useState([{ type: 'welcome', content: WELCOME_MESSAGE }])
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isTyping, setIsTyping] = useState(false)
  const [matrixActive, setMatrixActive] = useState(false)
  const inputRef = useRef(null)
  const terminalRef = useRef(null)
  const navigate = useNavigate()
  const { unlock } = useAchievements()

  // Focus input on mount and click
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Unlock achievement on first command
  const trackTerminalUse = useCallback(() => {
    unlock('terminal-user')
  }, [unlock])

  // Typewriter effect for output
  const typeOutput = useCallback((content, type, callback) => {
    if (type === 'clear' || type === 'matrix' || type === 'exit' || type === 'navigate') {
      callback?.()
      return
    }

    setIsTyping(true)
    const lines = content.split('\n')
    let currentIndex = 0

    const typeNextLine = () => {
      if (currentIndex < lines.length) {
        setHistory(prev => {
          const newHistory = [...prev]
          const lastEntry = newHistory[newHistory.length - 1]
          if (lastEntry && lastEntry.isTyping) {
            lastEntry.content += (currentIndex > 0 ? '\n' : '') + lines[currentIndex]
          }
          return newHistory
        })
        currentIndex++
        setTimeout(typeNextLine, 15) // Speed of typing
      } else {
        setIsTyping(false)
        setHistory(prev => {
          const newHistory = [...prev]
          const lastEntry = newHistory[newHistory.length - 1]
          if (lastEntry) {
            lastEntry.isTyping = false
          }
          return newHistory
        })
        callback?.()
      }
    }

    // Start with empty typing entry
    setHistory(prev => [...prev, { type, content: '', isTyping: true }])
    typeNextLine()
  }, [])

  // Execute command
  const executeCommand = useCallback((cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    const [command, ...args] = trimmedCmd.split(' ')

    // Track terminal usage for achievement
    trackTerminalUse()

    // Add command to history display
    setHistory(prev => [...prev, { type: 'command', content: cmd }])

    // Add to command history for up/down navigation
    setCommandHistory(prev => [...prev, cmd])
    setHistoryIndex(-1)

    // Handle special output types
    const handleResult = (result) => {
      switch (result.type) {
        case 'clear':
          setHistory([{ type: 'welcome', content: WELCOME_MESSAGE }])
          break
        case 'exit':
        case 'navigate':
          setTimeout(() => navigate(result.route || '/'), 500)
          typeOutput(`Navigating to ${result.route || '/'}...`, 'info')
          break
        case 'matrix':
          setMatrixActive(true)
          setTimeout(() => {
            setMatrixActive(false)
            setHistory(prev => [...prev, { type: 'fun', content: 'Wake up, Neo...\nThe Matrix has you...\n\nJust kidding. Welcome back! 😄' }])
          }, 3000)
          break
        case 'open':
          window.open(result.url, '_blank')
          typeOutput(result.output, result.type)
          break
        default:
          typeOutput(result.output, result.type)
      }

      // Check for secret finder achievement
      if (['matrix', 'hack', 'cowsay'].includes(command)) {
        unlock('secret-finder')
      }

      // Check for speed-reader achievement (help command)
      if (command === 'help') {
        unlock('speed-reader')
      }
    }

    // Find and execute command
    if (command === '') {
      return
    }

    // Special handling for hire (two word command)
    if (command === 'hire' || (command === 'sudo' && args[0] === 'hire')) {
      const cmdObj = commands[command]
      if (cmdObj) {
        handleResult(cmdObj.execute(args))
        return
      }
    }

    const cmdObj = commands[command]
    if (cmdObj) {
      handleResult(cmdObj.execute(args))
    } else {
      handleResult(handleUnknown(command))
    }
  }, [navigate, trackTerminalUse, typeOutput, unlock])

  // Handle key press
  const handleKeyDown = (e) => {
    if (isTyping) {
      e.preventDefault()
      return
    }

    switch (e.key) {
      case 'Enter':
        executeCommand(input)
        setInput('')
        break
      case 'ArrowUp':
        e.preventDefault()
        if (commandHistory.length > 0) {
          const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
          setHistoryIndex(newIndex)
          setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1
          setHistoryIndex(newIndex)
          setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
        } else if (historyIndex === 0) {
          setHistoryIndex(-1)
          setInput('')
        }
        break
      case 'Tab':
        e.preventDefault()
        // Simple tab completion
        const availableCommands = Object.keys(commands)
        const matches = availableCommands.filter(c => c.startsWith(input.toLowerCase()))
        if (matches.length === 1) {
          setInput(matches[0])
        }
        break
      case 'l':
        if (e.ctrlKey) {
          e.preventDefault()
          setHistory([{ type: 'welcome', content: WELCOME_MESSAGE }])
        }
        break
      default:
        break
    }
  }

  // Focus input when clicking anywhere in terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus()
  }

  return (
    <PageTransition>
      <div className="terminal-page" data-cursor="terminal">
        <motion.div
          className={`terminal-window ${matrixActive ? 'matrix-active' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleTerminalClick}
        >
          {/* Terminal header */}
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="terminal-btn red" onClick={() => navigate('/')} />
              <span className="terminal-btn yellow" />
              <span className="terminal-btn green" />
            </div>
            <span className="terminal-title">guest@cole-portfolio: ~</span>
          </div>

          {/* Terminal body */}
          <div className="terminal-body" ref={terminalRef}>
            {/* Matrix effect overlay */}
            {matrixActive && <MatrixRain />}

            {/* History */}
            {history.map((entry, index) => (
              <div key={index} className={`terminal-entry terminal-${entry.type}`}>
                {entry.type === 'command' ? (
                  <div className="terminal-command-line">
                    <span className="terminal-prompt">guest@cole:~$</span>
                    <span className="terminal-command">{entry.content}</span>
                  </div>
                ) : (
                  <pre className="terminal-output">{entry.content}</pre>
                )}
              </div>
            ))}

            {/* Input line */}
            {!isTyping && !matrixActive && (
              <div className="terminal-input-line">
                <span className="terminal-prompt">guest@cole:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  className="terminal-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                />
                <span className="terminal-cursor" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Help hint */}
        <motion.div
          className="terminal-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Type <code>help</code> for commands • <code>exit</code> to return
        </motion.div>
      </div>
    </PageTransition>
  )
}

// Matrix rain effect component
function MatrixRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*(){}[]<>?/\\|'
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops = Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#0f0'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)
    return () => clearInterval(interval)
  }, [])

  return <canvas ref={canvasRef} className="matrix-canvas" />
}
