import { describe, expect, it } from 'vitest'
import { createMotes, easeGust, moteCount, moteVelocity, stepMotes, targetGust, wrap } from './dust'

describe('dust', () => {
  it('puts fewer motes on a phone and caps big screens', () => {
    expect(moteCount(360, 780)).toBeLessThan(moteCount(1440, 900))
    expect(moteCount(5000, 3000)).toBe(moteCount(6000, 4000))
  })

  it('wraps values into the screen, also negative ones', () => {
    expect(wrap(105, 100)).toBe(5)
    expect(wrap(-5, 100)).toBe(95)
  })

  it('keeps every mote on screen after many steps', () => {
    const motes = createMotes(50, 300, 200)
    for (let i = 0; i < 500; i++) stepMotes(motes, 400, i / 60, 1 / 60, 300, 200)
    for (const mote of motes) {
      expect(mote.x).toBeGreaterThanOrEqual(0)
      expect(mote.x).toBeLessThan(300)
      expect(mote.y).toBeGreaterThanOrEqual(0)
      expect(mote.y).toBeLessThan(200)
    }
  })

  it('blows harder while scrolling and calms down after', () => {
    const mote = { x: 0, y: 0, depth: 0.5, phase: 0 }
    expect(moteVelocity(mote, targetGust(2000), 0).x).toBeGreaterThan(moteVelocity(mote, 0, 0).x)

    let gust = targetGust(2000)
    for (let i = 0; i < 180; i++) gust = easeGust(gust, 0, 1 / 60)
    expect(gust).toBeLessThan(1)
  })

  it('moves near motes faster than far ones', () => {
    const far = { x: 0, y: 0, depth: 0, phase: 0 }
    const near = { ...far, depth: 1 }
    expect(moteVelocity(near, 0, 0).x).toBeGreaterThan(moteVelocity(far, 0, 0).x)
  })
})
