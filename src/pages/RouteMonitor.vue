<template>
  <section class="dashboard page-grid three routes">
    <header class="page-head route-head">
      <div>
        <h1>路线监控</h1>
        <small>延误阈值：≥{{ routeStore.ROUTE_DELAY_WARNING_THRESHOLD }}分钟告警，≥{{ routeStore.ROUTE_DELAY_CRITICAL_THRESHOLD }}分钟严重告警</small>
      </div>
      <span>{{ routeStore.routes.length }} 条运营线路</span>
    </header>
    <AlertBanner v-if="routeAlerts.length" :alerts="routeAlerts" @confirm="handleConfirmAlert" />
    <aside class="panel route-list">
      <h2>线路列表</h2>
      <button
        v-for="route in routeStore.routes"
        :key="route.routeId"
        :class="[
          'route-btn',
          { active: route.routeId === routeStore.selectedRouteId },
          `delay-${routeStore.getRouteDelayLevel(route.routeId)}`
        ]"
        @click="routeStore.selectRoute(route.routeId)"
      >
        <div class="route-btn-head">
          <b>{{ route.name }}</b>
          <span v-if="routeStore.getRouteDelayLevel(route.routeId) !== 'normal'" :class="['delay-badge', routeStore.getRouteDelayLevel(route.routeId)]">
            {{ routeStore.getRouteDelayLevel(route.routeId) === 'critical' ? '严重' : '告警' }}
          </span>
        </div>
        <span :class="['delay-text', routeStore.getRouteDelayLevel(route.routeId)]">延误 {{ route.delayMinutes }} 分钟</span>
      </button>
    </aside>
    <section class="center-stage">
      <h2>{{ routeStore.selectedRoute?.name || '路线地图' }}
        <span v-if="routeStore.selectedRoute && routeStore.getRouteDelayLevel(routeStore.selectedRoute.routeId) !== 'normal'"
          :class="['status-badge', routeStore.getRouteDelayLevel(routeStore.selectedRoute.routeId)]">
          {{ routeStore.getRouteDelayLevel(routeStore.selectedRoute.routeId) === 'critical' ? '严重延误' : '延误告警' }}
        </span>
      </h2>
      <MapContainer :points="stationPoints" />
    </section>
    <aside class="stack">
      <div class="panel chart-panel"><h2>准点率</h2><SpeedGauge :value="routeStore.punctuality" name="准点率" /></div>
      <DataCard label="平均速度" :value="routeStore.selectedRoute?.avgSpeed || 0" suffix="km/h" hint="线路运行速度" />
      <DataCard label="客流负载" :value="routeStore.selectedRoute?.passengerLoad || 0" suffix="%" hint="车厢容量占用" />
      <div class="panel chart-panel tall"><h2>客流热力图</h2><PassengerHeatMap :routes="routeStore.routes" :highlight-routes="highlightRoutes" /></div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import AlertBanner from '@/components/common/AlertBanner.vue';
import MapContainer from '@/components/common/MapContainer.vue';
import DataCard from '@/components/common/DataCard.vue';
import PassengerHeatMap from '@/components/charts/PassengerHeatMap.vue';
import SpeedGauge from '@/components/charts/SpeedGauge.vue';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useRouteStore } from '@/stores/routeStore';

const routeStore = useRouteStore();
const { connect, confirmRouteAlert } = useWebSocket();

const stationPoints = computed(() => {
  const route = routeStore.selectedRoute;
  if (!route) return [];
  const level = routeStore.getRouteDelayLevel(route.routeId);
  return route.stations.map((station) => ({
    id: station.name,
    lat: station.lat,
    lng: station.lng,
    label: station.name,
    kind: 'station' as const,
    highlight: level === 'normal' ? undefined : level
  }));
});

const highlightRoutes = computed(() => routeStore.alerts
  .filter((alert) => !alert.confirmed)
  .map((alert) => ({ routeId: alert.routeId, level: alert.level }))
);

const routeAlerts = computed(() => routeStore.alerts
  .filter((alert) => !alert.confirmed)
  .map((alert) => ({
    id: alert.id,
    title: alert.routeName,
    message: alert.message,
    level: alert.level,
    time: alert.time,
    confirmed: alert.confirmed
  }))
);

function handleConfirmAlert(id: string) {
  routeStore.confirmAlert(id);
  confirmRouteAlert(id);
}

onMounted(connect);
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.route-head {
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 4px;

  h1 { font-size: clamp(24px, 2.5vw, 42px); }
  small { color: $muted; font-size: 12px; margin-top: 6px; display: block; }
  span { color: $muted; }
}

.route-list {
  display: grid;
  gap: 10px;
  align-content: start;
  max-height: 720px;
  overflow-y: auto;
}

.route-btn {
  text-align: left;
  display: grid;
  gap: 6px;
  padding: 12px 14px;
  transition: all .15s ease;

  &.delay-warning {
    border-color: rgba(242, 193, 78, .4);
    background: rgba(242, 193, 78, .08);
  }

  &.delay-critical {
    border-color: rgba(244, 109, 117, .5);
    background: rgba(244, 109, 117, .1);
    animation: pulse-critical 1.8s ease-in-out infinite;
  }

  &.active.delay-warning {
    background: rgba(242, 193, 78, .18);
    border-color: $gold;
  }

  &.active.delay-critical {
    background: rgba(244, 109, 117, .2);
    border-color: #f46d75;
  }
}

.route-btn-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.delay-badge {
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 4px;
  font-weight: 700;

  &.warning {
    color: $gold;
    background: rgba(242, 193, 78, .15);
  }

  &.critical {
    color: #f46d75;
    background: rgba(244, 109, 117, .15);
  }
}

.delay-text {
  font-size: 13px;

  &.warning { color: $gold; }
  &.critical { color: #f46d75; font-weight: 600; }
}

@keyframes pulse-critical {
  0%, 100% { box-shadow: 0 0 0 0 rgba(244, 109, 117, .25); }
  50% { box-shadow: 0 0 0 6px rgba(244, 109, 117, 0); }
}

.status-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 4px;
  margin-left: 8px;

  &.warning {
    color: $gold;
    background: rgba(242, 193, 78, .15);
  }

  &.critical {
    color: #f46d75;
    background: rgba(244, 109, 117, .15);
  }
}
</style>
