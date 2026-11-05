<script setup lang="ts">
import Button from './Button.vue'
import Modal from './Modal.vue'

export type ConfirmDialogVariant = 'default' | 'danger'

const props = withDefaults(
  defineProps<{
    title: string
    message?: string
    variant?: ConfirmDialogVariant
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
  }>(),
  {
    variant: 'default',
    confirmLabel: 'Potwierdź',
    cancelLabel: 'Anuluj',
    loading: false,
  },
)

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function onOpenChange(value: boolean) {
  if (props.loading) return
  if (!value) emit('cancel')
  open.value = value
}

function cancel() {
  onOpenChange(false)
}
</script>

<template>
  <Modal :open="open" :title="title" :close-on-backdrop="!loading" @update:open="onOpenChange">
    <div class="flex gap-3">
      <svg
        v-if="variant === 'danger'"
        class="size-5 shrink-0 text-danger-fg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        data-testid="confirm-danger-icon"
      >
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
      <div class="min-w-0 flex-1">
        <slot>
          <p>{{ message }}</p>
        </slot>
      </div>
    </div>
    <template #footer>
      <Button variant="secondary" :disabled="loading" :autofocus="variant === 'danger'" @click="cancel">{{ cancelLabel }}</Button>
      <Button :variant="variant === 'danger' ? 'danger' : 'primary'" :loading="loading" :autofocus="variant !== 'danger'" @click="emit('confirm')">
        {{ confirmLabel }}
      </Button>
    </template>
  </Modal>
</template>
