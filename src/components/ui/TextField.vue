<script setup lang="ts">
import { computed, useId, useSlots } from 'vue'

type FieldType = 'text' | 'email' | 'password' | 'number'

const model = defineModel<string | number>({ default: '' })

const props = withDefaults(
  defineProps<{
    label: string
    type?: FieldType
    placeholder?: string
    error?: string
    disabled?: boolean
    name?: string
    autocomplete?: string
  }>(),
  {
    type: 'text',
    disabled: false,
  },
)

const slots = useSlots()
const id = useId()
const errorId = `${id}-error`
const hasIcon = computed(() => !!slots.icon)

const wrapperClasses = computed(() => [
  'flex h-11 items-center gap-2 rounded-lg border bg-surface-default px-4 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-line-focus',
  props.disabled
    ? 'cursor-not-allowed border-line-default bg-surface-subtle'
    : props.error
      ? 'border-danger-line'
      : 'border-line-strong hover:border-fg-primary',
])
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-label text-fg-primary">{{ label }}</label>
    <div :class="wrapperClasses">
      <span v-if="hasIcon" class="flex size-5 shrink-0 items-center justify-center text-fg-muted" aria-hidden="true">
        <slot name="icon" />
      </span>
      <input
        :id="id"
        v-model="model"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? errorId : undefined"
        class="min-w-0 flex-1 bg-transparent text-body text-fg-primary outline-none placeholder:text-fg-muted disabled:cursor-not-allowed disabled:text-fg-disabled disabled:placeholder:text-fg-disabled"
      />
    </div>
    <p v-if="error" :id="errorId" class="flex items-start gap-1.5 text-body-sm text-danger-fg">
      <svg class="mt-0.5 size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6M12 16.5v.01" />
      </svg>
      {{ error }}
    </p>
  </div>
</template>
