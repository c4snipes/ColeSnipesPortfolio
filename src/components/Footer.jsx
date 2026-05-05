export default function Footer() {
  return (
    <>
      <style>{`
        .footer {
          padding: var(--space-md);
          border-top: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-sm);
          flex-wrap: wrap;
        }
        .footer-text {
          font-family: 'Space Mono', monospace;
          font-size: var(--step--2);
          color: var(--color-ghost);
        }
      `}</style>
      <footer className="footer">
        <span className="footer-text">Cole Snipes — Indianapolis, IN</span>
        <span className="footer-text">Built without Lorem Ipsum. © {new Date().getFullYear()}.</span>
      </footer>
    </>
  )
}
