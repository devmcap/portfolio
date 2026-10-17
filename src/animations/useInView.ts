import { useEffect, useState, type RefObject } from 'react'

/** Whether any part of the element is on screen, via the browser's IntersectionObserver. */
export function useInView(element: RefObject<HTMLElement | null>): boolean {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    if (!element.current) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(element.current)
    return () => observer.disconnect()
  }, [element])

  return inView
}
