import type {
  Bracket,
  Competition,
  CompetitionDetails,
  Game,
  Match,
  MatchReport,
  Standing,
  TeamSummary,
  User,
} from '@/api/types'

export const games: Game[] = [
  { id: 1, name: 'Counter-Strike 2', slug: 'cs2', logo_url: null },
  { id: 2, name: 'Valorant', slug: 'valorant', logo_url: null },
  { id: 3, name: 'League of Legends', slug: 'lol', logo_url: null },
]

const [cs2, valorant, lol] = games as [Game, Game, Game]

function team(id: number, name: string, shortName: string, isFollowed = false): TeamSummary {
  return { id, name, short_name: shortName, logo_url: null, is_followed: isFollowed }
}

const wlk = team(1, 'Wilki Legnica', 'WLK', true)
const csm = team(2, 'Czarne Smoki', 'CSM')
const nzm = team(3, 'Nocna Zmiana', 'NZM')
const pxb = team(4, 'Pixel Brigade', 'PXB')
const szg = team(5, 'Szybcy Gracze', 'SZG')
const kin = team(6, 'Koło Informatyków', 'KIN')
const ofx = team(11, 'Ognisty Feniks', 'OFX')
const brz = team(12, 'Burza', 'BRZ')
const lwj = team(13, 'Lodowi Wojownicy', 'LWJ')
const csw = team(14, 'Cyber Sowy', 'CSW')
const zmb = team(15, 'Zielona Mamba', 'ZMB')
const skr = team(16, 'Stalowe Kruki', 'SKR')
const pkr = team(17, 'Pierwszy Krok', 'PKR')
const rkt = team(18, 'Rakieta', 'RKT')

export const currentUser: User = {
  id: 12,
  name: 'kapitan_szg',
  email: 'szg@example.com',
  avatar_url: null,
  has_discord: true,
  roles: ['user', 'captain'],
  captain_of_team_ids: [5],
}

export const competitions: Competition[] = [
  {
    id: 1,
    name: 'Liga Witelona CS2: jesień 2026',
    game: cs2,
    format: 'league',
    status: 'in_progress',
    teams_count: 6,
    min_teams: 4,
    max_teams: 6,
    registration_ends_at: '2026-10-20T22:00:00Z',
    starts_at: '2026-10-24T16:00:00Z',
  },
  {
    id: 2,
    name: 'Puchar Rektora Valorant',
    game: valorant,
    format: 'cup',
    status: 'in_progress',
    teams_count: 8,
    min_teams: 8,
    max_teams: 8,
    registration_ends_at: '2026-10-18T22:00:00Z',
    starts_at: '2026-10-25T15:00:00Z',
  },
  {
    id: 3,
    name: 'Zimowa Liga LoL',
    game: lol,
    format: 'league',
    status: 'registration',
    teams_count: 12,
    min_teams: 8,
    max_teams: 16,
    registration_ends_at: '2026-11-30T22:00:00Z',
    starts_at: '2026-12-05T16:00:00Z',
  },
  {
    id: 4,
    name: 'Puchar Legnicy CS2',
    game: cs2,
    format: 'cup',
    status: 'registration',
    teams_count: 5,
    min_teams: 8,
    max_teams: 16,
    registration_ends_at: '2026-11-15T22:00:00Z',
    starts_at: '2026-11-21T15:00:00Z',
  },
  {
    id: 5,
    name: 'Liga Akademicka Valorant',
    game: valorant,
    format: 'league',
    status: 'in_progress',
    teams_count: 10,
    min_teams: 6,
    max_teams: 10,
    registration_ends_at: '2026-10-10T22:00:00Z',
    starts_at: '2026-10-14T17:00:00Z',
  },
  {
    id: 6,
    name: 'Turniej Otwarcia LoL',
    game: lol,
    format: 'cup',
    status: 'finished',
    teams_count: 16,
    min_teams: 8,
    max_teams: 16,
    registration_ends_at: '2026-09-25T22:00:00Z',
    starts_at: '2026-10-01T15:00:00Z',
  },
  {
    id: 7,
    name: 'Liga Wakacyjna CS2',
    game: cs2,
    format: 'league',
    status: 'finished',
    teams_count: 8,
    min_teams: 4,
    max_teams: 8,
    registration_ends_at: '2026-07-01T22:00:00Z',
    starts_at: '2026-07-05T16:00:00Z',
  },
]

const defaultRules = {
  best_of: 2,
  points_win: 3,
  points_draw: 1,
  points_loss: 0,
  tiebreakers: ['points', 'score_diff', 'score_for', 'head_to_head'],
  description: 'Mecze BO2, mapy z puli Active Duty. Wynik zgłasza kapitan w ciągu 24 h.',
}

export function competitionDetails(competition: Competition): CompetitionDetails {
  const isLeague = competition.format === 'league'
  return {
    ...competition,
    rounds_count: isLeague ? 5 : 3,
    current_round: competition.status === 'in_progress' ? (isLeague ? 3 : 2) : null,
    rules: isLeague
      ? defaultRules
      : { ...defaultRules, best_of: 3, points_draw: null, description: 'Mecze BO3, przegrany odpada.' },
    organizer: { id: 2, name: 'org_witelona' },
    is_followed: competition.id === 1,
  }
}

