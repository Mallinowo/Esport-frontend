import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TextField from './TextField.vue'

describe('TextField', () => {
  it('wyświetla etykietę powiązaną z polem', () => {
    const wrapper = mount(TextField, { props: { label: 'Nazwa drużyny' } })
    const label = wrapper.find('label')
    expect(label.text()).toBe('Nazwa drużyny')
    expect(label.attributes('for')).toBe(wrapper.find('input').attributes('id'))
  })

  it('ma domyślnie typ text', () => {
    const wrapper = mount(TextField, { props: { label: 'Nazwa' } })
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('przekazuje typ pola', () => {
    const wrapper = mount(TextField, { props: { label: 'Wynik', type: 'number' } })
    expect(wrapper.find('input').attributes('type')).toBe('number')
  })

  it('aktualizuje v-model po wpisaniu tekstu', async () => {
    const wrapper = mount(TextField, {
      props: { label: 'Email', modelValue: '', 'onUpdate:modelValue': (value: string | number) => wrapper.setProps({ modelValue: value }) },
    })
    await wrapper.find('input').setValue('kuba@example.com')
    expect(wrapper.props('modelValue')).toBe('kuba@example.com')
  })

  it('pokazuje komunikat błędu pod polem i oznacza pole jako niepoprawne', () => {
    const wrapper = mount(TextField, { props: { label: 'Wynik', error: 'Wynik musi być liczbą od 0 do 99' } })
    const input = wrapper.find('input')
    const message = wrapper.find('p')
    expect(message.text()).toBe('Wynik musi być liczbą od 0 do 99')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe(message.attributes('id'))
  })

  it('bez błędu nie ma komunikatu ani aria-invalid', () => {
    const wrapper = mount(TextField, { props: { label: 'Wynik' } })
    expect(wrapper.find('p').exists()).toBe(false)
    expect(wrapper.find('input').attributes('aria-invalid')).toBeUndefined()
  })

  it('jest zablokowane, gdy disabled', () => {
    const wrapper = mount(TextField, { props: { label: 'Nazwa', disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('pokazuje ikonę ze slotu', () => {
    const wrapper = mount(TextField, { props: { label: 'Szukaj' }, slots: { icon: '<svg data-test="icon" />' } })
    expect(wrapper.find('[data-test="icon"]').exists()).toBe(true)
  })
})
