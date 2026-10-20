export type CompetitionFormat = 'league' | 'cup'
export type CompetitionStatus = 'draft' | 'registration' | 'in_progress' | 'finished'
export type MatchStatus = 'scheduled' | 'live' | 'awaiting_confirmation' | 'disputed' | 'finished'
export type ReportStatus = 'pending' | 'confirmed' | 'disputed' | 'resolved'
export type BracketStage = 'round_of_16' | 'quarterfinal' | 'semifinal' | 'final'
export type UserRole = 'user' | 'captain' | 'organizer' | 'admin'
export type FormResult = 'W' | 'D' | 'L'

export interface TeamSummary {
  id: number
  name: string
  short_name: string
  logo_url: string | null
  is_followed: boolean
}

export interface Game {
  id: number
  name: string
  slug: string
  logo_url: string | null
}

export interface User {
  id: number
  name: string
  email: string
  avatar_url: string | null
  has_discord: boolean
  roles: UserRole[]
  captain_of_team_ids: number[]
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface Resource<T> {
  data: T
}

export interface Paginated<T> {
  data: T[]
  meta: PaginationMeta
}
