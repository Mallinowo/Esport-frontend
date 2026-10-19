<script setup lang="ts">
import { computed } from 'vue'

export interface EmptyStateProps {
  title: string
  description?: string
  headingLevel?: 2 | 3 | 4
}

const props = withDefaults(defineProps<EmptyStateProps>(), {
  description: undefined,
  headingLevel: 2,
})

const headingTag = computed(() => `h${props.headingLevel}`)
</script>

<template>
  <section class="flex flex-col items-center gap-3 px-4 py-10 text-center">
    <div v-if="$slots.icon" class="text-slate-600" aria-hidden="true">
      <slot name="icon" />
    </div>
    <component :is="headingTag" class="text-lg font-semibold text-slate-900">
      {{ title }}
    </component>
    <p v-if="description" class="max-w-md text-sm text-slate-700">
      {{ description }}
    </p>
    <div v-if="$slots.actions" class="mt-2 flex flex-wrap justify-center gap-2">
      <slot name="actions" />
    </div>
  </section>
</template>
