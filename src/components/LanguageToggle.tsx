import { ui } from '../data/ui'
import type { Lang } from '../i18n/lang'
import { useLanguage } from '../i18n/useLanguage'
import styles from './LanguageToggle.module.css'

/** Shows the language you can switch to ("ES" while in English, "EN" while in Spanish). */
export function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  const next: Lang = lang === 'en' ? 'es' : 'en'

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setLang(next)}
      lang={next}
      aria-label={ui.switchLanguage[next]}
    >
      {next.toUpperCase()}
    </button>
  )
}
