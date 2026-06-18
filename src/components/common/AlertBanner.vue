<template>
  <section class="alert-banner" v-if="alerts.length">
    <div v-for="alert in alerts.slice(0, 4)" :key="alert.id" :class="['alert-item', alert.level]">
      <span>{{ alert.time }}</span>
      <b>{{ alert.pileCode }}</b>
      <p>{{ alert.message }}</p>
      <button v-if="!alert.confirmed" @click="$emit('confirm', alert.id)">确认</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ChargingAlert } from '@/types/charging';

defineProps<{ alerts: ChargingAlert[] }>();
defineEmits<{ confirm: [id: string] }>();
</script>
