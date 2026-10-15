import { describe, expect, it } from 'vitest'
import { specs } from './about'

describe('about specs', () => {
  it('has unique labels (used as React keys)', () => {
    const labels = specs.map((s) => s.label)
    expect(new Set(labels).size).toBe(labels.length)
  })

  it('has at least one value per row', () => {
    expect(specs.every((s) => s.values.length > 0)).toBe(true)
  })
})
