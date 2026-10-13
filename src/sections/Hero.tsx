import { useRef } from 'react'
import { gsap, useGSAP } from '../animations/gsap'
import styles from './Hero.module.css'

/**
 * Pinned intro: the section sticks to the screen while scrolling,
 * and the title scales and fades in sync with the scrollbar ("scrub").
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.to('[data-hero-title]', {
        scale: 0.6,
        opacity: 0.15,
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
    <section ref={root} className={styles.hero}>
      <h1 data-hero-title className={styles.title}>
        Tu nombre
      </h1>
      <p className={styles.hint}>scroll</p>
    </section>
  )
}
