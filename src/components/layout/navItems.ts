export interface NavItem {
  label: string
  to: string
  section: string
}

export const navItems: NavItem[] = [
  { label: 'Rozgrywki', to: '/rozgrywki', section: 'competitions' },
  { label: 'Drużyny', to: '/druzyny', section: 'teams' },
  { label: 'Mecze', to: '/mecze', section: 'matches' },
  { label: 'Profil', to: '/profil', section: 'profile' },
]
