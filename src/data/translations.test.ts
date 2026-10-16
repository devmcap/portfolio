import { describe, expect, it } from 'vitest'
import { LANGS } from '../i18n/lang'
import * as about from './about'
import * as contact from './contact'
import * as profile from './profile'
import * as projects from './projects'
import * as ui from './ui'

type Found = { path: string; value: Record<string, unknown> }

/** Walks the content and collects every `{ en, es }` object with its path. */
function findLocalized(node: unknown, path: string, found: Found[] = []): Found[] {
  if (Array.isArray(node)) {
    node.forEach((item, i) => findLocalized(item, `${path}[${i}]`, found))
  } else if (node && typeof node === 'object') {
    const record = node as Record<string, unknown>
    if ('en' in record) found.push({ path, value: record })
    else Object.entries(record).forEach(([key, v]) => findLocalized(v, `${path}.${key}`, found))
  }
  return found
}

const content = { about, contact, profile, projects, ui }
const localized = findLocalized(content, 'content')

function isFilled(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0 && value.every(isFilled)
  return false
}

describe('translations', () => {
  it('finds translatable content', () => {
    expect(localized.length).toBeGreaterThan(10)
  })

  it.each(localized)('$path has every language, none empty', ({ value }) => {
    expect(Object.keys(value).sort()).toEqual([...LANGS].sort())
    for (const lang of LANGS) expect(isFilled(value[lang])).toBe(true)
  })

  it.each(localized.filter(({ value }) => Array.isArray(value.en)))(
    '$path has as many items in every language',
    ({ value }) => {
      for (const lang of LANGS) {
        expect((value[lang] as unknown[]).length).toBe((value.en as unknown[]).length)
      }
    },
  )
})
