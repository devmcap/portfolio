import { describe, expect, it } from 'vitest'
import { waveClipPath } from './themeWave'

/** Splits "polygon(x% y%, ...)" into [x, y] pairs. */
function points(clipPath: string): [number, number][] {
  return clipPath
    .slice('polygon('.length, -1)
    .split(', ')
    .map((pair) => pair.split(' ').map(parseFloat) as [number, number])
}

/** The wave's crest: every point except the two that close the bottom edge. */
function crest(clipPath: string): [number, number][] {
  return points(clipPath).slice(0, -2)
}

describe('waveClipPath', () => {
  it('keeps the same vertex count at every step, so the browser can interpolate', () => {
    const counts = [0, 0.3, 0.7, 1].map((p) => points(waveClipPath(p, p * 5)).length)
    expect(new Set(counts).size).toBe(1)
  })

  it('starts with the whole wave below the screen', () => {
    expect(crest(waveClipPath(0, 0)).every(([, y]) => y >= 100)).toBe(true)
  })

  it('ends with the whole wave above the screen', () => {
    expect(crest(waveClipPath(1, 2)).every(([, y]) => y <= 0)).toBe(true)
  })

  it('spans the full width', () => {
    const xs = crest(waveClipPath(0.5, 0)).map(([x]) => x)
    expect(Math.min(...xs)).toBe(0)
    expect(Math.max(...xs)).toBe(100)
  })
})
