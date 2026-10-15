import { describe, expect, it } from 'vitest'
import { contactLinks, displayUrl } from './contact'

describe('displayUrl', () => {
  it('strips protocol, www and trailing slash', () => {
    expect(displayUrl('https://www.linkedin.com/in/someone/')).toBe('linkedin.com/in/someone')
  })

  it('leaves a bare https url without www intact apart from the protocol', () => {
    expect(displayUrl('https://github.com/someone')).toBe('github.com/someone')
  })
})

describe('contact links', () => {
  it('link over https', () => {
    expect(contactLinks.every((l) => l.href.startsWith('https://'))).toBe(true)
  })
})
