import type { Localized } from '../i18n/lang'

export interface ContactLink {
  label: string
  href: string
}

export const contactHeadline: Localized<string> = {
  en: "Have something in mind? Let's talk.",
  es: '¿Tienes algo en mente? Hablemos.',
}

export const contactLinks: readonly ContactLink[] = [
  { label: 'GitHub', href: 'https://github.com/devmcap' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mmlcap' },
]

/** "https://www.github.com/user/" → "github.com/user" */
export function displayUrl(href: string): string {
  return href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}
