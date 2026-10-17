import { useEffect, useRef } from 'react'
import { MAX_METEORS, shouldSpawn, spawnMeteor, stepMeteors, tailOf, type Meteor } from '../animations/meteors'
import styles from './Meteors.module.css'

type MeteorColors = { head: string; tail: string }

function readColors(): MeteorColors {
  const styles = getComputedStyle(document.documentElement)
  return {
    head: styles.getPropertyValue('--color-meteor-head').trim(),
    tail: styles.getPropertyValue('--color-meteor-tail').trim(),
  }
}

/**
 * Meteors that now and then streak across the sky, behind the content but
 * above the dust. The motion lives in animations/meteors.ts; this component
 * only draws it. Reduced motion: no meteors at all.
 */
export function Meteors() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.current?.getContext('2d')
    if (!ctx || !canvas.current) return
    const element = canvas.current

    let width = 0
    let height = 0
    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(2, window.devicePixelRatio)
      element.width = width * dpr
      element.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // The colour lives in CSS: re-read it when the theme changes.
    let colors = readColors()
    const themeObserver = new MutationObserver(() => (colors = readColors()))
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const draw = (meteor: Meteor) => {
      const tail = tailOf(meteor)
      // The trail fades in from nothing, burns red-orange and turns yellow at the head.
      const gradient = ctx.createLinearGradient(tail.x, tail.y, meteor.x, meteor.y)
      gradient.addColorStop(0, 'transparent')
      gradient.addColorStop(0.75, colors.tail)
      gradient.addColorStop(1, colors.head)
      ctx.strokeStyle = gradient
      ctx.lineWidth = meteor.width
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(tail.x, tail.y)
      ctx.lineTo(meteor.x, meteor.y)
      ctx.stroke()

      // shadowBlur is costly, but there are two meteors at most.
      // A yellow head with an orange glow around it, like something burning.
      ctx.fillStyle = colors.head
      ctx.shadowColor = colors.tail
      ctx.shadowBlur = 14
      ctx.beginPath()
      ctx.arc(meteor.x, meteor.y, meteor.width * 1.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }

    let meteors: Meteor[] = []
    let frameId = 0
    let last = performance.now()
    const frame = (now: number) => {
      // Clamped so a long pause (hidden tab) does not throw a meteor across in one frame.
      const dt = Math.min(1 / 30, (now - last) / 1000)
      last = now

      if (meteors.length < MAX_METEORS && shouldSpawn(dt)) meteors.push(spawnMeteor(width, height))
      meteors = stepMeteors(meteors, dt, width, height)

      ctx.clearRect(0, 0, width, height)
      for (const meteor of meteors) draw(meteor)
      frameId = requestAnimationFrame(frame)
    }
    frameId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      themeObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvas} className={styles.meteors} aria-hidden="true" />
}
