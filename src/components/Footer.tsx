import { profile } from '../data/profile'
import { ui } from '../data/ui'
import styles from './Footer.module.css'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className={styles.footer}>
      © {year} {profile.handle} · {ui.footerCredit.en} {profile.name}
    </footer>
  )
}
