import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { User } from '@/api/types'
import { routes } from '@/router/routes'
import AppHeader from './AppHeader.vue'

const user: User = {
  id: 1,
  name: 'Jakub Maliński',
  email: 'kuba@example.com',
  avatar_url: null,
  has_discord: false,
  roles: ['user', 'organizer'],
  captain_of_team_ids: [],
}

async function mountHeader(props: { user?: User | null } = {}) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push('/rozgrywki')
  await router.isReady()
  return mount(AppHeader, { props, global: { plugins: [router] } })
}

describe('AppHeader', () => {
  it('pokazuje przycisk logowania dla gościa', async () => {
    const wrapper = await mountHeader()
    const button = wrapper.find('button')
    expect(button.text()).toBe('Zaloguj się')
    await button.trigger('click')
    expect(wrapper.emitted('sign-in')).toHaveLength(1)
  })

  it('pokazuje inicjały zalogowanego użytkownika z linkiem do profilu', async () => {
    const wrapper = await mountHeader({ user })
    const link = wrapper.find('a[aria-label="Profil: Jakub Maliński"]')
    expect(link.attributes('href')).toBe('/profil')
    expect(link.text()).toBe('JM')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('pokazuje zdjęcie, gdy użytkownik je ma', async () => {
    const wrapper = await mountHeader({ user: { ...user, avatar_url: '/avatar.png' } })
    expect(wrapper.find('img').attributes('src')).toBe('/avatar.png')
  })
})
