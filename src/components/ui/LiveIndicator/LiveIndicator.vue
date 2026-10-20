<script setup lang="ts">
import { computed } from 'vue'

export interface LiveIndicatorProps {
  size?: 'sm' | 'md'
  status?: 'live' | 'offline'
  label?: string
}

const props = withDefaults(defineProps<LiveIndicatorProps>(), {
  size: 'md',
  status: 'live',
  label: undefined,
})

const isLive = computed(() => props.status === 'live')

const text = computed(() => props.label ?? (isLive.value ? 'Live' : 'Offline'))

const textClasses = computed(() => [
  props.size === 'sm' ? 'text-xs' : 'text-sm',
  isLive.value ? 'text-red-700' : 'text-slate-700',
])

const dotClasses = computed(() => [
  props.size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
  isLive.value ? 'bg-red-600 animate-pulse motion-reduce:animate-none' : 'bg-slate-500',
])
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wide"
    :class="textClasses"
    data-testid="live-indicator"
  >
    <span class="rounded-full" :class="dotClasses" aria-hidden="true" data-testid="live-dot" />
    <span>{{ text }}</span>
  </span>
</template>