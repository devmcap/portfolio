/**
 * Tiny 2D physics for the Hero cloud: a stand-in for a real engine (Rapier).
 * Each puff is a spring pulled towards its rest position. Overlapping puffs
 * push each other apart, and an invisible ball at the centre (the name)
 * pushes them all outwards as it grows.
 */

/** How hard a puff is pulled back to its rest position. */
const STIFFNESS = 12
/** Friction: how quickly a puff loses speed. */
const DAMPING = 4
/** How hard the name pushes puffs out of its way. */
const PUSH = 60
/** How hard overlapping puffs push each other apart. */
const BOUNCE = 30

/** Collider radius of a single puff. */
export const PUFF_RADIUS = 1

export type Puff = {
  homeX: number
  homeY: number
  x: number
  y: number
  vx: number
  vy: number
  /** Hardest hit this puff took in the last step (closing speed). */
  impact: number
}

/**
 * Pusher radius that leaves a puff resting at least `distance` from the
 * centre. The spring keeps pulling the puff back, so it settles inside the
 * pusher's edge; this solves that balance (spring = push) for a puff whose
 * rest position is the centre, the worst case.
 */
export function pusherRadiusToClear(distance: number): number {
  return (distance * (STIFFNESS + PUSH)) / PUSH - PUFF_RADIUS
}

export function createPuffs(homes: readonly (readonly [x: number, y: number])[]): Puff[] {
  return homes.map(([x, y]) => ({ homeX: x, homeY: y, x, y, vx: 0, vy: 0, impact: 0 }))
}

/**
 * Advances the simulation by `dt` seconds. `pusherRadius` is the size of the
 * ball at the centre; 0 means it doesn't push at all.
 */
export function stepPuffs(puffs: Puff[], pusherRadius: number, dt: number): void {
  for (const puff of puffs) {
    let ax = (puff.homeX - puff.x) * STIFFNESS - puff.vx * DAMPING
    let ay = (puff.homeY - puff.y) * STIFFNESS - puff.vy * DAMPING

    const dist = Math.hypot(puff.x, puff.y)
    const overlap = pusherRadius + PUFF_RADIUS - dist
    if (pusherRadius > 0 && overlap > 0) {
      // A puff exactly at the centre has no direction: send it sideways.
      const nx = dist > 1e-6 ? puff.x / dist : Math.sign(puff.homeX) || 1
      const ny = dist > 1e-6 ? puff.y / dist : 0
      ax += nx * overlap * PUSH
      ay += ny * overlap * PUSH
    }

    puff.vx += ax * dt
    puff.vy += ay * dt
    puff.impact = 0
  }

  for (let i = 0; i < puffs.length; i++) {
    for (let j = i + 1; j < puffs.length; j++) {
      collide(puffs[i], puffs[j], dt)
    }
  }

  for (const puff of puffs) {
    puff.x += puff.vx * dt
    puff.y += puff.vy * dt
  }
}

function collide(a: Puff, b: Puff, dt: number): void {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dist = Math.hypot(dx, dy)
  const overlap = 2 * PUFF_RADIUS - dist
  if (overlap <= 0 || dist < 1e-6) return

  const nx = dx / dist
  const ny = dy / dist
  // Positive when they are moving towards each other.
  const closing = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny
  if (closing > 0) {
    a.impact = Math.max(a.impact, closing)
    b.impact = Math.max(b.impact, closing)
  }

  const kick = overlap * BOUNCE * dt
  a.vx -= nx * kick
  a.vy -= ny * kick
  b.vx += nx * kick
  b.vy += ny * kick
}
