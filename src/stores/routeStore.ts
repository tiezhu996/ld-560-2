import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { RouteMonitor } from '@/types/route';

export const useRouteStore = defineStore('routes', () => {
  const routes = ref<RouteMonitor[]>([]);
  const selectedRouteId = ref<string>('');

  const selectedRoute = computed(() => routes.value.find((item) => item.routeId === selectedRouteId.value) || routes.value[0]);
  const punctuality = computed(() => selectedRoute.value ? Math.max(60, 100 - selectedRoute.value.delayMinutes * 5) : 0);

  function setRoutes(payload: RouteMonitor[]) {
    routes.value = payload;
    if (!selectedRouteId.value && payload[0]) selectedRouteId.value = payload[0].routeId;
  }

  function selectRoute(id: string) {
    selectedRouteId.value = id;
  }

  return { routes, selectedRouteId, selectedRoute, punctuality, setRoutes, selectRoute };
});
