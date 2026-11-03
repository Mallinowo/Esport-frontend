import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Avatar from './Avatar.vue'

describe('Avatar', () => {
  it('renders the image with the name as alt text', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jan Kowalski', src: '/jan.png' } })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/jan.png')
    expect(img.attributes('alt')).toBe('Jan Kowalski')
  })

  it('shows two initials when there is no image', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jan Kowalski' } })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toBe('JK')
  })

  it('shows one initial for a single-word name', () => {
    const wrapper = mount(Avatar, { props: { name: 'kapitan_zmb' } })
    expect(wrapper.text()).toBe('K')
  })

  it('uses at most two initials', () => {
    const wrapper = mount(Avatar, { props: { name: 'Anna Maria Nowak' } })
    expect(wrapper.text()).toBe('AM')
  })

  it('shows a question mark for an empty name', () => {
    const wrapper = mount(Avatar, { props: { name: '   ' } })
    expect(wrapper.text()).toBe('?')
  })

  it('falls back to initials when src is null', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jan Kowalski', src: null } })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toBe('JK')
  })

  it('falls back to initials when the image fails to load', async () => {
    const wrapper = mount(Avatar, { props: { name: 'Jan Kowalski', src: '/broken.png' } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toBe('JK')
  })

  it('tries the image again when src changes after an error', async () => {
    const wrapper = mount(Avatar, { props: { name: 'Jan Kowalski', src: '/broken.png' } })
    await wrapper.find('img').trigger('error')
    await wrapper.setProps({ src: '/new.png' })
    expect(wrapper.find('img').attributes('src')).toBe('/new.png')
  })

  it('exposes the fallback as an image with the name as label', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jan Kowalski' } })
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Jan Kowalski')
  })

  it('does not add role or label when the image is shown', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jan Kowalski', src: '/jan.png' } })
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('aria-label')).toBeUndefined()
  })

  it('renders md by default and supports other sizes', () => {
    const md = mount(Avatar, { props: { name: 'Jan Kowalski' } })
    expect(md.classes()).toEqual(expect.arrayContaining(['h-10', 'w-10', 'text-label']))
    const xs = mount(Avatar, { props: { name: 'Jan Kowalski', size: 'xs' } })
    expect(xs.classes()).toEqual(expect.arrayContaining(['h-6', 'w-6', 'text-caption']))
    const xl = mount(Avatar, { props: { name: 'Jan Kowalski', size: 'xl' } })
    expect(xl.classes()).toEqual(expect.arrayContaining(['h-16', 'w-16']))
  })

  it('is round and uses the muted token for the fallback', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jan Kowalski' } })
    expect(wrapper.classes()).toContain('rounded-full')
    expect(wrapper.classes()).toContain('text-fg-muted')
  })
})