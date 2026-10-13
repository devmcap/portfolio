import type { RefObject } from 'react'
import { gsap, useGSAP } from './gsap'

/**
 * Fades and lifts every `[data-reveal]` element inside `scope`
 * as it scrolls into view.
 */
export function useReveal(scope: RefObject<HTMLElement | null>): void {
  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) return

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
    },
    { scope },
  )
}
