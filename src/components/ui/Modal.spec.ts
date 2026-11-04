import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import Modal from './Modal.vue'

function mountModal(open = true, props = {}) {
  return mount(Modal, {
    props: { title: 'Zgłoś wynik', open, ...props },
    slots: {
      default: 'Po zgłoszeniu wyniku nie można go edytować.',
      footer: '<button type="button">Anuluj</button>',
    },
    attachTo: document.body,
  })
}

function dialog() {
  return document.body.querySelector('[role="dialog"]')
}

enableAutoUnmount(afterEach)

describe('Modal', () => {
  it('nic nie pokazuje, gdy jest zamknięty', () => {
    mountModal(false)
    expect(dialog()).toBeNull()
  })

  it('pokazuje okno z tytułem i treścią w body', () => {
    mountModal()
    const element = dialog()
    expect(element).not.toBeNull()
    expect(element?.getAttribute('aria-modal')).toBe('true')
    expect(element?.textContent).toContain('Zgłoś wynik')
    expect(element?.textContent).toContain('Po zgłoszeniu wyniku nie można go edytować.')
  })

  it('tytuł jest etykietą okna', () => {
    mountModal()
    const labelId = dialog()?.getAttribute('aria-labelledby')
    expect(document.getElementById(labelId ?? '')?.textContent).toBe('Zgłoś wynik')
  })

  it('zamyka się przyciskiem X', async () => {
    const wrapper = mountModal()
    document.body.querySelector<HTMLButtonElement>('[aria-label="Zamknij"]')?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('zamyka się na Escape', () => {
    const wrapper = mountModal()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('zamyka się po kliknięciu w tło', () => {
    const wrapper = mountModal()
    document.body.querySelector<HTMLElement>('[data-testid="modal-backdrop"]')?.click()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('nie zamyka się po kliknięciu w tło, gdy closeOnBackdrop jest wyłączone', () => {
    const wrapper = mountModal(true, { closeOnBackdrop: false })
    document.body.querySelector<HTMLElement>('[data-testid="modal-backdrop"]')?.click()
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('blokuje przewijanie strony tylko gdy jest otwarty', async () => {
    const wrapper = mountModal()
    expect(document.body.style.overflow).toBe('hidden')
    await wrapper.setProps({ open: false })
    expect(document.body.style.overflow).toBe('')
  })

  it('po zamknięciu nie reaguje na Escape', async () => {
    const wrapper = mountModal()
    await wrapper.setProps({ open: false })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('pokazuje stopkę z przyciskami', () => {
    mountModal()
    expect(dialog()?.textContent).toContain('Anuluj')
  })
})
