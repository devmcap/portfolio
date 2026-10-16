import { useRef } from 'react'
import { useReveal } from '../animations/useReveal'
import { SpecList } from '../components/SpecList'
import { bio, specs } from '../data/about'
import { ui } from '../data/ui'
import { useLanguage } from '../i18n/useLanguage'
import typography from '../styles/typography.module.css'
import styles from './About.module.css'

export function About() {
  const { lang } = useLanguage()
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  // Built on every render (not once at module load) so it follows the language.
  const rows = specs.map((spec) => ({
    label: spec.label[lang],
    content: spec.values[lang].join(' · '),
  }))

  return (
    <section ref={root} id="about" className={styles.about}>
      <h2 data-reveal className={`${typography.label} ${styles.label}`}>
        {ui.aboutTitle[lang]}
      </h2>
      <p data-reveal className={styles.bio}>
        {bio[lang]}
      </p>
      <div data-reveal>
        <SpecList rows={rows} />
      </div>
    </section>
  )
}