export const standings: Standing[] = [
  { position: 1, team: kin, played: 2, wins: 2, draws: 0, losses: 0, score_for: 4, score_against: 0, score_diff: 4, points: 6, form: ['W', 'W'] },
  { position: 2, team: wlk, played: 2, wins: 1, draws: 1, losses: 0, score_for: 3, score_against: 1, score_diff: 2, points: 4, form: ['W', 'D'] },
  { position: 3, team: csm, played: 2, wins: 1, draws: 0, losses: 1, score_for: 2, score_against: 2, score_diff: 0, points: 3, form: ['L', 'W'] },
  { position: 4, team: nzm, played: 2, wins: 0, draws: 2, losses: 0, score_for: 2, score_against: 2, score_diff: 0, points: 2, form: ['D', 'D'] },
  { position: 5, team: pxb, played: 2, wins: 0, draws: 1, losses: 1, score_for: 1, score_against: 3, score_diff: -2, points: 1, form: ['D', 'L'] },
  { position: 6, team: szg, played: 2, wins: 0, draws: 0, losses: 2, score_for: 0, score_against: 4, score_diff: -4, points: 0, form: ['L', 'L'] },
]

export const leagueTeams: TeamSummary[] = [wlk, csm, nzm, pxb, szg, kin]

function addHours(date: string, hours: number) {
  return new Date(new Date(date).getTime() + hours * 3600000).toISOString().replace('.000Z', 'Z')
}

function leagueMatch(
  id: number,
  round: number,
  home: TeamSummary,
  away: TeamSummary,
  status: Match['status'],
  scheduledAt: string,
  score: [number, number] | null = null,
): Match {
  return {
    id,
    competition_id: 1,
    round: { number: round, stage: null },
    home_team: home,
    away_team: away,
    home_score: score ? score[0] : null,
    away_score: score ? score[1] : null,
    status,
    scheduled_at: scheduledAt,
    finished_at: status === 'finished' ? addHours(scheduledAt, 2) : null,
  }
}

export function createMatches(): Match[] {
  return [
    leagueMatch(101, 1, kin, szg, 'finished', '2026-10-24T16:00:00Z', [2, 0]),
    leagueMatch(102, 1, wlk, nzm, 'finished', '2026-10-24T18:00:00Z', [1, 1]),
    leagueMatch(103, 1, csm, pxb, 'finished', '2026-10-25T16:00:00Z', [2, 0]),
    leagueMatch(104, 2, pxb, nzm, 'finished', '2026-10-31T16:00:00Z', [1, 1]),
    leagueMatch(105, 2, szg, wlk, 'finished', '2026-10-31T18:00:00Z', [0, 2]),
    leagueMatch(106, 2, kin, csm, 'finished', '2026-11-01T16:00:00Z', [2, 0]),
    leagueMatch(107, 3, wlk, pxb, 'live', '2026-11-07T18:00:00Z', [1, 0]),
    leagueMatch(108, 3, nzm, szg, 'awaiting_confirmation', '2026-11-07T16:00:00Z', [2, 0]),
    leagueMatch(109, 3, csm, kin, 'scheduled', '2026-11-08T18:00:00Z'),
    leagueMatch(110, 4, szg, pxb, 'scheduled', '2026-11-14T16:00:00Z'),
    leagueMatch(111, 4, kin, wlk, 'scheduled', '2026-11-14T18:00:00Z'),
    leagueMatch(112, 4, nzm, csm, 'scheduled', '2026-11-15T16:00:00Z'),
  ]
}

export const maps = ['Ancient', 'Anubis', 'Dust II', 'Inferno', 'Mirage', 'Nuke', 'Train']

export function createReports(): Record<number, MatchReport[]> {
  return {
    108: [
      {
        id: 31,
        status: 'pending',
        reported_by_team_id: 3,
        reported_by: { id: 9, name: 'kapitan_nzm' },
        home_score: 2,
        away_score: 0,
        map: 'Mirage',
        comment: 'Druga mapa Inferno 13:9.',
        screenshot_url: null,
        created_at: '2026-11-07T18:05:12Z',
        dispute: null,
      },
    ],
  }
}

export const bracket: Bracket = {
  competition_id: 2,
  generated_at: '2026-10-19T08:00:00Z',
  champion: null,
  rounds: [
    {
      number: 1,
      stage: 'quarterfinal',
      matches: [
        { id: 201, position: 1, home_team: ofx, away_team: rkt, home_score: 2, away_score: 0, status: 'finished', winner_team_id: 11, next_match_id: 205, scheduled_at: '2026-10-25T15:00:00Z' },
        { id: 202, position: 2, home_team: csw, away_team: zmb, home_score: 1, away_score: 2, status: 'finished', winner_team_id: 15, next_match_id: 205, scheduled_at: '2026-10-25T17:00:00Z' },
        { id: 203, position: 3, home_team: brz, away_team: pkr, home_score: 2, away_score: 1, status: 'finished', winner_team_id: 12, next_match_id: 206, scheduled_at: '2026-10-26T15:00:00Z' },
        { id: 204, position: 4, home_team: lwj, away_team: skr, home_score: 0, away_score: 2, status: 'finished', winner_team_id: 16, next_match_id: 206, scheduled_at: '2026-10-26T17:00:00Z' },
      ],
    },
    {
      number: 2,
      stage: 'semifinal',
      matches: [
        { id: 205, position: 1, home_team: ofx, away_team: zmb, home_score: 2, away_score: 1, status: 'finished', winner_team_id: 11, next_match_id: 207, scheduled_at: '2026-11-01T15:00:00Z' },
        { id: 206, position: 2, home_team: brz, away_team: skr, home_score: 1, away_score: 1, status: 'live', winner_team_id: null, next_match_id: 207, scheduled_at: '2026-11-01T17:00:00Z' },
      ],
    },
    {
      number: 3,
      stage: 'final',
      matches: [
        { id: 207, position: 1, home_team: ofx, away_team: null, home_score: null, away_score: null, status: 'scheduled', winner_team_id: null, next_match_id: null, scheduled_at: '2026-11-08T17:00:00Z' },
      ],
    },
  ],
}

export const cupTeams: TeamSummary[] = [ofx, brz, lwj, csw, zmb, skr, pkr, rkt]
