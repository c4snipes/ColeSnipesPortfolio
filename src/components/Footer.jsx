/**
 * Footer.jsx
 *
 * One-line footer. Per the design brief: name, location, build note, year.
 * Nothing else. Dynamic year prevents the copyright from going stale.
 */

export default function Footer() {
  return (
    <footer className="footer">
      <span className="footer-text">Cole Snipes — Indianapolis, IN</span>
      <span className="footer-text">
        Built without Lorem Ipsum and AI. © {new Date().getFullYear()}.
      </span>
    </footer>
  )
}
