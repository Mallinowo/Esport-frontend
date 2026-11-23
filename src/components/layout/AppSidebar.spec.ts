import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { User } from '@/api/types'
import { routes } from '@/router/routes'
import AppSidebar from './AppSidebar.vue'

const user: User = {
  id: 1,
  name: 'Jakub Maliński',
  email: 'kuba@example.com',
  avatar_url: null,
  has_discord: false,
  roles: ['user', 'organizer'],
  captain_of_team_ids: [],
}

async function mountSidebar(path: string, props: { user?: User | null } = {}) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push(path)
  await router.isReady()
  return mount(AppSidebar, { props, global: { plugins: [router] } })
}

describe('AppSidebar', () => {
  it('zaznacza aktywną sekcję', async () => {
    const wrapper = await mountSidebar('/profil')
    const active = wrapper.findAll('[aria-current="page"]')
    expect(active).toHaveLength(1)
    expect(active[0]!.text()).toBe('Profil')
  })

  it('pokazuje przycisk logowania dla gościa', async () => {
    const wrapper = await mountSidebar('/rozgrywki')
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('sign-in')).toHaveLength(1)
  })

  it('pokazuje nazwę i najwyższą rolę użytkownika', async () => {
    const wrapper = await mountSidebar('/rozgrywki', { user })
    expect(wrapper.text()).toContain('Jakub Maliński')
    expect(wrapper.text()).toContain('Organizator')
    expect(wrapper.find('button').exists()).toBe(false)
  })
})
