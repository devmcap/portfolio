import { describe, expect, it } from 'vitest'
import { CREEP_END, CREEP_SECONDS, CREEP_START, creepProgress } from './creep'

describe('creepProgress', () => {
  it('starts nearly empty', () => {
    expect(creepProgress(0)).toBe(CREEP_START)
  })

  it('stalls at 90% and never completes', () => {
    expect(creepProgress(CREEP_SECONDS)).toBeCloseTo(CREEP_END)
    expect(creepProgress(CREEP_SECONDS * 10)).toBeCloseTo(CREEP_END)
  })

  it('moves fast at first and slows down', () => {
    const firstMinute = creepProgress(60) - creepProgress(0)
    const lastMinute = creepProgress(CREEP_SECONDS) - creepProgress(CREEP_SECONDS - 60)
    expect(firstMinute).toBeGreaterThan(lastMinute * 10)
  })
})
