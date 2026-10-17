import { useEffect, useState, type RefObject } from 'react'

/** The element's width in CSS pixels, kept up to date with a ResizeObserver. */
export function useElementWidth(element: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!element.current) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(element.current)
    return () => observer.disconnect()
  }, [element])

  return width
}
