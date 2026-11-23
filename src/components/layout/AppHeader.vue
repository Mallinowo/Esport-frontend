<script setup lang="ts">
import type { User } from '@/api/types'
import Button from '@/components/ui/Button.vue'
import AppLogo from './AppLogo.vue'
import { initials } from './account'

withDefaults(defineProps<{ user?: User | null }>(), { user: null })

defineEmits<{ 'sign-in': [] }>()
</script>

<template>
  <header class="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-line-default bg-surface-default px-4 lg:hidden">
    <AppLogo />
    <RouterLink
      v-if="user"
      to="/profil"
      :aria-label="`Profil: ${user.name}`"
      class="flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
    >
      <img v-if="user.avatar_url" :src="user.avatar_url" alt="" class="size-8 rounded-full object-cover" />
      <span v-else class="flex size-8 items-center justify-center rounded-full bg-brand-subtle text-caption text-brand-fg">
        {{ initials(user.name) }}
      </span>
    </RouterLink>
    <Button v-else variant="secondary" size="sm" @click="$emit('sign-in')">Zaloguj się</Button>
  </header>
</template>
