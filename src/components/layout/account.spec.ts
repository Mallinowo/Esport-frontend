import { describe, expect, it } from 'vitest'
import type { User } from '@/api/types'
import { initials, roleLabel } from './account'

const user: User = {
  id: 1,
  name: 'Jakub Maliński',
  email: 'kuba@example.com',
  avatar_url: null,
  has_discord: false,
  roles: ['user'],
  captain_of_team_ids: [],
}

describe('account', () => {
  it.each([
    ['Jakub Maliński', 'JM'],
    ['wojtek', 'W'],
    ['Anna Maria Nowak', 'AM'],
  ])('robi inicjały z %s', (name, expected) => {
    expect(initials(name)).toBe(expected)
  })

  it('wybiera najwyższą rolę', () => {
    expect(roleLabel({ ...user, roles: ['user', 'captain', 'admin'] })).toBe('Administrator')
    expect(roleLabel({ ...user, roles: ['user', 'captain'] })).toBe('Kapitan')
    expect(roleLabel(user)).toBe('Gracz')
  })
})
