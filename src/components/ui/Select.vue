<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue'

export type SelectValue = string | number

export interface SelectOption {
  value: SelectValue
  label: string
  disabled?: boolean
}

const model = defineModel<SelectValue | null>({ default: null })

const props = withDefaults(
  defineProps<{
    label: string
    options: SelectOption[]
    placeholder?: string
    error?: string
    disabled?: boolean
    name?: string
  }>(),
  {
    placeholder: 'Wybierz',
    disabled: false,
  },
)

const id = useId()
const listId = `${id}-list`
const errorId = `${id}-error`
const optionId = (index: number) => `${id}-option-${index}`

const open = ref(false)
const activeIndex = ref(-1)
const listRef = ref<HTMLUListElement>()

const selectedIndex = computed(() => props.options.findIndex((option) => option.value === model.value))
const selectedOption = computed(() => props.options[selectedIndex.value])

const triggerClasses = computed(() => [
  'flex h-11 w-full items-center gap-2 rounded-lg border bg-surface-default px-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus',
  props.disabled
    ? 'cursor-not-allowed border-line-default bg-surface-subtle'
    : props.error
      ? 'border-danger-line'
      : open.value
        ? 'border-line-focus'
        : 'border-line-strong hover:border-fg-primary',
])

function enabledIndexes() {
  return props.options.flatMap((option, index) => (option.disabled ? [] : [index]))
}

function scrollToActive() {
  nextTick(() => {
    listRef.value?.children[activeIndex.value]?.scrollIntoView?.({ block: 'nearest' })
  })
}

function openList() {
  if (props.disabled || open.value) return
  open.value = true
  const enabled = enabledIndexes()
  activeIndex.value = enabled.includes(selectedIndex.value) ? selectedIndex.value : (enabled[0] ?? -1)
  scrollToActive()
}

function closeList() {
  open.value = false
  activeIndex.value = -1
}

function toggleList() {
  if (open.value) closeList()
  else openList()
}

function select(index: number) {
  const option = props.options[index]
  if (!option || option.disabled) return
  model.value = option.value
  closeList()
}

function moveActive(step: 1 | -1) {
  const enabled = enabledIndexes()
  if (!enabled.length) return
  const position = enabled.indexOf(activeIndex.value)
  const next = position === -1 ? (step === 1 ? 0 : enabled.length - 1) : Math.min(Math.max(position + step, 0), enabled.length - 1)
  activeIndex.value = enabled[next]!
  scrollToActive()
}

function moveToEdge(edge: 'first' | 'last') {
  const enabled = enabledIndexes()
  if (!enabled.length) return
  activeIndex.value = edge === 'first' ? enabled[0]! : enabled[enabled.length - 1]!
  scrollToActive()
}

function jumpToLetter(letter: string) {
  const enabled = enabledIndexes()
  const start = enabled.indexOf(activeIndex.value) + 1
  const ordered = [...enabled.slice(start), ...enabled.slice(0, start)]
  const match = ordered.find((index) => props.options[index]!.label.toLowerCase().startsWith(letter.toLowerCase()))
  if (match === undefined) return
  activeIndex.value = match
  scrollToActive()
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return

  if (!open.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      openList()
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      moveActive(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      moveActive(-1)
      break
    case 'Home':
      event.preventDefault()
      moveToEdge('first')
      break
    case 'End':
      event.preventDefault()
      moveToEdge('last')
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      select(activeIndex.value)
      break
    case 'Escape':
      event.preventDefault()
      closeList()
      break
    case 'Tab':
      closeList()
      break
    default:
      if (event.key.length === 1) jumpToLetter(event.key)
  }
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :id="`${id}-label`" :for="id" class="text-label text-fg-primary">{{ label }}</label>
    <div class="relative">
      <button
        :id="id"
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-controls="listId"
        :aria-labelledby="`${id}-label ${id}`"
        :aria-activedescendant="open && activeIndex !== -1 ? optionId(activeIndex) : undefined"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? errorId : undefined"
        :disabled="disabled"
        :class="triggerClasses"
        @click="toggleList"
        @keydown="onKeydown"
        @blur="closeList"
      >
        <span
          class="min-w-0 flex-1 truncate text-body"
          :class="disabled ? 'text-fg-disabled' : selectedOption ? 'text-fg-primary' : 'text-fg-muted'"
        >
          {{ selectedOption?.label ?? placeholder }}
        </span>
        <svg
          class="size-5 shrink-0 transition-transform"
          :class="[disabled ? 'text-fg-disabled' : 'text-fg-muted', open && 'rotate-180']"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <ul
        v-show="open"
        :id="listId"
        ref="listRef"
        role="listbox"
        :aria-labelledby="`${id}-label`"
        class="absolute inset-x-0 top-full z-10 mt-1 max-h-64 overflow-y-auto rounded-lg border border-line-default bg-surface-raised py-1"
      >
        <li
          v-for="(option, index) in options"
          :id="optionId(index)"
          :key="option.value"
          role="option"
          :aria-selected="index === selectedIndex"
          :aria-disabled="option.disabled || undefined"
          class="flex items-center gap-2 px-4 py-2.5 text-body"
          :class="[
            option.disabled ? 'cursor-not-allowed text-fg-disabled' : 'cursor-pointer text-fg-primary',
            index === activeIndex && 'bg-brand-subtle',
            index === selectedIndex && 'font-bold text-brand-fg',
          ]"
          @mousedown.prevent
          @mousemove="!option.disabled && (activeIndex = index)"
          @click="select(index)"
        >
          <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
          <svg
            v-if="index === selectedIndex"
            class="size-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m5 12 5 5 9-10" />
          </svg>
        </li>
      </ul>
    </div>
    <input v-if="name" type="hidden" :name="name" :value="model ?? ''" />
    <p v-if="error" :id="errorId" class="flex items-start gap-1.5 text-body-sm text-danger-fg">
      <svg class="mt-0.5 size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6M12 16.5v.01" />
      </svg>
      {{ error }}
    </p>
  </div>
</template>
