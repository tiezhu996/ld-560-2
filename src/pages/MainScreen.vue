<template>
  <section class="dashboard page-grid three">
    <aside class="stack">
      <h1>TransitDashboard</h1>
      <AlertBanner :alerts="charging.alerts" @confirm="charging.confirmAlert" />
      <DataCard label="在线车辆" :value="vehicle.runningCount" hint="Mock WebSocket 每秒刷新" />
      <DataCard label="故障车辆" :value="vehicle.faultyCount" hint="统一车辆状态枚举" />
      <div class="panel">
        <h2>车辆类型</h2>
        <div class="row" v-for="item in vehicle.byType" :key="item.type">
          <span>{{ vehicleTypeLabels[item.type] }}</span><b>{{ item.count }}</b>
        </div>
      </div>
      <div class="panel chart-panel">
        <h2>充电桩状态</h2>
        <ChargingStatusChart :data="charging.byStatus" />
      </div>
    </aside>
    <section class="center-stage">
      <h2>城市交通地理态势</h2>
      <VehicleMap :vehicles="vehicle.vehicles" />
    </section>
    <aside class="stack">
      <DataCard label="今日订单" :value="orders.latest?.totalOrders || 0" hint="全域出行请求" />
      <DataCard label="今日收入" :value="orders.latest?.revenue || 0" hint="元，实时滚动" />
      <DataCard label="充电收入" :value="charging.todayRevenue" hint="元，按用电量估算" />
      <div class="panel chart-panel tall">
        <h2>订单趋势</h2>
        <OrderTrendChart :stats="orders.stats" />
      </div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AlertBanner from '@/components/common/AlertBanner.vue';
import DataCard from '@/components/common/DataCard.vue';
import ChargingStatusChart from '@/components/charts/ChargingStatusChart.vue';
import OrderTrendChart from '@/components/charts/OrderTrendChart.vue';
import VehicleMap from '@/components/charts/VehicleMap.vue';
import { vehicleTypeLabels } from '@/constants/enums';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useChargingStore } from '@/stores/chargingStore';
import { useOrderStore } from '@/stores/orderStore';
import { useVehicleStore } from '@/stores/vehicleStore';

const vehicle = useVehicleStore();
const charging = useChargingStore();
const orders = useOrderStore();
const { connect } = useWebSocket();

onMounted(connect);
</script>
