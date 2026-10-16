import { useRef } from 'react'
import { useReveal } from '../animations/useReveal'
import { SpecList } from '../components/SpecList'
import { bio, specs } from '../data/about'
import { ui } from '../data/ui'
import typography from '../styles/typography.module.css'
import styles from './About.module.css'

const rows = specs.map((spec) => ({ label: spec.label.en, content: spec.values.en.join(' · ') }))

export function About() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  return (
    <section ref={root} id="about" className={styles.about}>
      <h2 data-reveal className={`${typography.label} ${styles.label}`}>
        {ui.aboutTitle.en}
      </h2>
      <p data-reveal className={styles.bio}>
        {bio.en}
      </p>
      <div data-reveal>
        <SpecList rows={rows} />
      </div>
    </section>
  )
}
