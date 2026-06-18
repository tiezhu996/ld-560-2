import { VehicleType } from '@/constants/enums';
import type { RouteDelayAlert, RouteMonitor } from '@/types/route';
import { createVehicles } from '@/mock/vehicleMock';

export const ROUTE_DELAY_WARNING_THRESHOLD = 5;
export const ROUTE_DELAY_CRITICAL_THRESHOLD = 8;

const names = ['申城 01 号线', '浦江快线', '虹桥通勤环线', '张江创新线', '滨江夜航线'];

export function createRoutes(): RouteMonitor[] {
  return names.map((name, index) => ({
    routeId: `route-${index + 1}`,
    name,
    vehicles: createVehicles(8 + index).map((vehicle) => ({ ...vehicle, type: VehicleType.BUS })),
    avgSpeed: Math.round(26 + Math.random() * 18),
    passengerLoad: Math.round(45 + Math.random() * 48),
    delayMinutes: Math.round(Math.random() * 9),
    stations: Array.from({ length: 7 }, (_, stationIndex) => ({
      name: `${name}-${stationIndex + 1}站`,
      lat: 31.15 + index * 0.018 + stationIndex * 0.012,
      lng: 121.35 + index * 0.024 + stationIndex * 0.018
    }))
  }));
}

export function updateRoutes(source: RouteMonitor[]): RouteMonitor[] {
  return source.map((route) => ({
    ...route,
    avgSpeed: Math.round(Math.max(12, route.avgSpeed + (Math.random() - 0.5) * 6)),
    passengerLoad: Math.round(Math.min(99, Math.max(20, route.passengerLoad + (Math.random() - 0.45) * 10))),
    delayMinutes: Math.round(Math.max(0, route.delayMinutes + (Math.random() - 0.55) * 3))
  }));
}

export function createRouteDelayAlerts(routes: RouteMonitor[], confirmedIds: Set<string> = new Set()): RouteDelayAlert[] {
  return routes
    .filter((route) => route.delayMinutes >= ROUTE_DELAY_WARNING_THRESHOLD)
    .map((route) => ({
      id: `route-alert-${route.routeId}`,
      routeId: route.routeId,
      routeName: route.name,
      delayMinutes: route.delayMinutes,
      level: route.delayMinutes >= ROUTE_DELAY_CRITICAL_THRESHOLD ? 'critical' : 'warning',
      message: route.delayMinutes >= ROUTE_DELAY_CRITICAL_THRESHOLD
        ? `线路严重延误 ${route.delayMinutes} 分钟，建议调度支援`
        : `线路延误 ${route.delayMinutes} 分钟，请注意跟踪`,
      time: new Date().toLocaleTimeString(),
      confirmed: confirmedIds.has(`route-alert-${route.routeId}`)
    }));
}
