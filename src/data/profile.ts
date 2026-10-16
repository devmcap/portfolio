import type { Localized } from '../i18n/lang'

export interface Profile {
  name: string
  handle: string
  role: string
  tagline: Localized<readonly string[]>
}

export const profile: Profile = {
  name: 'Miguel Molina',
  handle: 'devmcap',
  role: 'Developer', // kept in English in both languages
  tagline: {
    en: ['Building things that work.', 'Then making them better.'],
    es: ['Construyo cosas que funcionan.', 'Después, las mejoro.'],
  },
}
