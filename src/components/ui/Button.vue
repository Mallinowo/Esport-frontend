<script setup lang="ts">
import { computed, useSlots } from 'vue'
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'
const props = withDefaults(
  
defineProps<{
    
variant?: Variant
    
size?: Size
    
type?: 'button' | 'submit' | 'reset'
    
disabled?: boolean
    
loading?: boolean
  
}>(),
  
{
    
variant: 'primary',
    
size: 'md',
    
type: 'button',
    
disabled: false,
    
loading: false,
  
},
)
const slots = useSlots()
const iconOnly = computed(() => !!slots.icon && !slots.default)
const variantClasses: Record<Variant, string> = {
  
primary: 'bg-brand-default text-fg-on-brand hover:bg-brand-hover active:bg-brand-pressed',
  
secondary: 'border border-line-strong bg-surface-default text-fg-primary hover:bg-surface-subtle active:bg-brand-subtle',
  
ghost: 'text-brand-fg hover:bg-brand-subtle active:bg-brand-subtle',
  
danger: 'bg-danger-default text-fg-on-brand hover:bg-danger-hover active:bg-danger-hover',
}
const disabledClasses: Record<Variant, string> = {
  
primary: 'bg-surface-subtle text-fg-disabled',
  
secondary: 'border border-line-default bg-surface-default text-fg-disabled',
  
ghost: 'text-fg-disabled',
  
danger: 'bg-surface-subtle text-fg-disabled',
}
const sizeClasses: Record<Size, string> = {
  
sm: 'h-9 gap-2 px-4 text-label',
  
md: 'h-11 gap-2 px-5 text-label',
  
lg: 'h-13 gap-2 px-6 text-body font-bold',
}
const iconOnlySizeClasses: Record<Size, string> = {
  
sm: 'size-9',
  
md: 'size-11',
  
lg: 'size-13',
}
const classes = computed(() => [
  
'inline-flex shrink-0 items-center justify-center rounded-lg whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus',
  
iconOnly.value ? iconOnlySizeClasses[props.size] : sizeClasses[props.size],
  
props.disabled ? ['cursor-not-allowed', disabledClasses[props.variant]] : variantClasses[props.variant],
  
props.loading && 'cursor-progress',
])
</script>
<template>
  
<button :type="type" :class="classes" :disabled="disabled || loading" :aria-busy="loading || undefined">
    
<svg
      
v-if="loading"
      
class="size-4 animate-spin"
      
viewBox="0 0 24 24"
      
fill="none"
      
aria-hidden="true"
      
data-test="spinner"
    
>
      
<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.25" />
      
<path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
    
</svg>
    
<span v-else-if="slots.icon" class="flex size-4 items-center justify-center" aria-hidden="true">
      
<slot name="icon" />
    
</span>
    
<slot />
  
</button>
</template>
