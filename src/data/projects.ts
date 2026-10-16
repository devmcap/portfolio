import type { Localized } from '../i18n/lang'

export interface Project {
  id: string
  title: string
  description: Localized<string>
  year: number
  stack: readonly string[]
  repo: string
}

export const projects: readonly Project[] = [
  {
    id: 'devmcap',
    title: 'devmcap',
    description: {
      en: 'This portfolio. A scroll-driven site built from scratch and developed alongside AI agents.',
      es: 'Este portfolio. Una web guiada por el scroll, hecha desde cero y desarrollada junto a agentes de IA.',
    },
    year: 2026,
    stack: ['React', 'TypeScript', 'GSAP', 'Lenis', 'Vite'],
    repo: 'https://github.com/manmolcptn/devmcap',
  },
]
