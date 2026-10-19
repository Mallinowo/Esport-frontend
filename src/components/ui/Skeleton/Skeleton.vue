<script setup lang="ts">
import { computed } from 'vue'

export interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect'
  width?: string
  height?: string
  lines?: number
  label?: string
}

const props = withDefaults(defineProps<SkeletonProps>(), {
  variant: 'text',
  width: undefined,
  height: undefined,
  lines: 1,
  label: 'Loading',
})

const lineCount = computed(() => (props.variant === 'text' ? Math.max(1, props.lines) : 1))

const shapeClass = computed(() => {
  if (props.variant === 'circle') return 'rounded-full'
  if (props.variant === 'rect') return 'rounded-md'
  return 'rounded'
})

function shapeStyle(index: number) {
  if (props.variant === 'text') {
    const isLast = lineCount.value > 1 && index === lineCount.value - 1
    return {
      width: isLast ? '60%' : (props.width ?? '100%'),
      height: props.height ?? '1em',
    }
  }
  if (props.variant === 'circle') {
    const size = props.width ?? props.height ?? '3rem'
    return { width: size, height: size }
  }
  return { width: props.width ?? '100%', height: props.height ?? '8rem' }
}
</script>

<template>
  <div role="status" class="flex flex-col gap-2">
    <span class="sr-only">{{ label }}</span>
    <div
      v-for="index in lineCount"
      :key="index"
      aria-hidden="true"
      data-testid="skeleton-shape"
      class="animate-pulse bg-slate-200 motion-reduce:animate-none"
      :class="shapeClass"
      :style="shapeStyle(index - 1)"
    />
  </div>
</template>