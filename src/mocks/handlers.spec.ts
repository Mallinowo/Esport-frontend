import { describe, expect, it } from 'vitest'
import { api } from '@/api/client'
import { toApiError } from '@/api/errors'
import type { Competition, MatchDetails, MatchReport, Paginated, Resource } from '@/api/types'

async function getError(request: Promise<unknown>) {
  try {
    await request
  } catch (error) {
    return toApiError(error)
  }
  throw new Error('Żądanie powinno się nie udać')
}

function reportForm(fields: Record<string, string>) {
  const form = new FormData()
  Object.entries(fields).forEach(([key, value]) => form.append(key, value))
  return form
}

describe('mocki API', () => {
  it('zwracają listę rozgrywek z paginacją', async () => {
    const { data } = await api.get<Paginated<Competition>>('/competitions', { params: { per_page: 3 } })
    expect(data.data).toHaveLength(3)
    expect(data.meta).toEqual({ current_page: 1, last_page: 3, per_page: 3, total: 7 })
  })

  it('filtrują rozgrywki po grze, formacie i statusie', async () => {
    const { data } = await api.get<Paginated<Competition>>('/competitions?game=cs2&format[]=league&status[]=in_progress')
    expect(data.data.map((competition) => competition.id)).toEqual([1])
  })

  it('zwracają pustą listę, gdy nic nie pasuje do filtrów', async () => {
    const { data } = await api.get<Paginated<Competition>>('/competitions?game=lol&status[]=in_progress')
    expect(data.data).toEqual([])
    expect(data.meta.total).toBe(0)
  })

  it('zwracają 404 dla tabeli pucharu', async () => {
    const error = await getError(api.get('/competitions/2/standings'))
    expect(error.status).toBe(404)
  })

  it('pozwalają przeciwnikowi potwierdzić zgłoszony wynik', async () => {
    const { data } = await api.get<Resource<MatchDetails>>('/matches/108')
    expect(data.data.can).toEqual({ report: false, confirm: true, dispute: true, resolve: false })

    const confirmed = await api.post<Resource<MatchDetails>>('/matches/108/reports/31/confirm')
    expect(confirmed.data.data.status).toBe('finished')
    expect(confirmed.data.data.reports[0]!.status).toBe('confirmed')
  })

  it('zapisują zgłoszenie wyniku i zmieniają status meczu', async () => {
    const created = await api.post<Resource<MatchReport>>('/matches/110/reports', reportForm({ home_score: '2', away_score: '1', map: 'Nuke' }))
    expect(created.status).toBe(201)
    expect(created.data.data).toMatchObject({ status: 'pending', home_score: 2, away_score: 1, map: 'Nuke' })

    const { data } = await api.get<Resource<MatchDetails>>('/matches/110')
    expect(data.data.status).toBe('awaiting_confirmation')
    expect(data.data.can.report).toBe(false)
  })

  it('zwracają błędy walidacji przy polach', async () => {
    const error = await getError(api.post('/matches/110/reports', reportForm({ home_score: '100', away_score: '' })))
    expect(error.status).toBe(422)
    expect(error.fieldError('home_score')).toBe('Wynik musi być liczbą od 0 do 99.')
    expect(error.fieldError('away_score')).toBe('Wynik musi być liczbą od 0 do 99.')
  })

  it('nie pozwalają zgłosić wyniku w cudzym meczu', async () => {
    const error = await getError(api.post('/matches/109/reports', reportForm({ home_score: '1', away_score: '0' })))
    expect(error.status).toBe(403)
  })

  it('wymagają opisu przy sporze', async () => {
    const error = await getError(api.post('/matches/108/reports/31/dispute', reportForm({ comment: 'Nie' })))
    expect(error.fieldError('comment')).toBe('Opisz spór, od 10 do 1000 znaków.')
  })

  it('wracają do danych startowych po każdym teście', async () => {
    const { data } = await api.get<Resource<MatchDetails>>('/matches/110')
    expect(data.data.status).toBe('scheduled')
  })
})
