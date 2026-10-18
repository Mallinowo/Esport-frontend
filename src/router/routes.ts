import type { RouteRecordRaw } from 'vue-router'
import CompetitionsView from '@/views/CompetitionsView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/rozgrywki' },
  { path: '/rozgrywki', name: 'competitions', component: CompetitionsView, meta: { section: 'competitions' } },
  { path: '/ligi/:id', name: 'league', component: () => import('@/views/LeagueView.vue'), props: true, meta: { section: 'competitions' } },
  { path: '/turnieje/:id', name: 'bracket', component: () => import('@/views/BracketView.vue'), props: true, meta: { section: 'competitions' } },
  { path: '/mecze/:id/wynik', name: 'match-result', component: () => import('@/views/MatchResultView.vue'), props: true, meta: { section: 'matches' } },
  { path: '/druzyny', name: 'teams', component: () => import('@/views/TeamsView.vue'), meta: { section: 'teams' } },
  { path: '/mecze', name: 'matches', component: () => import('@/views/MatchesView.vue'), meta: { section: 'matches' } },
  { path: '/profil', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { section: 'profile' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
]
