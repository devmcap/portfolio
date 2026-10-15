import { profile } from './profile'

export interface Spec {
  label: string
  values: readonly string[]
}

export const bio =
  'I build backend systems in Python. AI agents are a core part of how I work — they let me move across the whole stack and go wherever a problem needs me. This site is one of those builds.'

export const specs: readonly Spec[] = [
  { label: 'Role', values: [profile.role] },
  { label: 'Backend', values: ['Python', 'FastAPI', 'Flask'] },
  { label: 'Data', values: ['MySQL'] },
  { label: 'Workflow', values: ['Claude Code', 'AI agents'] },
]
