import { useEffect, useRef } from 'react'

export default function About() {
  const ref = useRef(null)

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

  return (
    <section className="about" id="about" aria-label="About">
      <div className="container">
        <div className="reveal" ref={ref}>
          <span className="section-number">03 —</span>
          <h2 className="section-title">About</h2>
          <div className="about-inner">
            <p className="about-copy about-copy--lead">
             Writing code that makes systems feel smaller than they are.
            </p>
            <p className="about-copy">
              Most of my work lives in the gap between raw computation and the people who need
              to use it: students, instructors, researchers. The interface is often the only
              part they see. I care about what happens after the demo. 
            </p>
            <p className="about-copy">
              I have just graduated from the University of Indianapolis, with a Computer Science degree. I am currently at looking for a job in an industry that values innovation and creativity. I am passionate about creating software that solves real-world problems and makes people's lives easier. I am willing to learn and grow as a developer and contribute to the development of my own tech stack. Thanks for stopping by! 
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
