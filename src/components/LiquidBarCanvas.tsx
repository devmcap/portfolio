import { useEffect, useRef, useState } from 'react'
import { creepProgress } from '../animations/creep'
import { NOSE, surfaceY } from '../animations/liquid'
import { BAR_HEIGHT } from '../animations/liquidBar'
import { useElementWidth } from '../animations/useElementWidth'
import { useInView } from '../animations/useInView'
import styles from './LiquidBar.module.css'

/** Horizontal step when tracing the surface; smaller is smoother. */
const SURFACE_STEP = 3

type Props = { label: string; valueText: string }

function readAccent(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim()
}

/**
 * Liquid progress bar drawn on a Canvas 2D. The water fills it from the left
 * with gravity pulling it down: full behind the tip, rippling near it, and
 * sloping to the floor at the tip. The shape comes from animations/liquid.ts;
 * this component only draws it.
 */
export function LiquidBarCanvas({ label, valueText }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [startedAt] = useState(() => performance.now())
  const width = useElementWidth(root)
  const inView = useInView(root)

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d')
    if (!ctx || !canvas.current || !width) return

    const dpr = Math.min(2, window.devicePixelRatio)
    canvas.current.width = width * dpr
    canvas.current.height = BAR_HEIGHT * dpr
    ctx.scale(dpr, dpr)

    // The accent lives in CSS: re-read it when the theme changes.
    let accent = readAccent()
    const themeObserver = new MutationObserver(() => (accent = readAccent()))
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const draw = (front: number, t: number) => {
      ctx.clearRect(0, 0, width, BAR_HEIGHT)
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(0, 0, width, BAR_HEIGHT, 6)
      ctx.clip()

      const end = Math.min(width, front + NOSE)
      ctx.beginPath()
      ctx.moveTo(0, BAR_HEIGHT)
      for (let x = 0; x <= end; x += SURFACE_STEP) ctx.lineTo(x, surfaceY(x, front, t))
      ctx.lineTo(end, BAR_HEIGHT)
      ctx.closePath()
      ctx.fillStyle = accent
      ctx.fill()

      // A light line just under the surface, following its ripples.
      ctx.beginPath()
      for (let x = 4; x <= front - 30; x += SURFACE_STEP) ctx.lineTo(x, surfaceY(x, front, t) + 2.5)
      ctx.strokeStyle = 'rgb(255 255 255 / 0.25)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.restore()
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(width * 0.35, 0)
      return () => themeObserver.disconnect()
    }
    // Off screen nothing runs.
    if (!inView) return () => themeObserver.disconnect()

    let frameId = 0
    const frame = (now: number) => {
      const t = (now - startedAt) / 1000
      draw(creepProgress(t) * width, t)
      frameId = requestAnimationFrame(frame)
    }
    frameId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(frameId)
      themeObserver.disconnect()
    }
  }, [width, inView, startedAt])

  return (
    <div
      ref={root}
      className={styles.bar}
      style={{ height: BAR_HEIGHT }}
      role="progressbar"
      aria-label={label}
      aria-valuetext={valueText}
    >
      <div className={styles.track} />
      <canvas ref={canvas} className={styles.layer} style={{ height: BAR_HEIGHT }} aria-hidden="true" />
    </div>
  )
}
