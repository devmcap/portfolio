/**
 * Physics for the liquid progress bar: the shape of the water's surface.
 * A pure function in CSS pixels and seconds; the component only draws what
 * it returns. y grows downwards (0 = top of the bar), like on a canvas.
 */
import { BAR_HEIGHT } from './liquidBar'

/** Gap between the surface and the top of the bar, right behind the tip. */
const SURFACE_GAP = 2.5
/** How quickly that gap closes behind the tip: the bar tops up as the water settles. */
const TOP_UP_DISTANCE = 70
/** Length of the slope where the water runs down to the floor at the tip. */
const RAMP = 40
/** How far the nose runs ahead along the floor. */
export const NOSE = 4

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/**
 * Height of the water's surface at `x`, for a tip at `front`, at time `t`.
 * Near the tip the surface sits a little low, with ripples running towards
 * the tip; further back it tops up until the bar is full to the brim. At the
 * tip the surface slopes down to the floor, ending in a nose.
 */
export function surfaceY(x: number, front: number, t: number): number {
  // The slope breathes a little, like water sloshing as it arrives.
  const ramp = RAMP + 4 * Math.sin(t * 1.7)
  const u = clamp01((x - (front - ramp)) / (ramp + NOSE))
  // A rounded front: starts down gently and ends in a near-vertical curve
  // (a quarter circle), blended with a smooth S so it isn't a hard bullnose.
  const round = 1 - Math.sqrt(1 - u * u)
  const smooth = u * u * (3 - 2 * u)
  const slope = 0.6 * round + 0.4 * smooth

  // The gap and the ripples only live near the tip, where the water is still
  // arriving; further back they fade out and the bar is full to the top.
  const nearTip = Math.exp(-Math.max(0, front - x) / TOP_UP_DISTANCE)
  const ripple = 1.8 * (Math.sin(x * 0.09 - t * 3.2) + 0.5 * Math.sin(x * 0.23 - t * 5.1 + 1))
  const top = (SURFACE_GAP + ripple) * nearTip

  return top * (1 - slope) + BAR_HEIGHT * slope
}
