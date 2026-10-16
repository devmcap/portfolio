import { profile } from '../data/profile'
import { ui } from '../data/ui'
import { useLanguage } from '../i18n/useLanguage'
import styles from './Footer.module.css'

const year = new Date().getFullYear()

export function Footer() {
  const { lang } = useLanguage()

  return (
    <footer className={styles.footer}>
      © {year} {profile.handle} · {ui.footerCredit[lang]} {profile.name}
    </footer>
  )
}
