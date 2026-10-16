import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { runThemeWave } from '../animations/themeWave'
import { ui } from '../data/ui'
import { parseTheme, THEME_STORAGE_KEY, type Theme } from './theme'
import styles from './ThemeToggle.module.css'

/** Sun/moon button that flips `data-theme` on <html>; tokens.css does the rest. */
export function ThemeToggle() {
  // The inline script in index.html already applied the saved theme before React ran.
  const [theme, setTheme] = useState<Theme>(() =>
    parseTheme(document.documentElement.dataset.theme),
  )
  const next: Theme = theme === 'dark' ? 'light' : 'dark'
  const switching = useRef(false)

  function toggle() {
    if (switching.current) return // ignore clicks while the wave is rising
    switching.current = true

    runThemeWave(() => {
      document.documentElement.dataset.theme = next
      // Re-render now, so the new snapshot already shows the new icon.
      flushSync(() => setTheme(next))
    }).finally(() => {
      switching.current = false
    })

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage blocked (e.g. private mode): the theme still applies for this visit.
    }
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={next === 'light' ? ui.switchToLight.en : ui.switchToDark.en}
    >
      {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
    </svg>
  )
}
