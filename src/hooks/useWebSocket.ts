import { onBeforeUnmount, ref } from 'vue';
import { useChargingStore } from '@/stores/chargingStore';
import { useOrderStore } from '@/stores/orderStore';
import { useRouteStore } from '@/stores/routeStore';
import { useVehicleStore } from '@/stores/vehicleStore';
import { MockWebSocketServer, type MockMessage } from '@/mock/wsServer';
import { recordAuditLog } from '@/utils/audit-log';

export function useWebSocket() {
  const status = ref<'idle' | 'connected' | 'reconnecting' | 'closed'>('idle');
  const error = ref('');
  const server = new MockWebSocketServer();
  const vehicleStore = useVehicleStore();
  const chargingStore = useChargingStore();
  const orderStore = useOrderStore();
  const routeStore = useRouteStore();
  let reconnectTimer = 0;

  function dispatch(message: MockMessage) {
    if (message.topic === 'vehicles') vehicleStore.setVehicles(message.payload);
    if (message.topic === 'charging') chargingStore.setCharging(message.payload);
    if (message.topic === 'orders') orderStore.setStats(message.payload);
    if (message.topic === 'routes') routeStore.setRoutes(message.payload);
  }

  function connect() {
    server.disconnect();
    status.value = 'connected';
    error.value = '';
    recordAuditLog('ws', 'Mock WebSocket 已连接');
    server.connect(dispatch, (message) => {
      error.value = message;
      status.value = 'reconnecting';
      recordAuditLog('ws', message);
      window.clearTimeout(reconnectTimer);
      reconnectTimer = window.setTimeout(connect, 1000);
    });
  }

  function disconnect() {
    server.disconnect();
    status.value = 'closed';
    recordAuditLog('ws', 'Mock WebSocket 已断开');
  }

  onBeforeUnmount(disconnect);

  return { status, error, connect, disconnect };
}
