<template>
  <section class="dashboard page-grid three routes">
    <aside class="panel route-list">
      <h1>路线监控</h1>
      <button v-for="route in routeStore.routes" :key="route.routeId" :class="{ active: route.routeId === routeStore.selectedRouteId }" @click="routeStore.selectRoute(route.routeId)">
        <b>{{ route.name }}</b><span>延误 {{ route.delayMinutes }} 分钟</span>
      </button>
    </aside>
    <section class="center-stage">
      <h2>{{ routeStore.selectedRoute?.name || '路线地图' }}</h2>
      <MapContainer :points="stationPoints" />
    </section>
    <aside class="stack">
      <div class="panel chart-panel"><h2>准点率</h2><SpeedGauge :value="routeStore.punctuality" name="准点率" /></div>
      <DataCard label="平均速度" :value="routeStore.selectedRoute?.avgSpeed || 0" suffix="km/h" hint="线路运行速度" />
      <DataCard label="客流负载" :value="routeStore.selectedRoute?.passengerLoad || 0" suffix="%" hint="车厢容量占用" />
      <div class="panel chart-panel tall"><h2>客流热力图</h2><PassengerHeatMap :routes="routeStore.routes" /></div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import MapContainer from '@/components/common/MapContainer.vue';
import DataCard from '@/components/common/DataCard.vue';
import PassengerHeatMap from '@/components/charts/PassengerHeatMap.vue';
import SpeedGauge from '@/components/charts/SpeedGauge.vue';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useRouteStore } from '@/stores/routeStore';

const routeStore = useRouteStore();
const { connect } = useWebSocket();
const stationPoints = computed(() => (routeStore.selectedRoute?.stations || []).map((station) => ({
  id: station.name,
  lat: station.lat,
  lng: station.lng,
  label: station.name,
  kind: 'station' as const
})));

onMounted(connect);
</script>
