<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <h1 class="text-h1">Liga</h1>
  <p class="mt-1 text-body text-fg-secondary">Tabela i terminarz ligi {{ id }}.</p>
</template>
