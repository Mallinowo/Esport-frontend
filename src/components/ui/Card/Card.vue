<script setup lang="ts">
import { computed } from 'vue'

export interface CardProps {
  variant?: 'default' | 'interactive'
  selected?: boolean
  disabled?: boolean
  as?: string
}

const props = withDefaults(defineProps<CardProps>(), {
  variant: 'default',
  selected: false,
  disabled: false,
  as: 'div',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent | KeyboardEvent): void
}>()

const isInteractive = computed(() => props.variant === 'interactive')

const classes = computed(() => {
  const base = 'relative rounded-lg border bg-white text-slate-900 p-4 transition-colors'
  if (!isInteractive.value) return [base, 'border-slate-300']

  return [
    base,
    'cursor-pointer select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-700',
    props.disabled
      ? 'cursor-not-allowed opacity-50 border-slate-300'
      : props.selected
        ? 'border-indigo-700 ring-2 ring-indigo-700 bg-indigo-50'
        : 'border-slate-300 hover:border-slate-500 hover:bg-slate-50',
  ]
})

function onClick(event: MouseEvent) {
  if (!isInteractive.value || props.disabled) return
  emit('click', event)
}

function onKeydown(event: KeyboardEvent) {
  if (!isInteractive.value || props.disabled) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click', event)
  }
}
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :role="isInteractive ? 'button' : undefined"
    :tabindex="isInteractive ? (disabled ? -1 : 0) : undefined"
    :aria-pressed="isInteractive ? selected : undefined"
    :aria-disabled="isInteractive && disabled ? true : undefined"
    @click="onClick"
    @keydown="onKeydown"
  >
    <svg
      v-if="isInteractive && selected"
      class="absolute right-2 top-2 h-5 w-5 text-indigo-700"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      data-testid="card-selected-icon"
    >
      <path
        fill-rule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
        clip-rule="evenodd"
      />
    </svg>

    <div v-if="$slots.header" class="mb-3 font-semibold">
      <slot name="header" />
    </div>
    <slot />
    <div v-if="$slots.footer" class="mt-3 border-t border-slate-200 pt-3 text-sm text-slate-700">
      <slot name="footer" />
    </div>
  </component>
</template>
