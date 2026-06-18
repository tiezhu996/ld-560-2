import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { RouteDelayAlert, RouteMonitor } from '@/types/route';
import { ROUTE_DELAY_WARNING_THRESHOLD, ROUTE_DELAY_CRITICAL_THRESHOLD } from '@/mock/routeMock';
import { recordAuditLog } from '@/utils/audit-log';

export const useRouteStore = defineStore('routes', () => {
  const routes = ref<RouteMonitor[]>([]);
  const alerts = ref<RouteDelayAlert[]>([]);
  const selectedRouteId = ref<string>('');
  const confirmedAlertIds = ref<Set<string>>(new Set());

  const selectedRoute = computed(() => routes.value.find((item) => item.routeId === selectedRouteId.value) || routes.value[0]);
  const punctuality = computed(() => selectedRoute.value ? Math.max(60, 100 - selectedRoute.value.delayMinutes * 5) : 0);

  const delayedRouteIds = computed(() => new Set(
    alerts.value
      .filter((alert) => !alert.confirmed)
      .map((alert) => alert.routeId)
  ));

  const criticalRouteIds = computed(() => new Set(
    alerts.value
      .filter((alert) => !alert.confirmed && alert.level === 'critical')
      .map((alert) => alert.routeId)
  ));

  function isRouteDelayed(routeId: string): boolean {
    return delayedRouteIds.value.has(routeId);
  }

  function isRouteCritical(routeId: string): boolean {
    return criticalRouteIds.value.has(routeId);
  }

  function getRouteDelayLevel(routeId: string): 'normal' | 'warning' | 'critical' {
    if (criticalRouteIds.value.has(routeId)) return 'critical';
    if (delayedRouteIds.value.has(routeId)) return 'warning';
    return 'normal';
  }

  function setRoutes(payload: { routes: RouteMonitor[]; alerts: RouteDelayAlert[] }) {
    routes.value = payload.routes;
    alerts.value = payload.alerts.map((alert) => ({
      ...alert,
      confirmed: confirmedAlertIds.value.has(alert.id)
    }));
    if (!selectedRouteId.value && payload.routes[0]) selectedRouteId.value = payload.routes[0].routeId;
  }

  function selectRoute(id: string) {
    selectedRouteId.value = id;
  }

  function confirmAlert(id: string) {
    confirmedAlertIds.value.add(id);
    alerts.value = alerts.value.map((item) => item.id === id ? { ...item, confirmed: true } : item);
    recordAuditLog('alert', `确认路线延误告警 ${id}`);
  }

  function clearAllConfirmedAlerts() {
    const toRemove = new Set(Array.from(confirmedAlertIds.value));
    alerts.value = alerts.value.filter((item) => !toRemove.has(item.id));
  }

  return {
    routes,
    alerts,
    selectedRouteId,
    selectedRoute,
    punctuality,
    delayedRouteIds,
    criticalRouteIds,
    isRouteDelayed,
    isRouteCritical,
    getRouteDelayLevel,
    setRoutes,
    selectRoute,
    confirmAlert,
    clearAllConfirmedAlerts,
    ROUTE_DELAY_WARNING_THRESHOLD,
    ROUTE_DELAY_CRITICAL_THRESHOLD
  };
});
