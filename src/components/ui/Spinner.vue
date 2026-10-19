<script setup lang="ts">
type Size = 'sm' | 'md'

withDefaults(
  defineProps<{
    size?: Size
    label?: string
  }>(),
  {
    size: 'md',
  },
)

const sizeClasses: Record<Size, string> = {
  sm: 'size-4',
  md: 'size-6',
}
</script>

<template>
  <svg
    :class="['shrink-0 animate-spin', sizeClasses[size]]"
    viewBox="0 0 24 24"
    fill="none"
    :role="label ? 'status' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    data-test="spinner"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
  </svg>
</template>
