import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LiveIndicator from './LiveIndicator.vue'

describe('LiveIndicator', () => {
  it('renders live md by default with a text label', () => {
    const wrapper = mount(LiveIndicator)
    expect(wrapper.text()).toBe('Live')
    expect(wrapper.classes()).toContain('text-sm')
    expect(wrapper.find('[data-testid="live-dot"]').classes()).toContain('h-2')
  })

  it('renders the sm size', () => {
    const wrapper = mount(LiveIndicator, { props: { size: 'sm' } })
    expect(wrapper.classes()).toContain('text-xs')
    expect(wrapper.find('[data-testid="live-dot"]').classes()).toContain('h-1.5')
  })

  it('renders the offline state with its own label', () => {
    const wrapper = mount(LiveIndicator, { props: { status: 'offline' } })
    expect(wrapper.text()).toBe('Offline')
    expect(wrapper.classes()).toContain('text-slate-700')
    expect(wrapper.find('[data-testid="live-dot"]').classes()).toContain('bg-slate-500')
  })

  it('pulses only when live', () => {
    const live = mount(LiveIndicator, { props: { status: 'live' } })
    const offline = mount(LiveIndicator, { props: { status: 'offline' } })
    expect(live.find('[data-testid="live-dot"]').classes()).toContain('animate-pulse')
    expect(offline.find('[data-testid="live-dot"]').classes()).not.toContain('animate-pulse')
  })

  it('disables the pulse for reduced motion', () => {
    const wrapper = mount(LiveIndicator)
    expect(wrapper.find('[data-testid="live-dot"]').classes()).toContain('motion-reduce:animate-none')
  })

  it('uses a custom label when provided', () => {
    const wrapper = mount(LiveIndicator, { props: { label: 'In progress' } })
    expect(wrapper.text()).toBe('In progress')
  })

  it('hides the dot from assistive technology', () => {
    const wrapper = mount(LiveIndicator)
    expect(wrapper.find('[data-testid="live-dot"]').attributes('aria-hidden')).toBe('true')
  })
})