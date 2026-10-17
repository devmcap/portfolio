import { lazy, Suspense, useRef, useState } from 'react'
import { gsap, useGSAP } from '../animations/gsap'
import type { CloudBreak } from '../components/HeroCloud'
import { profile } from '../data/profile'
import { useLanguage } from '../i18n/useLanguage'
import typography from '../styles/typography.module.css'
import styles from './Hero.module.css'

// three.js is heavy: load the cloud in its own chunk, after the page.
const HeroCloud = lazy(() => import('../components/HeroCloud'))

/**
 * Pinned intro: the section sticks to the screen while scrolling and a
 * timeline follows the scrollbar ("scrub"): the cloud breaks and the name
 * comes out of it, it holds for a moment, then the content shrinks and fades.
 */
export function Hero() {
  const { lang } = useLanguage()
  const root = useRef<HTMLElement>(null)
  // Under reduced motion there is no cloud at all (and three.js is never downloaded).
  const [showCloud] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  // GSAP writes it, the cloud's physics reads it on every frame.
  const cloudBreak = useRef<CloudBreak>({ progress: 0 })

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) return

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: true,
        },
      })

      // The name grows out of the cloud (it is hidden behind it on load).
      timeline
        .to(cloudBreak.current, { progress: 1, duration: 1 }, 0)
        .from(
          '[data-hero-content]',
          { opacity: 0, scale: 0.92, transformOrigin: 'left center', duration: 0.7 },
          0.3,
        )
        // Pause with the name in full view, then leave as before.
        .to('[data-hero-content]', {
          scale: 0.85,
          opacity: 0,
          transformOrigin: 'left center',
          duration: 1,
          delay: 0.5,
        })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className={styles.hero}>
      <div data-hero-content className={styles.content}>
        <p className={`${typography.label} ${styles.role}`}>{profile.role}</p>
        <h1 className={styles.title}>{profile.name}</h1>
        <p className={styles.tagline}>
          {profile.tagline[lang].map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </div>
      {showCloud && (
        <Suspense fallback={null}>
          <HeroCloud cloudBreak={cloudBreak} />
        </Suspense>
      )}
      <p className={styles.hint} aria-hidden="true">
        scroll ↓
      </p>
    </section>
  )
}
