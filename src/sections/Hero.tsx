import { useRef } from 'react'
import { gsap, useGSAP } from '../animations/gsap'
import { profile } from '../data/profile'
import styles from './Hero.module.css'

/**
 * Pinned intro: the section sticks to the screen while scrolling,
 * and the content shrinks and fades in sync with the scrollbar ("scrub").
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) return

      gsap.to('[data-hero-content]', {
        scale: 0.85,
        opacity: 0,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: true,
        },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className={styles.hero}>
      <div data-hero-content className={styles.content}>
        <p className={styles.role}>{profile.role}</p>
        <h1 className={styles.title}>{profile.name}</h1>
        <p className={styles.tagline}>
          {profile.tagline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </div>
      <p className={styles.hint} aria-hidden="true">
        scroll ↓
      </p>
    </section>
  )
}
