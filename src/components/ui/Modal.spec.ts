import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import Modal from './Modal.vue'

function mountModal(open = true, props = {}) {
  return mount(Modal, {
    props: { title: 'Zgłoś wynik', open, ...props },
    slots: {
      default: 'Po zgłoszeniu wyniku nie można go edytować.',
      footer: '<button type="button">Anuluj</button><button type="button">Zgłoś</button>',
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

  it('po otwarciu przenosi fokus do okna', async () => {
    mountModal()
    await flushPromises()
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Zamknij')
  })

  it('ustawia fokus na elemencie z autofocus', async () => {
    mount(Modal, {
      props: { title: 'Zgłoś wynik', open: true },
      slots: { footer: '<button type="button">Anuluj</button><button type="button" autofocus>Zgłoś</button>' },
      attachTo: document.body,
    })
    await flushPromises()
    expect(document.activeElement?.textContent).toBe('Zgłoś')
  })

  it('Tab na ostatnim przycisku wraca na pierwszy', async () => {
    mountModal()
    await flushPromises()
    const buttons = dialog()?.querySelectorAll<HTMLButtonElement>('button') ?? []
    buttons[buttons.length - 1].focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true }))
    expect(document.activeElement).toBe(buttons[0])
  })

  it('Shift+Tab na pierwszym przycisku przechodzi na ostatni', async () => {
    mountModal()
    await flushPromises()
    const buttons = dialog()?.querySelectorAll<HTMLButtonElement>('button') ?? []
    buttons[0].focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true }))
    expect(document.activeElement).toBe(buttons[buttons.length - 1])
  })

  it('Tab w środku okna nie jest blokowany', async () => {
    mountModal()
    await flushPromises()
    const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true })
    document.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
  })

  it('po zamknięciu oddaje fokus przyciskowi, który otworzył okno', async () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()
    const wrapper = mountModal(false)
    await wrapper.setProps({ open: true })
    await flushPromises()
    expect(document.activeElement).not.toBe(trigger)
    await wrapper.setProps({ open: false })
    expect(document.activeElement).toBe(trigger)
    trigger.remove()
  })
})
