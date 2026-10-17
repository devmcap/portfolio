import { describe, expect, it } from 'vitest'
import { NOSE, surfaceY } from './liquid'
import { BAR_HEIGHT } from './liquidBar'

describe('surfaceY', () => {
  const front = 300

  it('keeps the bar nearly full well behind the tip', () => {
    for (let x = 0; x < front - 80; x += 7) {
      expect(surfaceY(x, front, 1)).toBeLessThan(BAR_HEIGHT * 0.3)
    }
  })

  it('fills up to the top far behind the tip', () => {
    expect(Math.abs(surfaceY(0, front, 1))).toBeLessThan(0.1)
  })

  it('reaches the floor past the nose', () => {
    expect(surfaceY(front + NOSE + 5, front, 1)).toBeCloseTo(BAR_HEIGHT)
  })

  it('slopes down towards the tip', () => {
    expect(surfaceY(front - 10, front, 1)).toBeGreaterThan(surfaceY(front - 40, front, 1))
  })
})
