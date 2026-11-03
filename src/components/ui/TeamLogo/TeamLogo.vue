<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface TeamLogoProps {
  name: string
  shortName?: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<TeamLogoProps>(), {
  shortName: undefined,
  src: null,
  size: 'md',
})

const failed = ref(false)

watch(
  () => props.src,
  () => {
    failed.value = false
  },
)

const showImage = computed(() => Boolean(props.src) && !failed.value)

const fallbackText = computed(() => {
  const source = (props.shortName ?? props.name).trim()
  return source ? source.slice(0, 3).toUpperCase() : '?'
})

const sizeClasses: Record<NonNullable<TeamLogoProps['size']>, string> = {
  sm: 'h-8 w-8 text-caption',
  md: 'h-12 w-12 text-label',
  lg: 'h-16 w-16 text-label',
}
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md"
    :class="[sizeClasses[size], showImage ? '' : 'border border-current font-semibold text-fg-muted']"
    :role="showImage ? undefined : 'img'"
    :aria-label="showImage ? undefined : name"
    data-testid="team-logo"
  >
    <img
      v-if="showImage"
      :src="src ?? undefined"
      :alt="name"
      class="h-full w-full object-contain"
      loading="lazy"
      @error="failed = true"
    />
    <span v-else aria-hidden="true">{{ fallbackText }}</span>
  </span>
</template>