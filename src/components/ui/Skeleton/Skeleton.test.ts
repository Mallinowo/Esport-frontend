import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Skeleton from './Skeleton.vue'

describe('Skeleton', () => {
  it('renders a single text shape by default', () => {
    const wrapper = mount(Skeleton)
    const shapes = wrapper.findAll('[data-testid="skeleton-shape"]')
    expect(shapes).toHaveLength(1)
    expect(shapes[0].classes()).toContain('rounded')
    expect(shapes[0].classes()).toContain('animate-pulse')
  })

  it('renders several lines and shortens the last one', () => {
    const wrapper = mount(Skeleton, { props: { variant: 'text', lines: 3 } })
    const shapes = wrapper.findAll('[data-testid="skeleton-shape"]')
    expect(shapes).toHaveLength(3)
    expect((shapes[0].element as HTMLElement).style.width).toBe('100%')
    expect((shapes[2].element as HTMLElement).style.width).toBe('60%')
  })

  it('ignores lines for non-text variants', () => {
    const wrapper = mount(Skeleton, { props: { variant: 'rect', lines: 4 } })
    expect(wrapper.findAll('[data-testid="skeleton-shape"]')).toHaveLength(1)
  })

  it('renders a circle with equal width and height', () => {
    const wrapper = mount(Skeleton, { props: { variant: 'circle' } })
    const shape = wrapper.find('[data-testid="skeleton-shape"]')
    const style = (shape.element as HTMLElement).style
    expect(shape.classes()).toContain('rounded-full')
    expect(style.width).toBe('3rem')
    expect(style.height).toBe('3rem')
  })

  it('renders a rect with default size', () => {
    const wrapper = mount(Skeleton, { props: { variant: 'rect' } })
    const shape = wrapper.find('[data-testid="skeleton-shape"]')
    const style = (shape.element as HTMLElement).style
    expect(shape.classes()).toContain('rounded-md')
    expect(style.width).toBe('100%')
    expect(style.height).toBe('8rem')
  })

  it('applies custom width and height', () => {
    const wrapper = mount(Skeleton, { props: { variant: 'rect', width: '12rem', height: '4rem' } })
    const style = (wrapper.find('[data-testid="skeleton-shape"]').element as HTMLElement).style
    expect(style.width).toBe('12rem')
    expect(style.height).toBe('4rem')
  })

  it('announces loading to assistive technology and hides shapes', () => {
    const wrapper = mount(Skeleton, { props: { label: 'Loading matches' } })
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.find('.sr-only').text()).toBe('Loading matches')
    expect(wrapper.find('[data-testid="skeleton-shape"]').attributes('aria-hidden')).toBe('true')
  })

  it('disables the pulse animation for reduced motion', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.find('[data-testid="skeleton-shape"]').classes()).toContain('motion-reduce:animate-none')
  })
})