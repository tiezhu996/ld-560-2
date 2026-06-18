import { createRouter, createWebHistory } from 'vue-router';
import MainScreen from '@/pages/MainScreen.vue';
import VehicleMonitor from '@/pages/VehicleMonitor.vue';
import ChargingMonitor from '@/pages/ChargingMonitor.vue';
import RouteMonitor from '@/pages/RouteMonitor.vue';
import OrderAnalysis from '@/pages/OrderAnalysis.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: MainScreen },
    { path: '/vehicles', component: VehicleMonitor },
    { path: '/charging', component: ChargingMonitor },
    { path: '/routes', component: RouteMonitor },
    { path: '/orders', component: OrderAnalysis }
  ]
});
