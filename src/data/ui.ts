import type { Localized } from '../i18n/lang'

/**
 * Interface text that used to live inside components.
 * Terminal-style text (nav links, `$ build next-project`, `scroll ↓`) stays in English on purpose.
 */
export const ui = {
  aboutTitle: { en: 'About', es: 'Sobre mí' },
  projectsTitle: { en: 'Projects', es: 'Proyectos' },
  contactTitle: { en: 'Contact', es: 'Contacto' },
  viewRepo: { en: 'View repo →', es: 'Ver repo →' },
  footerCredit: { en: 'Designed & built by', es: 'Diseño y desarrollo:' },

  // Screen-reader only
  mainNav: { en: 'Main', es: 'Principal' },
  switchToLight: { en: 'Switch to light theme', es: 'Cambiar a tema claro' },
  switchToDark: { en: 'Switch to dark theme', es: 'Cambiar a tema oscuro' },
  nextBuild: { en: 'Next project, in progress', es: 'Próximo proyecto, en progreso' },
  nextBuildProgress: { en: 'Next project', es: 'Próximo proyecto' },
  inProgress: { en: 'In progress', es: 'En progreso' },
  // Keyed by the language you switch TO, and written in it. Includes the visible
  // "EN"/"ES" so voice-control users can say what they see.
  switchLanguage: { en: 'View in English (EN)', es: 'Ver en español (ES)' },
} satisfies Record<string, Localized<string>>
