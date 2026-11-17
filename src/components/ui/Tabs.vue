<script setup lang="ts">
import { nextTick, useId } from 'vue'

export interface TabItem {
  value: string
  label: string
  disabled?: boolean
}

const props = defineProps<{
  tabs: TabItem[]
  label: string
}>()

const model = defineModel<string>({ required: true })

const id = useId()

function select(tab: TabItem) {
  if (!tab.disabled) model.value = tab.value
}

function findEnabled(start: number, step: number) {
  const count = props.tabs.length
  for (let i = 0; i < count; i++) {
    const index = (start + step * i + count) % count
    if (!props.tabs[index].disabled) return index
  }
  return -1
}

async function onKeydown(event: KeyboardEvent) {
  const current = props.tabs.findIndex((tab) => tab.value === model.value)
  let next = -1
  if (event.key === 'ArrowRight') next = findEnabled(current + 1, 1)
  else if (event.key === 'ArrowLeft') next = findEnabled(current - 1, -1)
  else if (event.key === 'Home') next = findEnabled(0, 1)
  else if (event.key === 'End') next = findEnabled(props.tabs.length - 1, -1)
  else return
  event.preventDefault()
  if (next === -1) return
  select(props.tabs[next])
  await nextTick()
  document.getElementById(`${id}-tab-${props.tabs[next].value}`)?.focus()
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="overflow-x-auto border-b border-line-default [scrollbar-width:none]">
      <div role="tablist" :aria-label="label" class="flex min-w-max gap-1" @keydown="onKeydown">
        <button
          v-for="tab in tabs"
          :id="`${id}-tab-${tab.value}`"
          :key="tab.value"
          type="button"
          role="tab"
          :aria-selected="tab.value === model"
          :aria-controls="`${id}-panel`"
          :tabindex="tab.value === model ? 0 : -1"
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
