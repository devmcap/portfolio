import { describe, expect, it } from 'vitest'
import { shouldSpawn, spawnMeteor, stepMeteors, tailOf } from './meteors'

describe('meteors', () => {
  it('starts on the top or left edge, falling right and down', () => {
    for (let i = 0; i < 50; i++) {
      const meteor = spawnMeteor(1000, 700)
      expect(Math.min(meteor.x, meteor.y)).toBeCloseTo(0)
      expect(meteor.vx).toBeGreaterThan(0)
      expect(meteor.vy).toBeGreaterThan(0)
    }
  })

  it('crosses a tall phone screen too', () => {
    for (let i = 0; i < 50; i++) {
      let meteors = [spawnMeteor(360, 780)]
      let onScreen = false
      while (meteors.length) {
        const [m] = meteors
        if (m.x > 0 && m.x < 360 && m.y > 0 && m.y < 780) onScreen = true
        meteors = stepMeteors(meteors, 1 / 60, 360, 780)
      }
      expect(onScreen).toBe(true)
    }
  })

  it('averages about one spawn per interval, whatever the frame rate', () => {
    let spawns = 0
    const dt = 1 / 60
    const seconds = 6000
    for (let i = 0; i < seconds / dt; i++) if (shouldSpawn(dt)) spawns++
    expect(spawns).toBeGreaterThan(800)
    expect(spawns).toBeLessThan(1200)
  })

  it('drops a meteor once it has crossed the screen', () => {
    let meteors = [spawnMeteor(800, 600)]
    for (let i = 0; i < 600 && meteors.length; i++) meteors = stepMeteors(meteors, 1 / 60, 800, 600)
    expect(meteors).toHaveLength(0)
  })

  it('draws the tail one length behind the head', () => {
    const meteor = { x: 100, y: 0, vx: 10, vy: 0, length: 50, width: 2 }
    expect(tailOf(meteor)).toEqual({ x: 50, y: 0 })
  })
})
