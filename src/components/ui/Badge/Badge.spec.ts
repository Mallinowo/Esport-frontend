import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from './Badge.vue'

const tones = [
  ['neutral', 'text-fg-muted'],
  ['brand', 'text-brand-fg'],
  ['success', 'text-success-fg'],
  ['warning', 'text-warning-fg'],
  ['danger', 'text-danger-fg'],
  ['info', 'text-info-fg'],
] as const

describe('Badge', () => {
  it('always renders the label as text', () => {
    const wrapper = mount(Badge, { props: { label: 'W trakcie' } })
    expect(wrapper.text()).toBe('W trakcie')
  })

  it('uses the neutral tone by default', () => {
    const wrapper = mount(Badge, { props: { label: 'Gracz' } })
    expect(wrapper.classes()).toContain('text-fg-muted')
  })

  it.each(tones)('renders the %s tone with %s', (tone, className) => {
    const wrapper = mount(Badge, { props: { label: 'Status', tone } })
    expect(wrapper.classes()).toContain(className)
  })

  it('uses only one tone class at a time', () => {
    const wrapper = mount(Badge, { props: { label: 'Status', tone: 'success' } })
    const toneClasses = tones.map(([, className]) => className)
    const applied = wrapper.classes().filter((className) => toneClasses.includes(className as never))
    expect(applied).toEqual(['text-success-fg'])
  })

  it('draws the border in the tone color', () => {
    const wrapper = mount(Badge, { props: { label: 'Status', tone: 'danger' } })
    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('border-current')
  })

  it('uses the caption typography token', () => {
    const wrapper = mount(Badge, { props: { label: 'Status' } })
    expect(wrapper.classes()).toContain('text-caption')
  })

  it('renders the optional icon and keeps the label', () => {
    const wrapper = mount(Badge, {
      props: { label: 'Zakończony', tone: 'success' },
      slots: { icon: '<svg data-testid="svg" />' },
    })
    expect(wrapper.find('[data-testid="svg"]').exists()).toBe(true)
    expect(wrapper.text()).toBe('Zakończony')
  })

  it('hides the icon from assistive technology', () => {
    const wrapper = mount(Badge, {
      props: { label: 'Zakończony' },
      slots: { icon: '<svg />' },
    })
    expect(wrapper.find('[data-testid="badge-icon"]').attributes('aria-hidden')).toBe('true')
  })

  it('does not render an icon wrapper without the slot', () => {
    const wrapper = mount(Badge, { props: { label: 'Gracz' } })
    expect(wrapper.find('[data-testid="badge-icon"]').exists()).toBe(false)
  })
})