export interface ContactLink {
  label: string
  href: string
}

export const contactHeadline = "Have something in mind? Let's talk."

export const contactLinks: readonly ContactLink[] = [
  { label: 'GitHub', href: 'https://github.com/manmolcptn' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/miguel-molina-cp' },
]

/** "https://www.github.com/user/" → "github.com/user" */
export function displayUrl(href: string): string {
  return href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}
