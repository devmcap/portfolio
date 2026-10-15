export interface Profile {
  name: string
  handle: string
  role: string
  tagline: readonly string[]
}

export const profile: Profile = {
  name: 'Miguel Molina',
  handle: 'devmcap',
  role: 'Developer',
  tagline: ['Building things that work.', 'Then making them better.'],
}
