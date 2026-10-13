import { describe, expect, it } from 'vitest'
import { projects } from './projects'

describe('projects data', () => {
  it('has unique ids (used as React keys)', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has no empty titles', () => {
    expect(projects.every((p) => p.title.trim().length > 0)).toBe(true)
  })
})
