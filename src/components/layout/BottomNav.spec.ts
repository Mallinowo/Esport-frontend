import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from '@/router/routes'
import BottomNav from './BottomNav.vue'

async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push(path)
  await router.isReady()
  return mount(BottomNav, { global: { plugins: [router] } })
}

describe('BottomNav', () => {
  it('pokazuje cztery pozycje menu', async () => {
    const wrapper = await mountAt('/rozgrywki')
    expect(wrapper.findAll('a').map((link) => link.text())).toEqual(['Rozgrywki', 'Drużyny', 'Mecze', 'Profil'])
  })

  it('zaznacza tylko aktywną sekcję', async () => {
    const wrapper = await mountAt('/druzyny')
    const active = wrapper.findAll('[aria-current="page"]')
    expect(active).toHaveLength(1)
    expect(active[0]!.text()).toBe('Drużyny')
  })

  it('pokazuje pasek nad aktywną pozycją', async () => {
    const wrapper = await mountAt('/mecze/3/wynik')
    const indicators = wrapper.findAll('[data-test="indicator"]')
    expect(indicators).toHaveLength(1)
    expect(indicators[0]!.element.parentElement!.textContent!.trim()).toBe('Mecze')
  })
})
