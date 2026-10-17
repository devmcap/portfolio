import { describe, expect, it } from 'vitest'
import { DRIFT, RING_X, RING_Y, ringPosition } from './cloudOrbit'

const COUNT = 8

describe('cloudOrbit', () => {
  it('keeps every puff near the ring', () => {
    for (let t = 0; t < 120; t += 0.7) {
      for (let i = 0; i < COUNT; i++) {
        const [x, y] = ringPosition(i, COUNT, t)
        const r = Math.hypot(x / RING_X, y / RING_Y)
        expect(r).toBeGreaterThanOrEqual(1 - DRIFT - 1e-9)
        expect(r).toBeLessThanOrEqual(1 + 1e-9)
      }
    }
  })

  it('spaces the puffs evenly along the ring, ends included', () => {
    // The drift only moves a puff along its own ray, so dividing it out puts
    // the puff back on the ring and leaves the spacing alone.
    const points = Array.from({ length: COUNT }, (_, i) => {
      const [x, y] = ringPosition(i, COUNT, 0)
      const r = Math.hypot(x / RING_X, y / RING_Y)
      return [x / r, y / r]
    })
    const gaps = points.map(([x, y], i) => {
      const [nx, ny] = points[(i + 1) % COUNT]
      return Math.hypot(nx - x, ny - y)
    })
    expect(Math.max(...gaps) / Math.min(...gaps)).toBeLessThan(1.2)
  })

  it('keeps the cloud wider than tall as it turns', () => {
    for (let t = 0; t < 120; t += 1) {
      const points = Array.from({ length: COUNT }, (_, i) => ringPosition(i, COUNT, t))
      const xs = points.map(([x]) => x)
      const ys = points.map(([, y]) => y)
      expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(2 * (Math.max(...ys) - Math.min(...ys)))
    }
  })
})
