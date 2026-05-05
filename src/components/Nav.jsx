export default function Nav() {
  return (
    <>
      <style>{`
        .nav {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: var(--space-md);
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }
        .nav-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: var(--step-1);
          font-weight: 300;
          color: var(--color-ink);
          text-decoration: none;
        }
        .nav-links {
          display: flex;
          gap: var(--space-md);
          list-style: none;
        }
        .nav-links a {
          font-family: 'Space Mono', monospace;
          font-size: var(--step--2);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-muted);
          text-decoration: none;
          position: relative;
          padding-bottom: 2px;
        }
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--color-accent);
          transition: width 200ms var(--ease-out);
        }
        .nav-links a:hover {
          color: var(--color-ink);
        }
        .nav-links a:hover::after {
          width: 100%;
        }
        @media (max-width: 600px) {
          .nav { padding: var(--space-sm); }
          .nav-links { gap: var(--space-sm); }
        }
      `}</style>
      <nav className="nav" aria-label="Site navigation">
        <a href="#" className="nav-name">Cole Snipes</a>
        <ul className="nav-links">
          <li><a href="#work">work</a></li>
          <li><a href="#about">about</a></li>
          <li><a href="#contact">contact</a></li>
        </ul>
      </nav>
    </>
  )
}
