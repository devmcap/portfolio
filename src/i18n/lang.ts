export const LANGS = ['en', 'es'] as const

export type Lang = (typeof LANGS)[number]

/** One value per language. TypeScript fails the build if a language is missing. */
export type Localized<T> = Record<Lang, T>

/** Same value in every language, on purpose (e.g. tech names, terminal text). */
export function untranslated<T>(value: T): Localized<T> {
  return { en: value, es: value }
}
