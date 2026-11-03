<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface AvatarProps {
  name: string
  src?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<AvatarProps>(), {
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

const initials = computed(() => {
  const words = props.name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
})

const sizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'h-6 w-6 text-caption',
  sm: 'h-8 w-8 text-caption',
  md: 'h-10 w-10 text-label',
  lg: 'h-12 w-12 text-label',
  xl: 'h-16 w-16 text-label',
}
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full"
    :class="[sizeClasses[size], showImage ? '' : 'border border-current font-semibold text-fg-muted']"
    :role="showImage ? undefined : 'img'"
    :aria-label="showImage ? undefined : name"
    data-testid="avatar"
  >
    <img
      v-if="showImage"
      :src="src ?? undefined"
      :alt="name"
      class="h-full w-full object-cover"
      loading="lazy"
      @error="failed = true"
    />
    <span v-else aria-hidden="true">{{ initials }}</span>
  </span>
</template>