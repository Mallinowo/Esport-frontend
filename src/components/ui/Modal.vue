<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

withDefaults(
  defineProps<{
    title: string
    closeOnBackdrop?: boolean
  }>(),
  {
    closeOnBackdrop: true,
  },
)

const open = defineModel<boolean>('open', { required: true })

const id = useId()
const dialog = ref<HTMLElement | null>(null)
let opener: HTMLElement | null = null

const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function focusableElements() {
  return Array.from(dialog.value?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])
}

function trapFocus(event: KeyboardEvent) {
  const elements = focusableElements()
  if (elements.length === 0) {
    event.preventDefault()
    dialog.value?.focus()
    return
  }
  const first = elements[0]
  const last = elements[elements.length - 1]
  const active = document.activeElement
  const inside = dialog.value?.contains(active)
  if (event.shiftKey && (active === first || !inside)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && (active === last || !inside)) {
    event.preventDefault()
    first.focus()
  }
}

async function focusInside() {
  await nextTick()
  const preferred = dialog.value?.querySelector<HTMLElement>('[autofocus]')
  ;(preferred ?? focusableElements()[0] ?? dialog.value)?.focus()
}

function close() {
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  } else if (event.key === 'Tab') {
    trapFocus(event)
  }
}

function lockScroll(locked: boolean) {
  document.body.style.overflow = locked ? 'hidden' : ''
  if (locked) document.addEventListener('keydown', onKeydown)
  else document.removeEventListener('keydown', onKeydown)
}

function toggle(isOpen: boolean, wasOpen?: boolean) {
  lockScroll(isOpen)
  if (isOpen) {
    opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    focusInside()
  } else if (wasOpen) {
    opener?.focus()
    opener = null
  }
}

watch(open, toggle, { immediate: true })

onBeforeUnmount(() => {
  lockScroll(false)
  opener?.focus()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div class="absolute inset-0 bg-surface-scrim" data-testid="modal-backdrop" @click="closeOnBackdrop && close()" />
      <div
        ref="dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${id}-title`"
        tabindex="-1"
        class="relative flex max-h-full w-full max-w-md flex-col rounded-xl border border-line-default bg-surface-default text-fg-primary shadow-xl outline-none"
      >
        <div class="flex items-start gap-3 p-6 pb-4">
          <h2 :id="`${id}-title`" class="min-w-0 flex-1 text-h3">{{ title }}</h2>
          <button
            type="button"
            aria-label="Zamknij"
            class="-m-2 flex size-9 shrink-0 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-subtle hover:text-fg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
            @click="close"
          >
            <svg
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div class="overflow-y-auto px-6 pb-6 text-body-sm text-fg-secondary">
          <slot />
        </div>
        <div v-if="$slots.footer" class="flex flex-col-reverse gap-2 border-t border-line-default px-6 py-4 sm:flex-row sm:justify-end">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
