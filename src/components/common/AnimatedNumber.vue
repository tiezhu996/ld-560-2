<template>
  <span>{{ display }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatNumber } from '@/utils/format';

const props = defineProps<{ value: number; suffix?: string }>();
const display = computed(() => `${formatNumber(props.value)}${props.suffix || ''}`);
</script>
