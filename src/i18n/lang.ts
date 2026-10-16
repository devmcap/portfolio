export const LANGS = ['en', 'es'] as const

export type Lang = (typeof LANGS)[number]

/** One value per language. TypeScript fails the build if a language is missing. */
export type Localized<T> = Record<Lang, T>

export const LANG_STORAGE_KEY = 'lang'

function isLang(value: string | null): value is Lang {
  return (LANGS as readonly (string | null)[]).includes(value)
}

/**
 * Picks the language on load: a choice the visitor saved wins; otherwise
 * Spanish browsers (es, es-ES, es-MX…) get Spanish and everyone else English.
 */
export function detectLang(stored: string | null, browser: string | undefined): Lang {
  if (isLang(stored)) return stored
  return browser?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

/** Same value in every language, on purpose (e.g. tech names, terminal text). */
export function untranslated<T>(value: T): Localized<T> {
  return { en: value, es: value }
}
