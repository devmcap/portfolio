export interface Project {
  id: string
  title: string
  description: string
  year: number
  stack: readonly string[]
  repo: string
}

export const projects: readonly Project[] = [
  {
    id: 'devmcap',
    title: 'devmcap',
    description:
      'This portfolio. A scroll-driven site built from scratch and developed alongside AI agents.',
    year: 2026,
    stack: ['React', 'TypeScript', 'GSAP', 'Lenis', 'Vite'],
    repo: 'https://github.com/manmolcptn/devmcap',
  },
]
