<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppLogo from './AppLogo.vue'
import { navItems } from './navItems'

const route = useRoute()
</script>

<template>
  <aside class="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-7 border-r border-line-default bg-surface-raised px-4 py-6 lg:flex">
    <AppLogo />
    <nav aria-label="Menu główne" class="flex flex-col gap-0.5">
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
  </aside>
</template>
