<script setup lang="ts">
import { computed, useSlots } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
  },
)

const slots = useSlots()
const iconOnly = computed(() => !!slots.icon && !slots.default)

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-default text-fg-on-brand hover:bg-brand-hover active:bg-brand-pressed',
  secondary: 'border border-line-strong bg-surface-default text-fg-primary hover:bg-surface-subtle active:bg-surface-raised',
  ghost: 'text-fg-primary hover:bg-surface-subtle active:bg-surface-raised',
  danger: 'bg-danger-default text-fg-on-brand hover:bg-danger-hover active:bg-danger-hover',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 gap-1.5 px-3 text-caption',
  md: 'h-10 gap-2 px-4 text-label',
  lg: 'h-12 gap-2 px-5 text-body font-bold',
}

const iconOnlySizeClasses: Record<Size, string> = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
}

const classes = computed(() => [
  'inline-flex shrink-0 items-center justify-center rounded-lg whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus',
  iconOnly.value ? iconOnlySizeClasses[props.size] : sizeClasses[props.size],
  props.disabled
    ? 'cursor-not-allowed bg-surface-subtle text-fg-disabled'
    : variantClasses[props.variant],
  props.loading && 'cursor-progress',
])
</script>

<template>
  <button :type="type" :class="classes" :disabled="disabled || loading" :aria-busy="loading || undefined">
    <svg
      v-if="loading"
      class="size-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      data-test="spinner"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
    </svg>
    <span v-else-if="slots.icon" class="flex size-4 items-center justify-center" aria-hidden="true">
      <slot name="icon" />
    </span>
    <slot />
  </button>
</template>
