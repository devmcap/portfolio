export interface NavLink {
  id: string
  label: string
}

// Each id must match the `id` attribute of a section on the page.
export const navLinks: readonly NavLink[] = [
  { id: 'about', label: 'about' },
  { id: 'projects', label: 'projects' },
  { id: 'contact', label: 'contact' },
]
