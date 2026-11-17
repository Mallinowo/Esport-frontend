<script setup lang="ts">
export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'

export interface BadgeProps {
  label: string
  tone?: BadgeTone
}

withDefaults(defineProps<BadgeProps>(), {
  tone: 'neutral',
})

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'text-fg-muted',
  brand: 'text-brand-fg',
  success: 'text-success-fg',
  warning: 'text-warning-fg',
  danger: 'text-danger-fg',
  info: 'text-info-fg',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full border border-current px-2 py-0.5 font-semibold text-caption"
    :class="toneClasses[tone]"
    data-testid="badge"
  >
    <span v-if="$slots.icon" class="inline-flex h-3 w-3 shrink-0" aria-hidden="true" data-testid="badge-icon">
      <slot name="icon" />
    </span>
    <span>{{ label }}</span>
  </span>
</template>