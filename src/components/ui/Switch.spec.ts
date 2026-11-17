import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Switch from './Switch.vue'

describe('Switch', () => {
  it('wyświetla etykietę powiązaną z polem', () => {
    const wrapper = mount(Switch, { props: { label: 'Powiadomienia o wynikach' } })
    const label = wrapper.find('label')
    expect(label.text()).toBe('Powiadomienia o wynikach')
    expect(label.attributes('for')).toBe(wrapper.find('input').attributes('id'))
    expect(wrapper.find('input').attributes('role')).toBe('switch')
  })

  it('jest domyślnie wyłączony', () => {
    const wrapper = mount(Switch, { props: { label: 'Powiadomienia o wynikach' } })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(false)
  })

  it('pokazuje stan z v-model', () => {
    const wrapper = mount(Switch, { props: { label: 'Powiadomienia o wynikach', modelValue: true } })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(true)
  })

  it('włącza się po kliknięciu w etykietę', async () => {
    const wrapper = mount(Switch, {
      attachTo: document.body,
      props: {
        label: 'Powiadomienia o wynikach',
        modelValue: false,
        'onUpdate:modelValue': (value: boolean) => wrapper.setProps({ modelValue: value }),
      },
    })
    await wrapper.find('label').trigger('click')
    expect(wrapper.props('modelValue')).toBe(true)
    wrapper.unmount()
  })

  it('wyłącza się po ponownym kliknięciu', async () => {
    const wrapper = mount(Switch, {
      props: {
        label: 'Powiadomienia o wynikach',
        modelValue: true,
        'onUpdate:modelValue': (value: boolean) => wrapper.setProps({ modelValue: value }),
      },
    })
    await wrapper.find('input').setValue(false)
    expect(wrapper.props('modelValue')).toBe(false)
  })

  it('jest zablokowany, gdy disabled', async () => {
    const wrapper = mount(Switch, {
      attachTo: document.body,
      props: { label: 'Powiadomienia o wynikach', disabled: true, modelValue: false },
    })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    await wrapper.find('label').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('przekazuje name do pola', () => {
    const wrapper = mount(Switch, { props: { label: 'Powiadomienia o wynikach', name: 'notifications' } })
    expect(wrapper.find('input').attributes('name')).toBe('notifications')
  })
})
