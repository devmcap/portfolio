import { ScrollTrigger } from './gsap'

/** id of the Hero's pinned ScrollTrigger, so others can find it. */
export const HERO_SCROLL_ID = 'hero'
/** Label in the Hero timeline where the name is in full view. */
export const NAME_LABEL = 'name'

/**
 * Scroll position (px) where the name is in full view, or undefined when the
 * Hero has no scroll animation (reduced motion): then the top already shows it.
 */
export function nameScrollPosition(): number | undefined {
  return ScrollTrigger.getById(HERO_SCROLL_ID)?.labelToScroll(NAME_LABEL)
}
