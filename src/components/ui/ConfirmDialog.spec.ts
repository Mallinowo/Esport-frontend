import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import ConfirmDialog from './ConfirmDialog.vue'

function mountDialog(props = {}) {
  return mount(ConfirmDialog, {
    props: {
      open: true,
      title: 'Zgłosić wynik?',
      message: 'Po zgłoszeniu wyniku nie można go edytować.',
      ...props,
    },
    attachTo: document.body,
  })
}

function buttonWithText(text: string) {
  return Array.from(document.body.querySelectorAll<HTMLButtonElement>('[role="dialog"] button')).find(
    (button) => button.textContent?.trim() === text,
  )
}

enableAutoUnmount(afterEach)

describe('ConfirmDialog', () => {
  it('pokazuje tytuł, treść i domyślne przyciski', () => {
    mountDialog()
    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog?.textContent).toContain('Zgłosić wynik?')
    expect(dialog?.textContent).toContain('Po zgłoszeniu wyniku nie można go edytować.')
    expect(buttonWithText('Anuluj')).toBeDefined()
    expect(buttonWithText('Potwierdź')).toBeDefined()
  })

  it('używa własnych napisów na przyciskach', () => {
    mountDialog({ confirmLabel: 'Zgłoś wynik', cancelLabel: 'Wróć' })
    expect(buttonWithText('Zgłoś wynik')).toBeDefined()
    expect(buttonWithText('Wróć')).toBeDefined()
  })

  it('emituje confirm po kliknięciu potwierdzenia', () => {
    const wrapper = mountDialog()
    buttonWithText('Potwierdź')?.click()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('anulowanie zamyka okno i emituje cancel', () => {
    const wrapper = mountDialog()
    buttonWithText('Anuluj')?.click()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('Escape działa jak anulowanie', () => {
    const wrapper = mountDialog()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('domyślny wariant ma główny przycisk i fokus na potwierdzeniu', async () => {
    mountDialog()
    await flushPromises()
    expect(buttonWithText('Potwierdź')?.className).toContain('bg-brand-default')
    expect(document.activeElement).toBe(buttonWithText('Potwierdź'))
    expect(document.body.querySelector('[data-testid="confirm-danger-icon"]')).toBeNull()
  })

  it('wariant danger ma czerwony przycisk, ikonę i fokus na anulowaniu', async () => {
    mountDialog({ variant: 'danger', confirmLabel: 'Zgłoś spór' })
    await flushPromises()
    expect(buttonWithText('Zgłoś spór')?.className).toContain('bg-danger-default')
    expect(document.body.querySelector('[data-testid="confirm-danger-icon"]')).not.toBeNull()
    expect(document.activeElement).toBe(buttonWithText('Anuluj'))
  })

  it('podczas ładowania blokuje przyciski i nie daje się zamknąć', () => {
    const wrapper = mountDialog({ loading: true })
    const confirm = document.body.querySelector<HTMLButtonElement>('[role="dialog"] button[aria-busy="true"]')
    expect(confirm?.disabled).toBe(true)
    expect(buttonWithText('Anuluj')?.disabled).toBe(true)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    document.body.querySelector<HTMLElement>('[data-testid="modal-backdrop"]')?.click()
    expect(wrapper.emitted('update:open')).toBeUndefined()
    expect(wrapper.emitted('cancel')).toBeUndefined()
  })

  it('treść można podać w slocie', () => {
    mount(ConfirmDialog, {
      props: { open: true, title: 'Zgłosić spór?' },
      slots: { default: '<p>Wynik <strong>2:1</strong> trafi do administratora.</p>' },
      attachTo: document.body,
    })
    expect(document.body.querySelector('[role="dialog"] strong')?.textContent).toBe('2:1')
  })
})
