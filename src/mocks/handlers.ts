import { delay, http, HttpResponse } from 'msw'
import { apiUrl } from '@/api/client'
import type { Match, MatchDetails, MatchPermissions, MatchReport } from '@/api/types'
import {
  bracket,
  competitionDetails,
  competitions,
  createMatches,
  createReports,
  cupTeams,
  currentUser,
  games,
  leagueTeams,
  maps,
  standings,
} from './data'

const db = {
  matches: createMatches(),
  reports: createReports(),
  nextReportId: 32,
  loggedIn: true,
}

export function resetMockDb() {
  db.matches = createMatches()
  db.reports = createReports()
  db.nextReportId = 32
  db.loggedIn = true
}

function scenario() {
  return new URLSearchParams(globalThis.location?.search ?? '').get('mock')
}

function url(path: string) {
  return `${apiUrl}${path}`
}

function currentUserOrNull() {
  return db.loggedIn && scenario() !== 'guest' ? currentUser : null
}

function notFound() {
  return HttpResponse.json({ message: 'Not found.' }, { status: 404 })
}

function unauthenticated() {
  return HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 })
}

function forbidden() {
  return HttpResponse.json({ message: 'This action is unauthorized.' }, { status: 403 })
}

function conflict(message: string, code: string) {
  return HttpResponse.json({ message, code }, { status: 409 })
}

function validationError(errors: Record<string, string[]>) {
  const first = Object.values(errors)[0]?.[0] ?? 'Popraw zaznaczone pola.'
  return HttpResponse.json({ message: first, errors }, { status: 422 })
}

function findCompetition(id: string | readonly string[] | undefined) {
  return competitions.find((competition) => competition.id === Number(id))
}

function findMatch(id: string | readonly string[] | undefined) {
  return db.matches.find((match) => match.id === Number(id))
}

function permissions(match: Match): MatchPermissions {
  const user = currentUserOrNull()
  const none = { report: false, confirm: false, dispute: false, resolve: false }
  if (!user) return none

  const myTeamIds = [match.home_team?.id, match.away_team?.id].filter((id) => id !== undefined && user.captain_of_team_ids.includes(id))
  const isCaptain = myTeamIds.length > 0
  const pending = (db.reports[match.id] ?? []).find((report) => report.status === 'pending')
  const canAnswer = isCaptain && !!pending && !myTeamIds.includes(pending.reported_by_team_id)
  const isOrganizer = user.roles.includes('organizer') || user.roles.includes('admin')

  return {
    report: isCaptain && (match.status === 'scheduled' || match.status === 'live'),
    confirm: match.status === 'awaiting_confirmation' && (canAnswer || isOrganizer),
    dispute: match.status === 'awaiting_confirmation' && canAnswer,
    resolve: match.status === 'disputed' && isOrganizer,
  }
}

function matchDetails(match: Match): MatchDetails {
  const competition = findCompetition(String(match.competition_id))!
  return {
    id: match.id,
    competition: { id: competition.id, name: competition.name, format: competition.format, game: competition.game },
    round: match.round,
    best_of: competitionDetails(competition).rules.best_of,
    home_team: match.home_team!,
    away_team: match.away_team!,
    home_score: match.home_score,
    away_score: match.away_score,
    status: match.status,
    scheduled_at: match.scheduled_at,
    finished_at: match.finished_at,
    maps: competition.game.slug === 'cs2' ? maps : [],
    can: permissions(match),
    reports: [...(db.reports[match.id] ?? [])].reverse(),
  }
}

function scoreError(value: FormDataEntryValue | null) {
  const score = Number(value)
  if (value === null || value === '' || !Number.isInteger(score) || score < 0 || score > 99) {
    return ['Wynik musi być liczbą od 0 do 99.']
  }
  return null
}

function isImage(file: File) {
  return ['image/png', 'image/jpeg', 'image/webp'].includes(file.type)
}

function now() {
  return new Date().toISOString().replace(/\.\d+Z$/, 'Z')
}

