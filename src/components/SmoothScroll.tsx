import { useEffect, useRef, type ReactNode } from 'react'
import { ReactLenis, useLenis, type LenisRef } from 'lenis/react'
import { gsap, ScrollTrigger } from '../animations/gsap'

/**
 * Wraps the page in Lenis smooth scrolling and drives it from GSAP's ticker,
 * so ScrollTrigger and Lenis share one animation loop and never drift apart.
 * Users who prefer reduced motion get native scrolling instead.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  // Tell ScrollTrigger about every Lenis scroll. useLenis subscribes
  // once the instance exists (ReactLenis creates it after the first render).
  useLenis(ScrollTrigger.update)

  useEffect(() => {
    // Read the ref on every tick: the Lenis instance is not ready on mount.
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => gsap.ticker.remove(update)
  }, [])

  // Checked after the hooks: React needs them called on every render.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return <>{children}</>

  return (
    <ReactLenis root options={{ autoRaf: false, anchors: true }} ref={lenisRef}>
      {children}
    </ReactLenis>
  )
}
