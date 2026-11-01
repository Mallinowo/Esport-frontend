<script setup lang="ts">
import { computed } from 'vue'

export type AlertTone = 'info' | 'success' | 'warning' | 'danger'

const props = withDefaults(
  defineProps<{
    tone?: AlertTone
    title?: string
  }>(),
  {
    tone: 'info',
  },
)

const toneClasses: Record<AlertTone, string> = {
  info: 'border-info-line bg-info-bg',
  success: 'border-success-line bg-success-bg',
  warning: 'border-warning-line bg-warning-bg',
  danger: 'border-danger-line bg-danger-bg',
}

const iconClasses: Record<AlertTone, string> = {
  info: 'text-info-fg',
  success: 'text-success-fg',
  warning: 'text-warning-fg',
  danger: 'text-danger-fg',
}

const iconPaths: Record<AlertTone, string[]> = {
  info: ['M12 16v-4', 'M12 8h.01'],
  success: ['m8 12 3 3 5-6'],
  warning: ['M12 8v4', 'M12 16h.01'],
  danger: ['m15 9-6 6', 'm9 9 6 6'],
}

const role = computed(() => (props.tone === 'danger' || props.tone === 'warning' ? 'alert' : 'status'))
</script>

<template>
  <div :role="role" class="flex gap-3 rounded-lg border p-4 text-fg-primary" :class="toneClasses[tone]">
    <svg
      class="size-5 shrink-0"
      :class="iconClasses[tone]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      data-testid="alert-icon"
    >
      <path v-if="tone === 'warning'" d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <circle v-else cx="12" cy="12" r="10" />
      <path v-for="path in iconPaths[tone]" :key="path" :d="path" />
    </svg>
    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <p v-if="title" class="text-label">{{ title }}</p>
      <div v-if="$slots.default" class="text-body-sm text-fg-secondary" data-testid="alert-content">
        <slot />
      </div>
    </div>
  </div>
</template>
