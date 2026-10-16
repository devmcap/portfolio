import { useEffect, useState, type ReactNode } from 'react'
import { detectLang, LANG_STORAGE_KEY, type Lang } from './lang'
import { LanguageContext } from './useLanguage'

function readStoredLang(): string | null {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY)
  } catch {
    return null // storage blocked: fall back to the browser language
  }
}

/** Holds the site language for every component below it (read it with useLanguage). */
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Decided before the first render, so the page never shows the wrong language.
  const [lang, setLangState] = useState<Lang>(() =>
    detectLang(readStoredLang(), navigator.language),
  )

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // Only an explicit choice is saved; until then the browser language decides.
  function setLang(next: Lang) {
    setLangState(next)
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next)
    } catch {
      // Storage blocked: the language still applies for this visit.
    }
  }

  return <LanguageContext value={{ lang, setLang }}>{children}</LanguageContext>
}
