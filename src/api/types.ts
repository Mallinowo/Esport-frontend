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

export interface UserSummary {
  id: number
  name: string
}

export interface Competition {
  id: number
  name: string
  game: Game
  format: CompetitionFormat
  status: CompetitionStatus
  teams_count: number
  min_teams: number
  max_teams: number
  registration_ends_at: string
  starts_at: string
}

export interface CompetitionRules {
  best_of: number
  points_win: number
  points_draw: number | null
  points_loss: number
  tiebreakers: string[]
  description: string
}

export interface CompetitionDetails extends Competition {
  rounds_count: number
  current_round: number | null
  rules: CompetitionRules
  organizer: UserSummary
  is_followed: boolean
}

export interface Standing {
  position: number
  team: TeamSummary
  played: number
  wins: number
  draws: number
  losses: number
  score_for: number
  score_against: number
  score_diff: number
  points: number
  form: FormResult[]
}

export interface Round {
  number: number
  stage: BracketStage | null
}

export interface Match {
  id: number
  competition_id: number
  round: Round
  home_team: TeamSummary | null
  away_team: TeamSummary | null
  home_score: number | null
  away_score: number | null
  status: MatchStatus
  scheduled_at: string
  finished_at: string | null
}

export interface BracketMatch {
  id: number
  position: number
  home_team: TeamSummary | null
  away_team: TeamSummary | null
  home_score: number | null
  away_score: number | null
  status: MatchStatus
  winner_team_id: number | null
  next_match_id: number | null
  scheduled_at: string
}

export interface BracketRound {
  number: number
  stage: BracketStage
  matches: BracketMatch[]
}

export interface Bracket {
  competition_id: number
  generated_at: string | null
  champion: TeamSummary | null
  rounds: BracketRound[]
}

export interface Dispute {
  comment: string
  attachments: string[]
  created_by: UserSummary
  created_at: string
}

export interface MatchReport {
  id: number
  status: ReportStatus
  reported_by_team_id: number
  reported_by: UserSummary
  home_score: number
  away_score: number
  map: string | null
  comment: string | null
  screenshot_url: string | null
  created_at: string
  dispute: Dispute | null
}

export interface MatchPermissions {
  report: boolean
  confirm: boolean
  dispute: boolean
  resolve: boolean
}

export interface MatchDetails {
  id: number
  competition: Pick<Competition, 'id' | 'name' | 'format' | 'game'>
  round: Round
  best_of: number
  home_team: TeamSummary
  away_team: TeamSummary
  home_score: number | null
  away_score: number | null
  status: MatchStatus
  scheduled_at: string
  finished_at: string | null
  maps: string[]
  can: MatchPermissions
  reports: MatchReport[]
}
