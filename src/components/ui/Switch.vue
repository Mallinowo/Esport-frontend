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
    <span class="relative flex h-6 w-10 shrink-0 items-center">
      <input
        :id="id"
        v-model="model"
        type="checkbox"
        role="switch"
        :name="name"
        :disabled="disabled"
        class="peer absolute inset-0 size-full cursor-[inherit] appearance-none rounded-full border-2 border-line-strong bg-surface-subtle transition-colors checked:border-brand-default checked:bg-brand-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus enabled:group-hover:border-fg-primary enabled:checked:group-hover:border-brand-hover enabled:checked:group-hover:bg-brand-hover disabled:border-line-default disabled:bg-surface-subtle disabled:checked:border-fg-disabled disabled:checked:bg-fg-disabled"
      />
      <span
        class="pointer-events-none relative ml-1 size-4 rounded-full bg-line-strong transition-transform peer-checked:translate-x-4 peer-checked:bg-fg-on-brand peer-disabled:bg-fg-disabled peer-disabled:peer-checked:bg-surface-default"
        aria-hidden="true"
      />
    </span>
    {{ label }}
  </label>
</template>
