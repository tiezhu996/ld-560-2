import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { PileStatus } from '@/constants/enums';
import type { ChargingAlert, ChargingPileLive } from '@/types/charging';
import { createQueueTrend } from '@/mock/chargingMock';
import { recordAuditLog } from '@/utils/audit-log';

export const useChargingStore = defineStore('charging', () => {
  const piles = ref<ChargingPileLive[]>([]);
  const alerts = ref<ChargingAlert[]>([]);
  const queueTrend = ref(createQueueTrend());

  const byStatus = computed(() => Object.values(PileStatus).map((status) => ({
    status,
    count: piles.value.filter((item) => item.status === status).length
  })));

  const utilization = computed(() => {
    if (!piles.value.length) return 0;
    return Math.round((piles.value.filter((item) => item.status === PileStatus.CHARGING).length / piles.value.length) * 100);
  });

  const todayRevenue = computed(() => piles.value.reduce((sum, item) => sum + item.todayUsage * 1.18, 0));

  function setCharging(payload: { piles: ChargingPileLive[]; alerts: ChargingAlert[] }) {
    piles.value = payload.piles;
    alerts.value = payload.alerts;
  }

  function confirmAlert(id: string) {
    alerts.value = alerts.value.map((item) => item.id === id ? { ...item, confirmed: true } : item);
    recordAuditLog('alert', `确认告警 ${id}`);
  }

  return { piles, alerts, queueTrend, byStatus, utilization, todayRevenue, setCharging, confirmAlert };
});
