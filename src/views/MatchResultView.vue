<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <h1 class="text-h1">Zgłoszenie wyniku</h1>
  <p class="mt-1 text-body text-fg-secondary">Wynik meczu {{ id }}.</p>
</template>
