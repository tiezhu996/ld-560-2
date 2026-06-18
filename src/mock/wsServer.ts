import type { ChargingAlert, ChargingPileLive } from '@/types/charging';
import type { OrderStats } from '@/types/order';
import type { RouteDelayAlert, RouteMonitor } from '@/types/route';
import type { VehicleLive } from '@/types/vehicle';
import { createChargingAlerts, createChargingPiles, updateChargingPiles } from './chargingMock';
import { createOrderStats, updateOrderStats } from './orderMock';
import { createRouteDelayAlerts, createRoutes, updateRoutes } from './routeMock';
import { createVehicles, updateVehicles } from './vehicleMock';

export type MockMessage =
  | { topic: 'vehicles'; payload: VehicleLive[] }
  | { topic: 'charging'; payload: { piles: ChargingPileLive[]; alerts: ChargingAlert[] } }
  | { topic: 'orders'; payload: OrderStats[] }
  | { topic: 'routes'; payload: { routes: RouteMonitor[]; alerts: RouteDelayAlert[] } };

export class MockWebSocketServer {
  private vehicles = createVehicles();
  private piles = createChargingPiles();
  private orders = createOrderStats();
  private routes = createRoutes();
  private confirmedRouteAlertIds = new Set<string>();
  private timers: number[] = [];

  connect(onMessage: (message: MockMessage) => void, onError: (message: string) => void) {
    onMessage({ topic: 'vehicles', payload: this.vehicles });
    onMessage({ topic: 'charging', payload: { piles: this.piles, alerts: createChargingAlerts(this.piles) } });
    onMessage({ topic: 'orders', payload: this.orders });
    onMessage({ topic: 'routes', payload: { routes: this.routes, alerts: createRouteDelayAlerts(this.routes, this.confirmedRouteAlertIds) } });

    this.timers.push(window.setInterval(() => {
      this.vehicles = updateVehicles(this.vehicles);
      onMessage({ topic: 'vehicles', payload: this.vehicles });
    }, 1000));

    this.timers.push(window.setInterval(() => {
      this.piles = updateChargingPiles(this.piles);
      this.orders = updateOrderStats(this.orders);
      this.routes = updateRoutes(this.routes);
      onMessage({ topic: 'charging', payload: { piles: this.piles, alerts: createChargingAlerts(this.piles) } });
      onMessage({ topic: 'orders', payload: this.orders });
      onMessage({ topic: 'routes', payload: { routes: this.routes, alerts: createRouteDelayAlerts(this.routes, this.confirmedRouteAlertIds) } });
    }, 5000));

    this.timers.push(window.setInterval(() => {
      if (Math.random() > 0.985) onError('Mock WebSocket 抖动，已进入自动重连');
    }, 3000));
  }

  confirmRouteAlert(alertId: string) {
    this.confirmedRouteAlertIds.add(alertId);
  }

  disconnect() {
    this.timers.forEach((timer) => window.clearInterval(timer));
    this.timers = [];
  }
}
