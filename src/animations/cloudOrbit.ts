/**
 * Where each Hero cloud puff rests while the cloud swirls: all of them go
 * round one ellipse as wide and flat as the cloud, evenly spaced along it,
 * and each drifts in and out of the ring at its own pace. The physics
 * (cloudPhysics.ts) springs the puffs after these points.
 */

/** Half-width and half-height of the ring. */
export const RING_X = 3.4
export const RING_Y = 0.9
/** Laps per second around the ring. */
const LAPS_PER_SECOND = 1 / 40
/** How far (fraction of the ring's size) a puff drifts in from it. */
export const DRIFT = 0.3
/** Base speed (rad/s) of that drift; each puff gets its own. */
const DRIFT_SPEED = 0.5

/** Points along the ring, to walk it by distance instead of by angle. */
const SAMPLES = 256

/**
 * Cumulative length of the ring at each sample. Equal angles are not equal
 * distances on an ellipse (they crowd at the narrow ends), so the puffs are
 * spaced by distance, otherwise the ones at the ends crash into each other.
 */
const ringLengths: number[] = (() => {
  const lengths = [0]
  for (let i = 1; i <= SAMPLES; i++) {
    const a = ((i - 1) / SAMPLES) * Math.PI * 2
    const b = (i / SAMPLES) * Math.PI * 2
    const step = Math.hypot(RING_X * (Math.cos(b) - Math.cos(a)), RING_Y * (Math.sin(b) - Math.sin(a)))
    lengths.push(lengths[i - 1] + step)
  }
  return lengths
})()

/** Angle on the ellipse at `fraction` (0–1) of the way round, by distance. */
function angleAt(fraction: number): number {
  const target = (((fraction % 1) + 1) % 1) * ringLengths[SAMPLES]
  let i = 1
  while (ringLengths[i] < target) i++
  const t = (target - ringLengths[i - 1]) / (ringLengths[i] - ringLengths[i - 1])
  return ((i - 1 + t) / SAMPLES) * Math.PI * 2
}

/** Rest position of puff `index` (of `count`) after `time` seconds. */
export function ringPosition(index: number, count: number, time: number): [x: number, y: number] {
  const angle = angleAt(index / count + time * LAPS_PER_SECOND)
  // In from the ring and back, each puff at its own pace, so neighbours weave
  // past each other. Only inwards: the cloud never gets wider than the ring.
  const wave = 0.5 + 0.5 * Math.sin(time * DRIFT_SPEED * (1 + index * 0.17) + index * 2)
  const drift = 1 - DRIFT * wave
  return [Math.cos(angle) * RING_X * drift, Math.sin(angle) * RING_Y * drift]
}
