import { untranslated, type Localized } from '../i18n/lang'
import { profile } from './profile'

export interface Spec {
  label: Localized<string>
  values: Localized<readonly string[]>
}

export const bio: Localized<string> = {
  en: 'I build backend systems in Python. AI agents are a core part of how I work — they let me move across the whole stack and go wherever a problem needs me. This site is one of those builds.',
  es: 'Construyo sistemas backend en Python. Los agentes de IA son una parte central de mi forma de trabajar: me permiten moverme por todo el stack e ir allí donde un problema me necesite. Esta web es uno de esos proyectos.',
}

export const specs: readonly Spec[] = [
  { label: { en: 'Role', es: 'Rol' }, values: untranslated([profile.role]) },
  { label: untranslated('Backend'), values: untranslated(['Python', 'FastAPI', 'Flask']) },
  { label: { en: 'Data', es: 'Datos' }, values: untranslated(['MySQL']) },
  {
    label: { en: 'Workflow', es: 'Flujo de trabajo' },
    values: { en: ['Claude Code', 'AI agents'], es: ['Claude Code', 'Agentes de IA'] },
  },
]
