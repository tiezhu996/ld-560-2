<template>
  <ScreenAdapter>
    <nav class="top-nav">
      <RouterLink v-for="item in navItems" :key="item.path" :to="item.path">
        {{ item.label }}
      </RouterLink>
    </nav>
    <RouterView />
  </ScreenAdapter>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import ScreenAdapter from '@/components/common/ScreenAdapter.vue';

const navItems = [
  { path: '/', label: '总览' },
  { path: '/vehicles', label: '车辆' },
  { path: '/charging', label: '充电' },
  { path: '/routes', label: '路线' },
  { path: '/orders', label: '订单' }
];
</script>
