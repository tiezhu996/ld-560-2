<template>
  <main class="screen-shell">
    <slot />
  </main>
</template>

<script setup lang="ts">
import { useAutoResize } from '@/hooks/useAutoResize';

useAutoResize();
</script>
