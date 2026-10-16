import { navLinks } from '../data/navigation'
import { profile } from '../data/profile'
import { ui } from '../data/ui'
import { useLanguage } from '../i18n/useLanguage'
import { LanguageToggle } from './LanguageToggle'
import styles from './Nav.module.css'
import { ThemeToggle } from './ThemeToggle'

export function Nav() {
  const { lang } = useLanguage()

  return (
    <header className={styles.nav}>
      <a href="#top" className={styles.brand}>
        {profile.handle}
      </a>
      <nav aria-label={ui.mainNav[lang]}>
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
      <div className={styles.controls}>
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
