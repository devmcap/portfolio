import { useLenis } from 'lenis/react'
import { useEffect, useId, useState, type MouseEvent } from 'react'
import { nameScrollPosition } from '../animations/heroScroll'
import { navLinks } from '../data/navigation'
import { profile } from '../data/profile'
import { ui } from '../data/ui'
import { useLanguage } from '../i18n/useLanguage'
import { LanguageToggle } from './LanguageToggle'
import styles from './Nav.module.css'
import { ThemeToggle } from './ThemeToggle'

/**
 * Fixed top bar. On wide screens the links sit in a row; on phones the same
 * list becomes a dropdown panel opened by the menu button (CSS does the switch).
 */
export function Nav() {
  const { lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const menuId = useId()
  // undefined under reduced motion: there is no Lenis then.
  const lenis = useLenis()

  // Escape closes the menu, like any other popup.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  // The logo goes to the name. The very top (#top) is where the cloud still
  // hides it, so with the Hero animation on, scroll to where it's in full view.
  const goToName = (event: MouseEvent) => {
    const position = nameScrollPosition()
    if (position === undefined || !lenis) return // plain #top link
    event.preventDefault()
    // Lenis also handles # links, on window: keep it from scrolling to #top too.
    event.stopPropagation()
    lenis.scrollTo(position)
  }

  return (
    <header className={styles.nav} data-open={open || undefined}>
      <a href="#top" className={styles.brand} onClick={goToName}>
        {profile.handle}
      </a>
      <nav id={menuId} className={styles.menu} aria-label={ui.mainNav[lang]}>
        <ul className={styles.links}>
          {navLinks.map((link, i) => (
            <li key={link.id}>
              <a href={`#${link.id}`} className={styles.link} onClick={() => setOpen(false)}>
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
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? ui.closeMenu[lang] : ui.openMenu[lang]}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.menuIcon} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.menuIcon} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
