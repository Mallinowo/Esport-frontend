import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Checkbox from './Checkbox.vue'

describe('Checkbox', () => {
  it('wyświetla etykietę powiązaną z polem', () => {
    const wrapper = mount(Checkbox, { props: { label: 'Tylko otwarte zapisy' } })
    const label = wrapper.find('label')
    expect(label.text()).toBe('Tylko otwarte zapisy')
    expect(label.attributes('for')).toBe(wrapper.find('input').attributes('id'))
    expect(wrapper.find('input').attributes('type')).toBe('checkbox')
  })

  it('jest domyślnie niezaznaczony', () => {
    const wrapper = mount(Checkbox, { props: { label: 'Tylko otwarte zapisy' } })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(false)
  })

  it('pokazuje stan z v-model', () => {
    const wrapper = mount(Checkbox, { props: { label: 'Tylko otwarte zapisy', modelValue: true } })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(true)
  })

  it('zaznacza się po kliknięciu w etykietę', async () => {
    const wrapper = mount(Checkbox, {
      attachTo: document.body,
      props: { label: 'Tylko otwarte zapisy', modelValue: false, 'onUpdate:modelValue': (value: boolean) => wrapper.setProps({ modelValue: value }) },
    })
    await wrapper.find('label').trigger('click')
    expect(wrapper.props('modelValue')).toBe(true)
    wrapper.unmount()
  })

  it('odznacza się po ponownym kliknięciu', async () => {
    const wrapper = mount(Checkbox, {
      props: { label: 'Tylko otwarte zapisy', modelValue: true, 'onUpdate:modelValue': (value: boolean) => wrapper.setProps({ modelValue: value }) },
    })
    await wrapper.find('input').setValue(false)
    expect(wrapper.props('modelValue')).toBe(false)
  })

  it('jest zablokowany, gdy disabled', async () => {
    const wrapper = mount(Checkbox, {
      attachTo: document.body,
      props: { label: 'Tylko otwarte zapisy', disabled: true, modelValue: false },
    })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    await wrapper.find('label').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('przekazuje name do pola', () => {
    const wrapper = mount(Checkbox, { props: { label: 'Tylko otwarte zapisy', name: 'open' } })
    expect(wrapper.find('input').attributes('name')).toBe('open')
  })
})
