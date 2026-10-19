import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from './Card.vue'

describe('Card', () => {
  it('renders default slot, header and footer', () => {
    const wrapper = mount(Card, {
      slots: { default: 'Body', header: 'Head', footer: 'Foot' },
    })
    expect(wrapper.text()).toContain('Body')
    expect(wrapper.text()).toContain('Head')
    expect(wrapper.text()).toContain('Foot')
  })

  it('default variant is not interactive', async () => {
    const wrapper = mount(Card, { slots: { default: 'Body' } })
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('tabindex')).toBeUndefined()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('interactive variant is focusable and emits click', async () => {
    const wrapper = mount(Card, { props: { variant: 'interactive' } })
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('tabindex')).toBe('0')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('emits click on Enter and Space', async () => {
    const wrapper = mount(Card, { props: { variant: 'interactive' } })
    await wrapper.trigger('keydown', { key: 'Enter' })
    await wrapper.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('click')).toHaveLength(2)
  })

  it('selected state sets aria-pressed and shows icon', () => {
    const wrapper = mount(Card, { props: { variant: 'interactive', selected: true } })
    expect(wrapper.attributes('aria-pressed')).toBe('true')
    expect(wrapper.find('[data-testid="card-selected-icon"]').exists()).toBe(true)
  })

  it('disabled interactive card does not emit and is not tabbable', async () => {
    const wrapper = mount(Card, { props: { variant: 'interactive', disabled: true } })
    expect(wrapper.attributes('tabindex')).toBe('-1')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('renders a custom root element via "as"', () => {
    const wrapper = mount(Card, { props: { as: 'article' } })
    expect(wrapper.element.tagName).toBe('ARTICLE')
  })
})
