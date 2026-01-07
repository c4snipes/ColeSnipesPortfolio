import { useRef, lazy, Suspense, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'
import { useTheme } from '../hooks/useTheme'
import ProjectCard from '../components/ProjectCard'
import PageTransition from '../components/PageTransition'
import projects from '../data/projects.json'

// Lazy load Three.js hero for performance
const ThreeHero = lazy(() => import('../components/ThreeHero/ThreeHero'))

const phrases = [
  'Software Engineer',
  'Data Enthusiast',
  'Problem Solver',
  'Indianapolis Native',
  'Code Craftsman'
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
}

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
}

export default function Home() {
  const typedText = useTypewriter(phrases)
  const { theme } = useTheme()
  const heroRef = useRef(null)
  const [showThreeHero, setShowThreeHero] = useState(false)

  // Check if we should show Three.js (desktop, no reduced motion preference)
  useEffect(() => {
    const checkThreeSupport = () => {
      const isMobile = window.innerWidth <= 768
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setShowThreeHero(!isMobile && !prefersReducedMotion)
    }

    checkThreeSupport()
    window.addEventListener('resize', checkThreeSupport)
    return () => window.removeEventListener('resize', checkThreeSupport)
  }, [])

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })

  // Smooth spring physics for parallax
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  // Different parallax speeds for depth effect
  const orb1Y = useTransform(smoothProgress, [0, 1], [0, 150])
  const orb2Y = useTransform(smoothProgress, [0, 1], [0, 100])
  const orb3Y = useTransform(smoothProgress, [0, 1], [0, 200])
  const contentY = useTransform(smoothProgress, [0, 1], [0, 50])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const featuredProjects = [...projects]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        {/* Three.js 3D Background - Desktop Only */}
        {showThreeHero && (
          <Suspense fallback={null}>
            <ThreeHero />
          </Suspense>
        )}

        {/* CSS Orbs Fallback - Mobile/Reduced Motion */}
        <div className="hero-bg" style={{ opacity: showThreeHero ? 0.3 : 1 }}>
          <motion.div
            className="orb orb-1"
            style={{ y: orb1Y }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="orb orb-2"
            style={{ y: orb2Y }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: -4 }}
          />
          <motion.div
            className="orb orb-3"
            style={{ y: orb3Y }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: -2 }}
          />
        </div>

        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <motion.div className="terminal-prompt" variants={itemVariants}>
            <span className="prompt-symbol">&gt;</span>
            <span>Cole Snipes</span>
            <span className="cursor">_</span>
          </motion.div>

          <motion.p className="typing-container" variants={itemVariants}>
            <span className="typing-text gradient-animate">{typedText}</span>
            <span className="typing-cursor">|</span>
          </motion.p>

          <motion.blockquote className="hero-quote" variants={itemVariants}>
            "Talk is cheap. Show me the code." — Linus Torvalds
          </motion.blockquote>

          <motion.div className="tech-icons" variants={itemVariants}>
            <motion.img
              src={`https://skillicons.dev/icons?i=python,java,js,c,cpp,rust&theme=${theme}`}
              alt="Languages"
              whileHover={{ scale: 1.05 }}
            />
          </motion.div>
          <motion.div className="tech-icons" variants={itemVariants}>
            <motion.img
              src={`https://skillicons.dev/icons?i=spring,django,docker,git,linux,vscode&theme=${theme}`}
              alt="Tools"
              whileHover={{ scale: 1.05 }}
            />
          </motion.div>

          <motion.div className="hero-cta" variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/projects" className="btn btn-primary">View Projects</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <a href="/assets/Cole_Snipes_Resume.pdf" className="btn btn-outline" download>
                Download Resume
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="container">
          <motion.div
            className="about-grid"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div
              className="about-image-container"
              variants={fadeUpVariants}
              whileHover={{ scale: 1.02 }}
            >
              <img src="/assets/photo.jpg" alt="Cole Snipes" className="about-image" />
            </motion.div>
            <motion.div className="about-content" variants={fadeUpVariants}>
              <h2 className="section-title">The Journey</h2>
              <motion.div
                className="about-badges"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.span className="badge badge-accent" variants={itemVariants} whileHover={{ scale: 1.05 }}>
                  CS @ UIndy '26
                </motion.span>
                <motion.span className="badge" variants={itemVariants} whileHover={{ scale: 1.05 }}>
                  Software Engineering
                </motion.span>
                <motion.span className="badge" variants={itemVariants} whileHover={{ scale: 1.05 }}>
                  Data Science
                </motion.span>
                <motion.span className="badge" variants={itemVariants} whileHover={{ scale: 1.05 }}>
                  Mathematics
                </motion.span>
              </motion.div>
              <p className="about-text">
                I'm a Computer Science student from Indianapolis, building software that makes a difference.
                When I'm not grinding in the terminal, you'll find me cheering for the
                <strong> Pacers</strong> and <strong>Colts</strong>, or gaming on Xbox.
              </p>
              <p className="about-text">
                As I approach graduation, I'm actively exploring career opportunities.
                No seriously though, please reach out — the CSCI job market is cooked.
              </p>
              <div className="about-links">
                <motion.a
                  href="https://www.linkedin.com/in/cole-snipes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-social"
                  whileHover={{ y: -2 }}
                >
                  💼 LinkedIn
                </motion.a>
                <motion.a
                  href="https://github.com/c4snipes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-social"
                  whileHover={{ y: -2 }}
                >
                  🐙 GitHub
                </motion.a>
                <motion.a
                  href="https://www.xbox.com/en-US/play/share/friend/emJW4HVKwp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-social link-xbox"
                  whileHover={{ y: -2 }}
                >
                  🎮 SilverCloud595
                </motion.a>
              </div>
              <motion.div
                className="achievement-highlight"
                whileHover={{ scale: 1.01 }}
              >
                <span className="achievement-icon">🏆</span>
                <span>Richard Lugar Academic Scholarship Recipient</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="projects-section" id="projects">
        <div className="container">
          <motion.div
            className="projects-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Featured Projects</h2>
            <Link to="/projects" className="btn btn-ghost">View All →</Link>
          </motion.div>
          <div className="grid grid-3">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Let's Connect</h2>
            <p className="text-muted">Open to opportunities, collaborations, and interesting conversations.</p>
            <div className="contact-links">
              {[
                { href: 'mailto:Cole.Snipes@icloud.com', icon: '📧', label: 'Email' },
                { href: 'https://www.linkedin.com/in/cole-snipes', icon: '💼', label: 'LinkedIn' },
                { href: 'https://github.com/c4snipes', icon: '🐙', label: 'GitHub' },
                { href: 'https://www.xbox.com/en-US/play/share/friend/emJW4HVKwp', icon: '🎮', label: 'Xbox' }
              ].map((contact, index) => (
                <motion.a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="contact-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <span className="contact-icon">{contact.icon}</span>
                  <span className="contact-label">{contact.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
