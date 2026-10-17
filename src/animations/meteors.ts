/** Average seconds between meteors. Each frame rolls the dice (see shouldSpawn). */
const MEAN_INTERVAL = 6
/** Never more than this many in the sky at once. */
export const MAX_METEORS = 1

/** A streak crossing the sky. Its head is at (x, y) and the tail trails behind. */
export type Meteor = { x: number; y: number; vx: number; vy: number; length: number; width: number }

/**
 * Whether a meteor appears this frame. A chance of dt / MEAN_INTERVAL per
 * frame gives random gaps that still average MEAN_INTERVAL seconds,
 * whatever the frame rate.
 */
export function shouldSpawn(dt: number, random = Math.random): boolean {
  return random() < dt / MEAN_INTERVAL
}

/** Screen diagonal (px) the speeds and lengths are tuned for: a laptop. */
const DESIGN_DIAGONAL = 1600

/**
 * A new meteor falling right like the dust's wind. It first picks a point on
 * screen to fly through, then starts back along its path, just past the top
 * or left edge: that way it crosses any screen, a tall phone included.
 */
export function spawnMeteor(width: number, height: number, random = Math.random): Meteor {
  const angle = (20 + random() * 25) * (Math.PI / 180) // below the horizontal
  const dirX = Math.cos(angle)
  const dirY = Math.sin(angle)
  // Smaller screens get slower, shorter meteors, or they flash by unseen.
  const scale = Math.min(1, Math.max(0.5, Math.hypot(width, height) / DESIGN_DIAGONAL))
  const speed = (700 + random() * 600) * scale
  const length = (120 + random() * 160) * scale

  // The point it flies through: anywhere across, in the upper part of the screen.
  const throughX = (0.1 + random() * 0.8) * width
  const throughY = (0.1 + random() * 0.5) * height
  // Walk back until it hits the left or the top edge, whichever comes first.
  const back = Math.min(throughX / dirX, throughY / dirY)
  return {
    x: throughX - dirX * back,
    y: throughY - dirY * back,
    vx: dirX * speed,
    vy: dirY * speed,
    length,
    width: 1.5 + random() * 1.5,
  }
}

/** Moves every meteor and drops the ones whose tail has left the screen. */
export function stepMeteors(meteors: Meteor[], dt: number, width: number, height: number): Meteor[] {
  for (const meteor of meteors) {
    meteor.x += meteor.vx * dt
    meteor.y += meteor.vy * dt
  }
  return meteors.filter((m) => m.x - m.length < width && m.y - m.length < height)
}

/** Where the tail ends: one length back along the direction of travel. */
export function tailOf(meteor: Meteor): { x: number; y: number } {
  const speed = Math.hypot(meteor.vx, meteor.vy)
  return { x: meteor.x - (meteor.vx / speed) * meteor.length, y: meteor.y - (meteor.vy / speed) * meteor.length }
}
