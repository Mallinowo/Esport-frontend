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

const text = computed(() => props.label ?? (isLive.value ? 'NA ŻYWO' : 'OFFLINE'))

const textClasses = computed(() => [
  props.size === 'sm' ? 'text-caption' : 'text-label',
  isLive.value ? 'text-danger-fg' : 'text-fg-muted',
])

const dotClasses = computed(() => [
  props.size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
  isLive.value ? 'bg-danger-default animate-pulse motion-reduce:animate-none' : 'bg-fg-muted',
])
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 font-semibold tracking-wide"
    :class="textClasses"
    data-testid="live-indicator"
  >
    <span class="rounded-full" :class="dotClasses" aria-hidden="true" data-testid="live-dot" />
    <span>{{ text }}</span>
  </span>
</template>