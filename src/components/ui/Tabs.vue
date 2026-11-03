<script setup lang="ts">
import { useId } from 'vue'

export interface TabItem {
  value: string
  label: string
  disabled?: boolean
}

defineProps<{
  tabs: TabItem[]
  label: string
}>()

const model = defineModel<string>({ required: true })

const id = useId()

function select(tab: TabItem) {
  if (!tab.disabled) model.value = tab.value
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="overflow-x-auto border-b border-line-default [scrollbar-width:none]">
      <div role="tablist" :aria-label="label" class="flex min-w-max gap-1">
        <button
          v-for="tab in tabs"
          :id="`${id}-tab-${tab.value}`"
          :key="tab.value"
          type="button"
          role="tab"
          :aria-selected="tab.value === model"
          :aria-controls="`${id}-panel`"
          :disabled="tab.disabled"
          class="-mb-px h-11 shrink-0 whitespace-nowrap border-b-2 px-4 text-label transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-line-focus disabled:cursor-not-allowed disabled:text-fg-disabled"
          :class="tab.value === model ? 'border-brand-default text-brand-fg' : 'border-transparent text-fg-secondary hover:border-line-strong hover:text-fg-primary'"
          @click="select(tab)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    <div v-if="$slots.default" :id="`${id}-panel`" role="tabpanel" :aria-labelledby="`${id}-tab-${model}`" tabindex="0" class="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus">
      <slot :active="model" />
    </div>
  </div>
</template>
