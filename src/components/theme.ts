export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme'

/**
 * Turns a stored or attribute value into a valid theme; anything unexpected
 * falls back to dark, the default. Keep in sync with the inline script in index.html.
 */
export function parseTheme(value: string | null | undefined): Theme {
  return value === 'light' ? 'light' : 'dark'
}
