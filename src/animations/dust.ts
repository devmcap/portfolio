/** Screen area (px²) per mote, up to a cap. */
const AREA_PER_MOTE = 1000
const MAX_MOTES = 260
/** Phones (the nav's 600px breakpoint) get a lower cap: less work for a weaker GPU. */
const PHONE_WIDTH = 600
const MAX_MOTES_PHONE = 100

/** Steady breeze in px/s, blowing right and slightly down. */
const BASE_WIND = { x: 40, y: 12 }
/** Extra wind per px/s of scroll speed, and the most it can add. */
const SCROLL_GUST = 0.4
const MAX_GUST = 500
/** How fast the wind catches up with the scroll (1/s): lower lags more. */
const GUST_RESPONSE = 3

/** One speck of dust. depth goes from 0 (far) to 1 (near). */
export type Mote = { x: number; y: number; depth: number; phase: number }

export function moteCount(width: number, height: number): number {
  const cap = width <= PHONE_WIDTH ? MAX_MOTES_PHONE : MAX_MOTES
  return Math.min(cap, Math.round((width * height) / AREA_PER_MOTE))
}

export function createMotes(count: number, width: number, height: number, random = Math.random): Mote[] {
  return Array.from({ length: count }, () => ({
    x: random() * width,
    y: random() * height,
    depth: random(),
    phase: random() * Math.PI * 2,
  }))
}

/** Gust strength the wind eases towards, from the current scroll speed in px/s. */
export function targetGust(scrollSpeed: number): number {
  return Math.min(MAX_GUST, Math.abs(scrollSpeed) * SCROLL_GUST)
}

/** Moves the gust a step towards its target, so the wind builds up and dies down smoothly. */
export function easeGust(gust: number, target: number, dt: number): number {
  return gust + (target - gust) * Math.min(1, dt * GUST_RESPONSE)
}

/** Velocity of a mote in px/s. Near motes move faster: that sells the depth. */
export function moteVelocity(mote: Mote, gust: number, t: number): { x: number; y: number } {
  const speed = 0.3 + 0.7 * mote.depth
  // A slow sway so the motes float instead of sliding on rails.
  const sway = 10 * Math.sin(t * 0.8 + mote.phase)
  return { x: (BASE_WIND.x + gust) * speed, y: (BASE_WIND.y + gust * 0.25) * speed + sway }
}

/** Advances every mote, wrapping around the edges so the screen never empties. */
export function stepMotes(motes: Mote[], gust: number, t: number, dt: number, width: number, height: number) {
  for (const mote of motes) {
    const v = moteVelocity(mote, gust, t)
    mote.x = wrap(mote.x + v.x * dt, width)
    mote.y = wrap(mote.y + v.y * dt, height)
  }
}

/** Always in [0, size), also for negative values (plain % keeps the sign). */
export function wrap(value: number, size: number): number {
  return ((value % size) + size) % size
}
