import { describe, expect, it } from 'vitest'
import type { Game, Paginated, Resource, TeamSummary, User } from './types'

describe('typy API', () => {
  it('pasują do użytkownika z umowy API', () => {
    const response: Resource<User> = {
      data: {
        id: 7,
        name: 'kapitan_zmb',
        email: 'zmb@example.com',
        avatar_url: null,
        has_discord: true,
        roles: ['user', 'captain'],
        captain_of_team_ids: [5],
      },
    }
    expect(response.data.roles).toContain('captain')
  })

  it('pasują do stronicowanej listy z umowy API', () => {
    const game: Game = { id: 1, name: 'Counter-Strike 2', slug: 'cs2', logo_url: null }
    const response: Paginated<Game> = {
      data: [game],
      meta: { current_page: 1, last_page: 1, per_page: 12, total: 1 },
    }
    expect(response.meta.total).toBe(response.data.length)
  })

  it('pozwalają na drużynę bez logo', () => {
    const team: TeamSummary = { id: 1, name: 'Wilki Legnica', short_name: 'WLK', logo_url: null, is_followed: false }
    expect(team.logo_url).toBeNull()
  })
})
