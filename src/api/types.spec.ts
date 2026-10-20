import { describe, expect, it } from 'vitest'
import type { BracketMatch, Game, MatchDetails, Paginated, Resource, TeamSummary, User } from './types'

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

  it('pozwalają na mecz w drabince bez ustalonego rywala', () => {
    const match: BracketMatch = {
      id: 207,
      position: 1,
      home_team: { id: 11, name: 'Ognisty Feniks', short_name: 'OFX', logo_url: null, is_followed: false },
      away_team: null,
      home_score: null,
      away_score: null,
      status: 'scheduled',
      winner_team_id: null,
      next_match_id: null,
      scheduled_at: '2026-11-08T17:00:00Z',
    }
    expect(match.away_team).toBeNull()
  })

  it('opisują uprawnienia do meczu', () => {
    const can: MatchDetails['can'] = { report: false, confirm: true, dispute: true, resolve: false }
    expect(Object.keys(can)).toEqual(['report', 'confirm', 'dispute', 'resolve'])
  })
})
