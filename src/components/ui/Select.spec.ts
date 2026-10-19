import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Select, { type SelectOption, type SelectValue } from './Select.vue'

const games: SelectOption[] = [
  { value: 'cs2', label: 'Counter-Strike 2' },
  { value: 'lol', label: 'League of Legends' },
  { value: 'val', label: 'Valorant', disabled: true },
  { value: 'r6', label: 'Rainbow Six Siege' },
]

function mountSelect(props: Record<string, unknown> = {}) {
  const wrapper = mount(Select, {
    props: {
      label: 'Gra',
      options: games,
      modelValue: null,
      'onUpdate:modelValue': (value: SelectValue | null) => wrapper.setProps({ modelValue: value }),
      ...props,
    },
  })
  return wrapper
}

describe('Select', () => {
  it('wyświetla etykietę powiązaną z polem', () => {
    const wrapper = mountSelect()
    const label = wrapper.find('label')
    expect(label.text()).toBe('Gra')
    expect(label.attributes('for')).toBe(wrapper.find('button').attributes('id'))
  })

  it('pokazuje placeholder, gdy nic nie wybrano', () => {
    const wrapper = mountSelect({ placeholder: 'Wybierz grę' })
    expect(wrapper.find('button').text()).toBe('Wybierz grę')
  })

  it('pokazuje etykietę wybranej opcji', () => {
    const wrapper = mountSelect({ modelValue: 'lol' })
    expect(wrapper.find('button').text()).toBe('League of Legends')
  })

  it('otwiera i zamyka listę po kliknięciu', async () => {
    const wrapper = mountSelect()
    const button = wrapper.find('button')
    expect(button.attributes('aria-expanded')).toBe('false')
    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('[role="listbox"]').isVisible()).toBe(true)
    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('false')
  })

  it('wybiera opcję kliknięciem i zamyka listę', async () => {
    const wrapper = mountSelect()
    await wrapper.find('button').trigger('click')
    await wrapper.findAll('[role="option"]')[1]!.trigger('click')
    expect(wrapper.props('modelValue')).toBe('lol')
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('false')
  })

  it('nie wybiera wyłączonej opcji', async () => {
    const wrapper = mountSelect()
    await wrapper.find('button').trigger('click')
    await wrapper.findAll('[role="option"]')[2]!.trigger('click')
    expect(wrapper.props('modelValue')).toBeNull()
  })

  it('obsługuje klawiaturę i pomija wyłączone opcje', async () => {
    const wrapper = mountSelect()
    const button = wrapper.find('button')
    await button.trigger('keydown', { key: 'ArrowDown' })
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(button.attributes('aria-activedescendant')).toBe(wrapper.findAll('[role="option"]')[0]!.attributes('id'))
    await button.trigger('keydown', { key: 'ArrowDown' })
    await button.trigger('keydown', { key: 'ArrowDown' })
    expect(button.attributes('aria-activedescendant')).toBe(wrapper.findAll('[role="option"]')[3]!.attributes('id'))
    await button.trigger('keydown', { key: 'Enter' })
    expect(wrapper.props('modelValue')).toBe('r6')
    expect(button.attributes('aria-expanded')).toBe('false')
  })

  it('skacze do opcji po pierwszej literze', async () => {
    const wrapper = mountSelect()
    const button = wrapper.find('button')
    await button.trigger('keydown', { key: 'Enter' })
    await button.trigger('keydown', { key: 'l' })
    await button.trigger('keydown', { key: ' ' })
    expect(wrapper.props('modelValue')).toBe('lol')
  })

  it('zamyka listę klawiszem Escape bez zmiany wartości', async () => {
    const wrapper = mountSelect({ modelValue: 'cs2' })
    const button = wrapper.find('button')
    await button.trigger('keydown', { key: 'ArrowDown' })
    await button.trigger('keydown', { key: 'ArrowDown' })
    await button.trigger('keydown', { key: 'Escape' })
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(wrapper.props('modelValue')).toBe('cs2')
  })

  it('oznacza wybraną opcję jako aria-selected', async () => {
    const wrapper = mountSelect({ modelValue: 'cs2' })
    const options = wrapper.findAll('[role="option"]')
    expect(options[0]!.attributes('aria-selected')).toBe('true')
    expect(options[1]!.attributes('aria-selected')).toBe('false')
  })

  it('pokazuje komunikat błędu pod polem i oznacza pole jako niepoprawne', () => {
    const wrapper = mountSelect({ error: 'Wybierz grę' })
    const button = wrapper.find('button')
    const message = wrapper.find('p')
    expect(message.text()).toBe('Wybierz grę')
    expect(button.attributes('aria-invalid')).toBe('true')
    expect(button.attributes('aria-describedby')).toBe(message.attributes('id'))
  })

  it('jest zablokowane, gdy disabled', async () => {
    const wrapper = mountSelect({ disabled: true })
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
    await button.trigger('keydown', { key: 'ArrowDown' })
    expect(button.attributes('aria-expanded')).toBe('false')
  })

  it('przekazuje wartość do formularza przez ukryte pole', () => {
    const wrapper = mountSelect({ name: 'game', modelValue: 'cs2' })
    const input = wrapper.find('input[type="hidden"]')
    expect(input.attributes('name')).toBe('game')
    expect(input.attributes('value')).toBe('cs2')
  })
})
