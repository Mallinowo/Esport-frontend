<script setup lang="ts">
import type { User } from '@/api/types'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import BottomNav from './BottomNav.vue'

withDefaults(defineProps<{ user?: User | null }>(), { user: null })

defineEmits<{ 'sign-in': [] }>()
</script>

<template>
  <div class="flex min-h-screen">
    <AppSidebar :user="user" @sign-in="$emit('sign-in')" />
    <div class="flex min-w-0 flex-1 flex-col">
      <AppHeader :user="user" @sign-in="$emit('sign-in')" />
      <main class="mx-auto w-full max-w-300 flex-1 px-4 pt-5 pb-20 lg:px-10 lg:py-8">
        <slot />
      </main>
    </div>
    <BottomNav />
  </div>
</template>
