import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Alert from './Alert.vue'

describe('Alert', () => {
  it('pokazuje tytuł i treść', () => {
    const wrapper = mount(Alert, {
      props: { title: 'Zapisano wynik' },
      slots: { default: 'Drugi kapitan musi go potwierdzić.' },
    })
    expect(wrapper.text()).toContain('Zapisano wynik')
    expect(wrapper.text()).toContain('Drugi kapitan musi go potwierdzić.')
  })

  it('domyślnie ma ton info i rolę status', () => {
    const wrapper = mount(Alert, { props: { title: 'Informacja' } })
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.classes()).toContain('bg-info-bg')
  })

  it.each([
    ['success', 'status', 'bg-success-bg'],
    ['warning', 'alert', 'bg-warning-bg'],
    ['danger', 'alert', 'bg-danger-bg'],
  ] as const)('ton %s ma rolę %s i swoje tło', (tone, role, background) => {
    const wrapper = mount(Alert, { props: { tone, title: 'Komunikat' } })
    expect(wrapper.attributes('role')).toBe(role)
    expect(wrapper.classes()).toContain(background)
  })

  it('ukrywa ikonę przed czytnikiem ekranu', () => {
    const wrapper = mount(Alert, { props: { title: 'Komunikat' } })
    expect(wrapper.find('[data-testid="alert-icon"]').attributes('aria-hidden')).toBe('true')
  })

  it('nie renderuje treści, gdy nie ma slotu', () => {
    const wrapper = mount(Alert, { props: { title: 'Sam tytuł' } })
    expect(wrapper.find('[data-testid="alert-content"]').exists()).toBe(false)
  })

  it('nie pokazuje przycisków, gdy nie są potrzebne', () => {
    const wrapper = mount(Alert, { props: { title: 'Komunikat' } })
    expect(wrapper.findAll('button')).toHaveLength(0)
  })

  it('emituje action po kliknięciu przycisku akcji', async () => {
    const wrapper = mount(Alert, { props: { tone: 'danger', title: 'Błąd sieci', actionLabel: 'Spróbuj ponownie' } })
    const button = wrapper.find('button')
    expect(button.text()).toBe('Spróbuj ponownie')
    await button.trigger('click')
    expect(wrapper.emitted('action')).toHaveLength(1)
  })

  it('emituje close po kliknięciu przycisku zamknięcia', async () => {
    const wrapper = mount(Alert, { props: { title: 'Zapisano', dismissible: true } })
    const button = wrapper.find('button[aria-label="Zamknij"]')
    expect(button.exists()).toBe(true)
    await button.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
