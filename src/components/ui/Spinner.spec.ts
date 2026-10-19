import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Spinner from './Spinner.vue'

describe('Spinner', () => {
  it('ma domyślnie rozmiar md', () => {
    const wrapper = mount(Spinner)
    expect(wrapper.classes()).toContain('size-6')
  })

  it('w rozmiarze sm jest mniejszy', () => {
    const wrapper = mount(Spinner, { props: { size: 'sm' } })
    expect(wrapper.classes()).toContain('size-4')
  })

  it('bez etykiety jest ukryty dla czytników ekranu', () => {
    const wrapper = mount(Spinner)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.attributes('role')).toBeUndefined()
  })

  it('z etykietą ogłasza stan ładowania', () => {
    const wrapper = mount(Spinner, { props: { label: 'Ładowanie wyników' } })
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('Ładowanie wyników')
    expect(wrapper.attributes('aria-hidden')).toBeUndefined()
  })
})
