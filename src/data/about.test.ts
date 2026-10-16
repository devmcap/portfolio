import { describe, expect, it } from 'vitest'
import { LANGS } from '../i18n/lang'
import { specs } from './about'

describe('about specs', () => {
  it('has unique labels (used as React keys)', () => {
    for (const lang of LANGS) {
      const labels = specs.map((s) => s.label[lang])
      expect(new Set(labels).size).toBe(labels.length)
    }
  })

  it('has at least one value per row', () => {
    expect(specs.every((s) => LANGS.every((lang) => s.values[lang].length > 0))).toBe(true)
  })
})
