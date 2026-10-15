import { useRef } from 'react'
import { useReveal } from '../animations/useReveal'
import { bio, specs } from '../data/about'
import styles from './About.module.css'

export function About() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  return (
    <section ref={root} id="about" className={styles.about}>
      <h2 data-reveal className={styles.label}>
        About
      </h2>
      <p data-reveal className={styles.bio}>
        {bio}
      </p>
      <dl data-reveal className={styles.specs}>
        {specs.map((spec) => (
          <div key={spec.label} className={styles.row}>
            <dt>{spec.label}</dt>
            <dd>{spec.values.join(' · ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
