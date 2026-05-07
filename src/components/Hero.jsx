export default function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero-inner">
        <span className="hero-number">01 —</span>
        <h1 className="hero-name">
          COLE<br />SNIPES
        </h1>
        <hr className="hero-rule" />
        <p className="hero-subtitle">
          Frontend engineer. Systems thinker.<br />
          I build product interfaces, design systems, and data tools that stay
          understandable as they scale.<br />
          I care about the handoff between raw data and the people who need to use it,
          which is why I pair clean UI with resilient pipelines and clear narratives.<br />
          Comfortable across data engineering and data visualization when the UI
          depends on trustworthy ingestion, modeling, and reporting.
          <span className="hero-location">Indianapolis — Available for work</span>
        </p>
        <div className="hero-actions">
          <a
            className="hero-button"
            href="/assets/Cole_Snipes_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download resume (PDF)
          </a>
        </div>
      </div>
    </section>
  )
}
