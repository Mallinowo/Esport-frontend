<script setup lang="ts">
import { useId } from 'vue'

const model = defineModel<boolean>({ default: false })

withDefaults(
  defineProps<{
    label: string
    disabled?: boolean
    name?: string
  }>(),
  {
    disabled: false,
  },
)

const id = useId()
</script>

<template>
  <label
    :for="id"
    class="group flex min-h-11 items-center gap-3 text-body"
    :class="disabled ? 'cursor-not-allowed text-fg-disabled' : 'cursor-pointer text-fg-primary'"
  >
    <span class="relative flex size-5 shrink-0 items-center justify-center">
      <input
        :id="id"
        v-model="model"
        type="checkbox"
        :name="name"
        :disabled="disabled"
        class="peer absolute inset-0 size-full cursor-[inherit] appearance-none rounded border-2 border-line-strong bg-surface-default transition-colors checked:border-brand-default checked:bg-brand-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus enabled:group-hover:border-fg-primary enabled:checked:group-hover:border-brand-hover enabled:checked:group-hover:bg-brand-hover disabled:border-line-default disabled:bg-surface-subtle disabled:checked:border-fg-disabled disabled:checked:bg-fg-disabled"
      />
      <svg
        class="pointer-events-none relative size-3.5 text-fg-on-brand opacity-0 peer-checked:opacity-100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
    {{ label }}
  </label>
</template>
