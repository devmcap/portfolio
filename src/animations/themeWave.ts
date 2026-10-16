/**
 * Theme switch as a rising wave: the View Transitions API snapshots the old and
 * new page, and the new snapshot is revealed through a wavy clip-path that climbs
 * from the bottom of the screen to the top.
 */

const POINTS = 40 // every polygon must have the same vertex count to interpolate
const CRESTS = 2
const AMPLITUDE = 4 // % of the viewport height
const FRAMES = 30
const DURATION = 900 // ms
const TRAVEL = Math.PI * 3 // how far the wave shifts sideways while rising

/**
 * Clip-path polygon covering everything below a sine wave.
 * `progress` 0 puts the whole wave below the screen; 1 puts it above.
 * `phase` shifts the wave sideways so it looks like moving liquid.
 */
export function waveClipPath(progress: number, phase: number): string {
  const level = 100 + AMPLITUDE - progress * (100 + 2 * AMPLITUDE)
  const crest: string[] = []

  for (let i = 0; i < POINTS; i++) {
    const x = (i / (POINTS - 1)) * 100
    const y = level + AMPLITUDE * Math.sin((x / 100) * CRESTS * 2 * Math.PI + phase)
    crest.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`)
  }

  // Close the shape along the bottom edge.
  return `polygon(${crest.join(', ')}, 100% 100%, 0% 100%)`
}

function waveKeyframes(): Keyframe[] {
  return Array.from({ length: FRAMES + 1 }, (_, k) => {
    const t = k / FRAMES
    return { clipPath: waveClipPath(t, t * TRAVEL) }
  })
}

/**
 * Runs `update` (which must apply the new theme synchronously) behind the wave.
 * Without View Transitions support, or under reduced motion, it switches instantly.
 */
export function runThemeWave(update: () => void): Promise<void> {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion || !('startViewTransition' in document)) {
    update()
    return Promise.resolve()
  }

  const transition = document.startViewTransition(update)

  transition.ready
    .then(() => {
      document.documentElement.animate(waveKeyframes(), {
        duration: DURATION,
        easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
        // Hold the last frame; otherwise the CSS clip-path hides the new theme again.
        fill: 'forwards',
        pseudoElement: '::view-transition-new(root)',
      })
    })
    .catch(() => {
      // The browser skipped the transition: the theme was still applied.
    })

  return transition.finished.catch(() => {})
}
