import { useEffect, useRef } from 'react'
import { createMotes, easeGust, moteCount, moteVelocity, stepMotes, targetGust, wrap, type Mote } from '../animations/dust'
import styles from './DustBackground.module.css'

/** Seconds of motion each streak shows: longer tails at higher speed. */
const STREAK_SECONDS = 0.02
/** How much scrolling drags the near motes up or down (parallax). */
const SCROLL_PARALLAX = 0.35

function readDustColor(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--color-dust').trim()
}

/**
 * Drifting dust behind the whole page, drawn on a fixed Canvas 2D. A breeze
 * always blows; scrolling turns it into a gust that dies down when you stop.
 * The motion itself lives in animations/dust.ts; this component only draws it.
 */
export function DustBackground() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d')
    if (!ctx || !canvas.current) return
    const element = canvas.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let motes: Mote[] = []
    let color = readDustColor()
    let gust = 0

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = color
      ctx.lineCap = 'round'
      for (const mote of motes) {
        const v = moteVelocity(mote, gust, t)
        ctx.globalAlpha = 0.15 + 0.45 * mote.depth
        ctx.lineWidth = 1 + 2.5 * mote.depth
        ctx.beginPath()
        ctx.moveTo(mote.x, mote.y)
        ctx.lineTo(mote.x - v.x * STREAK_SECONDS, mote.y - v.y * STREAK_SECONDS)
        ctx.stroke()
      }
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(2, window.devicePixelRatio)
      element.width = width * dpr
      element.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      motes = createMotes(moteCount(width, height), width, height)
      if (reduceMotion) draw(0)
    }
    resize()
    window.addEventListener('resize', resize)

    // The colour lives in CSS: re-read it when the theme changes.
    const themeObserver = new MutationObserver(() => {
      color = readDustColor()
      if (reduceMotion) draw(0)
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    // Reduced motion: a still layer of dust, redrawn only on resize or theme change.
    if (reduceMotion) {
      return () => {
        window.removeEventListener('resize', resize)
        themeObserver.disconnect()
      }
    }

    let frameId = 0
    let last = performance.now()
    let lastScroll = window.scrollY
    const frame = (now: number) => {
      // Clamped so a long pause (hidden tab) does not teleport the motes.
      const dt = Math.min(1 / 30, (now - last) / 1000)
      last = now
      const scrolled = window.scrollY - lastScroll
      lastScroll = window.scrollY

      gust = easeGust(gust, targetGust(dt > 0 ? scrolled / dt : 0), dt)
      stepMotes(motes, gust, now / 1000, dt, width, height)
      // Near motes slide against the scroll more than far ones.
      for (const mote of motes) mote.y = wrap(mote.y - scrolled * mote.depth * SCROLL_PARALLAX, height)

      draw(now / 1000)
      frameId = requestAnimationFrame(frame)
    }
    frameId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      themeObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvas} className={styles.dust} aria-hidden="true" />
}
