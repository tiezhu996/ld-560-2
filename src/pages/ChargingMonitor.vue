<template>
  <section class="dashboard">
    <header class="page-head"><h1>充电桩监控</h1><span>{{ charging.piles.length }} 个站点终端</span></header>
    <AlertBanner :alerts="charging.alerts" @confirm="charging.confirmAlert" />
    <div class="page-grid three">
      <DataCard label="今日收入" :value="charging.todayRevenue" hint="元，实时估算" />
      <DataCard label="排队车辆" :value="queueTotal" hint="全市等待充电" />
      <DataCard label="利用率" :value="charging.utilization" suffix="%" hint="充电中占比" />
    </div>
    <div class="page-grid two">
      <div class="panel chart-panel"><h2>利用率仪表盘</h2><SpeedGauge :value="charging.utilization" name="利用率" /></div>
      <div class="panel chart-panel"><h2>排队趋势</h2><OrderTrendChart :stats="queueAsOrders" /></div>
    </div>
    <div class="panel chart-panel tall"><h2>收入趋势面积图</h2><OrderTrendChart :stats="revenueAsOrders" mode="revenue" /></div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import AlertBanner from '@/components/common/AlertBanner.vue';
import DataCard from '@/components/common/DataCard.vue';
import OrderTrendChart from '@/components/charts/OrderTrendChart.vue';
import SpeedGauge from '@/components/charts/SpeedGauge.vue';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useChargingStore } from '@/stores/chargingStore';

const charging = useChargingStore();
const { connect } = useWebSocket();
const queueTotal = computed(() => charging.piles.reduce((sum, item) => sum + item.queueCount, 0));
const queueAsOrders = computed(() => charging.queueTrend.map((item) => ({ date: item.label, totalOrders: item.value, completedRate: 0, avgDistance: 0, avgDuration: 0, revenue: item.value, byType: [] })));
const revenueAsOrders = computed(() => charging.queueTrend.map((item, index) => ({ date: item.label, totalOrders: item.value, completedRate: 0, avgDistance: 0, avgDuration: 0, revenue: charging.todayRevenue * (0.45 + index / 20), byType: [] })));

onMounted(connect);
</script>
