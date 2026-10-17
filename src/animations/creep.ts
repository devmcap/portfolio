/** Where the "next build" bar starts, where it stalls, and how long it takes. */
export const CREEP_START = 0.02
export const CREEP_END = 0.9
export const CREEP_SECONDS = 300

/**
 * Fill fraction of the "next build" bar `seconds` after it appeared: fast at
 * first, then slower and slower towards 90%, and it never completes.
 */
export function creepProgress(seconds: number): number {
  const t = Math.min(1, Math.max(0, seconds / CREEP_SECONDS))
  const eased = 1 - (1 - t) ** 3
  return CREEP_START + (CREEP_END - CREEP_START) * eased
}
