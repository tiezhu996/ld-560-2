<template>
  <section class="dashboard">
    <header class="page-head">
      <h1>订单分析</h1>
      <div class="segmented"><button v-for="item in modes" :key="item" :class="{ active: mode === item }" @click="mode = item">{{ item }}</button></div>
    </header>
    <div class="page-grid three">
      <DataCard label="实时订单" :value="orders.latest?.totalOrders || 0" hint="今日累计单量" />
      <DataCard label="完成率" :value="Math.round((orders.latest?.completedRate || 0) * 100)" suffix="%" hint="履约闭环" />
      <DataCard label="客单收入" :value="avgRevenue" hint="元/单" />
    </div>
    <div class="page-grid three">
      <div class="panel stream">
        <h2>实时流水</h2>
        <p v-for="item in orders.stream" :key="item.id"><span>{{ item.time }}</span>{{ vehicleTypeLabels[item.type] }} {{ item.origin }} → {{ item.destination }} ¥{{ item.amount }}</p>
      </div>
      <div class="panel chart-panel"><h2>完成率仪表盘</h2><SpeedGauge :value="Math.round((orders.latest?.completedRate || 0) * 100)" name="完成率" /></div>
      <div class="panel chart-panel"><h2>订单类型玫瑰图</h2><ChargingStatusChart :data="roseData" /></div>
    </div>
    <div class="panel chart-panel tall"><h2>{{ mode }}趋势</h2><OrderTrendChart :stats="orders.stats" /></div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import DataCard from '@/components/common/DataCard.vue';
import ChargingStatusChart from '@/components/charts/ChargingStatusChart.vue';
import OrderTrendChart from '@/components/charts/OrderTrendChart.vue';
import SpeedGauge from '@/components/charts/SpeedGauge.vue';
import { PileStatus, vehicleTypeLabels } from '@/constants/enums';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useOrderStore } from '@/stores/orderStore';

const orders = useOrderStore();
const { connect } = useWebSocket();
const modes = ['日', '周', '月'];
const mode = ref('日');
const avgRevenue = computed(() => orders.latest ? Math.round(orders.latest.revenue / orders.latest.totalOrders) : 0);
const roseData = computed(() => (orders.latest?.byType || []).map((item, index) => ({
  status: Object.values(PileStatus)[index % 4],
  count: item.total
})));

onMounted(connect);
</script>
