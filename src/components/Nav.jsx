/**
 * Nav.jsx
 *
 * Minimal site navigation. Positioned absolute over the hero section
 * so the hero fills the full viewport without a layout gap at the top.
 *
 * Intentionally not sticky — disappears as the user scrolls into content.
 * Per the design brief: navigation should not compete with the work.
 *
 * The links cover every section that has an id, so keyboard and screen-reader
 * users can reach all of them; Timeline was previously unreachable.
 *
 * Mobile: the row simply tightens its gap at 600px (see index.css). There is no
 * hamburger and no scroll strip — five short lowercase labels fit on one line.
 */

export default function Nav() {
  return (
    <nav className="nav" aria-label="Site navigation">
      {/* "#top" is the spec-defined fragment for the start of the document, so
          this scrolls home without pushing a bare "#" into the address bar. */}
      <a href="#top" className="nav-name">Cole Snipes</a>
      <ul className="nav-links">
        <li><a href="#stack">stack</a></li>
        <li><a href="#work">work</a></li>
        <li><a href="#timeline">timeline</a></li>
        <li><a href="#about">about</a></li>
        <li><a href="#contact">contact</a></li>
      </ul>
    </nav>
  )
}
