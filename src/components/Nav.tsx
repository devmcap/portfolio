import { navLinks } from '../data/navigation'
import { profile } from '../data/profile'
import styles from './Nav.module.css'

export function Nav() {
  return (
    <header className={styles.nav}>
      <a href="#top" className={styles.brand}>
        {profile.handle}
      </a>
      <nav aria-label="Main">
        <ul className={styles.links}>
          {navLinks.map((link, i) => (
            <li key={link.id}>
              <a href={`#${link.id}`} className={styles.link}>
                <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
