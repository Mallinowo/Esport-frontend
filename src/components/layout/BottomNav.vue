<script setup lang="ts">
import { useRoute } from 'vue-router'
import { navItems } from './navItems'

const route = useRoute()
</script>

<template>
  <nav aria-label="Menu główne" class="fixed inset-x-0 bottom-0 z-10 grid grid-cols-4 border-t border-line-default bg-surface-default lg:hidden">
    <RouterLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      :aria-current="route.meta.section === item.section ? 'page' : undefined"
      class="flex h-14 items-center justify-center text-caption focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-line-focus"
      :class="route.meta.section === item.section ? 'font-extrabold text-brand-fg' : 'text-fg-secondary'"
    >
      {{ item.label }}
    </RouterLink>
  </nav>
</template>
