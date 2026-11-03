import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TeamLogo from './TeamLogo.vue'

describe('TeamLogo', () => {
  it('renders the logo with the team name as alt text', () => {
    const wrapper = mount(TeamLogo, { props: { name: 'Wilki Legnica', src: '/wlk.png' } })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/wlk.png')
    expect(img.attributes('alt')).toBe('Wilki Legnica')
  })

  it('shows the short name in capitals when there is no logo', () => {
    const wrapper = mount(TeamLogo, { props: { name: 'Wilki Legnica', shortName: 'wlk' } })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toBe('WLK')
  })

  it('uses the first three letters of the name without a short name', () => {
    const wrapper = mount(TeamLogo, { props: { name: 'Wilki Legnica' } })
    expect(wrapper.text()).toBe('WIL')
  })

  it('truncates a long short name to three characters', () => {
    const wrapper = mount(TeamLogo, { props: { name: 'Wilki Legnica', shortName: 'WLKX' } })
    expect(wrapper.text()).toBe('WLK')
  })

  it('shows a question mark when there is no usable name', () => {
    const wrapper = mount(TeamLogo, { props: { name: '  ' } })
    expect(wrapper.text()).toBe('?')
  })

  it('falls back when src is null', () => {
    const wrapper = mount(TeamLogo, { props: { name: 'Wilki Legnica', shortName: 'WLK', src: null } })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toBe('WLK')
  })

  it('falls back when the logo fails to load', async () => {
    const wrapper = mount(TeamLogo, { props: { name: 'Wilki Legnica', shortName: 'WLK', src: '/broken.png' } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toBe('WLK')
  })

  it('tries the logo again when src changes after an error', async () => {
    const wrapper = mount(TeamLogo, { props: { name: 'Wilki Legnica', src: '/broken.png' } })
    await wrapper.find('img').trigger('error')
    await wrapper.setProps({ src: '/new.png' })
    expect(wrapper.find('img').attributes('src')).toBe('/new.png')
  })

  it('exposes the fallback as an image with the team name as label', () => {
    const wrapper = mount(TeamLogo, { props: { name: 'Wilki Legnica', shortName: 'WLK' } })
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Wilki Legnica')
  })

  it('renders md by default and supports other sizes', () => {
    const md = mount(TeamLogo, { props: { name: 'Wilki Legnica' } })
    expect(md.classes()).toEqual(expect.arrayContaining(['h-12', 'w-12', 'text-label']))
    const sm = mount(TeamLogo, { props: { name: 'Wilki Legnica', size: 'sm' } })
    expect(sm.classes()).toEqual(expect.arrayContaining(['h-8', 'w-8', 'text-caption']))
    const lg = mount(TeamLogo, { props: { name: 'Wilki Legnica', size: 'lg' } })
    expect(lg.classes()).toEqual(expect.arrayContaining(['h-16', 'w-16']))
  })

  it('has rounded corners instead of a circle and uses the muted token for the fallback', () => {
    const wrapper = mount(TeamLogo, { props: { name: 'Wilki Legnica' } })
    expect(wrapper.classes()).toContain('rounded-md')
    expect(wrapper.classes()).not.toContain('rounded-full')
    expect(wrapper.classes()).toContain('text-fg-muted')
  })
})