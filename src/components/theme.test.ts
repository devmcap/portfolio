import { describe, expect, it } from 'vitest'
import { parseTheme } from './theme'

describe('parseTheme', () => {
  it('keeps a valid theme', () => {
    expect(parseTheme('light')).toBe('light')
    expect(parseTheme('dark')).toBe('dark')
  })

  it('falls back to dark when nothing is stored', () => {
    expect(parseTheme(null)).toBe('dark')
    expect(parseTheme(undefined)).toBe('dark')
  })

  it('falls back to dark on unexpected values', () => {
    expect(parseTheme('')).toBe('dark')
    expect(parseTheme('Light')).toBe('dark')
    expect(parseTheme('blue')).toBe('dark')
  })
})
