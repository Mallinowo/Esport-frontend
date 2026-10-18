import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from './Button.vue'

describe('Button', () => {
  it('wyświetla tekst i ma domyślnie typ button', () => {
    const wrapper = mount(Button, { slots: { default: 'Zgłoś wynik' } })
    expect(wrapper.text()).toBe('Zgłoś wynik')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('emituje kliknięcie', async () => {
    const wrapper = mount(Button, { slots: { default: 'Zapisz' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('stosuje klasy wariantu danger', () => {
    const wrapper = mount(Button, { props: { variant: 'danger' }, slots: { default: 'Usuń' } })
    expect(wrapper.classes()).toContain('bg-danger-default')
  })

  it('jest zablokowany, gdy disabled', () => {
    const wrapper = mount(Button, { props: { disabled: true }, slots: { default: 'Zapisz' } })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('text-fg-disabled')
  })

  it('w stanie loading pokazuje spinner i blokuje przycisk', () => {
    const wrapper = mount(Button, { props: { loading: true }, slots: { default: 'Zapisz' } })
    expect(wrapper.find('[data-test="spinner"]').exists()).toBe(true)
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('bez tekstu ma kwadratowy rozmiar dla samej ikony', () => {
    const wrapper = mount(Button, {
      attrs: { 'aria-label': 'Dodaj' },
      slots: { icon: '<svg />' },
    })
    expect(wrapper.classes()).toContain('size-10')
    expect(wrapper.attributes('aria-label')).toBe('Dodaj')
  })
})
