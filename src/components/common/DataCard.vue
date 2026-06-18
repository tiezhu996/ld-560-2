<template>
  <article class="data-card">
    <p>{{ label }}</p>
    <strong><AnimatedNumber :value="value" :suffix="suffix" /></strong>
    <small>{{ hint }}</small>
  </article>
</template>

<script setup lang="ts">
import AnimatedNumber from './AnimatedNumber.vue';

defineProps<{ label: string; value: number; suffix?: string; hint: string }>();
</script>
