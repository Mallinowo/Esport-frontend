import type { User, UserRole } from '@/api/types'

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  organizer: 'Organizator',
  captain: 'Kapitan',
  user: 'Gracz',
}

const roleOrder: UserRole[] = ['admin', 'organizer', 'captain', 'user']

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
}

export function roleLabel(user: User): string {
  const role = roleOrder.find((item) => user.roles.includes(item)) ?? 'user'
  return roleLabels[role]
}
