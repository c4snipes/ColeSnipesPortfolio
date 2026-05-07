/**
 * Nav.jsx
 *
 * Minimal site navigation. Positioned absolute over the hero section
 * so the hero fills the full viewport without a layout gap at the top.
 *
 * Intentionally not sticky — disappears as the user scrolls into content.
 * Per the design brief: navigation should not compete with the work.
 *
 * Mobile: nav links collapse to a horizontal scroll strip via CSS gap reduction.
 * No hamburger menu — see index.css media query at max-width: 600px.
 */

export default function Nav() {
  return (
    <nav className="nav" aria-label="Site navigation">
      {/* href="#" scrolls back to top */}
      <a href="#" className="nav-name">Cole Snipes</a>
      <ul className="nav-links">
        <li><a href="#stack">stack</a></li>
        <li><a href="#work">work</a></li>
        <li><a href="#about">about</a></li>
        <li><a href="#contact">contact</a></li>
      </ul>
    </nav>
  )
}
