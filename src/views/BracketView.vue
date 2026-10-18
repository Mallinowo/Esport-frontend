<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <h1 class="text-h1">Drabinka</h1>
  <p class="mt-1 text-body text-fg-secondary">Drabinka turnieju {{ id }}.</p>
</template>
