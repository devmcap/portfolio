import { useRef } from 'react'
import { useReveal } from '../animations/useReveal'
import { SpecList } from '../components/SpecList'
import { contactHeadline, contactLinks, displayUrl } from '../data/contact'
import { ui } from '../data/ui'
import { useLanguage } from '../i18n/useLanguage'
import typography from '../styles/typography.module.css'
import styles from './Contact.module.css'

const rows = contactLinks.map((link) => ({
  label: link.label,
  content: (
    <a href={link.href} target="_blank" rel="noreferrer">
      {displayUrl(link.href)} <span aria-hidden="true">↗</span>
    </a>
  ),
}))

export function Contact() {
  const { lang } = useLanguage()
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  return (
    <section ref={root} id="contact" className={styles.contact}>
      <h2 data-reveal className={`${typography.label} ${styles.label}`}>
        {ui.contactTitle[lang]}
      </h2>
      <p data-reveal className={styles.headline}>
        {contactHeadline[lang]}
      </p>
      <div data-reveal>
        <SpecList rows={rows} />
      </div>
    </section>
  )
}