export const handlers = [
  http.all('*', async ({ request }) => {
    if (!request.url.startsWith(new URL(apiUrl).origin)) return
    await delay()
    if (scenario() === 'error') {
      return HttpResponse.json({ message: 'Server Error.' }, { status: 500 })
    }
  }),

  http.get(`${new URL(apiUrl).origin}/sanctum/csrf-cookie`, () => new HttpResponse(null, { status: 204 })),

  http.post(url('/auth/login'), () => {
    db.loggedIn = true
    return HttpResponse.json({ data: currentUser })
  }),

  http.post(url('/auth/register'), () => {
    db.loggedIn = true
    return HttpResponse.json({ data: currentUser }, { status: 201 })
  }),

  http.post(url('/auth/logout'), () => {
    db.loggedIn = false
    return new HttpResponse(null, { status: 204 })
  }),

  http.get(url('/user'), () => {
    const user = currentUserOrNull()
    return user ? HttpResponse.json({ data: user }) : unauthenticated()
  }),

  http.get(url('/games'), () => HttpResponse.json({ data: games })),

  http.get(url('/competitions'), ({ request }) => {
    const params = new URL(request.url).searchParams
    const game = params.get('game')
    const formats = params.getAll('format[]')
    const statuses = params.getAll('status[]')
    const perPage = Math.min(Number(params.get('per_page')) || 12, 50)
    const page = Math.max(Number(params.get('page')) || 1, 1)

    const filtered =
      scenario() === 'empty'
        ? []
        : competitions.filter(
            (competition) =>
              competition.status !== 'draft' &&
              (!game || competition.game.slug === game) &&
              (formats.length === 0 || formats.includes(competition.format)) &&
              (statuses.length === 0 || statuses.includes(competition.status)),
          )

    return HttpResponse.json({
      data: filtered.slice((page - 1) * perPage, page * perPage),
      meta: {
        current_page: page,
        last_page: Math.max(Math.ceil(filtered.length / perPage), 1),
        per_page: perPage,
        total: filtered.length,
      },
    })
  }),

  http.get(url('/competitions/:id'), ({ params }) => {
    const competition = findCompetition(params.id)
    return competition ? HttpResponse.json({ data: competitionDetails(competition) }) : notFound()
  }),

  http.get(url('/competitions/:id/standings'), ({ params }) => {
    const competition = findCompetition(params.id)
    if (!competition || competition.format === 'cup') return notFound()
    const data = competition.id === 1 && scenario() !== 'empty' ? standings : []
    return HttpResponse.json({ data, meta: { updated_at: now() } })
  }),

  http.get(url('/competitions/:id/matches'), ({ params, request }) => {
    const competition = findCompetition(params.id)
    if (!competition) return notFound()
    const query = new URL(request.url).searchParams
    const round = query.get('round')
    const statuses = query.getAll('status[]')
    const data =
      scenario() === 'empty'
        ? []
        : db.matches.filter(
            (match) =>
              match.competition_id === competition.id &&
              (!round || match.round.number === Number(round)) &&
              (statuses.length === 0 || statuses.includes(match.status)),
          )
    return HttpResponse.json({ data })
  }),

  http.get(url('/competitions/:id/teams'), ({ params }) => {
    const competition = findCompetition(params.id)
    if (!competition) return notFound()
    const data = competition.id === 1 ? leagueTeams : competition.id === 2 ? cupTeams : []
    return HttpResponse.json({ data })
  }),

  http.post(url('/competitions/:id/follow'), ({ params }) => {
    if (!currentUserOrNull()) return unauthenticated()
    return findCompetition(params.id) ? new HttpResponse(null, { status: 204 }) : notFound()
  }),

  http.delete(url('/competitions/:id/follow'), ({ params }) => {
    if (!currentUserOrNull()) return unauthenticated()
    return findCompetition(params.id) ? new HttpResponse(null, { status: 204 }) : notFound()
  }),

  http.get(url('/competitions/:id/bracket'), ({ params }) => {
    const competition = findCompetition(params.id)
    if (!competition || competition.format === 'league') return notFound()
    if (competition.id === 2 && scenario() !== 'empty') return HttpResponse.json({ data: bracket })
    return HttpResponse.json({ data: { competition_id: competition.id, generated_at: null, champion: null, rounds: [] } })
  }),

  http.get(url('/user/matches'), () => {
    if (!currentUserOrNull()) return unauthenticated()
    const data =
      scenario() === 'empty'
        ? []
        : db.matches.filter((match) => {
            const can = permissions(match)
            return can.report || can.confirm || can.dispute
          })
    return HttpResponse.json({ data })
  }),

  http.get(url('/matches/:id'), ({ params }) => {
    const match = findMatch(params.id)
    return match ? HttpResponse.json({ data: matchDetails(match) }) : notFound()
  }),

  http.post(url('/matches/:id/reports'), async ({ params, request }) => {
    const match = findMatch(params.id)
    if (!match) return notFound()
    const user = currentUserOrNull()
    if (!user) return unauthenticated()
    if (match.status !== 'scheduled' && match.status !== 'live') {
      return conflict('Result already reported.', 'result_already_reported')
    }
    if (!permissions(match).report) return forbidden()

    const form = await request.formData()
    const errors: Record<string, string[]> = {}
    const homeError = scoreError(form.get('home_score'))
    const awayError = scoreError(form.get('away_score'))
    if (homeError) errors.home_score = homeError
    if (awayError) errors.away_score = awayError

    const map = form.get('map')
    if (map && !maps.includes(String(map))) errors.map = ['Wybierz mapę z listy.']

    const comment = form.get('comment')
    if (comment && String(comment).length > 500) errors.comment = ['Komentarz może mieć maksymalnie 500 znaków.']

    const screenshot = form.get('screenshot')
    if (screenshot instanceof File && screenshot.size > 0) {
      if (!isImage(screenshot)) errors.screenshot = ['Plik musi być obrazem PNG, JPG lub WEBP.']
      else if (screenshot.size > 5 * 1024 * 1024) errors.screenshot = ['Plik może mieć maksymalnie 5 MB.']
    }

    if (Object.keys(errors).length > 0) return validationError(errors)

    const homeScore = Number(form.get('home_score'))
    const awayScore = Number(form.get('away_score'))
    const teamId = user.captain_of_team_ids.find((id) => id === match.home_team?.id || id === match.away_team?.id)!
    const report: MatchReport = {
      id: db.nextReportId++,
      status: 'pending',
      reported_by_team_id: teamId,
      reported_by: { id: user.id, name: user.name },
      home_score: homeScore,
      away_score: awayScore,
      map: map ? String(map) : null,
      comment: comment ? String(comment) : null,
      screenshot_url: screenshot instanceof File && screenshot.size > 0 ? `http://localhost:8000/storage/reports/${db.nextReportId - 1}/${screenshot.name}` : null,
      created_at: now(),
      dispute: null,
    }

    db.reports[match.id] = [...(db.reports[match.id] ?? []), report]
    match.status = 'awaiting_confirmation'
    match.home_score = homeScore
    match.away_score = awayScore
    return HttpResponse.json({ data: report }, { status: 201 })
  }),

  http.post(url('/matches/:id/reports/:report/confirm'), ({ params }) => {
    const match = findMatch(params.id)
    const report = match && db.reports[match.id]?.find((item) => item.id === Number(params.report))
    if (!match || !report) return notFound()
    if (!currentUserOrNull()) return unauthenticated()
    if (report.status !== 'pending') return conflict('Report is not pending.', 'report_not_pending')
    if (!permissions(match).confirm) return forbidden()

    report.status = 'confirmed'
    match.status = 'finished'
    match.finished_at = now()
    return HttpResponse.json({ data: matchDetails(match) })
  }),

  http.post(url('/matches/:id/reports/:report/dispute'), async ({ params, request }) => {
    const match = findMatch(params.id)
    const report = match && db.reports[match.id]?.find((item) => item.id === Number(params.report))
    if (!match || !report) return notFound()
    const user = currentUserOrNull()
    if (!user) return unauthenticated()
    if (report.status !== 'pending') return conflict('Report is not pending.', 'report_not_pending')
    if (!permissions(match).dispute) return forbidden()

    const form = await request.formData()
    const comment = String(form.get('comment') ?? '').trim()
    const attachments = form.getAll('attachments[]').filter((file): file is File => file instanceof File && file.size > 0)
    const errors: Record<string, string[]> = {}
    if (comment.length < 10 || comment.length > 1000) errors.comment = ['Opisz spór, od 10 do 1000 znaków.']
    if (attachments.length > 3) errors.attachments = ['Możesz dodać maksymalnie 3 pliki.']
    else if (attachments.some((file) => !isImage(file))) errors.attachments = ['Pliki muszą być obrazami PNG, JPG lub WEBP.']
    if (Object.keys(errors).length > 0) return validationError(errors)

    report.status = 'disputed'
    report.dispute = {
      comment,
      attachments: attachments.map((file, index) => `http://localhost:8000/storage/disputes/${report.id}/${index + 1}-${file.name}`),
      created_by: { id: user.id, name: user.name },
      created_at: now(),
    }
    match.status = 'disputed'
    return HttpResponse.json({ data: matchDetails(match) })
  }),

  http.post(url('/matches/:id/resolve'), ({ params }) => {
    const match = findMatch(params.id)
    if (!match) return notFound()
    if (!currentUserOrNull()) return unauthenticated()
    return forbidden()
  }),
]
