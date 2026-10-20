import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from './EmptyState.vue'

describe('EmptyState', () => {
  it('renders the title as h2 by default', () => {
    const wrapper = mount(EmptyState, { props: { title: 'No data' } })
    const heading = wrapper.find('h2')
    expect(heading.exists()).toBe(true)
    expect(heading.text()).toBe('No data')
  })

  it('renders the heading at the requested level', () => {
    const wrapper = mount(EmptyState, { props: { title: 'No data', headingLevel: 3 } })
    expect(wrapper.find('h3').exists()).toBe(true)
    expect(wrapper.find('h2').exists()).toBe(false)
  })

  it('renders description only when provided', () => {
    const without = mount(EmptyState, { props: { title: 'No data' } })
    expect(without.find('p').exists()).toBe(false)

    const withText = mount(EmptyState, {
      props: { title: 'No data', description: 'Add something first.' },
    })
    expect(withText.find('p').text()).toBe('Add something first.')
  })

  it('renders icon and actions slots', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No data' },
      slots: {
        icon: '<span data-testid="icon">i</span>',
        actions: '<button>Add</button>',
      },
    })
    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Add')
  })

  it('hides the icon wrapper from assistive technology', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No data' },
      slots: { icon: '<span>i</span>' },
    })
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
  })

  it('does not render icon or actions containers without slots', () => {
    const wrapper = mount(EmptyState, { props: { title: 'No data' } })
    expect(wrapper.findAll('div')).toHaveLength(0)
  })
})