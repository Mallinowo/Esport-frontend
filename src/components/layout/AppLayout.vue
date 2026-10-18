<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import BottomNav from './BottomNav.vue'
</script>

<template>
  <div class="flex min-h-screen">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <AppHeader />
      <main class="mx-auto w-full max-w-300 flex-1 px-4 pt-5 pb-20 lg:px-10 lg:py-8">
        <slot />
      </main>
    </div>
    <BottomNav />
  </div>
</template>
