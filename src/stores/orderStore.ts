import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { OrderStats } from '@/types/order';
import { createOrderStream } from '@/mock/orderMock';

export const useOrderStore = defineStore('orders', () => {
  const stats = ref<OrderStats[]>([]);
  const stream = ref(createOrderStream());

  const latest = computed(() => stats.value[stats.value.length - 1]);
  const totalRevenue = computed(() => stats.value.reduce((sum, item) => sum + item.revenue, 0));

  function setStats(payload: OrderStats[]) {
    stats.value = payload;
    stream.value = [...createOrderStream(1), ...stream.value].slice(0, 30);
  }

  return { stats, stream, latest, totalRevenue, setStats };
});
