import { profile } from '../data/profile'
import styles from './Footer.module.css'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className={styles.footer}>
      © {year} {profile.handle} · Designed &amp; built by {profile.name}
    </footer>
  )
}
