import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tabs from './Tabs.vue'

const tabs = [
  { value: 'table', label: 'Tabela' },
  { value: 'schedule', label: 'Terminarz' },
  { value: 'teams', label: 'Drużyny' },
  { value: 'rules', label: 'Regulamin', disabled: true },
]

function mountTabs(modelValue = 'table', attachTo?: HTMLElement) {
  const wrapper = mount(Tabs, {
    attachTo,
    props: {
      tabs,
      label: 'Sekcje ligi',
      modelValue,
      'onUpdate:modelValue': (value: string) => wrapper.setProps({ modelValue: value }),
    },
    slots: { default: '<template #default="{ active }"><p>Panel {{ active }}</p></template>' },
  })
  return wrapper
}

describe('Tabs', () => {
  it('wyświetla listę zakładek z etykietą', () => {
    const wrapper = mountTabs()
    const list = wrapper.find('[role="tablist"]')
    expect(list.attributes('aria-label')).toBe('Sekcje ligi')
    expect(wrapper.findAll('[role="tab"]').map((tab) => tab.text())).toEqual(['Tabela', 'Terminarz', 'Drużyny', 'Regulamin'])
  })

  it('oznacza aktywną zakładkę', () => {
    const wrapper = mountTabs('schedule')
    const selected = wrapper.findAll('[role="tab"]').map((tab) => tab.attributes('aria-selected'))
    expect(selected).toEqual(['false', 'true', 'false', 'false'])
  })

  it('zmienia zakładkę po kliknięciu', async () => {
    const wrapper = mountTabs()
    await wrapper.findAll('[role="tab"]')[2].trigger('click')
    expect(wrapper.props('modelValue')).toBe('teams')
    expect(wrapper.find('[role="tabpanel"]').text()).toBe('Panel teams')
  })

  it('nie zmienia zakładki po kliknięciu w wyłączoną', async () => {
    const wrapper = mountTabs()
    const rules = wrapper.findAll('[role="tab"]')[3]
    expect(rules.attributes('disabled')).toBeDefined()
    await rules.trigger('click')
    expect(wrapper.props('modelValue')).toBe('table')
  })

  it('łączy panel z aktywną zakładką', () => {
    const wrapper = mountTabs('schedule')
    const panel = wrapper.find('[role="tabpanel"]')
    const active = wrapper.findAll('[role="tab"]')[1]
    expect(panel.attributes('aria-labelledby')).toBe(active.attributes('id'))
    expect(active.attributes('aria-controls')).toBe(panel.attributes('id'))
  })

  it('nie renderuje panelu bez slotu', () => {
    const wrapper = mount(Tabs, { props: { tabs, label: 'Sekcje ligi', modelValue: 'table' } })
    expect(wrapper.find('[role="tabpanel"]').exists()).toBe(false)
  })

  it('tylko aktywna zakładka jest w kolejności tabulacji', () => {
    const wrapper = mountTabs('schedule')
    const tabindex = wrapper.findAll('[role="tab"]').map((tab) => tab.attributes('tabindex'))
    expect(tabindex).toEqual(['-1', '0', '-1', '-1'])
  })

  it('przechodzi strzałką w prawo do następnej zakładki i ją fokusuje', async () => {
    const wrapper = mountTabs('table', document.body)
    await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.props('modelValue')).toBe('schedule')
    expect(document.activeElement).toBe(wrapper.findAll('[role="tab"]')[1].element)
    wrapper.unmount()
  })

  it('przechodzi strzałką w lewo do poprzedniej zakładki', async () => {
    const wrapper = mountTabs('schedule')
    await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.props('modelValue')).toBe('table')
  })

  it('pomija wyłączoną zakładkę i wraca na początek', async () => {
    const wrapper = mountTabs('teams')
    await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.props('modelValue')).toBe('table')
  })

  it('z pierwszej zakładki strzałka w lewo przechodzi na ostatnią dostępną', async () => {
    const wrapper = mountTabs('table')
    await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.props('modelValue')).toBe('teams')
  })

  it('Home i End przechodzą na pierwszą i ostatnią dostępną zakładkę', async () => {
    const wrapper = mountTabs('schedule')
    const list = wrapper.find('[role="tablist"]')
    await list.trigger('keydown', { key: 'End' })
    expect(wrapper.props('modelValue')).toBe('teams')
    await list.trigger('keydown', { key: 'Home' })
    expect(wrapper.props('modelValue')).toBe('table')
  })

  it('ignoruje inne klawisze', async () => {
    const wrapper = mountTabs('schedule')
    await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'Enter' })
    expect(wrapper.props('modelValue')).toBe('schedule')
  })
})
