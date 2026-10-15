import { describe, expect, it } from 'vitest'
import { navLinks } from './navigation'

describe('navigation data', () => {
  it('has unique ids (used as React keys and anchors)', () => {
    const ids = navLinks.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('uses ids that are valid in a #hash href', () => {
    expect(navLinks.every((l) => /^[a-z][a-z0-9-]*$/.test(l.id))).toBe(true)
  })
})
