import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from './App.vue'
import { routes } from './router/routes'

async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push(path)
  await router.isReady()
  const wrapper = mount(App, { global: { plugins: [router] } })
  await new Promise((resolve) => setTimeout(resolve))
  return { wrapper, router }
}

describe('App', () => {
  it('przekierowuje ze strony głównej na rozgrywki', async () => {
    const { wrapper, router } = await mountAt('/')
    expect(router.currentRoute.value.name).toBe('competitions')
    expect(wrapper.find('h1').text()).toBe('Rozgrywki')
  })

  it('zaznacza aktywną sekcję w menu na stronie ligi', async () => {
    const { wrapper } = await mountAt('/ligi/1')
    const active = wrapper.findAll('[aria-current="page"]')
    expect(active).toHaveLength(2)
    expect(active.every((link) => link.text() === 'Rozgrywki')).toBe(true)
  })

  it.each([
    ['/ligi/1', 'Liga'],
    ['/turnieje/2', 'Drabinka'],
    ['/mecze/3/wynik', 'Zgłoszenie wyniku'],
    ['/nie-ma-takiej', 'Nie znaleziono strony'],
  ])('wyświetla widok dla %s', async (path, title) => {
    const { wrapper } = await mountAt(path)
    expect(wrapper.find('h1').text()).toBe(title)
  })
})
