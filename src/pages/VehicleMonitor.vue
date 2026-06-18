<template>
  <section class="dashboard">
    <header class="page-head">
      <h1>车辆实时监控</h1>
      <select v-model="filter">
        <option value="">全部车辆</option>
        <option v-for="type in vehicleTypes" :key="type" :value="type">{{ vehicleTypeLabels[type] }}</option>
      </select>
    </header>
    <div class="map-wide"><VehicleMap :vehicles="vehicle.vehicles" :filter-type="filter || undefined" /></div>
    <div class="page-grid two">
      <div class="panel chart-panel"><h2>状态分布</h2><ChargingStatusChart :data="statusAsPile" /></div>
      <div class="panel chart-panel"><h2>在线率趋势</h2><OrderTrendChart :stats="trendAsOrders" /></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ChargingStatusChart from '@/components/charts/ChargingStatusChart.vue';
import OrderTrendChart from '@/components/charts/OrderTrendChart.vue';
import VehicleMap from '@/components/charts/VehicleMap.vue';
import { PileStatus, VehicleStatus, VehicleType, vehicleTypeLabels } from '@/constants/enums';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useVehicleStore } from '@/stores/vehicleStore';

const vehicle = useVehicleStore();
const filter = ref<VehicleType | ''>('');
const vehicleTypes = Object.values(VehicleType);
const { connect } = useWebSocket();

const statusMap: Record<VehicleStatus, PileStatus> = {
  [VehicleStatus.RUNNING]: PileStatus.CHARGING,
  [VehicleStatus.PARKING]: PileStatus.IDLE,
  [VehicleStatus.FAULTY]: PileStatus.FAULTY,
  [VehicleStatus.IDLE]: PileStatus.MAINTENANCE
};
const statusAsPile = computed(() => vehicle.byStatus.map((item) => ({ status: statusMap[item.status], count: item.count })));
const trendAsOrders = computed(() => vehicle.trend.map((item) => ({
  date: item.hour,
  totalOrders: item.onlineRate,
  completedRate: 0,
  avgDistance: 0,
  avgDuration: 0,
  revenue: item.onlineRate,
  byType: []
})));

onMounted(connect);
</script>
