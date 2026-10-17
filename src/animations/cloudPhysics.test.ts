import { describe, expect, it } from 'vitest'
import { createPuffs, PUFF_RADIUS, pusherRadiusToClear, stepPuffs } from './cloudPhysics'

const DT = 1 / 60

function run(steps: number, fn: () => void) {
  for (let i = 0; i < steps; i++) fn()
}

describe('cloudPhysics', () => {
  it('pulls a displaced puff back to its rest position', () => {
    const puffs = createPuffs([[5, 0]])
    puffs[0].x = 8
    puffs[0].y = -2

    run(600, () => stepPuffs(puffs, 0, DT))

    expect(puffs[0].x).toBeCloseTo(5, 2)
    expect(puffs[0].y).toBeCloseTo(0, 2)
  })

  it('pushes puffs out of the growing pusher', () => {
    const puffs = createPuffs([[0.5, 0]])
    const pusherRadius = 6

    run(600, () => stepPuffs(puffs, pusherRadius, DT))

    // The spring still pulls it back, so it rests just inside the pusher's edge.
    expect(Math.hypot(puffs[0].x, puffs[0].y)).toBeGreaterThan(pusherRadius - PUFF_RADIUS)
  })

  it('computes a pusher radius that clears a given distance', () => {
    const distance = 10
    const puffs = createPuffs([[0.5, 0]])

    run(600, () => stepPuffs(puffs, pusherRadiusToClear(distance), DT))

    expect(Math.hypot(puffs[0].x, puffs[0].y)).toBeGreaterThanOrEqual(distance)
  })

  it('reports an impact when two puffs crash into each other', () => {
    const puffs = createPuffs([
      [-PUFF_RADIUS * 0.9, 0],
      [PUFF_RADIUS * 0.9, 0],
    ])
    puffs[0].vx = 3
    puffs[1].vx = -3

    stepPuffs(puffs, 0, DT)

    expect(puffs[0].impact).toBeGreaterThan(5)
    expect(puffs[1].impact).toBe(puffs[0].impact)
  })

  it('does not report impacts for puffs that are apart', () => {
    const puffs = createPuffs([
      [-5, 0],
      [5, 0],
    ])

    stepPuffs(puffs, 0, DT)

    expect(puffs.every((puff) => puff.impact === 0)).toBe(true)
  })
})
