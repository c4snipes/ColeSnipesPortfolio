export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Cole Snipes. Built with React & Framer Motion.</p>
        <p className="text-muted mt-1">Changing the world one line of code at a time.</p>
      </div>
    </footer>
  )
}
