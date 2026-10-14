import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HomeView from './HomeView.vue'

describe('HomeView', () => {
  it('wyświetla nagłówek', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.find('h1').text()).toContain('Platforma lig i turniejów')
  })
})
