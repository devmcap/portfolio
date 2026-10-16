import { describe, expect, it } from 'vitest'
import { detectLang } from './lang'

describe('detectLang', () => {
  it('uses the saved choice first', () => {
    expect(detectLang('en', 'es-ES')).toBe('en')
    expect(detectLang('es', 'en-US')).toBe('es')
  })

  it('gives Spanish to any Spanish browser locale', () => {
    expect(detectLang(null, 'es')).toBe('es')
    expect(detectLang(null, 'es-ES')).toBe('es')
    expect(detectLang(null, 'es-MX')).toBe('es')
  })

  it('falls back to English for other or unknown browser languages', () => {
    expect(detectLang(null, 'en-GB')).toBe('en')
    expect(detectLang(null, 'fr-FR')).toBe('en')
    expect(detectLang(null, undefined)).toBe('en')
  })

  it('ignores an unexpected saved value', () => {
    expect(detectLang('fr', 'es-ES')).toBe('es')
    expect(detectLang('', 'en-US')).toBe('en')
  })
})
