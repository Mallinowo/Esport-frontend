<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { User } from '@/api/types'
import Button from '@/components/ui/Button.vue'
import AppLogo from './AppLogo.vue'
import { initials, roleLabel } from './account'
import { navItems } from './navItems'

withDefaults(defineProps<{ user?: User | null }>(), { user: null })

defineEmits<{ 'sign-in': [] }>()

const route = useRoute()
</script>

<template>
  <aside class="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-7 border-r border-line-default bg-surface-raised px-4 py-6 lg:flex">
    <AppLogo />
    <nav aria-label="Menu główne" class="flex flex-1 flex-col gap-0.5">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :aria-current="route.meta.section === item.section ? 'page' : undefined"
        class="rounded-lg px-3 py-2.5 text-label focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
        :class="route.meta.section === item.section ? 'bg-brand-subtle text-brand-fg' : 'text-fg-secondary hover:bg-surface-subtle'"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
    <RouterLink
      v-if="user"
      to="/profil"
      class="flex items-center gap-3 rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
    >
      <img v-if="user.avatar_url" :src="user.avatar_url" alt="" class="size-8 rounded-full object-cover" />
      <span v-else class="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-caption text-brand-fg" aria-hidden="true">
        {{ initials(user.name) }}
      </span>
      <span class="flex min-w-0 flex-col">
        <span class="truncate text-label text-fg-primary">{{ user.name }}</span>
        <span class="text-caption text-fg-secondary">{{ roleLabel(user) }}</span>
      </span>
    </RouterLink>
    <Button v-else class="w-full" @click="$emit('sign-in')">Zaloguj się</Button>
  </aside>
</template>
